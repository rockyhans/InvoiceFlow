import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        tax: {
            type: Number,
            default: 0,
        },

        amount: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const quoteSchema = new mongoose.Schema(
    {
        quoteNumber: {
            type: String,
            required: true,
            unique: true,
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },

        issueDate: {
            type: Date,
            required: true,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        items: [itemSchema],

        subtotal: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        tax: {
            type: Number,
            default: 0,
        },

        total: {
            type: Number,
            required: true,
        },

        notes: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["Draft", "Sent", "Accepted", "Rejected"],
            default: "Draft",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Quote", quoteSchema);