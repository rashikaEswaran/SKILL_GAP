import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PlusCircle,
  Sparkles,
  BookOpen,
  GraduationCap,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createSkillSwapPost } from "@/services/skillswap-service";

const POPULAR_SKILLS = [
  "Python", "React", "Machine Learning", "JavaScript", "TypeScript",
  "Node.js", "SQL", "PostgreSQL", "Docker", "Data Structures",
  "Algorithms", "AWS", "Git", "FastAPI", "Tailwind CSS", "Next.js",
  "Deep Learning", "System Design",
];

export function SkillSwapCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("Skill Exchange");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [availability, setAvailability] = useState("Weekends & Evenings");
  const [collaboration, setCollaboration] = useState("Discord / Google Meet");

  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [teachInput, setTeachInput] = useState("");

  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [learnInput, setLearnInput] = useState("");

  const addTeachSkill = (skill) => {
    const s = (skill || teachInput).trim();
    if (s && !skillsToTeach.includes(s)) {
      setSkillsToTeach([...skillsToTeach, s]);
      setTeachInput("");
    }
  };

  const removeTeachSkill = (skill) => {
    setSkillsToTeach(skillsToTeach.filter((s) => s !== skill));
  };

  const addLearnSkill = (skill) => {
    const s = (skill || learnInput).trim();
    if (s && !skillsToLearn.includes(s)) {
      setSkillsToLearn([...skillsToLearn, s]);
      setLearnInput("");
    }
  };

  const removeLearnSkill = (skill) => {
    setSkillsToLearn(skillsToLearn.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a title");
      return;
    }
    if (skillsToTeach.length === 0) {
      toast.error("Please add at least one skill you can teach");
      return;
    }
    if (skillsToLearn.length === 0) {
      toast.error("Please add at least one skill you want to learn");
      return;
    }

    setLoading(true);
    try {
      const postId = await createSkillSwapPost({
        title,
        description,
        post_type: postType,
        skill_level: skillLevel,
        skills_to_teach: skillsToTeach,
        skills_to_learn: skillsToLearn,
        availability,
        preferred_collaboration: collaboration,
      });

      toast.success("SkillSwap request posted to marketplace!");
      navigate(`/app/skillswap/posts/${postId}`);
    } catch (err) {
      toast.error(err?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
        <Link to="/app/skillswap">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>
      </Button>

      <div>
        <h1 className="font-display text-3xl font-bold">Create SkillSwap Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Offer your strengths and discover peers ready to help you bridge your gaps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60 bg-card/75 p-6 shadow-sm backdrop-blur space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="e.g. Offering React coaching in exchange for Docker / DevOps basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Collaboration Format</Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Skill Exchange">1-on-1 Skill Exchange</SelectItem>
                  <SelectItem value="Study Group">Study Group</SelectItem>
                  <SelectItem value="Project Partner">Project Partner</SelectItem>
                  <SelectItem value="Learning Partner">Learning Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Your Experience Level</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Description & Collaboration Goals</Label>
            <Textarea
              id="desc"
              rows={4}
              placeholder="Describe your background, what projects you're building, and how you want to learn together..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Skills You Teach */}
        <Card className="border-emerald-500/20 bg-card/75 p-6 shadow-sm backdrop-blur space-y-3">
          <Label className="text-emerald-400 font-semibold text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Skills You Can Teach or Mentor In</span>
          </Label>

          <div className="flex gap-2">
            <Input
              placeholder="Type a skill (e.g. React, Python) and press Enter"
              value={teachInput}
              onChange={(e) => setTeachInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTeachSkill())}
            />
            <Button type="button" variant="outline" onClick={() => addTeachSkill()}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-8">
            {skillsToTeach.map((s) => (
              <Badge key={s} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 gap-1.5 py-1">
                {s}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => removeTeachSkill(s)} />
              </Badge>
            ))}
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            <span>Suggestions:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {POPULAR_SKILLS.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTeachSkill(s)}
                  className="rounded bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Skills You Want To Learn */}
        <Card className="border-cyan-500/20 bg-card/75 p-6 shadow-sm backdrop-blur space-y-3">
          <Label className="text-cyan-400 font-semibold text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Skills You Want to Learn or Practice</span>
          </Label>

          <div className="flex gap-2">
            <Input
              placeholder="Type a skill (e.g. Docker, System Design) and press Enter"
              value={learnInput}
              onChange={(e) => setLearnInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLearnSkill())}
            />
            <Button type="button" variant="outline" onClick={() => addLearnSkill()}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-8">
            {skillsToLearn.map((s) => (
              <Badge key={s} className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 gap-1.5 py-1">
                {s}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => removeLearnSkill(s)} />
              </Badge>
            ))}
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            <span>Suggestions:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {POPULAR_SKILLS.slice(8, 16).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addLearnSkill(s)}
                  className="rounded bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-cyan-500/20 hover:text-cyan-300"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Availability & Preferred Platform */}
        <Card className="border-border/60 bg-card/75 p-6 shadow-sm backdrop-blur space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="avail">Availability</Label>
              <Input
                id="avail"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Weekends, Evenings after 6 PM"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collab">Preferred Collaboration Medium</Label>
              <Input
                id="collab"
                value={collaboration}
                onChange={(e) => setCollaboration(e.target.value)}
                placeholder="e.g. Discord, Google Meet, GitHub"
              />
            </div>
          </div>
        </Card>

        <Button type="submit" disabled={loading} size="lg" className="w-full gap-2 shadow-md">
          <PlusCircle className="h-5 w-5" />
          <span>{loading ? "Publishing Request..." : "Publish SkillSwap Post"}</span>
        </Button>
      </form>
    </div>
  );
}
export default SkillSwapCreatePage;
