// controllers/imageController.js
import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Experience from "../models/Experience.js";

export const uploadExperienceImage = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403));
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  try {
    const imageData = req.file.buffer.toString("base64");

    if (!experience.images) experience.images = [];

    const newImage = {
      title: req.body.title || "Untitled Image",
      description: req.body.description || "",
      data: imageData,
      contentType: req.file.mimetype,
      size: req.file.size,
      isMain: req.body.isMain === "true" || experience.images.length === 0,
    };

    experience.images.push(newImage);

    if (newImage.isMain) {
      experience.imageUrl = `data:${req.file.mimetype};base64,${imageData}`;
      experience.images.forEach((img, index) => {
        if (index !== experience.images.length - 1) {
          img.isMain = false;
        }
      });
    }

    await experience.save();

    res.status(200).json({
      success: true,
      data: experience.images[experience.images.length - 1],
    });
  } catch (error) {
    return next(new ErrorResponse(`Error uploading image: ${error.message}`, 500));
  }
});

export const getExperienceImages = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));

  const images = experience.images || [];

  const imagesWithUrls = images.map((image) => ({
    ...image.toObject(),
    url: `data:${image.contentType};base64,${image.data}`,
  }));

  res.status(200).json({
    success: true,
    count: images.length,
    data: imagesWithUrls,
  });
});

export const deleteExperienceImage = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));

  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403));
  }

  const imageIndex = experience.images.findIndex((img) => img._id.toString() === req.params.imageId);
  if (imageIndex === -1) return next(new ErrorResponse(`Image not found with id of ${req.params.imageId}`, 404));

  const deletedImage = experience.images[imageIndex];
  experience.images.splice(imageIndex, 1);

  if (deletedImage.isMain && experience.images.length > 0) {
    experience.images[0].isMain = true;
    experience.imageUrl = `data:${experience.images[0].contentType};base64,${experience.images[0].data}`;
  } else if (experience.images.length === 0) {
    experience.imageUrl = "/placeholder.svg?height=400&width=600";
  }

  await experience.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

export const setMainImage = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));

  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403));
  }

  const imageIndex = experience.images.findIndex((img) => img._id.toString() === req.params.imageId);
  if (imageIndex === -1) return next(new ErrorResponse(`Image not found with id of ${req.params.imageId}`, 404));

  experience.images.forEach((img) => (img.isMain = false));

  experience.images[imageIndex].isMain = true;
  const mainImage = experience.images[imageIndex];
  experience.imageUrl = `data:${mainImage.contentType};base64,${mainImage.data}`;

  await experience.save();

  res.status(200).json({
    success: true,
    data: mainImage,
  });
});
