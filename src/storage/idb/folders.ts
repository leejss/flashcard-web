import type { Folder } from "@/types";
import { runTransaction } from "./utils";

const dbName = "flashcard-data";
const dbVersion = 1;
const storeNames = {
  folders: "folders",
  cards: "cards",
};
let db: IDBDatabase | null = null;

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = () => {
      db = request.result;
      db.createObjectStore(storeNames.folders, { keyPath: "id" });
      db.createObjectStore(storeNames.cards, { keyPath: "id" });
    };
  });
}

export async function createFolder(folder: Folder): Promise<{
  success: boolean;
  data: {
    id: string;
  };
}> {
  const db = getDB();
  await runTransaction(db, storeNames.folders, "readwrite", (store) =>
    store.add(folder),
  );
  return {
    success: true,
    data: {
      id: folder.id,
    },
  };
}

export function getFolderById(id: string): Promise<Folder | null> {
  const db = getDB();
  return runTransaction(db, storeNames.folders, "readonly", (store) =>
    store.get(id),
  );
}

export function getAllFolders(): Promise<Folder[]> {
  const db = getDB();
  return runTransaction(db, storeNames.folders, "readonly", (store) =>
    store.getAll(),
  );
}

export async function removeFolder(id: string): Promise<void> {
  const db = getDB();
  await runTransaction(db, storeNames.folders, "readwrite", (store) =>
    store.delete(id),
  );
}

export async function updateFolder(folder: Folder): Promise<void> {
  const db = getDB();
  await runTransaction(db, storeNames.folders, "readwrite", (store) =>
    store.put(folder),
  );
}
