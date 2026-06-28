import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Quote from "../models/Quote.js";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";
import Settings from "../models/Settings.js";
// import generateInvoicePdf from "../utils/generateInvoicePdf.js";
import {
    generateInvoicePdfStream,
    generateInvoicePdfBuffer,
} from "../utils/generateInvoicePdf.js";
import sendEmail from "../utils/sendEmail.js";
import PDFDocument from "pdfkit";

export const createInvoice = async (req, res) => {
    try {

        const {
            client,
            quote,
            issueDate,
            dueDate,
            items,
            discount = 0,
            tax = 0,
            amountPaid = 0,
            notes = "",
            status = "Draft",
        } = req.body;

        const existingClient = await Client.findById(client);

        if (!existingClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        if (quote) {

            const existingQuote = await Quote.findById(quote);

            if (!existingQuote) {
                return res.status(404).json({
                    success: false,
                    message: "Quote not found",
                });
            }

        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invoice must contain at least one item",
            });
        }

        let subtotal = 0;

        const invoiceItems = items.map((item) => {

            const amount =
                item.quantity *
                item.price;

            subtotal += amount;

            return {
                ...item,
                amount,
            };

        });

        const total =
            subtotal -
            Number(discount) +
            Number(tax);

        const balanceDue =
            total -
            Number(amountPaid);

        const invoiceNumber =
            await generateInvoiceNumber();

        const invoice =
            await Invoice.create({

                invoiceNumber,

                admin: req.user._id,

                client,

                quote: quote || null,

                issueDate,

                dueDate,

                items: invoiceItems,

                subtotal,

                discount,

                tax,

                total,

                amountPaid,

                balanceDue,

                notes,

                status,

            });

        return res.status(201).json({

            success: true,

            message: "Invoice created successfully",

            data: invoice,

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }
};

export const getInvoices = async (req, res) => {

    try {

        const invoices = await Invoice.find({ admin: req.user._id })  // ✅ add filter

            .populate("client")

            .populate("admin", "name email")

            .populate("quote")

            .sort({
                createdAt: -1,
            });

        return res.status(200).json({

            success: true,

            count: invoices.length,

            data: invoices,

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};

export const getInvoiceById = async (req, res) => {

    try {

        // const invoice =
        //     await Invoice.findById(req.params.id)

        //         .populate("client")

        //         .populate("admin", "name email")

        //         .populate("quote");

        // getInvoiceById
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            admin: req.user._id,   
        })
            .populate("client")
            .populate("quote");

        if (!invoice) {

            return res.status(404).json({

                success: false,

                message: "Invoice not found",

            });

        }

        return res.status(200).json({

            success: true,

            data: invoice,

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};


export const updateInvoice = async (req, res) => {

    try {

        // const invoice =
        //     await Invoice.findById(req.params.id);

        // updateInvoice
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            admin: req.user._id,  
        });

        if (!invoice) {

            return res.status(404).json({

                success: false,

                message: "Invoice not found",

            });

        }

        const {

            client,

            issueDate,

            dueDate,

            items,

            discount = invoice.discount,

            tax = invoice.tax,

            amountPaid = invoice.amountPaid,

            notes,

            status,

        } = req.body;

        if (client) {

            const existingClient =
                await Client.findById(client);

            if (!existingClient) {

                return res.status(404).json({

                    success: false,

                    message: "Client not found",

                });

            }

            invoice.client = client;

        }

        if (items) {

            let subtotal = 0;

            const updatedItems = items.map((item) => {

                const amount =
                    item.quantity *
                    item.price;

                subtotal += amount;

                return {

                    ...item,

                    amount,

                };

            });

            invoice.items = updatedItems;

            invoice.subtotal = subtotal;

            invoice.discount = discount;

            invoice.tax = tax;

            invoice.total =
                subtotal -
                Number(discount) +
                Number(tax);

            invoice.amountPaid =
                Number(amountPaid);

            invoice.balanceDue =
                invoice.total -
                Number(amountPaid);

        }

        if (issueDate)
            invoice.issueDate = issueDate;

        if (dueDate)
            invoice.dueDate = dueDate;

        if (notes !== undefined)
            invoice.notes = notes;

        if (status)
            invoice.status = status;

        await invoice.save();

        return res.status(200).json({

            success: true,

            message: "Invoice updated successfully",

            data: invoice,

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};

export const deleteInvoice = async (req, res) => {

    try {

        const invoice = await Invoice.findOne({
            _id: req.params.id,
            admin: req.user._id, 
        });

        if (!invoice) {

            return res.status(404).json({

                success: false,

                message: "Invoice not found",

            });

        }

        await invoice.deleteOne();
        return res.status(200).json({

            success: true,

            message: "Invoice deleted successfully",

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};

export const downloadInvoicePdf = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            admin: req.user._id,
        })
            .populate("client")
            .populate("quote");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        const settings = await Settings.findOne({
            admin: req.user._id,
        });

        // generateInvoicePdf(invoice, settings, res);
        generateInvoicePdfStream(invoice, settings, res); 


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate PDF",
        });
    }
};

export const sendInvoiceToClient = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            admin: req.user._id,
        })
            .populate("client")
            .populate("quote");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        const clientEmail = invoice.client?.email;

        if (!clientEmail) {
            return res.status(400).json({
                success: false,
                message: "Client has no email address",
            });
        }

        const settings = await Settings.findOne({
            admin: req.user._id,
        });

        const business = settings?.business || {};

        // const pdfBuffer = await new Promise((resolve, reject) => {
        //     const doc = new PDFDocument({ margin: 50 });
        //     const chunks = [];

        //     doc.on("data", (chunk) => chunks.push(chunk));
        //     doc.on("end", () => resolve(Buffer.concat(chunks)));
        //     doc.on("error", reject);

            

        //     generateInvoicePdf(invoice, settings, doc);
        // });

        const pdfBuffer = await generateInvoicePdfBuffer(invoice, settings);


        // ── Email HTML ──────────────────────────────────────
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

                <div style="background: #1e3a5f; padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">
                        ${business.name || "Invoice App"}
                    </h1>
                </div>

                <div style="padding: 32px; background: #f9f9f9;">
                    <p style="font-size: 16px; color: #333;">
                        Hi <strong>${invoice.client?.name}</strong>,
                    </p>

                    <p style="color: #555;">
                        You have a new invoice
                        <strong>${invoice.invoiceNumber}</strong>
                        available from
                        <strong>${business.name || "us"}</strong>.
                    </p>

                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #e0e0e0;">
                        <table style="width: 100%; font-size: 14px; color: #333;">
                            <tr>
                                <td style="padding: 6px 0; color: #777;">Invoice Number</td>
                                <td style="padding: 6px 0; text-align: right; font-weight: bold;">
                                    ${invoice.invoiceNumber}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #777;">Issue Date</td>
                                <td style="padding: 6px 0; text-align: right;">
                                    ${new Date(invoice.issueDate).toLocaleDateString("en-IN")}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #777;">Due Date</td>
                                <td style="padding: 6px 0; text-align: right;">
                                    ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                                </td>
                            </tr>
                            <tr style="border-top: 1px solid #eee;">
                                <td style="padding: 12px 0 6px; font-weight: bold; font-size: 15px;">
                                    Total Due
                                </td>
                                <td style="padding: 12px 0 6px; text-align: right; font-weight: bold; font-size: 16px; color: #1e3a5f;">
                                    ₹${invoice.balanceDue.toFixed(2)}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #555; font-size: 13px;">
                        Please find the invoice attached as a PDF.
                    </p>
                </div>

                <div style="background: #1e3a5f; padding: 16px; text-align: center;">
                    <p style="color: #aac4e0; font-size: 12px; margin: 0;">
                        Thanks for choosing ${business.name || "us"} |
                        ${business.email || ""} |
                        ${business.phone || ""}
                    </p>
                </div>

            </div>
        `;

        await sendEmail({
            to: clientEmail,
            subject: `New Invoice ${invoice.invoiceNumber} from ${business.name || "us"}`,
            html,
            attachments: [
                {
                    filename: `${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });

        return res.status(200).json({
            success: true,
            message: `Invoice sent to ${clientEmail}`,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to send invoice",
        });
    }
};