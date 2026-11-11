import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";

export const getFinancialReport = async (req, res) => {
    try {
        const adminQuery = {};
        if (req.user && req.user._id) {
            adminQuery.$or = [{ admin: req.user._id }, { admin: { $exists: false } }, { admin: null }];
        }

        const invoices = await Invoice.find(adminQuery).lean();
        const expenses = await Expense.find(adminQuery).lean();
        const budgets = await Budget.find(adminQuery).lean();

        let totalRevenue = 0;
        let paidRevenue = 0;
        let pendingRevenue = 0;

        invoices.forEach((inv) => {
            const amount = Number(inv.total || inv.grandTotal || inv.amount || 0);
            totalRevenue += amount;
            if (inv.status === "Paid") {
                paidRevenue += amount;
            } else {
                pendingRevenue += amount;
            }
        });

        let totalExpenses = 0;
        const expensesByCategory = {};
        expenses.forEach((exp) => {
            const amt = Number(exp.amount || 0);
            totalExpenses += amt;
            const cat = exp.category || "Other";
            expensesByCategory[cat] = (expensesByCategory[cat] || 0) + amt;
        });

        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

        const budgetComparison = budgets.map((b) => {
            const spent = expensesByCategory[b.category] || 0;
            return {
                category: b.category,
                allocated: b.allocatedAmount,
                spent,
                difference: b.allocatedAmount - spent,
                status: spent > b.allocatedAmount ? "Over Budget" : "Within Budget",
            };
        });

        const categoryList = Object.keys(expensesByCategory).map((cat) => ({
            category: cat,
            total: expensesByCategory[cat],
            percentage: totalExpenses > 0 ? Math.round((expensesByCategory[cat] / totalExpenses) * 100) : 0,
        }));

        return res.status(200).json({
            success: true,
            message: "Financial report generated successfully",
            data: {
                summary: {
                    totalRevenue,
                    paidRevenue,
                    pendingRevenue,
                    totalExpenses,
                    netProfit,
                    profitMargin,
                    totalInvoices: invoices.length,
                    totalExpensesCount: expenses.length,
                },
                expensesByCategory: categoryList,
                budgetComparison,
            },
        });
    } catch (error) {
        console.error("getFinancialReport error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
