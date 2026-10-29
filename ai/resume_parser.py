import re
from typing import Dict, Any, List

class ResumeParser:
    """
    Parses resume or syllabus text into structured logical sections:
    - Experience
    - Projects
    - Education
    - Skills
    """

    SECTIONS = {
        "skills": [r"skills?", r"technical skills?", r"technologies", r"core competencies", r"tools"],
        "experience": [r"experience", r"work experience", r"employment", r"internships?"],
        "projects": [r"projects?", r"academic projects?", r"key projects?"],
        "education": [r"education", r"academics", r"qualification", r"degrees?"]
    }

    def parse(self, text: str) -> Dict[str, Any]:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        sections: Dict[str, List[str]] = {
            "skills": [],
            "experience": [],
            "projects": [],
            "education": [],
            "general": []
        }

        current_section = "general"

        for line in lines:
            header_detected = None
            lower_line = line.lower().strip(":#*- ")

            for section_name, patterns in self.SECTIONS.items():
                for pat in patterns:
                    if re.fullmatch(pat, lower_line) or lower_line.startswith(pat + ":"):
                        header_detected = section_name
                        break
                if header_detected:
                    break

            if header_detected:
                current_section = header_detected
            else:
                sections[current_section].append(line)

        return {
            "full_text": text,
            "section_summary": {k: "\n".join(v) for k, v in sections.items()},
            "line_count": len(lines)
        }
