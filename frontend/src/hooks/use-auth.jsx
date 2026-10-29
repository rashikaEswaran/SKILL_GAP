import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const demo = localStorage.getItem("skillsync_demo_user");
      return demo ? JSON.parse(demo) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        try { localStorage.removeItem("skillsync_demo_user"); } catch {}
        setUser(session.user);
      } else {
        const demo = localStorage.getItem("skillsync_demo_user");
        setUser(demo ? JSON.parse(demo) : null);
      }
    });

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else {
        const demo = localStorage.getItem("skillsync_demo_user");
        if (demo) setUser(JSON.parse(demo));
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}

