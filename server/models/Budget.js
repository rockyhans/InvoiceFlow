import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: false,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        allocatedAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        period: {
            type: String,
            enum: ["Monthly", "Quarterly", "Yearly"],
            default: "Monthly",
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

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
