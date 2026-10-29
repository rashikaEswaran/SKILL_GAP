import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Plus, Sparkles, Target, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/services/supabase";
import { toast } from "sonner";



export function AnalysesHistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    try {
      let dbData = [];
      try {
        const { data, error } = await supabase
          .from("analyses")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) dbData = data;
      } catch {}

      const local = JSON.parse(localStorage.getItem("skillsync_local_analyses") || "[]");
      // Deduplicate by id (local takes precedence since it's more recent)
      const map = new Map();
      [...dbData, ...local].forEach((a) => { if (a?.id) map.set(a.id, a); });
      const combined = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      // Show real empty state — no fake initial data
      setAnalyses(combined);
    } catch (e) {
      console.error(e);
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAnalyses();

    const onVisible = () => { if (!document.hidden) fetchAnalyses(); };
    const onFocus = () => fetchAnalyses();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchAnalyses]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await supabase.from("analyses").delete().eq("id", id);
      // Also remove from localStorage
      const local = JSON.parse(localStorage.getItem("skillsync_local_analyses") || "[]");
      localStorage.setItem("skillsync_local_analyses", JSON.stringify(local.filter((a) => a.id !== id)));
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analysis deleted");
    } catch (err) {
      toast.error("Failed to delete analysis");
    }
  };


  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Analyses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete history of your evaluated skill gaps & industry benchmark reports
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link to="/app/analyze">
            <Plus className="h-4 w-4" />
            <span>New Analysis</span>
          </Link>
        </Button>
      </div>

      {loading && <div className="h-40 animate-pulse rounded-2xl bg-card/60" />}

      {!loading && analyses.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border/70 bg-card/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">No analyses found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Run your first skill gap analysis to benchmark against live industry demand.
          </p>
          <Button asChild className="mt-5 gap-2">
            <Link to="/app/analyze">
              <span>Start Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      )}

      <div className="grid gap-3">
        {analyses.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link to={`/app/analyses/${a.id}`}>
              <Card className="group flex items-center justify-between p-5 border-border/60 bg-card/70 transition-all hover:border-primary/50 hover:bg-card/90 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <p className="font-semibold text-base">{a.title}</p>
                      {a.target_role && (
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {a.target_role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })} ·{" "}
                      {(a.extracted_skills || []).length} skills extracted
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Readiness</p>
                    <p className="font-display text-xl font-bold text-primary">
                      {Math.round(Number(a.readiness_score || 0))}
                      <span className="text-xs text-muted-foreground font-normal">/100</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, a.id)}
                    className="p-1.5 text-muted-foreground/60 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
export default AnalysesHistoryPage;
