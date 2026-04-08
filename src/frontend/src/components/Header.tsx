import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Moon, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName: string;
}

export function Header({
  isDark,
  onToggleDark,
  isAuthenticated,
  onLogin,
  onLogout,
  userName,
}: HeaderProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
      <nav className="flex items-center gap-6" aria-label="Top navigation">
        {["Dashboard", "Projects", "Calendar", "Notes", "Analytics"].map(
          (item) => (
            <button
              key={item}
              type="button"
              data-ocid={`header.${item.toLowerCase()}.link`}
              className={`text-sm font-medium transition-colors ${
                item === "Dashboard"
                  ? "text-foreground border-b-2 border-cyan pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="header.darkmode.toggle"
          onClick={onToggleDark}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
          {isDark ? "Dark" : "Light"}
        </button>

        <button
          type="button"
          data-ocid="header.notifications.button"
          className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan" />
        </button>

        {isAuthenticated ? (
          <button
            type="button"
            data-ocid="header.user.button"
            onClick={onLogout}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-purple text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        ) : (
          <Button
            data-ocid="header.login.button"
            size="sm"
            onClick={onLogin}
            className="bg-cyan text-primary-foreground hover:opacity-90 text-xs h-8"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
