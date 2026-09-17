"""Autonomous Engineering Agent v0.1 orchestration."""
from __future__ import annotations

from pathlib import Path
import subprocess
import uuid

from .build_test_executor import BuildTestExecutor
from .diff_verifier import DiffVerifier
from .pr_bridge import PRBridge
from .repair_loop import RepairLoop
from .security_gate import SecurityGate
from .workspace_manager import WorkspaceManager


class EngineeringLoop:
    """Run code changes only inside a disposable worktree and deliver verified work."""

    def __init__(self, repo_root: str | Path, max_attempts: int = 3, timeout: int = 180):
        self.repo_root = Path(repo_root).resolve()
        self.max_attempts = max(1, min(max_attempts, 5))
        self.timeout = timeout

    def _status_clean(self) -> bool:
        p = subprocess.run(["git", "status", "--porcelain"], cwd=self.repo_root, text=True, capture_output=True)
        return p.returncode == 0 and not p.stdout.strip()

    def run(self, objective: str, allowed_paths: list[str] | None = None, checks: list[str] | None = None) -> dict:
        cycle_id = uuid.uuid4().hex[:12]
        manager = WorkspaceManager(self.repo_root)
        if not self._status_clean():
            return {"ok": False, "cycle_id": cycle_id, "stage": "preflight", "error": "Main working tree is not clean; refusing autonomous mutation"}
        workspace = None
        attempts = []
        try:
            workspace = manager.create(task_id=cycle_id)
            executor = BuildTestExecutor(workspace.path, self.timeout)
            repair = RepairLoop(workspace.path, max_attempts=self.max_attempts)
            selected = checks or ["release:check"]
            suite = executor.run_suite(selected)
            attempt = 0
            while not suite["ok"] and attempt < self.max_attempts:
                attempt += 1
                failures = [r for r in suite["results"] if not r["ok"]]
                files = []
                for f in subprocess.check_output(["git", "diff", "--name-only", "HEAD"], cwd=workspace.path, text=True).splitlines():
                    files.append(f)
                repair_result = repair.attempt(objective, {"failures": failures}, files)
                attempts.append({"attempt": attempt, "repair": repair_result})
                if not repair_result["ok"]:
                    break
                suite = executor.run_suite(selected)
            if not suite["ok"]:
                return {"ok": False, "cycle_id": cycle_id, "stage": "build_test_fix", "attempts": attempts, "tests": suite}
            security = SecurityGate(workspace.path).run()
            if not security["ok"]:
                return {"ok": False, "cycle_id": cycle_id, "stage": "security", "attempts": attempts, "tests": suite, "security": security}
            diff = DiffVerifier(workspace.path).verify(allowed_paths)
            if not diff["ok"]:
                return {"ok": False, "cycle_id": cycle_id, "stage": "diff_verification", "attempts": attempts, "tests": suite, "security": security, "diff": diff}
            message = f"fix(engineering): {objective[:60]}"
            bridge = PRBridge(workspace.path, self.repo_root)
            commit = bridge.commit(message)
            body = "\n".join([
                "## Autonomous Engineering Agent v0.1",
                f"**Objective:** {objective}",
                "",
                "### Verification",
                f"- Tests/build: PASS ({', '.join(selected)})",
                "- Security gate: PASS",
                f"- Changed files: {len(diff['files'])}",
                f"- Repair attempts: {len(attempts)}",
                "",
                "### Diff",
                f"```text\n{diff['stat']}\n```",
            ])
            pr = bridge.create_pr(workspace.branch, message, body)
            return {"ok": True, "cycle_id": cycle_id, "stage": "delivered", "branch": workspace.branch, "commit": commit, "tests": suite, "security": security, "diff": {k: v for k, v in diff.items() if k != "diff"}, "attempts": attempts, "pr": pr}
        finally:
            if workspace:
                manager.cleanup(workspace)
