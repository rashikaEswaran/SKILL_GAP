import { supabase } from "@/services/supabase";

/**
 * Deterministic complementary skill matching
 */
export function computeSkillMatch(
  mySkillsToTeach = [],
  mySkillsToLearn = [],
  postSkillsToTeach = [],
  postSkillsToLearn = []
) {
  const norm = (s) => (s ? String(s).trim().toLowerCase() : "");
  const myTeachNorm = mySkillsToTeach.map(norm);
  const myLearnNorm = mySkillsToLearn.map(norm);
  const postTeachNorm = postSkillsToTeach.map(norm);
  const postLearnNorm = postSkillsToLearn.map(norm);

  const canTeachThem = mySkillsToTeach.filter((s) => postLearnNorm.includes(norm(s)));
  const canLearnFromThem = postSkillsToTeach.filter((s) => myLearnNorm.includes(norm(s)));

  const isMutual = canTeachThem.length > 0 && canLearnFromThem.length > 0;

  if (isMutual) {
    return {
      score: 95,
      badge: "Mutual Match",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      canTeachThem,
      canLearnFromThem,
      explanation: `Complementary Match: You can teach ${canTeachThem.join(", ")} (which they want), and they can teach ${canLearnFromThem.join(", ")} (which you want).`,
    };
  }

  if (canTeachThem.length > 0) {
    return {
      score: 70,
      badge: "You Can Mentor",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      canTeachThem,
      canLearnFromThem: [],
      explanation: `Mentorship Fit: You have expertise in ${canTeachThem.join(", ")} which matches their learning goal.`,
    };
  }

  if (canLearnFromThem.length > 0) {
    return {
      score: 70,
      badge: "You Can Learn",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      canTeachThem: [],
      canLearnFromThem,
      explanation: `Learning Opportunity: They know ${canLearnFromThem.join(", ")} which you are looking to learn.`,
    };
  }

  return {
    score: 25,
    badge: "Connect",
    badgeColor: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    canTeachThem: [],
    canLearnFromThem: [],
    explanation: `No exact skill overlap detected, but you can still connect for general study or collaborative projects.`,
  };
}

export function toStringArray(val) {
  if (Array.isArray(val)) {
    return val.map((s) => String(s).trim()).filter(Boolean);
  }
  return [];
}

