import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Dynamic import for CommonJS-only package
const { default: colors } = await import("colors")

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import models and DB config (ensure .js extensions)
import User from "./models/User.js"
import Category from "./models/Category.js"
import connectDB from "./config/db.js"

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Admin user data
const adminUser = {
  name: "Admin User",
  email: "admin@example.com",
  password: "password123",
  role: "admin",
  isVerified: true,
  status: "Active",
}

// Sample categories
const categories = [
  { name: "Adventure", description: "Exciting outdoor activities" },
  { name: "Cultural", description: "Immersive cultural experiences" },
  { name: "Food & Drink", description: "Culinary experiences and tastings" },
  { name: "Nature", description: "Experiences in natural settings" },
  { name: "Wellness", description: "Health and relaxation experiences" },
]

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({ email: adminUser.email })
    await Category.deleteMany({})
    console.log("Previous data cleared".yellow)

    // Create admin user
    const user = await User.create(adminUser)
    console.log(`Admin user created: ${user.email}`.green)

    // Create categories
    const createdCategories = await Category.create(categories)
    console.log(`${createdCategories.length} categories created`.green)

    console.log("Data seeded successfully!".green.bold)
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold)
    process.exit(1)
  }
}

// Run the seed function
seedData()
