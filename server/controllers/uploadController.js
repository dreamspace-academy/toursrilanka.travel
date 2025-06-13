// server/controllers/uploadController.js

import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
export const fileUpload = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.file;

  // Make sure the file is an image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
        400
      )
    );
  }

  // Convert to base64 for storage
  const base64Data = file.buffer.toString("base64");

  res.status(200).json({
    success: true,
    data: {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: base64Data,
      url: `data:${file.mimetype};base64,${base64Data}`,
    },
  });
});

// @desc    Delete file (base64 placeholder)
// @route   DELETE /api/upload/:filename
// @access  Private
export const deleteFile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "File reference removed",
  });
});
