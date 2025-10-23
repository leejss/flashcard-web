"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AddFolderButton } from "./add-folder-button";
import { AddCardButton } from "./add-card-button";
import { useFlashcardState } from "@/contexts/flashcard-hooks";
import { useFlashcardActions } from "@/contexts/flashcard-hooks";

export function ActionButtons() {
  const pathname = usePathname();
  const { state } = useFlashcardState();
  const { createFolder, createCard, triggerCardRefresh } =
    useFlashcardActions();
  const { currentFolderId } = state;

  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const isViewPage = pathname.startsWith("/view");
  const isFoldersPage = pathname === "/";

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName("");
      setIsAddFolderDialogOpen(false);
    }
  };

  const handleAddCard = () => {
    if (currentFolderId && newFront.trim() && newBack.trim()) {
      createCard(currentFolderId, newFront, newBack);
      triggerCardRefresh();
      setNewFront("");
      setNewBack("");
      setIsAddCardDialogOpen(false);
    }
  };

  if (isFoldersPage) {
    return (
      <AddFolderButton
        isOpen={isAddFolderDialogOpen}
        onOpenChange={setIsAddFolderDialogOpen}
        folderName={newFolderName}
        onFolderNameChange={setNewFolderName}
        onSubmit={handleCreateFolder}
      />
    );
  }

  if (isViewPage) {
    const handleCardDialogOpenChange = (open: boolean) => {
      setIsAddCardDialogOpen(open);
      if (!open) {
        setNewFront("");
        setNewBack("");
      }
    };

    return (
      <AddCardButton
        isOpen={isAddCardDialogOpen}
        onOpenChange={handleCardDialogOpenChange}
        front={newFront}
        back={newBack}
        onFrontChange={setNewFront}
        onBackChange={setNewBack}
        onSubmit={handleAddCard}
      />
    );
  }

  return null;
}
