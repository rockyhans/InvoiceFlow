import Invoice from "../models/Invoice.js";

const generateInvoiceNumber = async () => {

    const lastInvoice = await Invoice
        .findOne()
        .sort({ createdAt: -1 });

    if (!lastInvoice) {
        return "INV-0001";
    }

    const lastNumber = parseInt(
        lastInvoice.invoiceNumber.split("-")[1]
    );

    const nextNumber = lastNumber + 1;

    return `INV-${nextNumber.toString().padStart(4, "0")}`;

};

export default generateInvoiceNumber;