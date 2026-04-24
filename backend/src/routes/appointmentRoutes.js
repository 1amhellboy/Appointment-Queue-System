import express from "express";
import { create, skip, complete } from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, create);
router.post("/:id/skip", authMiddleware, skip);
router.post("/:id/complete", authMiddleware, complete);

export default router;