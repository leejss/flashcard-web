import { AppContent } from "@/components/AppContent";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DialogProvider } from "@/contexts/DialogContext";

export default function App() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <AppContent />
      </DialogProvider>
    </ThemeProvider>
  );
}
