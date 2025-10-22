"use client";

import { useEffect, useState } from "react";
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
import { CardForm } from "../forms/card-form";
import { Edit2, Trash2, FileQuestion } from "lucide-react";
import type { Card } from "@/types";
import { useFlashcardState } from "@/contexts/flashcard-hooks";
import { useFlashcardActions } from "@/contexts/flashcard-hooks";
import { toast } from "sonner";
import { Flashcard } from "../flashcard";
import { cardDB } from "@/storage/idb/cards";

export function CardsListView() {
  const { state } = useFlashcardState();
  const { getCurrentFolder, updateCard, deleteCard } = useFlashcardActions();
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [deletingCardIndex, setDeletingCardIndex] = useState<number | null>(
    null,
  );
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const { currentFolderId } = state;
  const currentFolder = getCurrentFolder();

  useEffect(() => {
    const load = async () => {
      try {
        const folderId = currentFolder?.id;
        if (!folderId) return;
        setLoading(true);
        const cards = await cardDB.getAllCards(folderId);
        setCards(cards);
      } catch (error) {
        console.error("[error]", String(error));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentFolder?.id]);

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
      toast.success("Card deleted");
      setDeletingCardIndex(null);
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
                  <Dialog
                    open={editingCardIndex === index}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingCardIndex(null);
                        setNewFront("");
                        setNewBack("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditCardDialog(index)}
                        className="border-2 size-10 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
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

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingCardIndex(index)}
                    className="border-2 size-10 border-black dark:border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DeleteConfirmDialog
        open={deletingCardIndex !== null}
        onOpenChange={(open) => !open && setDeletingCardIndex(null)}
        type="card"
        onConfirm={handleDeleteCard}
      />
    </>
  );
}
