import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  })
})

app.get("/api/experiences", async (req, res) => {
  try {
    const { default: Experience } = await import("./models/Experience.js")

    const experiences = await Experience.find({ status: "published" })
      .populate("host", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({
      success: true,
      count: experiences.length,
      data: experiences,
    })
  } catch (error) {
    console.error("Error fetching experiences:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

async function startServer() {
  try {
    console.log("🔍 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
      console.log(`📋 Experiences: http://localhost:${PORT}/api/experiences`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
