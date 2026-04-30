import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getToday, getStats, getAppointments, next} from "../controllers/queueController.js";

const router = express.Router();

router.post("/:queueId/next", authMiddleware, next);
router.get("/:queueId/appointments", authMiddleware, getAppointments);
router.get("/doctor/:doctorId/today", authMiddleware, getToday);
router.get("/:queueId/stats", authMiddleware, getStats);

export default router;