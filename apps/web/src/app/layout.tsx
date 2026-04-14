import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NotesApp - Your Personal Note Taking App",
    template: "%s | NotesApp",
  },
  description: "A modern full-stack notes application built with Next.js and FastAPI. Create, manage, and organize your notes with a beautiful interface.",
  keywords: ["notes", "note-taking", "productivity", "nextjs", "fastapi"],
  authors: [{ name: "NotesApp" }],
  openGraph: {
    title: "NotesApp - Your Personal Note Taking App",
    description: "A modern full-stack notes application built with Next.js and FastAPI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<Toaster /></body>
    </html>
  );
}
