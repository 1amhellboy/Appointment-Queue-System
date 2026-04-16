import express from "express";
import { next } from "../controllers/queueController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:queueId/next", authMiddleware, next);

export default router;