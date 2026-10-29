import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  History,
  User2,
  LogOut,
  Sparkles,
  ArrowLeftRight,
  BrainCircuit,
  MessageSquare,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Skill Gap Analysis", url: "/app/analyze", icon: Target },
  { title: "My Analyses", url: "/app/analyses", icon: History },
  { title: "SkillSwap Marketplace", url: "/app/skillswap", icon: ArrowLeftRight },
  { title: "SkillSwap Messages", url: "/app/skillswap/messages", icon: MessageSquare },
  { title: "My Activity", url: "/app/skillswap/my-activity", icon: Activity },
  { title: "Student Profile", url: "/app/profile", icon: User2 },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("skillsync_demo_user");
      localStorage.removeItem("skillsync_user_role");
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out err:", e);
    }
    navigate("/auth");
  };


  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/60 bg-sidebar/95 backdrop-blur-md">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-5">
        <Link to="/app" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-sidebar-foreground">
              SkillSync
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              AI & ML Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Core Workspace
        </div>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive =
              item.url === "/app"
                ? location.pathname === "/app"
                : location.pathname.startsWith(item.url);

            return (
              <Link
                key={item.url}
                to={item.url}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 transition-transform group-hover:scale-105 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* ML & AI Status Widget */}
        <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>ML Models & AI Core</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Python ML Pipeline + Gemini AI extraction active.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Local & Live Services Ready</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 p-3 space-y-2">
        {user && (
          <div className="flex items-center gap-2.5 rounded-lg bg-card/60 px-2.5 py-2 border border-border/40">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
              {(user.user_metadata?.full_name || user.email || "S")[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-semibold text-foreground">
                {user.user_metadata?.full_name || "Student"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {user.email || "student@skillsync.edu"}
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    </aside>
  );
}
export default AppSidebar;
