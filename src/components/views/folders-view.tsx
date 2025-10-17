"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderCard } from "../folder-card";
import { EmptyState } from "../empty-state";
import { EditFolderDialog } from "../dialogs/edit-folder-dialog";
import { DeleteConfirmDialog } from "../dialogs/delete-confirm-dialog";
import { FolderOpen } from "lucide-react";
import { useFlashcardState } from "@/contexts/flashcard-hooks";
import { useFlashcardActions } from "@/contexts/flashcard-hooks";
import { toast } from "sonner";
import { Folder } from "@/types";

export function FoldersView() {
  const router = useRouter();
  const { state } = useFlashcardState();
  const { updateFolder, deleteFolder, setCurrentFolderId } = useFlashcardActions();
  const { folders } = state;

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

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

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
    router.push("/view/list");
  };

  const handleEditFolder = (name: string) => {
    if (editingFolderId) {
      updateFolder(editingFolderId, name);
      toast.success("Folder renamed");
      setEditingFolderId(null);
    }
  };

  const handleDeleteFolder = () => {
    if (deletingFolderId) {
      const folder = folders.find((f) => f.id === deletingFolderId);
      deleteFolder(deletingFolderId);
      toast.success(`Folder "${folder?.name}" deleted`);
      setDeletingFolderId(null);
    }
  };

  const editingFolder = folders.find((f) => f.id === editingFolderId);

  return (
    <>
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
                    onClick={() => handleFolderClick(folder.id)}
                    onEdit={() => setEditingFolderId(folder.id)}
                    onDelete={() => setDeletingFolderId(folder.id)}
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

      <EditFolderDialog
        open={editingFolderId !== null}
        onOpenChange={(open) => !open && setEditingFolderId(null)}
        folderName={editingFolder?.name || ""}
        onSubmit={handleEditFolder}
      />

      <DeleteConfirmDialog
        open={deletingFolderId !== null}
        onOpenChange={(open) => !open && setDeletingFolderId(null)}
        type="folder"
        onConfirm={handleDeleteFolder}
      />
    </>
  );
}
