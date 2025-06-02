import bcrypt from "bcryptjs"

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
    isVerified: true,
    status: "Active",
  },
  {
    name: "Miguel Rodriguez",
    email: "miguel@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "host",
    bio: "Professional sailing instructor with over 10 years of experience.",
    isVerified: true,
    status: "Active",
  },
  {
    name: "Carmen Vega",
    email: "carmen@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "host",
    bio: "Chef and culinary instructor specializing in Spanish cuisine.",
    isVerified: true,
    status: "Active",
  },
  {
    name: "Sophie Dubois",
    email: "sophie@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "host",
    bio: "Historian and lifelong Parisian with a passion for sharing hidden gems.",
    isVerified: true,
    status: "Active",
  },
  {
    name: "Anna Schmidt",
    email: "anna@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "host",
    bio: "Certified yoga instructor and wellness coach.",
    isVerified: true,
    status: "Active",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "guest",
    isVerified: true,
    status: "Active",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "guest",
    isVerified: true,
    status: "Active",
  },
]

module.exports = users
