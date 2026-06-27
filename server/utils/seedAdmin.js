import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Admin from "../models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const password = await bcrypt.hash("admin123", 10);

await Admin.deleteMany();

await Admin.create({

    name: "Admin",

    email: "admin@gmail.com",

    password,

});

console.log("Admin Created");

process.exit();