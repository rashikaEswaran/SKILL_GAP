import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Loader2, User, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/hooks/use-auth";

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get("role"); // "student" | "industry"

  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(queryRole === "industry" ? "industry" : "student");
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (queryRole) {
      setRole(queryRole);
      localStorage.setItem("skillsync_user_role", queryRole);
    }
  }, [queryRole]);

  React.useEffect(() => {
    if (!authLoading && user) {
      // If user explicitly navigated with ?role=student or queryRole is student, prioritize student
      if (queryRole === "student") {
        localStorage.setItem("skillsync_user_role", "student");
        navigate("/app", { replace: true });
        return;
      }
      if (queryRole === "industry") {
        localStorage.setItem("skillsync_user_role", "industry");
        navigate("/corporate", { replace: true });
        return;
      }

      const savedRole = localStorage.getItem("skillsync_user_role");
      if (savedRole === "industry") {
        navigate("/corporate", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    }
  }, [user, authLoading, navigate, queryRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const targetPath = role === "industry" ? "/corporate" : "/app";
    localStorage.setItem("skillsync_user_role", role);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || (role === "industry" ? "Corporate Candidate" : "Student") },
          },
        });
        if (error) throw error;
        if (!data?.session) {
          toast.success("Account registered! A confirmation link has been sent to your email. You can also use Instant Demo Access!");
        } else {
          toast.success("Account created successfully!");
          navigate(targetPath);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message?.toLowerCase().includes("email not confirmed")) {
            // Auto-fallback: just demo-login them
            toast.info("Email not confirmed — logging you in via Demo Mode!");
            await handleDemoLogin(role);
            return;
          }
          if (
            error.message?.toLowerCase().includes("invalid login") ||
            error.message?.toLowerCase().includes("invalid credentials") ||
            error.message?.toLowerCase().includes("user not found") ||
            error.message?.toLowerCase().includes("no user") ||
            error.status === 400
          ) {
            // Auto-fallback to demo mode for invalid credentials
            toast.info("Credentials not found — switching to Demo Mode automatically! 🚀");
            await handleDemoLogin(role);
            return;
          }
          throw error;
        }
        toast.success(`Welcome back to SkillSync ${role === "industry" ? "Corporate" : "Student"}!`);
        navigate(targetPath);
      }
    } catch (err) {
      // Final fallback: always demo login rather than block the user
      toast.info("Switching to Demo Mode for you! 🚀");
      await handleDemoLogin(role);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (targetRole = role) => {
    setLoading(true);
    localStorage.setItem("skillsync_user_role", targetRole);
    try {
      const isInd = targetRole === "industry";
      const demoData = {
        id: isInd ? "00000000-0000-0000-0000-000000000002" : "00000000-0000-0000-0000-000000000001",
        email: isInd ? "recruiter@corporate.com" : "demo@skillsync.edu",
        user_metadata: { full_name: isInd ? "Corporate Candidate" : "Demo Student" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("skillsync_demo_user", JSON.stringify(demoData));
      localStorage.setItem("skillsync_auth_user", JSON.stringify(demoData));
      localStorage.removeItem("skillsync_auth_signed_out");
      toast.success(`Logged in to ${isInd ? "Corporate Hiring & Assessment Portal" : "Student Skill Platform"}!`);
      navigate(isInd ? "/corporate" : "/app");
    } catch (err) {
      toast.error("Failed to enter demo mode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">SkillSync AI</span>
        </Link>

        {/* Role Selection Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-card/90 p-1.5 border border-border/80 shadow-md backdrop-blur">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              role === "student"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("industry")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              role === "industry"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Industry / Corporate</span>
          </button>
        </div>

        <Card className="border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold">
              {role === "industry"
                ? "Corporate Hiring & Assessment Portal"
                : mode === "signin"
                ? "Welcome back"
                : "Create student account"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {role === "industry"
                ? "Company-specific proctored coding assessments & GeeksforGeeks prep"
                : mode === "signin"
                ? "Sign in to access analytics and Reddit peer SkillSwap"
                : "Start your skill readiness journey in seconds"}
            </p>
          </div>

          {/* Quick Demo Access Button — prominent pulsing CTA */}
          <div className="relative mb-6">
            <div
              className={`absolute inset-0 rounded-lg blur-md opacity-40 animate-pulse ${
                role === "industry" ? "bg-purple-500" : "bg-primary"
              }`}
            />
            <Button
              type="button"
              className={`relative w-full gap-2 font-semibold text-sm shadow-lg ${
                role === "industry"
                  ? "border border-purple-400/60 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white hover:from-indigo-500/90 hover:to-purple-500/90"
                  : "border border-primary/50 bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground hover:from-primary hover:to-accent"
              }`}
              onClick={() => handleDemoLogin(role)}
              disabled={loading}
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {role === "industry"
                  ? "⚡ Instant Corporate Demo — No Login Needed"
                  : "⚡ Instant Student Demo — No Login Needed"}
              </span>
            </Button>
          </div>


          <div className="relative mb-6 text-center text-xs text-muted-foreground">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <span className="relative bg-card px-2">or continue with credentials</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">College or Personal Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 shadow-md mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign in" : "Create Account"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
export default AuthPage;
