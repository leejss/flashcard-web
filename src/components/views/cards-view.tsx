"use client";

import { useState, useEffect } from "react";
import { EmptyState } from "../empty-state";
import { DeleteConfirmDialog } from "../dialogs/delete-confirm-dialog";
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
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/components/ui/use-mobile";
import { CardForm } from "../forms/card-form";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Shuffle,
  CheckCircle,
  XCircle,
  FileQuestion,
} from "lucide-react";
import type { Card } from "./folders-view";
import { useFlashcard } from "@/contexts/flashcard-context";
import { toast } from "sonner";
import { Flashcard } from "../Flashcard";

interface CardsViewProps {
  viewMode: "list" | "focus";
}

export function CardsView({ viewMode }: CardsViewProps) {
  const {
    currentFolderId,
    getCurrentFolder,
    updateCard,
    deleteCard,
    updateCardStats,
  } = useFlashcard();
  const isMobile = useIsMobile();

  const currentFolder = getCurrentFolder();
  const cards = currentFolder?.cards || [];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [deletingCardIndex, setDeletingCardIndex] = useState<number | null>(
    null,
  );
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const displayCards =
    isShuffled && shuffledIndices.length > 0
      ? shuffledIndices.map((i) => cards[i])
      : cards;

  const currentCard = displayCards[currentCardIndex];

  // Keyboard shortcuts
  useEffect(() => {
    if (viewMode !== "focus") return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentCardIndex, displayCards.length]);

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
      const indices = cards.map((_, i) => i);
      const shuffled = shuffleArray(indices);
      setShuffledIndices(shuffled);
      setCurrentCardIndex(0);
      setIsShuffled(true);
      toast.success("Shuffle mode enabled");
    } else {
      setIsShuffled(false);
      setShuffledIndices([]);
      setCurrentCardIndex(0);
      toast.success("Shuffle mode disabled");
    }
  };

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

  const openEditCardDialog = (index: number) => {
    setEditingCardIndex(index);
    setNewFront(cards[index].front);
    setNewBack(cards[index].back);
  };

  const handleEditCard = () => {
    if (
      newFront.trim() &&
      newBack.trim() &&
      editingCardIndex !== null &&
      currentFolderId
    ) {
      updateCard(currentFolderId, editingCardIndex, newFront, newBack);
      setNewFront("");
      setNewBack("");
      setEditingCardIndex(null);
      toast.success("Card updated");
    }
  };

  const handleDeleteCard = () => {
    if (deletingCardIndex !== null && currentFolderId) {
      deleteCard(currentFolderId, deletingCardIndex);
      if (currentCardIndex >= cards.length - 1 && cards.length > 1) {
        setCurrentCardIndex(cards.length - 2);
      } else if (cards.length === 1) {
        setCurrentCardIndex(0);
      }
      toast.success("Card deleted");
      setDeletingCardIndex(null);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentFolderId) return;

    const actualIndex = isShuffled
      ? shuffledIndices[currentCardIndex]
      : currentCardIndex;

    updateCardStats(currentFolderId, actualIndex, isCorrect);
    toast.success(isCorrect ? "Marked as correct!" : "Marked as incorrect");

    if (currentCardIndex < displayCards.length - 1) {
      setTimeout(() => handleNext(), 300);
    }
  };

  const getAnswerRate = (card: Card) => {
    const total = card.correct + card.incorrect;
    if (total === 0) return null;
    return Math.round((card.correct / total) * 100);
  };

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="No flashcards yet"
        description="Add your first flashcard to this folder and start learning!"
      />
    );
  }

  return (
    <>
      {/* List View */}
      {viewMode === "list" && (
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6 flex justify-between items-center">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {cards.length} flashcard{cards.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card, index) => {
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
                        {answerRate}% correct ({card.correct + card.incorrect}{" "}
                        reviews)
                      </span>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-2">
                    {isMobile ? (
                      <Drawer
                        open={editingCardIndex === index}
                        onOpenChange={(open) => {
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
                        open={editingCardIndex === index}
                        onOpenChange={(open) => {
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
                      onClick={() => setDeletingCardIndex(index)}
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
              <Switch checked={isShuffled} onCheckedChange={toggleShuffle} />
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
            <Flashcard front={currentCard.front} back={currentCard.back} />
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
                    editingCardIndex ===
                    (isShuffled
                      ? shuffledIndices[currentCardIndex]
                      : currentCardIndex)
                  }
                  onOpenChange={(open) => {
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
                    editingCardIndex ===
                    (isShuffled
                      ? shuffledIndices[currentCardIndex]
                      : currentCardIndex)
                  }
                  onOpenChange={(open) => {
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
                  setDeletingCardIndex(
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

      <DeleteConfirmDialog
        open={deletingCardIndex !== null}
        onOpenChange={(open) => !open && setDeletingCardIndex(null)}
        type="card"
        onConfirm={handleDeleteCard}
      />
    </>
  );
}
