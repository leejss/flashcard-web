import { AppContent } from "@/components/AppContent";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DialogProvider } from "@/contexts/DialogContext";

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <DialogProvider>
        <AppContent />
      </DialogProvider>
    </ThemeProvider>
  );
}
