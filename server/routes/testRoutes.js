// server/routes/testRoutes.js

import express from "express";

const router = express.Router();

// @desc    Test route
// @route   GET /api/test
// @access  Public
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test route working",
    data: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
    },
  });
});

// @desc    Test POST route
// @route   POST /api/test
// @access  Public
router.post("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test POST route working",
    data: {
      body: req.body,
      method: req.method,
      url: req.url,
    },
  });
});

export default router;
