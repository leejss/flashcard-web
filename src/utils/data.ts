import { cardDB } from "@/storage/idb/cards";
import { folderDB } from "@/storage/idb/folders";
import {
  CardSchema,
  exportDataSchema,
  FolderSchema,
} from "@/storage/idb/schema";

export type ExportData = {
  exportedAt: string;
  folders: FolderSchema[];
  cards: CardSchema[];
  metadata: {
    totalFolders: number;
    totalCards: number;
    checksum?: string;
  };
};

export async function getAllData(): Promise<ExportData> {
  const [folders, cards] = await Promise.all([
    folderDB.getAllFolders(),
    cardDB.getAllCards(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    folders,
    cards,
    metadata: {
      totalFolders: folders.length,
      totalCards: cards.length,
    },
  };
}

export function downloadFile(data: ExportData) {
  // 1. Blob 생성. 데이터 -> 바이너리
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  // 2. ObjectURL 생성. 메모리주소
  const url = URL.createObjectURL(blob); // 저장된 데이터에 접근할 수 있는 주소를 생성. blob protocol 사용.
  // 3. 다운로드 링크 클릭.
  const link = document.createElement("a");
  link.href = url;
  link.download = "flashcard-data.json";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportData() {
  const data = await getAllData();
  downloadFile(data);
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // reader.readAsText(file)
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

const ERROR_FILE_SIZE_EXCEEDED = "File size exceeds limit";
const ERROR_INVALID_FILE_TYPE = "Invalid file type";
const ERROR_INVALID_FILE_FORMAT = "Invalid file format";

function checkFileSize(file: File, maxSize: number) {
  if (file.size > maxSize) {
    throw new Error(ERROR_FILE_SIZE_EXCEEDED);
  }
}

function checkFileType(file: File) {
  if (file.type !== "application/json") {
    throw new Error(ERROR_INVALID_FILE_TYPE);
  }
}

function parseImportData(text: string): ExportData {
  try {
    const parsed = JSON.parse(text);
    return exportDataSchema.parse(parsed);
  } catch {
    throw new Error(ERROR_INVALID_FILE_FORMAT);
  }
}

export async function parseImportFile(file: File): Promise<ExportData> {
  checkFileSize(file, 10 * 1024 * 1024);
  checkFileType(file);
  const text = await readFileAsText(file);
  return parseImportData(text);
}

export async function mergeImportedData(
  data: ExportData,
  strategy: "overwrite" | "merge",
) {
  if (strategy === "overwrite") {
    await Promise.all([folderDB.clear(), cardDB.clear()]);
    await Promise.all([
      folderDB.createFolders(data.folders),
      cardDB.createCards(data.cards),
    ]);
  }

  if (strategy === "merge") {
  }

  return data;
}
