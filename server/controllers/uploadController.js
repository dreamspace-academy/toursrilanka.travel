import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import cloudinary from 'cloudinary'; // Make sure cloudinary is properly configured and imported

// @desc    Upload user avatar
// @route   POST /api/uploads/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.avatar;

  // Check file type
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }

  // Upload to cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "avatars",
    width: 150,
    height: 150,
    crop: "fill",
  });

  // Update user avatar
  const user = await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url }, { new: true });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Upload multiple files
// @route   POST /api/uploads/multiple
// @access  Private
export const uploadMultiple = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorResponse(`Please upload files`, 400));
  }

  const uploadedFiles = [];
  const files = req.files.files;

  // Handle single file
  if (!Array.isArray(files)) {
    // Check file type
    if (!files.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload image files`, 400));
    }

    // Check file size
    if (files.size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(`Please upload images less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(files.tempFilePath, {
      folder: "uploads",
    });

    uploadedFiles.push({
      originalName: files.name,
      url: result.secure_url,
      size: result.bytes,
    });
  } else {
    // Handle multiple files
    for (const file of files) {
      // Check file type
      if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload image files`, 400));
      }

      // Check file size
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload images less than ${process.env.MAX_FILE_UPLOAD}`, 400));
      }

      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "uploads",
      });

      uploadedFiles.push({
        originalName: file.name,
        url: result.secure_url,
        size: result.bytes,
      });
    }
  }

  res.status(200).json({
    success: true,
    count: uploadedFiles.length,
    data: uploadedFiles,
  });
});
