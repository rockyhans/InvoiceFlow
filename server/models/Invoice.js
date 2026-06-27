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
    {
        _id: false,
    }
);

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
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

        quote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quote",
            default: null,
        },

        issueDate: {
            type: Date,
            required: true,
        },

        dueDate: {
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

        amountPaid: {
            type: Number,
            default: 0,
        },

        balanceDue: {
            type: Number,
            required: true,
        },

        notes: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "Draft",
                "Sent",
                "Paid",
                "Partially Paid",
                "Overdue",
            ],
            default: "Draft",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Invoice", invoiceSchema);