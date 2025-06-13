import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import colors from "colors"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"
import helmet from "helmet"
import xss from "xss-clean"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import cors from "cors"
import connectDB from "./config/db.js"

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Trust proxy for rate limiting
app.set("trust proxy", 1)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"))
}

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
)

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Prevent HTTP param pollution
app.use(hpp())

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
)

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "Connected",
  })
})

// Test endpoint
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint working",
    data: {
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
    },
  })
})

// Import routes (must use `.js` extension in ESM)
import auth from "./routes/authRoutes.js"
import users from "./routes/userRoutes.js"
import experiences from "./routes/experienceRoutes.js"
import bookings from "./routes/bookingRoutes.js"
import reviews from "./routes/reviewRoutes.js"
import categories from "./routes/categoryRoutes.js"
import analytics from "./routes/analyticsRoutes.js"
import settings from "./routes/settingsRoutes.js"

// Mount routers
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/experiences", experiences)
app.use("/api/bookings", bookings)
app.use("/api/reviews", reviews)
app.use("/api/categories", categories)
app.use("/api/analytics", analytics)
app.use("/api/settings", settings)

// Catch-all route
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "/api/health",
      "/api/test",
      "/api/auth",
      "/api/users",
      "/api/experiences",
      "/api/bookings",
      "/api/reviews",
      "/api/categories",
      "/api/analytics",
      "/api/settings",
    ],
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err)

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
  console.log(`📊 Environment variables status:`)
  console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}`)
  console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Set" : "❌ Not set"}`)
  console.log(`   - FRONTEND_URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
  console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`❌ Unhandled Promise Rejection: ${err.message}`.red)
  server.close(() => process.exit(1))
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`.red)
  process.exit(1)
})
