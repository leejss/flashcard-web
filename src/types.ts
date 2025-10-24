export interface Card {
  id: string;
  folderId: string;
  front: string;
  back: string;
  correct: number;
  incorrect: number;
  lastReviewed?: string;
}

export interface Folder {
  id: string;
  name: string;
  cardCount: number;
}

export interface StorageAdapter {
  load<T>(): Promise<T>;
  save<T>(key: string, data: T): Promise<void>;
  remove(key: string): Promise<void>;
}
