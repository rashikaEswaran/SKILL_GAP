from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from .agent import SkillSyncAIAgent

router = APIRouter(prefix="/api/ai", tags=["AI Services"])

class AIAnalyzeRequest(BaseModel):
    inputText: str = Field(..., min_length=10, max_length=50000)
    targetRole: str = Field(default="Full Stack Developer")
    title: Optional[str] = "AI Career & Skill Analysis"

@router.post("/analyze")
async def analyze_with_ai(request: AIAnalyzeRequest):
    try:
        agent = SkillSyncAIAgent()
        result = agent.analyze(request.inputText, request.targetRole)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
