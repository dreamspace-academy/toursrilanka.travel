import Experience from "../models/Experience.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { uploadFileToS3, deleteFileFromS3 } from "../utils/s3.js";

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
export const getExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id)
    .populate({
      path: "host",
      select: "name avatar bio",
    })
    .populate({
      path: "reviews",
      match: { status: "approved" },
      populate: {
        path: "user",
        select: "name avatar",
      },
    });

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: experience,
  });
});

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private/Host
export const createExperience = asyncHandler(async (req, res, next) => {
  req.body.host = req.user.id;

  if (req.user.role !== "host" && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User with ID ${req.user.id} is not authorized to create an experience`, 403)
    );
  }

  const experience = await Experience.create(req.body);

  res.status(201).json({
    success: true,
    data: experience,
  });
});

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private/Host
export const updateExperience = asyncHandler(async (req, res, next) => {
  let experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403)
    );
  }

  experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: experience,
  });
});

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private/Host
export const deleteExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this experience`, 403)
    );
  }

  if (experience.imageUrl) {
    const key = experience.imageUrl.split("/").pop();
    await deleteFileFromS3(`experiences/${key}`);
  }

  if (experience.gallery && experience.gallery.length > 0) {
    for (const image of experience.gallery) {
      const key = image.split("/").pop();
      await deleteFileFromS3(`experiences/${key}`);
    }
  }

  await experience.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get experiences by host
// @route   GET /api/experiences/host/:hostId
// @access  Public
export const getHostExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ host: req.params.hostId });

  res.status(200).json({
    success: true,
    count: experiences.length,
    data: experiences,
  });
});

// @desc    Get featured experiences
// @route   GET /api/experiences/featured
// @access  Public
export const getFeaturedExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ featured: true, status: "published" })
    .populate({
      path: "host",
      select: "name avatar",
    })
    .limit(8);

  res.status(200).json({
    success: true,
    count: experiences.length,
    data: experiences,
  });
});

// @desc    Get experiences by category
// @route   GET /api/experiences/category/:categoryName
// @access  Public
export const getCategoryExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({
    category: req.params.categoryName,
    status: "published",
  });

  res.status(200).json({
    success: true,
    count: experiences.length,
    data: experiences,
  });
});

// @desc    Upload experience images
// @route   POST /api/experiences/:id/images
// @access  Private/Host
export const uploadExperienceImages = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const mainImage = req.files.mainImage;
  const galleryImages = req.files.gallery;

  // Upload main image
  if (mainImage) {
    if (!mainImage.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    if (mainImage.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
      );
    }

    const result = await uploadFileToS3(mainImage, `experiences/${experience._id}/main`);
    experience.imageUrl = result.url;
  }

  // Upload gallery images
  if (galleryImages) {
    const gallery = [];

    if (!Array.isArray(galleryImages)) {
      if (!galleryImages.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload image files`, 400));
      }

      if (galleryImages.size > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(`Please upload images less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
      }

      const result = await uploadFileToS3(galleryImages, `experiences/${experience._id}/gallery`);
      gallery.push(result.url);
    } else {
      for (const file of galleryImages) {
        if (!file.mimetype.startsWith("image")) {
          return next(new ErrorResponse(`Please upload image files`, 400));
        }

        if (file.size > process.env.MAX_FILE_UPLOAD) {
          return next(
            new ErrorResponse(`Please upload images less than ${process.env.MAX_FILE_UPLOAD}`, 400)
          );
        }

        const result = await uploadFileToS3(file, `experiences/${experience._id}/gallery`);
        gallery.push(result.url);
      }
    }

    experience.gallery = gallery;
  }

  await experience.save();

  res.status(200).json({
    success: true,
    data: experience,
  });
});
