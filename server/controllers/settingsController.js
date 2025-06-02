import Settings from "../models/Settings.js";
// import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSiteSettings();

  res.status(200).json({
    success: true,
    data: settings,
  });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({});

  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
});
