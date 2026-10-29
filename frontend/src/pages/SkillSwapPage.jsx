import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users2,
  PlusCircle,
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Calendar,
  MessageSquare,
  Send,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowLeftRight,
  ArrowBigUp,
  ArrowBigDown,
  Share2,
  Bookmark,
  Flame,
  Zap,
  Trophy,
  TrendingUp,
  Building2,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Code2,
  ExternalLink,
  ShieldCheck,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/services/supabase";
import {
  getSkillSwapPosts,
  sendCollaborationRequest,
} from "@/services/skillswap-service";

const SUBREDDITS = [
  { name: "r/all", label: "All Feeds", icon: Flame },
  { name: "r/skillswap", label: "r/SkillSwap", icon: ArrowLeftRight },
  { name: "r/developersIndia", label: "r/developersIndia", icon: Code2 },
  { name: "r/leetcode", label: "r/LeetCodePrep", icon: Trophy },
  { name: "r/machinelearning", label: "r/MachineLearning", icon: Sparkles },
  { name: "r/webdev", label: "r/WebDev", icon: BookOpen },
];

const SORT_OPTIONS = [
  { id: "hot", label: "Hot", icon: Flame },
  { id: "new", label: "New", icon: Zap },
  { id: "top", label: "Top", icon: Trophy },
  { id: "rising", label: "Rising", icon: TrendingUp },
];

const INITIAL_COMMENTS = {
  sp_001: [
    {
      id: "c1",
      author: "u/priya_swe",
      time: "2h ago",
      text: "I have 2 years of Docker and Kubernetes experience from my internship! Would love to learn PyTorch in exchange.",
      votes: 14,
    },
    {
      id: "c2",
      author: "u/karan_code",
      time: "45m ago",
      text: "Sent you a DM! Are you open to pairing over Discord this weekend?",
      votes: 5,
    },
  ],
  sp_002: [
    {
      id: "c3",
      author: "u/rohit_dev",
      time: "3h ago",
      text: "I can help with SQL query indexing and B-tree optimization. Your React experience is exactly what our side project needs.",
      votes: 21,
    },
  ],
};

const RECENT_SIDEBAR_POSTS = [
  {
    sub: "r/developersIndia",
    time: "4h ago",
    title: "In this Layoff Market, why are actual builders or engineers who ship valued higher?",
    upvotes: 387,
    comments: 72,
  },
  {
    sub: "r/leetcode",
    time: "2h ago",
    title: "4 YoE Backend Dev: I can solve 80% of LC Easys, but Mediums destroy me. Best free resource to learn patterns?",
    upvotes: 142,
    comments: 31,
  },
  {
    sub: "r/skillswap",
    time: "1h ago",
    title: "Looking for fellow students to start open-source React & FastAPI freelance project",
    upvotes: 89,
    comments: 18,
  },
  {
    sub: "r/corporate",
    time: "5h ago",
    title: "Zoho & Google technical assessment proctoring: Cam/Mic guidelines and GFG archives updated!",
    upvotes: 512,
    comments: 104,
  },
];

