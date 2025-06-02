"use client"

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { useState } from "react";

interface TourCardProps {
  image: string;
  title: string;
  rating: number;
  reviews: number;
  duration: string;
  price: string;
}

export default function TourCard({ image, title, rating, reviews, duration, price }: TourCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition p-2">
      {/* Image Section */}
      <div className="relative">
        <Image 
          src={image} 
          alt={title} 
          width={500} 
          height={300} 
          className="w-full h-56 object-cover rounded-lg" 
        />
        <button 
          onClick={() => setIsFavorite(!isFavorite)} 
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
        >
          {isFavorite ? <IoHeart className="text-red-500 text-xl" /> : <IoHeartOutline className="text-xl" />}
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3">
        <div className="flex items-center text-sm text-gray-600">
          <FaStar className="text-yellow-500" />
          <span className="ml-1 font-medium">{rating}</span>
          <span className="ml-1">({reviews.toLocaleString()}) · {duration}</span>
        </div>

        <h3 className="font-semibold mt-2 text-lg">{title}</h3>

        <p className="text-gray-700 mt-1 text-sm">From <span className="font-medium">{price}</span> / person</p>
      </div>
    </div>
  );
}
