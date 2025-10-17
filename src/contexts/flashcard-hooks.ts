import { useFlashcard } from "./flashcard-context";

// 상태만 필요한 컴포넌트에서 사용
export function useFlashcardState() {
  const { state, isHydrating } = useFlashcard();
  return { state, isHydrating };
}

// 액션만 필요한 컴포넌트에서 사용
export function useFlashcardActions() {
  const { actions } = useFlashcard();
  return actions;
}

// 전체 context가 필요한 경우 (기존 방식)
export { useFlashcard };
