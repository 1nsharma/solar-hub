"""Security gates for autonomous code changes."""
from __future__ import annotations

from pathlib import Path
import re
import subprocess

SECRET_PATTERNS = [
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"\bghp_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bsk-proj-[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b"),
]
BLOCKED_PATHS = (".env", ".env.local", ".env.production", ".pem", ".key")
BLOCKED_PREFIXES = (".github/workflows/",)


class SecurityReport(dict):
    def __getattr__(self, name: str):
        try:
            return self[name]
        except KeyError:
            raise AttributeError(name)

    def to_dict(self) -> dict:
        return dict(self)


class SecurityGate:
    def __init__(self, workspace: str | Path):
        self.workspace = Path(workspace).resolve()

    def changed_files(self) -> list[str]:
        p = subprocess.run(["git", "diff", "--name-only", "HEAD"], cwd=self.workspace, text=True, capture_output=True)
        if p.returncode:
            raise RuntimeError(p.stderr.strip())
        return [x.strip() for x in p.stdout.splitlines() if x.strip()]

    def scan_secrets(self, files: list[str] | None = None) -> list[dict]:
        findings = []
        for rel in files or self.changed_files():
            if rel.startswith(".git/") or "__pycache__" in Path(rel).parts or rel.endswith((".jsonl", ".gitignore")):
                continue
            p = (self.workspace / rel).resolve()
            if self.workspace not in p.parents and p != self.workspace:
                findings.append({"file": rel, "reason": "path escapes workspace"})
                continue
            if not p.is_file():
                continue
            text = p.read_text(encoding="utf-8", errors="ignore")
            for pattern in SECRET_PATTERNS:
                if pattern.search(text):
                    findings.append({"file": rel, "pattern": pattern.pattern})
        return findings

    def blocked_changes(self, files: list[str] | None = None) -> list[str]:
        blocked = []
        for rel in files or self.changed_files():
            normalized = rel.replace("\\", "/")
            name = Path(normalized).name
            if name in BLOCKED_PATHS or normalized.endswith(BLOCKED_PATHS):
                blocked.append(rel)
            if any(normalized.startswith(prefix) for prefix in BLOCKED_PREFIXES):
                blocked.append(rel)
        return sorted(set(blocked))

    def run(self) -> SecurityReport:
        files = self.changed_files()
        secrets = self.scan_secrets(files)
        blocked = self.blocked_changes(files)
        return SecurityReport({"ok": not secrets and not blocked, "changed_files": files, "secret_findings": secrets, "blocked_changes": blocked})

