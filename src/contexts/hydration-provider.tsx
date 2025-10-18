"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface HydrationContextType {
  isHydrated: boolean;
}

const HydrationContext = createContext<HydrationContextType | undefined>(
  undefined,
);

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydration() {
  const context = useContext(HydrationContext);
  if (context === undefined) {
    throw new Error("useHydration must be used within HydrationProvider");
  }
  return context;
}
