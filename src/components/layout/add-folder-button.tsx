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
          size="lg"
          className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 w-9 p-0"
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
