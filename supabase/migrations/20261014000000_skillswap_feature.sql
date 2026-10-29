-- Migration: 20261014000000_skillswap_feature.sql
-- Description: Create SkillSwap tables, indexes, triggers, and Row Level Security policies

-- 1. Ensure authenticated users can read public profiles for displaying author information
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users read public profile data" ON public.profiles;
CREATE POLICY "Users read public profile data" ON public.profiles FOR SELECT TO authenticated USING (true);

-- 2. SKILLSWAP POSTS
CREATE TABLE IF NOT EXISTS public.skillswap_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'Skill Exchange' CHECK (post_type IN ('Skill Exchange', 'Learning Partner', 'Project Partner', 'Study Group')),
  skill_level TEXT NOT NULL DEFAULT 'Intermediate' CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  skills_to_teach JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills_to_learn JSONB NOT NULL DEFAULT '[]'::jsonb,
  availability TEXT,
  preferred_collaboration TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skillswap_posts_user ON public.skillswap_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_skillswap_posts_status ON public.skillswap_posts(status);
CREATE INDEX IF NOT EXISTS idx_skillswap_posts_created_at ON public.skillswap_posts(created_at DESC);

ALTER TABLE public.skillswap_posts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skillswap_posts TO authenticated;
GRANT ALL ON public.skillswap_posts TO service_role;

DROP POLICY IF EXISTS "Authenticated users view active or own posts" ON public.skillswap_posts;
CREATE POLICY "Authenticated users view active or own posts" ON public.skillswap_posts
  FOR SELECT TO authenticated
  USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own posts" ON public.skillswap_posts;
CREATE POLICY "Users create own posts" ON public.skillswap_posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own posts" ON public.skillswap_posts;
CREATE POLICY "Users update own posts" ON public.skillswap_posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own posts" ON public.skillswap_posts;
CREATE POLICY "Users delete own posts" ON public.skillswap_posts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER skillswap_posts_updated BEFORE UPDATE ON public.skillswap_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 3. SKILLSWAP COLLABORATION REQUESTS
CREATE TABLE IF NOT EXISTS public.skillswap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.skillswap_posts(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skillswap_requests_post ON public.skillswap_requests(post_id);
CREATE INDEX IF NOT EXISTS idx_skillswap_requests_requester ON public.skillswap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_skillswap_requests_recipient ON public.skillswap_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_skillswap_requests_status ON public.skillswap_requests(status);

ALTER TABLE public.skillswap_requests ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skillswap_requests TO authenticated;
GRANT ALL ON public.skillswap_requests TO service_role;

DROP POLICY IF EXISTS "Participants view requests" ON public.skillswap_requests;
CREATE POLICY "Participants view requests" ON public.skillswap_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users create requests as requester" ON public.skillswap_requests;
CREATE POLICY "Users create requests as requester" ON public.skillswap_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id AND requester_id <> recipient_id);

DROP POLICY IF EXISTS "Participants update requests" ON public.skillswap_requests;
CREATE POLICY "Participants update requests" ON public.skillswap_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE OR REPLACE TRIGGER skillswap_requests_updated BEFORE UPDATE ON public.skillswap_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 4. SKILLSWAP CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.skillswap_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.skillswap_requests(id) ON DELETE CASCADE UNIQUE,
  participant1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skillswap_conv_p1 ON public.skillswap_conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_skillswap_conv_p2 ON public.skillswap_conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_skillswap_conv_request ON public.skillswap_conversations(request_id);

ALTER TABLE public.skillswap_conversations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.skillswap_conversations TO authenticated;
GRANT ALL ON public.skillswap_conversations TO service_role;

DROP POLICY IF EXISTS "Participants view conversations" ON public.skillswap_conversations;
CREATE POLICY "Participants view conversations" ON public.skillswap_conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

DROP POLICY IF EXISTS "Participants insert conversations" ON public.skillswap_conversations;
CREATE POLICY "Participants insert conversations" ON public.skillswap_conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE OR REPLACE TRIGGER skillswap_conv_updated BEFORE UPDATE ON public.skillswap_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 5. SKILLSWAP MESSAGES
CREATE TABLE IF NOT EXISTS public.skillswap_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.skillswap_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skillswap_messages_conv ON public.skillswap_messages(conversation_id, created_at ASC);

ALTER TABLE public.skillswap_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.skillswap_messages TO authenticated;
GRANT ALL ON public.skillswap_messages TO service_role;

DROP POLICY IF EXISTS "Participants view messages" ON public.skillswap_messages;
CREATE POLICY "Participants view messages" ON public.skillswap_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.skillswap_conversations c
      WHERE c.id = conversation_id
        AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Participants send messages" ON public.skillswap_messages;
CREATE POLICY "Participants send messages" ON public.skillswap_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.skillswap_conversations c
      WHERE c.id = conversation_id
        AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );
