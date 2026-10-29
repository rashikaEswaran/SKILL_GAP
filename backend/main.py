import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml_models.pipeline import SkillGapMLPipeline
from ai.router import router as ai_router
from backend.database import init_mysql
from backend.db_router import router as db_router

app = FastAPI(
    title="SkillSync AI & ML Backend API",
    description="Intelligent Skill Gap Analytics, Machine Learning Models, and Career Roadmapping Engine with MySQL persistence",
    version="2.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register AI and MySQL DB routers
app.include_router(ai_router)
app.include_router(db_router)

@app.on_event("startup")
def on_startup():
    print("[Startup] Initializing MySQL connection and tables...")
    init_mysql()

ml_pipeline = SkillGapMLPipeline()

class MLAnalyzeRequest(BaseModel):
    inputText: str = Field(..., min_length=10, max_length=50000, description="Resume or syllabus text")
    targetRole: str = Field(default="Full Stack Developer", description="Target job title")
    title: Optional[str] = Field(default="Skill Gap Analysis", description="Analysis report title")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillSync ML & AI API",
        "version": "2.0.0",
        "models_loaded": True
    }

@app.get("/api/ml/taxonomy")
def get_taxonomy():
    """Returns canonical skills and target roles taxonomy."""
    return {
        "roles": ml_pipeline.extractor.skills_db.get("roles", {}),
        "skill_taxonomy": ml_pipeline.extractor.skills_db.get("skill_taxonomy", {})
    }

@app.post("/api/ml/analyze")
def run_ml_analysis(request: MLAnalyzeRequest):
    """
    Runs the full Machine Learning pipeline:
    1. Skill Extraction
    2. Role Gap Classification & Readiness Scoring
    3. Course, Project & Roadmap Recommendation Engine
    """
    try:
        results = ml_pipeline.run(
            input_text=request.inputText,
            target_role=request.targetRole,
            title=request.title
        )
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
