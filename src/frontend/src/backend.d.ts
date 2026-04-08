import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NoteInput {
    title: string;
    body: string;
    user: Principal;
}
export interface DailyGoal {
    id: bigint;
    title: string;
    date: string;
    completed: boolean;
}
export interface HabitCompletion {
    date: string;
    habitId: bigint;
}
export interface TodoItem {
    title: string;
    created: bigint;
    completed: boolean;
    dueDate?: bigint;
    todoId: bigint;
    category: TodoCategory;
}
export interface HabitCompletionInput {
    date: string;
    user: Principal;
    habitId: bigint;
}
export interface Habit {
    id: bigint;
    name: string;
}
export interface DailyGoalInput {
    title: string;
    date: string;
    user: Principal;
}
export interface TodoInput {
    title: string;
    user: Principal;
    dueDate?: bigint;
    category: TodoCategory;
}
export interface Note {
    id: bigint;
    title: string;
    created: bigint;
    body: string;
    updated: bigint;
}
export enum TodoCategory {
    work = "work",
    personal = "personal"
}
export interface backendInterface {
    createDailyGoal(input: DailyGoalInput): Promise<DailyGoal>;
    createHabit(name: string): Promise<Habit>;
    createHabitCompletion(input: HabitCompletionInput): Promise<HabitCompletion>;
    createNote(input: NoteInput): Promise<Note>;
    createTodo(input: TodoInput): Promise<TodoItem>;
    deleteHabit(id: bigint): Promise<boolean>;
    deleteNote(id: bigint): Promise<boolean>;
    deleteTodo(id: bigint): Promise<boolean>;
    getAllGoals(): Promise<Array<DailyGoal>>;
    getAllTodos(): Promise<Array<TodoItem>>;
    isRegistered(user: Principal): Promise<boolean>;
    markTodoComplete(id: bigint): Promise<void>;
}
