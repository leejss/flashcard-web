import { cardDB } from "@/storage/idb/cards";
import { folderDB } from "@/storage/idb/folders";
import { CardSchema, FolderSchema } from "@/storage/idb/schema";

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
