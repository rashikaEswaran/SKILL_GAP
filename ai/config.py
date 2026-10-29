import os

class AIConfig:
    """Configuration for AI and LLM services."""
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("VITE_GEMINI_API_KEY", ""))
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    DEFAULT_MODEL = os.getenv("AI_MODEL", "gemini-2.5-flash")
    TEMPERATURE = float(os.getenv("AI_TEMPERATURE", "0.2"))
    MAX_TOKENS = int(os.getenv("AI_MAX_TOKENS", "2048"))
