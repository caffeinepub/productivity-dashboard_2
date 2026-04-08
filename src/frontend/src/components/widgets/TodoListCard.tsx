import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  TodoCategory,
  useCreateTodo,
  useDeleteTodo,
  useGetAllTodos,
  useMarkTodoComplete,
} from "@/hooks/useQueries";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TodoListCard() {
  const [adding, setAdding] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [activeTab, setActiveTab] = useState("work");

  const { data: todos = [], isLoading } = useGetAllTodos();
  const createTodo = useCreateTodo();
  const markComplete = useMarkTodoComplete();
  const deleteTodo = useDeleteTodo();
  const { identity } = useInternetIdentity();

  const workTodos = todos.filter((t) => t.category === TodoCategory.work);
  const personalTodos = todos.filter(
    (t) => t.category === TodoCategory.personal,
  );
  const displayTodos = activeTab === "work" ? workTodos : personalTodos;

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    if (!identity) {
      toast.error("Please login to add todos");
      return;
    }
    try {
      await createTodo.mutateAsync({
        title: newTodo.trim(),
        category:
          activeTab === "work" ? TodoCategory.work : TodoCategory.personal,
      });
      toast.success("Todo added!");
      setNewTodo("");
      setAdding(false);
    } catch {
      toast.error("Failed to add todo");
    }
  };

  const handleComplete = async (id: bigint) => {
    try {
      await markComplete.mutateAsync(id);
    } catch {
      toast.error("Failed to update todo");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteTodo.mutateAsync(id);
      toast.success("Todo deleted.");
    } catch {
      toast.error("Failed to delete todo");
    }
  };

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-card dark:shadow-card-dark p-5 flex flex-col gap-4"
      data-ocid="todo.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-cyan" />
          <h2 className="text-sm font-semibold">Today's To-Do</h2>
        </div>
        <Button
          data-ocid="todo.add_button"
          size="icon"
          variant="ghost"
          className="w-7 h-7 rounded-full hover:bg-cyan/10 hover:text-cyan"
          onClick={() => setAdding(!adding)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-8 bg-muted/50 w-full">
          <TabsTrigger
            data-ocid="todo.work.tab"
            value="work"
            className="flex-1 text-xs data-[state=active]:bg-cyan data-[state=active]:text-primary-foreground"
          >
            Work ({workTodos.length})
          </TabsTrigger>
          <TabsTrigger
            data-ocid="todo.personal.tab"
            value="personal"
            className="flex-1 text-xs data-[state=active]:bg-cyan data-[state=active]:text-primary-foreground"
          >
            Personal ({personalTodos.length})
          </TabsTrigger>
        </TabsList>

        {["work", "personal"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-3">
            {isLoading ? (
              <p
                className="text-xs text-muted-foreground text-center py-4"
                data-ocid="todo.loading_state"
              >
                Loading...
              </p>
            ) : displayTodos.length === 0 ? (
              <p
                className="text-xs text-muted-foreground text-center py-4"
                data-ocid="todo.empty_state"
              >
                No {tab} todos yet!
              </p>
            ) : (
              <ul className="space-y-2">
                {displayTodos.map((todo, idx) => (
                  <li
                    key={todo.todoId.toString()}
                    className="flex items-center gap-3 group"
                    data-ocid={`todo.item.${idx + 1}`}
                  >
                    <Checkbox
                      data-ocid={`todo.checkbox.${idx + 1}`}
                      checked={todo.completed}
                      onCheckedChange={() =>
                        !todo.completed && handleComplete(todo.todoId)
                      }
                      disabled={todo.completed}
                      className="border-border data-[state=checked]:bg-cyan data-[state=checked]:border-cyan flex-shrink-0"
                    />
                    <span
                      className={`flex-1 text-sm truncate ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      data-ocid={`todo.delete_button.${idx + 1}`}
                      onClick={() => handleDelete(todo.todoId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${todo.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {adding && (
        <div className="flex gap-2" data-ocid="todo.add.panel">
          <Input
            data-ocid="todo.input"
            autoFocus
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder={`New ${activeTab} task...`}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          <Button
            data-ocid="todo.submit_button"
            size="sm"
            className="h-8 bg-cyan text-primary-foreground hover:opacity-90"
            onClick={handleAdd}
            disabled={createTodo.isPending}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
