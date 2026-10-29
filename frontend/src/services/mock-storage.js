// Mock in-memory & localStorage store for standalone demo mode

export const DEFAULT_INDUSTRY_SKILLS = [
  { id: "1", name: "Python", category: "Programming", demand_score: 95, growth_rate: 12.5, description: "General-purpose programming language" },
  { id: "2", name: "JavaScript", category: "Programming", demand_score: 93, growth_rate: 8.2, description: "Web programming language" },
  { id: "3", name: "TypeScript", category: "Programming", demand_score: 88, growth_rate: 18.4, description: "Typed JavaScript superset" },
  { id: "4", name: "React", category: "Frontend", demand_score: 90, growth_rate: 14.0, description: "UI library" },
  { id: "5", name: "Node.js", category: "Backend", demand_score: 85, growth_rate: 9.5, description: "JavaScript runtime" },
  { id: "6", name: "SQL", category: "Database", demand_score: 92, growth_rate: 5.0, description: "Relational query language" },
  { id: "7", name: "PostgreSQL", category: "Database", demand_score: 80, growth_rate: 11.0, description: "Open-source relational DB" },
  { id: "8", name: "MongoDB", category: "Database", demand_score: 72, growth_rate: 7.0, description: "NoSQL document DB" },
  { id: "9", name: "Docker", category: "DevOps", demand_score: 86, growth_rate: 13.0, description: "Containerization" },
  { id: "10", name: "Kubernetes", category: "DevOps", demand_score: 78, growth_rate: 17.5, description: "Container orchestration" },
  { id: "11", name: "AWS", category: "Cloud", demand_score: 91, growth_rate: 15.0, description: "Amazon cloud platform" },
  { id: "12", name: "Azure", category: "Cloud", demand_score: 80, growth_rate: 14.0, description: "Microsoft cloud platform" },
  { id: "13", name: "Git", category: "Tools", demand_score: 95, growth_rate: 3.0, description: "Version control" },
  { id: "14", name: "Machine Learning", category: "AI", demand_score: 89, growth_rate: 22.0, description: "ML algorithms and modeling" },
  { id: "15", name: "Deep Learning", category: "AI", demand_score: 82, growth_rate: 25.0, description: "Neural networks" },
  { id: "16", name: "TensorFlow", category: "AI", demand_score: 75, growth_rate: 12.0, description: "ML framework" },
  { id: "17", name: "PyTorch", category: "AI", demand_score: 78, growth_rate: 19.0, description: "ML framework" },
  { id: "18", name: "Data Analysis", category: "Data", demand_score: 85, growth_rate: 11.0, description: "Analytical reasoning with data" },
  { id: "19", name: "Pandas", category: "Data", demand_score: 78, growth_rate: 9.0, description: "Python data analysis library" },
  { id: "20", name: "NumPy", category: "Data", demand_score: 75, growth_rate: 6.0, description: "Numerical computing" },
  { id: "21", name: "Java", category: "Programming", demand_score: 82, growth_rate: 2.0, description: "OOP language" },
  { id: "22", name: "C++", category: "Programming", demand_score: 70, growth_rate: 1.5, description: "Systems programming" },
  { id: "23", name: "Go", category: "Programming", demand_score: 68, growth_rate: 16.0, description: "Concurrent backend language" },
  { id: "24", name: "Rust", category: "Programming", demand_score: 60, growth_rate: 24.0, description: "Systems programming" },
  { id: "25", name: "GraphQL", category: "API", demand_score: 70, growth_rate: 13.0, description: "API query language" },
  { id: "26", name: "REST APIs", category: "API", demand_score: 88, growth_rate: 4.0, description: "HTTP API style" },
  { id: "27", name: "System Design", category: "Engineering", demand_score: 87, growth_rate: 10.0, description: "Designing large-scale systems" },
  { id: "28", name: "Data Structures", category: "CS Fundamentals", demand_score: 95, growth_rate: 2.0, description: "Core CS knowledge" },
  { id: "29", name: "Algorithms", category: "CS Fundamentals", demand_score: 95, growth_rate: 2.0, description: "Core CS knowledge" },
  { id: "30", name: "Communication", category: "Soft Skills", demand_score: 90, growth_rate: 4.0, description: "Verbal and written communication" },
  { id: "31", name: "Problem Solving", category: "Soft Skills", demand_score: 93, growth_rate: 4.0, description: "Analytical thinking" },
  { id: "32", name: "Teamwork", category: "Soft Skills", demand_score: 88, growth_rate: 3.0, description: "Collaboration" },
  { id: "33", name: "Leadership", category: "Soft Skills", demand_score: 75, growth_rate: 5.0, description: "Leading teams and initiatives" },
  { id: "34", name: "Linux", category: "Tools", demand_score: 80, growth_rate: 4.0, description: "Operating system" },
  { id: "35", name: "CI/CD", category: "DevOps", demand_score: 82, growth_rate: 11.0, description: "Continuous integration/deployment" },
  { id: "36", name: "Tailwind CSS", category: "Frontend", demand_score: 78, growth_rate: 22.0, description: "Utility-first CSS" },
  { id: "37", name: "Next.js", category: "Frontend", demand_score: 82, growth_rate: 20.0, description: "React framework" },
  { id: "38", name: "FastAPI", category: "Backend", demand_score: 70, growth_rate: 25.0, description: "Python web framework" },
  { id: "39", name: "Spring Boot", category: "Backend", demand_score: 75, growth_rate: 5.0, description: "Java framework" },
  { id: "40", name: "Cybersecurity", category: "Security", demand_score: 88, growth_rate: 18.0, description: "Security practices and tools" },
];

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export const DEMO_USER = {
  id: DEMO_USER_ID,
  email: "demo@skillsync.edu",
  app_metadata: {},
  user_metadata: { full_name: "Demo Student" },
  aud: "authenticated",
  created_at: new Date("2026-01-01").toISOString(),
};

