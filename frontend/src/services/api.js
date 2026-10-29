import { supabase } from "./supabase";

// Canonical role skill maps for client fallback
const ROLE_BENCHMARKS = {
  "Full Stack Developer": {
    core: ["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "PostgreSQL", "Docker", "System Design", "HTML", "CSS"],
    emerging: ["TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Redis", "CI/CD"],
    soft: ["Problem Solving", "Communication", "Teamwork"],
    marketDemand: 92,
  },
  "Data Scientist": {
    core: ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Data Analysis", "Statistics", "Scikit-Learn"],
    emerging: ["Deep Learning", "TensorFlow", "PyTorch", "NLP", "Generative AI"],
    soft: ["Critical Thinking", "Data Storytelling", "Communication"],
    marketDemand: 90,
  },
  "ML Engineer": {
    core: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Docker", "SQL", "Git", "Data Structures"],
    emerging: ["MLOps", "Kubeflow", "Vector Databases", "LangChain", "Model Serving"],
    soft: ["Systematic Debugging", "Research Mindset", "Communication"],
    marketDemand: 95,
  },
  "Backend Developer": {
    core: ["Python", "Node.js", "SQL", "PostgreSQL", "Docker", "REST APIs", "System Design", "Git", "Linux"],
    emerging: ["Go", "FastAPI", "Microservices", "Kafka", "Kubernetes", "AWS"],
    soft: ["Analytical Thinking", "Reliability", "Documentation"],
    marketDemand: 89,
  },
  "Frontend Developer": {
    core: ["JavaScript", "React", "HTML", "CSS", "Tailwind CSS", "Git", "REST APIs", "Responsive Design"],
    emerging: ["Next.js", "TypeScript", "Framer Motion", "GraphQL", "Web Vitals"],
    soft: ["UI/UX Empathy", "Attention to Detail", "Communication"],
    marketDemand: 87,
  },
  "DevOps Engineer": {
    core: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git", "Shell Scripting", "System Design"],
    emerging: ["Terraform", "Ansible", "Prometheus", "Grafana", "ArgoCD"],
    soft: ["Incident Management", "Resilience", "Collaboration"],
    marketDemand: 94,
  },
  "Cloud Engineer": {
    core: ["AWS", "Azure", "Docker", "Kubernetes", "Linux", "Python", "CI/CD", "System Design"],
    emerging: ["GCP", "Serverless", "Terraform", "Cost Optimization"],
    soft: ["Strategic Planning", "Communication", "Problem Solving"],
    marketDemand: 91,
  },
};

const COMMON_SKILLS = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "Go", "Rust", "SQL",
  "React", "Next.js", "Vue.js", "Angular", "HTML", "CSS", "Tailwind CSS",
  "Node.js", "Express", "FastAPI", "Django", "Flask", "REST APIs", "GraphQL",
  "PostgreSQL", "MySQL", "MongoDB", "Redis",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "Git", "CI/CD",
  "Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy",
  "TensorFlow", "PyTorch", "Scikit-Learn", "NLP", "Generative AI",
  "Data Structures", "Algorithms", "System Design",
  "Problem Solving", "Communication", "Teamwork", "Leadership"
];

