import mongoose from "mongoose"
import dotenv from "dotenv"
//import colors from "colors"

// Load env vars
dotenv.config()

// Load models
import User from "./models/User.js"
import Experience from "./models/Experience.js"
import Category from "./models/Category.js"
import Booking from "./models/Booking.js"
import Review from "./models/Review.js"

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Import sample data
import users from "./data/users.js"
import experiences from "./data/experiences.js"
import categories from "./data/categories.js"

// Import into DB
const importData = async () => {
  try {
    await User.deleteMany()
    await Experience.deleteMany()
    await Category.deleteMany()
    await Booking.deleteMany()
    await Review.deleteMany()

    // Create users
    const createdUsers = await User.create(users)

    // Get admin user
    const adminUser = createdUsers[0]._id
    
    // Use adminUser in some way (e.g., set as creator of categories)
    await Category.create(categories.map((cat) => ({ ...cat, createdBy: adminUser })))



    // Get host users
    const hostUsers = createdUsers.filter((user) => user.role === "host").map((host) => host._id)

    // Create categories
    await Category.create(categories)

    // Add host to experiences
    const sampleExperiences = experiences.map((experience, index) => {
      return {
        ...experience,
        host: hostUsers[index % hostUsers.length],
      }
    })

    // Create experiences
    await Experience.create(sampleExperiences)

    console.log("Data Imported...".green.inverse)
    process.exit()
  } catch (err) {
    console.error(`${err}`.red.inverse)
    process.exit(1)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany()
    await Experience.deleteMany()
    await Category.deleteMany()
    await Booking.deleteMany()
    await Review.deleteMany()

    console.log("Data Destroyed...".red.inverse)
    process.exit()
  } catch (err) {
    console.error(`${err}`.red.inverse)
    process.exit(1)
  }
}

// Check command line args
if (process.argv[2] === "-i") {
  importData()
} else if (process.argv[2] === "-d") {
  deleteData()
} else {
  console.log("Please add proper command: -i (import) or -d (delete)".yellow)
  process.exit()
}
