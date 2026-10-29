import os
import json
from typing import List, Dict, Any
from .random_forest_model import RandomForestSkillModel

class GapClassifier:
    """
    Skill gap evaluation & readiness prediction model powered by Random Forest.
    Combines rule-based matrix benchmarking with a 120-tree Random Forest ensemble
    (RandomForestRegressor + RandomForestClassifier).
    """

    def __init__(self, db_path: str = None):
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "skills_db.json")

        self.db_path = db_path
        self.skills_db = self._load_db()
        self.rf_model = RandomForestSkillModel(db_path)

    def _load_db(self) -> Dict[str, Any]:
        if os.path.exists(self.db_path):
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"roles": {}}

    def classify_gaps(self, extracted_skills: List[str], target_role: str) -> Dict[str, Any]:
        """
        Classifies skill overlap, gaps, and readiness using Random Forest.
        """
        roles_data = self.skills_db.get("roles", {})
        role_profile = roles_data.get(target_role)

        # Fallback if target role isn't an exact match
        if not role_profile:
            for r_name, r_data in roles_data.items():
                if r_name.lower() == target_role.lower():
                    role_profile = r_data
                    target_role = r_name
                    break

        if not role_profile:
            role_profile = roles_data.get("Full Stack Developer", {
                "core_skills": ["Python", "JavaScript", "SQL", "Git", "REST APIs"],
                "emerging_skills": ["Docker", "System Design"],
                "soft_skills": ["Problem Solving", "Communication"],
                "market_demand_score": 85
            })

        core_reqs = set(role_profile.get("core_skills", []))
        emerging_reqs = set(role_profile.get("emerging_skills", []))
        soft_reqs = set(role_profile.get("soft_skills", []))

        extracted_set = {s.strip().lower() for s in extracted_skills}

        def is_matched(req: str) -> bool:
            return req.lower() in extracted_set

        matched_core = [s for s in core_reqs if is_matched(s)]
        missing_core = [s for s in core_reqs if not is_matched(s)]

        matched_emerging = [s for s in emerging_reqs if is_matched(s)]
        missing_emerging = [s for s in emerging_reqs if not is_matched(s)]

        matched_soft = [s for s in soft_reqs if is_matched(s)]
        missing_soft = [s for s in soft_reqs if not is_matched(s)]

        core_ratio = len(matched_core) / max(len(core_reqs), 1)

        # --- Random Forest Prediction ---
        rf_prediction = self.rf_model.predict(extracted_skills, target_role)
        readiness_score = rf_prediction["predicted_readiness_score"]
        gap_severity = rf_prediction["predicted_gap_tier"]

        if readiness_score >= 80:
            readiness_level = "Industry Ready / Placement High Priority"
        elif readiness_score >= 50:
            readiness_level = "Near Ready / Upskilling Recommended"
        else:
            readiness_level = "Foundational Stage / Structured Roadmap Required"

        high_priority_gaps = missing_core[:4]
        medium_priority_gaps = missing_core[4:] + missing_emerging[:2]
        bonus_skills = missing_emerging[2:]

        return {
            "target_role": target_role,
            "readiness_score": readiness_score,
            "readiness_level": readiness_level,
            "gap_severity": gap_severity,
            "matched_skills": matched_core + matched_emerging + matched_soft,
            "missing_core": missing_core,
            "missing_emerging": missing_emerging,
            "missing_soft": missing_soft,
            "high_priority_gaps": high_priority_gaps,
            "medium_priority_gaps": medium_priority_gaps,
            "bonus_skills": bonus_skills,
            "market_demand_score": role_profile.get("market_demand_score", 90),
            "random_forest": {
                "model": "Random Forest (scikit-learn 1.9.1)",
                "trees": rf_prediction["trees_in_forest"],
                "predicted_score": readiness_score,
                "predicted_tier": gap_severity,
                "placement_probabilities": rf_prediction["placement_probabilities"],
                "top_feature_importances": rf_prediction["top_impact_skills"]
            },
            "stats": {
                "matched_count": len(matched_core) + len(matched_emerging),
                "total_required": len(core_reqs) + len(emerging_reqs),
                "core_match_percent": int(round(core_ratio * 100))
            }
        }
