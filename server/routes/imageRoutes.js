// routes/imageRoutes.js
import express from "express";
import {
  uploadExperienceImage,
  getExperienceImages,
  deleteExperienceImage,
  setMainImage,
} from "../controllers/imageController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getExperienceImages)
  .post(protect, authorize("host", "admin"), uploadImage.single("image"), uploadExperienceImage);

router
  .route("/:imageId")
  .delete(protect, authorize("host", "admin"), deleteExperienceImage);

router
  .route("/:imageId/main")
  .put(protect, authorize("host", "admin"), setMainImage);

export default router;
