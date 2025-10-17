"use client";

import { Header } from "@/components/layout/header";
import { ActionButtons } from "@/components/layout/action-buttons";
import { useFlashcardState } from "@/contexts/flashcard-hooks";
import { Toaster } from "sonner";
import { CardsFocusView } from "@/components/views/cards-focus-view";

export default function FocusPage() {
  const { isHydrating } = useFlashcardState();

  if (isHydrating) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Toaster position="top-right" />
      <Header />
      <ActionButtons />
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        <CardsFocusView />
      </main>
    </div>
  );
}
