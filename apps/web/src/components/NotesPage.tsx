"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import API, { setAuthToken } from "@/lib/api";
import { getCookie } from "@/lib/utils";
import {
  Edit,
  Search,
  Trash2
} from "lucide-react";
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

  const [authReady, setAuthReady] = useState(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setAuthToken(token);
    setAuthReady(true);
  }, [router]);

  const fetchNotes = useCallback(
    async (query?: string, page: number = 1) => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (query) params.append("query", query);
        params.append("page", page.toString());
        params.append("limit", "6");

        const res = await API.get(`/notes?${params.toString()}`);

        setNotes(res.data.notes);
        setCurrentPage(res.data.page);
        setTotalPages(res.data.total_pages);
      } catch {
        toast.error("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!authReady) return;
    fetchNotes(undefined, 1);
  }, [authReady, fetchNotes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!authReady) return;

    setCurrentPage(1);

    if (debouncedQuery) {
      fetchNotes(debouncedQuery, 1);
    } else {
      fetchNotes(undefined, 1);
    }
  }, [debouncedQuery, authReady, fetchNotes]);

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

      fetchNotes(debouncedQuery, currentPage);
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
      toast.error("Please fill in both fields");
      return;
    }

    try {
      setUpdatingNote(true);

      await API.put(`/notes/${editingNote.id}`, {
        title: editTitle,
        content: editContent,
      });

      toast.success("Note updated!");

      setEditModalOpen(false);
      setEditingNote(null);
      setEditTitle("");
      setEditContent("");

      fetchNotes(debouncedQuery, currentPage);
    } catch {
      toast.error("Failed to update note");
    } finally {
      setUpdatingNote(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };


  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">
          My Notes
        </h1>

        {/* SEARCH */}
        <Card className="mb-6 border-slate-700 shadow-xl">
          <CardContent className="p-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && (
              <Button onClick={clearSearch} className="bg-red-500">
                Clear
              </Button>
            )}
          </CardContent>
        </Card>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-slate-700">
                <CardContent className="p-10">
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-2">

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <Card className="border-slate-700">
            <CardContent className="py-16 text-center">
              <div className="text-slate-400 mb-2">
                {searchQuery ? "No notes match your search" : "No notes yet"}
              </div>
              <div className="text-slate-500 text-sm">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first note to get started"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{note.title}</h3>

                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditModal(note)}
                        >
                          <Edit />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 mt-2">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  onClick={() => fetchNotes(debouncedQuery, currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-slate-300 flex items-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => fetchNotes(debouncedQuery, currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* EDIT MODAL */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>

            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />

            <DialogFooter>
              <Button onClick={updateNote} disabled={updatingNote}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DELETE MODAL */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete note?</DialogTitle>
            </DialogHeader>

            <DialogFooter>
              <Button onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={confirmDelete}
                disabled={deletingNote}
                className="bg-red-500"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}