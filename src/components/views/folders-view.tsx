"use client";

import {
  useFlashcardActions,
  useFlashcardState,
} from "@/contexts/flashcard-hooks";
import { FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../dialogs/delete-confirm-dialog";
import { EditFolderDialog } from "../dialogs/edit-folder-dialog";
import { EmptyState } from "../empty-state";
import { FolderCard } from "../folder-card";

export function FoldersView() {
  const router = useRouter();
  const { state } = useFlashcardState();
  const { updateFolder, deleteFolder, setCurrentFolderId } =
    useFlashcardActions();
  const { folders } = state;

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

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
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {folders.length} folder{folders.length !== 1 ? "s" : ""}
          </p>
        </div>
        {folders.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {folders.map((folder) => {
              return (
                <div key={folder.id}>
                  <FolderCard
                    name={folder.name}
                    cardCount={folder.cardCount}
                    onClick={() => handleFolderClick(folder.id)}
                    onEdit={() => setEditingFolderId(folder.id)}
                    onDelete={() => setDeletingFolderId(folder.id)}
                  />
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
