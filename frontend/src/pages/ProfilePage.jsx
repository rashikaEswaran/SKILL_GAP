import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User2, Save, Loader2, GraduationCap, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabase";

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    college: "",
    department: "",
    academic_year: "",
    email: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        let user = null;
        try {
          const { data: u } = await supabase.auth.getUser();
          if (u?.user) user = u.user;
        } catch {}

        if (!user) {
          try {
            const demo = localStorage.getItem("skillsync_demo_user");
            if (demo) user = JSON.parse(demo);
          } catch {}
        }

        if (!user) return;

        let dbProfile = null;
        try {
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
          if (data) dbProfile = data;
        } catch {}

        const localProfile = JSON.parse(localStorage.getItem("skillsync_demo_profile") || "null");
        const active = dbProfile || localProfile;

        if (active) {
          setProfile({
            full_name: active.full_name || user.user_metadata?.full_name || "Demo Student",
            college: active.college || "Indian Institute of Technology",
            department: active.department || "Computer Science & Engineering",
            academic_year: active.academic_year || "Final Year (2026)",
            email: active.email || user.email || "demo@skillsync.edu",
          });
        } else {
          setProfile({
            full_name: user.user_metadata?.full_name || "Demo Student",
            college: "Indian Institute of Technology",
            department: "Computer Science & Engineering",
            academic_year: "Final Year (2026)",
            email: user.email || "demo@skillsync.edu",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let user = null;
      try {
        const { data: u } = await supabase.auth.getUser();
        if (u?.user) user = u.user;
      } catch {}

      if (!user) {
        try {
          const demo = localStorage.getItem("skillsync_demo_user");
          if (demo) user = JSON.parse(demo);
        } catch {}
      }

      if (user?.id) {
        try {
          await supabase.from("profiles").upsert({
            id: user.id,
            full_name: profile.full_name,
            college: profile.college,
            department: profile.department,
            academic_year: profile.academic_year,
            email: profile.email,
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.warn("Supabase upsert warning:", err);
        }
      }

      localStorage.setItem("skillsync_demo_profile", JSON.stringify(profile));
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-card/60" />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Student Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your college affiliations, academic year, and personal learning preferences
        </p>
      </div>

      <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-sm">
            <User2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-xl font-bold">{profile.full_name || "Student"}</p>
            <p className="text-xs text-muted-foreground">{profile.email || "demo@skillsync.edu"}</p>
            <span className="inline-block mt-1 text-[11px] font-medium text-primary">
              {profile.college ? `${profile.college} · ${profile.academic_year || "Student"}` : "Profile Active"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="college">College / University</Label>
            <Input
              id="college"
              value={profile.college}
              onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              placeholder="e.g. National Institute of Technology"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dept">Department / Major</Label>
              <Input
                id="dept"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                placeholder="Computer Science & Engineering"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Academic Year</Label>
              <Input
                id="year"
                value={profile.academic_year}
                onChange={(e) => setProfile({ ...profile, academic_year: e.target.value })}
                placeholder="3rd Year"
              />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="gap-2 shadow-md mt-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Profile</span>
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
export default ProfilePage;
