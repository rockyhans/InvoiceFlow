import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

export const getBudgets = async (req, res) => {
    try {
        const query = {};
        if (req.user && req.user._id) {
            query.$or = [{ admin: req.user._id }, { admin: { $exists: false } }, { admin: null }];
        }

        const budgets = await Budget.find(query).sort({ createdAt: -1 });

        // Aggregate actual spending per category
        const categorySpending = await Expense.aggregate([
            {
                $group: {
                    _id: "$category",
                    spent: { $sum: "$amount" },
                },
            },
        ]);

        const spendMap = {};
        categorySpending.forEach((item) => {
            spendMap[item._id] = item.spent;
        });

        const enrichedBudgets = budgets.map((b) => {
            const spent = spendMap[b.category] || 0;
            const remaining = Math.max(0, b.allocatedAmount - spent);
            const percentageUsed = b.allocatedAmount > 0
                ? Math.min(100, Math.round((spent / b.allocatedAmount) * 100))
                : 0;

            return {
                ...b.toObject(),
                spent,
                remaining,
                percentageUsed,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Budgets fetched successfully",
            count: enrichedBudgets.length,
            data: enrichedBudgets,
        });
    } catch (error) {
        console.error("getBudgets error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const createBudget = async (req, res) => {
    try {
        const { category, allocatedAmount, period, notes } = req.body;

        if (!category || allocatedAmount === undefined || allocatedAmount === null || allocatedAmount === "") {
            return res.status(400).json({
                success: false,
                message: "Category and Allocated Amount are required.",
            });
        }

        const query = { category };
        if (req.user && req.user._id) {
            query.admin = req.user._id;
        }

        const existing = await Budget.findOne(query);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "A budget for this category already exists.",
            });
        }

        const budget = await Budget.create({
            admin: req.user?._id || null,
            category: category.trim(),
            allocatedAmount: Number(allocatedAmount),
            period: period || "Monthly",
            notes: notes ? notes.trim() : "",
        });

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: budget,
        });
    } catch (error) {
        console.error("createBudget error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, allocatedAmount, period, notes } = req.body;

        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        if (category !== undefined) budget.category = category.trim();
        if (allocatedAmount !== undefined) budget.allocatedAmount = Number(allocatedAmount);
        if (period !== undefined) budget.period = period;
        if (notes !== undefined) budget.notes = notes ? notes.trim() : "";

        await budget.save();

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            data: budget,
        });
    } catch (error) {
        console.error("updateBudget error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const budget = await Budget.findByIdAndDelete(id);
        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully",
            data: null,
        });
    } catch (error) {
        console.error("deleteBudget error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
