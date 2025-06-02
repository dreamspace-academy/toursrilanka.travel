import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "favorites",
    select: "title description price location imageUrl rating",
  });

  res.status(200).json({
    success: true,
    data: user.favorites,
  });
});

// @desc    Add experience to favorites
// @route   POST /api/users/favorites/:experienceId
// @access  Private
export const addFavorite = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.favorites.includes(req.params.experienceId)) {
    return next(new ErrorResponse("Experience already in favorites", 400));
  }

  user.favorites.push(req.params.experienceId);
  await user.save();

  res.status(200).json({
    success: true,
    data: user.favorites,
  });
});

// @desc    Remove experience from favorites
// @route   DELETE /api/users/favorites/:experienceId
// @access  Private
export const removeFavorite = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.favorites.includes(req.params.experienceId)) {
    return next(new ErrorResponse("Experience not in favorites", 400));
  }

  user.favorites = user.favorites.filter(
    (favorite) => favorite.toString() !== req.params.experienceId
  );

  await user.save();

  res.status(200).json({
    success: true,
    data: user.favorites,
  });
});
