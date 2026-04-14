import NotesPage from "@/components/NotesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "View and manage your personal notes",
};

export default function Home() {
  return <NotesPage />;
}