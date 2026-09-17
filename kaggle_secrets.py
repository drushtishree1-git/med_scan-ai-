"""
Shim for kaggle_secrets when running locally outside of Kaggle.
"""
import os
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class UserSecretsClient:
    """Fallback client providing secret retrieval compatible with Kaggle UserSecretsClient."""
    def __init__(self):
        """Initialize UserSecretsClient."""

    def get_secret(self, secret_label: str) -> Optional[str]:
        """Retrieve a secret by key label from environment variables."""
        val = os.getenv(secret_label)
        if not val and secret_label in ("GOOGLE_API_KEY", "gemini"):
            val = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        return val

__all__ = ["UserSecretsClient"]
