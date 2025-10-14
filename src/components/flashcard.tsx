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
      className="relative w-full h-[200px] sm:h-[220px] md:h-[280px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-center text-xs sm:text-sm dark:text-white">
            {front}
          </p>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-gray-600 rounded-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-center text-xs sm:text-sm">{back}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
