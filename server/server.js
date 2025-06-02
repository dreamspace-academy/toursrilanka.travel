import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import fileupload from "express-fileupload"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

// Dynamic imports for CommonJS-only packages
const { default: colors } = await import("colors")
const { default: mongoSanitize } = await import("express-mongo-sanitize")
const { default: xss } = await import("xss-clean")

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Internal modules (make sure all files have `.js` extensions!)
import errorHandler from "./middleware/errorHandler.js"
import connectDB from "./config/db.js"
import auth from "./routes/authRoutes.js"
import users from "./routes/userRoutes.js"
import experiences from "./routes/experienceRoutes.js"
import bookings from "./routes/bookingRoutes.js"
import reviews from "./routes/reviewRoutes.js"
import categories from "./routes/categoryRoutes.js"
import analytics from "./routes/analyticsRoutes.js"
import upload from "./routes/uploadRoutes.js"
import videos from "./routes/videoRoutes.js"
import settings from "./routes/settingsRoutes.js"

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Trust proxy for secure cookies and forwarded headers
app.set("trust proxy", 1)

// Body parser
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Cookie parser
app.use(cookieParser())

// Dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"))
}

// File uploading
app.use(
  fileupload({
    limits: { fileSize: process.env.MAX_FILE_UPLOAD || 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
)

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// Prevent HTTP param pollution
app.use(hpp())

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Serve static files
app.use(express.static(path.join(__dirname, "public")))

// Mount routes
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/experiences", experiences)
app.use("/api/bookings", bookings)
app.use("/api/reviews", reviews)
app.use("/api/categories", categories)
app.use("/api/analytics", analytics)
app.use("/api/upload", upload)
app.use("/api/videos", videos)
app.use("/api/settings", settings)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
  console.log("Environment variables status:")
  console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? "✓ Set" : "✗ Not set"}`)
  console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? "✓ Set" : "✗ Not set"}`)
  console.log(`- FRONTEND_URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`.red)
  server.close(() => process.exit(1))
})
