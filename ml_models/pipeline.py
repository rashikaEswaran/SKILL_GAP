import os
import time
from typing import Dict, Any, List
from .skill_extractor.extractor import SkillExtractor
from .gap_classifier.classifier import GapClassifier
from .recommendation.engine import RecommendationEngine

class SkillGapMLPipeline:
    """
    Unified end-to-end Machine Learning Pipeline for Skill Gap Analytics.
    Executes skill extraction, gap evaluation, readiness scoring, and recommendations.
    """

    def __init__(self, db_path: str = None):
        self.extractor = SkillExtractor(db_path)
        self.classifier = GapClassifier(db_path)
        self.recommender = RecommendationEngine(db_path)

    def run(self, input_text: str, target_role: str, title: str = "Skill Gap Analysis") -> Dict[str, Any]:
        start_time = time.time()

        # Step 1: Feature Extraction (Skills from resume / syllabus)
        extracted = self.extractor.extract(input_text)
        skill_names = [s["skill"] for s in extracted]

        # Step 2: Gap Classification & Readiness Scoring
        gap_data = self.classifier.classify_gaps(skill_names, target_role)

        # Step 3: Recommendation Engine
        recommendations = self.recommender.recommend(
            missing_skills=gap_data["missing_core"] + gap_data["missing_emerging"],
            target_role=gap_data["target_role"],
            matched_skills=gap_data["matched_skills"]
        )

        processing_time_ms = int((time.time() - start_time) * 1000)

        # Structure complete analytics payload compatible with frontend charts & tables
        return {
            "title": title,
            "target_role": gap_data["target_role"],
            "readiness_score": gap_data["readiness_score"],
            "readiness_level": gap_data["readiness_level"],
            "gap_severity": gap_data["gap_severity"],
            "market_demand_score": gap_data["market_demand_score"],
            "extracted_skills": extracted,
            "matched_skills": gap_data["matched_skills"],
            "missing_core": gap_data["missing_core"],
            "missing_emerging": gap_data["missing_emerging"],
            "missing_soft": gap_data["missing_soft"],
            "high_priority_gaps": gap_data["high_priority_gaps"],
            "medium_priority_gaps": gap_data["medium_priority_gaps"],
            "stats": gap_data["stats"],
            "recommendations": recommendations,
            "study_materials": recommendations.get("study_materials", []),
            "random_forest": gap_data.get("random_forest"),
            "metadata": {
                "engine": "SkillSync Random Forest ML Core v2.0",
                "processed_length": len(input_text),
                "skills_found": len(extracted),
                "latency_ms": processing_time_ms
            }
        }

if __name__ == "__main__":
    sample_text = """
    Software Engineer with experience in Python, JavaScript, and React.
    Built web applications using REST APIs, HTML, CSS, and Git.
    Familiar with SQL databases and problem solving.
    """
    pipeline = SkillGapMLPipeline()
    result = pipeline.run(sample_text, "Full Stack Developer")
    print(f"Role: {result['target_role']}")
    print(f"Readiness Score: {result['readiness_score']}%")
    print(f"Matched Skills: {result['matched_skills']}")
    print(f"Missing Core: {result['missing_core']}")
