import { cn } from "@/lib/utils";
import {
  Calendar,
  FolderKanban,
  LayoutDashboard,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar flex flex-col z-30 border-r border-sidebar-border">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="relative w-9 h-9 flex-shrink-0">
          <div className="absolute inset-0 rounded-xl bg-cyan opacity-90" />
          <div className="absolute top-1 left-1 right-0 bottom-0 rounded-xl bg-purple opacity-70" />
          <div className="absolute top-2 left-2 right-0 bottom-0 rounded-xl bg-purple-dim opacity-40" />
        </div>
        <span className="text-sidebar-foreground font-bold text-xl tracking-tight">
          FluxFlow
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            data-ocid={`nav.${item.id}.link`}
            onClick={() => onNavChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
              activeNav === item.id
                ? "bg-cyan text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 text-xs text-sidebar-foreground/40">
        FluxFlow v1.0
      </div>
    </aside>
  );
}
