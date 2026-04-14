"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import API from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateNoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creatingNote, setCreatingNote] = useState(false);
  const router = useRouter();

  const createNote = async () => {
    if (!title || !content) {
      toast.error("Please fill in both title and content");
      return;
    }
    try {
      setCreatingNote(true);
      await API.post("/notes", { title, content });
      setTitle("");
      setContent("");
      toast.success("Note created successfully!");
      router.push("/notes");
    } catch {
      toast.error("Failed to create note");
    } finally {
      setCreatingNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>
            <Button onClick={createNote} className="w-full h-11 gap-2" disabled={creatingNote}>
              {creatingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Note
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
