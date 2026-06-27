import { useEffect, useState } from "react";

import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";

import { getClients } from "../../api/clientApi";
import { getQuotes } from "../../api/quoteApi";

const InvoiceForm = ({
    initialData,
    onSubmit,
}) => {

    const [clients, setClients] = useState([]);
    const [quotes, setQuotes] = useState([]);

    const [items, setItems] = useState([
        {
            description: "",
            quantity: 1,
            price: 0,
            tax: 0,
            amount: 0,
        },
    ]);

    const [formData, setFormData] = useState({
        client: "",
        quote: "",
        issueDate: "",
        dueDate: "",
        discount: 0,
        tax: 0,
        amountPaid: 0,
        notes: "",
        status: "Draft",
    });

    // ─── Fetch Clients on Mount ───────────────────────────────
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const { data } = await getClients();
                setClients(data.data.clients);
            } catch (error) {
                console.log(error);
            }
        };

        fetchClients();
    }, []);

    // ─── Populate form when editing ───────────────────────────
    useEffect(() => {
        if (initialData) {
            setFormData({
                client: initialData.client?._id || "",
                quote: initialData.quote?._id || "",
                issueDate: initialData.issueDate?.split("T")[0] || "",
                dueDate: initialData.dueDate?.split("T")[0] || "",
                discount: initialData.discount || 0,
                tax: initialData.tax || 0,
                amountPaid: initialData.amountPaid || 0,
                notes: initialData.notes || "",
                status: initialData.status || "Draft",
            });

            if (initialData.items) {
                setItems(initialData.items);
            }
        }
    }, [initialData]);

    // ─── Fetch Quotes when Client changes ─────────────────────
    useEffect(() => {

        if (!formData.client) {
            setQuotes([]);
            return;
        }

        // Skip refetching quotes when editing existing invoice
        if (initialData && initialData.client?._id === formData.client) {
            return;
        }

        const fetchClientQuotes = async () => {
            try {
                // Fetch all quotes and filter by selected client
                const { data } = await getQuotes(1, "");
                const clientQuotes = data.data.filter(
                    (q) => q.client?._id === formData.client
                );
                setQuotes(clientQuotes);

                // Reset quote selection when client changes
                setFormData((prev) => ({ ...prev, quote: "" }));
                setItems([
                    {
                        description: "",
                        quantity: 1,
                        price: 0,
                        tax: 0,
                        amount: 0,
                    },
                ]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchClientQuotes();

    }, [formData.client]);

    // ─── Pre-fill form when Quote is selected ─────────────────
    const handleQuoteSelect = (e) => {
        const quoteId = e.target.value;

        if (!quoteId) {
            setFormData((prev) => ({ ...prev, quote: "" }));
            setItems([
                {
                    description: "",
                    quantity: 1,
                    price: 0,
                    tax: 0,
                    amount: 0,
                },
            ]);
            return;
        }

        const selectedQuote = quotes.find((q) => q._id === quoteId);

        if (selectedQuote) {
            setFormData((prev) => ({
                ...prev,
                quote: quoteId,
                issueDate: new Date().toISOString().split("T")[0],
                dueDate: selectedQuote.expiryDate?.split("T")[0] || "",
                discount: selectedQuote.discount || 0,
                tax: selectedQuote.tax || 0,
                notes: selectedQuote.notes || "",
            }));

            setItems(selectedQuote.items || []);
        }
    };

    // ─── Generic field change ─────────────────────────────────
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ─── Item field change ────────────────────────────────────
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;

        const qty = Number(updatedItems[index].quantity);
        const price = Number(updatedItems[index].price);
        const tax = Number(updatedItems[index].tax);

        updatedItems[index].amount = qty * price + tax;

        setItems(updatedItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                description: "",
                quantity: 1,
                price: 0,
                tax: 0,
                amount: 0,
            },
        ]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    // ─── Totals ───────────────────────────────────────────────
    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const total =
        subtotal
        - Number(formData.discount)
        + Number(formData.tax);

    const balanceDue = total - Number(formData.amountPaid);

    // ─── Submit ───────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            items,
            subtotal,
            total,
        });
    };

    return (

        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Client & Quote Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Client Dropdown */}
                <div>
                    <label className="block mb-1 font-medium">
                        Client
                    </label>
                    <select
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="">Select Client</option>
                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quote Dropdown — appears after client is selected */}
                <div>
                    <label className="block mb-1 font-medium">
                        Quote (Optional)
                    </label>
                    <select
                        name="quote"
                        value={formData.quote}
                        onChange={handleQuoteSelect}
                        disabled={!formData.client}
                        className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {formData.client
                                ? quotes.length > 0
                                    ? "Select Quote to auto-fill"
                                    : "No quotes for this client"
                                : "Select a client first"}
                        </option>
                        {quotes.map((quote) => (
                            <option key={quote._id} value={quote._id}>
                                {quote.quoteNumber} — ₹{quote.total}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Issue Date"
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                />
                <FormInput
                    label="Due Date"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
            </div>

            {/* Invoice Items */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Invoice Items</h2>
                    <Button type="button" onClick={addItem}>
                        + Add Item
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Tax</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItemChange(index, "description", e.target.value)
                                            }
                                            className="w-full border rounded px-2 py-2"
                                            placeholder="Description"
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(index, "quantity", e.target.value)
                                            }
                                            className="w-20 border rounded px-2 py-2"
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.price}
                                            onChange={(e) =>
                                                handleItemChange(index, "price", e.target.value)
                                            }
                                            className="w-24 border rounded px-2 py-2"
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.tax}
                                            onChange={(e) =>
                                                handleItemChange(index, "tax", e.target.value)
                                            }
                                            className="w-20 border rounded px-2 py-2"
                                        />
                                    </td>
                                    <td className="p-2 font-semibold text-center">
                                        ₹ {Number(item.amount).toFixed(2)}
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-600 hover:text-red-800 font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Notes */}
                <div>
                    <label className="block mb-2 font-medium">Notes</label>
                    <textarea
                        name="notes"
                        rows="6"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional notes..."
                        className="w-full border rounded-lg px-3 py-2 resize-none"
                    />
                </div>

                {/* Totals */}
                <div className="border rounded-lg p-5 bg-gray-50 space-y-3">

                    <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span>₹ {subtotal.toFixed(2)}</span>
                    </div>

                    <FormInput
                        label="Discount"
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Tax"
                        type="number"
                        name="tax"
                        value={formData.tax}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Amount Paid"
                        type="number"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                    />

                    {/* Status */}
                    <div>
                        <label className="block mb-2 font-medium">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <hr className="my-2" />

                    <div className="flex justify-between text-xl font-bold">
                        <span>Grand Total</span>
                        <span className="text-blue-600">₹ {total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-base font-semibold text-green-600">
                        <span>Balance Due</span>
                        <span>₹ {balanceDue.toFixed(2)}</span>
                    </div>

                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <Button type="submit">
                    {initialData ? "Update Invoice" : "Save Invoice"}
                </Button>
            </div>

        </form>
    );
};

export default InvoiceForm;