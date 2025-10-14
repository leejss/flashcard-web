"use client";

import { useState } from "react";
import { Header } from "./layout/header";
import { ActionButtons } from "./layout/action-buttons";
import { FoldersView } from "./views/folders-view";
import { CardsView } from "./views/cards-view";
import { Toaster, toast } from "sonner";
import { useDialog } from "@/contexts/dialog-context";
import { useFlashcard } from "@/contexts/flashcard-context";

type ViewMode = "list" | "focus";

export function AppContent() {
  const dialog = useDialog();
  const {
    appView,
    getCurrentFolder,
    setAppView,
    setCurrentFolderId,
    createFolder,
    createCard,
  } = useFlashcard();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const currentFolder = getCurrentFolder();
  const currentCards = currentFolder?.cards || [];

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName("");
      dialog.setIsAddFolderDialogOpen(false);
      toast.success(`Folder "${newFolderName}" created`);
    }
  };

  const handleAddCard = () => {
    if (newFront.trim() && newBack.trim() && currentFolder) {
      createCard(currentFolder.id, newFront, newBack);
      setNewFront("");
      setNewBack("");
      dialog.setIsAddCardDialogOpen(false);
      toast.success("Card added");
    }
  };

  const goBackToFolders = () => {
    setAppView("folders");
    setCurrentFolderId(null);
    setViewMode("list");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Toaster position="top-center" />

      <Header
        appView={appView}
        currentFolderName={currentFolder?.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasCards={currentCards.length > 0}
        onGoBackToFolders={goBackToFolders}
      />

      <ActionButtons
        appView={appView}
        isAddFolderDialogOpen={dialog.isAddFolderDialogOpen}
        setIsAddFolderDialogOpen={dialog.setIsAddFolderDialogOpen}
        isAddCardDialogOpen={dialog.isAddCardDialogOpen}
        setIsAddCardDialogOpen={dialog.setIsAddCardDialogOpen}
        onGoBackToFolders={goBackToFolders}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onCreateFolder={handleCreateFolder}
        newFront={newFront}
        newBack={newBack}
        setNewFront={setNewFront}
        setNewBack={setNewBack}
        onAddCard={handleAddCard}
      />

      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        {appView === "folders" ? <FoldersView /> : <CardsView viewMode={viewMode} />}
      </main>
    </div>
  );
}
