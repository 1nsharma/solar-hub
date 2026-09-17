"""Verify autonomous changes stay within an explicit scope."""
from __future__ import annotations

from pathlib import Path
import subprocess


class DiffVerifier:
    def __init__(self, workspace: str | Path):
        self.workspace = Path(workspace).resolve()

    def diff_stat(self) -> str:
        p = subprocess.run(["git", "diff", "--stat", "HEAD"], cwd=self.workspace, text=True, capture_output=True)
        return p.stdout.strip() if p.returncode == 0 else p.stderr.strip()

    def diff(self) -> str:
        p = subprocess.run(["git", "diff", "--", "."], cwd=self.workspace, text=True, capture_output=True)
        if p.returncode:
            raise RuntimeError(p.stderr.strip())
        return p.stdout[-100000:]

    def verify(self, allowed_paths: list[str] | None = None) -> dict:
        p = subprocess.run(["git", "diff", "--name-only", "HEAD"], cwd=self.workspace, text=True, capture_output=True)
        if p.returncode:
            return {"ok": False, "error": p.stderr.strip()}
        files = [x.strip() for x in p.stdout.splitlines() if x.strip()]
        unexpected = []
        if allowed_paths:
            for file in files:
                if not any(file == prefix or file.startswith(prefix.rstrip("/") + "/") for prefix in allowed_paths):
                    unexpected.append(file)
        return {"ok": not unexpected and bool(files), "files": files, "unexpected_files": unexpected, "stat": self.diff_stat(), "diff": self.diff()}
