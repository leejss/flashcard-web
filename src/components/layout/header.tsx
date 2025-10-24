"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Focus, List, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useFlashcardActions } from "@/contexts/flashcard-hooks";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentFolderId, getCurrentFolder } = useFlashcardActions();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const currentFolder = getCurrentFolder();
  const hasCards = (currentFolder?.cardCount || 0) > 0;
  const isViewPage = pathname.startsWith("/view");
  const isListView = pathname === "/view/list";

  const goBackToFolders = () => {
    setCurrentFolderId(null);
    router.push("/");
  };

  const toggleViewMode = () => {
    if (isListView) {
      router.push("/view/focus");
    } else {
      router.push("/view/list");
    }
  };

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
            onClick={isViewPage ? goBackToFolders : undefined}
            className={`text-lg sm:text-2xl font-mono truncate dark:text-white ${
              isViewPage
                ? "hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors"
                : ""
            }`}
          >
            Flashcards
          </button>
          {isViewPage && currentFolder?.name && (
            <>
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
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
          {isViewPage && hasCards && (
            <Button
              variant="outline"
              onClick={toggleViewMode}
              size="sm"
              className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 sm:h-10"
            >
              {isListView ? (
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
