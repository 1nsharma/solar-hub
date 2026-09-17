"""v0.3 proof harness for live Qwen-Coder repair.

Unlike the v0.2 dual-mode harness, this test is intentionally strict: when
Ollama is unavailable or the requested model is missing, the live proof FAILS.
It proves the complete controlled path without touching the real repository:

  controlled bug -> real test failure -> Qwen -> JSON proposal -> validation
  -> apply -> retest -> security -> diff scope -> PR spec -> cleanup

The fixture is disposable and contains no credentials, deployment workflows,
or production data. Invalid model output and unsafe proposals are exercised as
fail-closed negative cases before the live inference proof.
"""
from __future__ import annotations

import json
import os
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

from .diff_verifier import DiffVerifier
from .repair_loop import RepairLoop
from .security_gate import SecurityGate


DEFAULT_BASE_URL = "http://127.0.0.1:11434"
DEFAULT_MODEL = "qwen2.5-coder:7b"
MAX_ATTEMPTS = 3


def run(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, timeout=30)


def ollama_tags(base_url: str) -> list[str]:
    with urllib.request.urlopen(base_url.rstrip("/") + "/api/tags", timeout=5) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return [str(item.get("name", "")) for item in payload.get("models", [])]


def require_live_ollama(base_url: str, model: str) -> None:
    try:
        models = ollama_tags(base_url)
    except Exception as exc:
        raise AssertionError(
            f"LIVE Qwen proof requires reachable Ollama at {base_url}: {type(exc).__name__}: {exc}"
        ) from exc
    if model not in models:
        raise AssertionError(
            f"LIVE Qwen proof requires model {model!r}; available models: {models or 'none'}"
        )


def make_fixture(root: Path) -> None:
    (root / "app.py").write_text(
        "def add(a, b):\n    return a - b\n",
        encoding="utf-8",
    )
    (root / "test_app.py").write_text(
        "from app import add\n\nassert add(2, 3) == 5\n",
        encoding="utf-8",
    )
    (root / ".gitignore").write_text("__pycache__/\n", encoding="utf-8")
    init = run(["git", "init"], root)
    assert init.returncode == 0, init.stderr
    run(["git", "config", "user.email", "agent-proof@example.invalid"], root)
    run(["git", "config", "user.name", "SolarHub Engineering Proof"], root)
    add = run(["git", "add", "."], root)
    assert add.returncode == 0, add.stderr
    commit = run(["git", "commit", "-m", "fixture baseline"], root)
    assert commit.returncode == 0, commit.stderr


def run_fixture_test(root: Path) -> dict:
    started = time.perf_counter()
    result = run(["python", "test_app.py"], root)
    return {
        "ok": result.returncode == 0,
        "returncode": result.returncode,
        "stdout": result.stdout[-12000:],
        "stderr": result.stderr[-12000:],
        "duration_seconds": round(time.perf_counter() - started, 4),
    }


def test_negative_contracts() -> None:
    """Verify invalid/unsafe proposals cannot mutate the disposable fixture."""
    with tempfile.TemporaryDirectory(prefix="solarhub-v03-negative-") as tmp:
        root = Path(tmp)
        make_fixture(root)
        before = (root / "app.py").read_text(encoding="utf-8")
        loop = RepairLoop(root, max_attempts=MAX_ATTEMPTS)

        for proposal in (
            {"changes": [{"path": ".env", "content": "SECRET=bad"}]},
            {"changes": [{"path": ".github/workflows/pwn.yml", "content": "name: bad"}]},
            {"changes": [{"path": "../escape.py", "content": "bad"}]},
            {"changes": [{"path": "app.py", "content": 123}]},
        ):
            try:
                loop.apply(proposal)
            except (TypeError, ValueError):
                pass
            else:
                raise AssertionError(f"Unsafe proposal was accepted: {proposal}")

        assert (root / "app.py").read_text(encoding="utf-8") == before


def write_pr_spec(root: Path, payload: dict) -> Path:
    target = root / ".solarhub" / "pr_spec.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return target


def live_proof() -> dict:
    base_url = os.getenv("OLLAMA_BASE_URL", DEFAULT_BASE_URL)
    model = os.getenv("SOLARHUB_ENGINEERING_MODEL", DEFAULT_MODEL)
    require_live_ollama(base_url, model)

    cycle_started = time.perf_counter()
    attempts: list[dict] = []

    with tempfile.TemporaryDirectory(prefix="solarhub-v03-live-") as tmp:
        root = Path(tmp)
        make_fixture(root)
        loop = RepairLoop(root, model=model, base_url=base_url, max_attempts=MAX_ATTEMPTS)

        before = run_fixture_test(root)
        assert before["ok"] is False, before

        suite = before
        for attempt_no in range(1, MAX_ATTEMPTS + 1):
            started = time.perf_counter()
            repair = loop.attempt(
                "Fix add(a, b) so it returns the sum of a and b.",
                {"command": "python test_app.py", "failure": suite},
                ["app.py"],
            )
            attempts.append(
                {
                    "attempt": attempt_no,
                    "latency_seconds": round(time.perf_counter() - started, 4),
                    "repair": repair,
                }
            )
            if not repair.get("ok"):
                # A failed/invalid proposal must not be treated as success; the
                # next attempt is allowed, up to the explicit MAX_ATTEMPTS cap.
                continue
            suite = run_fixture_test(root)
            if suite["ok"]:
                break

        assert suite["ok"] is True, {
            "message": "Qwen did not repair the controlled failure within max_attempts",
            "attempts": attempts,
            "final_test": suite,
        }
        assert "return a + b" in (root / "app.py").read_text(encoding="utf-8")

        security = SecurityGate(root).run()
        assert security["ok"] is True, security

        diff = DiffVerifier(root).verify(["app.py"])
        assert diff["ok"] is True, diff
        assert diff["files"] == ["app.py"], diff
        assert not diff["unexpected_files"], diff

        pr_spec = write_pr_spec(
            root,
            {
                "schema": "solarhub.pr-spec.v0.3",
                "cycle": "live-qwen-proof",
                "model": model,
                "objective": "Fix add(a, b) so it returns the sum of a and b.",
                "verified": True,
                "tests_before": before,
                "tests_after": suite,
                "security": security,
                "diff": {k: v for k, v in diff.items() if k != "diff"},
                "attempts": len(attempts),
                "files_changed": diff["files"],
                "execution_time_seconds": round(time.perf_counter() - cycle_started, 4),
            },
        )
        assert pr_spec.exists()
        payload = json.loads(pr_spec.read_text(encoding="utf-8"))
        assert payload["verified"] is True
        assert payload["files_changed"] == ["app.py"]

        return {
            "ok": True,
            "model": model,
            "attempts": len(attempts),
            "tests_before": before,
            "tests_after": suite,
            "security": security,
            "diff": {k: v for k, v in diff.items() if k != "diff"},
            "pr_spec": str(pr_spec),
            "execution_time_seconds": round(time.perf_counter() - cycle_started, 4),
        }


def main() -> None:
    test_negative_contracts()
    result = live_proof()
    print("LIVE QWEN REPAIR v0.3 PROOF PASSED")
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
