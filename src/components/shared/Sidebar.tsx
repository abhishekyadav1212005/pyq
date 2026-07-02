"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  FileText,
  Bookmark,
  User,
  ShieldCheck,
  LogOut,
  Flame,
  Zap,
  Activity
} from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { NotificationCenter } from "./NotificationCenter";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const routes = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Practice", href: "/practice", icon: BookOpen },
    { name: "PYQ Library", href: "/library", icon: Library },
    { name: "Mock Tests", href: "/mock-tests", icon: FileText },
    { name: "Flashcards", href: "/flashcards", icon: Activity },
    { name: "Profile", href: "/profile", icon: User }
  ];

  const adminRoute = { name: "Admin Dashboard", href: "/admin", icon: ShieldCheck };

  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 bg-card flex flex-col justify-between hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PhysioPrep
            </span>
          </Link>
        </div>

        {/* User Mini Stat Bar */}
        <div className="p-4 mx-4 my-3 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-md">
              {user.fullName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.college}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1" title="Current Daily Streak">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs font-bold">{user.streakCount} days</span>
            </div>
            <div className="flex items-center gap-1" title="XP Points">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold">{user.xp} XP</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">
              Lvl {user.level}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-4">
          {routes.map(route => {
            const Icon = route.icon;
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-foreground/80 hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {route.name}
              </Link>
            );
          })}

          {/* Admin route */}
          {user.role === "admin" && (
            <Link
              href={adminRoute.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-6 border border-dashed ${
                pathname === adminRoute.href
                  ? "bg-accent text-white border-transparent"
                  : "text-accent border-accent/30 hover:bg-accent/10"
              }`}
            >
              <adminRoute.icon className="w-4 h-4" />
              {adminRoute.name}
            </Link>
          )}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <NotificationCenter />
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
