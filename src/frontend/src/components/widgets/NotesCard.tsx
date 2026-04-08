import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { LocalNote } from "@/types/local";
import { Check, Plus, StickyNote, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const INITIAL_NOTES: LocalNote[] = [
  {
    id: 1,
    title: "Project Ideas",
    body: "Build a habit tracking app with social features. Explore gamification elements to keep users engaged.",
    createdAt: "2026-03-29",
    updatedAt: "2026-03-29",
  },
  {
    id: 2,
    title: "Meeting Notes — Q1 Review",
    body: "Key takeaways: revenue up 24%, expand into APAC market, hire 3 engineers by Q2. Follow up with team leads.",
    createdAt: "2026-03-28",
    updatedAt: "2026-03-30",
  },
  {
    id: 3,
    title: "Book Recommendations",
    body: "Atomic Habits by James Clear, Deep Work by Cal Newport, The Pragmatic Programmer.",
    createdAt: "2026-03-27",
    updatedAt: "2026-03-27",
  },
];

export function NotesCard() {
  const [notes, setNotes] = useLocalStorage<LocalNote[]>(
    "fluxflow-notes",
    INITIAL_NOTES,
  );
  const [nextId, setNextId] = useLocalStorage("fluxflow-notes-next-id", 4);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [editingNote, setEditingNote] = useState<LocalNote | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const addNote = () => {
    if (!newTitle.trim()) return;
    const id = nextId;
    setNotes((prev) => [
      {
        id,
        title: newTitle.trim(),
        body: newBody.trim(),
        createdAt: today,
        updatedAt: today,
      },
      ...prev,
    ]);
    setNextId(id + 1);
    setNewTitle("");
    setNewBody("");
    setAdding(false);
    toast.success("Note saved!");
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (expandedId === id) setExpandedId(null);
    toast.success("Note deleted.");
  };

  const saveEdit = () => {
    if (!editingNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingNote.id ? { ...editingNote, updatedAt: today } : n,
      ),
    );
    setEditingNote(null);
    toast.success("Note updated!");
  };

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-card dark:shadow-card-dark p-5 flex flex-col gap-4"
      data-ocid="notes.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-purple" />
          <h2 className="text-sm font-semibold">Notes & Ideas</h2>
        </div>
        <Button
          data-ocid="notes.add_button"
          size="icon"
          variant="ghost"
          className="w-7 h-7 rounded-full hover:bg-purple/10 hover:text-purple"
          onClick={() => setAdding(true)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {adding && (
        <div
          className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-muted/30"
          data-ocid="notes.add.panel"
        >
          <Input
            data-ocid="notes.input"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title..."
            className="h-8 text-sm"
          />
          <Textarea
            data-ocid="notes.textarea"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Write your thoughts..."
            className="text-sm min-h-[60px] resize-none"
          />
          <div className="flex gap-2">
            <Button
              data-ocid="notes.submit_button"
              size="sm"
              className="h-7 bg-purple text-white hover:opacity-90 text-xs"
              onClick={addNote}
            >
              <Check className="w-3 h-3 mr-1" /> Save
            </Button>
            <Button
              data-ocid="notes.cancel_button"
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setAdding(false)}
            >
              <X className="w-3 h-3 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="max-h-[240px]">
        <ul className="space-y-2 pr-2" data-ocid="notes.list">
          {notes.map((note, idx) => (
            <li
              key={note.id}
              className="rounded-xl border border-border p-3 hover:border-purple/40 transition-colors group"
              data-ocid={`notes.item.${idx + 1}`}
            >
              {editingNote?.id === note.id ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    className="h-7 text-xs"
                  />
                  <Textarea
                    value={editingNote.body}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, body: e.target.value })
                    }
                    className="text-xs min-h-[50px] resize-none"
                  />
                  <div className="flex gap-1.5">
                    <Button
                      data-ocid={`notes.save_button.${idx + 1}`}
                      size="sm"
                      className="h-6 text-[10px] bg-purple text-white hover:opacity-90"
                      onClick={saveEdit}
                    >
                      Save
                    </Button>
                    <Button
                      data-ocid={`notes.cancel_button.${idx + 1}`}
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px]"
                      onClick={() => setEditingNote(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      className="flex-1 text-left"
                      onClick={() =>
                        setExpandedId(expandedId === note.id ? null : note.id)
                      }
                      aria-expanded={expandedId === note.id}
                    >
                      <span className="text-xs font-semibold line-clamp-1 block">
                        {note.title}
                      </span>
                    </button>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        type="button"
                        data-ocid={`notes.edit_button.${idx + 1}`}
                        onClick={() => setEditingNote(note)}
                        className="text-muted-foreground hover:text-purple transition-colors"
                        aria-label={`Edit ${note.title}`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        data-ocid={`notes.delete_button.${idx + 1}`}
                        onClick={() => deleteNote(note.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Delete ${note.title}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() =>
                      setExpandedId(expandedId === note.id ? null : note.id)
                    }
                  >
                    <p
                      className={`text-xs text-muted-foreground mt-1 ${
                        expandedId === note.id ? "" : "line-clamp-2"
                      }`}
                    >
                      {note.body}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                      {note.updatedAt}
                    </span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>

      {notes.length === 0 && !adding && (
        <p
          className="text-xs text-muted-foreground text-center py-4"
          data-ocid="notes.empty_state"
        >
          No notes yet. Capture your ideas!
        </p>
      )}
    </div>
  );
}
