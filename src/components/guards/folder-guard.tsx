"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlashcardState } from "@/contexts/flashcard-hooks";
import type { ReactNode } from "react";

interface FolderGuardProps {
  children: ReactNode;
}

export function FolderGuard({ children }: FolderGuardProps) {
  const router = useRouter();
  const { isHydrating, state } = useFlashcardState();
  const { currentFolderId } = state;

  useEffect(() => {
    if (!isHydrating && !currentFolderId) {
      router.back();
    }
  }, [isHydrating, currentFolderId, router]);

  if (isHydrating || !currentFolderId) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return children;
}
