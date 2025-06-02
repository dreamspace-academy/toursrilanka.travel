"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

// Extend SliderProps to include className
interface SliderProps {
  value: number[];
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;  // Added className here
}

export function Slider({ value, onChange, min = 0, max = 1000, step = 10, className }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={`relative flex items-center select-none touch-none w-full h-6 ${className}`}  // Apply className here
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onChange}
    >
      <SliderPrimitive.Track className="bg-gray-300 relative grow rounded-full h-1">
        <SliderPrimitive.Range className="absolute bg-[#FBBA00] rounded-full h-full" />
      </SliderPrimitive.Track>
      {value.map((val, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block w-5 h-5 bg-white border border-gray-400 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
