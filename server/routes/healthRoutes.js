// server/routes/healthRoutes.js

import express from "express";

const router = express.Router();

// @desc    Health check
// @route   GET /api/health
// @access  Public
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
