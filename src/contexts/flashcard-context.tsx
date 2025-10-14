"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Folder, Card } from "@/components/views/folders-view";

interface FlashcardContextType {
  folders: Folder[];
  currentFolderId: string | null;
  appView: "folders" | "cards";
  setFolders: (folders: Folder[]) => void;
  setCurrentFolderId: (id: string | null) => void;
  setAppView: (view: "folders" | "cards") => void;
  createFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  createCard: (folderId: string, front: string, back: string) => void;
  updateCard: (folderId: string, index: number, front: string, back: string) => void;
  deleteCard: (folderId: string, index: number) => void;
  updateCardStats: (
    folderId: string,
    index: number,
    isCorrect: boolean,
  ) => void;
  getCurrentFolder: () => Folder | undefined;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined,
);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [appView, setAppView] = useState<"folders" | "cards">("folders");

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

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      cards: [],
    };
    setFolders([...folders, newFolder]);
  };

  const updateFolder = (id: string, name: string) => {
    setFolders(folders.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter((f) => f.id !== id));
  };

  const createCard = (folderId: string, front: string, back: string) => {
    const newCard: Card = {
      id: Date.now().toString(),
      front,
      back,
      correct: 0,
      incorrect: 0,
    };
    setFolders(
      folders.map((f) =>
        f.id === folderId ? { ...f, cards: [...f.cards, newCard] } : f,
      ),
    );
  };

  const updateCard = (
    folderId: string,
    index: number,
    front: string,
    back: string,
  ) => {
    setFolders(
      folders.map((f) => {
        if (f.id === folderId) {
          const updatedCards = [...f.cards];
          updatedCards[index] = {
            ...updatedCards[index],
            front,
            back,
          };
          return { ...f, cards: updatedCards };
        }
        return f;
      }),
    );
  };

  const deleteCard = (folderId: string, index: number) => {
    setFolders(
      folders.map((f) => {
        if (f.id === folderId) {
          const updatedCards = f.cards.filter((_, i) => i !== index);
          return { ...f, cards: updatedCards };
        }
        return f;
      }),
    );
  };

  const updateCardStats = (
    folderId: string,
    index: number,
    isCorrect: boolean,
  ) => {
    setFolders(
      folders.map((f) => {
        if (f.id === folderId) {
          const updatedCards = [...f.cards];
          updatedCards[index] = {
            ...updatedCards[index],
            correct: isCorrect
              ? updatedCards[index].correct + 1
              : updatedCards[index].correct,
            incorrect: !isCorrect
              ? updatedCards[index].incorrect + 1
              : updatedCards[index].incorrect,
            lastReviewed: new Date().toISOString(),
          };
          return { ...f, cards: updatedCards };
        }
        return f;
      }),
    );
  };

  const getCurrentFolder = () => {
    return folders.find((f) => f.id === currentFolderId);
  };

  return (
    <FlashcardContext.Provider
      value={{
        folders,
        currentFolderId,
        appView,
        setFolders,
        setCurrentFolderId,
        setAppView,
        createFolder,
        updateFolder,
        deleteFolder,
        createCard,
        updateCard,
        deleteCard,
        updateCardStats,
        getCurrentFolder,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcard() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error("useFlashcard must be used within a FlashcardProvider");
  }
  return context;
}
