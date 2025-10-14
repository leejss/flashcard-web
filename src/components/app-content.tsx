"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "./flashcard";
import { FolderCard } from "./folder-card";
import { EmptyState } from "./empty-state";
import { Header } from "./layout/header";
import { ActionButtons } from "./layout/action-buttons";
import { FolderForm } from "./forms/folder-form";
import { CardForm } from "./forms/card-form";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/components/ui/use-mobile";
import { Toaster, toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Shuffle,
  CheckCircle,
  XCircle,
  FolderOpen,
  FileQuestion,
} from "lucide-react";
import { useDialog } from "@/contexts/dialog-context";

interface Card {
  id: string;
  front: string;
  back: string;
  correct: number;
  incorrect: number;
  lastReviewed?: string;
}

interface Folder {
  id: string;
  name: string;
  cards: Card[];
}

type ViewMode = "list" | "focus";
type AppView = "folders" | "cards";

export function AppContent() {
  const isMobile = useIsMobile();
  const dialog = useDialog();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [appView, setAppView] = useState<AppView>("folders");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "folder" | "card";
    id: string | number;
  } | null>(null);

  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  const currentFolder = folders.find((f) => f.id === currentFolderId);
  const currentCards = currentFolder?.cards || [];

  // Get cards in display order (shuffled or normal)
  const displayCards =
    isShuffled && shuffledIndices.length > 0
      ? shuffledIndices.map((i) => currentCards[i])
      : currentCards;

  const currentCard = displayCards[currentCardIndex];

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flashcard-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFolders(data);
      } catch (e) {
        console.error("Failed to load data:", e);
      }
    } else {
      // Initial demo data
      setFolders([
        {
          id: "1",
          name: "Web Development",
          cards: [
            {
              id: "1-1",
              front: "What is React?",
              back: "A JavaScript library for building user interfaces",
              correct: 0,
              incorrect: 0,
            },
            {
              id: "1-2",
              front: "What is TypeScript?",
              back: "A typed superset of JavaScript that compiles to plain JavaScript",
              correct: 0,
              incorrect: 0,
            },
            {
              id: "1-3",
              front: "What is Tailwind CSS?",
              back: "A utility-first CSS framework for rapidly building custom designs",
              correct: 0,
              incorrect: 0,
            },
          ],
        },
        {
          id: "2",
          name: "JavaScript Basics",
          cards: [
            {
              id: "2-1",
              front: "What is a closure?",
              back: "A function that has access to variables in its outer scope",
              correct: 0,
              incorrect: 0,
            },
            {
              id: "2-2",
              front: "What is hoisting?",
              back: "JavaScript's default behavior of moving declarations to the top",
              correct: 0,
              incorrect: 0,
            },
          ],
        },
      ]);
    }
  }, []);

  // Save data to localStorage whenever folders change
  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem("flashcard-data", JSON.stringify(folders));
    }
  }, [folders]);

  // Keyboard shortcuts
  useEffect(() => {
    if (appView !== "cards" || viewMode !== "focus") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "Escape":
          e.preventDefault();
          setViewMode("list");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appView, viewMode, currentCardIndex, currentCards.length]);

  // Shuffle function
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    if (!isShuffled) {
      // Enable shuffle
      const indices = currentCards.map((_, i) => i);
      const shuffled = shuffleArray(indices);
      setShuffledIndices(shuffled);
      setCurrentCardIndex(0);
      setIsShuffled(true);
      toast.success("Shuffle mode enabled");
    } else {
      // Disable shuffle
      setIsShuffled(false);
      setShuffledIndices([]);
      setCurrentCardIndex(0);
      toast.success("Shuffle mode disabled");
    }
  };

  // Folder operations
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName,
        cards: [],
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      dialog.setIsAddFolderDialogOpen(false);
      toast.success(`Folder "${newFolderName}" created`);
    }
  };

  const handleEditFolder = () => {
    if (newFolderName.trim() && editingFolderId) {
      setFolders(
        folders.map((f) =>
          f.id === editingFolderId ? { ...f, name: newFolderName } : f,
        ),
      );
      toast.success("Folder renamed");
      setNewFolderName("");
      setEditingFolderId(null);
      dialog.setIsEditFolderDialogOpen(false);
    }
  };

  const confirmDeleteFolder = (folderId: string) => {
    setDeleteTarget({ type: "folder", id: folderId });
    dialog.setDeleteConfirmOpen(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    setFolders(folders.filter((f) => f.id !== folderId));
    toast.success(`Folder "${folder?.name}" deleted`);
    dialog.setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const openEditFolderDialog = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setEditingFolderId(folderId);
      setNewFolderName(folder.name);
      dialog.setIsEditFolderDialogOpen(true);
    }
  };

  const openFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    setCurrentCardIndex(0);
    setAppView("cards");
    setViewMode("list");
    setIsShuffled(false);
    setShuffledIndices([]);
  };

  const goBackToFolders = () => {
    setAppView("folders");
    setCurrentFolderId(null);
    setIsShuffled(false);
    setShuffledIndices([]);
  };

  // Card operations
  const handleNext = () => {
    if (currentCardIndex < displayCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleAddCard = () => {
    if (newFront.trim() && newBack.trim() && currentFolderId) {
      const newCard: Card = {
        id: Date.now().toString(),
        front: newFront,
        back: newBack,
        correct: 0,
        incorrect: 0,
      };
      setFolders(
        folders.map((f) =>
          f.id === currentFolderId ? { ...f, cards: [...f.cards, newCard] } : f,
        ),
      );
      setNewFront("");
      setNewBack("");
      dialog.setIsAddCardDialogOpen(false);
      toast.success("Card added");
      setCurrentCardIndex(currentCards.length);
    }
  };

  const handleEditCard = () => {
    if (
      newFront.trim() &&
      newBack.trim() &&
      editingCardIndex !== null &&
      currentFolderId
    ) {
      setFolders(
        folders.map((f) => {
          if (f.id === currentFolderId) {
            const updatedCards = [...f.cards];
            updatedCards[editingCardIndex] = {
              ...updatedCards[editingCardIndex],
              front: newFront,
              back: newBack,
            };
            return { ...f, cards: updatedCards };
          }
          return f;
        }),
      );
      setNewFront("");
      setNewBack("");
      dialog.setIsEditCardDialogOpen(false);
      setEditingCardIndex(null);
      toast.success("Card updated");
    }
  };

  const confirmDeleteCard = (index: number) => {
    setDeleteTarget({ type: "card", id: index });
    dialog.setDeleteConfirmOpen(true);
  };

  const handleDeleteCard = (index: number) => {
    if (currentFolderId) {
      setFolders(
        folders.map((f) => {
          if (f.id === currentFolderId) {
            const updatedCards = f.cards.filter((_, i) => i !== index);
            return { ...f, cards: updatedCards };
          }
          return f;
        }),
      );
      if (
        currentCardIndex >= currentCards.length - 1 &&
        currentCards.length > 1
      ) {
        setCurrentCardIndex(currentCards.length - 2);
      } else if (currentCards.length === 1) {
        setCurrentCardIndex(0);
      }
      toast.success("Card deleted");
      dialog.setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const openEditCardDialog = (index: number) => {
    setEditingCardIndex(index);
    setNewFront(currentCards[index].front);
    setNewBack(currentCards[index].back);
    dialog.setIsEditCardDialogOpen(true);
  };

  // Answer tracking
  const handleAnswer = (isCorrect: boolean) => {
    if (!currentFolderId || !currentCard) return;

    const actualIndex = isShuffled
      ? shuffledIndices[currentCardIndex]
      : currentCardIndex;

    setFolders(
      folders.map((f) => {
        if (f.id === currentFolderId) {
          const updatedCards = [...f.cards];
          updatedCards[actualIndex] = {
            ...updatedCards[actualIndex],
            correct: isCorrect
              ? updatedCards[actualIndex].correct + 1
              : updatedCards[actualIndex].correct,
            incorrect: !isCorrect
              ? updatedCards[actualIndex].incorrect + 1
              : updatedCards[actualIndex].incorrect,
            lastReviewed: new Date().toISOString(),
          };
          return { ...f, cards: updatedCards };
        }
        return f;
      }),
    );

    toast.success(isCorrect ? "Marked as correct!" : "Marked as incorrect");

    // Auto-advance to next card
    if (currentCardIndex < displayCards.length - 1) {
      setTimeout(() => handleNext(), 300);
    }
  };

  // Calculate answer rate for a card
  const getAnswerRate = (card: Card) => {
    const total = card.correct + card.incorrect;
    if (total === 0) return null;
    return Math.round((card.correct / total) * 100);
  };

  // Calculate folder statistics
  const getFolderStats = (folder: Folder) => {
    const totalReviews = folder.cards.reduce(
      (sum, card) => sum + card.correct + card.incorrect,
      0,
    );
    const totalCorrect = folder.cards.reduce(
      (sum, card) => sum + card.correct,
      0,
    );
    const avgRate =
      totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : null;
    return { totalReviews, avgRate };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Toaster position="top-center" />

      {/* Header */}
      <Header
        appView={appView}
        currentFolderName={currentFolder?.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasCards={currentCards.length > 0}
      />

      {/* Fixed Action Buttons */}
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

      {/* Edit Folder Dialog */}
      <Dialog
        open={dialog.isEditFolderDialogOpen}
        onOpenChange={dialog.setIsEditFolderDialogOpen}
      >
        <DialogContent className="border-2 border-black dark:border-gray-600 max-w-md dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Edit Folder Name
            </DialogTitle>
          </DialogHeader>
          <FolderForm
            folderName={newFolderName}
            onFolderNameChange={setNewFolderName}
            onSubmit={handleEditFolder}
            isEdit
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={dialog.deleteConfirmOpen}
        onOpenChange={dialog.setDeleteConfirmOpen}
      >
        <AlertDialogContent className="border-2 border-black dark:border-gray-600 dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              {deleteTarget?.type === "folder"
                ? "This will permanently delete the folder and all its cards. This action cannot be undone."
                : "This will permanently delete this card. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black dark:border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget?.type === "folder") {
                  handleDeleteFolder(deleteTarget.id as string);
                } else if (deleteTarget?.type === "card") {
                  handleDeleteCard(deleteTarget.id as number);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        {appView === "folders" ? (
          // Folders View
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {folders.length} folder{folders.length !== 1 ? "s" : ""}
              </p>
            </div>
            {folders.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {folders.map((folder) => {
                  const stats = getFolderStats(folder);
                  return (
                    <div key={folder.id}>
                      <FolderCard
                        name={folder.name}
                        cardCount={folder.cards.length}
                        onClick={() => openFolder(folder.id)}
                        onEdit={() => openEditFolderDialog(folder.id)}
                        onDelete={() => confirmDeleteFolder(folder.id)}
                      />
                      {stats.avgRate !== null && (
                        <div className="text-center mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {stats.avgRate}% correct
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={FolderOpen}
                title="No folders yet"
                description="Create your first folder to start organizing your flashcards and begin learning!"
              />
            )}
          </div>
        ) : (
          // Cards View (List or Focus)
          <>
            {currentCards.length > 0 ? (
              <>
                {/* List View */}
                {viewMode === "list" && (
                  <div className="max-w-7xl mx-auto">
                    <div className="mb-4 sm:mb-6 flex justify-between items-center">
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {currentCards.length} flashcard
                        {currentCards.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {currentCards.map((card, index) => {
                        const answerRate = getAnswerRate(card);
                        return (
                          <div key={card.id} className="relative">
                            <Flashcard front={card.front} back={card.back} />
                            {answerRate !== null && (
                              <div className="text-center mt-1 mb-1">
                                <span
                                  className={`text-xs ${
                                    answerRate >= 70
                                      ? "text-green-600 dark:text-green-500"
                                      : answerRate >= 40
                                      ? "text-yellow-600 dark:text-yellow-500"
                                      : "text-red-600 dark:text-red-500"
                                  }`}
                                >
                                  {answerRate}% correct (
                                  {card.correct + card.incorrect} reviews)
                                </span>
                              </div>
                            )}
                            <div className="flex justify-end gap-2 mt-2">
                              {isMobile ? (
                                <Drawer
                                  open={
                                    dialog.isEditCardDialogOpen &&
                                    editingCardIndex === index
                                  }
                                  onOpenChange={(open) => {
                                    dialog.setIsEditCardDialogOpen(open);
                                    if (!open) setEditingCardIndex(null);
                                  }}
                                >
                                  <DrawerTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditCardDialog(index)}
                                      className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-9"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                  </DrawerTrigger>
                                  <DrawerContent className="border-2 border-black dark:border-gray-600 border-b-0 max-h-[90vh] dark:bg-gray-900">
                                    <DrawerHeader>
                                      <DrawerTitle className="dark:text-white">
                                        Edit Flashcard
                                      </DrawerTitle>
                                    </DrawerHeader>
                                    <div className="overflow-y-auto">
                                      <CardForm
                                        front={newFront}
                                        back={newBack}
                                        onFrontChange={setNewFront}
                                        onBackChange={setNewBack}
                                        onSubmit={handleEditCard}
                                        isEdit
                                      />
                                    </div>
                                  </DrawerContent>
                                </Drawer>
                              ) : (
                                <Dialog
                                  open={
                                    dialog.isEditCardDialogOpen &&
                                    editingCardIndex === index
                                  }
                                  onOpenChange={(open) => {
                                    dialog.setIsEditCardDialogOpen(open);
                                    if (!open) setEditingCardIndex(null);
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditCardDialog(index)}
                                      className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="border-2 border-black dark:border-gray-600 max-w-3xl dark:bg-gray-900">
                                    <DialogHeader>
                                      <DialogTitle className="dark:text-white">
                                        Edit Flashcard
                                      </DialogTitle>
                                    </DialogHeader>
                                    <CardForm
                                      front={newFront}
                                      back={newBack}
                                      onFrontChange={setNewFront}
                                      onBackChange={setNewBack}
                                      onSubmit={handleEditCard}
                                      isEdit
                                    />
                                  </DialogContent>
                                </Dialog>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDeleteCard(index)}
                                className="border-2 border-black dark:border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors h-9"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Focus View */}
                {viewMode === "focus" && currentCard && (
                  <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] sm:min-h-[calc(100vh-12rem)]">
                    {/* Controls Bar */}
                    <div className="flex items-center gap-4 w-full justify-between">
                      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <span>
                          {currentCardIndex + 1} / {displayCards.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                          Shuffle
                        </span>
                        <Switch
                          checked={isShuffled}
                          onCheckedChange={toggleShuffle}
                        />
                        <Shuffle
                          className={`w-4 h-4 ${
                            isShuffled
                              ? "text-black dark:text-white"
                              : "text-gray-400 dark:text-gray-600"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Answer Rate */}
                    {getAnswerRate(currentCard) !== null && (
                      <div className="text-center">
                        <span
                          className={`text-sm ${
                            getAnswerRate(currentCard)! >= 70
                              ? "text-green-600 dark:text-green-500"
                              : getAnswerRate(currentCard)! >= 40
                              ? "text-yellow-600 dark:text-yellow-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {getAnswerRate(currentCard)}% correct rate
                        </span>
                      </div>
                    )}

                    {/* Flashcard */}
                    <div className="w-full">
                      <Flashcard
                        front={currentCard.front}
                        back={currentCard.back}
                      />
                    </div>

                    {/* Instruction */}
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      Click card to flip • Use ← → arrow keys to navigate
                    </p>

                    {/* Answer Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleAnswer(false)}
                        variant="outline"
                        className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Incorrect
                      </Button>
                      <Button
                        onClick={() => handleAnswer(true)}
                        variant="outline"
                        className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Correct
                      </Button>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentCardIndex === 0}
                        className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 h-10 sm:h-auto"
                      >
                        <ChevronLeft className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>

                      <div className="flex gap-2">
                        {isMobile ? (
                          <Drawer
                            open={
                              dialog.isEditCardDialogOpen &&
                              editingCardIndex ===
                                (isShuffled
                                  ? shuffledIndices[currentCardIndex]
                                  : currentCardIndex)
                            }
                            onOpenChange={(open) => {
                              dialog.setIsEditCardDialogOpen(open);
                              if (!open) setEditingCardIndex(null);
                            }}
                          >
                            <DrawerTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  openEditCardDialog(
                                    isShuffled
                                      ? shuffledIndices[currentCardIndex]
                                      : currentCardIndex,
                                  )
                                }
                                className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors h-10"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent className="border-2 border-black dark:border-gray-600 border-b-0 max-h-[90vh] dark:bg-gray-900">
                              <DrawerHeader>
                                <DrawerTitle className="dark:text-white">
                                  Edit Flashcard
                                </DrawerTitle>
                              </DrawerHeader>
                              <div className="overflow-y-auto">
                                <CardForm
                                  front={newFront}
                                  back={newBack}
                                  onFrontChange={setNewFront}
                                  onBackChange={setNewBack}
                                  onSubmit={handleEditCard}
                                  isEdit
                                />
                              </div>
                            </DrawerContent>
                          </Drawer>
                        ) : (
                          <Dialog
                            open={
                              dialog.isEditCardDialogOpen &&
                              editingCardIndex ===
                                (isShuffled
                                  ? shuffledIndices[currentCardIndex]
                                  : currentCardIndex)
                            }
                            onOpenChange={(open) => {
                              dialog.setIsEditCardDialogOpen(open);
                              if (!open) setEditingCardIndex(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  openEditCardDialog(
                                    isShuffled
                                      ? shuffledIndices[currentCardIndex]
                                      : currentCardIndex,
                                  )
                                }
                                className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-2 border-black dark:border-gray-600 max-w-3xl dark:bg-gray-900">
                              <DialogHeader>
                                <DialogTitle className="dark:text-white">
                                  Edit Flashcard
                                </DialogTitle>
                              </DialogHeader>
                              <CardForm
                                front={newFront}
                                back={newBack}
                                onFrontChange={setNewFront}
                                onBackChange={setNewBack}
                                onSubmit={handleEditCard}
                                isEdit
                              />
                            </DialogContent>
                          </Dialog>
                        )}

                        <Button
                          variant="outline"
                          onClick={() =>
                            confirmDeleteCard(
                              isShuffled
                                ? shuffledIndices[currentCardIndex]
                                : currentCardIndex,
                            )
                          }
                          className="border-2 border-black dark:border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors h-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={currentCardIndex === displayCards.length - 1}
                        className="border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 h-10 sm:h-auto"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4 sm:ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={FileQuestion}
                title="No flashcards yet"
                description="Add your first flashcard to this folder and start learning!"
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
