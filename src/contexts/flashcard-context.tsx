"use client";

import { cardDB } from "@/storage/idb/cards";
import { folderDB } from "@/storage/idb/folders";
import { Card, Folder } from "@/types";
import { generateId } from "@/utils/id-generator";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { flashcardReducer } from "./flashcard-reducer";
import {
  AppView,
  FlashcardActions,
  FlashcardState,
  ViewMode,
} from "./flashcard-types";

const createDefaultFolders = (): Folder[] => [];
const initializeState = (baseState: FlashcardState): FlashcardState => {
  return { ...baseState, folders: createDefaultFolders() };
};

interface FlashcardContextType {
  state: FlashcardState;
  actions: FlashcardActions;
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

  const { folders, currentFolderId } = state;

  useEffect(() => {
    const load = async () => {
      const result = await folderDB.getAllFolders();
      // map folders to Folder type
      // const folders = mapFolders(result)
      dispatch({ type: "SET_FOLDERS", payload: result });
    };
    load();
  }, []);

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
        id: generateId(),
        name,
        cardCount: 0,
      };
      dispatch({ type: "CREATE_FOLDER", payload: newFolder });
      folderDB.createFolder(newFolder);
    },
    [dispatch],
  );

  const updateFolder = useCallback(
    (id: string, name: string) => {
      dispatch({ type: "UPDATE_FOLDER", payload: { id, name } });
      folderDB.updateFolder(id, name);
    },

    [dispatch],
  );

  const deleteFolder = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE_FOLDER", payload: { id } });
      folderDB.removeFolder(id);
    },
    [dispatch],
  );

  const createCard = useCallback(
    (folderId: string, front: string, back: string) => {
      const newCard: Card = {
        id: generateId(),
        folderId,
        front,
        back,
        correct: 0,
        incorrect: 0,
      };
      dispatch({ type: "CREATE_CARD", payload: { folderId, card: newCard } });
      cardDB.createCard(newCard);
      folderDB.incrementCardCount(folderId, 1);
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
    (folderId: string, cardId: string) => {
      dispatch({ type: "DELETE_CARD", payload: { folderId, cardId } });
      cardDB.deleteCard(cardId);
      folderDB.incrementCardCount(folderId, -1);
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
