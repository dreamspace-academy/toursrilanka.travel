"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider-old";

export default function PriceRangeSlider() {
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 2021]);

  const clearFilters = () => setPriceRange([20, 2021]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      {/* Header */}
      <p className="text-gray-600 text-center mb-4">
        The average price of an experience is <b>$53,531 MXN.</b>
      </p>

      {/* Slider */}
      <Slider
        value={priceRange}
        onChange={(value) => setPriceRange(value as [number, number])}
        min={20}
        max={2021}
        step={10}
        className="w-full text-pink-500"
      />

      {/* Min & Max Price Labels */}
      <div className="flex justify-between mt-2 text-gray-700">
        <div className="flex flex-col items-center">
          <span className="text-sm">Minimum</span>
          <div className="border rounded-full px-4 py-2 mt-1 text-lg font-medium">
            ${priceRange[0]}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm">Maximum</span>
          <div className="border rounded-full px-4 py-2 mt-1 text-lg font-medium">
            ${priceRange[1]}+
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button onClick={clearFilters} className="border border-black-500 text-black hover:bg-[#F6F6F6] px-4 py-2 rounded-lg">
          Clear
        </button>
        <button className="bg-[#FBBA00] text-black hover:bg-yellow-600 px-6 py-2 rounded-lg font-medium">
          Save
        </button>
      </div>
    </div>
  );
}
