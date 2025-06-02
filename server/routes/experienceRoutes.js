import express from "express";
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getHostExperiences,
  getFeaturedExperiences,
  getCategoryExperiences,
  uploadExperienceImages,
} from "../controllers/experienceController.js";

import { protect, authorize } from "../middleware/auth.js";
import advancedResults from "../middleware/advancedResults.js";
import Experience from "../models/Experience.js";

// Include other resource routers
import reviewRouter from "./reviewRoutes.js";
import videoRouter from "./videoRoutes.js";

const router = express.Router();

// Re-route into other resource routers
router.use("/:experienceId/reviews", reviewRouter);
router.use("/:experienceId/videos", videoRouter);

router.route("/featured").get(getFeaturedExperiences);
router.route("/host/:hostId").get(getHostExperiences);
router.route("/category/:categoryName").get(getCategoryExperiences);

router
  .route("/")
  .get(
    advancedResults(Experience, [
      { path: "host", select: "name avatar" },
      { path: "reviews", match: { status: "approved" } },
    ]),
    getExperiences
  )
  .post(protect, authorize("host", "admin"), createExperience);

router
  .route("/:id")
  .get(getExperience)
  .put(protect, authorize("host", "admin"), updateExperience)
  .delete(protect, authorize("host", "admin"), deleteExperience);

router
  .route("/:id/images")
  .post(protect, authorize("host", "admin"), uploadExperienceImages);

export default router;
