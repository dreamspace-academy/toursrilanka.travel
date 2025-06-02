import express from "express";
import { uploadExperienceVideo, getExperienceVideos, deleteExperienceVideo } from "../controllers/videoController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadVideo } from "../middleware/upload.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getExperienceVideos)
  .post(protect, authorize("host", "admin"), uploadVideo.single("video"), uploadExperienceVideo);

router.route("/:videoId").delete(protect, authorize("host", "admin"), deleteExperienceVideo);

export default router;
