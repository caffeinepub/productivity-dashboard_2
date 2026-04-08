export interface LocalHabit {
  id: number;
  name: string;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: number;
  date: string; // YYYY-MM-DD
}

export interface LocalNote {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
