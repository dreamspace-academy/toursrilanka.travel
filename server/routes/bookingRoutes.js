import express from "express"
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getUserBookings,
  getHostBookings,
  confirmPayment, // ✅ Corrected from 'confirmBookingPayment'
} from "../controllers/bookingController.js"

import { protect, authorize } from "../middleware/auth.js"
import advancedResults from "../middleware/advancedResults.js"
import Booking from "../models/Booking.js"

const router = express.Router()

// Protect all routes below this middleware
router.use(protect)

// User-specific bookings
router.route("/user").get(getUserBookings)

// Host-specific bookings
router.route("/host").get(authorize("host", "admin"), getHostBookings)

// Admin: get all bookings / User: create booking
router
  .route("/")
  .get(
    authorize("admin"),
    advancedResults(Booking, [
      { path: "user", select: "name email" },
      { path: "experience", select: "title location imageUrl" },
    ]),
    getBookings
  )
  .post(createBooking)

// Get or update a specific booking
router.route("/:id").get(getBooking).put(authorize("admin"), updateBooking)

// Cancel a booking
router.route("/:id/cancel").put(cancelBooking)

// Confirm payment (admin)
router.route("/:id/confirm-payment").put(authorize("admin"), confirmPayment) // ✅ Fixed

export default router
