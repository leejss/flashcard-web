import { z } from "zod";

export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  cardCount: z.number(),
});

export type FolderSchema = z.infer<typeof folderSchema>;

export const cardSchema = z.object({
  id: z.string(),
  folderId: z.string(),
  front: z.string(),
  back: z.string(),
  correct: z.number(),
  incorrect: z.number(),
  lastReviewed: z.string().optional(),
});

export type CardSchema = z.infer<typeof cardSchema>;

export const exportDataSchema = z.object({
  exportedAt: z.string(),
  folders: z.array(folderSchema),
  cards: z.array(cardSchema),
  metadata: z.object({
    totalFolders: z.number(),
    totalCards: z.number(),
    checksum: z.string().optional(),
  }),
});

export type ExportDataSchema = z.infer<typeof exportDataSchema>;
