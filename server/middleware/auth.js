import jwt from "jsonwebtoken";
import { auth } from "express-oauth2-jwt-bearer";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js";

// Check if Auth0 is configured
const isAuth0Configured = process.env.AUTH0_ISSUER_BASE_URL && process.env.AUTH0_AUDIENCE;

// Configure middleware based on available authentication method
let jwtCheck;

if (isAuth0Configured) {
  // Use Auth0 if configured
  jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: "RS256",
  });
} else {
  // Fallback to custom JWT authentication
  jwtCheck = (req, res, next) => {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request
      req.auth = {
        sub: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      next();
    } catch (err) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
  };
}

// Protect routes
export const protect = [
  jwtCheck,
  async (req, res, next) => {
    try {
      const userId = req.auth.sub;

      // Find or create user
      let user = await User.findOne({
        $or: [{ auth0Id: userId }, { _id: userId }],
      });

      if (!user && isAuth0Configured) {
        user = await User.create({
          auth0Id: userId,
          name: req.auth.name || "User",
          email: req.auth.email || "",
          role: "guest",
          isVerified: true,
          status: "Active",
        });
      }

      if (!user) {
        return next(new ErrorResponse("User not found", 401));
      }

      if (user.status !== "Active") {
        return next(new ErrorResponse("User account is not active", 401));
      }

      req.user = user;
      next();
    } catch (err) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
  },
];

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
