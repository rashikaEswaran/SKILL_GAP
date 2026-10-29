# SkillSync AI · Skill Gap Analytics & Peer Learning Platform

AI- and Machine Learning-powered skill gap analytics, industry benchmark readiness evaluation, and personalized career roadmapping for college students.

---

## 🏗️ Project Architecture & Folder Structure

```
skillgapanalytics-main/
│
├── ai/                              # AI Services & Agentic Reasoning Engine
│   ├── __init__.py                  # AI package initialization
│   ├── config.py                    # Environment & AI configuration (Gemini/OpenAI)
│   ├── agent.py                     # Multi-step SkillSync AI Agent
│   ├── prompts.py                   # Structured prompts (Extraction, Gap Analysis, Roadmaps)
│   ├── resume_parser.py             # Multi-section document & syllabus parser
│   ├── llm_service.py               # Multi-provider LLM interface with resilient local fallback
│   └── router.py                    # FastAPI AI endpoints (/api/ai/*)
│
├── ml_models/                       # Machine Learning Models & Pipeline
│   ├── __init__.py                  # ML models package initialization
│   ├── skills_db.json               # Canonical taxonomy of roles, core/emerging skills, courses
│   ├── pipeline.py                  # End-to-end ML pipeline (Extract -> Classify -> Recommend)
│   ├── train.py                     # Model training & taxonomy calibration script
│   ├── requirements.txt             # Python dependencies for ML models
│   ├── skill_extractor/             # NLP & token-boundary skill extraction module
│   │   ├── __init__.py
│   │   └── extractor.py
│   ├── gap_classifier/              # Weighted readiness score & gap classification module
│   │   ├── __init__.py
│   │   └── classifier.py
│   └── recommendation/              # Phased roadmaps, project ideas & course matching
│       ├── __init__.py
│       └── engine.py
│
├── backend/                         # FastAPI Python Backend Server
│   ├── __init__.py
│   ├── main.py                      # FastAPI server with CORS & ML/AI route bindings
│   └── requirements.txt             # Backend dependencies
│
├── src/                             # Pure React.js (JavaScript / JSX) Frontend
│   ├── main.jsx                     # React 19 application entry point
│   ├── App.jsx                      # App root with QueryClientProvider & React Router
│   ├── routes.jsx                   # Standard React Router v7 routes
│   ├── styles.css                   # Tailwind CSS v4 styling & dark theme tokens
│   ├── pages/                       # 12 React Page Components (.jsx)
│   │   ├── LandingPage.jsx          # Public hero page & features overview
│   │   ├── AuthPage.jsx             # Sign-in, sign-up & one-click demo login
│   │   ├── DashboardPage.jsx        # Student analytics overview & radar charts
│   │   ├── AnalyzePage.jsx          # Resume / syllabus text upload & role benchmark form
│   │   ├── AnalysisDetailsPage.jsx  # Detailed analysis report, radar comparison & PDF export
│   │   ├── AnalysesHistoryPage.jsx  # Past analyses list with deletion
│   │   ├── ProfilePage.jsx          # Academic profile & student settings
│   │   ├── SkillSwapPage.jsx        # Peer skill exchange marketplace feed
│   │   ├── SkillSwapCreatePage.jsx  # Create new skill exchange / study group request
│   │   ├── SkillSwapPostDetailsPage.jsx # Post details & collaboration proposal modal
│   │   ├── SkillSwapMessagesPage.jsx# Direct messaging & collaboration chat
│   │   └── SkillSwapActivityPage.jsx# Incoming/sent proposals & user post management
│   ├── components/                  # Layout and UI Components
│   │   ├── layout/                  # AppSidebar.jsx, AppHeader.jsx, Layout.jsx
│   │   └── ui/                      # Button, Card, Badge, Dialog, Input, Label, Tabs, etc.
│   ├── services/                    # Frontend Services & Client Engines
│   │   ├── api.js                   # Unified ML/AI API bridge with client-side fallback
│   │   ├── mock-storage.js          # In-memory & localStorage store for standalone demo mode
│   │   ├── skillswap-service.js     # Peer exchange queries, requests, and messaging logic
│   │   └── supabase.js              # Supabase client with automatic fallback
│   ├── hooks/                       # Custom React hooks (use-auth.jsx, use-mobile.jsx)
│   └── lib/                         # Utilities (utils.js cn helper)
│
├── index.html                       # Standard Vite HTML entry point
├── vite.config.js                   # Vite configuration (React plugin + Tailwind CSS 4)
├── jsconfig.json                    # JavaScript path alias mapping (@/* -> src/*)
└── package.json                     # React dependencies (removed TypeScript)
```

---

## 🚀 Getting Started

### 1. Run the React.js Frontend
```bash
# Install dependencies
npm install

# Start Vite dev server (runs at http://localhost:5173)
npm run dev

# Or build for production
npm run build
```

### 2. Run the Python Machine Learning & AI Backend
```bash
# Install Python ML/AI requirements
pip install -r backend/requirements.txt

# Start FastAPI server on port 8000
npm run backend
# Or:
python -m uvicorn backend.main:app --reload --port 8000
```

### 3. Calibrate / Train the ML Models
```bash
npm run train:ml
# Or:
python -m ml_models.train
```

---

## ⚡ Highlights
- **100% JavaScript (React.js)**: Eliminated TypeScript overhead and complex SSR configuration.
- **Dedicated ML & AI Folders**: Modular architecture with Python NLP, scikit-learn compatibility, and Gemini / OpenAI integration.
- **Zero-Config Resilient Fallback**: The React application runs out-of-the-box in standalone mode even without Supabase credentials or the Python backend active.
