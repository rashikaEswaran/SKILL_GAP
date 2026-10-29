from typing import Dict, Any, List
from .llm_service import LLMService
from .resume_parser import ResumeParser
from .prompts import SKILL_EXTRACTION_PROMPT, GAP_ANALYSIS_PROMPT, ROADMAP_PROMPT

class SkillSyncAIAgent:
    """
    Intelligent Agent for Skill Gap Analytics.
    Orchestrates multi-step reasoning:
    1. Parse resume / document structure
    2. Extract skills and domain competence
    3. Reason through role gaps and placement probability
    4. Construct personalized action plan
    """

    def __init__(self):
        self.llm = LLMService()
        self.parser = ResumeParser()

    def analyze(self, raw_text: str, target_role: str) -> Dict[str, Any]:
        # Step 1: Document Structure
        parsed_doc = self.parser.parse(raw_text)

        # Step 2: Semantic Skill Extraction
        extract_prompt = SKILL_EXTRACTION_PROMPT.format(text=raw_text[:8000])
        extraction_res = self.llm.generate_json(extract_prompt)
        skills = extraction_res.get("skills", [])

        # Step 3: Gap Analysis Reasoning
        gap_prompt = GAP_ANALYSIS_PROMPT.format(
            target_role=target_role,
            skills=", ".join(skills),
            context=parsed_doc["section_summary"].get("experience", "")[:1000]
        )
        gap_res = self.llm.generate_json(gap_prompt)

        # Step 4: Roadmap Planning
        missing = gap_res.get("critical_gaps", [])
        roadmap_prompt = ROADMAP_PROMPT.format(
            target_role=target_role,
            missing_skills=", ".join(missing)
        )
        roadmap_res = self.llm.generate_json(roadmap_prompt)

        return {
            "target_role": target_role,
            "extracted_skills": skills,
            "experience_level": extraction_res.get("experience_level", "Intermediate"),
            "domain_strengths": extraction_res.get("domain_strengths", []),
            "analysis": gap_res,
            "roadmap": roadmap_res.get("phases", []),
            "document_sections": list(parsed_doc["section_summary"].keys())
        }
