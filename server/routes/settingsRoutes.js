import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getSettings)
  .put(protect, authorize("admin"), updateSettings);

export default router;
