// import PDFDocument from "pdfkit";

// const generateInvoicePdf = (invoice, settings, res) => {

//     const doc = new PDFDocument({ margin: 50 });

//     const business = settings?.business || {};
//     const taxSettings = settings?.tax || {};

//     // ── Stream directly to response ─────────────────────
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${invoice.invoiceNumber}.pdf"`
//     );
//     doc.pipe(res);

//     // ── Colors ──────────────────────────────────────────
//     const DARK = "#1e3a5f";
//     const WHITE = "#ffffff";
//     const GRAY = "#f5f5f5";
//     const TEXT = "#333333";

//     // ── Header Bar ──────────────────────────────────────
//     doc.rect(0, 0, doc.page.width, 80).fill(DARK);

//     // Business name in header
//     doc
//         .fillColor(WHITE)
//         .fontSize(20)
//         .font("Helvetica-Bold")
//         .text(business.name || "Your Business", 50, 25);

//     // INVOICE label top right
//     doc
//         .fontSize(22)
//         .text("INVOICE", 0, 28, { align: "right" });

//     doc.fillColor(TEXT);

//     // ── From & Invoice Details Block ─────────────────────
//     const topY = 100;

//     // FROM block
//     doc
//         .fontSize(9)
//         .font("Helvetica-Bold")
//         .fillColor(DARK)
//         .text("From:", 50, topY);

//     doc
//         .font("Helvetica")
//         .fillColor(TEXT)
//         .fontSize(9)
//         .text(business.name || "", 50, topY + 14)
//         .text(business.address || "", 50, topY + 26)
//         .text(business.email || "", 50, topY + 38)
//         .text(business.phone || "", 50, topY + 50)
//         .text(
//             business.gstNumber ? `GST No: ${business.gstNumber}` : "",
//             50,
//             topY + 62
//         );

//     // Invoice details top right
//     const detailX = 350;
//     const labelW = 110;

//     const invoiceDetails = [
//         ["Invoice Number", invoice.invoiceNumber],
//         [
//             "Invoice Date",
//             new Date(invoice.issueDate).toLocaleDateString("en-IN"),
//         ],
//         [
//             "Due Date",
//             new Date(invoice.dueDate).toLocaleDateString("en-IN"),
//         ],
//     ];

//     invoiceDetails.forEach(([label, value], i) => {
//         const y = topY + i * 14;
//         doc
//             .font("Helvetica-Bold")
//             .fontSize(9)
//             .fillColor(TEXT)
//             .text(label, detailX, y, { width: labelW });
//         doc
//             .font("Helvetica")
//             .text(value, detailX + labelW, y);
//     });

//     // Total Due highlighted box
//     doc.rect(detailX, topY + 44, 200, 22).fill(DARK);
//     doc
//         .fillColor(WHITE)
//         .font("Helvetica-Bold")
//         .fontSize(10)
//         .text("TOTAL DUE", detailX + 6, topY + 50, { width: 90 });
//     doc.text(
//         `₹${invoice.balanceDue.toFixed(2)}`,
//         detailX + 100,
//         topY + 50,
//         { width: 94, align: "right" }
//     );
//     doc.fillColor(TEXT);

//     // ── TO Block ─────────────────────────────────────────
//     const toY = topY + 90;

//     doc
//         .font("Helvetica-Bold")
//         .fontSize(9)
//         .fillColor(DARK)
//         .text("To:", 50, toY);

//     const client = invoice.client || {};
//     doc
//         .font("Helvetica")
//         .fillColor(TEXT)
//         .fontSize(9)
//         .text(client.name || "", 50, toY + 14)
//         .text(client.address || "", 50, toY + 26)
//         .text(client.email || "", 50, toY + 38)
//         .text(client.phone || "", 50, toY + 50);

//     // ── Items Table ──────────────────────────────────────
//     const tableTop = toY + 80;
//     const colX = {
//         qty: 50,
//         desc: 90,
//         rate: 370,
//         subtotal: 460,
//     };

//     // Table header
//     doc.rect(50, tableTop, doc.page.width - 100, 20).fill(DARK);
//     doc
//         .fillColor(WHITE)
//         .font("Helvetica-Bold")
//         .fontSize(9)
//         .text("HRS/QTY", colX.qty, tableTop + 6)
//         .text("SERVICE", colX.desc, tableTop + 6)
//         .text("RATE/PRICE", colX.rate, tableTop + 6)
//         .text("SUB TOTAL", colX.subtotal, tableTop + 6);

//     doc.fillColor(TEXT);

//     // Table rows
//     let rowY = tableTop + 22;
//     invoice.items.forEach((item, i) => {
//         const bg = i % 2 === 0 ? WHITE : GRAY;
//         doc
//             .rect(50, rowY, doc.page.width - 100, 30)
//             .fill(bg);

