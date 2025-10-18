import { ActionButtons } from "@/components/layout/action-buttons";
import { Header } from "@/components/layout/header";
import { FoldersView } from "@/components/views/folders-view";

export default function FoldersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Header />
      <ActionButtons />
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12 relative">
        <FoldersView />
      </main>
    </div>
  );
}
