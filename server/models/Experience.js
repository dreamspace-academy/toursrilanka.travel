import mongoose from "mongoose";
import slugify from "slugify";

const ExperienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    longDescription: {
      type: String,
      required: [true, "Please add a detailed description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price must be at least 0"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    locationDescription: {
      type: String,
      required: [true, "Please add a location description"],
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    duration: {
      type: Number,
      required: [true, "Please add a duration"],
      min: [0.5, "Duration must be at least 0.5 hours"],
    },
    maxGuests: {
      type: Number,
      required: [true, "Please add maximum number of guests"],
      min: [1, "Must allow at least 1 guest"],
    },
    included: {
      type: [String],
      required: [true, "Please specify what is included"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    imageUrl: {
      type: String,
      required: [true, "Please add a main image"],
    },
    gallery: [String],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availableDates: [
      {
        date: Date,
        startTime: String,
        endTime: String,
        spotsAvailable: Number,
      },
    ],
    languages: [String],
    accessibility: {
      wheelchairAccessible: {
        type: Boolean,
        default: false,
      },
      infantFriendly: {
        type: Boolean,
        default: false,
      },
      petFriendly: {
        type: Boolean,
        default: false,
      },
    },
    requirements: [String],
    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict"],
      default: "moderate",
    },
    videos: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        key: {
          type: String,
          required: true,
        },
        url: String,
        duration: Number,
        thumbnail: String,
        isPublic: {
          type: Boolean,
          default: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create experience slug from the title
ExperienceSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Virtual for average rating
ExperienceSchema.virtual("averageRating", {
  ref: "Review",
  localField: "_id",
  foreignField: "experience",
  justOne: false,
  options: { sort: { createdAt: -1 } },
  count: true,
});

// Virtual for reviews
ExperienceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "experience",
  justOne: false,
});

// Virtual for bookings
ExperienceSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "experience",
  justOne: false,
});

export default mongoose.model("Experience", ExperienceSchema);