//         doc
//             .fillColor(TEXT)
//             .font("Helvetica")
//             .fontSize(9)
//             .text(String(item.quantity), colX.qty, rowY + 6)
//             .text(item.description, colX.desc, rowY + 6, { width: 270 })
//             .text(`₹${item.price.toFixed(2)}`, colX.rate, rowY + 6)
//             .text(`₹${item.amount.toFixed(2)}`, colX.subtotal, rowY + 6);

//         rowY += 32;
//     });

//     // ── Totals Block ─────────────────────────────────────
//     const totalsX = 360;
//     let totalsY = rowY + 16;
//     const lineH = 18;

//     const totalsData = [
//         ["Sub Total", `₹${invoice.subtotal.toFixed(2)}`],
//         [
//             taxSettings.taxName
//                 ? `${taxSettings.taxName} (${taxSettings.taxPercentage}%)`
//                 : "Tax",
//             `₹${invoice.tax.toFixed(2)}`,
//         ],
//         ["Discount", `-₹${invoice.discount.toFixed(2)}`],
//         ["Paid", `-₹${invoice.amountPaid.toFixed(2)}`],
//     ];

//     totalsData.forEach(([label, value]) => {
//         doc
//             .font("Helvetica")
//             .fontSize(9)
//             .fillColor(TEXT)
//             .text(label, totalsX, totalsY, { width: 100 })
//             .text(value, totalsX + 100, totalsY, {
//                 width: 90,
//                 align: "right",
//             });
//         totalsY += lineH;
//     });

//     // Total Due final row
//     doc.rect(totalsX, totalsY, 190, 22).fill(DARK);
//     doc
//         .fillColor(WHITE)
//         .font("Helvetica-Bold")
//         .fontSize(10)
//         .text("TOTAL DUE", totalsX + 6, totalsY + 6, { width: 90 })
//         .text(`₹${invoice.balanceDue.toFixed(2)}`, totalsX + 96, totalsY + 6, {
//             width: 88,
//             align: "right",
//         });

//     doc.fillColor(TEXT);

//     // ── Notes ─────────────────────────────────────────────
//     if (invoice.notes) {
//         const notesY = totalsY + 40;
//         doc
//             .font("Helvetica-Bold")
//             .fontSize(9)
//             .fillColor(DARK)
//             .text("Notes:", 50, notesY);
//         doc
//             .font("Helvetica")
//             .fillColor(TEXT)
//             .text(invoice.notes, 50, notesY + 14, {
//                 width: doc.page.width - 100,
//             });
//     }

//     // ── Terms ─────────────────────────────────────────────
//     if (settings?.invoice?.terms) {
//         const termsY = totalsY + 80;
//         doc
//             .font("Helvetica-Bold")
//             .fontSize(9)
//             .fillColor(DARK)
//             .text("Terms & Conditions:", 50, termsY);
//         doc
//             .font("Helvetica")
//             .fillColor(TEXT)
//             .fontSize(8)
//             .text(settings.invoice.terms, 50, termsY + 14, {
//                 width: doc.page.width - 100,
//             });
//     }

//     // ── Footer ────────────────────────────────────────────
//     doc
//         .rect(0, doc.page.height - 40, doc.page.width, 40)
//         .fill(DARK);
//     doc
//         .fillColor(WHITE)
//         .font("Helvetica")
//         .fontSize(8)
//         .text(
//             `Thanks for choosing ${business.name || "us"} | ${business.email || ""} | ${business.phone || ""}`,
//             0,
//             doc.page.height - 26,
//             { align: "center" }
//         );

//     doc.end();
// };

// export default generateInvoicePdf;

// utils/generateInvoicePdf.js
import PDFDocument from "pdfkit";

