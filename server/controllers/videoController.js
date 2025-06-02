import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import { uploadFileToS3, getSignedFileUrl, deleteFileFromS3, getPublicFileUrl } from "../utils/s3.js";
import Experience from "../models/Experience.js";

// @desc    Upload video for an experience
// @route   POST /api/experiences/:id/videos
// @access  Private/Host
export const uploadExperienceVideo = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is experience host or admin
  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403));
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a video file`, 400));
  }

  try {
    // Upload to S3
    const result = await uploadFileToS3(req.file, `experiences/${req.params.id}/videos`);

    // Add video to experience
    if (!experience.videos) {
      experience.videos = [];
    }

    experience.videos.push({
      title: req.body.title || "Untitled Video",
      description: req.body.description || "",
      key: result.key,
      url: result.url,
      duration: req.body.duration || 0,
      thumbnail: req.body.thumbnail || "",
    });

    await experience.save();

    res.status(200).json({
      success: true,
      data: experience.videos[experience.videos.length - 1],
    });
  } catch (error) {
    return next(new ErrorResponse(`Error uploading video: ${error.message}`, 500));
  }
});

// @desc    Get all videos for an experience
// @route   GET /api/experiences/:id/videos
// @access  Public
export const getExperienceVideos = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  const videos = experience.videos || [];

  // Generate signed URLs for each video if needed
  const videosWithUrls = await Promise.all(
    videos.map(async (video) => {
      // For public videos, use the public URL
      // For private videos, generate a signed URL
      const videoUrl = video.isPublic ? getPublicFileUrl(video.key) : await getSignedFileUrl(video.key);

      return {
        ...video.toObject(),
        url: videoUrl,
      };
    }),
  );

  res.status(200).json({
    success: true,
    count: videos.length,
    data: videosWithUrls,
  });
});

// @desc    Delete video from an experience
// @route   DELETE /api/experiences/:id/videos/:videoId
// @access  Private/Host
export const deleteExperienceVideo = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is experience host or admin
  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this experience`, 403));
  }

  // Find the video
  const videoIndex = experience.videos.findIndex((v) => v._id.toString() === req.params.videoId);

  if (videoIndex === -1) {
    return next(new ErrorResponse(`Video not found with id of ${req.params.videoId}`, 404));
  }

  const video = experience.videos[videoIndex];

  try {
    // Delete from S3
    await deleteFileFromS3(video.key);

    // Remove from experience
    experience.videos.splice(videoIndex, 1);
    await experience.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return next(new ErrorResponse(`Error deleting video: ${error.message}`, 500));
  }
});
