import Booking from '../models/Booking.js'
import Experience from '../models/Experience.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/asyncHandler.js'
import sendEmail from '../utils/sendEmail.js'

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'experience',
      select: 'title price location imageUrl host',
      populate: {
        path: 'host',
        select: 'name avatar',
      },
    })
    .populate({
      path: 'user',
      select: 'name email avatar',
    })

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (
    booking.user._id.toString() !== req.user.id &&
    booking.experience.host._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this booking`, 403))
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res, next) => {
  try {
    console.log('📝 Creating booking with data:', req.body)

    req.body.user = req.user.id

    const experience = await Experience.findById(req.body.experience)

    if (!experience) {
      return next(new ErrorResponse(`Experience not found with id of ${req.body.experience}`, 404))
    }

    if (!experience.availableDates || experience.availableDates.length === 0) {
      const defaultDates = []
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        defaultDates.push({
          date: date,
          startTime: '09:00',
          endTime: '17:00',
          spotsAvailable: experience.maxGuests || 10,
        })
      }

      experience.availableDates = defaultDates
      await experience.save()
    }

    const selectedDate = new Date(req.body.date)

    let availableDate = experience.availableDates.find(
      (date) => new Date(date.date).toDateString() === selectedDate.toDateString()
    )

    if (!availableDate) {
      experience.availableDates.push({
        date: selectedDate,
        startTime: req.body.startTime || '09:00',
        endTime: req.body.endTime || '17:00',
        spotsAvailable: (experience.maxGuests || 10) - (req.body.guests || 1),
      })
      await experience.save()
    } else {
      const requestedGuests = req.body.guests || 1
      if (availableDate.spotsAvailable < requestedGuests) {
        return res.status(400).json({
          success: false,
          error: `Not enough spots available. Only ${availableDate.spotsAvailable} spots left`,
        })
      }

      availableDate.spotsAvailable -= requestedGuests
      await experience.save()
    }

    const totalPrice = experience.price * (req.body.guests || 1)

    const bookingData = {
      user: req.user.id,
      experience: req.body.experience,
      date: selectedDate,
      startTime: req.body.startTime || '09:00',
      endTime: req.body.endTime || '17:00',
      guests: req.body.guests || 1,
      totalPrice: totalPrice,
      status: 'confirmed',
      paymentStatus: 'pending',
      specialRequests: req.body.specialRequests || '',
      customerInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.body.phone || '',
      },
    }

    const booking = await Booking.create(bookingData)

    try {
      if (sendEmail) {
        await sendEmail({
          email: req.user.email,
          subject: 'Booking Confirmation',
          message: `Thank you for booking ${experience.title}. Your booking has been confirmed for ${selectedDate.toLocaleDateString()}.`,
        })
      }
    } catch (err) {
      console.log('📧 Email sending failed (optional):', err.message)
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    })
  } catch (error) {
    console.error('❌ Error creating booking:', error)
    res.status(500).json({
      success: false,
      error: 'Error creating booking',
      details: error.message,
    })
  }
})

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 403))
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this booking`, 403))
  }

  if (booking.status === 'cancelled') {
    return next(new ErrorResponse('Booking is already cancelled', 400))
  }

  booking.status = 'cancelled'
  booking.cancellationReason = req.body.reason || 'No reason provided'
  booking.cancelledAt = Date.now()

  await booking.save()

  const experience = await Experience.findById(booking.experience)
  const selectedDate = new Date(booking.date)
  const availableDate = experience.availableDates.find(
    (date) => new Date(date.date).toDateString() === selectedDate.toDateString()
  )

  if (availableDate) {
    availableDate.spotsAvailable += booking.guests
    await experience.save()
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Get bookings for current user
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'experience',
      select: 'title price location imageUrl',
    })
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Get bookings for host
// @route   GET /api/bookings/host
// @access  Private/Host
export const getHostBookings = asyncHandler(async (req, res, next) => {
  const experiences = await Experience.find({ host: req.user.id }).select('_id')
  const experienceIds = experiences.map((exp) => exp._id)

  const bookings = await Booking.find({ experience: { $in: experienceIds } })
    .populate({
      path: 'experience',
      select: 'title price location imageUrl',
    })
    .populate({
      path: 'user',
      select: 'name email avatar',
    })
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Create payment intent
// @route   POST /api/bookings/:id/payment-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (booking.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this booking`, 403))
  }

  res.status(200).json({
    success: true,
    data: {
      clientSecret: 'mock_payment_intent_secret',
      amount: booking.totalPrice * 100,
    },
  })
})

// @desc    Confirm payment
// @route   PUT /api/bookings/:id/confirm-payment
// @access  Private
export const confirmPayment = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  booking.paymentStatus = 'paid'
  booking.status = 'confirmed'
  booking.paymentId = req.body.paymentId || 'mock_payment_id'

  await booking.save()

  res.status(200).json({
    success: true,
    data: booking,
  })
})