export const DEFAULT_COMMUNITY_POSTS = [
  {
    id: "sp_001",
    user_id: "u_aarav",
    title: "Exchange Python & ML for Docker/Kubernetes Mentorship",
    description: "I have strong experience with Python, Pandas, Scikit-learn, and PyTorch. Looking for someone with hands-on DevOps/Docker knowledge to help me containerize microservices for campus placements.",
    post_type: "Skill Exchange",
    skill_level: "Intermediate",
    skills_to_teach: ["Python", "Machine Learning", "PyTorch", "Data Analysis"],
    skills_to_learn: ["Docker", "Kubernetes", "CI/CD"],
    availability: "Weekends & Evenings",
    preferred_collaboration: "Discord / Google Meet",
    status: "active",
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    author: {
      id: "u_aarav",
      full_name: "Aarav Sharma",
      avatar_url: null,
      college: "IIT Delhi",
      department: "Computer Science",
    },
  },
  {
    id: "sp_002",
    user_id: "u_priya",
    title: "Frontend Mastery (React / Tailwind) for SQL & System Design",
    description: "Built several web applications using React, Next.js, and Tailwind CSS. Looking to partner with someone strong in System Design and SQL optimizations for upcoming tech interviews.",
    post_type: "Skill Exchange",
    skill_level: "Advanced",
    skills_to_teach: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
    skills_to_learn: ["SQL", "PostgreSQL", "System Design"],
    availability: "Flexible (3-4 hrs/week)",
    preferred_collaboration: "Google Meet / Pair Coding",
    status: "active",
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    author: {
      id: "u_priya",
      full_name: "Priya Patel",
      avatar_url: null,
      college: "BITS Pilani",
      department: "Information Systems",
    },
  },
  {
    id: "sp_003",
    user_id: "u_rohan",
    title: "Study Group: DSA & LeetCode Hard Patterns for FAANG",
    description: "Looking for dedicated study buddies solving daily LeetCode medium/hard problems in Graphs, Dynamic Programming, and Tree algorithms.",
    post_type: "Study Group",
    skill_level: "Intermediate",
    skills_to_teach: ["Algorithms", "Data Structures", "C++"],
    skills_to_learn: ["Dynamic Programming", "System Design"],
    availability: "Daily 9 PM - 11 PM",
    preferred_collaboration: "Discord Voice + VS Code Live Share",
    status: "active",
    created_at: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
    author: {
      id: "u_rohan",
      full_name: "Rohan Verma",
      avatar_url: null,
      college: "NIT Trichy",
      department: "Software Engineering",
    },
  },
  {
    id: "sp_004",
    user_id: "u_ananya",
    title: "Backend API Building (FastAPI & Node.js) seeking Cloud Partner (AWS)",
    description: "Experienced with REST APIs, authentication, and caching. Seeking someone who understands AWS infrastructure, S3, ECS, and Lambda to build a cloud portfolio project together.",
    post_type: "Project Partner",
    skill_level: "Intermediate",
    skills_to_teach: ["FastAPI", "Node.js", "REST APIs"],
    skills_to_learn: ["AWS", "Cloud", "Docker"],
    availability: "Saturday & Sunday",
    preferred_collaboration: "GitHub + Slack",
    status: "active",
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    author: {
      id: "u_ananya",
      full_name: "Ananya Iyer",
      avatar_url: null,
      college: "PES University",
      department: "AI & Data Science",
    },
  },
];

function getLocalCustomPosts() {
  try {
    const raw = localStorage.getItem("skillsync_custom_posts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomPost(post) {
  try {
    const existing = getLocalCustomPosts();
    localStorage.setItem("skillsync_custom_posts", JSON.stringify([post, ...existing]));
  } catch {}
}

export async function getSkillSwapPosts(filters) {
  let dbPosts = [];
  try {
    let query = supabase
      .from("skillswap_posts")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (filters?.postType && filters.postType !== "All") {
      query = query.eq("post_type", filters.postType);
    }
    if (filters?.skillLevel && filters.skillLevel !== "All") {
      query = query.eq("skill_level", filters.skillLevel);
    }

    const { data: postsData, error: postsError } = await query;
    if (!postsError && postsData && postsData.length > 0) {
      const userIds = Array.from(new Set(postsData.map((p) => p.user_id)));
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, college, department")
        .in("id", userIds);

      const profileMap = new Map();
      profilesData?.forEach((prof) => {
        profileMap.set(prof.id, prof);
      });

      dbPosts = postsData.map((raw) => ({
        id: raw.id,
        user_id: raw.user_id,
        title: raw.title,
        description: raw.description,
        post_type: raw.post_type,
        skill_level: raw.skill_level,
        skills_to_teach: toStringArray(raw.skills_to_teach),
        skills_to_learn: toStringArray(raw.skills_to_learn),
        availability: raw.availability,
        preferred_collaboration: raw.preferred_collaboration,
        status: raw.status,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        author: profileMap.get(raw.user_id) || {
          id: raw.user_id,
          full_name: "Student",
          avatar_url: null,
          college: null,
          department: null,
        },
      }));
    }
  } catch (err) {
    console.warn("Could not fetch remote skillswap posts:", err);
  }

  const localCustom = getLocalCustomPosts();
  let allPosts = [...localCustom, ...dbPosts];

  // If no posts in DB or local, fallback to community posts
  if (allPosts.length === 0) {
    allPosts = DEFAULT_COMMUNITY_POSTS;
  }

  let result = allPosts;
  if (filters?.postType && filters.postType !== "All") {
    result = result.filter((p) => p.post_type === filters.postType);
  }
  if (filters?.skillLevel && filters.skillLevel !== "All") {
    result = result.filter((p) => p.skill_level === filters.skillLevel);
  }

  if (filters?.search && filters.search.trim()) {
    const s = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.skills_to_teach.some((sk) => sk.toLowerCase().includes(s)) ||
        p.skills_to_learn.some((sk) => sk.toLowerCase().includes(s)) ||
        (p.author?.full_name && p.author.full_name.toLowerCase().includes(s))
    );
  }

  if (filters?.skillTag && filters.skillTag.trim()) {
    const tag = filters.skillTag.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.skills_to_teach.some((sk) => sk.toLowerCase().includes(tag)) ||
        p.skills_to_learn.some((sk) => sk.toLowerCase().includes(tag))
    );
  }

  return result;
}

