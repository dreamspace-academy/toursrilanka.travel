"use client";

import { useState } from "react";
import TourCard from "./ui/Card-old";

const tours = [
  {
    image: "/tour1.jpg",
    title: "Mystic Temples of Sri Lanka",
    rating: 4.9,
    reviews: 220,
    duration: "4 days",
    price: "$299",
  },
  {
    image: "/tour2.jpg",
    title: "Beachside Bliss Getaway",
    rating: 4.7,
    reviews: 180,
    duration: "5 days",
    price: "$399",
  },
  {
    image: "/tour3.jpg",
    title: "Wildlife Safari Adventure",
    rating: 4.8,
    reviews: 150,
    duration: "3 days",
    price: "$249",
  },
  // Add more unique tours up to 30
];

// Ensure we have 43 unique tour objects
while (tours.length < 43) {
  tours.push({
    image: `/tour${tours.length + 1}.jpg`,
    title: `Tour Package ${tours.length + 1}`,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // Random rating between 3.5 - 5.0
    reviews: Math.floor(Math.random() * 300) + 50, // Random reviews between 50 - 350
    duration: `${Math.floor(Math.random() * 5) + 2} days`, // Duration between 2 - 6 days
    price: `$${Math.floor(Math.random() * 200) + 199}`, // Price between $199 - $399
  });
}

export function ExperienceCard() {
  const [visibleTours, setVisibleTours] = useState(15); // Show 15 initially

  const showMoreTours = () => {
    setVisibleTours((prev) => Math.min(prev + 15, tours.length)); // Show 15 more
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Explore Tours</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tours.slice(0, visibleTours).map((tour, index) => (
          <TourCard key={index} {...tour} />
        ))}
      </div>

      {visibleTours < tours.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={showMoreTours}
            className="bg-[#FBBA00] text-black px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
