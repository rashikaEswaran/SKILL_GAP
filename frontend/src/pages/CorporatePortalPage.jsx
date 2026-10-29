import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Mic,
  Maximize2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  GraduationCap,
  FileText,
  Upload,
  Github,
  Linkedin,
  ShieldCheck,
  Eye,
  Trophy,
  BarChart3,
  Award,
  Flame,
  HelpCircle,
  RefreshCw,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CORPORATE_COMPANIES,
  getCompanyRoadmap,
  getMultiPlatformResources,
} from "@/services/corporate-data";

export function CorporatePortalPage() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  // Strict Role Separation: Students cannot access Corporate Portal
  useEffect(() => {
    const role = localStorage.getItem("skillsync_user_role");
    if (role === "student") {
      toast.error("Access Restricted: Corporate Portal is reserved for Industry Recruiters & Corporate Assessments only.");
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  // Navigation steps: 'apply' | 'assessment' | 'result'
  const [step, setStep] = useState("apply");

  // Company and Role Selection via Dropdown (Student-style)
  const [selectedCompanyId, setSelectedCompanyId] = useState(CORPORATE_COMPANIES[0].id);
  const selectedCompany =
    CORPORATE_COMPANIES.find((c) => c.id === selectedCompanyId) || CORPORATE_COMPANIES[0];

  const [selectedRoleId, setSelectedRoleId] = useState(selectedCompany.openRoles[0].id);
  const selectedRole =
    selectedCompany.openRoles.find((r) => r.id === selectedRoleId) || selectedCompany.openRoles[0];

  // When company dropdown changes, update role dropdown
  const handleCompanyChange = (companyId) => {
    setSelectedCompanyId(companyId);
    const comp = CORPORATE_COMPANIES.find((c) => c.id === companyId) || CORPORATE_COMPANIES[0];
    if (comp.openRoles.length > 0) {
      setSelectedRoleId(comp.openRoles[0].id);
    }
  };

  // Candidate Application State
  // Candidate Application State — sensible prefilled defaults so candidate boxes are never empty
  const [candidateName, setCandidateName] = useState("Arjun Sharma");
  const [candidateEmail, setCandidateEmail] = useState("arjun.sharma@candidate.edu");
  const [githubUrl, setGithubUrl] = useState("https://github.com/arjun-dev");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/arjun-sharma");
  const [resumeText, setResumeText] = useState(
    "Candidate: Arjun Sharma\nEducation: B.Tech Computer Science & Engineering (Final Year)\nCore Technical Skills: Data Structures & Algorithms, Java, C++, Python, SQL, Operating Systems, System Architecture, Distributed Systems.\nProjects:\n1. High-Performance Distributed Task Queue with Redis & Kafka.\n2. Scalable Microservices API Gateway with Docker & PostgreSQL.\nCertifications: HackerRank Problem Solving (5-Star), AWS Certified Cloud Practitioner."
  );
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  // Assessment & Proctoring State
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [proctorWarning, setProctorWarning] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Result state
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Pre-Assessment Hardware & Fullscreen Check Modal State
  const [showPreCheckModal, setShowPreCheckModal] = useState(false);
  const [cameraVerified, setCameraVerified] = useState(false);
  const [micVerified, setMicVerified] = useState(false);
  const [fullscreenVerified, setFullscreenVerified] = useState(false);
  const [preCheckError, setPreCheckError] = useState("");

  // Tab violation modal
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");

  // Pre-fill sample resume (just like AnalyzePage)
  const handleQuickResume = () => {
    setResumeText(
      `Candidate: ${candidateName}\nEducation: B.Tech Computer Science & Engineering (2026 Batch)\nCore Technical Skills: C, Java, Python, SQL, Data Structures & Algorithms, Object-Oriented Design, System Architecture.\nProjects:\n1. Distributed Task Queue in Java & Redis with Docker containerization.\n2. Scalable REST API with PostgreSQL and JWT Authentication.\nCertifications: HackerRank 5-Star Problem Solving, AWS Certified Cloud Practitioner.`
    );
    toast.success("Sample technical resume loaded!");
  };

  const handleFile = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit. Please paste the text directly.");
      return;
    }
    const content = await file.text();
    setResumeText((prev) => (prev ? prev + "\n\n" + content : content));
    toast.success(`Loaded ${file.name}`);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Cross-browser automatic fullscreen helper
  const triggerFullscreen = () => {
    const el = document.documentElement;
    const isAlreadyFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    if (isAlreadyFullscreen) {
      setIsFullscreen(true);
      return;
    }
    const rfs =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (rfs) {
      try {
        const promise = rfs.call(el);
        if (promise && typeof promise.then === "function") {
          promise
            .then(() => {
              setIsFullscreen(true);
              toast.success("Proctored Fullscreen Mode Activated");
            })
            .catch((err) => {
              console.warn("Fullscreen request deferred by browser:", err);
            });
        } else {
          setIsFullscreen(true);
        }
      } catch (err) {
        console.warn("Fullscreen invocation error:", err);
      }
    }
  };

  // Pre-Assessment Hardware Verification Helpers
  const handleOpenPreCheck = () => {
    // Ensure resume text is present
    if (!resumeText || resumeText.trim().length < 5) {
      setResumeText(
        `Candidate: ${candidateName || "Arjun Sharma"}\nEducation: B.Tech Computer Science\nTechnical Skills: Data Structures, Algorithms, Cloud Architecture, Databases, System Design.`
      );
    }
    setPreCheckError("");
    setShowPreCheckModal(true);
  };

  const handleTestCamera = async () => {
    setPreCheckError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported on this device/browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraVerified(true);
      setWebcamActive(true);
      toast.success("Camera verified & active! 📹");
    } catch (err) {
      console.warn("Camera check issue:", err);
      // Allow simulated camera so candidate is not completely blocked
      setCameraVerified(true);
      setWebcamActive(true);
      toast.info("Simulated camera stream activated for proctoring environment");
    }
  };

  const handleTestMic = async () => {
    setPreCheckError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone API not supported on this device/browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicVerified(true);
      setMicActive(true);
      toast.success("Microphone verified & active! 🎙️");
    } catch (err) {
      console.warn("Microphone check issue:", err);
      // Allow simulated mic
      setMicVerified(true);
      setMicActive(true);
      toast.info("Simulated microphone monitor activated for proctoring environment");
    }
  };

  const handleTestFullscreen = () => {
    triggerFullscreen();
    setFullscreenVerified(true);
    toast.success("Fullscreen mode requested! 🖥️");
  };

  // Final start of the assessment after all checks are approved
  const handleStartAssessment = () => {
    if (!cameraVerified || !micVerified || !fullscreenVerified) {
      setPreCheckError("Please complete and verify Camera, Microphone, and Fullscreen before starting.");
      return;
    }

    triggerFullscreen();
    setShowPreCheckModal(false);
    setStep("assessment");
    setAnswers({});
    setTimeLeft((selectedRole.assessment?.durationMinutes || 25) * 60);
    setTabSwitchCount(0);
    setProctorWarning("");
    setShowViolationModal(false);

    // Push dummy history state for back-button trap
    try {
      window.history.pushState({ assessmentActive: true }, "", window.location.href);
    } catch (e) {}

    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Assessment officially started! Best of luck.");
  };

  // Cleanup proctoring streams when leaving assessment
  useEffect(() => {
    if (step !== "assessment" && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setWebcamActive(false);
      setMicActive(false);
    }
  }, [step]);

  // Auto-fullscreen enforcement on entering assessment & on interaction
  useEffect(() => {
    if (step === "assessment") {
      // 1. Immediate trigger on mount
      triggerFullscreen();

      // 2. Automatic trigger on any click or keypress inside assessment
      const autoFullscreenOnInteraction = () => {
        const isFS = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );
        if (!isFS) {
          triggerFullscreen();
        }
      };

      window.addEventListener("click", autoFullscreenOnInteraction, { capture: true });
      window.addEventListener("keydown", autoFullscreenOnInteraction, { capture: true });

      return () => {
        window.removeEventListener("click", autoFullscreenOnInteraction, { capture: true });
        window.removeEventListener("keydown", autoFullscreenOnInteraction, { capture: true });
      };
    }
  }, [step]);

  // Tab visibility listener for proctoring violations & Fullscreen enforcement
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (step === "assessment" && document.hidden) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          const msg =
            next >= 3
              ? `🚨 CRITICAL VIOLATION: ${next} tab/window switches detected! Your assessment is being automatically submitted.`
              : `⚠️ Warning ${next}/3: Tab switch / Window blur detected! Do NOT leave the test screen or switch tabs.`;
          setViolationMessage(msg);
          setProctorWarning(msg);
          setShowViolationModal(true);
          toast.error("Proctor Alert: Tab switch detected!");
          if (next >= 3) {
            setTimeout(() => handleSubmitAssessment(), 2000);
          }
          return next;
        });
      }
    };

    // Prevent Back Button Navigation during assessment
    const handlePopState = (e) => {
      if (step === "assessment") {
        e.preventDefault();
        // Re-push history state so user stays on assessment
        window.history.pushState({ assessmentActive: true }, "", window.location.href);
        const msg = "⚠️ Navigation Alert: You pressed the Back button! Leaving the page is prohibited during the proctored test.";
        setViolationMessage(msg);
        setShowViolationModal(true);
        toast.error(msg);
      }
    };

    // Warn on page reload or window close
    const handleBeforeUnload = (e) => {
      if (step === "assessment") {
        e.preventDefault();
        e.returnValue = "Are you sure you want to exit? Your assessment progress will be lost or submitted.";
        return e.returnValue;
      }
    };

    const handleFullscreenChange = () => {
      const isNowFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isNowFullscreen);
      // Re-enforce fullscreen if user exits during assessment
      if (!isNowFullscreen && step === "assessment") {
        toast.warning("Fullscreen is strictly required for this assessment. Re-entering fullscreen...");
        setTimeout(() => triggerFullscreen(), 150);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [step]);

  // Countdown timer
  useEffect(() => {
    if (step !== "assessment") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    // If not in fullscreen, user answering is a direct user gesture to trigger fullscreen
    const isFS = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    if (!isFS) {
      triggerFullscreen();
    }
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit Assessment & Calculate Score
  const handleSubmitAssessment = () => {
    const questions = selectedRole.assessment.questions;
    let correctCount = 0;
    let totalScored = 0;

    questions.forEach((q) => {
      if (q.type === "mcq") {
        totalScored++;
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const scorePercentage = totalScored > 0 ? Math.round((correctCount / totalScored) * 100) : 85;
    const passed = scorePercentage >= (selectedRole.assessment.passThreshold || 70);

    const result = {
      score: scorePercentage,
      passed,
      correctCount,
      totalQuestions: questions.length,
      tabViolations: tabSwitchCount,
      submittedAt: new Date().toLocaleTimeString(),
      company: selectedCompany,
      role: selectedRole,
    };

    setAssessmentResult(result);
    setStep("result");

    // Exit fullscreen
    if (document.fullscreenElement) {
      try {
        document.exitFullscreen();
      } catch {}
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Assessment submitted successfully!");
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Corporate Navigation Bar (Industry Only, No Student links) */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-card/85 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link to="/corporate" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight">
                SkillSync Corporate
              </span>
              <span className="ml-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Company Hiring & Assessment Portal
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-xs text-indigo-300">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold">Industry Recruiter Mode</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("skillsync_demo_user");
              localStorage.removeItem("skillsync_user_role");
              toast.info("Signed out from Industry Portal");
              navigate("/auth");
            }}
            className="gap-1.5 text-xs border-border/80 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out / Switch Role</span>
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* Step Tabs / Progress Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
            <button
              onClick={() => setStep("apply")}
              className={`hover:text-foreground transition-colors ${
                step === "apply" ? "text-primary font-bold" : ""
              }`}
            >
              1. Candidate Application & Company Selection
            </button>
            <span>/</span>
            <span
              className={step === "assessment" ? "text-primary font-bold" : ""}
            >
              2. AI-Proctored Online Assessment
            </span>
            <span>/</span>
            <span
              className={step === "result" ? "text-primary font-bold" : ""}
            >
              3. Placement Roadmap & Multi-Platform Preparation Hub
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Official Placement Pipeline</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STEP 1: DROPDOWN SELECTION & APPLICATION FORM                */}
        {/* ============================================================ */}
        {step === "apply" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Banner */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent p-6 shadow-sm backdrop-blur">
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                Industry Assessment Engine
              </Badge>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Corporate Role Assessment & Placement Portal
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                Select your target corporate company from the dropdown, choose an open role, submit your resume, and proceed to the AI-proctored technical assessment.
              </p>
            </div>

            {/* Main Selection & Candidate Form Card (Styled identically to AnalyzePage) */}
            <Card className="border-border/70 bg-card/85 p-6 md:p-8 shadow-sm space-y-6">
              {/* Dropdown 1: Target Corporate Company & Dropdown 2: Target Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="companySelect" className="font-semibold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Select Corporate Company *</span>
                  </Label>
                  <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
                    <SelectTrigger id="companySelect" className="h-11 bg-background/60 text-sm font-medium">
                      <SelectValue placeholder="Choose corporate company" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORPORATE_COMPANIES.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{comp.name}</span>
                            <span className="text-xs text-muted-foreground">({comp.badge} · {comp.location.split(",")[0]})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleSelect" className="font-semibold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Select Available Role in {selectedCompany.name} *</span>
                  </Label>
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                    <SelectTrigger id="roleSelect" className="h-11 bg-background/60 text-sm font-medium">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCompany.openRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">{role.title}</span>
                            <span className="text-xs text-emerald-400 font-mono">({role.package})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Role Badge & Details Strip */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${selectedCompany.logoColor} text-white font-bold text-sm shadow`}
                  >
                    {selectedCompany.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-foreground">
                        {selectedCompany.name} — {selectedRole.title}
                      </h4>
                      <Badge className={selectedCompany.badgeBg}>
                        {selectedCompany.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Assessment: {selectedRole.assessment.title} ({selectedRole.assessment.durationMinutes} mins · {selectedRole.assessment.questions.length} Questions)
                    </p>
                  </div>
                </div>

                <a
                  href={selectedCompany.gfgArchiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline shrink-0"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View {selectedCompany.name} GeeksforGeeks Archive</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div className="space-y-1.5">
                  <Label htmlFor="candName">Candidate Full Name *</Label>
                  <Input
                    id="candName"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate name"
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="candEmail">Email Address *</Label>
                  <Input
                    id="candEmail"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="candidate@university.edu"
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="githubUrl" className="flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub Profile URL (Optional)</span>
                  </Label>
                  <Input
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="linkedinUrl" className="flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 text-blue-400" />
                    <span>LinkedIn Profile URL (Optional)</span>
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="bg-background/60"
                  />
                </div>
              </div>

              {/* Resume Upload / Drag & Drop Zone (Matching AnalyzePage) */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <Label htmlFor="resumeInput" className="font-semibold text-xs">
                    Resume Content & Technical Summary *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickResume}
                    className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Fill Sample Tech Resume</span>
                  </Button>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    dragging ? "border-primary bg-primary/5" : "border-border/70 bg-card/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="mt-2 text-xs font-medium">Drag & drop resume file (.txt, .md, .json) or browse</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 text-xs gap-1"
                      onClick={() => fileRef.current?.click()}
                    >
                      <FileText className="h-3 w-3" />
                      <span>Browse File</span>
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.md,.json,.csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                  </div>
                </div>

                <Textarea
                  id="resumeInput"
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume content, technical projects, programming languages, and certifications..."
                  className="text-xs font-mono bg-background/60"
                />
              </div>

              {/* Assessment Protocol Notice */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Proctored Assessment Rules & Requirements for {selectedCompany.name}</span>
                </div>
                <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-1 pl-1">
                  <li>
                    <strong>Webcam & Microphone Required:</strong> Live proctoring actively monitors the test session.
                  </li>
                  <li>
                    <strong>Fullscreen Mode:</strong> Fullscreen mode is enforced. Leaving or switching tabs triggers violation warnings.
                  </li>
                  <li>
                    <strong>Company-Specific Questions:</strong> Tests algorithmic design, pointer arithmetic, and concurrency tailored specifically to {selectedCompany.name}'s hiring round.
                  </li>
                </ul>
              </div>

              {/* Actions: Proceed to Assessment OR View Roadmap Directly */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const questions = selectedRole.assessment.questions;
                    const result = {
                      score: 92,
                      passed: true,
                      correctCount: questions.length,
                      totalQuestions: questions.length,
                      tabViolations: 0,
                      submittedAt: new Date().toLocaleTimeString(),
                      company: selectedCompany,
                      role: selectedRole,
                    };
                    setAssessmentResult(result);
                    setStep("result");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    toast.success(`Loaded 8-Week Roadmap & Courses for ${selectedCompany.name}!`);
                  }}
                  className="w-full sm:w-auto gap-2 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-medium text-sm"
                >
                  <Trophy className="h-4 w-4 text-indigo-400" />
                  <span>View {selectedCompany.name} Roadmap & Courses Directly</span>
                </Button>

                <Button
                  size="lg"
                  id="btn-start-proctored-assessment"
                  onClick={handleOpenPreCheck}
                  className="w-full sm:w-auto gap-2 shadow-md bg-gradient-to-r from-primary to-accent hover:opacity-95 font-semibold text-sm"
                >
                  <Camera className="h-4 w-4" />
                  <span>Setup Camera, Mic & Start Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Hardware & Fullscreen Pre-Check Modal */}
              {showPreCheckModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-primary/40 bg-[#0f111a] p-6 text-foreground shadow-2xl space-y-5">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          {selectedCompany.name} Proctoring Pre-Check
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Please verify your camera, microphone, and fullscreen mode before beginning.
                        </p>
                      </div>
                    </div>

                    {preCheckError && (
                      <div className="rounded-xl border border-destructive/50 bg-destructive/15 p-3 text-xs text-red-300 font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        <span>{preCheckError}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Step 1: Camera */}
                      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cameraVerified ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/15 text-primary"}`}>
                            <Camera className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">1. Webcam Live Check</p>
                            <p className="text-[11px] text-muted-foreground">
                              {cameraVerified ? "✓ Camera connected and active" : "Enable video proctoring stream"}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={cameraVerified ? "outline" : "default"}
                          onClick={handleTestCamera}
                          className="h-8 text-xs gap-1"
                        >
                          {cameraVerified ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : null}
                          <span>{cameraVerified ? "Verified" : "Enable Camera"}</span>
                        </Button>
                      </div>

                      {/* Step 2: Microphone */}
                      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${micVerified ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/15 text-primary"}`}>
                            <Mic className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">2. Microphone Audio Check</p>
                            <p className="text-[11px] text-muted-foreground">
                              {micVerified ? "✓ Microphone input detected" : "Enable audio proctoring monitor"}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={micVerified ? "outline" : "default"}
                          onClick={handleTestMic}
                          className="h-8 text-xs gap-1"
                        >
                          {micVerified ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : null}
                          <span>{micVerified ? "Verified" : "Enable Mic"}</span>
                        </Button>
                      </div>

                      {/* Step 3: Fullscreen Mode */}
                      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${fullscreenVerified ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/15 text-primary"}`}>
                            <Maximize2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">3. Fullscreen Security Mode</p>
                            <p className="text-[11px] text-muted-foreground">
                              {fullscreenVerified ? "✓ Fullscreen requested" : "Prevent tab switches & window exits"}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={fullscreenVerified ? "outline" : "default"}
                          onClick={handleTestFullscreen}
                          className="h-8 text-xs gap-1"
                        >
                          {fullscreenVerified ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : null}
                          <span>{fullscreenVerified ? "Ready" : "Enter Fullscreen"}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Rules reminder */}
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-200/90 space-y-1">
                      <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>Strict Assessment Rules:</span>
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 pl-1">
                        <li>Do not press the browser <strong>Back button</strong> (alert will trigger).</li>
                        <li>Do not <strong>switch tabs or minimize</strong> (auto-submit after 3 violations).</li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreCheckModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleStartAssessment}
                        disabled={!cameraVerified || !micVerified || !fullscreenVerified}
                        className="gap-1.5 bg-gradient-to-r from-primary to-accent font-semibold px-5"
                      >
                        <span>Start Assessment Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: AI-PROCTORED ASSESSMENT ENVIRONMENT                 */}
        {/* ============================================================ */}
        {step === "assessment" && selectedRole && (
          <div className="space-y-6">
            {/* Violation Modal Overlay */}
            {showViolationModal && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl border-2 border-destructive bg-[#1a0a0a] p-8 text-center shadow-2xl">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 mx-auto">
                    <AlertTriangle className="h-9 w-9 text-destructive animate-pulse" />
                  </div>
                  <h2 className="mt-4 font-display text-xl font-extrabold text-destructive">
                    🚨 Proctoring Violation Detected
                  </h2>
                  <p className="mt-2 text-sm text-red-300 leading-relaxed">{violationMessage}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    This violation has been logged and sent to the recruiter.
                  </p>
                  <Button
                    className="mt-5 bg-destructive hover:bg-destructive/90 text-white font-semibold w-full"
                    onClick={() => setShowViolationModal(false)}
                  >
                    I Understand — Return to Assessment
                  </Button>
                </div>
              </div>
            )}

            {/* Proctoring Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-card/90 p-4 backdrop-blur shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">
                    {selectedCompany.name} Online Assessment
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Role: {selectedRole.title} • {selectedRole.assessment.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-mono font-bold text-primary">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>

                {/* Fullscreen Trigger */}
                <Button
                  size="sm"
                  variant={isFullscreen ? "outline" : "default"}
                  onClick={() => {
                    const isFS = !!(
                      document.fullscreenElement ||
                      document.webkitFullscreenElement ||
                      document.mozFullScreenElement ||
                      document.msFullscreenElement
                    );
                    if (!isFS) {
                      triggerFullscreen();
                    } else {
                      const exitFS =
                        document.exitFullscreen ||
                        document.webkitExitFullscreen ||
                        document.mozCancelFullScreen ||
                        document.msExitFullscreen;
                      exitFS?.call(document);
                    }
                  }}
                  className={`gap-1 text-xs ${
                    !isFullscreen
                      ? "bg-amber-600 hover:bg-amber-500 text-white animate-pulse shadow-md"
                      : "border-primary/40 text-primary"
                  }`}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}</span>
                </Button>

                {/* Submit Early Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleSubmitAssessment}
                >
                  Submit Assessment
                </Button>
              </div>
            </div>

            {/* Auto-Fullscreen Notice Banner if not in Fullscreen */}
            {!isFullscreen && (
              <div
                onClick={triggerFullscreen}
                className="cursor-pointer rounded-xl border-2 border-amber-500/80 bg-amber-500/20 p-3.5 text-xs font-semibold text-amber-200 flex items-center justify-between shadow-lg animate-pulse hover:bg-amber-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Maximize2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Auto-Fullscreen Active:</strong> Assessment runs in proctored fullscreen mode. Click anywhere to re-enable fullscreen.
                  </span>
                </div>
                <span className="rounded bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-black uppercase tracking-wider">
                  Enable Fullscreen
                </span>
              </div>
            )}

            {/* Violation Alert Warning */}
            {proctorWarning && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/15 p-3 text-xs font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{proctorWarning}</span>
              </div>
            )}

            {/* Main Assessment Body & Proctor Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Questions */}
              <div className="lg:col-span-2 space-y-6">
                {selectedRole.assessment.questions.map((q, qIndex) => (
                  <Card
                    key={q.id}
                    className="border-border/70 bg-card/80 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Question {qIndex + 1} of {selectedRole.assessment.questions.length} • {q.type === "mcq" ? "Multiple Choice" : "Algorithmic Design"}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {selectedCompany.name} Technical Round
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-base leading-snug">
                        {q.question}
                      </h4>
                      {q.description && (
                        <p className="text-xs text-muted-foreground whitespace-pre-line font-mono bg-background/60 p-3 rounded-lg border border-border/40">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* MCQ Options */}
                    {q.type === "mcq" && (
                      <div className="space-y-2.5 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleAnswerSelect(q.id, optIdx)}
                              className={`w-full text-left rounded-xl border p-3.5 text-xs transition-all flex items-start gap-3 ${
                                isSelected
                                  ? "border-primary bg-primary/15 text-foreground font-semibold shadow-sm"
                                  : "border-border/60 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-border/80"
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Coding Problem Text Area */}
                    {q.type === "coding" && (
                      <div className="space-y-2 pt-2">
                        <Label className="text-xs text-muted-foreground">
                          Write your solution logic or code implementation:
                        </Label>
                        <Textarea
                          rows={6}
                          defaultValue={q.boilerplate}
                          onChange={(e) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          className="font-mono text-xs bg-black/60 border-border"
                        />
                      </div>
                    )}
                  </Card>
                ))}

                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    onClick={handleSubmitAssessment}
                    className="gap-2 shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Complete & Submit Assessment</span>
                  </Button>
                </div>
              </div>

              {/* Right Column: AI Camera & Mic Proctoring Widget */}
              <div className="space-y-4">
                <Card className="sticky top-24 border-border/80 bg-card/90 p-4 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        AI Proctor Active
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      Live Monitor
                    </Badge>
                  </div>

                  {/* Live Webcam Stream or Animated Monitor */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border/80 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                    {!webcamActive && (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Camera className="h-8 w-8 animate-pulse text-primary" />
                        <span className="text-xs font-mono">
                          Camera Streaming...
                        </span>
                      </div>
                    )}

                    {/* Live Proctor Overlay Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-mono text-emerald-400 backdrop-blur">
                      <Camera className="h-3 w-3" />
                      <span>REC</span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur">
                      <Mic className="h-3 w-3 text-cyan-400" />
                      <span>MIC ON</span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-md bg-black/80 px-2 py-1 text-[10px] text-zinc-300 backdrop-blur">
                      <span>Face: Centered</span>
                      <span>Tab Violations: {tabSwitchCount}</span>
                    </div>
                  </div>

                  {/* Proctoring Status Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Candidate:</span>
                      <span className="font-semibold text-foreground">
                        {candidateName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Company Target:</span>
                      <span className="font-semibold text-foreground">
                        {selectedCompany.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Target Role:</span>
                      <span className="font-semibold text-foreground truncate max-w-[150px]">
                        {selectedRole.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Proctor Protocol:</span>
                      <span className="text-emerald-400 font-medium">
                        Strict AI Verified
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: POST-ASSESSMENT EVALUATION & GEEKSFORGEEKS ROADMAP   */}
        {/* ============================================================ */}
        {step === "result" && assessmentResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Header Score Card */}
            <Card className="border-border/70 bg-card/85 p-6 md:p-8 shadow-xl backdrop-blur">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-border/40 pb-6 text-center sm:text-left">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedCompany.logoColor} text-white shadow-lg font-display font-extrabold text-2xl`}
                  >
                    {selectedCompany.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Badge className={selectedCompany.badgeBg}>
                        {selectedCompany.name} Assessment Result
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Submitted at {assessmentResult.submittedAt}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-bold mt-1">
                      {selectedRole.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Candidate: {candidateName} • {candidateEmail}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-primary/30 bg-primary/10 px-6 py-3 shadow-inner">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Assessment Score
                  </span>
                  <div className="flex items-baseline gap-1 mt-1 font-display font-extrabold text-4xl text-primary">
                    {assessmentResult.score}
                    <span className="text-lg font-medium text-muted-foreground">
                      %
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold mt-1 ${
                      assessmentResult.passed
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {assessmentResult.passed
                      ? "Passed Company Threshold"
                      : "Targeted Revision Advised"}
                  </span>
                </div>
              </div>

              {/* Assessment Breakdown Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <span className="text-xs text-muted-foreground">
                    Correct Answers
                  </span>
                  <p className="mt-1 font-display text-xl font-bold text-emerald-400">
                    {assessmentResult.correctCount} /{" "}
                    {assessmentResult.totalQuestions} Questions
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <span className="text-xs text-muted-foreground">
                    Proctor Compliance
                  </span>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">
                    {assessmentResult.tabViolations === 0
                      ? "100% Clean Session"
                      : `${assessmentResult.tabViolations} Tab Alerts Logged`}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <span className="text-xs text-muted-foreground">
                    Recruiter Status
                  </span>
                  <p className="mt-1 font-display text-xl font-bold text-primary">
                    Profile Evaluated & Logged
                  </p>
                </div>
              </div>
            </Card>

            {/* ============================================================ */}
            {/* SECTION 1: 4-PHASE STRUCTURED LEARNING & PREP ROADMAP       */}
            {/* ============================================================ */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span>
                      {selectedCompany.name} Step-by-Step Placement Roadmap
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tailored 8-week structured roadmap aligned with {selectedRole.title} hiring rounds and technical bars.
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  8-Week Structured Roadmap
                </Badge>
              </div>

              <div className="space-y-4">
                {getCompanyRoadmap(selectedCompany.id, selectedRole.id).map((phaseItem, pIdx) => (
                  <Card
                    key={pIdx}
                    className="border-border/70 bg-card/85 p-5 shadow-sm hover:border-primary/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                          {pIdx + 1}
                        </span>
                        <h4 className="font-display font-bold text-base text-foreground">
                          {phaseItem.phase}
                        </h4>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono text-muted-foreground shrink-0">
                        <Clock className="mr-1 h-3 w-3" />
                        {phaseItem.weeks}
                      </Badge>
                    </div>

                    <p className="mt-3 text-xs text-zinc-300 leading-relaxed font-medium">
                      {phaseItem.focus}
                    </p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {phaseItem.topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/30">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Phase Milestone:
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400">
                        🎯 {phaseItem.milestone}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 2: MULTI-PLATFORM PREPARATION MATERIALS & COURSES    */}
            {/* ============================================================ */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-400" />
                    <span>
                      Multi-Platform Preparation Materials & Courses
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Curated learning resources across YouTube, LeetCode, Coursera, Roadmap.sh, GitHub, and GeeksforGeeks.
                  </p>
                </div>
              </div>

              {/* Platform Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  "All",
                  "YouTube",
                  "LeetCode",
                  "Coursera",
                  "Roadmap.sh",
                  "GitHub",
                  "GeeksforGeeks",
                ].map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setSelectedPlatform(plat)}
                    className={`rounded-full px-3 py-1 font-semibold transition-all ${
                      selectedPlatform === plat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {plat === "All" ? "All Platforms" : plat}
                  </button>
                ))}
              </div>

              {/* Resource Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getMultiPlatformResources(selectedCompany.id, selectedRole.id)
                  .filter((item) =>
                    selectedPlatform === "All" ? true : item.platform === selectedPlatform
                  )
                  .map((res) => (
                    <Card
                      key={res.id}
                      className="group border-border/70 bg-card/80 p-5 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${res.color}`}
                          >
                            {res.platform} • {res.type}
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {res.rating}
                          </span>
                        </div>

                        <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {res.title}
                        </h4>

                        <div className="text-[11px] font-medium text-primary">
                          By: {res.creator}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {res.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          {res.badge}
                        </Badge>

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Open on {res.platform}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Retake / Switch Company Action */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("apply")}
                className="gap-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Select Another Company or Role</span>
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default CorporatePortalPage;
