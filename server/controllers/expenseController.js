import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const query = {};
        if (req.user && req.user._id) {
            query.$or = [{ admin: req.user._id }, { admin: { $exists: false } }, { admin: null }];
        }

        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            query.$and = [
                ...(query.$or ? [{ $or: query.$or }] : []),
                {
                    $or: [
                        { title: searchRegex },
                        { category: searchRegex },
                        { paymentMethod: searchRegex },
                    ],
                },
            ];
            delete query.$or;
        }

        const totalExpenses = await Expense.countDocuments(query);
        const expenses = await Expense.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalExpenses / limit) || 1;

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            count: expenses.length,
            totalExpenses,
            totalPages,
            pages: totalPages,
            currentPage: page,
            data: expenses,
        });
    } catch (error) {
        console.error("getExpenses error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const createExpense = async (req, res) => {
    try {
        const { title, category, amount, date, paymentMethod, notes } = req.body;

        if (!title || amount === undefined || amount === null || amount === "") {
            return res.status(400).json({
                success: false,
                message: "Title and Amount are required.",
            });
        }

        const expense = await Expense.create({
            admin: req.user?._id || null,
            title: title.trim(),
            category: category || "Other",
            amount: Number(amount),
            date: date ? new Date(date) : new Date(),
            paymentMethod: paymentMethod || "UPI",
            notes: notes ? notes.trim() : "",
        });

        return res.status(201).json({
            success: true,
            message: "Expense recorded successfully",
            data: expense,
        });
    } catch (error) {
        console.error("createExpense error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, amount, date, paymentMethod, notes } = req.body;

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        if (title !== undefined) expense.title = title.trim();
        if (category !== undefined) expense.category = category;
        if (amount !== undefined) expense.amount = Number(amount);
        if (date !== undefined) expense.date = new Date(date);
        if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
        if (notes !== undefined) expense.notes = notes ? notes.trim() : "";

        await expense.save();

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense,
        });
    } catch (error) {
        console.error("updateExpense error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            data: null,
        });
    } catch (error) {
        console.error("deleteExpense error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
