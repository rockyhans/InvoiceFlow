import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            unique: true,
        },

        business: {
            name: { type: String, default: "" },
            address: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
            website: { type: String, default: "" },
            gstNumber: { type: String, default: "" },
            logo: { type: String, default: "" },
        },

        tax: {
            taxName: { type: String, default: "GST" },
            taxPercentage: { type: Number, default: 18 },
            pricesInclusiveOfTax: { type: Boolean, default: false },
        },

        invoice: {
            prefix: { type: String, default: "INV-" },
            nextNumber: { type: Number, default: 1 },
            dueDays: { type: Number, default: 14 },
            terms: { type: String, default: "" },
        },

        quote: {
            prefix: { type: String, default: "QT-" },
            nextNumber: { type: Number, default: 1 },
            validDays: { type: Number, default: 15 },
            terms: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);