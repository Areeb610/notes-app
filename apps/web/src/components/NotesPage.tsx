"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import API, { setAuthToken } from "@/lib/api";
import { Edit, FileText, Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingNote, setCreatingNote] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updatingNote, setUpdatingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(false);
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch {
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

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
      fetchNotes();
    } catch {
      toast.error("Failed to create note");
    } finally {
      setCreatingNote(false);
    }
  };

  const deleteNote = async (id: number) => {
    setDeletingNoteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingNoteId) return;
    try {
      setDeletingNote(true);
      await API.delete(`/notes/${deletingNoteId}`);
      toast.success("Note deleted successfully!");
      setDeleteModalOpen(false);
      setDeletingNoteId(null);
      fetchNotes();
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setDeletingNote(false);
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditModalOpen(true);
  };

  const updateNote = async () => {
    if (!editingNote || !editTitle || !editContent) {
      toast.error("Please fill in both title and content");
      return;
    }
    try {
      setUpdatingNote(true);
      await API.put(`/notes/${editingNote.id}`, { title: editTitle, content: editContent });
      toast.success("Note updated successfully!");
      setEditModalOpen(false);
      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
      fetchNotes();
    } catch {
      toast.error("Failed to update note");
    } finally {
      setUpdatingNote(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      document.cookie = "token=; path=/; max-age=0";
      setAuthToken("");
      toast.success("Logged out successfully");
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie("token");
    if (token) {
      setAuthToken(token);
      const loadNotes = async () => {
        await fetchNotes();
      };
      loadNotes();
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-primary to-purple-600 p-3 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">NotesApp</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2" disabled={loggingOut}>
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Logout
          </Button>
        </div>

        <Card className="mb-8 border-slate-700 shadow-xl">
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
                rows={5}
                className="resize-none"
              />
            </div>
            <Button onClick={createNote} className="w-full h-11 gap-2" disabled={creatingNote}>
              {creatingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Note
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4 text-slate-100">My Notes</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-700 shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-slate-700 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <Card className="border-slate-700 shadow-xl">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notes yet. Create your first note above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="border-slate-700 shadow-xl hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1">{note.title}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(note)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Note Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>Update your note title and content.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter note title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your note here..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-muted" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateNote} disabled={updatingNote}>
                {updatingNote ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Note</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this note? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className="bg-muted" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deletingNote}>
                {deletingNote ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
