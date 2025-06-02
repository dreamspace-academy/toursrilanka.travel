export interface Experience {
  id: string
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
  category: string
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  featured?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "host" | "admin"
}

export interface Booking {
  id: string
  experienceId: string
  userId: string
  date: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
}

export interface Review {
  id: string
  experienceId: string
  userId: string
  rating: number
  comment: string
  date: string
}

export interface VideoPreview {
  id: string
  experienceId: string
  url: string
  thumbnail?: string
}

export interface ExperienceVideo {
  _id: string
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: number
  isPublic?: boolean
  key: string
}
