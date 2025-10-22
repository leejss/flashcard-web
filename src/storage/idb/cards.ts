import { Card } from "@/types";
import { getDB, storeNames } from "./init";

export async function getCardsByFolderId(folderId: string): Promise<Card[]> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readonly");
  const store = tx.objectStore(storeNames.cards);
  const index = store.index("folderId");

  return new Promise((resolve, reject) => {
    const cards: Card[] = [];
    const req = index.openCursor(IDBKeyRange.only(folderId));

    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        cards.push(cursor.value as Card);
        cursor.continue();
      } else {
        resolve(cards);
      }
    };

    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function createCard(card: Card): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readwrite");
  const store = tx.objectStore(storeNames.cards);
  await new Promise<void>((resolve, reject) => {
    const req = store.add(card);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function deleteCard(cardId: string): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readwrite");
  const store = tx.objectStore(storeNames.cards);
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(cardId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export const cardDB = {
  getCardsByFolderId,
  createCard,
  deleteCard,
};
