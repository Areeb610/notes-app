import Navbar from "@/components/Navbar";
import NotesPage from "@/components/NotesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Notes",
  description: "View and manage your personal notes",
};

export default function Notes() {
  return (
    <>
      <Navbar />
      <NotesPage />
    </>
  );
}
