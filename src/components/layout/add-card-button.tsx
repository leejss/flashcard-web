"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CardForm } from "@/components/forms/card-form";

interface AddCardButtonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  front: string;
  back: string;
  onFrontChange: (front: string) => void;
  onBackChange: (back: string) => void;
  onSubmit: () => void;
}

export function AddCardButton({
  isOpen,
  onOpenChange,
  front,
  back,
  onFrontChange,
  onBackChange,
  onSubmit,
}: AddCardButtonProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-4 z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 w-14 rounded-full p-0"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black dark:border-gray-600 max-w-3xl dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Add New Flashcard
          </DialogTitle>
        </DialogHeader>
        <CardForm
          front={front}
          back={back}
          onFrontChange={onFrontChange}
          onBackChange={onBackChange}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