export const INITIAL_ANALYSES = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    user_id: DEMO_USER_ID,
    title: "Full Stack Placement Readiness",
    target_role: "Full Stack Developer",
    input_text: "Skills: JavaScript, React, HTML, CSS, Git, REST APIs, Basic SQL.",
    extracted_skills: ["JavaScript", "React", "Git", "REST APIs", "SQL"],
    matched_skills: ["JavaScript", "React", "SQL", "Git", "REST APIs"],
    missing_skills: ["Node.js", "PostgreSQL", "Docker", "System Design"],
    gap_score: 40,
    industry_match: 60,
    readiness_score: 72,
    recommendations: [
      { title: "Master Docker containerization", description: "Containerize your React and backend applications to match industry standards.", priority: "high" },
      { title: "Deepen System Design fundamentals", description: "Learn caching, load balancing, and microservices architecture.", priority: "high" },
      { title: "Build PostgreSQL relational schema", description: "Move beyond simple queries to indexing, transactions, and ORMs.", priority: "medium" },
      { title: "Write automated CI/CD pipeline", description: "Set up GitHub Actions to run tests and deploy automatically.", priority: "medium" },
    ],
    courses: [
      { skill: "Docker", title: "Docker Mastery with Kubernetes", provider: "Udemy", level: "Beginner to Intermediate" },
      { skill: "Node.js", title: "Complete Node.js Developer in 2026", provider: "Coursera", level: "Intermediate" },
      { skill: "PostgreSQL", title: "The Complete SQL Bootcamp", provider: "Udemy", level: "Beginner" },
      { skill: "System Design", title: "Grokking the System Design Interview", provider: "edX", level: "Advanced" },
    ],
    study_materials: [
      {
        skill: "Docker",
        summary: "Containerization platform to package apps into isolated environments.",
        documentation: "https://docs.docker.com/get-started/",
        course: { title: "Docker Mastery with Kubernetes & Swarm", provider: "Udemy", url: "https://www.udemy.com" },
        freeTutorial: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
        practiceProject: "Containerize a multi-container React + FastAPI + PostgreSQL application using docker-compose.",
        estimatedHours: 20,
        difficulty: "Intermediate",
      },
      {
        skill: "System Design",
        summary: "Designing distributed, scalable, and fault-tolerant architectures.",
        documentation: "https://github.com/donnemartin/system-design-primer",
        course: { title: "Grokking Modern System Design Interview", provider: "Educative", url: "https://www.educative.io" },
        freeTutorial: "https://www.youtube.com/watch?v=m8Icp_Cid5o",
        practiceProject: "Design a distributed URL shortener (TinyURL) with Redis caching, rate limiting, and database sharding.",
        estimatedHours: 35,
        difficulty: "Advanced",
      },
      {
        skill: "PostgreSQL",
        summary: "Enterprise-grade relational database with ACID compliance, indexing, and JSON support.",
        documentation: "https://www.postgresql.org/docs/",
        course: { title: "The Complete SQL & PostgreSQL Bootcamp", provider: "Udemy", url: "https://www.udemy.com" },
        freeTutorial: "https://www.youtube.com/watch?v=qw--VYLpxG4",
        practiceProject: "Design an e-commerce schema with foreign keys, indexes, triggers, and query performance optimization.",
        estimatedHours: 15,
        difficulty: "Beginner-Intermediate",
      },
      {
        skill: "Node.js",
        summary: "High-performance JavaScript runtime for scalable backend servers.",
        documentation: "https://nodejs.org/en/docs",
        course: { title: "Complete Node.js Developer in 2026", provider: "Coursera", url: "https://www.coursera.org" },
        freeTutorial: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        practiceProject: "Build a REST API server with JWT authentication, rate limiting, and MongoDB/Postgres persistence.",
        estimatedHours: 25,
        difficulty: "Intermediate",
      },
    ],
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    user_id: DEMO_USER_ID,
    title: "Data Science Internship Prep",
    target_role: "Data Scientist",
    input_text: "Skills: Python, Pandas, NumPy, SQL, Data Analysis, Machine Learning.",
    extracted_skills: ["Python", "SQL", "Pandas", "NumPy", "Data Analysis", "Machine Learning"],
    matched_skills: ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Data Analysis"],
    missing_skills: ["Deep Learning", "TensorFlow", "PyTorch", "Communication"],
    gap_score: 40,
    industry_match: 60,
    readiness_score: 75,
    recommendations: [
      { title: "Build Deep Learning projects in PyTorch", description: "Implement neural networks for computer vision or NLP tasks.", priority: "high" },
      { title: "Deploy an ML model via API", description: "Wrap your trained model with FastAPI or Flask inside a Docker container.", priority: "high" },
      { title: "Practice presentation & business communication", description: "Data scientists must communicate analytical insights to non-technical stakeholders.", priority: "medium" },
    ],
    courses: [
      { skill: "Deep Learning", title: "Deep Learning Specialization", provider: "Coursera", level: "Intermediate" },
      { skill: "PyTorch", title: "PyTorch for Deep Learning Bootcamp", provider: "Udemy", level: "Intermediate" },
      { skill: "TensorFlow", title: "TensorFlow Developer Certificate", provider: "Coursera", level: "Intermediate" },
      { skill: "Communication", title: "Storytelling with Data", provider: "edX", level: "Beginner" },
    ],
    study_materials: [
      {
        skill: "Deep Learning",
        summary: "Neural networks, backpropagation, CNNs, RNNs, and Transformers.",
        documentation: "https://pytorch.org/docs/stable/index.html",
        course: { title: "Deep Learning Specialization", provider: "Coursera (Andrew Ng)", url: "https://www.coursera.org" },
        freeTutorial: "https://www.youtube.com/watch?v=aircAruvnKk",
        practiceProject: "Implement an image classification model in PyTorch using transfer learning with ResNet.",
        estimatedHours: 50,
        difficulty: "Advanced",
      },
      {
        skill: "TensorFlow",
        summary: "End-to-end open source platform for machine learning and deep learning pipelines.",
        documentation: "https://www.tensorflow.org/learn",
        course: { title: "DeepLearning.AI TensorFlow Developer Professional Certificate", provider: "Coursera", url: "https://www.coursera.org" },
        freeTutorial: "https://www.youtube.com/watch?v=tpCFfeUEGs8",
        practiceProject: "Train and export a SavedModel object detection network for edge deployment.",
        estimatedHours: 40,
        difficulty: "Intermediate",
      },
      {
        skill: "PyTorch",
        summary: "Leading research & production deep learning framework with dynamic computation graphs.",
        documentation: "https://pytorch.org/tutorials/",
        course: { title: "PyTorch for Deep Learning Bootcamp", provider: "Udemy", url: "https://www.udemy.com" },
        freeTutorial: "https://www.youtube.com/watch?v=V_xro1bcAuA",
        practiceProject: "Build an attention-based Transformer model for sentiment classification.",
        estimatedHours: 45,
        difficulty: "Intermediate-Advanced",
      },
    ],
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_SKILLSWAP_POSTS = [
  {
    id: "s0000000-0000-0000-0000-000000000001",
    user_id: DEMO_USER_ID,
    title: "Looking to teach React & learn Docker",
    description: "I have 2 years of experience building React apps. Looking for someone strong in Docker & DevOps to pair up with!",
    post_type: "Skill Exchange",
    skill_level: "Intermediate",
    skills_to_teach: ["React", "JavaScript", "Tailwind CSS"],
    skills_to_learn: ["Docker", "Kubernetes", "DevOps"],
    availability: "Weekends & Evenings",
    preferred_collaboration: "Discord / Google Meet",
    status: "active",
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    author: {
      id: DEMO_USER_ID,
      full_name: "Demo Student",
      avatar_url: null,
      college: "Tech University",
      department: "Computer Science",
    },
  },
  {
    id: "s0000000-0000-0000-0000-000000000002",
    user_id: "00000000-0000-0000-0000-000000000002",
    title: "Python & Machine Learning Study Group",
    description: "Forming a study group to work through Kaggle competitions and open-source ML projects. Beginners and intermediates welcome!",
    post_type: "Study Group",
    skill_level: "Intermediate",
    skills_to_teach: ["Python", "Pandas", "Scikit-Learn"],
    skills_to_learn: ["PyTorch", "NLP", "Computer Vision"],
    availability: "Tue & Thu 6-8 PM",
    preferred_collaboration: "GitHub + Slack",
    status: "active",
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    author: {
      id: "00000000-0000-0000-0000-000000000002",
      full_name: "Sarah Chen",
      avatar_url: null,
      college: "Engineering Institute",
      department: "Data Science",
    },
  },
];

