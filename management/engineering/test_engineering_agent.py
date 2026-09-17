"""Lightweight contract tests for engineering safety primitives."""
from pathlib import Path
import tempfile
import subprocess

from workspace_manager import WorkspaceManager
from security_gate import SecurityGate
from diff_verifier import DiffVerifier


def git(cwd: Path, *args: str) -> str:
    p = subprocess.run(["git", *args], cwd=cwd, text=True, capture_output=True)
    assert p.returncode == 0, p.stderr
    return p.stdout.strip()


def test_workspace_isolation_and_cleanup():
    with tempfile.TemporaryDirectory() as raw:
        repo = Path(raw)
        git(repo, "init")
        git(repo, "config", "user.email", "agent@test.local")
        git(repo, "config", "user.name", "SolarHub Agent")
        (repo / "README.md").write_text("base\n", encoding="utf-8")
        git(repo, "add", "README.md")
        git(repo, "commit", "-m", "init")
        manager = WorkspaceManager(repo)
        workspace = manager.create(task_id="contract-test")
        assert workspace.path != repo
        assert (workspace.path / "README.md").read_text(encoding="utf-8") == "base\n"
        (workspace.path / "README.md").write_text("agent\n", encoding="utf-8")
        assert (repo / "README.md").read_text(encoding="utf-8") == "base\n"
        manager.cleanup(workspace)
        assert not workspace.path.exists()


def test_security_gate_blocks_env_and_detects_private_key(tmp_path: Path):
    subprocess.run(["git", "init"], cwd=tmp_path, check=True, capture_output=True)
    (tmp_path / ".env").write_text("TOKEN=x\n", encoding="utf-8")
    (tmp_path / "secret.txt").write_text("-----BEGIN PRIVATE KEY-----\n", encoding="utf-8")
    gate = SecurityGate(tmp_path)
    # Files are uncommitted, therefore diff-based scanning intentionally sees no changes.
    # This contract test checks the explicit blocked-path helper independently.
    assert ".env" in gate.blocked_changes([".env"])
    assert gate.scan_secrets(["secret.txt"])


def test_diff_verifier_requires_changes(tmp_path: Path):
    subprocess.run(["git", "init"], cwd=tmp_path, check=True, capture_output=True)
    git(tmp_path, "config", "user.email", "agent@test.local")
    git(tmp_path, "config", "user.name", "SolarHub Agent")
    (tmp_path / "a.txt").write_text("one\n", encoding="utf-8")
    git(tmp_path, "add", "a.txt")
    git(tmp_path, "commit", "-m", "init")
    (tmp_path / "a.txt").write_text("two\n", encoding="utf-8")
    result = DiffVerifier(tmp_path).verify(["a.txt"])
    assert result["ok"]
    assert result["files"] == ["a.txt"]
