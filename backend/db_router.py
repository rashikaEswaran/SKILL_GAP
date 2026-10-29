from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from .database import (
    save_analysis,
    get_analyses,
    get_analysis_by_id,
    delete_analysis,
    get_connection,
)
import json

router = APIRouter(prefix="/api/mysql", tags=["MySQL Database"])

class SaveAnalysisPayload(BaseModel):
    id: str
    user_id: Optional[str] = "00000000-0000-0000-0000-000000000001"
    title: Optional[str] = "Skill Gap Analysis"
    target_role: Optional[str] = "Engineering Role"
    input_text: Optional[str] = ""
    extracted_skills: Optional[List[Any]] = []
    matched_skills: Optional[List[Any]] = []
    missing_skills: Optional[List[Any]] = []
    gap_score: Optional[int] = 30
    industry_match: Optional[int] = 70
    readiness_score: Optional[int] = 70
    recommendations: Optional[List[Any]] = []
    courses: Optional[List[Any]] = []
    study_materials: Optional[List[Any]] = []

@router.get("/status")
def mysql_status():
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT DATABASE() AS db, VERSION() AS ver;")
            info = cur.fetchone()
        conn.close()
        return {
            "status": "connected",
            "engine": "MySQL",
            "database": info["db"],
            "version": info["ver"]
        }
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@router.get("/analyses")
def list_analyses(user_id: Optional[str] = None):
    try:
        analyses = get_analyses(user_id)
        return {"success": True, "data": analyses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyses/{analysis_id}")
def read_analysis(analysis_id: str):
    try:
        analysis = get_analysis_by_id(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        return {"success": True, "data": analysis}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyses")
def create_analysis(payload: SaveAnalysisPayload):
    try:
        saved_id = save_analysis(payload.model_dump())
        return {"success": True, "id": saved_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/analyses/{analysis_id}")
def remove_analysis(analysis_id: str):
    try:
        delete_analysis(analysis_id)
        return {"success": True, "id": analysis_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