class MockDatabase {
  constructor() {
    this.tables = {
      industry_skills: [...DEFAULT_INDUSTRY_SKILLS],
      analyses: [...INITIAL_ANALYSES],
      skillswap_posts: [...INITIAL_SKILLSWAP_POSTS],
      skillswap_requests: [],
      skillswap_messages: [],
      profiles: [
        {
          id: DEMO_USER_ID,
          email: "demo@skillsync.edu",
          full_name: "Demo Student",
          college: "Tech University",
          department: "Computer Science",
          academic_year: "3rd Year",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };
  }

  getBrowserStorage(table) {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const item = window.localStorage.getItem(`skillsync_mock_${table}`);
        if (item) return JSON.parse(item);
      } catch (e) {
        // ignore
      }
    }
    return null;
  }

  saveBrowserStorage(table, data) {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(`skillsync_mock_${table}`, JSON.stringify(data));
      } catch (e) {
        // ignore
      }
    }
  }

  getTable(table) {
    const fromStorage = this.getBrowserStorage(table);
    if (fromStorage) {
      this.tables[table] = fromStorage;
      return fromStorage;
    }
    return this.tables[table] || [];
  }

  setTable(table, data) {
    this.tables[table] = data;
    this.saveBrowserStorage(table, data);
  }

  query(table) {
    let rows = [...this.getTable(table)];
    let filterFn = null;
    let sortFn = null;
    let limitNum = null;
    let isSingle = false;

    const builder = {
      select: () => builder,
      eq: (col, val) => {
        const prev = filterFn;
        filterFn = (r) => (prev ? prev(r) : true) && r[col] === val;
        return builder;
      },
      neq: (col, val) => {
        const prev = filterFn;
        filterFn = (r) => (prev ? prev(r) : true) && r[col] !== val;
        return builder;
      },
      in: (col, vals) => {
        const prev = filterFn;
        filterFn = (r) => (prev ? prev(r) : true) && vals.includes(r[col]);
        return builder;
      },
      or: (conditionStr) => {
        const prev = filterFn;
        const parts = conditionStr.split(",").map((s) => s.trim());
        filterFn = (r) => {
          const matchedOr = parts.some((part) => {
            const [c, op, v] = part.split(".");
            if (op === "eq") return String(r[c]) === String(v);
            return true;
          });
          return (prev ? prev(r) : true) && matchedOr;
        };
        return builder;
      },
      order: (col, opts) => {
        const asc = opts?.ascending !== false;
        sortFn = (a, b) => {
          const valA = a[col];
          const valB = b[col];
          if (valA < valB) return asc ? -1 : 1;
          if (valA > valB) return asc ? 1 : -1;
          return 0;
        };
        return builder;
      },
      limit: (num) => {
        limitNum = num;
        return builder;
      },
      single: async () => {
        isSingle = true;
        const res = await new Promise((resolve) => builder.then(resolve));
        const item = Array.isArray(res.data) ? res.data[0] ?? null : res.data ?? null;
        if (!item) return { data: null, error: new Error("Row not found") };
        return { data: item, error: null };
      },
      maybeSingle: async () => {
        isSingle = true;
        const res = await new Promise((resolve) => builder.then(resolve));
        const item = Array.isArray(res.data) ? res.data[0] ?? null : res.data ?? null;
        return { data: item, error: null };
      },
      insert: (record) => {
        const current = this.getTable(table);
        const records = Array.isArray(record) ? record : [record];
        const newRows = records.map((r) => ({
          id: r.id || `${table[0]}${Math.random().toString(36).substring(2, 11)}`,
          created_at: r.created_at || new Date().toISOString(),
          ...r,
        }));
        this.setTable(table, [...newRows, ...current]);
        return {
          select: () => ({
            single: async () => ({ data: newRows[0], error: null }),
            then: (resolve) => resolve({ data: newRows, error: null }),
          }),
          then: (resolve) => resolve({ data: newRows, error: null }),
        };
      },
      upsert: (record) => {
        const current = this.getTable(table);
        const index = current.findIndex((r) => r.id === record.id);
        if (index >= 0) {
          current[index] = { ...current[index], ...record, updated_at: new Date().toISOString() };
        } else {
          current.unshift({
            id: record.id || `${table[0]}${Math.random().toString(36).substring(2, 11)}`,
            created_at: new Date().toISOString(),
            ...record,
          });
        }
        this.setTable(table, [...current]);
        return {
          then: (resolve) => resolve({ data: record, error: null }),
        };
      },
      update: (updates) => {
        return {
          eq: (col, val) => {
            const current = this.getTable(table);
            const updated = current.map((r) => (r[col] === val ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
            this.setTable(table, updated);
            return {
              then: (resolve) => resolve({ data: updated.filter((r) => r[col] === val), error: null }),
            };
          },
        };
      },
      delete: () => {
        return {
          eq: (col, val) => {
            const current = this.getTable(table);
            const remaining = current.filter((r) => r[col] !== val);
            this.setTable(table, remaining);
            return {
              then: (resolve) => resolve({ data: null, error: null }),
            };
          },
        };
      },
      then: (resolve) => {
        let result = rows;
        if (filterFn) result = result.filter(filterFn);
        if (sortFn) result = result.sort(sortFn);
        if (limitNum !== null) result = result.slice(0, limitNum);
        return resolve({ data: isSingle ? (result[0] ?? null) : result, error: null });
      },
    };

    return builder;
  }
}

export const mockDb = new MockDatabase();

export function createMockSupabaseClient() {
  const listeners = [];

  let currentUser = null;
  if (typeof window !== "undefined" && window.localStorage) {
    const isExplicitlySignedOut = window.localStorage.getItem("skillsync_auth_signed_out") === "true";
    const saved = window.localStorage.getItem("skillsync_auth_user");
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
      } catch (e) {
        currentUser = null;
      }
    } else if (!isExplicitlySignedOut) {
      currentUser = DEMO_USER;
      try {
        window.localStorage.setItem("skillsync_auth_user", JSON.stringify(DEMO_USER));
      } catch (e) {}
    }
  } else {
    currentUser = DEMO_USER;
  }

  const client = {
    auth: {
      getUser: async () => ({ data: { user: currentUser }, error: null }),
      getSession: async () => ({
        data: {
          session: currentUser
            ? {
                access_token: "demo-jwt-token",
                token_type: "bearer",
                expires_in: 3600,
                refresh_token: "demo-refresh-token",
                user: currentUser,
              }
            : null,
        },
        error: null,
      }),
      signInWithPassword: async ({ email, password }) => {
        const isDemo = !email || email === "demo@skillsync.edu";
        const profiles = mockDb.getTable("profiles");
        const existingProfile = profiles.find((p) => p.email?.toLowerCase() === email?.toLowerCase());
        const userId = isDemo ? DEMO_USER_ID : existingProfile?.id || `u_${Math.random().toString(36).substring(2, 10)}`;
        const fullName = existingProfile?.full_name || email?.split("@")[0] || "Demo Student";

        currentUser = {
          id: userId,
          email: email || "demo@skillsync.edu",
          user_metadata: { full_name: fullName },
        };
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("skillsync_auth_user", JSON.stringify(currentUser));
          window.localStorage.removeItem("skillsync_auth_signed_out");
        }
        listeners.forEach((l) => l("SIGNED_IN", { user: currentUser, access_token: "demo-jwt-token" }));
        return { data: { user: currentUser, session: { access_token: "demo-jwt-token" } }, error: null };
      },
      signUp: async ({ email, options }) => {
        const isDemo = email === "demo@skillsync.edu";
        const newId = isDemo ? DEMO_USER_ID : `u_${Math.random().toString(36).substring(2, 10)}`;
        const fullName = options?.data?.full_name || email.split("@")[0] || "Student";

        currentUser = {
          id: newId,
          email: email || "demo@skillsync.edu",
          user_metadata: { full_name: fullName },
        };

        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("skillsync_auth_user", JSON.stringify(currentUser));
          window.localStorage.removeItem("skillsync_auth_signed_out");
        }

        // Ensure newly registered user has a profile record
        const profiles = mockDb.getTable("profiles");
        const existing = profiles.find((p) => p.id === newId || p.email === email);
        if (!existing) {
          const newProfile = {
            id: newId,
            email,
            full_name: fullName,
            college: "Tech University",
            department: "Computer Science",
            academic_year: "Final Year",
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockDb.setTable("profiles", [newProfile, ...profiles]);
        }

        listeners.forEach((l) => l("SIGNED_IN", { user: currentUser, access_token: "demo-jwt-token" }));
        return { data: { user: currentUser, session: { access_token: "demo-jwt-token" } }, error: null };
      },
      signOut: async () => {
        currentUser = null;
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem("skillsync_auth_user");
          window.localStorage.setItem("skillsync_auth_signed_out", "true");
        }
        listeners.forEach((l) => l("SIGNED_OUT", null));
        return { error: null };
      },
      onAuthStateChange: (cb) => {
        listeners.push(cb);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const idx = listeners.indexOf(cb);
                if (idx >= 0) listeners.splice(idx, 1);
              },
            },
          },
        };
      },
      getClaims: async () => ({
        data: { claims: { sub: currentUser?.id || DEMO_USER_ID, email: currentUser?.email || "demo@skillsync.edu" } },
        error: null,
      }),
    },
    from: (table) => mockDb.query(table),
  };

  return client;
}
