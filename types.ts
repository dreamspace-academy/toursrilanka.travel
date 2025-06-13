export interface Experience {
  id: string
  _id?: string
  title: string
  description: string
  longDescription?: string
  price: number
  rating: number
  reviewCount: number
  location: string
  locationDescription?: string
  imageUrl: string
  host: string
  duration: number
  maxGuests: number
  included?: string[]
  requirements?: string[]
  languages?: string[]
  category: string
  featured?: boolean
  status?: "draft" | "published" | "archived"
  cancellationPolicy?: "flexible" | "moderate" | "strict"
  createdAt?: string
  updatedAt?: string
  images?: ExperienceImage[]
}

export interface ExperienceImage {
  _id: string
  title: string
  description?: string
  data: string // Base64 encoded image data
  contentType: string
  size: number
  isMain: boolean
  uploadedAt: string
  url?: string // Generated URL for display
}

export interface Category {
  _id: string
  id: string
  name: string
  icon?: string
  featured?: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface User {
  _id: string
  id: string
  name: string
  email: string
  avatar?: string
  role: "guest" | "host" | "admin"
  status: "Active" | "Inactive" | "Suspended"
  isVerified: boolean
  bio?: string
  location?: string
  phoneNumber?: string
  dateOfBirth?: string
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}

export interface Booking {
  _id: string
  id: string
  experienceId: string
  userId: string
  date: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt?: string
  updatedAt?: string
}

export interface Review {
  _id: string
  id: string
  experienceId: string
  userId: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  count?: number
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface FormData {
  title: string
  description: string
  longDescription: string
  price: string
  duration: string
  location: string
  locationDescription: string
  category: string
  maxGuests: string
  included: string[]
  requirements: string[]
  languages: string[]
  cancellationPolicy: string
  status: string
  featured: boolean
}
