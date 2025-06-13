import multer from "multer"
import ErrorResponse from "../utils/errorResponse.js"

// Common memory storage
const storage = multer.memoryStorage()

// Filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new ErrorResponse("Only image files are allowed!", 400), false)
  }
}

// Filter for videos
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true)
  } else {
    cb(new ErrorResponse("Only video files are allowed!", 400), false)
  }
}

const limits = {
  fileSize: process.env.MAX_FILE_UPLOAD || 50 * 1024 * 1024, // up to 50MB for videos
}

// Export image upload middleware
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits,
})

// Export video upload middleware
const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits,
})

export { uploadImage, uploadVideo }
