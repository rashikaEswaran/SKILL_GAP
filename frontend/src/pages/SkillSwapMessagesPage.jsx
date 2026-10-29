import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Users2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/services/supabase";
import {
  getMyConversations,
  getConversationMessages,
  sendConversationMessage,
} from "@/services/skillswap-service";

export function SkillSwapMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [inputMessage, setInputMessage] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async (autoSelectFirst = true) => {
    try {
      const { data: u } = await supabase.auth.getUser();
      if (u?.user) setCurrentUserId(u.user.id);

      const convs = await getMyConversations();
      setConversations(convs || []);

      if (autoSelectFirst && convs && convs.length > 0 && !selectedConv) {
        setSelectedConv(convs[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    async function loadMsgs() {
      setLoadingMessages(true);
      try {
        const msgs = await getConversationMessages(selectedConv.id);
        setMessages(msgs || []);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadMsgs();
  }, [selectedConv]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConv || !inputMessage.trim()) return;

    setSending(true);
    try {
      const newMsg = await sendConversationMessage(selectedConv.id, inputMessage);
      setMessages((prev) => [...prev, newMsg]);
      setInputMessage("");
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      toast.error(err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">SkillSwap Collaboration Chat</h1>
          <p className="text-xs text-muted-foreground">Direct messages with peer learning partners</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadConversations(false)}
          className="gap-1.5 h-8 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid h-[620px] grid-cols-1 rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur md:grid-cols-3 overflow-hidden">
        {/* Left Conversations Sidebar */}
        <div className="border-r border-border/50 flex flex-col bg-background/40">
          <div className="p-3 border-b border-border/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Collaborations ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {loadingConv ? (
              <div className="p-4 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-card/60" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                <Users2 className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                No active conversations yet. Accept or send collaboration requests on the marketplace.
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = selectedConv?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConv(c)}
                    className={`w-full p-3.5 text-left transition-colors flex items-center gap-3 ${
                      isSelected ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-muted/40"
                    }`}
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {c.otherParticipant?.full_name?.slice(0, 2).toUpperCase() || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">
                        {c.otherParticipant?.full_name || "Student"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {c.postTitle}
                      </p>
                      {c.lastMessage && (
                        <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                          {c.lastMessage}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="md:col-span-2 flex flex-col h-full bg-background/20">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-card/50">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {selectedConv.otherParticipant?.full_name?.slice(0, 2).toUpperCase() || "ST"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm leading-none">
                    {selectedConv.otherParticipant?.full_name || "Student Partner"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedConv.postTitle}
                  </p>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-xs text-muted-foreground">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <span>No messages exchanged yet. Say hello and suggest a time to meet!</span>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === currentUserId;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                              : "bg-card border border-border/70 text-foreground rounded-tl-none shadow-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-border/50 bg-card/40 flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message (e.g. Can we meet this Saturday on Discord?)..."
                  className="text-xs bg-background/70"
                />
                <Button type="submit" disabled={sending || !inputMessage.trim()} size="sm" className="h-9 px-4">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-2" />
              <p className="font-semibold text-sm">Select a Conversation</p>
              <p className="text-xs max-w-xs mt-1">
                Choose a peer from the list on the left to coordinate study sessions and swap skills.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SkillSwapMessagesPage;
