import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useAuth } from "@/hooks/use-auth";

export function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Strict Role Separation: Industry users cannot access Student features
  const userRole = localStorage.getItem("skillsync_user_role") || "student";
  if (userRole === "industry") {
    return <Navigate to="/corporate" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default Layout;
