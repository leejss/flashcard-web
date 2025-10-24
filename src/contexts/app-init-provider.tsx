"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { initDB } from "@/storage/idb/init";

type InitState = "initializing" | "ready" | "error";

interface AppInitContextType {
  state: InitState;
  error: string | null;
  retry: () => void;
}

interface AppInitProviderProps {
  children: ReactNode;
}

const AppInitContext = createContext<AppInitContextType | undefined>(undefined);

function LoadingUI({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function ErrorUI({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <p className="mb-4 text-sm text-red-600">{message}</p>
        <button
          onClick={onRetry}
          className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export function AppInitProvider({ children }: AppInitProviderProps) {
  const [state, setState] = useState<InitState>("initializing");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const performInitialization = useCallback(async () => {
    setState("initializing");
    setError(null);
    try {
      await initDB();
      setState("ready");
    } catch (err: unknown) {
      setState("error");
      const message =
        err instanceof Error ? err.message : "Initialization failed";
      setError(message);
    }
  }, []);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // 초기화 및 재시도
  useEffect(() => {
    performInitialization();
  }, [retryCount, performInitialization]);

  const value = useMemo<AppInitContextType>(
    () => ({ state, error, retry }),
    [state, error],
  );

  // 로딩 상태
  if (state === "initializing") {
    return <LoadingUI message="Initializing application..." />;
  }

  // 에러 상태
  if (state === "error") {
    return (
      <ErrorUI message={error || "Unknown error occurred"} onRetry={retry} />
    );
  }

  // 준비 완료
  return (
    <AppInitContext.Provider value={value}>{children}</AppInitContext.Provider>
  );
}

export function useAppInit() {
  const ctx = useContext(AppInitContext);
  if (!ctx) {
    throw new Error("useAppInit must be used within AppInitProvider");
  }
  return ctx;
}
