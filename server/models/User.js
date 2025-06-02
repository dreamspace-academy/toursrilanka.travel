import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
  },
  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest",
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
  },
  auth0Id: {
    type: String,
    unique: true,
    sparse: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },
  profileImage: {
    type: String,
    default: "default-profile.jpg",
  },
  bio: String,
  location: String,
  phoneNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

  return verificationToken;
};

export default mongoose.model("User", UserSchema);
