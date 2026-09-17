"""SolarHub tool runtime.

A provider-agnostic execution layer for autonomous agents. Tools are explicit,
inspectable capabilities rather than direct agent access to infrastructure.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Callable, Dict, Optional
import json
import os
import subprocess
import urllib.error
import urllib.request


@dataclass
class ToolResult:
    tool: str
    ok: bool
    output: Any = None
    error: Optional[str] = None
    metadata: Dict[str, Any] | None = None


@dataclass
class ToolSpec:
    name: str
    category: str
    description: str
    offline: bool
    handler: Callable[..., ToolResult]


class ToolRuntime:
    """Register and execute SolarHub capabilities through one contract."""

    def __init__(self, root_dir: str | None = None):
        self.root_dir = Path(root_dir or Path(__file__).resolve().parents[2]).resolve()
        self.tools: Dict[str, ToolSpec] = {}
        self._register_core_tools()

    def register(self, spec: ToolSpec) -> None:
        self.tools[spec.name] = spec

    def list_tools(self) -> list[dict[str, Any]]:
        return [{"name": s.name, "category": s.category, "description": s.description, "offline": s.offline} for s in self.tools.values()]

    def execute(self, name: str, **kwargs: Any) -> ToolResult:
        spec = self.tools.get(name)
        if not spec:
            return ToolResult(name, False, error="Unknown tool")
        try:
            return spec.handler(**kwargs)
        except Exception as exc:
            return ToolResult(name, False, error=f"{type(exc).__name__}: {exc}")

    def _register_core_tools(self) -> None:
        self.register(ToolSpec("file.read", "code", "Read a UTF-8 text file", True, self._file_read))
        self.register(ToolSpec("file.write", "code", "Write a UTF-8 text file", True, self._file_write))
        self.register(ToolSpec("file.list", "code", "List files under a workspace path", True, self._file_list))
        self.register(ToolSpec("command.run", "code", "Run an approved local command", True, self._command_run))
        self.register(ToolSpec("git.status", "code", "Read git status", True, self._git_status))
        self.register(ToolSpec("git.diff", "code", "Read git diff", True, self._git_diff))
        self.register(ToolSpec("git.log", "code", "Read recent git history", True, self._git_log))
        self.register(ToolSpec("git.branch", "code", "Create a local git branch", True, self._git_branch))
        self.register(ToolSpec("git.commit", "code", "Create a local git commit", True, self._git_commit))
        self.register(ToolSpec("test.run", "code", "Run a repository test command", True, self._command_run))
        self.register(ToolSpec("engineering.execute_loop", "engineering", "Run isolated build/test/repair/security/diff/PR workflow", True, self._engineering_execute_loop))
        self.register(ToolSpec("package.install", "code", "Install a declared npm/pip package", False, self._package_install))
        self.register(ToolSpec("browser.fetch", "browser", "Fetch a public HTTP page", False, self._http_fetch))
        self.register(ToolSpec("website.status", "browser", "Check public website HTTP status", False, self._website_status))
        self.register(ToolSpec("api.request", "api", "Make an HTTP API request", False, self._api_request))
        self.register(ToolSpec("github.request", "api", "Call a GitHub API endpoint using GITHUB_TOKEN", False, self._github_request))
        self.register(ToolSpec("gemini.request", "api", "Call Gemini through configured provider credentials", False, self._gemini_request))
        self.register(ToolSpec("security.secrets", "security", "Scan workspace for common leaked-secret patterns", True, self._security_secrets))
        self.register(ToolSpec("security.dependencies", "security", "Run npm audit when available", True, self._security_dependencies))
        self.register(ToolSpec("security.headers", "security", "Inspect HTTP security headers", False, self._security_headers))
        self.register(ToolSpec("business.crm", "business", "CRM adapter contract", True, self._not_configured))
        self.register(ToolSpec("business.leads", "business", "Lead adapter contract", True, self._not_configured))
        self.register(ToolSpec("business.customer", "business", "Customer adapter contract", True, self._not_configured))
        self.register(ToolSpec("business.inventory", "business", "Inventory adapter contract", True, self._not_configured))
        self.register(ToolSpec("business.invoice", "business", "Invoice adapter contract", True, self._not_configured))
        self.register(ToolSpec("media.script", "media", "Create a structured video script artifact", True, self._media_script))
        self.register(ToolSpec("media.thumbnail", "media", "Create a thumbnail job specification", True, self._media_job))
        self.register(ToolSpec("media.presentation", "media", "Create a presentation job specification", True, self._media_job))

    def _engineering_execute_loop(self, objective: str, allowed_paths: list[str] | None = None, checks: list[str] | None = None, max_attempts: int = 3, timeout: int = 180, **_: Any) -> ToolResult:
        from ..engineering.engineering_loop import EngineeringLoop
        result = EngineeringLoop(self.root_dir, max_attempts=max_attempts, timeout=timeout).run(objective, allowed_paths, checks)
        return ToolResult("engineering.execute_loop", bool(result.get("ok")), result, None if result.get("ok") else result.get("error") or result.get("stage"))

    def _safe_path(self, path: str) -> Path:
        target = (self.root_dir / path).resolve()
        if target != self.root_dir and self.root_dir not in target.parents:
            raise ValueError("Path escapes SolarHub workspace")
        return target

    def _file_read(self, path: str, **_: Any) -> ToolResult:
        p = self._safe_path(path)
        return ToolResult("file.read", True, p.read_text(encoding="utf-8"))

    def _file_write(self, path: str, content: str, **_: Any) -> ToolResult:
        p = self._safe_path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        return ToolResult("file.write", True, {"path": str(p.relative_to(self.root_dir)), "bytes": len(content.encode())})

    def _file_list(self, path: str = ".", **_: Any) -> ToolResult:
        p = self._safe_path(path)
        return ToolResult("file.list", True, [str(x.relative_to(self.root_dir)) for x in p.rglob("*") if x.is_file()][:2000])

    def _run(self, command: str, timeout: int = 120, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
        return subprocess.run(command, cwd=cwd or self.root_dir, shell=True, text=True, capture_output=True, timeout=max(1, min(timeout, 600)))

    def _command_run(self, command: str, timeout: int = 120, **_: Any) -> ToolResult:
        p = self._run(command, timeout)
        return ToolResult("command.run", p.returncode == 0, {"stdout": p.stdout[-20000:], "stderr": p.stderr[-20000:], "returncode": p.returncode})

    def _git_status(self, **_: Any) -> ToolResult: return self._command_run("git status --short")
    def _git_diff(self, **_: Any) -> ToolResult: return self._command_run("git diff --")
    def _git_log(self, limit: int = 10, **_: Any) -> ToolResult: return self._command_run(f"git log --oneline -n {max(1, min(limit, 50))}")
    def _git_branch(self, name: str, **_: Any) -> ToolResult: return self._command_run(f"git switch -c {name}")
    def _git_commit(self, message: str, **_: Any) -> ToolResult: return self._command_run(f'git add -A && git commit -m "{message.replace(chr(34), chr(39))}"')

    def _package_install(self, manager: str, package: str, **_: Any) -> ToolResult:
        if manager not in {"npm", "pip"}: return ToolResult("package.install", False, error="Only npm and pip are supported")
        return self._command_run(f"{manager} install {package}" if manager == "npm" else f"python -m pip install {package}", timeout=600)

    def _http_fetch(self, url: str, **_: Any) -> ToolResult:
        req = urllib.request.Request(url, headers={"User-Agent": "SolarHub-Agent/1.0"})
        with urllib.request.urlopen(req, timeout=20) as response:
            return ToolResult("browser.fetch", True, response.read(50000).decode("utf-8", errors="replace"), {"status": response.status, "url": response.url})

    def _website_status(self, url: str, **_: Any) -> ToolResult:
        try:
            req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "SolarHub-Agent/1.0"})
            with urllib.request.urlopen(req, timeout=15) as r: return ToolResult("website.status", True, {"status": r.status, "url": r.url})
        except urllib.error.HTTPError as e: return ToolResult("website.status", True, {"status": e.code, "url": url})

    def _api_request(self, url: str, method: str = "GET", body: Any = None, headers: Dict[str, str] | None = None, **_: Any) -> ToolResult:
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(url, data=data, method=method.upper(), headers=headers or {"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as r: return ToolResult("api.request", True, r.read(50000).decode("utf-8", errors="replace"), {"status": r.status})

    def _github_request(self, path: str, **_: Any) -> ToolResult:
        token = os.getenv("GITHUB_TOKEN")
        if not token: return ToolResult("github.request", False, error="GITHUB_TOKEN is not configured")
        return self._api_request("https://api.github.com" + path, headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"})

    def _gemini_request(self, prompt: str, **_: Any) -> ToolResult:
        if not os.getenv("GOOGLE_API_KEY"): return ToolResult("gemini.request", False, error="GOOGLE_API_KEY is not configured")
        return ToolResult("gemini.request", False, error="Provider adapter not enabled in this local runtime")

    def _security_secrets(self, **_: Any) -> ToolResult:
        patterns = ["BEGIN PRIVATE KEY", "ghp_", "github_pat_", "sk-proj-", "AIza"]
        hits = []
        for p in self.root_dir.rglob("*"):
            if not p.is_file() or any(x in p.parts for x in {"node_modules", ".git", "dist", "build", "__pycache__"}): continue
            try: text = p.read_text(encoding="utf-8", errors="ignore")
            except OSError: continue
            for marker in patterns:
                if marker in text: hits.append({"file": str(p.relative_to(self.root_dir)), "pattern": marker})
        return ToolResult("security.secrets", not hits, {"findings": hits})

    def _security_dependencies(self, **_: Any) -> ToolResult:
        if not (self.root_dir / "package-lock.json").exists(): return ToolResult("security.dependencies", True, {"skipped": "No package-lock.json"})
        return self._command_run("npm audit --omit=dev", timeout=300)

    def _security_headers(self, url: str, **_: Any) -> ToolResult:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "SolarHub-Agent/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            wanted = ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy"]
            return ToolResult("security.headers", True, {h: r.headers.get(h) for h in wanted})

    def _not_configured(self, **_: Any) -> ToolResult: return ToolResult("business.adapter", False, error="Adapter contract registered; external business system is not configured")
    def _media_script(self, title: str, outline: list[str] | None = None, **_: Any) -> ToolResult: return ToolResult("media.script", True, {"title": title, "outline": outline or [], "status": "draft_spec"})
    def _media_job(self, title: str, **_: Any) -> ToolResult: return ToolResult("media.job", True, {"title": title, "status": "job_spec_created"})


if __name__ == "__main__": print(json.dumps(ToolRuntime().list_tools(), indent=2))
