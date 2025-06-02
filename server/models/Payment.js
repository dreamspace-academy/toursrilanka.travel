import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentMethod: {
      type: String,
      required: [true, "Please specify payment method"],
    },
    transactionId: String,
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    paymentFee: Number,
    hostPayout: Number,
    platformFee: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", PaymentSchema);
