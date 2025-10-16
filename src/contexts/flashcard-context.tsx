"use client";

import { browserStorage } from "@/storage/local-storage";
import { Card, Folder } from "@/types";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from "react";

type AppView = "folders" | "cards";
type ViewMode = "list" | "focus";

interface FlashcardState {
  folders: Folder[];
  currentFolderId: string | null;
  appView: AppView;
  viewMode: ViewMode;
}

type FlashcardAction =
  | { type: "SET_FOLDERS"; payload: Folder[] }
  | { type: "SET_CURRENT_FOLDER"; payload: string | null }
  | { type: "SET_APP_VIEW"; payload: AppView }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "CREATE_FOLDER"; payload: Folder }
  | { type: "UPDATE_FOLDER"; payload: { id: string; name: string } }
  | { type: "DELETE_FOLDER"; payload: { id: string } }
  | { type: "CREATE_CARD"; payload: { folderId: string; card: Card } }
  | {
      type: "UPDATE_CARD";
      payload: { folderId: string; index: number; front: string; back: string };
    }
  | { type: "DELETE_CARD"; payload: { folderId: string; index: number } }
  | {
      type: "UPDATE_CARD_STATS";
      payload: {
        folderId: string;
        index: number;
        isCorrect: boolean;
        lastReviewed: string;
      };
    };

const STORAGE_KEY = "flashcard-data";
const createDefaultFolders = (): Folder[] => [];
const updateFolderCards = (
  folders: Folder[],
  folderId: string,
  updater: (cards: Card[]) => Card[],
): Folder[] =>
  folders.map((folder) =>
    folder.id === folderId
      ? { ...folder, cards: updater(folder.cards) }
      : folder,
  );

const flashcardReducer = (
  state: FlashcardState,
  action: FlashcardAction,
): FlashcardState => {
  switch (action.type) {
    case "SET_FOLDERS":
      return { ...state, folders: action.payload };
    case "SET_CURRENT_FOLDER":
      return { ...state, currentFolderId: action.payload };
    case "SET_APP_VIEW":
      return { ...state, appView: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "CREATE_FOLDER":
      return { ...state, folders: [...state.folders, action.payload] };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.id
            ? { ...folder, name: action.payload.name }
            : folder,
        ),
      };
    case "DELETE_FOLDER":
      return {
        ...state,
        folders: state.folders.filter(
          (folder) => folder.id !== action.payload.id,
        ),
      };
    case "CREATE_CARD":
      return {
        ...state,
        folders: updateFolderCards(
          state.folders,
          action.payload.folderId,
          (cards) => [...cards, action.payload.card],
        ),
      };
    case "UPDATE_CARD":
      return {
        ...state,
        folders: updateFolderCards(
          state.folders,
          action.payload.folderId,
          (cards) => {
            if (!cards[action.payload.index]) {
              return cards;
            }
            const nextCards = [...cards];
            nextCards[action.payload.index] = {
              ...nextCards[action.payload.index],
              front: action.payload.front,
              back: action.payload.back,
            };
            return nextCards;
          },
        ),
      };
    case "DELETE_CARD":
      return {
        ...state,
        folders: updateFolderCards(
          state.folders,
          action.payload.folderId,
          (cards) => cards.filter((_, idx) => idx !== action.payload.index),
        ),
      };
    case "UPDATE_CARD_STATS":
      return {
        ...state,
        folders: updateFolderCards(
          state.folders,
          action.payload.folderId,
          (cards) => {
            if (!cards[action.payload.index]) {
              return cards;
            }
            const nextCards = [...cards];
            const targetCard = nextCards[action.payload.index];
            nextCards[action.payload.index] = {
              ...targetCard,
              correct: action.payload.isCorrect
                ? targetCard.correct + 1
                : targetCard.correct,
              incorrect: action.payload.isCorrect
                ? targetCard.incorrect
                : targetCard.incorrect + 1,
              lastReviewed: action.payload.lastReviewed,
            };
            return nextCards;
          },
        ),
      };
    default: {
      return state;
    }
  }
};

const initializeState = (baseState: FlashcardState): FlashcardState => {
  return { ...baseState, folders: createDefaultFolders() };
};

