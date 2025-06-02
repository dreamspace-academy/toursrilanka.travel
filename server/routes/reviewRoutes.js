import express from "express";
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  addHostResponse,
  approveReview,
  rejectReview,
} from "../controllers/reviewController.js";

import { protect, authorize } from "../middleware/auth.js";
import advancedResults from "../middleware/advancedResults.js";
import Review from "../models/Review.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Review, [
      { path: "user", select: "name avatar" },
      { path: "experience", select: "title location" },
    ]),
    getReviews
  )
  .post(protect, createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router
  .route("/:id/response")
  .put(protect, authorize("host", "admin"), addHostResponse);

router
  .route("/:id/approve")
  .put(protect, authorize("admin"), approveReview);

router
  .route("/:id/reject")
  .put(protect, authorize("admin"), rejectReview);

export default router;
