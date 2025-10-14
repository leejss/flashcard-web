"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/components/ui/use-mobile";
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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-6 right-4 z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 w-14 rounded-full p-0"
            size="lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-2 border-black dark:border-gray-600 border-b-0 max-h-[90vh] dark:bg-gray-900">
          <DrawerHeader>
            <DrawerTitle className="dark:text-white">
              Add New Flashcard
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <CardForm
              front={front}
              back={back}
              onFrontChange={onFrontChange}
              onBackChange={onBackChange}
              onSubmit={onSubmit}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed top-24 right-8 z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 px-6"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Card
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
