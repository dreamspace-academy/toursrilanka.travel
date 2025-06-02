import express from "express";
import { uploadAvatar, uploadMultiple } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/avatar", uploadAvatar);
router.post("/multiple", uploadMultiple);

export default router;