export async function getSkillSwapPostById(id) {
  // Check local custom posts
  const local = getLocalCustomPosts().find((p) => p.id === id);
  if (local) return local;

  // Check default community posts
  const defaultPost = DEFAULT_COMMUNITY_POSTS.find((p) => p.id === id);
  if (defaultPost) return defaultPost;

  try {
    const { data: raw, error } = await supabase
      .from("skillswap_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !raw) return null;

    const { data: author } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, college, department")
      .eq("id", raw.user_id)
      .maybeSingle();

    return {
      id: raw.id,
      user_id: raw.user_id,
      title: raw.title,
      description: raw.description,
      post_type: raw.post_type,
      skill_level: raw.skill_level,
      skills_to_teach: toStringArray(raw.skills_to_teach),
      skills_to_learn: toStringArray(raw.skills_to_learn),
      availability: raw.availability,
      preferred_collaboration: raw.preferred_collaboration,
      status: raw.status,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      author: author || {
        id: raw.user_id,
        full_name: "Student",
        avatar_url: null,
        college: null,
        department: null,
      },
    };
  } catch {
    return null;
  }
}


export async function createSkillSwapPost(params) {
  let user = null;
  try {
    const { data: u } = await supabase.auth.getUser();
    if (u?.user) user = u.user;
  } catch (e) {}

  if (!user) {
    try {
      const demo = localStorage.getItem("skillsync_demo_user");
      if (demo) user = JSON.parse(demo);
    } catch (e) {}
  }

  if (!user) throw new Error("You must be signed in to create a post.");

  try {
    const { data, error } = await supabase
      .from("skillswap_posts")
      .insert({
        user_id: user.id,
        title: params.title.trim(),
        description: params.description.trim(),
        post_type: params.post_type,
        skill_level: params.skill_level,
        skills_to_teach: params.skills_to_teach,
        skills_to_learn: params.skills_to_learn,
        availability: params.availability?.trim() || null,
        preferred_collaboration: params.preferred_collaboration?.trim() || null,
        status: "active",
      })
      .select("id")
      .single();

    if (!error && data?.id) return data.id;
  } catch (err) {
    console.warn("Supabase insert error, falling back to local store:", err);
  }

  const localId = `post_${Date.now()}`;
  const newPost = {
    id: localId,
    user_id: user.id,
    title: params.title.trim(),
    description: params.description.trim(),
    post_type: params.post_type,
    skill_level: params.skill_level,
    skills_to_teach: params.skills_to_teach,
    skills_to_learn: params.skills_to_learn,
    availability: params.availability?.trim() || null,
    preferred_collaboration: params.preferred_collaboration?.trim() || null,
    status: "active",
    created_at: new Date().toISOString(),
    author: {
      id: user.id,
      full_name: user.user_metadata?.full_name || "Demo Student",
      avatar_url: null,
      college: "My University",
      department: "Computer Science",
    },
  };
  saveLocalCustomPost(newPost);
  return localId;
}


export async function updateSkillSwapPost(postId, params) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Unauthorized");

  const updates = {};
  if (params.title !== undefined) updates.title = params.title.trim();
  if (params.description !== undefined) updates.description = params.description.trim();
  if (params.post_type !== undefined) updates.post_type = params.post_type;
  if (params.skill_level !== undefined) updates.skill_level = params.skill_level;
  if (params.skills_to_teach !== undefined) updates.skills_to_teach = params.skills_to_teach;
  if (params.skills_to_learn !== undefined) updates.skills_to_learn = params.skills_to_learn;
  if (params.availability !== undefined) updates.availability = params.availability?.trim() || null;
  if (params.preferred_collaboration !== undefined) updates.preferred_collaboration = params.preferred_collaboration?.trim() || null;
  if (params.status !== undefined) updates.status = params.status;

  const { error } = await supabase
    .from("skillswap_posts")
    .update(updates)
    .eq("id", postId)
    .eq("user_id", u.user.id);

  if (error) throw error;
}

