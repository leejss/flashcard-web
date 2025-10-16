import type { BaseStorage } from "@/types";

const key = "flashcard-data";
export const browserStorage: BaseStorage = {
  load: async () => {
    const data = window.localStorage.getItem(key);
    try {
      return JSON.parse(data || "[]");
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      window.localStorage.removeItem(key);
      return [];
    }
  },
  save: async (key, data) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  },
  remove: async (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove data from localStorage", error);
    }
  },
};
