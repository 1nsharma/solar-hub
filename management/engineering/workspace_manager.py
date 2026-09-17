"""Disposable Git worktree lifecycle for autonomous engineering tasks."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import shutil
import subprocess
import uuid


@dataclass
class Workspace:
    path: Path
    branch: str
    base_ref: str


class WorkspaceManager:
    """Create isolated worktrees without changing the caller's checked-out branch."""

    def __init__(self, repo_root: str | Path):
        self.repo_root = Path(repo_root).resolve()
        if not (self.repo_root / ".git").exists():
            raise ValueError(f"Not a Git repository: {self.repo_root}")
        self.parent = self.repo_root.parent / ".solarhub-agent-workspaces"
        self.parent.mkdir(parents=True, exist_ok=True)

    def _run(self, *args: str, cwd: Path | None = None) -> str:
        p = subprocess.run(args, cwd=cwd or self.repo_root, text=True, capture_output=True)
        if p.returncode:
            raise RuntimeError(f"{' '.join(args)} failed: {p.stderr.strip() or p.stdout.strip()}")
        return p.stdout.strip()

    def create(self, base_ref: str = "HEAD", task_id: str | None = None) -> Workspace:
        token = task_id or uuid.uuid4().hex[:12]
        branch = f"agent/task-{token}"
        path = (self.parent / token).resolve()
        if self.repo_root in path.parents or path == self.repo_root:
            raise ValueError("Unsafe workspace path")
        if path.exists():
            shutil.rmtree(path)
        self._run("git", "worktree", "add", "--detach", str(path), base_ref)
        self._run("git", "switch", "-c", branch, cwd=path)
        return Workspace(path=path, branch=branch, base_ref=base_ref)

    def cleanup(self, workspace: Workspace) -> None:
        path = workspace.path.resolve()
        if self.repo_root in path.parents or path == self.repo_root:
            raise ValueError("Refusing to remove repository root")
        subprocess.run(["git", "worktree", "remove", "--force", str(path)], cwd=self.repo_root, text=True, capture_output=True)
        if path.exists():
            shutil.rmtree(path, ignore_errors=True)
        subprocess.run(["git", "branch", "-D", workspace.branch], cwd=self.repo_root, text=True, capture_output=True)
        self._run("git", "worktree", "prune")
