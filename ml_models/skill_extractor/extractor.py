import re
import json
import os
from typing import List, Dict, Any, Set

class SkillExtractor:
    """
    NLP and Rule-based skill extraction engine.
    Matches text against a curated skills taxonomy with normalization,
    alias expansion, and context weighting.
    """

    ALIASES = {
        "js": "JavaScript",
        "ts": "TypeScript",
        "py": "Python",
        "reactjs": "React",
        "react.js": "React",
        "nodejs": "Node.js",
        "node": "Node.js",
        "ml": "Machine Learning",
        "dl": "Deep Learning",
        "k8s": "Kubernetes",
        "tf": "TensorFlow",
        "postgres": "PostgreSQL",
        "pg": "PostgreSQL",
        "mongo": "MongoDB",
        "aws cloud": "AWS",
        "amazon web services": "AWS",
        "azure cloud": "Azure",
        "gcp": "GCP",
        "google cloud": "GCP",
        "dsa": "Data Structures",
        "algo": "Algorithms",
        "oop": "Object-Oriented Programming",
        "rest": "REST APIs",
        "restful": "REST APIs",
        "ci cd": "CI/CD",
        "cicd": "CI/CD",
        "tailwind": "Tailwind CSS",
        "genai": "Generative AI",
        "llm": "Generative AI",
        "llms": "Generative AI",
    }

    def __init__(self, db_path: str = None):
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "skills_db.json")

        self.db_path = db_path
        self.skills_db = self._load_db()
        self.canonical_skills = self._build_canonical_set()

    def _load_db(self) -> Dict[str, Any]:
        if os.path.exists(self.db_path):
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"roles": {}, "skill_taxonomy": {}}

    def _build_canonical_set(self) -> Set[str]:
        canonical = set()
        for category, skills in self.skills_db.get("skill_taxonomy", {}).items():
            for s in skills:
                canonical.add(s)
        for role, data in self.skills_db.get("roles", {}).items():
            for s in data.get("core_skills", []) + data.get("emerging_skills", []):
                canonical.add(s)
        return canonical

    def extract(self, text: str) -> List[Dict[str, Any]]:
        """
        Extracts recognized skills from raw resume or syllabus text.
        Returns a list of skill objects with confidence, category, and occurrences.
        """
        if not text or not isinstance(text, str):
            return []

        lower_text = text.lower()
        extracted_map: Dict[str, Dict[str, Any]] = {}

        # 1. Match Canonical Skills
        for skill in self.canonical_skills:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill.lower()) + r"(?![a-zA-Z0-9])"
            matches = list(re.finditer(pattern, lower_text))
            if matches:
                category = self._find_category(skill)
                # Boost confidence based on frequency
                occurrences = len(matches)
                confidence = min(0.70 + (occurrences * 0.08), 0.99)
                extracted_map[skill] = {
                    "skill": skill,
                    "category": category,
                    "occurrences": occurrences,
                    "confidence": round(confidence, 2)
                }

        # 2. Match Aliases & Acronyms
        for alias, target_skill in self.ALIASES.items():
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(alias) + r"(?![a-zA-Z0-9])"
            matches = list(re.finditer(pattern, lower_text))
            if matches:
                occurrences = len(matches)
                if target_skill in extracted_map:
                    extracted_map[target_skill]["occurrences"] += occurrences
                    extracted_map[target_skill]["confidence"] = min(extracted_map[target_skill]["confidence"] + 0.05, 0.99)
                else:
                    category = self._find_category(target_skill)
                    extracted_map[target_skill] = {
                        "skill": target_skill,
                        "category": category,
                        "occurrences": occurrences,
                        "confidence": 0.85
                    }

        # Sort by occurrences / confidence descending
        results = sorted(list(extracted_map.values()), key=lambda x: (x["occurrences"], x["confidence"]), reverse=True)
        return results

    def _find_category(self, skill: str) -> str:
        for cat, skills in self.skills_db.get("skill_taxonomy", {}).items():
            if skill in skills:
                return cat
        return "Technical"
