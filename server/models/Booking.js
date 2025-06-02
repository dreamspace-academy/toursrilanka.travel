import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please select a date"],
    },
    startTime: {
      type: String,
      required: [true, "Please select a start time"],
    },
    endTime: String,
    guests: {
      type: Number,
      required: [true, "Please specify number of guests"],
      min: [1, "Must have at least 1 guest"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentId: String,
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "cash", "other"],
      default: "bank_transfer",
    },
    specialRequests: String,
    cancellationReason: String,
    cancelledAt: Date,
    completedAt: Date,
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", BookingSchema);
