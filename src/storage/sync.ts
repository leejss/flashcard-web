import { StorageAdapter } from "@/types";

export class SyncManager {
  constructor(private adapter: StorageAdapter) {}
  async load<T = unknown>(): Promise<T> {
    return this.adapter.load<T>();
  }

  async save<T = unknown>(key: string, data: T): Promise<void> {
    return this.adapter.save(key, data);
  }

  async remove(key: string): Promise<void> {
    return this.adapter.remove(key);
  }
}
