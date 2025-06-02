import express from "express"
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getUserBookings,
  getHostBookings,
  // createPaymentIntent,  <-- remove this line
  confirmBookingPayment,
} from "../controllers/bookingController.js"

import { protect, authorize } from "../middleware/auth.js"
import advancedResults from "../middleware/advancedResults.js"
import Booking from "../models/Booking.js"

const router = express.Router()

router.use(protect)

router.route("/user").get(getUserBookings)
router.route("/host").get(authorize("host", "admin"), getHostBookings)

router
  .route("/")
  .get(
    authorize("admin"),
    advancedResults(Booking, [
      { path: "user", select: "name email" },
      { path: "experience", select: "title location imageUrl" },
    ]),
    getBookings,
  )
  .post(createBooking)

router.route("/:id").get(getBooking).put(authorize("admin"), updateBooking)

router.route("/:id/cancel").put(cancelBooking)
// router.route("/:id/payment-intent").post(createPaymentIntent)  <-- remove this line
router.route("/:id/confirm-payment").put(authorize("admin"), confirmBookingPayment)

export default router
