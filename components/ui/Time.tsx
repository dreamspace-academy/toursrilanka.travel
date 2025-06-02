"use client";

import { useState } from "react";

const timeSlots = [
  { label: "Morning", description: "Starts before 12 pm" },
  { label: "Afternoon", description: "Starts after 12 pm" },
  { label: "Evening", description: "Starts after 5 pm" },
];

export default function TimeOfDayFilter() {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const toggleSelection = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const clearFilters = () => setSelectedTimes([]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      {/* Time Slots */}
      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <label key={slot.label} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={selectedTimes.includes(slot.label)}
              onChange={() => toggleSelection(slot.label)}
              className="w-5 h-5 mt-1 accent-[#FBBA00] border-gray-300 rounded-md" // Changed to custom color
            />
            <div>
              <p className="text-base">{slot.label}</p>
              <p className="text-sm text-gray-500">{slot.description}</p>
            </div>
          </label>
        ))}
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
