import { produce } from "immer";
import type { FlashcardState, FlashcardAction } from "./flashcard-types";

export const flashcardReducer = (
  state: FlashcardState,
  action: FlashcardAction,
): FlashcardState =>
  produce(state, (draft) => {
    switch (action.type) {
      case "SET_FOLDERS":
        draft.folders = action.payload;
        break;
      case "SET_CURRENT_FOLDER":
        draft.currentFolderId = action.payload;
        break;
      case "SET_APP_VIEW":
        draft.appView = action.payload;
        break;
      case "SET_VIEW_MODE":
        draft.viewMode = action.payload;
        break;
      case "CREATE_FOLDER":
        draft.folders.push(action.payload);
        break;
      case "UPDATE_FOLDER": {
        const folder = draft.folders.find((f) => f.id === action.payload.id);
        if (folder) {
          folder.name = action.payload.name;
        }
        break;
      }
      case "DELETE_FOLDER":
        draft.folders = draft.folders.filter((f) => f.id !== action.payload.id);
        break;
      case "CREATE_CARD": {
        const folder = draft.folders.find(
          (f) => f.id === action.payload.folderId,
        );

        if (folder) {
          folder.cardCount += 1;
        }

        break;
      }
      case "UPDATE_CARD": {
        break;
      }
      case "DELETE_CARD": {
        const folder = draft.folders.find(
          (f) => f.id === action.payload.folderId,
        );
        if (folder) {
          folder.cardCount = Math.max(0, folder.cardCount - 1);
        }
        break;
      }
      case "UPDATE_CARD_STATS": {
        break;
      }
      case "REFRESH_CARDS": {
        draft.cardRefreshTrigger += 1;
        break;
      }
    }
  });
