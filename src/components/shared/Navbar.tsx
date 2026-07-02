"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Menu, X, Flame, Zap, ShieldCheck, LogOut, LayoutDashboard, BookOpen, Library, FileText, User, Activity } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === "/" || !user;

  const routes = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Practice", href: "/practice", icon: BookOpen },
    { name: "PYQ Library", href: "/library", icon: Library },
    { name: "Mock Tests", href: "/mock-tests", icon: FileText },
    { name: "Flashcards", href: "/flashcards", icon: Activity },
    { name: "Profile", href: "/profile", icon: User }
  ];

  if (!isLandingPage) {
    // Top Bar for Student Portals (Mobile only, since desktop has Sidebar)
    return (
      <header className="md:hidden border-b border-border bg-card px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PhysioPrep
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          <DarkModeToggle />
        </div>

        {/* Mobile slide down drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl z-50 flex flex-col p-4 space-y-2">
            {/* User details */}
            <div className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {user.fullName[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold">{user.fullName}</p>
                  <p className="text-[9px] text-muted-foreground">{user.college}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  {user.streakCount}d
                </span>
                <span className="text-xs font-bold flex items-center gap-0.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  {user.xp}
                </span>
              </div>
            </div>

            {/* Nav routes */}
            {routes.map(route => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    pathname === route.href ? "bg-primary text-white" : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {route.name}
                </Link>
              );
            })}

            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent border border-dashed border-accent/30 ${
                  pathname === "/admin" ? "bg-accent text-white" : "hover:bg-accent/10"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>
    );
  }

  // Marketing Navbar for Landing Page
  return (
    <header className="border-b border-border bg-card/85 backdrop-blur-md px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          PhysioPrep
        </span>
      </Link>

      {/* Desktop Landing Links */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Features</a>
        <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Testimonials</a>
        <a href="#faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">FAQ</a>
        <a href="#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Pricing</a>
      </nav>

      <div className="flex items-center gap-4">
        <DarkModeToggle />
        {user ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-all shadow-md hover:shadow-primary/20"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-all shadow-md hover:shadow-primary/20"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
