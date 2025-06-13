import Experience from '../models/Experience.js'
import asyncHandler from '../middleware/asyncHandler.js'

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = asyncHandler(async (req, res, next) => {
  try {
    console.log("📋 Fetching experiences from database...")

    const experiences = await Experience.find({ status: "published" })
      .populate("host", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(50)

    console.log(`✅ Found ${experiences.length} experiences`)

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    })
  } catch (error) {
    console.error("❌ Error fetching experiences:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching experiences",
      details: error.message,
    })
  }
})

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
export const getExperience = asyncHandler(async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate("host", "name email avatar bio")
      .populate("category", "name description")

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: `Experience not found with id of ${req.params.id}`,
      })
    }

    res.status(200).json({
      success: true,
      data: experience,
    })
  } catch (error) {
    console.error("❌ Error fetching experience:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching experience",
      details: error.message,
    })
  }
})

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private/Host
export const createExperience = asyncHandler(async (req, res, next) => {
  try {
    req.body.host = req.user.id
    req.body.status = "published"

    console.log("📝 Creating new experience:", req.body.title)

    const experience = await Experience.create(req.body)

    res.status(201).json({
      success: true,
      data: experience,
    })
  } catch (error) {
    console.error("❌ Error creating experience:", error)
    res.status(500).json({
      success: false,
      error: "Error creating experience",
      details: error.message,
    })
  }
})

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private/Host
export const updateExperience = asyncHandler(async (req, res, next) => {
  try {
    let experience = await Experience.findById(req.params.id)

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: `Experience not found with id of ${req.params.id}`,
      })
    }

    if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: `User ${req.user.id} is not authorized to update this experience`,
      })
    }

    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: experience,
    })
  } catch (error) {
    console.error("❌ Error updating experience:", error)
    res.status(500).json({
      success: false,
      error: "Error updating experience",
      details: error.message,
    })
  }
})

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private/Host
export const deleteExperience = asyncHandler(async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id)

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: `Experience not found with id of ${req.params.id}`,
      })
    }

    if (experience.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: `User ${req.user.id} is not authorized to delete this experience`,
      })
    }

    await Experience.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    console.error("❌ Error deleting experience:", error)
    res.status(500).json({
      success: false,
      error: "Error deleting experience",
      details: error.message,
    })
  }
})

// @desc    Get featured experiences
// @route   GET /api/experiences/featured
// @access  Public
export const getFeaturedExperiences = asyncHandler(async (req, res, next) => {
  try {
    const experiences = await Experience.find({
      featured: true,
      status: "published",
    })
      .populate("host", "name avatar")
      .limit(8)

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    })
  } catch (error) {
    console.error("❌ Error fetching featured experiences:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching featured experiences",
      details: error.message,
    })
  }
})

// @desc    Get experiences by category
// @route   GET /api/experiences/category/:categoryId
// @access  Public
export const getCategoryExperiences = asyncHandler(async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId

    const experiences = await Experience.find({
      category: categoryId,
      status: "published",
    })
      .populate("host", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    })
  } catch (error) {
    console.error("❌ Error fetching category experiences:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching category experiences",
      details: error.message,
    })
  }
})

// @desc    Upload experience images
// @route   POST /api/experiences/:id/images
// @access  Private/Host
export const uploadExperienceImages = asyncHandler(async (req, res, next) => {
  try {
    // TODO: Implement your actual image upload logic here (e.g., multer, cloudinary)
    // For now, just send back a success placeholder

    res.status(200).json({
      success: true,
      message: "Image upload endpoint is working (implement upload logic)",
    })
  } catch (error) {
    console.error("❌ Error uploading experience images:", error)
    res.status(500).json({
      success: false,
      error: "Error uploading experience images",
      details: error.message,
    })
  }
})

// NEW: @desc    Get experiences created by the logged-in host
// @route   GET /api/experiences/host
// @access  Private/Host
export const getHostExperiences = asyncHandler(async (req, res, next) => {
  try {
    const hostId = req.user.id

    const experiences = await Experience.find({ host: hostId })
      .populate("category", "name")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    })
  } catch (error) {
    console.error("❌ Error fetching host experiences:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching host experiences",
      details: error.message,
    })
  }
})
