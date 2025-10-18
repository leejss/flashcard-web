import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DialogProvider } from "@/contexts/dialog-context";
import { FlashcardProvider } from "@/contexts/flashcard-context";
import { HydrationProvider } from "@/contexts/hydration-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flashcard Web",
  description: "Flashcard Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Toaster position="top-right" />
          <HydrationProvider>
            <FlashcardProvider>
              <DialogProvider>{children}</DialogProvider>
            </FlashcardProvider>
          </HydrationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
