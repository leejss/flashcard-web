import { AppContent } from "@/components/app-content";
import { ThemeProvider } from "@/components/theme-provider";
import { DialogProvider } from "@/contexts/dialog-context";

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
