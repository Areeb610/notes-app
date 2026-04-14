"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Edit, FileText, Loader2, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updatingNote, setUpdatingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const fetchNotes = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      const url = query ? `/notes?query=${encodeURIComponent(query)}` : "/notes";
      const res = await API.get(url);
      setNotes(res.data);
    } catch {
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch notes when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchNotes(debouncedQuery);
    } else {
      fetchNotes();
    }
  }, [debouncedQuery, fetchNotes]);

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
      if (searchQuery) {
        fetchNotes(searchQuery);
      } else {
        fetchNotes();
      }
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
      if (searchQuery) {
        fetchNotes(searchQuery);
      } else {
        fetchNotes();
      }
    } catch {
      toast.error("Failed to update note");
    } finally {
      setUpdatingNote(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">My Notes</h1>

        {/* Search Bar */}
        <Card className="mb-6 border-slate-700 shadow-xl">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button className="bg-red-500 h-10 hover:bg-red-600" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>
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
              <p className="text-muted-foreground">
                {isSearching ? "No notes yet! Create a new note to get started." : "No notes found matching your search."}
              </p>
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
