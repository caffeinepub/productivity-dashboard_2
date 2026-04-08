import { useGetAllTodos } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarCard() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const { data: todos = [] } = useGetAllTodos();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todoDates = new Set(
    todos
      .filter((t) => t.dueDate)
      .map((t) => {
        const d = new Date(Number(t.dueDate) / 1_000_000);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }),
  );

  const prev = () => setViewDate(new Date(year, month - 1, 1));
  const next = () => setViewDate(new Date(year, month + 1, 1));

  // Build cells: leading nulls + days
  const leadingNulls = Array.from({ length: firstDay }, (_, i) => `empty-${i}`);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-card dark:shadow-card-dark p-5 flex flex-col gap-3"
      data-ocid="calendar.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-cyan" />
          <h2 className="text-sm font-semibold">Calendar</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-ocid="calendar.pagination_prev"
            onClick={prev}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold min-w-[90px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            data-ocid="calendar.pagination_next"
            onClick={next}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {leadingNulls.map((key) => (
          <div key={key} />
        ))}
        {dayNumbers.map((day) => {
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          const hasTodo = todoDates.has(`${year}-${month}-${day}`);
          return (
            <div
              key={day}
              className={cn(
                "relative flex items-center justify-center w-7 h-7 mx-auto rounded-full text-xs font-medium transition-colors cursor-default select-none",
                isToday
                  ? "bg-cyan text-primary-foreground font-bold"
                  : "text-foreground hover:bg-muted",
              )}
              aria-current={isToday ? "date" : undefined}
            >
              {day}
              {hasTodo && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