const buildInvoicePdf = (doc, invoice, settings) => {

    const business = settings?.business || {};
    const taxSettings = settings?.tax || {};

    const DARK = "#1e3a5f";
    const WHITE = "#ffffff";
    const GRAY = "#f5f5f5";
    const TEXT = "#333333";

    doc.rect(0, 0, doc.page.width, 80).fill(DARK);

    doc
        .fillColor(WHITE)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(business.name || "Your Business", 50, 25);

    doc
        .fontSize(22)
        .text("INVOICE", 0, 28, { align: "right" });

    doc.fillColor(TEXT);

    const topY = 100;

    doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor(DARK)
        .text("From:", 50, topY);

    doc
        .font("Helvetica")
        .fillColor(TEXT)
        .fontSize(9)
        .text(business.name || "", 50, topY + 14)
        .text(business.address || "", 50, topY + 26)
        .text(business.email || "", 50, topY + 38)
        .text(business.phone || "", 50, topY + 50)
        .text(
            business.gstNumber ? `GST No: ${business.gstNumber}` : "",
            50,
            topY + 62
        );

    const detailX = 350;
    const labelW = 110;

    const invoiceDetails = [
        ["Invoice Number", invoice.invoiceNumber],
        ["Invoice Date", new Date(invoice.issueDate).toLocaleDateString("en-IN")],
        ["Due Date", new Date(invoice.dueDate).toLocaleDateString("en-IN")],
    ];

    invoiceDetails.forEach(([label, value], i) => {
        const y = topY + i * 14;
        doc
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(TEXT)
            .text(label, detailX, y, { width: labelW });
        doc
            .font("Helvetica")
            .text(value, detailX + labelW, y);
    });

    doc.rect(detailX, topY + 44, 200, 22).fill(DARK);
    doc
        .fillColor(WHITE)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("TOTAL DUE", detailX + 6, topY + 50, { width: 90 });
    doc.text(
        `₹${invoice.balanceDue.toFixed(2)}`,
        detailX + 100,
        topY + 50,
        { width: 94, align: "right" }
    );
    doc.fillColor(TEXT);

    const toY = topY + 90;

    doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(DARK)
        .text("To:", 50, toY);

    const client = invoice.client || {};
    doc
        .font("Helvetica")
        .fillColor(TEXT)
        .fontSize(9)
        .text(client.name || "", 50, toY + 14)
        .text(client.address || "", 50, toY + 26)
        .text(client.email || "", 50, toY + 38)
        .text(client.phone || "", 50, toY + 50);

    const tableTop = toY + 80;
    const colX = { qty: 50, desc: 90, rate: 370, subtotal: 460 };

    doc.rect(50, tableTop, doc.page.width - 100, 20).fill(DARK);
    doc
        .fillColor(WHITE)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("HRS/QTY", colX.qty, tableTop + 6)
        .text("SERVICE", colX.desc, tableTop + 6)
        .text("RATE/PRICE", colX.rate, tableTop + 6)
        .text("SUB TOTAL", colX.subtotal, tableTop + 6);

    doc.fillColor(TEXT);

    let rowY = tableTop + 22;
    invoice.items.forEach((item, i) => {
        const bg = i % 2 === 0 ? WHITE : GRAY;
        doc.rect(50, rowY, doc.page.width - 100, 30).fill(bg);
        doc
            .fillColor(TEXT)
            .font("Helvetica")
            .fontSize(9)
            .text(String(item.quantity), colX.qty, rowY + 6)
            .text(item.description, colX.desc, rowY + 6, { width: 270 })
            .text(`₹${item.price.toFixed(2)}`, colX.rate, rowY + 6)
            .text(`₹${item.amount.toFixed(2)}`, colX.subtotal, rowY + 6);
        rowY += 32;
    });

    const totalsX = 360;
    let totalsY = rowY + 16;
    const lineH = 18;

    const totalsData = [
        ["Sub Total", `₹${invoice.subtotal.toFixed(2)}`],
        [
            taxSettings.taxName
                ? `${taxSettings.taxName} (${taxSettings.taxPercentage}%)`
                : "Tax",
            `₹${invoice.tax.toFixed(2)}`,
        ],
        ["Discount", `-₹${invoice.discount.toFixed(2)}`],
        ["Paid", `-₹${invoice.amountPaid.toFixed(2)}`],
    ];

    totalsData.forEach(([label, value]) => {
        doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(TEXT)
            .text(label, totalsX, totalsY, { width: 100 })
            .text(value, totalsX + 100, totalsY, { width: 90, align: "right" });
        totalsY += lineH;
    });

    doc.rect(totalsX, totalsY, 190, 22).fill(DARK);
    doc
        .fillColor(WHITE)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("TOTAL DUE", totalsX + 6, totalsY + 6, { width: 90 })
        .text(`₹${invoice.balanceDue.toFixed(2)}`, totalsX + 96, totalsY + 6, {
            width: 88,
            align: "right",
        });

    doc.fillColor(TEXT);

    if (invoice.notes) {
        const notesY = totalsY + 40;
        doc
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(DARK)
            .text("Notes:", 50, notesY);
        doc
            .font("Helvetica")
            .fillColor(TEXT)
            .text(invoice.notes, 50, notesY + 14, {
                width: doc.page.width - 100,
            });
    }

    if (settings?.invoice?.terms) {
        const termsY = totalsY + 80;
        doc
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(DARK)
            .text("Terms & Conditions:", 50, termsY);
        doc
            .font("Helvetica")
            .fillColor(TEXT)
            .fontSize(8)
            .text(settings.invoice.terms, 50, termsY + 14, {
                width: doc.page.width - 100,
            });
    }

    doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill(DARK);
    doc
        .fillColor(WHITE)
        .font("Helvetica")
        .fontSize(8)
        .text(
            `Thanks for choosing ${business.name || "us"} | ${business.email || ""} | ${business.phone || ""}`,
            0,
            doc.page.height - 26,
            { align: "center" }
        );

    doc.end();
};


export const generateInvoicePdfStream = (invoice, settings, res) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoice.invoiceNumber}.pdf"`
    );

    doc.pipe(res);
    buildInvoicePdf(doc, invoice, settings);
};


export const generateInvoicePdfBuffer = (invoice, settings) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        buildInvoicePdf(doc, invoice, settings);
    });
};