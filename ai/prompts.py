"""
Prompt templates for SkillSync AI workflows.
"""

SKILL_EXTRACTION_PROMPT = """You are a precise skill extraction engine for SkillSync AI.
From the candidate text below (resume, course syllabus, or projects), extract ALL distinct technical, domain, and soft skills.
Normalize names (e.g. "ReactJS" -> "React", "NodeJS" -> "Node.js", "ML" -> "Machine Learning", "JS" -> "JavaScript").

Return ONLY valid JSON in this exact structure:
{{
  "skills": ["Skill 1", "Skill 2"],
  "experience_level": "Beginner|Intermediate|Advanced",
  "domain_strengths": ["Web Development", "AI/ML"]
}}

TEXT:
{text}
"""

GAP_ANALYSIS_PROMPT = """You are an expert tech career advisor and engineering hiring manager.
Compare the candidate's profile against the industry requirements for: {target_role}.

Candidate's extracted skills: {skills}
Candidate background context: {context}

Provide a structured analysis in JSON:
{{
  "summary": "2-3 sentence overview of readiness",
  "strengths": ["Strength 1", "Strength 2"],
  "critical_gaps": ["Missing Skill 1", "Missing Skill 2"],
  "emerging_recommendations": ["Skill that boosts competitive edge"],
  "placement_readiness_score": 75,
  "action_items": [
    "Immediate action for week 1",
    "Action for month 1"
  ]
}}
"""

ROADMAP_PROMPT = """Create an actionable, phased 12-week learning roadmap for a student targeting: {target_role}.
Their missing skills: {missing_skills}

Return ONLY valid JSON:
{{
  "phases": [
    {{
      "phase": "Weeks 1-4: Foundation",
      "focus": "Topic name",
      "learning_objectives": ["Obj 1", "Obj 2"],
      "hands_on_project": "Project description",
      "recommended_resources": ["Resource 1", "Resource 2"]
    }}
  ]
}}
"""
