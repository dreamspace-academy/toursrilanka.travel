import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Please add an icon name"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create category slug from the name
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model("Category", CategorySchema);
