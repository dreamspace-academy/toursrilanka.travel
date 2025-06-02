"use client";

import Filter from "../components/Filter";
import { useState, useEffect, useRef } from "react";
import { FaSlidersH, FaChevronDown, FaChevronUp } from "react-icons/fa";
import PriceRangeSlider from "../components/ui/Price";
import TimeOfDayFilter from "../components/ui/Time";

const categories = ["Adventure", "Art and culture", "Spiritual", "Village Tour", "Fishing Tour"];

export function CategoryFilter() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [isTimeOfDayOpen, setIsTimeOfDayOpen] = useState(false);

  const priceRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        priceRef.current && !priceRef.current.contains(event.target as Node) &&
        isPriceRangeOpen
      ) {
        setIsPriceRangeOpen(false);
      }

      if (
        timeRef.current && !timeRef.current.contains(event.target as Node) &&
        isTimeOfDayOpen
      ) {
        setIsTimeOfDayOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPriceRangeOpen, isTimeOfDayOpen]);

  return (
    <div className="sticky top-[81.5px] left-0 w-full z-40 bg-white flex items-center justify-between p-4 border-t border-b border-gray-300">
      {/* Left Section */}
      <div className="flex gap-10">
        {/* Price Range Button */}
        <div className="relative" ref={priceRef}>
          <button
            onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-gray-800 text-sm focus:ring-2 focus:ring-[#FBBA00]"
          >
            Price Range
            {isPriceRangeOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>
          {isPriceRangeOpen && (
            <div className="absolute top-full mt-1 left-0 z-10 w-64 bg-white shadow-lg rounded p-2">
              <PriceRangeSlider />
            </div>
          )}
        </div>

        {/* Time of Day Button */}
        <div className="relative" ref={timeRef}>
          <button
            onClick={() => setIsTimeOfDayOpen(!isTimeOfDayOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white text-gray-800 text-sm focus:ring-2 focus:ring-[#FBBA00]"
          >
            Time of Day
            {isTimeOfDayOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>
          {isTimeOfDayOpen && (
            <div className="absolute top-full mt-1 left-0 z-10 w-64 bg-white shadow-lg rounded p-2">
              <TimeOfDayFilter />
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 border-l border-gray-300 mx-4"></div>

      {/* Center Section (Category Filters) */}
      <div className="flex flex-wrap gap-10 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleFilter(category)}
            className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
              selectedFilters.includes(category)
                ? "bg-[#FBBA00] text-white border-[#FBBA00]"
                : "bg-white text-gray-800 border-gray-300"
            } hover:bg-[#FBBA00] hover:text-black`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-8 border-l border-gray-300 mx-4"></div>

      {/* Right Section (Filter Button) */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded bg-white text-gray-800 text-sm hover:border-[#FBBA00] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <FaSlidersH className="mr-2 transition-transform duration-300 ease-in-out hover:rotate-180" />
        Filters
      </button>

      {/* Filter Modal */}
      <Filter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
