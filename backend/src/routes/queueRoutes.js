import express from "express";
import { next } from "../controllers/queueController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAppointments } from "../controllers/queueController.js";
import { getToday } from "../controllers/queueController.js";

const router = express.Router();

router.post("/:queueId/next", authMiddleware, next);
router.get("/:queueId/appointments", authMiddleware, getAppointments);
router.get("/doctor/:doctorId/today", authMiddleware, getToday);


export default router;