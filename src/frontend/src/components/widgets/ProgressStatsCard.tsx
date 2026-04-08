import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGetAllTodos } from "@/hooks/useQueries";
import type { HabitCompletion } from "@/types/local";
import { BarChart3 } from "lucide-react";

function RadialProgress({
  value,
  label,
  color,
}: { value: number; label: string; color: string }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 72 72"
          aria-hidden="true"
        >
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/40"
          />
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {value}%
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  color,
}: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function ProgressStatsCard() {
  const { data: todos = [] } = useGetAllTodos();
  const [completions] = useLocalStorage<HabitCompletion[]>(
    "fluxflow-habit-completions",
    [],
  );

  const today = new Date().toISOString().split("T")[0];

  const completedToday = todos.filter((t) => t.completed).length;
  const totalTodos = todos.length;
  const taskRate =
    totalTodos > 0 ? Math.round((completedToday / totalTodos) * 100) : 0;

  const todayHabits = completions.filter((c) => c.date === today);
  const habitConsistency = Math.min(100, todayHabits.length * 20);

  const productivity = Math.round(taskRate * 0.5 + habitConsistency * 0.5);

  const focusData = [
    { day: "Mon", mins: 85 },
    { day: "Tue", mins: 120 },
    { day: "Wed", mins: 60 },
    { day: "Thu", mins: 150 },
    { day: "Fri", mins: 95 },
    { day: "Sat", mins: 40 },
    { day: "Sun", mins: 110 },
  ];
  const maxFocus = Math.max(...focusData.map((d) => d.mins));

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-card dark:shadow-card-dark p-5 flex flex-col gap-5"
      data-ocid="stats.card"
    >
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-cyan" />
        <h2 className="text-sm font-semibold">Progress Stats</h2>
      </div>

      <div className="flex justify-around">
        <RadialProgress
          value={taskRate}
          label="Task Completion"
          color="oklch(0.82 0.14 205)"
        />
        <RadialProgress
          value={habitConsistency}
          label="Habit Consistency"
          color="oklch(0.74 0.15 295)"
        />
        <RadialProgress
          value={productivity}
          label="Productivity Score"
          color="oklch(0.72 0.16 145)"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2.5 rounded-xl bg-muted/40">
          <div className="text-2xl font-bold text-cyan">{completedToday}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Tasks Done
          </div>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/40">
          <div className="text-2xl font-bold text-purple">
            {todayHabits.length}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Habits Done
          </div>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/40">
          <div
            className="text-2xl font-bold"
            style={{ color: "oklch(0.72 0.16 145)" }}
          >
            {productivity}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Score</div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">
          Focus Minutes (this week)
        </span>
        <div
          className="flex items-end gap-1 h-16"
          aria-label="Focus minutes bar chart"
        >
          {focusData.map(({ day, mins }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm transition-all duration-700"
                style={{
                  height: `${maxFocus > 0 ? Math.round((mins / maxFocus) * 48) : 4}px`,
                  backgroundColor:
                    day === "Thu"
                      ? "oklch(0.82 0.14 205)"
                      : "oklch(0.74 0.15 295 / 0.5)",
                }}
              />
              <span className="text-[9px] text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Bar
          label="Task Completion Rate"
          value={completedToday}
          max={Math.max(totalTodos, 1)}
          color="oklch(0.82 0.14 205)"
        />
        <Bar
          label="Habit Consistency"
          value={todayHabits.length}
          max={5}
          color="oklch(0.74 0.15 295)"
        />
      </div>
    </div>
  );
}
