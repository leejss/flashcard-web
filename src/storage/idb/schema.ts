export type FolderSchema = {
  id: string;
  name: string;
  cardCount: number;
};

export type CardSchema = {
  id: string;
  folderId: string;
  front: string;
  back: string;
  correct: number;
  incorrect: number;
  lastReviewed?: string;
};
