import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Please add a title for your review"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    photos: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    hostResponse: {
      text: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per experience
ReviewSchema.index({ experience: 1, user: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function (experienceId) {
  const obj = await this.aggregate([
    {
      $match: { experience: experienceId, status: "approved" },
    },
    {
      $group: {
        _id: "$experience",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    if (obj[0]) {
      await this.model("Experience").findByIdAndUpdate(experienceId, {
        averageRating: obj[0].averageRating.toFixed(1),
      });
    } else {
      await this.model("Experience").findByIdAndUpdate(experienceId, {
        averageRating: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.experience);
});

// Call getAverageRating after remove
ReviewSchema.post("remove", function () {
  this.constructor.getAverageRating(this.experience);
});

export default mongoose.model("Review", ReviewSchema);
