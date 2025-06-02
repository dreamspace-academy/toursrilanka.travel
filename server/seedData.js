const mongoose = require("mongoose")
const dotenv = require("dotenv")
const colors = require("colors")
const bcrypt = require("bcryptjs")

// Load env vars
dotenv.config()

// Load models
const User = require("./models/User")
const Category = require("./models/Category")
const Experience = require("./models/Experience")
const Settings = require("./models/Settings")

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@toursrilanka.com",
    password: "password123",
    role: "admin",
    isVerified: true,
    status: "Active",
  },
  {
    name: "John Host",
    email: "host@toursrilanka.com",
    password: "password123",
    role: "host",
    isVerified: true,
    status: "Active",
  },
  {
    name: "Jane Guest",
    email: "guest@toursrilanka.com",
    password: "password123",
    role: "guest",
    isVerified: true,
    status: "Active",
  },
]

const categories = [
  {
    name: "Adventure",
    description: "Thrilling outdoor activities and adventures",
    icon: "mountain",
    featured: true,
  },
  {
    name: "Cultural",
    description: "Explore local culture and traditions",
    icon: "temple",
    featured: true,
  },
  {
    name: "Nature",
    description: "Wildlife and nature experiences",
    icon: "leaf",
    featured: true,
  },
  {
    name: "Food & Drink",
    description: "Culinary experiences and local cuisine",
    icon: "utensils",
    featured: false,
  },
  {
    name: "Wellness",
    description: "Relaxation and wellness activities",
    icon: "spa",
    featured: false,
  },
]

const experiences = [
  {
    title: "Sigiriya Rock Fortress Adventure",
    description: "Climb the ancient Sigiriya Rock Fortress and explore its magnificent frescoes",
    longDescription:
      "Experience the wonder of Sigiriya, an ancient rock fortress that rises dramatically from the central plains of Sri Lanka. This UNESCO World Heritage site offers breathtaking views, ancient frescoes, and a glimpse into Sri Lanka's rich history. The climb to the top is challenging but rewarding, with stunning panoramic views of the surrounding landscape.",
    price: 75,
    location: "Sigiriya, Central Province",
    locationDescription: "Located in the heart of Sri Lanka's Cultural Triangle",
    duration: 4,
    maxGuests: 8,
    category: "Adventure",
    included: [
      "Professional guide",
      "Entrance fees",
      "Transportation from hotel",
      "Refreshments",
      "Photography assistance",
    ],
    requirements: ["Moderate fitness level required", "Comfortable walking shoes", "Sun protection", "Water bottle"],
    languages: ["English", "Sinhala"],
    cancellationPolicy: "moderate",
    status: "published",
    featured: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Kandy Cultural Experience",
    description: "Immerse yourself in the cultural heart of Sri Lanka",
    longDescription:
      "Discover the cultural richness of Kandy, the last royal capital of Sri Lanka. Visit the sacred Temple of the Tooth Relic, explore traditional markets, witness a cultural dance performance, and learn about local crafts and traditions. This experience offers a deep dive into Sri Lankan culture and heritage.",
    price: 60,
    location: "Kandy, Central Province",
    locationDescription: "The cultural capital of Sri Lanka",
    duration: 6,
    maxGuests: 12,
    category: "Cultural",
    included: ["Temple entrance fees", "Cultural dance show", "Traditional lunch", "Local guide", "Market tour"],
    requirements: ["Modest dress code for temples", "Comfortable walking shoes", "Respect for local customs"],
    languages: ["English", "Sinhala", "Tamil"],
    cancellationPolicy: "flexible",
    status: "published",
    featured: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Yala Safari Wildlife Experience",
    description: "Spot leopards and elephants in their natural habitat",
    longDescription:
      "Embark on an exciting safari adventure in Yala National Park, home to the highest density of leopards in the world. This wildlife experience offers the chance to see elephants, sloth bears, crocodiles, and over 200 bird species in their natural habitat. Our experienced guides will help you spot and learn about the diverse wildlife.",
    price: 90,
    location: "Yala National Park, Southern Province",
    locationDescription: "Sri Lanka's most famous national park",
    duration: 8,
    maxGuests: 6,
    category: "Nature",
    included: [
      "4WD safari vehicle",
      "Professional naturalist guide",
      "Park entrance fees",
      "Packed lunch",
      "Binoculars",
      "Photography tips",
    ],
    requirements: [
      "Early morning start (5:30 AM)",
      "Comfortable clothing",
      "Camera with extra batteries",
      "Sun protection",
    ],
    languages: ["English", "Sinhala"],
    cancellationPolicy: "strict",
    status: "published",
    featured: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
]

const settings = {
  siteName: "Tour Sri Lanka",
  siteDescription: "Find and book unique travel experiences in Sri Lanka",
  logo: "/logo.png",
  contactEmail: "contact@toursrilanka.com",
  contactPhone: "+94 123 456 789",
  address: "123 Main Street, Colombo, Sri Lanka",
  socialLinks: {
    facebook: "https://facebook.com/toursrilanka",
    twitter: "https://twitter.com/toursrilanka",
    instagram: "https://instagram.com/toursrilanka",
  },
  colors: {
    primary: "#0070f3",
    secondary: "#ff4081",
  },
  currency: "LKR",
  bookingFee: 5,
  taxRate: 10,
  featuredExperiences: [],
  maintenanceMode: false,
}

// Import data
const importData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany()
    await Category.deleteMany()
    await Experience.deleteMany()
    await Settings.deleteMany()

    console.log("Data Destroyed...".red.inverse)

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    )

    // Create users
    const createdUsers = await User.insertMany(hashedUsers)
    console.log("Users imported...".green.inverse)

    // Create categories
    const createdCategories = await Category.insertMany(categories)
    console.log("Categories imported...".green.inverse)

    // Find host user for experiences
    const hostUser = createdUsers.find((user) => user.role === "host")

    // Create experiences with host reference
    const experiencesWithHost = experiences.map((exp) => ({
      ...exp,
      host: hostUser._id,
    }))

    const createdExperiences = await Experience.insertMany(experiencesWithHost)
    console.log("Experiences imported...".green.inverse)

    // Create settings
    await Settings.create(settings)
    console.log("Settings imported...".green.inverse)

    console.log("All data imported successfully!".green.inverse)
    console.log("\nLogin credentials:".yellow.bold)
    console.log("Admin: admin@toursrilanka.com / password123".cyan)
    console.log("Host: host@toursrilanka.com / password123".cyan)
    console.log("Guest: guest@toursrilanka.com / password123".cyan)

    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

// Destroy data
const destroyData = async () => {
  try {
    await connectDB()

    await User.deleteMany()
    await Category.deleteMany()
    await Experience.deleteMany()
    await Settings.deleteMany()

    console.log("Data Destroyed...".red.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
