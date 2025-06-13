// server/routes/uploadRoutes.js

import express from "express";
import { fileUpload, deleteFile } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", fileUpload);
router.delete("/:filename", deleteFile);

export default router;
