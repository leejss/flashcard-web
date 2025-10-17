"use client";

import { useState } from "react";
import { AddFolderButton } from "./add-folder-button";
import { AddCardButton } from "./add-card-button";
import { useFlashcardState } from "@/contexts/flashcard-hooks";
import { useFlashcardActions } from "@/contexts/flashcard-hooks";

export function ActionButtons() {
  const { state } = useFlashcardState();
  const { createFolder, createCard } = useFlashcardActions();
  const { appView, currentFolderId } = state;
  
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

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
      setNewFront("");
      setNewBack("");
      setIsAddCardDialogOpen(false);
    }
  };

  if (appView === "folders") {
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
