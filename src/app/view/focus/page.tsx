import { Header } from "@/components/layout/header";
import { CardsFocusView } from "@/components/views/cards-focus-view";
import { Toaster } from "sonner";

export default function FocusPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-12 pb-24 sm:pb-12 ">
        <CardsFocusView />
      </main>
    </div>
  );
}
