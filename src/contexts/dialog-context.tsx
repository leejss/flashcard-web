"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DialogState {
  isAddFolderDialogOpen: boolean;
  isEditFolderDialogOpen: boolean;
  isAddCardDialogOpen: boolean;
  isEditCardDialogOpen: boolean;
  deleteConfirmOpen: boolean;
}

interface DialogActions {
  setIsAddFolderDialogOpen: (open: boolean) => void;
  setIsEditFolderDialogOpen: (open: boolean) => void;
  setIsAddCardDialogOpen: (open: boolean) => void;
  setIsEditCardDialogOpen: (open: boolean) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  closeAllDialogs: () => void;
}

type DialogContextType = DialogState & DialogActions;

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [isEditFolderDialogOpen, setIsEditFolderDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const closeAllDialogs = () => {
    setIsAddFolderDialogOpen(false);
    setIsEditFolderDialogOpen(false);
    setIsAddCardDialogOpen(false);
    setIsEditCardDialogOpen(false);
    setDeleteConfirmOpen(false);
  };

  const value: DialogContextType = {
    isAddFolderDialogOpen,
    isEditFolderDialogOpen,
    isAddCardDialogOpen,
    isEditCardDialogOpen,
    deleteConfirmOpen,
    setIsAddFolderDialogOpen,
    setIsEditFolderDialogOpen,
    setIsAddCardDialogOpen,
    setIsEditCardDialogOpen,
    setDeleteConfirmOpen,
    closeAllDialogs,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
