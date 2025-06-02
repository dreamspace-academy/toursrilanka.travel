import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ErrorResponse from "../utils/errorResponse.js";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads/temp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

// File filter for videos
const videoFilter = (req, file, cb) => {
  // Accept video files only
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new ErrorResponse("Only video files are allowed!", 400), false);
  }
};

// File size limits
const limits = {
  fileSize: process.env.MAX_VIDEO_FILE_SIZE
    ? Number(process.env.MAX_VIDEO_FILE_SIZE)
    : 100 * 1024 * 1024, // 100MB default
};

// Create multer upload instance
const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits,
});

export { uploadVideo };
