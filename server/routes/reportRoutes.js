import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getFinancialReport } from "../controllers/reportController.js";

const router = express.Router();

router.route("/").get(protect, getFinancialReport);

export default router;

