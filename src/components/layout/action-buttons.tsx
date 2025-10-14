"use client";

import { AddFolderButton } from "./add-folder-button";
import { AddCardButton } from "./add-card-button";

interface ActionButtonsProps {
  appView: "folders" | "cards";
  isAddFolderDialogOpen: boolean;
  setIsAddFolderDialogOpen: (open: boolean) => void;
  isAddCardDialogOpen: boolean;
  setIsAddCardDialogOpen: (open: boolean) => void;
  onGoBackToFolders: () => void;
  // Folder form props
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  onCreateFolder: () => void;
  // Card form props
  newFront: string;
  newBack: string;
  setNewFront: (front: string) => void;
  setNewBack: (back: string) => void;
  onAddCard: () => void;
}

export function ActionButtons({
  appView,
  isAddFolderDialogOpen,
  setIsAddFolderDialogOpen,
  isAddCardDialogOpen,
  setIsAddCardDialogOpen,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
  newFront,
  newBack,
  setNewFront,
  setNewBack,
  onAddCard,
}: ActionButtonsProps) {
  if (appView === "folders") {
    return (
      <AddFolderButton
        isOpen={isAddFolderDialogOpen}
        onOpenChange={setIsAddFolderDialogOpen}
        folderName={newFolderName}
        onFolderNameChange={setNewFolderName}
        onSubmit={onCreateFolder}
      />
    );
  }

  return (
    <AddCardButton
      isOpen={isAddCardDialogOpen}
      onOpenChange={setIsAddCardDialogOpen}
      front={newFront}
      back={newBack}
      onFrontChange={setNewFront}
      onBackChange={setNewBack}
      onSubmit={onAddCard}
    />
  );
}
