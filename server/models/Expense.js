import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: false,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Office Supplies",
                "Travel",
                "Utilities",
                "Rent",
                "Salaries",
                "Marketing",
                "Software & Subscriptions",
                "Maintenance",
                "Other",
            ],
            default: "Other",
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Card", "Bank Transfer", "UPI", "Other"],
            default: "UPI",
        },
        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
