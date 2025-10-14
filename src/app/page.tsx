import { AppContent } from "@/components/app-content";
import { ThemeProvider } from "@/components/theme-provider";
import { DialogProvider } from "@/contexts/dialog-context";
import { FlashcardProvider } from "@/contexts/flashcard-context";

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <FlashcardProvider>
        <DialogProvider>
          <AppContent />
        </DialogProvider>
      </FlashcardProvider>
    </ThemeProvider>
  );
}
