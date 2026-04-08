import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { CalendarCard } from "./components/widgets/CalendarCard";
import { DailyGoalsCard } from "./components/widgets/DailyGoalsCard";
import { HabitTrackerCard } from "./components/widgets/HabitTrackerCard";
import { NotesCard } from "./components/widgets/NotesCard";
import { ProgressStatsCard } from "./components/widgets/ProgressStatsCard";
import { TodoListCard } from "./components/widgets/TodoListCard";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useDarkMode } from "./hooks/useLocalStorage";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [activeNav, setActiveNav] = useState("dashboard");
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const isAuthenticated = !!identity;
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="ml-60 flex flex-col min-h-screen">
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          isAuthenticated={isAuthenticated}
          onLogin={login}
          onLogout={clear}
          userName="Sarah J."
        />

        <main className="flex-1 p-6" data-ocid="dashboard.page">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}, <span className="text-cyan">Sarah!</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl border border-cyan/30 bg-cyan/5 text-sm text-muted-foreground flex items-center justify-between"
            >
              <span>
                Login with Internet Identity to sync your data to the
                blockchain.
              </span>
              <button
                type="button"
                data-ocid="dashboard.login.button"
                onClick={login}
                disabled={isLoggingIn}
                className="text-cyan font-semibold hover:underline text-xs ml-3 flex-shrink-0"
              >
                {isLoggingIn ? "Logging in..." : "Login →"}
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5"
            data-ocid="dashboard.section"
          >
            <DailyGoalsCard />
            <HabitTrackerCard />
            <CalendarCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <TodoListCard />
            <NotesCard />
            <ProgressStatsCard />
          </motion.div>
        </main>

        <footer className="px-6 py-4 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-cyan">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}
