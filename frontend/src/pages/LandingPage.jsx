import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  BarChart3,
  Brain,
  GraduationCap,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Zap,
  FileText,
  TrendingUp,
  Award,
  Layers,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Brain, title: "ML & AI Skill Extraction", desc: "Extract candidate skills, proficiencies, and coursework from resumes, syllabi, or profiles using our Python NLP models." },
  { icon: Target, title: "Industry Benchmark Analysis", desc: "Compare your acquired skills against real-time industry requirement matrices for top engineering roles." },
  { icon: BarChart3, title: "Placement Readiness Score", desc: "Track placement readiness, employability indexes, and critical gaps with rich visual analytics." },
  { icon: GraduationCap, title: "Personalized Roadmap", desc: "Get dynamic 12-week learning roadmaps, curated courses from Coursera & Udemy, and capstone project ideas." },
  { icon: ArrowLeftRight, title: "Peer SkillSwap", desc: "Exchange skills with classmates and peers. Teach what you excel at to learn your missing gaps." },
  { icon: TrendingUp, title: "Demand & Growth Tracking", desc: "Monitor top emerging technologies, market demand trends, and high-growth domain requirements." },
];

const stats = [
  { value: "40+", label: "Industry skills catalogued" },
  { value: "8+", label: "Target roles modeled" },
  { value: "ML & AI", label: "Dual evaluation engines" },
  { value: "100%", label: "Data privacy & student focused" },
];

export function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold">SkillSync AI</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">React & ML Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/corporate">Corporate Portal</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/skillswap">SkillSwap</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth?role=student">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 shadow-sm">
            <Link to="/auth?role=student">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
            <Zap className="h-3.5 w-3.5" />
            <span>AI & Machine Learning Powered Skill Gap Analytics</span>
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
            Bridge the gap between{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-transparent">
              college & industry
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Upload your resume or syllabus. Our Machine Learning models extract your skills, benchmark against industry role requirements, and map your path to getting hired.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <Link to="/auth?role=student">
                Launch Free Analysis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Explore Features</a>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <Card key={s.label} className="border-border/60 bg-card/60 p-6 text-center backdrop-blur-sm">
              <div className="font-display text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground font-medium">{s.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need to get hired</h2>
          <p className="mt-3 text-muted-foreground">
            A comprehensive pipeline from automated resume parsing to peer learning.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card className="h-full border-border/60 bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card/80">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Card className="border-primary/20 bg-gradient-to-b from-card/80 to-card/40 p-12 text-center shadow-lg backdrop-blur">
          <Rocket className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Ready to test your readiness?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Analyze your skillset against live role benchmarks in under 30 seconds.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <Link to="/auth?role=student">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            {["No setup required", "Instant results", "ML models & AI roadmap", "Free for students"].map((x) => (
              <span key={x} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {x}
              </span>
            ))}
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <span>SkillSync AI · Built with React.js & Machine Learning Models</span>
        </div>
      </footer>
    </div>
  );
}
export default LandingPage;