export const SKILL_MATERIALS = {
  Docker: {
    skill: "Docker",
    summary: "Containerization platform to package apps into isolated environments.",
    documentation: "https://docs.docker.com/get-started/",
    course: { title: "Docker Mastery with Kubernetes & Swarm", provider: "Udemy", url: "https://www.udemy.com" },
    freeTutorial: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
    practiceProject: "Containerize a multi-container React + FastAPI + PostgreSQL application using docker-compose.",
    estimatedHours: 20,
    difficulty: "Intermediate",
  },
  "System Design": {
    skill: "System Design",
    summary: "Designing distributed, scalable, and fault-tolerant architectures.",
    documentation: "https://github.com/donnemartin/system-design-primer",
    course: { title: "Grokking Modern System Design Interview", provider: "Educative", url: "https://www.educative.io" },
    freeTutorial: "https://www.youtube.com/watch?v=m8Icp_Cid5o",
    practiceProject: "Design a distributed URL shortener (TinyURL) with Redis caching, rate limiting, and database sharding.",
    estimatedHours: 35,
    difficulty: "Advanced",
  },
  PostgreSQL: {
    skill: "PostgreSQL",
    summary: "Enterprise-grade relational database with ACID compliance, indexing, and JSON support.",
    documentation: "https://www.postgresql.org/docs/",
    course: { title: "The Complete SQL & PostgreSQL Bootcamp", provider: "Udemy", url: "https://www.udemy.com" },
    freeTutorial: "https://www.youtube.com/watch?v=qw--VYLpxG4",
    practiceProject: "Design an e-commerce schema with foreign keys, indexes, triggers, and query performance optimization.",
    estimatedHours: 15,
    difficulty: "Beginner-Intermediate",
  },
  "Node.js": {
    skill: "Node.js",
    summary: "High-performance JavaScript runtime for scalable backend servers.",
    documentation: "https://nodejs.org/en/docs",
    course: { title: "Complete Node.js Developer in 2026", provider: "Coursera", url: "https://www.coursera.org" },
    freeTutorial: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    practiceProject: "Build a REST API server with JWT authentication, rate limiting, and MongoDB/Postgres persistence.",
    estimatedHours: 25,
    difficulty: "Intermediate",
  },
  Kubernetes: {
    skill: "Kubernetes",
    summary: "Automated container deployment, scaling, and cluster management.",
    documentation: "https://kubernetes.io/docs/home/",
    course: { title: "Certified Kubernetes Administrator (CKA)", provider: "Udemy", url: "https://www.udemy.com" },
    freeTutorial: "https://www.youtube.com/watch?v=X48VuDVv0do",
    practiceProject: "Deploy a microservice cluster using Minikube with Ingress routing and auto-scaling pods.",
    estimatedHours: 30,
    difficulty: "Advanced",
  },
  AWS: {
    skill: "AWS",
    summary: "Amazon Web Services cloud platform (EC2, S3, RDS, Lambda, IAM).",
    documentation: "https://docs.aws.amazon.com/",
    course: { title: "AWS Certified Solutions Architect Associate", provider: "Coursera / A Cloud Guru", url: "https://www.coursera.org" },
    freeTutorial: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    practiceProject: "Host a serverless web app using AWS S3, CloudFront, Lambda, and DynamoDB.",
    estimatedHours: 40,
    difficulty: "Intermediate-Advanced",
  },
  "Machine Learning": {
    skill: "Machine Learning",
    summary: "Predictive modeling with Supervised, Unsupervised algorithms and Scikit-Learn.",
    documentation: "https://scikit-learn.org/stable/",
    course: { title: "Machine Learning Specialization", provider: "Coursera (DeepLearning.AI)", url: "https://www.coursera.org" },
    freeTutorial: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
    practiceProject: "Train a Random Forest classifier on tabular data to predict loan default with cross-validation.",
    estimatedHours: 45,
    difficulty: "Intermediate",
  },
  "Deep Learning": {
    skill: "Deep Learning",
    summary: "Neural networks, backpropagation, CNNs, RNNs, and Transformers.",
    documentation: "https://pytorch.org/docs/stable/index.html",
    course: { title: "Deep Learning Specialization", provider: "Coursera (Andrew Ng)", url: "https://www.coursera.org" },
    freeTutorial: "https://www.youtube.com/watch?v=aircAruvnKk",
    practiceProject: "Implement an image classification model in PyTorch using transfer learning with ResNet.",
    estimatedHours: 50,
    difficulty: "Advanced",
  },
  "Data Structures": {
    skill: "Data Structures",
    summary: "Arrays, Trees, Graphs, Hash Maps, and Heaps essential for engineering interviews.",
    documentation: "https://leetcode.com/explore/",
    course: { title: "Data Structures & Algorithms in Python", provider: "NeetCode / Coursera", url: "https://neetcode.io" },
    freeTutorial: "https://www.youtube.com/watch?v=pkYVOmU3MgA",
    practiceProject: "Solve the NeetCode Blind 75 questions with optimal time and space complexity.",
    estimatedHours: 60,
    difficulty: "Intermediate",
  },
  "CI/CD": {
    skill: "CI/CD",
    summary: "Continuous integration and deployment automation using GitHub Actions.",
    documentation: "https://docs.github.com/en/actions",
    course: { title: "GitHub Actions: The Complete Guide", provider: "Udemy", url: "https://www.udemy.com" },
    freeTutorial: "https://www.youtube.com/watch?v=R8_veQiYBjI",
    practiceProject: "Set up a CI/CD workflow that tests code, builds Docker images, and deploys to a cloud server.",
    estimatedHours: 15,
    difficulty: "Beginner-Intermediate",
  },
  FastAPI: {
    skill: "FastAPI",
    summary: "Modern, asynchronous web framework for Python APIs with automatic Swagger docs.",
    documentation: "https://fastapi.tiangolo.com/",
    course: { title: "FastAPI - Modern Python Web Development", provider: "Udemy", url: "https://www.udemy.com" },
    freeTutorial: "https://www.youtube.com/watch?v=-ykeT6kk4bk",
    practiceProject: "Build an ML inference microservice that serves scikit-learn models over REST endpoints.",
    estimatedHours: 18,
    difficulty: "Intermediate",
  },
  React: {
    skill: "React",
    summary: "Component-based UI library with hooks, state management, and virtual DOM.",
    documentation: "https://react.dev/",
    course: { title: "The Ultimate React Course", provider: "Udemy", url: "https://www.udemy.com" },
    freeTutorial: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    practiceProject: "Create a rich dashboard with interactive charts, dark mode, and real-time state sync.",
    estimatedHours: 30,
    difficulty: "Beginner-Intermediate",
  },
  Python: {
    skill: "Python",
    summary: "Core Python programming, OOP, data manipulation, and libraries.",
    documentation: "https://docs.python.org/3/",
    course: { title: "Python for Everybody Specialization", provider: "Coursera (Univ. of Michigan)", url: "https://www.coursera.org" },
    freeTutorial: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    practiceProject: "Build an automated web scraper and data parser using BeautifulSoup and requests.",
    estimatedHours: 25,
    difficulty: "Beginner",
  },
};

