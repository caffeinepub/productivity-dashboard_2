import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import type { HabitCompletion, LocalHabit } from "@/types/local";
import { Flame, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d.toISOString().split("T")[0];
  });
}

const INITIAL_HABITS: LocalHabit[] = [
  { id: 1, name: "Morning Meditation", createdAt: "2026-03-25" },
  { id: 2, name: "Read a Book", createdAt: "2026-03-25" },
  { id: 3, name: "Daily Exercise", createdAt: "2026-03-25" },
];

const weekDates = getWeekDates();
const todayStr = new Date().toISOString().split("T")[0];

const INITIAL_COMPLETIONS: HabitCompletion[] = [
  { habitId: 1, date: weekDates[0] },
  { habitId: 1, date: weekDates[1] },
  { habitId: 1, date: weekDates[2] },
  { habitId: 2, date: weekDates[1] },
  { habitId: 2, date: weekDates[2] },
  { habitId: 3, date: weekDates[0] },
  { habitId: 3, date: weekDates[1] },
  { habitId: 3, date: weekDates[3] },
];

function getStreak(habitId: number, completions: HabitCompletion[]): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const dateStr = d.toISOString().split("T")[0];
    if (completions.some((c) => c.habitId === habitId && c.date === dateStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function HabitTrackerCard() {
  const [habits, setHabits] = useLocalStorage<LocalHabit[]>(
    "fluxflow-habits",
    INITIAL_HABITS,
  );
  const [completions, setCompletions] = useLocalStorage<HabitCompletion[]>(
    "fluxflow-habit-completions",
    INITIAL_COMPLETIONS,
  );
  const [adding, setAdding] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [nextId, setNextId] = useLocalStorage("fluxflow-habit-next-id", 4);

  const toggle = (habitId: number, date: string) => {
    setCompletions((prev) => {
      const exists = prev.some((c) => c.habitId === habitId && c.date === date);
      if (exists)
        return prev.filter((c) => !(c.habitId === habitId && c.date === date));
      return [...prev, { habitId, date }];
    });
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const id = nextId;
    setHabits((prev) => [
      ...prev,
      { id, name: newHabit.trim(), createdAt: todayStr },
    ]);
    setNextId(id + 1);
    setNewHabit("");
    setAdding(false);
    toast.success("Habit added!");
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => prev.filter((c) => c.habitId !== id));
    toast.success("Habit removed.");
  };

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-card dark:shadow-card-dark p-5 flex flex-col gap-4"
      data-ocid="habits.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-cyan" />
          <h2 className="text-sm font-semibold">Habit Tracker</h2>
        </div>
        <Button
          data-ocid="habits.add_button"
          size="icon"
          variant="ghost"
          className="w-7 h-7 rounded-full hover:bg-cyan/10 hover:text-cyan"
          onClick={() => setAdding(true)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "1fr repeat(7, 28px)" }}
      >
        <div />
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="space-y-2" data-ocid="habits.list">
        {habits.map((habit, idx) => {
          const streak = getStreak(habit.id, completions);
          return (
            <div
              key={habit.id}
              className="grid gap-1 items-center group"
              style={{ gridTemplateColumns: "1fr repeat(7, 28px)" }}
              data-ocid={`habits.item.${idx + 1}`}
            >
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs font-medium truncate">
                  {habit.name}
                </span>
                {streak > 0 && (
                  <span className="text-[10px] text-cyan font-bold flex-shrink-0">
                    {streak}🔥
                  </span>
                )}
                <button
                  type="button"
                  data-ocid={`habits.delete_button.${idx + 1}`}
                  onClick={() => deleteHabit(habit.id)}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  aria-label={`Delete ${habit.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {weekDates.map((date, di) => {
                const done = completions.some(
                  (c) => c.habitId === habit.id && c.date === date,
                );
                const isToday = date === todayStr;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => toggle(habit.id, date)}
                    aria-label={`${done ? "Unmark" : "Mark"} ${habit.name} on ${DAYS[di]}`}
                    className={cn(
                      "w-7 h-7 rounded-md text-[10px] font-bold transition-all duration-150 border",
                      done
                        ? "bg-cyan border-cyan text-primary-foreground shadow-sm"
                        : isToday
                          ? "border-cyan/40 text-muted-foreground hover:bg-cyan/20"
                          : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {done ? "✓" : ""}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <p
          className="text-xs text-muted-foreground text-center py-2"
          data-ocid="habits.empty_state"
        >
          No habits yet. Add your first habit!
        </p>
      )}

      {adding && (
        <div className="flex gap-2" data-ocid="habits.add.panel">
          <Input
            data-ocid="habits.input"
            autoFocus
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          <Button
            data-ocid="habits.submit_button"
            size="sm"
            className="h-8 bg-cyan text-primary-foreground hover:opacity-90"
            onClick={addHabit}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