export async function deleteSkillSwapPost(postId) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("skillswap_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", u.user.id);

  if (error) throw error;
}

export async function getMySkillSwapPosts() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];

  const { data, error } = await supabase
    .from("skillswap_posts")
    .select("*")
    .eq("user_id", u.user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((raw) => ({
    id: raw.id,
    user_id: raw.user_id,
    title: raw.title,
    description: raw.description,
    post_type: raw.post_type,
    skill_level: raw.skill_level,
    skills_to_teach: toStringArray(raw.skills_to_teach),
    skills_to_learn: toStringArray(raw.skills_to_learn),
    availability: raw.availability,
    preferred_collaboration: raw.preferred_collaboration,
    status: raw.status,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  }));
}

export async function sendCollaborationRequest(params) {
  let user = null;
  try {
    const { data: u } = await supabase.auth.getUser();
    if (u?.user) user = u.user;
  } catch {}

  if (!user && typeof window !== "undefined") {
    try {
      const demo = localStorage.getItem("skillsync_demo_user") || localStorage.getItem("skillsync_auth_user");
      if (demo) user = JSON.parse(demo);
    } catch {}
  }

  // Fallback default student user so request always succeeds
  if (!user) {
    user = {
      id: "00000000-0000-0000-0000-000000000001",
      email: "demo@skillsync.edu",
      user_metadata: { full_name: "Demo Student" },
    };
  }

  if (user.id === params.recipientId) {
    throw new Error("You cannot send a collaboration request to yourself.");
  }

  const isDemoUser = user.id.startsWith("00000000");

  // For demo users, simulate a successful request without hitting supabase
  if (isDemoUser) {
    const localKey = `skillsync_sent_requests_${params.postId}`;
    const existing = JSON.parse(localStorage.getItem(localKey) || "null");
    if (existing) {
      throw new Error("You already have a pending request for this post.");
    }
    const fakeId = `req_demo_${Date.now()}`;
    localStorage.setItem(localKey, JSON.stringify({ id: fakeId, status: "pending" }));
    return fakeId;
  }

  // Real user: check for duplicate pending request
  try {
    const { data: existing } = await supabase
      .from("skillswap_requests")
      .select("id, status")
      .eq("post_id", params.postId)
      .eq("requester_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      throw new Error("You already have a pending request for this post.");
    }
  } catch (err) {
    if (err?.message?.includes("pending request")) throw err;
    console.warn("Existing request check skipped:", err);
  }

  const { data, error } = await supabase
    .from("skillswap_requests")
    .insert({
      post_id: params.postId,
      requester_id: user.id,
      recipient_id: params.recipientId,
      message: params.message?.trim() || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export const DEFAULT_DEMO_CONVERSATIONS = [
  {
    id: "conv_001",
    request_id: "req_001",
    participant1_id: "00000000-0000-0000-0000-000000000001",
    participant2_id: "u_aarav",
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    otherParticipant: {
      id: "u_aarav",
      full_name: "Aarav Sharma",
      avatar_url: null,
      college: "IIT Delhi",
      department: "Computer Science",
    },
    postTitle: "Exchange Python & ML for Docker/Kubernetes Mentorship",
    lastMessage: "Sounds great! Looking forward to our peer exchange session.",
  },
];

export const DEFAULT_DEMO_MESSAGES = [
  {
    id: "msg_001",
    conversation_id: "conv_001",
    sender_id: "u_aarav",
    content: "Hey! I saw your post. I'd love to mentor you on Docker and Kubernetes in exchange for Python ML tips.",
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    sender: { full_name: "Aarav Sharma" },
  },
  {
    id: "msg_002",
    conversation_id: "conv_001",
    sender_id: "00000000-0000-0000-0000-000000000001",
    content: "Hi Aarav! That sounds awesome. I'm building a project with FastAPI and want to containerize it.",
    created_at: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    sender: { full_name: "Demo Student" },
  },
  {
    id: "msg_003",
    conversation_id: "conv_001",
    sender_id: "u_aarav",
    content: "Sounds great! Looking forward to our peer exchange session.",
    created_at: new Date(Date.now() - 1800 * 1000).toISOString(),
    sender: { full_name: "Aarav Sharma" },
  },
];

export async function getMyCollaborationRequests() {
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

  if (!user) return { incoming: [], sent: [] };

  try {
    const [inRes, sentRes] = await Promise.all([
      supabase
        .from("skillswap_requests")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("skillswap_requests")
        .select("*")
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (!inRes.error && !sentRes.error && (inRes.data?.length > 0 || sentRes.data?.length > 0)) {
      const allReqs = [...(inRes.data || []), ...(sentRes.data || [])];
      const postIds = Array.from(new Set(allReqs.map((r) => r.post_id)));
      const userIds = Array.from(
        new Set(allReqs.flatMap((r) => [r.requester_id, r.recipient_id]))
      );

      const [postsRes, profilesRes] = await Promise.all([
        postIds.length > 0
          ? supabase.from("skillswap_posts").select("id, title, post_type").in("id", postIds)
          : { data: [] },
        userIds.length > 0
          ? supabase.from("profiles").select("id, full_name, avatar_url, college, department").in("id", userIds)
          : { data: [] },
      ]);

      const postMap = new Map((postsRes.data || []).map((p) => [p.id, p]));
      const profMap = new Map((profilesRes.data || []).map((p) => [p.id, p]));

      const format = (r) => ({
        id: r.id,
        post_id: r.post_id,
        requester_id: r.requester_id,
        recipient_id: r.recipient_id,
        message: r.message,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        post: postMap.get(r.post_id),
        requester: profMap.get(r.requester_id),
        recipient: profMap.get(r.recipient_id),
      });

      return {
        incoming: (inRes.data || []).map(format),
        sent: (sentRes.data || []).map(format),
      };
    }
  } catch (err) {
    console.warn("Could not fetch remote collaboration requests:", err);
  }

  // Return sample demo request
  return {
    incoming: [
      {
        id: "req_in_01",
        post_id: "sp_001",
        requester_id: "u_priya",
        recipient_id: user.id,
        message: "Hi! I would love to collaborate on your React and System Design posting.",
        status: "pending",
        created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        post: { id: "sp_001", title: "Frontend Mastery for SQL & System Design", post_type: "Skill Exchange" },
        requester: { id: "u_priya", full_name: "Priya Patel", college: "BITS Pilani", department: "Information Systems" },
      },
    ],
    sent: [
      {
        id: "req_sent_01",
        post_id: "sp_001",
        requester_id: user.id,
        recipient_id: "u_aarav",
        message: "Hi Aarav, let's exchange Python & Docker skills!",
        status: "accepted",
        created_at: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
        post: { id: "sp_001", title: "Exchange Python & ML for Docker/Kubernetes Mentorship", post_type: "Skill Exchange" },
        recipient: { id: "u_aarav", full_name: "Aarav Sharma", college: "IIT Delhi", department: "Computer Science" },
      },
    ],
  };
}

export async function updateRequestStatus(requestId, newStatus) {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (u?.user) {
      await supabase.from("skillswap_requests").update({ status: newStatus }).eq("id", requestId);
    }
  } catch {}
}

export async function getMyConversations() {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (u?.user) {
      const { data, error } = await supabase
        .from("skillswap_conversations")
        .select("*")
        .or(`participant1_id.eq.${u.user.id},participant2_id.eq.${u.user.id}`)
        .order("updated_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const reqIds = data.map((c) => c.request_id);
        const otherIds = data.map((c) => (c.participant1_id === u.user.id ? c.participant2_id : c.participant1_id));

        const [reqsRes, profsRes, msgsRes] = await Promise.all([
          supabase.from("skillswap_requests").select("id, post_id").in("id", reqIds),
          supabase.from("profiles").select("id, full_name, avatar_url, college, department").in("id", otherIds),
          supabase.from("skillswap_messages").select("conversation_id, content, created_at").in("conversation_id", data.map((c) => c.id)).order("created_at", { ascending: false }),
        ]);

        const postIds = Array.from(new Set((reqsRes.data || []).map((r) => String(r.post_id))));
        const { data: postsData } = postIds.length > 0
          ? await supabase.from("skillswap_posts").select("id, title").in("id", postIds)
          : { data: [] };

        const postMap = new Map((postsData || []).map((p) => [p.id, p.title]));
        const reqPostMap = new Map((reqsRes.data || []).map((r) => [r.id, postMap.get(r.post_id) || "SkillSwap Collaboration"]));
        const profMap = new Map((profsRes.data || []).map((p) => [p.id, p]));
        
        const lastMsgMap = new Map();
        (msgsRes.data || []).forEach((m) => {
          if (!lastMsgMap.has(m.conversation_id)) {
            lastMsgMap.set(m.conversation_id, m.content);
          }
        });

        return data.map((c) => {
          const otherId = c.participant1_id === u.user.id ? c.participant2_id : c.participant1_id;
          return {
            id: c.id,
            request_id: c.request_id,
            participant1_id: c.participant1_id,
            participant2_id: c.participant2_id,
            created_at: c.created_at,
            updated_at: c.updated_at,
            otherParticipant: profMap.get(otherId),
            postTitle: String(reqPostMap.get(c.request_id) || "SkillSwap Collaboration"),
            lastMessage: lastMsgMap.get(c.id),
          };
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote conversations:", err);
  }

  return DEFAULT_DEMO_CONVERSATIONS;
}

export async function getConversationMessages(conversationId) {
  try {
    const { data, error } = await supabase
      .from("skillswap_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const senderIds = Array.from(new Set(data.map((m) => m.sender_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, college, department")
        .in("id", senderIds);

      const profMap = new Map((profs || []).map((p) => [p.id, p]));

      return data.map((m) => ({
        id: m.id,
        conversation_id: m.conversation_id,
        sender_id: m.sender_id,
        content: m.content,
        created_at: m.created_at,
        sender: profMap.get(m.sender_id),
      }));
    }
  } catch {}

  const localMsgs = JSON.parse(localStorage.getItem(`skillsync_chat_${conversationId}`) || "[]");
  return [...DEFAULT_DEMO_MESSAGES, ...localMsgs];
}

export async function sendConversationMessage(conversationId, content) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Message cannot be empty.");

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

  const senderId = user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    if (user && !user.id.startsWith("0000")) {
      const { data, error } = await supabase
        .from("skillswap_messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: trimmed,
        })
        .select("*")
        .single();

      if (!error && data) return data;
    }
  } catch {}

  const newMsg = {
    id: `msg_${Date.now()}`,
    conversation_id: conversationId,
    sender_id: senderId,
    content: trimmed,
    created_at: new Date().toISOString(),
    sender: { full_name: user?.user_metadata?.full_name || "Demo Student" },
  };

  const key = `skillsync_chat_${conversationId}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([...existing, newMsg]));

  return newMsg;
}

