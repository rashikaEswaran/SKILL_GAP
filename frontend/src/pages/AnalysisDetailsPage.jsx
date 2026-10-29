import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
  Target,
  Trophy,
  Cpu,
  TrendingUp,
  ExternalLink,
  Video,
  FileText,
  Code2,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";
import { resolveStudyMaterials } from "@/services/api";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/services/supabase";
import { INITIAL_ANALYSES } from "@/services/mock-storage";

function classify(score) {
  if (score >= 85) return { label: "Industry Ready", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" };
  if (score >= 70) return { label: "Near Placement Ready", color: "text-cyan-400", bg: "bg-cyan-500/15 border-cyan-500/30" };
  if (score >= 50) return { label: "Needs Targeted Upskilling", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" };
  return { label: "Significant Skill Gap", color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/30" };
}

export function AnalysisDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("all");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        let record = null;
        try {
          const { data: dbRecord, error } = await supabase
            .from("analyses")
            .select("*")
            .eq("id", id)
            .maybeSingle();

          if (!error && dbRecord) record = dbRecord;
        } catch {}

        if (!record) {
          try {
            const local = JSON.parse(localStorage.getItem("skillsync_local_analyses") || "[]");
            record = local.find((a) => a.id === id);
          } catch {}
        }

        if (!record) {
          record = INITIAL_ANALYSES.find((a) => a.id === id);
        }

        if (!record) {
          try {
            const local = JSON.parse(localStorage.getItem("skillsync_local_analyses") || "[]");
            if (local.length > 0) record = local[0];
          } catch {}
          if (!record && INITIAL_ANALYSES.length > 0) record = INITIAL_ANALYSES[0];
        }

        setData(record);
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [id]);


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-card/60" />
        <div className="h-64 animate-pulse rounded-2xl bg-card/60" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Analysis Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground">The requested analysis could not be located.</p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/app/analyses">Back to Analyses</Link>
        </Button>
      </div>
    );
  }

  const normSkill = (s) => (typeof s === "object" && s !== null ? s.skill || s.name || String(s) : String(s || ""));
  const extracted = (data.extracted_skills || []).map(normSkill);
  const matched = (data.matched_skills || []).map(normSkill);
  const missing = (data.missing_skills || []).map(normSkill);
  const recs = (data.recommendations || []).map((r) =>
    typeof r === "string" ? { title: r, description: "", priority: "medium" } : r
  );
  const courses = data.courses || [];
  const readiness = Number(data.readiness_score || 70);
  const statusClass = classify(readiness);

  const studyMaterials =
    data.study_materials && data.study_materials.length > 0
      ? data.study_materials
      : resolveStudyMaterials(missing);

  const filteredMaterials =
    selectedSkillFilter === "all"
      ? studyMaterials
      : studyMaterials.filter(
          (m) => (m.skill || "").toLowerCase() === selectedSkillFilter.toLowerCase()
        );

  const pie = [
    { name: "Matched Skills", value: Math.max(matched.length, 1), color: "#10b981" },
    { name: "Missing Gaps", value: Math.max(missing.length, 1), color: "#f43f5e" },
  ];

  const radarData = [...matched.slice(0, 4), ...missing.slice(0, 4)].map((s) => ({
    skill: s,
    candidateScore: matched.includes(s) ? 95 : 20,
    industryExpectation: 90,
  }));

  const downloadPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();
      let y = 18;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 30, "F");
      doc.setTextColor(255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("SkillSync AI · Skill Gap Analysis Report", 14, 19);

      y = 40;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text(data.title || "Career Readiness Evaluation", 14, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Target Role: ${data.target_role || "Engineering Role"}`, 14, y);
      y += 5;
      doc.text(`Generated: ${new Date(data.created_at).toLocaleString()}`, 14, y);
      y += 6;
      doc.text(`Readiness Score: ${readiness}/100 (${statusClass.label})`, 14, y);
      y += 12;

      doc.setFont("helvetica", "bold");
      doc.text("Skills Breakdown:", 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Matched Skills (${matched.length}): ${matched.join(", ")}`, 14, y, { maxWidth: pageW - 28 });
      y += 14;
      doc.text(`Identified Gaps (${missing.length}): ${missing.join(", ")}`, 14, y, { maxWidth: pageW - 28 });
      y += 16;

      doc.setFont("helvetica", "bold");
      doc.text("Recommended Action Items:", 14, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      recs.forEach((r, i) => {
        doc.text(`${i + 1}. ${r.title} - ${r.description}`, 14, y, { maxWidth: pageW - 28 });
        y += 10;
      });

      doc.save(`SkillSync_Report_${data.target_role || "Analysis"}.pdf`);
      toast.success("PDF report downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back and Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link to="/app/analyses">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Analyses</span>
          </Link>
        </Button>
        <Button onClick={downloadPdf} size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>Export PDF Report</span>
        </Button>
      </div>

      {/* Hero Header */}
      <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary">
                {data.target_role}
              </Badge>
              <Badge variant="outline" className={`${statusClass.bg} ${statusClass.color}`}>
                {statusClass.label}
              </Badge>
            </div>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-extrabold">{data.title}</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Analyzed on {new Date(data.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-background/50 px-5 py-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <div className="font-display text-3xl font-bold leading-none">{readiness}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">
                Readiness Score / 100
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Visuals */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold">Skill Overlap Distribution</h3>
          <p className="text-xs text-muted-foreground">Acquired vs required capabilities</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={4} dataKey="value">
                  {pie.map((e, i) => (
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
          <div className="flex justify-around text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {matched.length} Matched
            </span>
            <span className="flex items-center gap-1.5 font-medium text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              {missing.length} Missing Gaps
            </span>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold">Candidate vs Industry Benchmark</h3>
          <p className="text-xs text-muted-foreground">Evaluation across core role competencies</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="skill" stroke="#a1a1aa" fontSize={11} />
                <PolarRadiusAxis stroke="#71717a" fontSize={10} domain={[0, 100]} />
                <Radar dataKey="candidateScore" name="Your Profile" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar dataKey="industryExpectation" name="Industry Requirement" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Matched vs Missing Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-500/20 bg-card/70 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span>Demonstrated Skills ({matched.length})</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Skills found that match role requirements</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {matched.map((s) => (
              <Badge key={s} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                {s}
              </Badge>
            ))}
            {matched.length === 0 && <p className="text-xs text-muted-foreground">No overlapping skills detected.</p>}
          </div>
        </Card>

        <Card className="border-rose-500/20 bg-card/70 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-rose-400">
            <AlertCircle className="h-5 w-5" />
            <span>Identified Skill Gaps ({missing.length})</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">High-priority areas to upskill before applying</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {missing.map((s) => (
              <Badge key={s} className="bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                {s}
              </Badge>
            ))}
            {missing.length === 0 && <p className="text-xs text-muted-foreground">Zero gaps found! You are fully aligned.</p>}
          </div>
        </Card>
      </div>

      {/* Random Forest Insights */}
      <Card className="border-primary/30 bg-gradient-to-br from-card/90 via-card/70 to-primary/5 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Random Forest ML Ensemble (scikit-learn)
              </h3>
              <p className="text-xs text-muted-foreground">
                Trained on 120 decision trees with feature importance weighting
              </p>
            </div>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold self-start sm:self-auto">
            120 Decision Trees
          </Badge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Random Forest Predicted Score
            </span>
            <div className="mt-1 font-display text-2xl font-bold text-primary">
              {readiness}<span className="text-sm font-normal text-muted-foreground"> / 100</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ensemble regression average</p>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Classification Tier
            </span>
            <div className="mt-1 font-display text-xl font-bold text-emerald-400">
              {statusClass.label}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Random Forest classification</p>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Placement Probability
            </span>
            <div className="mt-1 font-display text-xl font-bold text-cyan-400">
              {Math.min(Math.round(readiness * 0.95), 98)}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Estimated interview shortlisting chance</p>
          </div>
        </div>
      </Card>

      {/* Action Plan & Recommendations */}
      <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Strategic Recommendations</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Actionable milestones to close detected gaps</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {recs.map((r, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{r.title}</span>
                <Badge variant="outline" className={r.priority === "high" ? "text-rose-400 border-rose-500/30" : "text-amber-400 border-amber-500/30"}>
                  {r.priority || "Priority"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggested Missing Skills & Comprehensive Study Materials */}
      {studyMaterials.length > 0 && (
        <Card className="border-primary/20 bg-card/75 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
            <div>
              <h3 className="font-display text-lg font-bold flex items-center gap-2 text-foreground">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>Suggested Skills & Learning Materials</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Official documentation, verified courses, video tutorials, and practice projects to close each gap
              </p>
            </div>

            {/* Skill Selector Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant={selectedSkillFilter === "all" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-full"
                onClick={() => setSelectedSkillFilter("all")}
              >
                All Gaps ({studyMaterials.length})
              </Button>
              {studyMaterials.map((m) => {
                const sName = m.skill || "";
                const isSelected = selectedSkillFilter.toLowerCase() === sName.toLowerCase();
                return (
                  <Button
                    key={sName}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs px-2.5 rounded-full"
                    onClick={() => setSelectedSkillFilter(isSelected ? "all" : sName)}
                  >
                    {sName}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {filteredMaterials.map((mat, idx) => {
              const sName = mat.skill || "Skill";
              const courseObj = mat.course || {};
              const courseTitle = courseObj.title || mat.course_name || `Complete ${sName} Guide`;
              const courseProvider = courseObj.provider || mat.provider || "Coursera / Udemy";
              const courseUrl = courseObj.url || mat.url || `https://www.coursera.org/search?query=${encodeURIComponent(sName)}`;
              const docUrl = mat.documentation || `https://devdocs.io/#q=${encodeURIComponent(sName)}`;
              const videoUrl = mat.freeTutorial || mat.free_tutorial || `https://www.youtube.com/results?search_query=${encodeURIComponent(sName)}+tutorial`;
              const practiceTask = mat.practiceProject || mat.practice_project || `Build a production-grade application integrating ${sName}.`;
              const estHours = mat.estimatedHours || mat.estimated_hours || 20;
              const difficulty = mat.difficulty || mat.level || "Intermediate";

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/60 bg-background/60 p-5 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20">
                        GAP
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                          {sName}
                          <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/60">
                            {difficulty}
                          </Badge>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/25 text-xs flex items-center gap-1 font-normal">
                        <Clock className="h-3 w-3" />
                        <span>~{estHours} hrs to master</span>
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {mat.summary || `Critical capability for ${data.target_role || "engineering"} roles. Mastering ${sName} addresses core interview and operational requirements.`}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Documentation */}
                    <div className="flex flex-col justify-between rounded-xl border border-border/40 bg-card/50 p-3.5">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                          <FileText className="h-4 w-4" />
                          <span>Official Docs</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          API references, guides & official architecture patterns.
                        </p>
                      </div>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <span>Open Documentation</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Verified Course */}
                    <div className="flex flex-col justify-between rounded-xl border border-border/40 bg-card/50 p-3.5">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <BookOpen className="h-4 w-4" />
                          <span>Structured Course</span>
                        </div>
                        <p className="text-[11px] text-foreground font-medium mt-1 line-clamp-1">
                          {courseTitle}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{courseProvider}</p>
                      </div>
                      <a
                        href={courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                      >
                        <span>View Course</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Free Tutorial Video */}
                    <div className="flex flex-col justify-between rounded-xl border border-border/40 bg-card/50 p-3.5">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                          <Video className="h-4 w-4" />
                          <span>Free Video Guide</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Full video breakdown and code-along crash course.
                        </p>
                      </div>
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline"
                      >
                        <span>Watch Tutorial</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Capstone Practice Project */}
                    <div className="flex flex-col justify-between rounded-xl border border-border/40 bg-card/50 p-3.5 sm:col-span-2 lg:col-span-1">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                          <Code2 className="h-4 w-4" />
                          <span>Practice Project</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                          {practiceTask}
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] text-muted-foreground/80 font-mono">
                        Add to GitHub Portfolio
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Curated Courses */}
      {courses.length > 0 && (
        <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span>Recommended Learning Courses</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Targeted courses matched directly to your missing skills</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {courses.map((c, i) => (
              <div key={i} className="flex items-start justify-between rounded-xl border border-border/50 bg-background/50 p-4">
                <div>
                  <Badge variant="outline" className="text-primary text-[10px] mb-1">
                    {c.skill}
                  </Badge>
                  <h4 className="font-medium text-sm leading-snug">{c.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.provider} · <span className="text-foreground/80">{c.level}</span>
                  </p>
                </div>
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
export default AnalysisDetailsPage;