export function resolveStudyMaterials(missingSkills) {
  return (missingSkills || []).map((skill) => {
    const key = Object.keys(SKILL_MATERIALS).find(
      (k) => k.toLowerCase() === skill.toLowerCase()
    );
    if (key && SKILL_MATERIALS[key]) {
      return { ...SKILL_MATERIALS[key], skill };
    }
    return {
      skill,
      summary: `Core competence in ${skill} is vital for production systems and technical placement interviews.`,
      documentation: `https://devdocs.io/#q=${encodeURIComponent(skill)}`,
      course: {
        title: `Comprehensive ${skill} Masterclass & Hands-on Lab`,
        provider: "Coursera / Udemy",
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      },
      freeTutorial: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+tutorial+full+course`,
      practiceProject: `Build a production-grade portfolio project highlighting ${skill} integration.`,
      estimatedHours: 20,
      difficulty: "Intermediate",
    };
  });
}

/**
 * Local client-side fallback ML analyzer
 */
function runClientMLAnalysis(inputText, targetRole, title) {
  const lowerText = inputText.toLowerCase();
  const extracted = [];

  COMMON_SKILLS.forEach((skill) => {
    const pattern = new RegExp(`(?<![a-zA-Z0-9])${skill.toLowerCase().replace(/[\+]/g, "\\+")}(?![a-zA-Z0-9])`, "i");
    if (pattern.test(lowerText)) {
      extracted.push(skill);
    }
  });

  const benchmark = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS["Full Stack Developer"];
  const extractedLower = new Set(extracted.map((s) => s.toLowerCase()));

  const matchedCore = benchmark.core.filter((s) => extractedLower.has(s.toLowerCase()));
  const missingCore = benchmark.core.filter((s) => !extractedLower.has(s.toLowerCase()));
  const matchedEmerging = benchmark.emerging.filter((s) => extractedLower.has(s.toLowerCase()));
  const missingEmerging = benchmark.emerging.filter((s) => !extractedLower.has(s.toLowerCase()));
  const matchedSoft = benchmark.soft.filter((s) => extractedLower.has(s.toLowerCase()));

  const coreRatio = matchedCore.length / Math.max(benchmark.core.length, 1);
  const emergingRatio = matchedEmerging.length / Math.max(benchmark.emerging.length, 1);
  const readinessScore = Math.min(Math.max(Math.round(coreRatio * 75 + emergingRatio * 20 + 5), 10), 96);
  const allMissing = [...missingCore, ...missingEmerging];

  const courses = [
    ...missingCore.slice(0, 3).map((s) => ({
      skill: s,
      title: `Mastering ${s}: From Fundamentals to Production`,
      provider: "Coursera / Udemy",
      level: "Intermediate",
    })),
    ...missingEmerging.slice(0, 2).map((s) => ({
      skill: s,
      title: `Advanced ${s} Hands-on Workshop`,
      provider: "Udemy / edX",
      level: "Intermediate to Advanced",
    })),
  ];

  const recommendations = [
    ...missingCore.slice(0, 2).map((s) => ({
      title: `Master ${s} Fundamentals`,
      description: `Essential core requirement for ${targetRole}. Focus on real-world projects and design patterns.`,
      priority: "high",
    })),
    ...missingEmerging.slice(0, 2).map((s) => ({
      title: `Build Hands-on Portfolio with ${s}`,
      description: `Trending industry skill that significantly boosts your interview shortlisting rate.`,
      priority: "medium",
    })),
  ];

  const studyMaterials = resolveStudyMaterials(allMissing);

  return {
    title: title || `${targetRole} Skill Gap Analysis`,
    target_role: targetRole,
    input_text: inputText,
    extracted_skills: extracted,
    matched_skills: [...matchedCore, ...matchedEmerging, ...matchedSoft],
    missing_skills: allMissing,
    gap_score: Math.max(100 - readinessScore, 10),
    industry_match: Math.round(coreRatio * 100),
    readiness_score: readinessScore,
    recommendations,
    courses,
    study_materials: studyMaterials,
    created_at: new Date().toISOString(),
  };
}

/**
 * Perform analysis calling backend FastAPI (or automatic client ML fallback)
 */
export async function performSkillAnalysis({ inputText, targetRole, title }) {
  let analysisResult = null;

  // 1. Try calling the Python FastAPI ML backend
  try {
    const res = await fetch("/api/ml/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText, targetRole, title }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const missingSkills = [...d.missing_core, ...d.missing_emerging];
        analysisResult = {
          title: d.title,
          target_role: d.target_role,
          input_text: inputText,
          extracted_skills: d.extracted_skills.map((s) => s.skill || s),
          matched_skills: d.matched_skills,
          missing_skills: missingSkills,
          gap_score: Math.max(100 - d.readiness_score, 10),
          industry_match: d.stats.core_match_percent,
          readiness_score: d.readiness_score,
          recommendations: d.missing_core.slice(0, 3).map((s) => ({
            title: `Master ${s} Implementation`,
            description: `Core requirement for ${d.target_role}. Build a hands-on project.`,
            priority: "high",
          })),
          courses: d.recommendations.recommended_courses.map((c) => ({
            skill: c.skill,
            title: c.course_name,
            provider: c.provider,
            level: c.level,
            url: c.url,
          })),
          study_materials: d.study_materials || d.recommendations?.study_materials || resolveStudyMaterials(missingSkills),
          created_at: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.info("Python backend offline or unreachable, utilizing client ML engine fallback:", err);
  }

  // 2. If backend didn't return data, run local ML fallback
  if (!analysisResult) {
    analysisResult = runClientMLAnalysis(inputText, targetRole, title);
  }

  // 3. Persist record to database / local store
  let userId = "00000000-0000-0000-0000-000000000001";
  try {
    const { data: u } = await supabase.auth.getUser();
    if (u?.user?.id) userId = u.user.id;
  } catch {}

  let insertedId = null;
  try {
    const { data: inserted, error } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        ...analysisResult,
      })
      .select("id")
      .single();

    if (!error && inserted?.id) {
      insertedId = inserted.id;
    }
  } catch (err) {
    console.warn("Supabase analyses insert warning:", err);
  }

  const recordId = insertedId || `a_${Date.now()}`;
  const fullRecord = {
    id: recordId,
    user_id: userId,
    created_at: new Date().toISOString(),
    ...analysisResult,
  };

  try {
    const existing = JSON.parse(localStorage.getItem("skillsync_local_analyses") || "[]");
    localStorage.setItem("skillsync_local_analyses", JSON.stringify([fullRecord, ...existing]));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  return fullRecord;
}

