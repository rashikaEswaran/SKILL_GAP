import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Sparkles,
  Target,
  Activity,
  Trophy,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/services/supabase";
import { DEFAULT_INDUSTRY_SKILLS } from "@/services/mock-storage";

function Stat({ label, value, suffix = "", icon: Icon, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold">
              {value}
              <span className="text-xl font-medium text-muted-foreground">{suffix}</span>
            </p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      let dbAnalyses = [];
      let userId = null;
      try {
        const { data: userRes } = await supabase.auth.getUser();
        userId = userRes?.user?.id;
        // Also check demo user
        if (!userId) {
          const demo = localStorage.getItem("skillsync_demo_user");
          if (demo) userId = JSON.parse(demo)?.id;
        }
        const { data: analyses, error } = await supabase
          .from("analyses")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && analyses) dbAnalyses = analyses;
      } catch (err) {
        console.warn("DB analyses fetch warning:", err);
      }

      // Always check local storage analyses saved by AnalyzePage
      let localAnalyses = [];
      try {
        localAnalyses = JSON.parse(localStorage.getItem("skillsync_local_analyses") || "[]");
        // localAnalyses are prepended on insert, so reverse to chronological order
        localAnalyses = [...localAnalyses].reverse();
      } catch (e) {
        console.warn("LocalStorage analyses parse error:", e);
      }

      // Combine unique analyses by id
      const map = new Map();
      // Insert dbAnalyses then localAnalyses (localAnalyses will take precedence if fresh)
      [...dbAnalyses, ...localAnalyses].forEach((a) => {
        if (a && a.id) map.set(a.id, a);
      });

      let allAnalyses = Array.from(map.values());

      // Sort chronologically ascending so the newest analysis is always at the end
      allAnalyses.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());

      // Filter for user or fallback demo user, but if filtering leaves 0 results while local has items, use allAnalyses
      let userAnalyses = allAnalyses.filter(
        (a) => !userId || a.user_id === userId || a.user_id === "00000000-0000-0000-0000-000000000001"
      );

      if (userAnalyses.length === 0 && allAnalyses.length > 0) {
        userAnalyses = allAnalyses;
      }

      // If no analyses at all yet, show empty state (real zeros) — not fake demo data
      const hasRealData = userAnalyses.length > 0;

      const totalAnalyses = hasRealData ? userAnalyses.length : 0;
      const latest = hasRealData ? userAnalyses[userAnalyses.length - 1] : null;

      const totalSkills = latest ? (latest.extracted_skills || []).length : 0;
      const industryMatch = latest ? (latest.industry_match || 0) : 0;
      const readinessScore = latest ? (latest.readiness_score || 0) : 0;
      const gapScore = latest ? (latest.gap_score || 0) : 0;

      const trend = userAnalyses.map((a, idx) => ({
        name: `#${idx + 1} ${a.target_role?.slice(0, 8) || "Run"}`,
        readiness: a.readiness_score || 0,
        match: a.industry_match || 0,
      }));

      if (trend.length === 0) {
        trend.push({ name: "No Data Yet", readiness: 0, match: 0 });
      }

      setData({
        totalAnalyses,
        totalSkills,
        industryMatch,
        readinessScore,
        gapScore,
        trend,
        topIndustrySkills: DEFAULT_INDUSTRY_SKILLS,
      });
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();

    // Re-fetch whenever the user returns to this tab/window so new analyses are reflected
    const onVisible = () => {
      if (!document.hidden) loadStats();
    };
    const onFocus = () => loadStats();

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadStats]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-2xl bg-card/60" />
        <div className="grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-card/50" />
          ))}
        </div>
      </div>
    );
  }

  const radarData = data.topIndustrySkills.slice(0, 6).map((s) => ({
    skill: s.name,
    demand: s.demand_score,
  }));

  const pieData = [
    { name: "Matched Skills", value: data.industryMatch, color: "#10b981" },
    { name: "Identified Gaps", value: data.gapScore, color: "#f43f5e" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent p-8 shadow-sm backdrop-blur"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BrainCircuit className="h-4 w-4" />
            <span>AI & Machine Learning Readiness Dashboard</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground">
            Track your skills. Bridge your gaps. Get hired.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
            Your personalized placement preparation overview. Analyze newly completed courses or projects to benchmark against hiring expectations.
          </p>
          <div className="mt-5 flex gap-3">
            <Button asChild className="gap-2 shadow-sm">
              <Link to="/app/analyze">
                <span>Run New Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/skillswap">Explore SkillSwap</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Skills Profile"
          value={data.totalSkills}
          icon={Sparkles}
          color="bg-primary/15 text-primary"
        />
        <Stat
          label="Industry Match"
          value={Math.round(data.industryMatch)}
          suffix="%"
          icon={Target}
          color="bg-cyan-500/15 text-cyan-400"
        />
        <Stat
          label="Readiness Score"
          value={Math.round(data.readinessScore)}
          suffix="/100"
          icon={Trophy}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <Stat
          label="Identified Gaps"
          value={Math.round(data.gapScore)}
          suffix="%"
          icon={Activity}
          color="bg-amber-500/15 text-amber-400"
        />
      </div>

      {/* Empty State Banner when no analyses */}
      {data.totalAnalyses === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center"
        >
          <GraduationCap className="mx-auto h-12 w-12 text-primary/60" />
          <h3 className="mt-3 font-display text-lg font-bold text-foreground">
            No analysis data yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            Your charts and scores will update automatically once you run your first skill gap analysis.
            Upload your resume or paste your skills to get started.
          </p>
          <Button asChild className="mt-4 gap-2">
            <Link to="/app/analyze">
              <span>Run Your First Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 p-6 lg:col-span-2 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Readiness Growth Over Time</h3>
              <p className="text-xs text-muted-foreground">Historical progression across past analyses</p>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(24, 24, 27, 0.95)",
                    border: "1px solid rgba(63, 63, 70, 0.4)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="readiness"
                  name="Readiness Score"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="match"
                  name="Industry Match"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ fill: "#06b6d4" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Skills Coverage</h3>
            <p className="text-xs text-muted-foreground">Match ratio vs detected gaps</p>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(24, 24, 27, 0.95)",
                      border: "1px solid rgba(63, 63, 70, 0.4)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <Progress value={data.industryMatch} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(data.industryMatch)}% matched</span>
              <span>{Math.round(data.gapScore)}% gap</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold">Top In-Demand Industry Skills</h3>
          <p className="text-xs text-muted-foreground">Current tech hiring requirements</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topIndustrySkills.slice(0, 8)}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(24, 24, 27, 0.95)",
                    border: "1px solid rgba(63, 63, 70, 0.4)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="demand_score" name="Demand Score" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold">Domain Demand Radar</h3>
          <p className="text-xs text-muted-foreground">Strategic technologies reshaping entry-level recruitment</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="skill" stroke="#a1a1aa" fontSize={11} />
                <PolarRadiusAxis stroke="#71717a" fontSize={10} />
                <Radar dataKey="demand" name="Market Demand" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default DashboardPage;
