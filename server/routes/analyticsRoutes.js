import express from "express";
import {
  getDashboardAnalytics,
  getMonthlyRevenue,
  getBookingStats,
  getTopExperiences,
  getHostAnalytics,
} from "../controllers/analyticsController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Host routes
router.get("/host", authorize("host", "admin"), getHostAnalytics);

// Admin routes
router.get("/dashboard", authorize("admin"), getDashboardAnalytics);
router.get("/revenue", authorize("admin"), getMonthlyRevenue);
router.get("/bookings", authorize("admin"), getBookingStats);
router.get("/top-experiences", authorize("admin"), getTopExperiences);

export default router;
