"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CardFormProps {
  front: string;
  back: string;
  onFrontChange: (front: string) => void;
  onBackChange: (back: string) => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

export function CardForm({
  front,
  back,
  onFrontChange,
  onBackChange,
  onSubmit,
  isEdit = false,
}: CardFormProps) {
  return (
    <div className="space-y-4 p-4 sm:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Front Side */}
        <div className="space-y-2">
          <Label>Front (Question)</Label>
          <div className="border-2 border-black dark:border-gray-600 rounded-lg p-4 sm:p-6 bg-white dark:bg-gray-900 min-h-[160px] sm:min-h-[200px] flex flex-col">
            <Textarea
              placeholder="Enter the question or prompt..."
              value={front}
              onChange={(e) => onFrontChange(e.target.value)}
              className="border-0 focus-visible:ring-0 flex-1 resize-none p-0 bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        {/* Back Side */}
        <div className="space-y-2">
          <Label>Back (Answer)</Label>
          <div className="border-2 border-black dark:border-gray-600 rounded-lg p-4 sm:p-6 bg-black dark:bg-white text-white dark:text-black min-h-[160px] sm:min-h-[200px] flex flex-col">
            <Textarea
              placeholder="Enter the answer..."
              value={back}
              onChange={(e) => onBackChange(e.target.value)}
              className="border-0 focus-visible:ring-0 flex-1 resize-none p-0 bg-black dark:bg-white text-white dark:text-black placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 h-12"
      >
        {isEdit ? "Save Changes" : "Add Card"}
      </Button>
    </div>
  );
}
