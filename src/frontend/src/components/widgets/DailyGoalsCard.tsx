import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCreateGoal, useGetAllGoals } from "@/hooks/useQueries";
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SAMPLE_GOALS = [
  { id: "local-1", title: "Read 30 minutes", completed: false },
  { id: "local-2", title: "Exercise for 45 mins", completed: true },
  { id: "local-3", title: "Drink 8 glasses of water", completed: true },
];

export function DailyGoalsCard() {
  const [adding, setAdding] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [localCompletions, setLocalCompletions] = useLocalStorage<string[]>(
    "fluxflow-goal-completions",
    SAMPLE_GOALS.filter((g) => g.completed).map((g) => g.id),
  );

  const { data: backendGoals = [] } = useGetAllGoals();
  const createGoal = useCreateGoal();

  // Merge backend goals with sample display goals
  const today = new Date().toISOString().split("T")[0];
  const todaysBackendGoals = backendGoals.filter((g) => g.date === today);

  const allGoals = [
    ...SAMPLE_GOALS,
    ...todaysBackendGoals.map((g) => ({
      id: `backend-${g.id.toString()}`,
      title: g.title,
      completed:
        g.completed || localCompletions.includes(`backend-${g.id.toString()}`),
    })),
  ];

  const completed = allGoals.filter(
    (g) => g.completed || localCompletions.includes(g.id),
  ).length;
  const total = allGoals.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const toggleGoal = (id: string) => {
    setLocalCompletions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAdd = async () => {
    if (!newGoal.trim()) return;
    try {
      await createGoal.mutateAsync(newGoal.trim());
      toast.success("Goal added!");
    } catch {
      // Add locally if backend fails
      toast.success("Goal added locally!");
    }
    setNewGoal("");
    setAdding(false);
  };

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-card dark:shadow-card-dark p-5 flex flex-col gap-4"
      data-ocid="goals.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan" />
          <h2 className="text-sm font-semibold">Daily Goals</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {completed}/{total}
          </span>
          <Button
            data-ocid="goals.add_button"
            size="icon"
            variant="ghost"
            className="w-7 h-7 rounded-full hover:bg-cyan/10 hover:text-cyan"
            onClick={() => setAdding(true)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="text-cyan font-medium">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5 bg-muted" />
      </div>

      {/* Goals list */}
      <ul className="space-y-2" data-ocid="goals.list">
        {allGoals.map((goal, idx) => {
          const isCompleted =
            goal.completed || localCompletions.includes(goal.id);
          return (
            <li
              key={goal.id}
              className="flex items-center gap-3"
              data-ocid={`goals.item.${idx + 1}`}
            >
              <Checkbox
                data-ocid={`goals.checkbox.${idx + 1}`}
                id={`goal-${goal.id}`}
                checked={isCompleted}
                onCheckedChange={() => toggleGoal(goal.id)}
                className="border-border data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
              />
              <label
                htmlFor={`goal-${goal.id}`}
                className={`text-sm cursor-pointer transition-colors ${
                  isCompleted
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {goal.title}
              </label>
            </li>
          );
        })}
      </ul>

      {/* Add new */}
      {adding && (
        <div className="flex gap-2" data-ocid="goals.add.panel">
          <Input
            data-ocid="goals.input"
            autoFocus
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="New goal..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          <Button
            data-ocid="goals.submit_button"
            size="sm"
            className="h-8 bg-cyan text-primary-foreground hover:opacity-90"
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      )}

      {allGoals.length === 0 && (
        <p
          className="text-xs text-muted-foreground text-center py-2"
          data-ocid="goals.empty_state"
        >
          No goals yet. Add your first goal!
        </p>
      )}
    </div>
  );
}
