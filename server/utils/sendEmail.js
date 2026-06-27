
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({

    service: "gmail",
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "Invoice App"}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        attachments,
    });
};

export default sendEmail;