export function SkillSwapPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSub, setActiveSub] = useState("r/all");
  const [activeSort, setActiveSort] = useState("hot");

  // Reddit Voting & Interactions State
  const [userVotes, setUserVotes] = useState({}); // { [postId]: 1 | -1 | 0 }
  const [postUpvotes, setPostUpvotes] = useState({}); // { [postId]: number }
  const [savedPosts, setSavedPosts] = useState({}); // { [postId]: boolean }
  const [expandedComments, setExpandedComments] = useState({}); // { [postId]: boolean }
  const [commentsMap, setCommentsMap] = useState(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState({});

  // Collaboration Dialog
  const [activePost, setActivePost] = useState(null);
  const [requestMsg, setRequestMsg] = useState("");
  const [sendingReq, setSendingReq] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getSkillSwapPosts({
        search,
      });

      // Initialize synthetic upvotes and votes
      const votesMap = {};
      const initialCounts = {};
      (data || []).forEach((p, index) => {
        initialCounts[p.id] = 120 + ((index * 37) % 350);
      });

      setPosts(data || []);
      setPostUpvotes(initialCounts);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = (postId, direction) => {
    const currentVote = userVotes[postId] || 0;
    let newVote = 0;
    let delta = 0;

    if (currentVote === direction) {
      // Toggle off
      newVote = 0;
      delta = -direction;
    } else {
      newVote = direction;
      delta = direction - currentVote;
    }

    setUserVotes((prev) => ({ ...prev, [postId]: newVote }));
    setPostUpvotes((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + delta,
    }));

    if (newVote === 1) {
      toast.success("Post upvoted!");
    }
  };

  const toggleSave = (postId) => {
    setSavedPosts((prev) => {
      const next = !prev[postId];
      toast(next ? "Post saved to your Reddit bookmarks!" : "Post removed from saved.");
      return { ...prev, [postId]: next };
    });
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId) => {
    const text = (newCommentText[postId] || "").trim();
    if (!text) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: "u/you (Rashika)",
      time: "Just now",
      text,
      votes: 1,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])],
    }));

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment posted!");
  };

  const handleCopyLink = (postId) => {
    navigator.clipboard?.writeText(window.location.origin + `/app/skillswap/posts/${postId}`);
    toast.success("Reddit share link copied to clipboard!");
  };

  const handleSendProposal = async () => {
    if (!activePost) return;
    setSendingReq(true);
    try {
      await sendCollaborationRequest({
        postId: activePost.id,
        recipientId: activePost.user_id,
        message: requestMsg,
      });
      toast.success("Skill swap request sent! They will be notified.");
      setActivePost(null);
      setRequestMsg("");
    } catch (err) {
      toast.error(err?.message || "Failed to send request");
    } finally {
      setSendingReq(false);
    }
  };

  // Filter and sort posts across subreddits
  const filteredPosts = posts.filter((post) => {
    if (activeSub === "r/all") return true;
    if (activeSub === "r/skillswap") return post.post_type === "Skill Exchange" || (post.skills_to_teach?.length > 0 && post.skills_to_learn?.length > 0);
    if (activeSub === "r/developersIndia") {
      const allSkills = [...(post.skills_to_teach || []), ...(post.skills_to_learn || [])].map((s) => s.toLowerCase());
      return allSkills.some((s) => ["react", "python", "sql", "javascript", "node.js", "docker", "c++", "java"].includes(s));
    }
    if (activeSub === "r/leetcode") {
      const allText = `${post.title} ${post.description} ${(post.skills_to_teach || []).join(" ")} ${(post.skills_to_learn || []).join(" ")}`.toLowerCase();
      return allText.includes("dsa") || allText.includes("algorithm") || allText.includes("structure") || allText.includes("system") || allText.includes("leetcode");
    }
    if (activeSub === "r/machinelearning") {
      const allText = `${post.title} ${post.description} ${(post.skills_to_teach || []).join(" ")} ${(post.skills_to_learn || []).join(" ")}`.toLowerCase();
      return allText.includes("machine learning") || allText.includes("ml") || allText.includes("python") || allText.includes("pytorch") || allText.includes("data");
    }
    if (activeSub === "r/webdev") {
      const allText = `${post.title} ${post.description} ${(post.skills_to_teach || []).join(" ")} ${(post.skills_to_learn || []).join(" ")}`.toLowerCase();
      return allText.includes("react") || allText.includes("web") || allText.includes("frontend") || allText.includes("backend") || allText.includes("node");
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-16">
      {/* Top Reddit Subreddit Banner */}
      <div className="rounded-xl border border-border/70 bg-[#0e1117] p-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm scrollbar-none">
            <span className="text-xs font-bold uppercase text-orange-500 flex items-center gap-1.5 mr-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              Subreddits:
            </span>
            {SUBREDDITS.map((sub) => {
              const Icon = sub.icon;
              const isActive = activeSub === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => setActiveSub(sub.name)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-[#161b22] text-zinc-300 hover:bg-[#21262d] hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs gap-1.5 h-8"
            >
              <Link to="/app/skillswap/create">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create Reddit Post</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Reddit Layout: Feed + Right Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Feed (8 cols on lg) */}
        <div className="space-y-4 lg:col-span-8">
          {/* Quick Create Post Bar (Reddit style) */}
          <Card className="flex items-center gap-3 border-border/70 bg-[#161b22] p-2.5 shadow-sm">
            <Avatar className="h-9 w-9 border border-zinc-700">
              <AvatarFallback className="bg-orange-600/20 text-orange-500 font-bold text-xs">
                U
              </AvatarFallback>
            </Avatar>
            <div
              onClick={() => navigate("/app/skillswap/create")}
              className="flex-1 cursor-pointer rounded-lg border border-zinc-700 bg-[#0d1117] px-3.5 py-2 text-xs text-zinc-400 hover:border-zinc-500 hover:bg-[#161b22] transition-colors"
            >
              Create a Reddit post to exchange skills or find mock interview partner...
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs gap-1 hidden sm:flex"
            >
              <Link to="/app/skillswap/create">
                <Code2 className="h-4 w-4" />
                <span>Code</span>
              </Link>
            </Button>
          </Card>

          {/* Sort bar (Hot, New, Top, Rising) & Search */}
          <Card className="flex flex-wrap items-center justify-between gap-3 border-border/70 bg-[#161b22] p-2.5 shadow-sm">
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map((sort) => {
                const Icon = sort.icon;
                const isActive = activeSort === sort.id;
                return (
                  <button
                    key={sort.id}
                    onClick={() => setActiveSort(sort.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#21262d] text-orange-400"
                        : "text-zinc-400 hover:bg-[#21262d] hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{sort.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <Input
                placeholder="Search Reddit feed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchPosts()}
                className="h-8 pl-8 text-xs bg-[#0d1117] border-zinc-700"
              />
            </div>
          </Card>

          {/* Feed Posts */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-[#161b22] border border-zinc-800" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card className="p-12 text-center bg-[#161b22] border-zinc-800">
              <Users2 className="mx-auto h-12 w-12 text-zinc-500" />
              <h3 className="mt-3 text-base font-bold text-white">No Reddit posts found</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Be the first to create a post in {activeSub}!
              </p>
              <Button asChild className="mt-4 bg-orange-600 hover:bg-orange-700 text-xs">
                <Link to="/app/skillswap/create">Post to Reddit</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post, idx) => {
                const voteState = userVotes[post.id] || 0;
                const score = postUpvotes[post.id] ?? 142;
                const isSaved = !!savedPosts[post.id];
                const comments = commentsMap[post.id] || [];
                const isExpanded = !!expandedComments[post.id];
                const subName = idx % 2 === 0 ? "r/skillswap" : "r/developersIndia";
                const flairText = post.post_type || "Skill Swap";

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden rounded-xl border border-zinc-800 bg-[#161b22] shadow-sm hover:border-zinc-700 transition-all">
                      <div className="flex">
                        {/* Reddit Left Rail: Upvote / Downvote */}
                        <div className="flex w-11 shrink-0 flex-col items-center bg-[#0d1117]/60 py-3 text-center border-r border-zinc-800/80">
                          <button
                            onClick={() => handleVote(post.id, 1)}
                            className={`rounded p-1 transition-colors ${
                              voteState === 1
                                ? "text-orange-500 bg-orange-500/10"
                                : "text-zinc-400 hover:text-orange-400 hover:bg-zinc-800"
                            }`}
                            title="Upvote"
                          >
                            <ArrowBigUp className="h-6 w-6" />
                          </button>
                          <span
                            className={`text-xs font-bold my-0.5 ${
                              voteState === 1
                                ? "text-orange-500"
                                : voteState === -1
                                ? "text-blue-400"
                                : "text-zinc-300"
                            }`}
                          >
                            {score}
                          </span>
                          <button
                            onClick={() => handleVote(post.id, -1)}
                            className={`rounded p-1 transition-colors ${
                              voteState === -1
                                ? "text-blue-400 bg-blue-500/10"
                                : "text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
                            }`}
                            title="Downvote"
                          >
                            <ArrowBigDown className="h-6 w-6" />
                          </button>
                        </div>

                        {/* Reddit Post Content */}
                        <div className="flex-1 p-3 sm:p-4">
                          {/* Header: Subreddit, Posted by u/..., Flair */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                            <span className="font-bold text-white hover:underline cursor-pointer">
                              {subName}
                            </span>
                            <span>•</span>
                            <span>
                              Posted by <span className="hover:underline cursor-pointer text-zinc-300">u/{post.author?.full_name?.toLowerCase().replace(/\s+/g, "_") || "student_dev"}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-zinc-400">
                              <Clock className="h-3 w-3" />
                              {post.availability || "3h ago"}
                            </span>
                            <Badge className="bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[10px] ml-auto">
                              {flairText}
                            </Badge>
                          </div>

                          {/* Post Title */}
                          <Link to={`/app/skillswap/posts/${post.id}`}>
                            <h2 className="mt-2 text-base font-bold text-zinc-100 hover:text-orange-400 transition-colors leading-snug">
                              {post.title}
                            </h2>
                          </Link>

                          {/* Post Body Description */}
                          <p className="mt-2 text-xs leading-relaxed text-zinc-300 line-clamp-3">
                            {post.description}
                          </p>

                          {/* Skill Exchange Tags (Reddit Flairs) */}
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                            <div className="rounded-md bg-emerald-950/20 border border-emerald-500/20 p-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                                🟢 Teaching (Offers):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {post.skills_to_teach.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/30"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-md bg-cyan-950/20 border border-cyan-500/20 p-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                                🔵 Wants to Learn:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {post.skills_to_learn.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-300 border border-cyan-500/30"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Reddit Action Bar: Comments, Share, Propose Swap, Save */}
                          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-2 text-xs text-zinc-400 border-t border-zinc-800/80">
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{comments.length} Comments</span>
                            </button>

                            <button
                              onClick={() => handleCopyLink(post.id)}
                              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <Share2 className="h-4 w-4" />
                              <span>Share</span>
                            </button>

                            <button
                              onClick={() => toggleSave(post.id)}
                              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                                isSaved
                                  ? "text-orange-400 bg-orange-500/10"
                                  : "hover:bg-zinc-800 hover:text-white"
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                              <span>{isSaved ? "Saved" : "Save"}</span>
                            </button>

                            <div className="ml-auto flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setActivePost(post);
                                  setRequestMsg(
                                    `Hi u/${post.author?.full_name?.toLowerCase().replace(/\s+/g, "_") || "user"}, I saw your post "${post.title}" and would like to swap skills!`
                                  );
                                }}
                                className="h-7 bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1 font-semibold"
                              >
                                <Send className="h-3 w-3" />
                                <span>Swap Proposal</span>
                              </Button>

                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                              >
                                <Link to={`/app/skillswap/posts/${post.id}`}>
                                  Full Post
                                </Link>
                              </Button>
                            </div>
                          </div>

                          {/* Interactive Inline Reddit Comments Thread */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 overflow-hidden rounded-lg bg-[#0d1117] p-3 border border-zinc-800"
                              >
                                <div className="space-y-3">
                                  {/* Add Comment Input */}
                                  <div className="flex gap-2">
                                    <Avatar className="h-7 w-7 mt-1 border border-zinc-700">
                                      <AvatarFallback className="text-[10px] bg-orange-600/30 text-orange-400">
                                        ME
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1.5">
                                      <Textarea
                                        rows={2}
                                        placeholder="Add a Reddit comment as u/rashika_student..."
                                        value={newCommentText[post.id] || ""}
                                        onChange={(e) =>
                                          setNewCommentText((prev) => ({
                                            ...prev,
                                            [post.id]: e.target.value,
                                          }))
                                        }
                                        className="text-xs bg-[#161b22] border-zinc-700 focus:border-orange-500"
                                      />
                                      <div className="flex justify-end">
                                        <Button
                                          size="sm"
                                          onClick={() => handleAddComment(post.id)}
                                          className="h-7 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3"
                                        >
                                          Comment
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Threaded Comments List */}
                                  <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                                    {comments.length === 0 ? (
                                      <p className="text-center py-2 text-xs text-zinc-500">
                                        No comments yet. Be the first to share your thoughts!
                                      </p>
                                    ) : (
                                      comments.map((c) => (
                                        <div
                                          key={c.id}
                                          className="flex gap-2.5 rounded-md p-2 bg-[#161b22]/50 border border-zinc-800/50 text-xs"
                                        >
                                          <div className="flex flex-col items-center gap-1 text-zinc-500 shrink-0">
                                            <button className="hover:text-orange-400">
                                              <ArrowBigUp className="h-4 w-4" />
                                            </button>
                                            <span className="text-[10px] font-bold text-zinc-400">
                                              {c.votes}
                                            </span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                              <span className="font-semibold text-zinc-200">
                                                {c.author}
                                              </span>
                                              <span>•</span>
                                              <span>{c.time}</span>
                                            </div>
                                            <p className="mt-1 text-zinc-300 leading-relaxed text-xs">
                                              {c.text}
                                            </p>
                                            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-zinc-500">
                                              <button className="hover:text-zinc-300">Reply</button>
                                              <button className="hover:text-zinc-300">Share</button>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Reddit Community Sidebar (4 cols on lg) */}
        <div className="space-y-4 lg:col-span-4">
          {/* About Community Card */}
          <Card className="overflow-hidden border-border/80 bg-[#161b22] shadow-sm">
            <div className="h-16 bg-gradient-to-r from-orange-600 to-amber-600 p-3 flex items-end">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Reddit SkillSwap Community
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 -mt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d1117] border-2 border-orange-500 shadow-md">
                  <ArrowLeftRight className="h-6 w-6 text-orange-500" />
                </div>
                <div className="pt-3">
                  <h3 className="font-bold text-white text-sm">r/skillswap</h3>
                  <p className="text-[10px] text-zinc-400">r/skillswap • College Peer Barter</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Connect with college peers. Teach the tools you've mastered in exchange for learning the skills you need for placement interviews.
              </p>

              <div className="grid grid-cols-2 gap-2 py-2 border-y border-zinc-800 text-center">
                <div>
                  <div className="text-sm font-bold text-white">{posts.length > 0 ? posts.length * 3 + 12 : 12}</div>
                  <div className="text-[10px] text-zinc-400">Members</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {posts.length > 0 ? Math.min(posts.length + 2, 20) : 1}
                  </div>
                  <div className="text-[10px] text-zinc-400">Online</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
                >
                  <Link to="/app/skillswap/create">Create Reddit Post</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-zinc-700 text-xs hover:bg-zinc-800 text-zinc-200"
                >
                  <Link to="/app/skillswap/my-activity">View My Reddit Activity</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Student Peer Barter Hub Banner */}
          <Card className="border-border/80 bg-gradient-to-br from-orange-600/15 via-[#161b22] to-[#0d1117] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-orange-400">
              <Sparkles className="h-4 w-4" />
              <span>Campus Peer Barter</span>
            </div>
            <h4 className="mt-1 text-sm font-bold text-white">
              Exchange Skills & Prepare for Placements
            </h4>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Find college seniors and peers for 1-on-1 code reviews, pair programming, and mock interview practice.
            </p>
            <Button
              asChild
              className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold gap-1.5"
            >
              <Link to="/app/skillswap/create">
                <span>Post Skill Swap Request</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </Card>

          {/* Recent Reddit Posts Sidebar (matches the user's screenshot) */}
          <Card className="border-border/80 bg-[#161b22] p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-bold uppercase text-zinc-400">
              <span>RECENT POSTS</span>
              <span className="text-[10px] text-zinc-500 lowercase">Clear</span>
            </div>
            <div className="mt-2 divide-y divide-zinc-800/80">
              {RECENT_SIDEBAR_POSTS.map((rp, i) => (
                <div key={i} className="py-2.5 first:pt-1 last:pb-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="font-semibold text-orange-400">{rp.sub}</span>
                    <span>•</span>
                    <span>{rp.time}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-zinc-200 hover:text-orange-400 cursor-pointer line-clamp-2 leading-snug">
                    {rp.title}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-zinc-500">
                    <span>{rp.upvotes} upvotes</span>
                    <span>•</span>
                    <span>{rp.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reddit Community Rules */}
          <Card className="border-border/80 bg-[#161b22] p-4 text-xs text-zinc-300">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>r/SkillSwap Rules</span>
            </h4>
            <ol className="space-y-1.5 list-decimal list-inside text-[11px] text-zinc-400">
              <li>Be respectful and constructive in feedback</li>
              <li>Accurately list skills you offer to teach</li>
              <li>No spam, paid services, or solicitations</li>
              <li>Honor agreed study / pairing schedules</li>
            </ol>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-500">
              Reddit SkillSync AI Inc. © 2026. All rights reserved.
            </div>
          </Card>
        </div>
      </div>

      {/* Collaboration Proposal Modal */}
      <Dialog open={!!activePost} onOpenChange={(open) => !open && setActivePost(null)}>
        <DialogContent className="sm:max-w-md bg-[#161b22] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-orange-500" />
              <span>Send Skill Swap Proposal</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Reach out to {activePost?.author?.full_name || "Student"} on Reddit SkillSwap.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg border border-zinc-700 bg-[#0d1117] p-2.5">
              <p className="font-semibold text-white">{activePost?.title}</p>
              <p className="text-zinc-400 mt-0.5">
                They teach: {activePost?.skills_to_teach.join(", ")}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-300">Your Pitch / Proposal</label>
              <Textarea
                rows={4}
                value={requestMsg}
                onChange={(e) => setRequestMsg(e.target.value)}
                placeholder="Hi! I saw your Reddit post and would love to exchange skills..."
                className="text-xs bg-[#0d1117] border-zinc-700 text-white"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePost(null)}
              className="border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSendProposal}
              disabled={sendingReq}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{sendingReq ? "Sending..." : "Submit Proposal"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SkillSwapPage;
