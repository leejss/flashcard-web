"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderForm } from "../forms/folder-form";

interface EditFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  onSubmit: (name: string) => void;
}

export function EditFolderDialog({
  open,
  onOpenChange,
  folderName: initialName,
  onSubmit,
}: EditFolderDialogProps) {
  const [folderName, setFolderName] = useState(initialName);

  const handleSubmit = () => {
    if (folderName.trim()) {
      onSubmit(folderName);
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (open) setFolderName(initialName);
      }}
    >
      <DialogContent className="border-2 border-black dark:border-gray-600 max-w-md dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Edit Folder Name
          </DialogTitle>
        </DialogHeader>
        <FolderForm
          folderName={folderName}
          onFolderNameChange={setFolderName}
          onSubmit={handleSubmit}
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
}
