"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Focus,
  List,
  Moon,
  Sun,
  Settings,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useFlashcardActions } from "@/contexts/flashcard-hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { exportData, mergeImportedData, parseImportFile } from "@/utils/data";
import { toast } from "sonner";
import { folderDB } from "@/storage/idb/folders";
import { cardDB } from "@/storage/idb/cards";

export function Header() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentFolderId, setFolders, getCurrentFolder, clearAllData } =
    useFlashcardActions();
  const [mounted, setMounted] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
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

  const handleClickImportData = () => {
    inputFileRef.current?.click();
  };

  const handleClickClearAll = () => {
    setShowClearDialog(true);
  };

  const handleConfirmClearAll = async () => {
    try {
      await Promise.all([folderDB.clear(), cardDB.clear()]);
      clearAllData();
      toast.success("All data cleared");
      setShowClearDialog(false);
    } catch (error) {
      console.error("Failed to clear data", error);
      toast.error("Failed to clear data");
    }
  };

  return (
    <header className="py-4 sm:py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        {/* left */}
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

        {/* right */}
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
          {/* Setting Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9 w-9 p-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Data Management */}
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Data Management
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => exportData()}
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Export Data</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleClickImportData}
                className="cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span>Import Data</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Danger Zone */}
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Danger Zone
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                variant="destructive"
                onClick={handleClickClearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Clear All Data</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <input
        ref={inputFileRef}
        type="file"
        accept=".json"
        style={{
          display: "none",
        }}
        onChange={async (e) => {
          try {
            const file = e.target.files?.[0];
            if (!file) return;
            const data = await parseImportFile(file);
            const { folders } = await mergeImportedData(data, "overwrite");
            setFolders(folders);
            setCurrentFolderId(null);
            toast.success("Data imported successfully");
          } catch (error) {
            console.error("Failed to import data", error);
            toast.error("Failed to import data");
          }
        }}
      />

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All folders and cards will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
