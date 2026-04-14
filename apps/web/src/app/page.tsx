import CreateNoteForm from "@/components/CreateNoteForm";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Create a new note",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <CreateNoteForm />
    </>
  );
}