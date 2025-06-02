import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Experience from "../models/Experience.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  if (req.params.experienceId) {
    const reviews = await Review.find({
      experience: req.params.experienceId,
      status: "approved",
    }).populate({
      path: "user",
      select: "name avatar",
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "user",
    select: "name avatar",
  });

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Create review
// @route   POST /api/experiences/:experienceId/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.experience = req.params.experienceId;

  const experience = await Experience.findById(req.params.experienceId);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.experienceId}`, 404));
  }

  // Check if user has a completed booking for this experience
  const booking = await Booking.findOne({
    user: req.user.id,
    experience: req.params.experienceId,
    status: "completed",
  });

  if (!booking) {
    return next(new ErrorResponse(`You must have a completed booking to review this experience`, 400));
  }

  // Add booking ID to review
  req.body.booking = booking._id;

  // Check if user already reviewed this experience
  const existingReview = await Review.findOne({
    user: req.user.id,
    experience: req.params.experienceId,
  });

  if (existingReview) {
    return next(new ErrorResponse(`You have already reviewed this experience`, 400));
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 403));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 403));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add host response to review
// @route   PUT /api/reviews/:id/response
// @access  Private/Host
export const addHostResponse = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Get the experience to check if user is the host
  const experience = await Experience.findById(review.experience);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found`, 404));
  }

  // Make sure user is the host of the experience
  if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to respond to this review`, 403));
  }

  // Add host response
  review.hostResponse = {
    text: req.body.text,
    createdAt: Date.now(),
  };

  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Approve review (admin only)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  review.status = "approved";
  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Reject review (admin only)
// @route   PUT /api/reviews/:id/reject
// @access  Private/Admin
export const rejectReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  review.status = "rejected";
  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});
