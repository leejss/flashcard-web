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

export async function updateCard(
  cardId: string,
  updates: { front?: string; back?: string },
): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readwrite");
  const store = tx.objectStore(storeNames.cards);
  await new Promise<void>((resolve, reject) => {
    const getReq = store.get(cardId);
    getReq.onerror = () => reject(getReq.error);
    getReq.onsuccess = () => {
      const card = getReq.result as Card | undefined;
      if (!card) {
        reject(new Error("Card not found"));
        return;
      }
      const updated: Card = {
        ...card,
        front: updates.front ?? card.front,
        back: updates.back ?? card.back,
      };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function updateCardStats(
  cardId: string,
  updates: {
    correct?: number;
    incorrect?: number;
    lastReviewed?: string;
  },
): Promise<void> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readwrite");
  const store = tx.objectStore(storeNames.cards);
  await new Promise<void>((resolve, reject) => {
    const getReq = store.get(cardId);
    getReq.onerror = () => reject(getReq.error);
    getReq.onsuccess = () => {
      const card = getReq.result as Card | undefined;
      if (!card) {
        reject(new Error("Card not found"));
        return;
      }
      const updated: Card = {
        ...card,
        correct: updates.correct ?? card.correct,
        incorrect: updates.incorrect ?? card.incorrect,
        lastReviewed: updates.lastReviewed ?? card.lastReviewed,
      };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export function getAllCards(): Promise<Card[]> {
  const db = getDB();
  const tx = db.transaction([storeNames.cards], "readonly");
  const store = tx.objectStore(storeNames.cards);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export const cardDB = {
  getCardsByFolderId,
  getAllCards,
  createCard,
  deleteCard,
  updateCard,
  updateCardStats,
};
