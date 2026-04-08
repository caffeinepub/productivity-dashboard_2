import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Local type definitions (backend bindgen currently generates empty interface)
export interface TodoItem {
  todoId: bigint;
  title: string;
  category: TodoCategory;
  completed: boolean;
  dueDate: [] | [bigint];
  created: bigint;
}

export interface DailyGoal {
  id: bigint;
  title: string;
  completed: boolean;
  date: string;
}

export enum TodoCategory {
  work = "work",
  personal = "personal",
}

export function useGetAllTodos() {
  const { actor, isFetching } = useActor();
  return useQuery<TodoItem[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as { getAllTodos: () => Promise<TodoItem[]> }
      ).getAllTodos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<DailyGoal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as { getAllGoals: () => Promise<DailyGoal[]> }
      ).getAllGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTodo() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      category,
    }: {
      title: string;
      category: TodoCategory;
    }) => {
      if (!actor || !identity) throw new Error("Not authenticated");
      const principal = identity.getPrincipal();
      return (
        actor as unknown as {
          createTodo: (args: {
            title: string;
            category: TodoCategory;
            user: typeof principal;
          }) => Promise<void>;
        }
      ).createTodo({
        title,
        category,
        user: principal,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useMarkTodoComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return (
        actor as unknown as { markTodoComplete: (id: bigint) => Promise<void> }
      ).markTodoComplete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return (
        actor as unknown as { deleteTodo: (id: bigint) => Promise<void> }
      ).deleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useCreateGoal() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor || !identity) throw new Error("Not authenticated");
      const today = new Date().toISOString().split("T")[0];
      const principal = identity.getPrincipal();
      return (
        actor as unknown as {
          createDailyGoal: (args: {
            title: string;
            date: string;
            user: typeof principal;
          }) => Promise<void>;
        }
      ).createDailyGoal({
        title,
        date: today,
        user: principal,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
