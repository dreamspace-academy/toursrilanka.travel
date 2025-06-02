const experiences = [
  {
    title: "Sunset Sailing Adventure in Barcelona",
    description: "Experience the magic of Barcelona from the water with a sunset sailing trip along the coast.",
    longDescription:
      "Join us for an unforgettable sailing experience along the Barcelona coastline. As the sun begins to set, we'll sail out from Port Vell into the Mediterranean Sea, offering spectacular views of the city skyline bathed in golden light. Our experienced captain will share stories about Barcelona's maritime history while you enjoy complimentary drinks and Mediterranean snacks. Whether you're a sailing enthusiast or a first-timer, this relaxing 2-hour cruise is the perfect way to see Barcelona from a different perspective and create lasting memories.",
    price: 65,
    location: "Barcelona, Spain",
    locationDescription:
      "We'll meet at Port Vell Marina, right next to the Maremagnum shopping center. The exact meeting point will be sent after booking.",
    coordinates: {
      lat: 41.3775,
      lng: 2.1886,
    },
    imageUrl: "/placeholder.svg?height=300&width=400&text=Sunset+Sailing",
    duration: 2,
    maxGuests: 8,
    included: ["Drinks and snacks", "Life jackets", "Professional captain", "Photos of your experience"],
    category: "Sailing",
    featured: true,
    status: "published",
    availableDates: [
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        startTime: "18:00",
        endTime: "20:00",
        spotsAvailable: 8,
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startTime: "18:00",
        endTime: "20:00",
        spotsAvailable: 8,
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        startTime: "18:00",
        endTime: "20:00",
        spotsAvailable: 8,
      },
    ],
    languages: ["English", "Spanish", "Catalan"],
    requirements: ["No sailing experience required", "Suitable for all ages", "Not wheelchair accessible"],
    cancellationPolicy: "moderate",
  },
  {
    title: "Authentic Paella Cooking Class",
    description: "Learn to cook authentic Valencian paella with a local chef in a traditional Spanish kitchen.",
    longDescription:
      "Immerse yourself in Spanish culinary traditions with our authentic paella cooking class. You'll be welcomed into a traditional Spanish kitchen where our local chef will guide you through the process of creating the perfect Valencian paella. Learn about the history of this iconic dish, select fresh ingredients from local markets, and master the techniques that have been passed down through generations. After cooking, enjoy your creation paired with local wines in a communal dining experience. You'll leave with not just memories, but the skills to recreate this Spanish classic at home.",
    price: 85,
    location: "Valencia, Spain",
    locationDescription:
      "The class takes place in our cooking school in the historic center of Valencia, just a 5-minute walk from the Central Market.",
    coordinates: {
      lat: 39.4699,
      lng: -0.3763,
    },
    imageUrl: "/placeholder.svg?height=300&width=400&text=Paella+Cooking",
    duration: 3,
    maxGuests: 10,
    included: ["All ingredients", "Cooking equipment", "Recipe booklet", "Wine pairing", "Full meal"],
    category: "Cooking",
    featured: false,
    status: "published",
    availableDates: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        startTime: "11:00",
        endTime: "14:00",
        spotsAvailable: 10,
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startTime: "11:00",
        endTime: "14:00",
        spotsAvailable: 10,
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startTime: "11:00",
        endTime: "14:00",
        spotsAvailable: 10,
      },
    ],
    languages: ["English", "Spanish"],
    requirements: ["No cooking experience required", "Suitable for ages 12+", "Please inform of any food allergies"],
    cancellationPolicy: "flexible",
  },
  {
    title: "Hidden Paris: Secret Passages Walking Tour",
    description:
      "Discover the hidden covered passages of Paris with a local historian on this fascinating walking tour.",
    longDescription:
      "Step off the tourist trail and discover a side of Paris that most visitors never see. Our 'Hidden Paris' walking tour takes you through the city's secret covered passages - architectural marvels from the 19th century that offer a glimpse into Parisian life of the past. Led by a local historian, you'll explore these elegant glass-roofed arcades filled with unique boutiques, antiquarian bookshops, and charming cafés. Along the way, learn about the rich history of these passages and the role they played in Parisian society. This intimate small-group experience reveals the hidden stories and overlooked treasures of the City of Light.",
    price: 45,
    location: "Paris, France",
    locationDescription:
      "We'll meet outside the Palais Royal-Musée du Louvre metro station. Look for the guide with the blue umbrella.",
    coordinates: {
      lat: 48.8606,
      lng: 2.3376,
    },
    imageUrl: "/placeholder.svg?height=300&width=400&text=Paris+Passages",
    duration: 2.5,
    maxGuests: 8,
    included: [
      "Expert local guide",
      "Historical insights",
      "Map of secret passages",
      "Coffee break at a historic café",
    ],
    category: "Culture",
    featured: true,
    status: "published",
    availableDates: [
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        startTime: "10:00",
        endTime: "12:30",
        spotsAvailable: 8,
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        startTime: "10:00",
        endTime: "12:30",
        spotsAvailable: 8,
      },
      {
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        startTime: "10:00",
        endTime: "12:30",
        spotsAvailable: 8,
      },
    ],
    languages: ["English", "French"],
    requirements: ["Moderate walking required", "Suitable for ages 10+", "Not wheelchair accessible"],
    cancellationPolicy: "moderate",
  },
  {
    title: "Alpine Sunrise Yoga Retreat",
    description:
      "Start your day with an invigorating yoga session against the breathtaking backdrop of the Swiss Alps.",
    longDescription:
      "Experience the ultimate mind-body connection with our Alpine Sunrise Yoga Retreat. We'll begin our journey before dawn, taking a short hike to a secluded mountain viewpoint. As the first light breaks over the majestic Swiss Alps, our experienced yoga instructor will guide you through a gentle flow session designed to awaken your senses and connect you with the natural beauty surrounding you. The clean mountain air, the soft morning light, and the spectacular panoramic views create the perfect environment for deepening your practice. After the session, enjoy a nutritious breakfast picnic featuring local organic produce. This experience is suitable for all levels, from beginners to advanced practitioners.",
    price: 55,
    location: "Interlaken, Switzerland",
    locationDescription: "We'll meet at the Mountain Lodge in Interlaken. Transportation to the yoga spot is included.",
    coordinates: {
      lat: 46.6863,
      lng: 7.8632,
    },
    imageUrl: "/placeholder.svg?height=300&width=400&text=Alpine+Yoga",
    duration: 3,
    maxGuests: 12,
    included: ["Yoga mats and props", "Professional instructor", "Breakfast picnic", "Transportation to location"],
    category: "Fitness",
    featured: false,
    status: "published",
    availableDates: [
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startTime: "05:30",
        endTime: "08:30",
        spotsAvailable: 12,
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startTime: "05:30",
        endTime: "08:30",
        spotsAvailable: 12,
      },
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startTime: "05:30",
        endTime: "08:30",
        spotsAvailable: 12,
      },
    ],
    languages: ["English", "German"],
    requirements: ["Basic fitness level required", "Suitable for ages 16+", "Warm clothing recommended"],
    cancellationPolicy: "moderate",
  },
  {
    title: "Tuscan Vineyard Tour & Wine Tasting",
    description:
      "Explore family-owned vineyards in the heart of Tuscany and sample award-winning wines with expert guidance.",
    longDescription:
      "Embark on a journey through the rolling hills of Tuscany on our exclusive vineyard tour and wine tasting experience. You'll visit three family-owned wineries that have been producing exceptional wines for generations. Walk through sun-drenched vineyards as you learn about sustainable viticulture practices and the unique terroir that makes Tuscan wines so special. In ancient cellars, discover the art of winemaking from grape to bottle. The highlight of your day will be guided tastings of renowned Chianti Classico, Super Tuscans, and other regional specialties, perfectly paired with local artisanal cheeses, olive oils, and traditional Tuscan delicacies. Our sommelier will help you understand the complex flavors and aromas, making this an educational and delicious experience for wine enthusiasts of all levels.",
    price: 120,
    location: "Florence, Italy",
    locationDescription:
      "We'll depart from central Florence in our comfortable air-conditioned van. The exact meeting point will be provided after booking.",
    coordinates: {
      lat: 43.7696,
      lng: 11.2558,
    },
    imageUrl: "/placeholder.svg?height=300&width=400&text=Tuscan+Wine",
    duration: 6,
    maxGuests: 8,
    included: [
      "Transportation from Florence",
      "All wine tastings",
      "Food pairings",
      "Expert sommelier guide",
      "Vineyard tours",
    ],
    category: "Drinks",
    featured: true,
    status: "published",
    availableDates: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        startTime: "10:00",
        endTime: "16:00",
        spotsAvailable: 8,
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        startTime: "10:00",
        endTime: "16:00",
        spotsAvailable: 8,
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startTime: "10:00",
        endTime: "16:00",
        spotsAvailable: 8,
      },
    ],
    languages: ["English", "Italian"],
    requirements: ["Must be 18+ to participate", "Not suitable for pregnant women", "Lunch included"],
    cancellationPolicy: "strict",
  },
]

module.exports = experiences
