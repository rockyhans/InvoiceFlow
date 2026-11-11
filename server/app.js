import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "https://invoice-flow-sigma-weld.vercel.app" || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Quotation Invoice API Running"
    });

});

app.use("/api/auth", authRoutes);

app.use("/api/clients", clientRoutes);

app.use("/api/invoices", invoiceRoutes);

app.use("/api/quotes", quoteRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/budgets", budgetRoutes);

app.use("/api/reports", reportRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;