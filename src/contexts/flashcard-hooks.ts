import { useFlashcard } from "./flashcard-context";

export function useFlashcardState() {
  const { state, isHydrating } = useFlashcard();
  return { state, isHydrating };
}

export function useFlashcardActions() {
  const { actions } = useFlashcard();
  return actions;
}

export { useFlashcard };
