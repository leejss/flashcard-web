export const dbName = "flashcard-data";
export const dbVersion = 1;
export const storeNames = {
  folders: "folders",
  cards: "cards",
};

let db: IDBDatabase | null = null;

export function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is not supported in this environment");
  }

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
      db.createObjectStore(storeNames.cards, { keyPath: "folderId" });
    };
  });
}
