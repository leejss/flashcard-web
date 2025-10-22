import { Card, Folder } from "@/types";

export type AppView = "folders" | "cards";
export type ViewMode = "list" | "focus";

export interface FlashcardState {
  folders: Folder[];
  currentFolderId: string | null;
  appView: AppView;
  viewMode: ViewMode;
}

export type FlashcardAction =
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
  | { type: "DELETE_CARD"; payload: { folderId: string; cardId: string } }
  | {
      type: "UPDATE_CARD_STATS";
      payload: {
        folderId: string;
        index: number;
        isCorrect: boolean;
        lastReviewed: string;
      };
    };

export interface FlashcardActions {
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
  deleteCard: (folderId: string, cardId: string) => void;
  updateCardStats: (
    folderId: string,
    index: number,
    isCorrect: boolean,
  ) => void;
  getCurrentFolder: () => Folder | undefined;
}
