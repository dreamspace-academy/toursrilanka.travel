import Booking from "../models/Booking.js";
import Experience from "../models/Experience.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: "experience",
      select: "title price location imageUrl host",
      populate: {
        path: "host",
        select: "name avatar",
      },
    })
    .populate({
      path: "user",
      select: "name email avatar",
    });

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  if (
    booking.user._id.toString() !== req.user.id &&
    booking.experience.host._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this booking`, 403));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const experience = await Experience.findById(req.body.experience);

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.body.experience}`, 404));
  }

  const selectedDate = new Date(req.body.date);
  const availableDate = experience.availableDates.find(
    (date) => new Date(date.date).toDateString() === selectedDate.toDateString(),
  );

  if (!availableDate) {
    return next(new ErrorResponse(`Selected date is not available`, 400));
  }

  if (availableDate.spotsAvailable < req.body.guests) {
    return next(new ErrorResponse(`Not enough spots available. Only ${availableDate.spotsAvailable} spots left`, 400));
  }

  const totalPrice = experience.price * req.body.guests;

  const booking = await Booking.create({
    ...req.body,
    totalPrice,
    status: "pending",
    paymentStatus: "pending",
  });

  availableDate.spotsAvailable -= req.body.guests;
  await experience.save();

  try {
    await sendEmail({
      email: req.user.email,
      subject: "Booking Confirmation",
      message: `Thank you for booking ${experience.title}. Your booking is pending payment. Please complete your payment to confirm your booking.`,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 403));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this booking`, 403));
  }

  if (booking.status === "cancelled") {
    return next(new ErrorResponse(`Booking is already cancelled`, 400));
  }

  booking.status = "cancelled";
  booking.cancellationReason = req.body.reason || "No reason provided";
  booking.cancelledAt = Date.now();

  await booking.save();

  const experience = await Experience.findById(booking.experience);
  const selectedDate = new Date(booking.date);
  const availableDate = experience.availableDates.find(
    (date) => new Date(date.date).toDateString() === selectedDate.toDateString(),
  );

  if (availableDate) {
    availableDate.spotsAvailable += booking.guests;
    await experience.save();
  }

  try {
    await sendEmail({
      email: req.user.email,
      subject: "Booking Cancelled",
      message: `Your booking for ${experience.title} has been cancelled. If you made a payment, a refund will be processed according to the cancellation policy.`,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Get bookings for current user
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: "experience",
      select: "title price location imageUrl",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get bookings for host
// @route   GET /api/bookings/host
// @access  Private/Host
export const getHostBookings = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ host: req.user.id }).select("_id");
  const experienceIds = experiences.map((exp) => exp._id);

  const bookings = await Booking.find({ experience: { $in: experienceIds } })
    .populate({
      path: "experience",
      select: "title price location imageUrl",
    })
    .populate({
      path: "user",
      select: "name email avatar",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Confirm booking payment
// @route   PUT /api/bookings/:id/confirm-payment
// @access  Private/Admin
export const confirmBookingPayment = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to confirm payments`, 403));
  }

  booking.status = "confirmed";
  booking.paymentStatus = "paid";
  booking.paymentId = req.body.paymentId || "manual-payment";

  await booking.save();

  const experience = await Experience.findById(booking.experience);
  try {
    await sendEmail({
      email: req.user.email,
      subject: "Booking Confirmed",
      message: `Your booking for ${experience.title} has been confirmed. We look forward to seeing you on ${new Date(
        booking.date,
      ).toLocaleDateString()}.`,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});
