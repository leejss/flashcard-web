"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Focus, List, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useFlashcard } from "@/contexts/flashcard-context";

export function Header() {
  const {
    appView,
    viewMode,
    setViewMode,
    setAppView,
    setCurrentFolderId,
    getCurrentFolder,
  } = useFlashcard();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const currentFolder = getCurrentFolder();
  const hasCards = (currentFolder?.cards.length || 0) > 0;

  const goBackToFolders = () => {
    setAppView("folders");
    setCurrentFolderId(null);
    setViewMode("list");
  };

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="py-4 sm:py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <button
            onClick={appView === "cards" ? goBackToFolders : undefined}
            className={`text-lg sm:text-2xl truncate dark:text-white ${
              appView === "cards"
                ? "hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors"
                : ""
            }`}
          >
            Flashcards
          </button>
          {appView === "cards" && currentFolder?.name && (
            <>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                {currentFolder.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 w-9 p-0"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>

          {/* View Mode Toggle - only show in cards view */}
          {appView === "cards" && hasCards && (
            <Button
              variant="outline"
              onClick={() =>
                setViewMode(viewMode === "list" ? "focus" : "list")
              }
              size="sm"
              className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 sm:h-10"
            >
              {viewMode === "list" ? (
                <>
                  <Focus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Focus</span>
                </>
              ) : (
                <>
                  <List className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">List</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
