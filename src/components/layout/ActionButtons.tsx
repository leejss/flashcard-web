"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FolderPlus, Home, Plus } from "lucide-react";
import { useIsMobile } from "@/components/ui/use-mobile";
import { FolderForm } from "@/components/forms/FolderForm";
import { CardForm } from "@/components/forms/CardForm";

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
  onGoBackToFolders,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
  newFront,
  newBack,
  setNewFront,
  setNewBack,
  onAddCard,
}: ActionButtonsProps) {
  const isMobile = useIsMobile();

  if (appView === "folders") {
    return (
      <Dialog
        open={isAddFolderDialogOpen}
        onOpenChange={setIsAddFolderDialogOpen}
      >
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-4 sm:top-24 sm:right-8 sm:bottom-auto z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 w-14 sm:w-auto sm:h-14 rounded-full sm:rounded-md p-0 sm:px-6"
            size="lg"
          >
            <FolderPlus className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="border-2 border-black dark:border-gray-600 max-w-md dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Create New Folder
            </DialogTitle>
          </DialogHeader>
          <FolderForm
            folderName={newFolderName}
            onFolderNameChange={setNewFolderName}
            onSubmit={onCreateFolder}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={onGoBackToFolders}
        className="fixed bottom-6 left-4 sm:top-24 sm:left-8 sm:bottom-auto z-50 border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-lg h-12 sm:h-10"
      >
        <Home className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">All Folders</span>
      </Button>

      {isMobile ? (
        <Drawer
          open={isAddCardDialogOpen}
          onOpenChange={setIsAddCardDialogOpen}
        >
          <DrawerTrigger asChild>
            <Button
              className="fixed bottom-6 right-4 z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 w-14 rounded-full p-0"
              size="lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="border-2 border-black dark:border-gray-600 border-b-0 max-h-[90vh] dark:bg-gray-900">
            <DrawerHeader>
              <DrawerTitle className="dark:text-white">
                Add New Flashcard
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <CardForm
                front={newFront}
                back={newBack}
                onFrontChange={setNewFront}
                onBackChange={setNewBack}
                onSubmit={onAddCard}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open={isAddCardDialogOpen}
          onOpenChange={setIsAddCardDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="fixed top-24 right-8 z-50 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-gray-600 shadow-lg h-14 px-6"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-black dark:border-gray-600 max-w-3xl dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                Add New Flashcard
              </DialogTitle>
            </DialogHeader>
            <CardForm
              front={newFront}
              back={newBack}
              onFrontChange={setNewFront}
              onBackChange={setNewBack}
              onSubmit={onAddCard}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
