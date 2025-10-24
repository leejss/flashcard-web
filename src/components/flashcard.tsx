"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
}

const cardClasses = {
  flipped: {
    background: "bg-black dark:bg-white",
    border: "dark:border-gray-200",
    label: "text-gray-400 dark:text-gray-600",
    text: "text-white dark:text-black",
  },
  default: {
    background: "bg-white dark:bg-gray-900",
    border: "dark:border-gray-600",
    label: "text-gray-600 dark:text-gray-400",
    text: "text-black dark:text-white",
  },
};

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const classes = isFlipped ? cardClasses.flipped : cardClasses.default;

  return (
    <div
      className="relative w-full h-[100px] sm:h-[120px] md:h-[180px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative w-full h-full">
        {/* Card */}
        <div
          className={cn(
            "absolute select-none inset-0 flex items-center justify-center",
            "p-3 sm:p-4 md:p-6 border-2 border-black rounded-sm transition-colors",
            classes.background,
            classes.border,
          )}
        >
          <span
            className={cn(
              "absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4",
              "text-xs sm:text-xs md:text-sm font-semibold",
              classes.label,
            )}
          >
            {isFlipped ? "Answer" : "Question"}
          </span>
          <p className={cn("text-center text-xs sm:text-sm", classes.text)}>
            {isFlipped ? back : front}
          </p>
        </div>
      </div>
    </div>
  );
}
