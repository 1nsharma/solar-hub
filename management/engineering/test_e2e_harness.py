"""Deterministic end-to-end contract harness for Autonomous Engineering Agent v0.1.

This harness intentionally does not mutate SolarHub master. It creates a tiny,
self-contained fixture repository, injects a failing test, runs the same
workspace/build/security/diff/PR-spec primitives used by the engineering loop,
then verifies repair, commit, artifact generation, and teardown.

The default repair is deterministic so CI/local verification does not require
Ollama or network access. Live Ollama repair remains exercised by repair_loop's
own adapter when configured.
"""
from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

from .build_test_executor import BuildTestExecutor
from .diff_verifier import DiffVerifier
from .pr_bridge import PRBridge
from .security_gate import SecurityGate
from .workspace_manager import WorkspaceManager


def run(*args: str, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=cwd, text=True, capture_output=True)


def make_fixture(root: Path) -> None:
    run("git", "init", "-b", "master", cwd=root)
    (root / "app.py").write_text("def add(a, b):\n    return a - b\n", encoding="utf-8")
    (root / "test_app.py").write_text(
        "from app import add\n\ndef test_add():\n    assert add(2, 3) == 5\n",
        encoding="utf-8",
    )
    (root / "run_tests.py").write_text(
        'import sys\nsys.path.insert(0, ".")\nfrom test_app import test_add\ntest_add()\nprint("fixture tests passed")\n',
        encoding="utf-8",
    )
    assert run("git", "add", ".", cwd=root).returncode == 0
    assert run("git", "-c", "user.email=agent@example.invalid", "-c", "user.name=SolarHub Agent", "commit", "-m", "fixture", cwd=root).returncode == 0


def repair_fixture(workspace: Path) -> None:
    path = workspace / "app.py"
    text = path.read_text(encoding="utf-8")
    assert "return a - b" in text
    path.write_text(text.replace("return a - b", "return a + b"), encoding="utf-8")
    # Clear Python bytecode cache to ensure fresh import
    for pycache in workspace.rglob("__pycache__"):
        if pycache.is_dir():
            import shutil
            shutil.rmtree(pycache, ignore_errors=True)


def test_full_e2e_harness() -> None:
    with tempfile.TemporaryDirectory(prefix="solarhub-e2e-") as tmp:
        root = Path(tmp) / "fixture"
        root.mkdir()
        make_fixture(root)
        manager = WorkspaceManager(root)
        workspace = manager.create(base_ref="master", task_id="e2e-fixture")
        try:
            executor = BuildTestExecutor(workspace.path)
            first = executor.run(["python run_tests.py"])
            assert not first.ok, first

            # Deterministic contract repair: validates the same mutation/retest
            # boundary without depending on a running local model.
            repair_fixture(workspace.path)
            second = executor.run(["python run_tests.py"])
            assert second.ok, second

            gate = SecurityGate(workspace.path)
            security = gate.run()
            assert security.ok, security

            verifier = DiffVerifier(workspace.path)
            report = verifier.verify(expected_paths=["app.py"])
            assert report.ok, report

            bridge = PRBridge(workspace.path)
            spec = bridge.create_spec(
                objective="Repair deterministic fixture test failure",
                report=report,
                verification={"initial_test": first.to_dict(), "final_test": second.to_dict(), "security": security.to_dict()},
            )
            assert spec["ok"] is True
            artifact = Path(spec["artifact"])
            assert artifact.exists()
            payload = json.loads(artifact.read_text(encoding="utf-8"))
            assert payload["objective"] == "Repair deterministic fixture test failure"

            commit = run("git", "-c", "user.email=agent@example.invalid", "-c", "user.name=SolarHub Agent", "add", "app.py", cwd=workspace.path)
            assert commit.returncode == 0, commit.stderr
            commit = run("git", "-c", "user.email=agent@example.invalid", "-c", "user.name=SolarHub Agent", "commit", "-m", "fix(test): repair fixture arithmetic", cwd=workspace.path)
            assert commit.returncode == 0, commit.stderr
            assert run("git", "status", "--porcelain", cwd=root).stdout == ""
        finally:
            manager.cleanup(workspace)

        assert not workspace.path.exists()
        assert "e2e-fixture" not in run("git", "worktree", "list", cwd=root).stdout
        assert run("git", "status", "--porcelain", cwd=root).stdout == ""


if __name__ == "__main__":
    test_full_e2e_harness()
    print("Full E2E engineering harness PASSED")
