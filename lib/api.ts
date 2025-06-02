const API_URL = "/api/proxy"

// Auth services
export const registerUser = async (userData: any) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  return res.json()
}

export const loginUser = async (credentials: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
  return res.json()
}

export const getCurrentUser = async (token: string) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/auth/logout`)
  return res.json()
}

// Settings services
export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`)
  return res.json()
}

export const updateSettings = async (settingsData: any, token: string) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settingsData),
  })
  return res.json()
}

// Experience services
export const getExperiences = async (query = "") => {
  const res = await fetch(`${API_URL}/experiences${query}`)
  return res.json()
}

export const getExperienceById = async (id: string) => {
  const res = await fetch(`${API_URL}/experiences/${id}`)
  return res.json()
}

export const getFeaturedExperiences = async () => {
  const res = await fetch(`${API_URL}/experiences/featured`)
  return res.json()
}

export const getExperiencesByCategory = async (category: string) => {
  const res = await fetch(`${API_URL}/experiences/category/${category}`)
  return res.json()
}

export const createExperience = async (experienceData: any, token: string) => {
  const res = await fetch(`${API_URL}/experiences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(experienceData),
  })
  return res.json()
}

export const updateExperience = async (id: string, experienceData: any, token: string) => {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(experienceData),
  })
  return res.json()
}

export const deleteExperience = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

// Booking services
export const getBookings = async (token: string) => {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const getBookingById = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const getUserBookings = async (token: string) => {
  const res = await fetch(`${API_URL}/bookings/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const getHostBookings = async (token: string) => {
  const res = await fetch(`${API_URL}/bookings/host`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const createBooking = async (bookingData: any, token: string) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  })
  return res.json()
}

export const cancelBooking = async (id: string, reason: string, token: string) => {
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  })
  return res.json()
}

// Review services
export const getReviews = async (experienceId?: string) => {
  const url = experienceId ? `${API_URL}/experiences/${experienceId}/reviews` : `${API_URL}/reviews`
  const res = await fetch(url)
  return res.json()
}

export const createReview = async (experienceId: string, reviewData: any, token: string) => {
  const res = await fetch(`${API_URL}/experiences/${experienceId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  })
  return res.json()
}

// Category services
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`)
  return res.json()
}

export const getFeaturedCategories = async () => {
  const res = await fetch(`${API_URL}/categories/featured`)
  return res.json()
}

// User services
export const getUserFavorites = async (token: string) => {
  const res = await fetch(`${API_URL}/users/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const addFavorite = async (experienceId: string, token: string) => {
  const res = await fetch(`${API_URL}/users/favorites/${experienceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const removeFavorite = async (experienceId: string, token: string) => {
  const res = await fetch(`${API_URL}/users/favorites/${experienceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

// Analytics services
export const getDashboardAnalytics = async (token: string) => {
  const res = await fetch(`${API_URL}/analytics/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const getMonthlyRevenue = async (year: string, token: string) => {
  const res = await fetch(`${API_URL}/analytics/revenue?year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export const getHostAnalytics = async (token: string) => {
  const res = await fetch(`${API_URL}/analytics/host`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}
