"use client";

import { useFlashcard } from "@/contexts/flashcard-context";
import { Toaster } from "sonner";
import { ActionButtons } from "./layout/action-buttons";
import { Header } from "./layout/header";
import { CardsView } from "./views/cards-view";
import { FoldersView } from "./views/folders-view";

export function AppContent() {
  const { appView, viewMode } = useFlashcard();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Toaster position="top-center" />
      <Header />

      <ActionButtons />

      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        {appView === "folders" ? (
          <FoldersView />
        ) : (
          <CardsView viewMode={viewMode} />
        )}
      </main>
    </div>
  );
}
