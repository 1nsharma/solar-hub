"""Local-first repair loop using Ollama with deterministic fail-closed behavior."""
from __future__ import annotations

from pathlib import Path
import json
import os
import urllib.request


class RepairLoop:
    def __init__(self, workspace: str | Path, model: str | None = None, base_url: str | None = None, max_attempts: int = 3):
        self.workspace = Path(workspace).resolve()
        self.model = model or os.getenv("SOLARHUB_ENGINEERING_MODEL", "qwen2.5-coder:7b")
        self.base_url = (base_url or os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")).rstrip("/")
        self.max_attempts = max(1, min(max_attempts, 5))

    def _files_context(self, files: list[str]) -> str:
        chunks = []
        for rel in files[:8]:
            p = (self.workspace / rel).resolve()
            if self.workspace in p.parents and p.is_file():
                chunks.append(f"\n--- {rel} ---\n{p.read_text(encoding='utf-8', errors='ignore')[:20000]}")
        return "".join(chunks)

    def _ask(self, objective: str, failure: dict, files: list[str]) -> dict:
        prompt = f"""You are SolarHub's isolated software repair agent. Objective: {objective}\nFailure: {json.dumps(failure)[:30000]}\nFiles: {files}\nContext:{self._files_context(files)}\nReturn ONLY JSON: {{\"changes\":[{{\"path\":\"relative/path\",\"content\":\"complete new file content\"}}],\"reason\":\"short explanation\"}}. Change only necessary files. Never use absolute paths, secrets, .env files, deployment workflows, or destructive commands."""
        body = {"model": self.model, "stream": False, "format": "json", "messages": [{"role": "user", "content": prompt}]}
        req = urllib.request.Request(self.base_url + "/api/chat", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=120) as response:
            payload = json.loads(response.read().decode())
        return json.loads(payload["message"]["content"])

    def apply(self, proposal: dict) -> dict:
        applied = []
        for change in proposal.get("changes", [])[:8]:
            rel = str(change.get("path", "")).replace("\\", "/")
            p = (self.workspace / rel).resolve()
            if not rel or rel.startswith("/") or ".." in Path(rel).parts or self.workspace not in p.parents:
                raise ValueError(f"Unsafe repair path: {rel}")
            if Path(rel).name in {".env", ".env.local", ".env.production"} or rel.startswith(".github/workflows/"):
                raise ValueError(f"Blocked repair path: {rel}")
            content = change.get("content")
            if not isinstance(content, str) or len(content) > 200000:
                raise ValueError(f"Invalid repair content: {rel}")
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content, encoding="utf-8")
            applied.append(rel)
        return {"files": applied, "reason": proposal.get("reason", "")}

    def attempt(self, objective: str, failure: dict, files: list[str]) -> dict:
        try:
            proposal = self._ask(objective, failure, files)
            return {"ok": bool(proposal.get("changes")), "proposal": proposal, "applied": self.apply(proposal)}
        except Exception as exc:
            return {"ok": False, "error": f"{type(exc).__name__}: {exc}", "offline": True}
