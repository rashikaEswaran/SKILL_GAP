import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Calendar,
  Laptop,
  Clock,
  Sparkles,
  Send,
  UserCheck,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/services/supabase";
import {
  getSkillSwapPostById,
  deleteSkillSwapPost,
  sendCollaborationRequest,
  computeSkillMatch,
} from "@/services/skillswap-service";

export function SkillSwapPostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [requestMsg, setRequestMsg] = useState("");
  const [sendingReq, setSendingReq] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data: u } = await supabase.auth.getUser();
        if (u?.user) setCurrentUserId(u.user.id);

        const record = await getSkillSwapPostById(id);
        setPost(record);
        if (record) {
          setRequestMsg(
            `Hi ${record.author?.full_name || "there"}, I saw your post and I'm interested in exchanging skills with you!`
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  const handleSendProposal = async () => {
    if (!post) return;
    setSendingReq(true);
    try {
      await sendCollaborationRequest({
        postId: post.id,
        recipientId: post.user_id,
        message: requestMsg,
      });
      toast.success("Collaboration request sent successfully!");
      setHasSent(true);
    } catch (err) {
      toast.error(err?.message || "Failed to send request");
    } finally {
      setSendingReq(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deleteSkillSwapPost(post.id);
      toast.success("Post removed");
      navigate("/app/skillswap");
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-card/60" />;
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold">Post Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1">This SkillSwap post might have been removed.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/app/skillswap">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  const isAuthor = currentUserId === post.user_id;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link to="/app/skillswap">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
        </Button>

        {isAuthor && (
          <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-1.5">
            <Trash2 className="h-4 w-4" />
            <span>Delete Post</span>
          </Button>
        )}
      </div>

      {/* Main Post Card */}
      <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur space-y-6">
        {/* Author Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
                {post.author?.full_name?.slice(0, 2).toUpperCase() || "ST"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold">{post.author?.full_name || "Student"}</h2>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                  {post.post_type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {post.author?.college || "College"} · {post.author?.department || "Computer Science"} · Level: {post.skill_level}
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <span>Posted {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h1 className="font-display text-2xl font-bold">{post.title}</h1>
          <p className="mt-3 text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Skills Comparison */}
        <div className="grid gap-4 md:grid-cols-2 pt-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
              Skills They Teach:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {post.skills_to_teach.map((s) => (
                <Badge key={s} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
              Skills They Want To Learn:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {post.skills_to_learn.map((s) => (
                <Badge key={s} className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Availability & Preferred Medium */}
        <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>Availability: {post.availability || "Flexible"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Laptop className="h-4 w-4 text-primary" />
            <span>Collaboration: {post.preferred_collaboration || "Online / Discord"}</span>
          </div>
        </div>
      </Card>

      {/* Collaboration Connection Form */}
      {!isAuthor && (
        <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur space-y-4">
          <h3 className="font-display text-base font-semibold flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span>Connect & Request Skill Collaboration</span>
          </h3>

          {hasSent ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-1" />
              <p className="font-semibold text-sm text-emerald-300">Request Sent!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                The student has been notified. You can track status under "My Activity" or start messaging once accepted.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link to="/app/skillswap/my-activity">View My Activity</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                rows={3}
                value={requestMsg}
                onChange={(e) => setRequestMsg(e.target.value)}
                placeholder="Introduce yourself, list which skills you want to exchange, and specify your availability..."
              />
              <Button onClick={handleSendProposal} disabled={sendingReq} className="gap-2 shadow-sm">
                <Send className="h-4 w-4" />
                <span>{sendingReq ? "Sending Proposal..." : "Send Collaboration Proposal"}</span>
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
export default SkillSwapPostDetailsPage;
