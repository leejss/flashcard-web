"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { FolderForm } from "@/components/forms/folder-form";

interface AddFolderButtonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onSubmit: () => void;
}

export function AddFolderButton({
  isOpen,
  onOpenChange,
  folderName,
  onFolderNameChange,
  onSubmit,
}: AddFolderButtonProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-4 z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 w-14 rounded-full p-0"
          size="lg"
        >
          <FolderPlus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black dark:border-gray-600 max-w-md dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <FolderForm
          folderName={folderName}
          onFolderNameChange={onFolderNameChange}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
