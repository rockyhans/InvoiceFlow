import express from "express";

import protect from "../middleware/authMiddleware.js";

import {

    createClient,

    getClients,

    getClientById,

    updateClient,

    deleteClient,

} from "../controllers/clientController.js";

const router = express.Router();

router
    .route("/")
    .get(protect, getClients)
    .post(protect, createClient);

router
    .route("/:id")
    .get(protect, getClientById)
    .put(protect, updateClient)
    .delete(protect, deleteClient);

export default router;