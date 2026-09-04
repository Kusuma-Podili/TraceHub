import re
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel

class ParsedSmartCommit(BaseModel):
    commit_sha: str
    author: str
    message: str
    referenced_task_codes: List[str]
    referenced_bug_codes: List[str]
    transition_action: Optional[str] = None  # "fixes", "closes", "resolves", "reopens"
    logged_time_hours: Optional[float] = None

class VCSIntegration:
    """
    Version Control System (GitHub, GitLab, Bitbucket) Webhook & Smart Commit Parser.
    Extracts Jira-style commands from commit messages (e.g. 'Fixes BUG-001 #time 2h').
    """

    TASK_PATTERN = re.compile(r'\b([A-Z]{2,10}-\d{1,6})\b')
    CLOSE_PATTERN = re.compile(r'(?i)\b(fix|fixes|close|closes|resolve|resolves)\s+([A-Z]{2,10}-\d{1,6})\b')
    TIME_PATTERN = re.compile(r'#time\s+([0-9.]+)(h|m)?')

    @classmethod
    def parse_commit_message(cls, sha: str, author: str, message: str) -> ParsedSmartCommit:
        all_codes = cls.TASK_PATTERN.findall(message)

        # Distinguish bug vs task codes
        bug_codes = [c for c in all_codes if "BUG" in c]
        task_codes = [c for c in all_codes if "BUG" not in c]

        # Transition action detection
        close_match = cls.CLOSE_PATTERN.search(message)
        action = None
        if close_match:
            action = close_match.group(1).lower()

        # Time tracking syntax
        time_match = cls.TIME_PATTERN.search(message)
        hours = None
        if time_match:
            val = float(time_match.group(1))
            unit = time_match.group(2) or "h"
            hours = val if unit == "h" else val / 60.0

        return ParsedSmartCommit(
            commit_sha=sha,
            author=author,
            message=message.strip(),
            referenced_task_codes=list(set(task_codes)),
            referenced_bug_codes=list(set(bug_codes)),
            transition_action=action,
            logged_time_hours=hours
        )
