import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  Sparkles,
  Target,
  Link2,
  Cpu,
  BrainCircuit,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { performSkillAnalysis } from "@/services/api";

const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
];

const SAMPLE_RESUMES = {
  "Full Stack": `Skills: JavaScript, React, HTML, CSS, Tailwind CSS, Git, GitHub, REST APIs, Basic SQL, Node.js.
Projects:
- Portfolio Website with React and Tailwind CSS.
- E-commerce frontend with responsive cart and state management.
- Task Management API with Express.js and SQLite.`,
  "Data Science": `Skills: Python, Pandas, NumPy, SQL, Scikit-Learn, Matplotlib, Data Analysis, Basic Machine Learning.
Education: B.Tech Computer Science, 3rd Year.
Projects:
- Customer churn prediction using logistic regression and decision trees.
- Exploratory data analysis on Kaggle housing datasets.`,
  "ML Engineer": `Skills: Python, Machine Learning, Deep Learning, PyTorch, TensorFlow, Docker, Git, Data Structures.
Projects:
- Image classification using Convolutional Neural Networks (CNNs).
- Text sentiment analysis model trained on HuggingFace transformers.`,
};

export function AnalyzePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Placement Skill Gap Analysis");
  const [role, setRole] = useState("Full Stack Developer");
  const [text, setText] = useState("");
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit. Please paste the text directly.");
      return;
    }
    const content = await file.text();
    setText((prev) => (prev ? prev + "\n\n" + content : content));
    toast.success(`Loaded ${file.name}`);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const loadSample = (type) => {
    setText(SAMPLE_RESUMES[type] || "");
    toast.info(`Loaded ${type} sample text`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const combined = [
      text.trim(),
      github && `GitHub Profile: https://github.com/${github}`,
      leetcode && `LeetCode Profile: https://leetcode.com/${leetcode}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    if (combined.length < 20) {
      toast.error("Please provide at least 20 characters of resume or syllabus text.");
      return;
    }

    setLoading(true);
    try {
      const result = await performSkillAnalysis({
        inputText: combined,
        targetRole: role,
        title,
      });

      toast.success("Analysis computed successfully!");
      navigate(`/app/analyses/${result.id}`);
    } catch (err) {
      toast.error(err?.message || "Analysis execution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Cpu className="h-4 w-4" />
          <span>Machine Learning & AI Evaluation Pipeline</span>
        </div>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground">
          Skill Gap Analysis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your resume, syllabus, or projects. Our ML taxonomy model and AI reasoning engine benchmark your readiness against industry standards.
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title and Target Role */}
        <Card className="border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Target Industry Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select target role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Sample Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
            <span>Quick fill sample:</span>
            {["Full Stack", "Data Science", "ML Engineer"].map((key) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => loadSample(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        </Card>

        {/* Upload / Paste Area */}
        <Card
          className={`border-2 border-dashed p-7 transition-all ${
            dragging ? "border-primary bg-primary/5" : "border-border/70 bg-card/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
            <p className="mt-3 font-medium text-sm">Drag & drop your resume file or paste text below</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Supports .txt, .md, .json, .csv (Resume, syllabus, transcripts, GitHub projects)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 h-8 text-xs gap-1.5"
              onClick={() => fileRef.current?.click()}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Browse File</span>
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.csv,.json"
              hidden
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume content, college syllabus, technical coursework, or project list here..."
            className="mt-4 min-h-48 resize-y bg-background/60 text-sm leading-relaxed"
            maxLength={50000}
            required
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Minimum 20 characters required</span>
            <span>{text.length} / 50000 chars</span>
          </div>
        </Card>

        {/* Optional Profiles */}
        <Card className="border-border/60 bg-card/70 p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold">
            <Link2 className="h-4 w-4 text-primary" />
            <span>Optional Coding Profiles (Contextual Signal)</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="gh" className="text-xs">GitHub Username</Label>
              <Input
                id="gh"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="e.g. torvalds"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lc" className="text-xs">LeetCode Profile</Label>
              <Input
                id="lc"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                placeholder="e.g. student_dev"
              />
            </div>
          </div>
        </Card>

        {/* Action Bar */}
        <div className="sticky bottom-4 z-20">
          <Card className="border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Ready for ML & AI Evaluation</p>
                <p className="text-xs text-muted-foreground">
                  Benchmarking against {role} industry taxonomy
                </p>
              </div>
            </div>
            <Button type="submit" disabled={loading} size="lg" className="gap-2 shadow-md">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Computing Models...</span>
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  <span>Run Analysis</span>
                </>
              )}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
export default AnalyzePage;
