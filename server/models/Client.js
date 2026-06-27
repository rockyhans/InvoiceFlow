import mongoose from "mongoose";

const clientSchema =
    new mongoose.Schema(

        {

            name: {
                type: String,
                required: true,
                trim: true,
            },

            companyName: {
                type: String,
                trim: true,
                default: "",
            },

            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
            },

            phone: {
                type: String,
                trim: true,
                default: "",
            },

            gstNumber: {
                type: String,
                default: "",
            },

            address: {
                type: String,
                default: "",
            },

            city: {
                type: String,
                default: "",
            },

            state: {
                type: String,
                default: "",
            },

            country: {
                type: String,
                default: "India",
            },

            postalCode: {
                type: String,
                default: "",
            },

        },

        {
            timestamps: true,
        }

    );

export default mongoose.model(
    "Client",
    clientSchema
);