interface FlashcardContextType {
  folders: Folder[];
  currentFolderId: string | null;
  appView: AppView;
  viewMode: ViewMode;
  isHydrating: boolean;
  setFolders: (folders: Folder[]) => void;
  setCurrentFolderId: (id: string | null) => void;
  setAppView: (view: AppView) => void;
  setViewMode: (mode: ViewMode) => void;
  createFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  createCard: (folderId: string, front: string, back: string) => void;
  updateCard: (
    folderId: string,
    index: number,
    front: string,
    back: string,
  ) => void;
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
  const [state, dispatch] = useReducer(
    flashcardReducer,
    {
      folders: [],
      currentFolderId: null,
      appView: "folders",
      viewMode: "list",
    },
    initializeState,
  );

  const { folders, currentFolderId, appView, viewMode } = state;
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const load = async () => {
      const loaded = await browserStorage.load<Folder>();
      dispatch({ type: "SET_FOLDERS", payload: loaded });
      setIsHydrating(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isHydrating && folders.length > 0) {
      browserStorage.save(STORAGE_KEY, folders);
    }
  }, [folders, isHydrating]);

  const setFolders = useCallback(
    (updatedFolders: Folder[]) => {
      dispatch({ type: "SET_FOLDERS", payload: updatedFolders });
    },
    [dispatch],
  );

  const setCurrentFolderId = useCallback(
    (id: string | null) => {
      dispatch({ type: "SET_CURRENT_FOLDER", payload: id });
    },
    [dispatch],
  );

  const setAppView = useCallback(
    (view: AppView) => {
      dispatch({ type: "SET_APP_VIEW", payload: view });
    },
    [dispatch],
  );

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      dispatch({ type: "SET_VIEW_MODE", payload: mode });
    },
    [dispatch],
  );

  const createFolder = useCallback(
    (name: string) => {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name,
        cards: [],
      };
      dispatch({ type: "CREATE_FOLDER", payload: newFolder });
    },
    [dispatch],
  );

  const updateFolder = useCallback(
    (id: string, name: string) => {
      dispatch({ type: "UPDATE_FOLDER", payload: { id, name } });
    },
    [dispatch],
  );

  const deleteFolder = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE_FOLDER", payload: { id } });
    },
    [dispatch],
  );

  const createCard = useCallback(
    (folderId: string, front: string, back: string) => {
      const newCard: Card = {
        id: Date.now().toString(),
        front,
        back,
        correct: 0,
        incorrect: 0,
      };
      dispatch({ type: "CREATE_CARD", payload: { folderId, card: newCard } });
    },
    [dispatch],
  );

  const updateCard = useCallback(
    (folderId: string, index: number, front: string, back: string) => {
      dispatch({
        type: "UPDATE_CARD",
        payload: { folderId, index, front, back },
      });
    },
    [dispatch],
  );

  const deleteCard = useCallback(
    (folderId: string, index: number) => {
      dispatch({ type: "DELETE_CARD", payload: { folderId, index } });
    },
    [dispatch],
  );

  const updateCardStats = useCallback(
    (folderId: string, index: number, isCorrect: boolean) => {
      dispatch({
        type: "UPDATE_CARD_STATS",
        payload: {
          folderId,
          index,
          isCorrect,
          lastReviewed: new Date().toISOString(),
        },
      });
    },
    [dispatch],
  );

  const getCurrentFolder = useCallback(() => {
    return folders.find((folder) => folder.id === currentFolderId);
  }, [folders, currentFolderId]);

  const contextValue = useMemo(
    () => ({
      folders,
      currentFolderId,
      appView,
      viewMode,
      isHydrating,
      setFolders,
      setCurrentFolderId,
      setAppView,
      setViewMode,
      createFolder,
      updateFolder,
      deleteFolder,
      createCard,
      updateCard,
      deleteCard,
      updateCardStats,
      getCurrentFolder,
    }),
    [
      folders,
      currentFolderId,
      appView,
      viewMode,
      isHydrating,
      setFolders,
      setCurrentFolderId,
      setAppView,
      setViewMode,
      createFolder,
      updateFolder,
      deleteFolder,
      createCard,
      updateCard,
      deleteCard,
      updateCardStats,
      getCurrentFolder,
    ],
  );

  return (
    <FlashcardContext.Provider value={contextValue}>
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
