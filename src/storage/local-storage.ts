import type { StorageAdapter } from "@/types";

export class LocalStorageAdapter implements StorageAdapter {
  private storageKey = "flashcard-data";

  async load<T = unknown>(): Promise<T> {
    const data = window.localStorage.getItem(this.storageKey);
    try {
      return JSON.parse(data || "[]");
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      window.localStorage.removeItem(this.storageKey);
      return [] as T;
    }
  }

  async save<T = unknown>(key: string, data: T): Promise<void> {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove data from localStorage", error);
    }
  }
}
