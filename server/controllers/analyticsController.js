import Booking from "../models/Booking.js";
import Experience from "../models/Experience.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Get total revenue
  const bookings = await Booking.find({ status: "completed" });
  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.price.totalPrice, 0);

  // Get total bookings
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
  const completedBookings = await Booking.countDocuments({ status: "completed" });
  const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

  // Get user stats
  const totalUsers = await User.countDocuments();
  const totalHosts = await User.countDocuments({ role: "host" });
  const totalGuests = await User.countDocuments({ role: "guest" });
  const activeUsers = await User.countDocuments({ status: "Active" });

  // Get experience stats
  const totalExperiences = await Experience.countDocuments();
  const publishedExperiences = await Experience.countDocuments({ status: "published" });
  const draftExperiences = await Experience.countDocuments({ status: "draft" });
  const featuredExperiences = await Experience.countDocuments({ featured: true });

  // Get review stats
  const totalReviews = await Review.countDocuments();
  const approvedReviews = await Review.countDocuments({ status: "approved" });
  const pendingReviews = await Review.countDocuments({ status: "pending" });

  // Get average rating
  const reviews = await Review.find({ status: "approved" });
  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  res.status(200).json({
    success: true,
    data: {
      revenue: {
        total: totalRevenue,
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      users: {
        total: totalUsers,
        hosts: totalHosts,
        guests: totalGuests,
        active: activeUsers,
      },
      experiences: {
        total: totalExperiences,
        published: publishedExperiences,
        draft: draftExperiences,
        featured: featuredExperiences,
      },
      reviews: {
        total: totalReviews,
        approved: approvedReviews,
        pending: pendingReviews,
        averageRating,
      },
    },
  });
});

// @desc    Get monthly revenue
// @route   GET /api/analytics/revenue
// @access  Private/Admin
export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const { year } = req.query;

  // Default to current year if not specified
  const targetYear = year || new Date().getFullYear();

  // Get all completed bookings for the year
  const bookings = await Booking.find({
    status: "completed",
    createdAt: {
      $gte: new Date(`${targetYear}-01-01`),
      $lte: new Date(`${targetYear}-12-31`),
    },
  });

  // Initialize monthly revenue array
  const monthlyRevenue = Array(12).fill(0);

  // Calculate revenue for each month
  bookings.forEach((booking) => {
    const month = booking.createdAt.getMonth();
    monthlyRevenue[month] += booking.price.totalPrice;
  });

  // Format data for chart
  const data = monthlyRevenue.map((revenue, index) => ({
    month: new Date(targetYear, index).toLocaleString("default", { month: "short" }),
    revenue,
  }));

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Get booking statistics
// @route   GET /api/analytics/bookings
// @access  Private/Admin
export const getBookingStats = asyncHandler(async (req, res) => {
  // Get bookings by status
  const bookingsByStatus = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get bookings by month for current year
  const currentYear = new Date().getFullYear();
  const bookingsByMonth = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Format data for chart
  const monthlyData = Array(12).fill(0);
  bookingsByMonth.forEach((item) => {
    monthlyData[item._id - 1] = item.count;
  });

  const formattedMonthlyData = monthlyData.map((count, index) => ({
    month: new Date(currentYear, index).toLocaleString("default", { month: "short" }),
    count,
  }));

  res.status(200).json({
    success: true,
    data: {
      byStatus: bookingsByStatus,
      byMonth: formattedMonthlyData,
    },
  });
});

// @desc    Get top experiences
// @route   GET /api/analytics/top-experiences
// @access  Private/Admin
export const getTopExperiences = asyncHandler(async (req, res) => {
  const topExperiences = await Experience.aggregate([
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "experience",
        as: "bookings",
      },
    },
    {
      $project: {
        title: 1,
        location: 1,
        price: 1,
        bookingCount: { $size: "$bookings" },
        revenue: {
          $sum: "$bookings.price.totalPrice",
        },
      },
    },
    {
      $sort: { bookingCount: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  res.status(200).json({
    success: true,
    data: topExperiences,
  });
});

// @desc    Get host analytics
// @route   GET /api/analytics/host
// @access  Private/Host
export const getHostAnalytics = asyncHandler(async (req, res) => {
  // Get host's experiences
  const experiences = await Experience.find({ host: req.user.id });
  const experienceIds = experiences.map((exp) => exp._id);

  // Get bookings for host's experiences
  const bookings = await Booking.find({
    experience: { $in: experienceIds },
    status: { $in: ["confirmed", "completed"] },
  });

  // Calculate total revenue
  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.price.totalPrice, 0);

  // Calculate host payout (70% of total revenue)
  const hostPayout = totalRevenue * 0.7;

  // Get booking stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  // Get reviews for host's experiences
  const reviews = await Review.find({
    experience: { $in: experienceIds },
    status: "approved",
  });

  // Calculate average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  // Get monthly revenue for current year
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = Array(12).fill(0);

  bookings.forEach((booking) => {
    if (booking.createdAt.getFullYear() === currentYear) {
      const month = booking.createdAt.getMonth();
      monthlyRevenue[month] += booking.price.totalPrice * 0.7; // Host gets 70%
    }
  });

  // Format data for chart
  const monthlyData = monthlyRevenue.map((revenue, index) => ({
    month: new Date(currentYear, index).toLocaleString("default", { month: "short" }),
    revenue,
  }));

  res.status(200).json({
    success: true,
    data: {
      experiences: {
        total: experiences.length,
        published: experiences.filter((e) => e.status === "published").length,
        draft: experiences.filter((e) => e.status === "draft").length,
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
      },
      revenue: {
        total: totalRevenue,
        hostPayout,
      },
      reviews: {
        total: reviews.length,
        averageRating,
      },
      monthlyRevenue: monthlyData,
    },
  });
});
