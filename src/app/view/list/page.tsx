import { Header } from "@/components/layout/header";
import { ActionButtons } from "@/components/layout/action-buttons";
import { Toaster } from "sonner";
import { CardsListView } from "@/components/views/cards-list-view";
import { FolderGuard } from "@/components/guards/folder-guard";

export default function ListPage() {
  return (
    <FolderGuard>
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
        <Toaster position="top-right" />
        <Header />
        <ActionButtons />
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
          <CardsListView />
        </main>
      </div>
    </FolderGuard>
  );
}
