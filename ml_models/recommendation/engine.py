import os
import json
from typing import List, Dict, Any

class RecommendationEngine:
    """
    Intelligent recommendation engine for learning roadmaps,
    courses, project ideas, and peer skill swaps.
    """

    def __init__(self, db_path: str = None):
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "skills_db.json")

        self.db_path = db_path
        self.skills_db = self._load_db()

    def _load_db(self) -> Dict[str, Any]:
        if os.path.exists(self.db_path):
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"courses_db": []}

    def recommend(self, missing_skills: List[str], target_role: str, matched_skills: List[str]) -> Dict[str, Any]:
        """
        Generates personalized courses, projects, roadmap, swap ideas, and study materials.
        """
        courses = self._get_course_recommendations(missing_skills)
        roadmap = self._generate_roadmap(missing_skills, target_role)
        projects = self._recommend_projects(missing_skills, target_role)
        swap_suggestions = self._recommend_swap_opportunities(missing_skills, matched_skills)
        study_materials = self._get_study_materials(missing_skills)

        return {
            "recommended_courses": courses,
            "learning_roadmap": roadmap,
            "capstone_projects": projects,
            "skill_swap_suggestions": swap_suggestions,
            "study_materials": study_materials,
        }

    def _get_study_materials(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        """
        Retrieves curated study materials (documentation, courses, video tutorials, practice projects)
        for missing skills to guide student upskilling.
        """
        materials_db = self.skills_db.get("learning_materials", {})
        results = []
        lower_map = {k.lower(): v for k, v in materials_db.items()}

        for skill in missing_skills:
            skill_clean = skill.strip()
            low = skill_clean.lower()
            if low in lower_map:
                entry = dict(lower_map[low])
                entry["skill"] = skill_clean
                results.append(entry)
            else:
                # Dynamic fallback for any other missing skill
                results.append({
                    "skill": skill_clean,
                    "summary": f"Core competency for {skill_clean} needed for technical interviews and production workflows.",
                    "documentation": f"https://devdocs.io/#q={skill_clean}",
                    "course": {
                        "title": f"Complete {skill_clean} Masterclass & Certification Prep",
                        "provider": "Coursera / Udemy",
                        "url": f"https://www.coursera.org/search?query={skill_clean}"
                    },
                    "free_tutorial": f"https://www.youtube.com/results?search_query={skill_clean}+tutorial+full+course",
                    "practice_project": f"Build a hands-on project utilizing {skill_clean} to demonstrate practical competency.",
                    "estimated_hours": 20
                })
        return results

    def _get_course_recommendations(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        all_courses = self.skills_db.get("courses_db", [])
        matched_courses = []
        lower_missing = [s.lower() for s in missing_skills]

        for course in all_courses:
            if course.get("skill", "").lower() in lower_missing:
                matched_courses.append(course)

        # If missing skills don't have direct static courses, generate dynamic references
        for skill in missing_skills[:4]:
            if not any(c.get("skill", "").lower() == skill.lower() for c in matched_courses):
                matched_courses.append({
                    "skill": skill,
                    "course_name": f"Comprehensive {skill} Masterclass: Zero to Hero",
                    "provider": "Coursera / Udemy",
                    "level": "Intermediate",
                    "estimated_weeks": 4,
                    "url": f"https://www.coursera.org/search?query={skill}"
                })

        return matched_courses[:6]

    def _generate_roadmap(self, missing_skills: List[str], target_role: str) -> List[Dict[str, Any]]:
        if not missing_skills:
            return [
                {
                    "phase": "Phase 1: Advanced Mastery",
                    "weeks": "Weeks 1-4",
                    "focus": f"Advanced {target_role} Architecture & Open Source Contribution",
                    "skills": ["System Design", "CI/CD", "Performance Optimization"],
                    "deliverable": "Production-grade portfolio repository with automated tests"
                }
            ]

        # Break missing skills into sequential phases
        phase1_skills = missing_skills[:2] if len(missing_skills) >= 2 else missing_skills
        phase2_skills = missing_skills[2:4] if len(missing_skills) >= 4 else missing_skills[1:2]
        phase3_skills = missing_skills[4:6] if len(missing_skills) >= 6 else ["System Design", "Cloud Deployment"]

        roadmap = [
            {
                "phase": "Phase 1: High Priority Foundations",
                "weeks": "Weeks 1-4",
                "focus": f"Core skills required for {target_role}",
                "skills": phase1_skills if phase1_skills else ["Core CS Fundamentals"],
                "deliverable": f"Mini-project implementing {', '.join(phase1_skills)}" if phase1_skills else "Algorithm & system challenges"
            },
            {
                "phase": "Phase 2: Modern Tooling & Full Integration",
                "weeks": "Weeks 5-8",
                "focus": "Practical application and backend/system integration",
                "skills": phase2_skills if phase2_skills else ["Docker", "REST APIs"],
                "deliverable": "End-to-end full stack service with database persistence"
            },
            {
                "phase": "Phase 3: Production & Industry Placement",
                "weeks": "Weeks 9-12",
                "focus": "Interview preparation, System design, and Deployment",
                "skills": phase3_skills,
                "deliverable": "Live hosted Capstone project with CI/CD and metrics"
            }
        ]
        return roadmap

    def _recommend_projects(self, missing_skills: List[str], target_role: str) -> List[Dict[str, Any]]:
        focus_skills = ", ".join(missing_skills[:3]) if missing_skills else "Full Stack Architecture"
        return [
            {
                "title": f"Production-Ready {target_role} Platform",
                "description": f"Build a robust microservice platform bridging your key gaps: {focus_skills}.",
                "tech_stack": missing_skills[:4] if missing_skills else ["React", "FastAPI", "Docker", "PostgreSQL"],
                "difficulty": "Intermediate-Advanced"
            },
            {
                "title": "Real-Time Collaborative Workspace",
                "description": "Develop a live collaboration tool featuring WebSockets, auth, and state sync.",
                "tech_stack": ["React", "Node.js/Python", "Redis", "Docker"],
                "difficulty": "Advanced"
            }
        ]

    def _recommend_swap_opportunities(self, missing_skills: List[str], matched_skills: List[str]) -> List[Dict[str, Any]]:
        can_teach = matched_skills[:3] if matched_skills else ["Git", "Basics"]
        wants_to_learn = missing_skills[:3] if missing_skills else ["System Design"]
        return [
            {
                "title": f"Swap {can_teach[0] if can_teach else 'Skills'} for {wants_to_learn[0] if wants_to_learn else 'Guidance'}",
                "offer_skill": can_teach[0] if can_teach else "Web Development",
                "seeking_skill": wants_to_learn[0] if wants_to_learn else "Cloud / DevOps",
                "tip": "Post this request on the SkillSwap community to pair up with a peer!"
            }
        ]
