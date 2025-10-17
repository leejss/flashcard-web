"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface FlashcardProps {
  front: string;
  back: string;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-[100px] sm:h-[120px] md:h-[180px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 50 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute select-none inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 text-xs sm:text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400">
            Question
          </span>
          <p className="text-center text-xs sm:text-sm dark:text-white">
            {front}
          </p>
        </div>

        {/* Back of card */}
        <div
          className="absolute select-none inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-gray-600 rounded-sm"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 text-xs sm:text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-600">
            Answer
          </span>
          <p className="text-center text-xs sm:text-sm">{back}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
