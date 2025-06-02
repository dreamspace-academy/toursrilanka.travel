"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { Slider } from "@/components/ui/slider-old";

const activityTypes = ["Adventure", "Art and culture", "Spiritual", "Village Tour", "Fishing Tour"];
const timeDay = ["Morning", "Afternoon", "Evening"];

export default function FilterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 2021]);
  const [showMore, setShowMore] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setPriceRange([20, 2021]);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} aria-hidden="true"></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-[90%] max-w-lg p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose}>
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 my-4" />

        {/* Activity Type */}
        <div>
          <h3 className="font-medium mb-2">Activity type</h3>
          {activityTypes.slice(0, showMore ? activityTypes.length : 4).map((type) => (
            <label key={type} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedFilters.includes(type)}
                onChange={() => toggleFilter(type)}
                className="w-4 h-4 accent-[#FBBA00]"
              />
              {type}
            </label>
          ))}
          <button className="text-[#FBBA00] text-sm" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show less ▲" : "Show more ▼"}
          </button>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 my-4" />

        {/* Price Range */}
        <div>
          <h3 className="font-medium">Price range</h3>
          <p className="text-sm text-gray-500">The average price of an experience is $53,531 MXN.</p>
          <Slider value={priceRange} onChange={(value) => setPriceRange(value as [number, number])} min={20} max={2021} step={10} />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Minimum: ${priceRange[0]}</span>
            <span>Maximum: ${priceRange[1]}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 my-4" />

        {/* Time of Day */}
        <div>
          <h3 className="font-medium mb-2">Time of Day</h3>
          {timeDay.map((type) => (
            <label key={type} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedFilters.includes(type)}
                onChange={() => toggleFilter(type)}
                className="w-4 h-4 accent-[#FBBA00]"
              />
              {type}
            </label>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-gray-300 my-4" />

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={clearFilters}
            className="border border-black-500 text-black hover:bg-[#F6F6F6] px-4 py-2 rounded-lg">
            Clear
          </button>
          <button className="bg-[#FBBA00] text-black hover:bg-yellow-600 px-4 py-2 rounded-lg">Show Results</button>
        </div>
      </div>
    </Dialog>
  );
}
