"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Moon, Sun, List, Focus } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  appView: "folders" | "cards";
  currentFolderName?: string;
  viewMode: "list" | "focus";
  onViewModeChange: (mode: "list" | "focus") => void;
  hasCards: boolean;
}

export function Header({
  appView,
  currentFolderName,
  viewMode,
  onViewModeChange,
  hasCards,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="border-b-2 border-black dark:border-gray-700 py-4 sm:py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl truncate dark:text-white">
            Flashcards
          </h1>
          {appView === "cards" && currentFolderName && (
            <>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                {currentFolderName}
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
            <>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => onViewModeChange("list")}
                size="sm"
                className={
                  viewMode === "list"
                    ? "bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-gray-600 h-9 sm:h-10"
                    : "border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 sm:h-10"
                }
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === "focus" ? "default" : "outline"}
                onClick={() => onViewModeChange("focus")}
                size="sm"
                className={
                  viewMode === "focus"
                    ? "bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-gray-600 h-9 sm:h-10"
                    : "border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 sm:h-10"
                }
              >
                <Focus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Focus</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
