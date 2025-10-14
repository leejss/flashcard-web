"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FolderFormProps {
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

export function FolderForm({
  folderName,
  onFolderNameChange,
  onSubmit,
  isEdit = false,
}: FolderFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={isEdit ? "edit-folder-name" : "folder-name"}>
          Folder Name
        </Label>
        <Input
          id={isEdit ? "edit-folder-name" : "folder-name"}
          placeholder="Enter folder name..."
          value={folderName}
          onChange={(e) => onFolderNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="border-2 border-black dark:border-gray-600 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-gray-400 mt-2"
          autoFocus
        />
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 h-12"
      >
        {isEdit ? "Save Changes" : "Create Folder"}
      </Button>
    </div>
  );
}
