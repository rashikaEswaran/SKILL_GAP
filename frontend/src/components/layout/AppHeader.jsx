import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Bell, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const location = useLocation();

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/app") return "Student Dashboard";
    if (p.startsWith("/app/analyze")) return "Skill Gap Analysis";
    if (p.startsWith("/app/analyses")) return "Analysis History";
    if (p.startsWith("/app/skillswap/create")) return "Create SkillSwap Post";
    if (p.startsWith("/app/skillswap/messages")) return "SkillSwap Messages";
    if (p.startsWith("/app/skillswap/my-activity")) return "My Activity";
    if (p.startsWith("/app/skillswap")) return "Peer SkillSwap Marketplace";
    if (p.startsWith("/app/profile")) return "Profile Settings";
    return "SkillSync AI";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-muted-foreground">
          AI & ML industry readiness benchmark
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild size="sm" className="gap-1.5 shadow-sm">
          <Link to="/app/analyze">
            <PlusCircle className="h-4 w-4" />
            <span>New Analysis</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
export default AppHeader;
