import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover-old";
import { Input } from "@/components/ui/input-old";
import { Button } from "@/components/ui/button-old";
import { Calendar } from "@/components/ui/calendar-old";
import { format } from "date-fns";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const suggestedDestinations = ["Paris", "Tokyo", "New York", "Rome", "Dubai"];
const destinations = ["London", "Berlin", "Sydney", "Cape Town", "Toronto", "Bangkok"];

export const SearchBar: React.FC = () => {
  const [destination, setDestination] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [dates, setDates] = useState<DateRange>({ from: undefined, to: undefined });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  const handleDestinationSelect = (place: string) => {
    setDestination(place);
    setRecentSearches((prev) => {
      const updated = [place, ...prev.filter((p) => p !== place)];
      return updated.slice(0, 5); // Keep only the last 5
    });
  };

  return (
    <div className="flex items-center bg-white border rounded-full shadow-md px-4 py-2 gap-4">
      {/* Destination Input with Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-4 py-2 text-gray-700 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            {destination || "Select Destination"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-xl max-h-[300px] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search for a destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="text-gray-700"
            />

            <div>
              <h3 className="text-sm font-semibold">Recent Searches</h3>
              <div className="flex flex-col gap-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((place) => (
                    <Button
                      key={place}
                      variant="ghost"
                      className="text-sm text-left justify-start font-normal"
                      onClick={() => handleDestinationSelect(place)}
                    >
                      {place}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent searches</p>
                )}
              </div>
            </div>

            <div className="w-full border-t border-gray-300 my-1"></div>

            <div>
              <h3 className="text-sm font-semibold">Suggested Destinations</h3>
              <div className="flex flex-col gap-2">
                {suggestedDestinations.map((place) => (
                  <Button
                    key={place}
                    variant="ghost"
                    className="text-sm text-left justify-start font-normal"
                    onClick={() => handleDestinationSelect(place)}
                  >
                    {place}
                  </Button>
                ))}
              </div>
            </div>

            <div className="w-full border-t border-gray-300 my-1"></div>

            <div>
              <h3 className="text-sm font-semibold">All Destinations</h3>
              <div className="flex flex-col gap-2">
                {destinations.map((place) => (
                  <Button
                    key={place}
                    variant="ghost"
                    className="text-sm text-left justify-start font-normal"
                    onClick={() => handleDestinationSelect(place)}
                  >
                    {place}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="h-6 w-px bg-gray-300"></div>

      {/* Date Picker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <button className="px-4 py-2 text-gray-700 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            {dates.from
              ? `${format(dates.from, "MMM dd")} - ${dates.to ? format(dates.to, "MMM dd") : "?"}`
              : "Add dates"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[540px] p-4 bg-white rounded-lg shadow-xl">
          <div className="flex gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Start Date</h3>
              <Calendar
                selected={dates.from}
                onSelect={(date) => setDates({ from: date, to: dates.to })}
                mode="single"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">End Date</h3>
              <Calendar
                selected={dates.to}
                onSelect={(date) => setDates({ from: dates.from, to: date })}
                mode="single"
                disabled={dates.from ? { before: dates.from } : undefined}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="h-6 w-px bg-gray-300"></div>

      {/* Guest Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-4 py-2 text-gray-700 flex items-center gap-2">
            <FaUsers className="text-gray-500" />
            {`${guests.adults} Adults, ${guests.children} Children, ${guests.infants} Infants`}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4 bg-white rounded-lg shadow-xl">
          {["adults", "children", "infants"].map((type) => (
            <div className="flex justify-between items-center mt-2" key={type}>
              <span className="capitalize">{type}</span>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  onClick={() =>
                    setGuests((prev) => ({
                      ...prev,
                      [type]: Math.max(type === "adults" ? 1 : 0, prev[type as keyof typeof guests] - 1),
                    }))
                  }
                >
                  -
                </Button>
                <span>{guests[type as keyof typeof guests]}</span>
                <Button
                  size="icon"
                  onClick={() =>
                    setGuests((prev) => ({
                      ...prev,
                      [type]: prev[type as keyof typeof guests] + 1,
                    }))
                  }
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button className="bg-[#FBBA00] text-white px-4 py-2 rounded-full hover:bg-yellow-600">
        <FaSearch />
      </Button>
    </div>
  );
};
