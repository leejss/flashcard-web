import { useFlashcard } from "./flashcard-context";

export function useFlashcardState() {
  const { state } = useFlashcard();
  return { state };
}

export function useFlashcardActions() {
  const { actions } = useFlashcard();
  return actions;
}

export { useFlashcard };
