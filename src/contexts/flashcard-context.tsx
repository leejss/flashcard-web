"use client";

import { localStorageAdapter } from "@/storage/local-storage";
import { SyncManager } from "@/storage/sync";
import { Card, Folder } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flashcardReducer } from "./flashcard-reducer";
import {
  AppView,
  FlashcardActions,
  FlashcardState,
  ViewMode,
} from "./flashcard-types";

const STORAGE_KEY = "flashcard-data";
const createDefaultFolders = (): Folder[] => [];

const initializeState = (baseState: FlashcardState): FlashcardState => {
  return { ...baseState, folders: createDefaultFolders() };
};

interface FlashcardContextType {
  state: FlashcardState;
  isHydrating: boolean;
  actions: FlashcardActions;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined,
);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const syncManager = useRef(new SyncManager(localStorageAdapter));
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

  const { folders, currentFolderId } = state;
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const load = async () => {
      const loaded = await syncManager.current.load<Folder[]>();
      dispatch({ type: "SET_FOLDERS", payload: loaded });
      setIsHydrating(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isHydrating && folders.length > 0) {
      syncManager.current.save(STORAGE_KEY, folders);
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
      state,
      isHydrating,
      actions: {
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
      },
    }),
    [
      state,
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
