import bcrypt from "bcryptjs";

import Admin from "../models/Admin.js";

import generateToken from "../utils/generateToken.js";

export const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });

        }

        const admin = await Admin.findOne({ email });

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });

        }

        const token = generateToken(admin._id);

        res.status(200).json({

            success: true,

            token,

            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });

    } catch (error) {

        next(error);

    }

};