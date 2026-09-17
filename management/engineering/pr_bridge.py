"""Deliver verified engineering changes as a branch/PR or offline spec."""
from __future__ import annotations

from pathlib import Path
import json
import os
import subprocess
import urllib.request


class PRBridge:
    def __init__(self, workspace: str | Path, repo_root: str | Path | None = None):
        self.workspace = Path(workspace).resolve()
        self.repo_root = Path(repo_root or workspace).resolve()

    def commit(self, message: str) -> str:
        p = subprocess.run(["git", "add", "-A"], cwd=self.workspace, text=True, capture_output=True)
        if p.returncode:
            raise RuntimeError(p.stderr.strip())
        p = subprocess.run(["git", "commit", "-m", message], cwd=self.workspace, text=True, capture_output=True)
        if p.returncode:
            raise RuntimeError(p.stderr.strip() or p.stdout.strip())
        return subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=self.workspace, text=True).strip()

    def _push(self, branch: str) -> None:
        p = subprocess.run(["git", "push", "-u", "origin", branch], cwd=self.workspace, text=True, capture_output=True, timeout=120)
        if p.returncode:
            raise RuntimeError(p.stderr.strip() or p.stdout.strip())

    def create_pr(self, branch: str, title: str, body: str) -> dict:
        token = os.getenv("GITHUB_TOKEN")
        remote = subprocess.check_output(["git", "remote", "get-url", "origin"], cwd=self.repo_root, text=True).strip()
        if not token or "github.com" not in remote:
            return {"status": "spec_only", "branch": branch, "title": title, "body": body}
        self._push(branch)
        # Derive owner/repo only from the configured origin URL; never log the token.
        clean = remote.removesuffix(".git").rstrip("/")
        if clean.endswith(".git"):
            clean = clean[:-4]
        if "github.com/" in clean:
            slug = clean.split("github.com/", 1)[1]
        elif "github.com:" in clean:
            slug = clean.split("github.com:", 1)[1]
        else:
            return {"status": "pushed", "branch": branch, "error": "Could not derive GitHub repository slug"}
        req = urllib.request.Request(
            "https://api.github.com/repos/" + slug + "/pulls",
            data=json.dumps({"title": title, "head": branch, "base": "master", "body": body}).encode(),
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode())
        return {"status": "created", "number": result.get("number"), "url": result.get("html_url"), "branch": branch}

    def offline_spec(self, path: str | Path, payload: dict) -> Path:
        target = Path(path).resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        return target

    def create_spec(self, objective: str, report: dict, verification: dict) -> dict:
        payload = {
            "objective": objective,
            "report": report,
            "verification": verification,
            "diff": report.get("diff", "") if isinstance(report, dict) else "",
        }
        artifact_path = self.workspace / ".solarhub" / "pr_spec.json"
        saved = self.offline_spec(artifact_path, payload)
        return {"ok": True, "artifact": str(saved), "payload": payload}
