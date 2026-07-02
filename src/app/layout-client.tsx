"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { AiAssistant } from "@/components/shared/AiAssistant";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isPublicPage = pathname === "/" || pathname.startsWith("/auth");

  // Redirect to login if user is not logged in and attempts to access student dashboard
  useEffect(() => {
    if (!isLoading && !user && !isPublicPage) {
      router.push("/auth");
    }
  }, [user, isLoading, isPublicPage, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading PhysioPrep...</p>
      </div>
    );
  }

  // Public layouts (Landing, Auth pages)
  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // If user is not authenticated and is on a protected route, show a brief redirection message
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-danger mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Please log in to access this page. Redirecting you to the sign-in page...
        </p>
        <Link href="/auth" className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold shadow-md">
          Sign In Manually
        </Link>
      </div>
    );
  }

  // Dashboard / Portal Layouts
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar on desktop */}
      <Sidebar />

      {/* Main page panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (Navbar handles active portal headers on mobile) */}
        <Navbar />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>

      {/* Floating AI study assistant */}
      <AiAssistant />
    </div>
  );
}

