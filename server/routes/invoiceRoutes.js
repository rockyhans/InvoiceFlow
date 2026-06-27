import express from "express";

import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    downloadInvoicePdf,
    sendInvoiceToClient,
} from "../controllers/invoiceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    createInvoice
);

router.get(
    "/",
    authMiddleware,
    getInvoices
);

router.get(
    "/:id",
    authMiddleware,
    getInvoiceById
);

router.put(
    "/:id",
    authMiddleware,
    updateInvoice
);

router.delete(
    "/:id",
    authMiddleware,
    deleteInvoice
);

// Create Invoice From Quote
// router.post(
//     "/create-from-quote/:quoteId",
//     authMiddleware,
//     createInvoiceFromQuote
// );

router.get("/:id/pdf", authMiddleware, downloadInvoicePdf);
router.post("/:id/send", authMiddleware, sendInvoiceToClient);


export default router;