import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Tour Sri Lanka",
    },
    siteDescription: {
      type: String,
      default: "Find and book unique travel experiences in Sri Lanka",
    },
    logo: {
      type: String,
      default: "/logo.png",
    },
    contactEmail: {
      type: String,
      default: "contact@toursrilanka.com",
    },
    contactPhone: {
      type: String,
      default: "+94 123 456 789",
    },
    address: {
      type: String,
      default: "123 Main Street, Colombo, Sri Lanka",
    },
    socialLinks: {
      facebook: {
        type: String,
        default: "https://facebook.com/toursrilanka",
      },
      twitter: {
        type: String,
        default: "https://twitter.com/toursrilanka",
      },
      instagram: {
        type: String,
        default: "https://instagram.com/toursrilanka",
      },
    },
    colors: {
      primary: {
        type: String,
        default: "#0070f3",
      },
      secondary: {
        type: String,
        default: "#ff4081",
      },
    },
    currency: {
      type: String,
      default: "LKR",
    },
    bookingFee: {
      type: Number,
      default: 5, // Percentage
    },
    taxRate: {
      type: Number,
      default: 10, // Percentage
    },
    featuredExperiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Experience",
      },
    ],
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a singleton pattern for settings
SettingsSchema.statics.getSiteSettings = async function () {
  const settings = await this.findOne({});
  if (settings) {
    return settings;
  }

  // If no settings exist, create default settings
  return await this.create({});
};

export default mongoose.model("Settings", SettingsSchema);
