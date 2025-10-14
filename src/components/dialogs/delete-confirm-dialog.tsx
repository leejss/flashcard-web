"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "folder" | "card";
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  type,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-black dark:border-gray-600 dark:bg-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-white">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-gray-400">
            {type === "folder"
              ? "This will permanently delete the folder and all its cards. This action cannot be undone."
              : "This will permanently delete this card. This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-2 border-black dark:border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
