import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyGoal, TodoItem } from "../backend";
import { TodoCategory } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export { TodoCategory };
export type { DailyGoal, TodoItem };

export function useGetAllTodos() {
  const { actor, isFetching } = useActor();
  return useQuery<TodoItem[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTodos();
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
      return actor.getAllGoals();
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
      return actor.createTodo({
        title,
        category,
        user: identity.getPrincipal(),
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
      return actor.markTodoComplete(id);
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
      return actor.deleteTodo(id);
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
      return actor.createDailyGoal({
        title,
        date: today,
        user: identity.getPrincipal(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
