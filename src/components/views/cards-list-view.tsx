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
  useFlashcardActions,
  useFlashcardState,
} from "@/contexts/flashcard-hooks";
import { cardDB } from "@/storage/idb/cards";
import type { Card } from "@/types";
import { Edit2, FileQuestion, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../dialogs/delete-confirm-dialog";
import { EmptyState } from "../empty-state";
import { Flashcard } from "../flashcard";
import { CardForm } from "../forms/card-form";

export function CardsListView() {
  const { state } = useFlashcardState();
  const { getCurrentFolder, updateCard, deleteCard } = useFlashcardActions();
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [deletingCardIndex, setDeletingCardIndex] = useState<number | null>(
    null,
  );
  const [cards, setCards] = useState<Card[]>([]);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const { currentFolderId } = state;
  const currentFolder = getCurrentFolder();

  // 카드 목록을 로드하는 함수
  const loadCards = useCallback(async () => {
    try {
      const folderId = currentFolder?.id;
      if (!folderId) return;
      const loadedCards = await cardDB.getCardsByFolderId(folderId);
      setCards(loadedCards);
    } catch (error) {
      console.error("[error]", String(error));
    }
  }, [currentFolder?.id]);

  useEffect(() => {
    loadCards();
  }, [loadCards, state.cardRefreshTrigger]);

  const openEditCardDialog = (index: number) => {
    setEditingCardIndex(index);
    setNewFront(cards[index].front);
    setNewBack(cards[index].back);
  };

  const handleEditCard = async () => {
    if (
      newFront.trim() &&
      newBack.trim() &&
      editingCardIndex !== null &&
      currentFolderId
    ) {
      try {
        // 메모리 상태 즉시 업데이트
        updateCard(currentFolderId, editingCardIndex, newFront, newBack);

        // IDB에 저장
        const cardId = cards[editingCardIndex].id;
        await cardDB.updateCard(cardId, { front: newFront, back: newBack });

        setNewFront("");
        setNewBack("");
        setEditingCardIndex(null);
        toast.success("Card updated");

        // 카드 목록 갱신
        await loadCards();
      } catch (error) {
        console.error("Failed to update card:", error);
        toast.error("Failed to update card");
      }
    }
  };

  const handleDeleteCard = async () => {
    if (deletingCardIndex !== null && currentFolderId) {
      const cardId = cards[deletingCardIndex].id;
      deleteCard(currentFolderId, cardId);
      toast.success("Card deleted");
      setDeletingCardIndex(null);
      // 카드 삭제 후 목록 갱신
      await loadCards();
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
