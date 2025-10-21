// getAllCards
// createCard
// removeCard
// updateCard

import { Card } from "@/types";
import { getDB, storeNames } from "./init";

export async function getAllCards(folderId: string): Promise<Card[]> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readonly");
  const store = tx.objectStore(storeNames.cards);
  return new Promise((resolve, reject) => {
    const req = store.get(folderId);
    req.onsuccess = () => resolve(req.result as Card[]);
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

// key (folderId), value (Card[])

export const cardDB = {
  getAllCards,
  createCard,
};
