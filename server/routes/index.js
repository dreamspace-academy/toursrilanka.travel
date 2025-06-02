import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import experienceRoutes from "./experienceRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import videoRoutes from "./videoRoutes.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/experiences", experienceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/categories", categoryRoutes);
router.use("/upload", uploadRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/videos", videoRoutes);

export default router;
