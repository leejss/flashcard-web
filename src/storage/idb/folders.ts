import { getDB, storeNames } from "./init";
import type { FolderSchema } from "./schema";

export async function createFolder(folder: FolderSchema): Promise<{
  success: boolean;
  data: {
    id: string;
  };
}> {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readwrite");
  const store = tx.objectStore(storeNames.folders);
  await new Promise<void>((resolve, reject) => {
    const req = store.add(folder);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
  return {
    success: true,
    data: {
      id: folder.id,
    },
  };
}

export function createFolders(folders: FolderSchema[]) {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readwrite");
  const store = tx.objectStore(storeNames.folders);
  return new Promise((resolve, reject) => {
    // when to resolve  ? request success === folders.length
    let completed = 0;
    const total = folders.length;

    folders.forEach((folder) => {
      const req = store.add(folder);

      req.onsuccess = () => {
        completed++;
        if (completed === total) {
          resolve(true);
        }
      };

      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
    });
  });
}

export function getFolderById(id: string): Promise<FolderSchema | null> {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readonly");
  const store = tx.objectStore(storeNames.folders);
  return new Promise<FolderSchema | null>((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve((req.result as FolderSchema) ?? null);
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export function getAllFolders(): Promise<FolderSchema[]> {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readonly");
  const store = tx.objectStore(storeNames.folders);
  return new Promise<FolderSchema[]>((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as FolderSchema[]) ?? []);
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function removeFolder(id: string): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readwrite");
  const store = tx.objectStore(storeNames.folders);
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function updateFolder(id: string, name: string): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readwrite");
  const store = tx.objectStore(storeNames.folders);
  await new Promise<void>((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onerror = () => reject(getReq.error);
    getReq.onsuccess = () => {
      const folder = getReq.result as FolderSchema | undefined;
      if (!folder) {
        reject(new Error("FolderSchema not found"));
        return;
      }
      const updated: FolderSchema = { ...folder, name };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function incrementCardCount(
  id: string,
  delta: number,
): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readwrite");
  const store = tx.objectStore(storeNames.folders);
  await new Promise<void>((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onerror = () => reject(getReq.error);
    getReq.onsuccess = () => {
      const folder = getReq.result as FolderSchema | undefined;
      if (!folder) {
        reject(new Error("FolderSchema not found"));
        return;
      }
      const nextCount = Math.max(0, (folder.cardCount || 0) + delta);
      const updated: FolderSchema = { ...folder, cardCount: nextCount };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export function clear() {
  const db = getDB();
  const tx = db.transaction([storeNames.folders], "readwrite");
  const store = tx.objectStore(storeNames.folders);
  return new Promise((resolve, reject) => {
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export const folderDB = {
  createFolder,
  createFolders,
  getFolderById,
  getAllFolders,
  removeFolder,
  updateFolder,
  incrementCardCount,
  clear,
};
