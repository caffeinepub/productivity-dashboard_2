# Productivity Dashboard

## Current State
New project. Empty Motoko backend, empty React frontend.

## Requested Changes (Diff)

### Add
- To-do list: add, edit, delete, complete tasks with categories (Work, Personal)
- Daily goals: add/check off goals with progress bars
- Habit tracker: 7-day grid per habit, mark daily completion, streak tracking
- Notes section: add, edit, delete notes with title and body
- Calendar: monthly view, highlight today and task/event dates
- Progress stats: tasks completed count, habits streak, productivity score
- Dark mode / light mode toggle (persisted)

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend stores: todos, goals, habits (with completions by date), notes
- Backend exposes CRUD for each entity plus stats query
- Frontend: sidebar nav + top header, greeting with dark mode toggle, 3-column card grid with all widgets
- Stats computed from todo completions + habit streaks
- Calendar built in-frontend (no backend needed), highlights dates with tasks
- Dark/light mode: Tailwind dark class on root, toggled via state persisted in localStorage
