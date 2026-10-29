import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users2,
  PlusCircle,
  Inbox,
  Send,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  getMySkillSwapPosts,
  getMyCollaborationRequests,
  updateRequestStatus,
  deleteSkillSwapPost,
} from "@/services/skillswap-service";

export function SkillSwapActivityPage() {
  const [posts, setPosts] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [myPosts, reqs] = await Promise.all([
        getMySkillSwapPosts(),
        getMyCollaborationRequests(),
      ]);
      setPosts(myPosts || []);
      setIncoming(reqs?.incoming || []);
      setSent(reqs?.sent || []);
    } catch (err) {
      toast.error(err?.message || "Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (requestId, status) => {
    setActionInProgress(requestId);
    try {
      await updateRequestStatus(requestId, status);
      toast.success(status === "accepted" ? "Request accepted! Conversation created." : "Request updated.");
      loadData();
    } catch (err) {
      toast.error(err?.message || "Action failed");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteSkillSwapPost(postId);
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link to="/app/skillswap">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
        </Button>
        <Button asChild size="sm" className="gap-1.5">
          <Link to="/app/skillswap/create">
            <PlusCircle className="h-4 w-4" />
            <span>New Swap Post</span>
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold">My SkillSwap Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track incoming connection proposals, outgoing requests, and your active posts
        </p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="incoming" className="text-xs">
            Incoming ({incoming.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="text-xs">
            Sent ({sent.length})
          </TabsTrigger>
          <TabsTrigger value="posts" className="text-xs">
            My Posts ({posts.length})
          </TabsTrigger>
        </TabsList>

        {/* Incoming Proposals */}
        <TabsContent value="incoming" className="mt-4 space-y-3">
          {incoming.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border/70 text-muted-foreground text-xs">
              No incoming proposals at the moment.
            </Card>
          ) : (
            incoming.map((req) => (
              <Card key={req.id} className="p-4 border-border/60 bg-card/75 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {req.requester?.full_name?.slice(0, 2).toUpperCase() || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{req.requester?.full_name || "Student"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      For: {req.post?.title || "SkillSwap Collaboration"}
                    </p>
                    {req.message && (
                      <p className="text-xs bg-muted/40 p-2 rounded-lg mt-1 text-foreground/80 max-w-lg">
                        "{req.message}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(req.id, "accepted")}
                        disabled={actionInProgress === req.id}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(req.id, "rejected")}
                        disabled={actionInProgress === req.id}
                        className="h-8 text-xs"
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <Badge variant="outline" className={req.status === "accepted" ? "text-emerald-400 border-emerald-500/30" : "text-muted-foreground"}>
                      {req.status}
                    </Badge>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Sent Proposals */}
        <TabsContent value="sent" className="mt-4 space-y-3">
          {sent.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border/70 text-muted-foreground text-xs">
              You haven't sent any proposals yet. Browse the marketplace to find matching peers!
            </Card>
          ) : (
            sent.map((req) => (
              <Card key={req.id} className="p-4 border-border/60 bg-card/75 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">To: {req.recipient?.full_name || "Student"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Post: {req.post?.title || "SkillSwap Exchange"}
                  </p>
                  {req.message && (
                    <p className="text-xs text-muted-foreground/80 mt-1 italic">
                      "{req.message}"
                    </p>
                  )}
                </div>

                <Badge variant="outline" className={req.status === "accepted" ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"}>
                  {req.status}
                </Badge>
              </Card>
            ))
          )}
        </TabsContent>

        {/* My Posts */}
        <TabsContent value="posts" className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border/70 text-muted-foreground text-xs">
              You haven't created any posts yet.
            </Card>
          ) : (
            posts.map((p) => (
              <Card key={p.id} className="p-4 border-border/60 bg-card/75 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{p.title}</p>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      {p.post_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Teaches: {p.skills_to_teach.join(", ")} · Learns: {p.skills_to_learn.join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                    <Link to={`/app/skillswap/posts/${p.id}`}>View</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletePost(p.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default SkillSwapActivityPage;
