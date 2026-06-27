import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getInvoice, downloadInvoicePdf, sendInvoice } from "../../api/invoiceApi";
import { FaDownload, FaArrowLeft, FaEnvelope } from "react-icons/fa";


const InvoiceDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const [sending, setSending] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState("");

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const { data } = await getInvoice(id);
                setInvoice(data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);
            const response = await downloadInvoicePdf(id);

            // Create blob URL and trigger download
            const blob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${invoice.invoiceNumber}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log(error);
            alert("Failed to download PDF");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Card>
                    <p className="text-center py-10 text-gray-500">
                        Loading invoice...
                    </p>
                </Card>
            </DashboardLayout>
        );
    }

    if (!invoice) return null;


    // Add handler
    const handleSendToClient = async () => {
        try {
            setSending(true);
            setEmailSuccess("");
            await sendInvoice(id);
            setEmailSuccess(`Invoice sent to ${invoice.client?.email}`);
            setTimeout(() => setEmailSuccess(""), 4000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send invoice");
        } finally {
            setSending(false);
        }
    };

    return (
        <DashboardLayout>
            <Card>


                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate("/invoices")}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                    >
                        <FaArrowLeft /> Back
                    </button>

                    <div className="flex items-center gap-3">

                        {emailSuccess && (
                            <span className="text-green-600 text-sm font-medium">
                                ✓ {emailSuccess}
                            </span>
                        )}

                        <Button
                            onClick={handleSendToClient}
                            disabled={sending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <div className="flex items-center gap-2">
                                <FaEnvelope />
                                <span>{sending ? "Sending..." : "Send to Client"}</span>
                            </div>
                        </Button>

                        <Button onClick={handleDownloadPdf} disabled={downloading}>
                            <div className="flex items-center gap-2">
                                <FaDownload />
                                <span>{downloading ? "Generating..." : "Download PDF"}</span>
                            </div>
                        </Button>

                    </div>
                </div>

                <div className="border rounded-lg p-8 max-w-3xl mx-auto">

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#1e3a5f]">
                                {invoice.client?.name}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {invoice.client?.email}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {invoice.client?.phone}
                            </p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-[#1e3a5f]">
                                INVOICE
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                #{invoice.invoiceNumber}
                            </p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${invoice.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : invoice.status === "Overdue"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">
                                Issue Date:
                            </span>{" "}
                            {new Date(invoice.issueDate).toLocaleDateString("en-IN")}
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">
                                Due Date:
                            </span>{" "}
                            {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                        </div>
                    </div>

                    <table className="w-full text-sm mb-6">
                        <thead>
                            <tr className="bg-[#1e3a5f] text-white">
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-center">Qty</th>
                                <th className="p-3 text-right">Price</th>
                                <th className="p-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, i) => (
                                <tr
                                    key={i}
                                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="p-3">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                                    <td className="p-3 text-right">₹{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{invoice.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>₹{invoice.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount</span>
                                <span>-₹{invoice.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount Paid</span>
                                <span>-₹{invoice.amountPaid.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-base bg-[#1e3a5f] text-white px-3 py-2 rounded">
                                <span>Balance Due</span>
                                <span>₹{invoice.balanceDue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="mt-6 text-sm text-gray-600">
                            <p className="font-medium text-gray-800 mb-1">Notes:</p>
                            <p>{invoice.notes}</p>
                        </div>
                    )}

                </div>
            </Card>
        </DashboardLayout>
    );
};

export default InvoiceDetail;