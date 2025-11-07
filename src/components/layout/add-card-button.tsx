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
        <Button className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 w-9 p-0">
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
