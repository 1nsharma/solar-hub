"""Dual-mode v0.2 harness for the real Ollama repair adapter.

Live mode is exercised when Ollama is reachable. Offline mode is a fail-closed
contract test: the adapter must return structured fallback state and never
mutate files when inference is unavailable.
"""
from __future__ import annotations

import json
import os
import tempfile
import urllib.request
from pathlib import Path

from .llm_repair_metrics import LLMRepairMetrics
from .repair_loop import RepairLoop


def ollama_available(base_url: str) -> bool:
    try:
        with urllib.request.urlopen(base_url.rstrip("/") + "/api/tags", timeout=3) as response:
            return response.status == 200
    except Exception:
        return False


def make_fixture(root: Path) -> None:
    (root / "app.py").write_text("def add(a, b):\n    return a - b\n", encoding="utf-8")


def test_offline_or_live_contract() -> None:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    model = os.getenv("SOLARHUB_ENGINEERING_MODEL", "qwen2.5-coder:7b")
    live = ollama_available(base_url)

    with tempfile.TemporaryDirectory(prefix="solarhub-llm-") as tmp:
        root = Path(tmp)
        make_fixture(root)
        before = (root / "app.py").read_text(encoding="utf-8")
        loop = RepairLoop(root, model=model, base_url=base_url, max_attempts=1)
        result = loop.attempt(
            "Fix add so it returns the sum",
            {"command": "python -c ...", "stderr": "AssertionError: expected 5"},
            ["app.py"],
        )

        after = (root / "app.py").read_text(encoding="utf-8")
        if not live:
            assert result["ok"] is False, result
            assert result.get("offline") is True, result
            assert after == before, "Offline inference must not mutate the workspace"
        else:
            assert result["ok"] is True, result
            assert "return a + b" in after, result

        metrics = LLMRepairMetrics(root)
        event = metrics.record(
            model=model,
            repair_attempts=1,
            execution_time_seconds=0.0,
            tests_before={"ok": False},
            tests_after={"ok": True} if result["ok"] else None,
            model_response=result.get("proposal"),
            files_changed=result.get("applied", {}).get("files", []) if result.get("ok") else [],
            diff_size={"insertions": 0, "deletions": 0},
            security_result={"ok": True, "secrets_found": 0, "blocked_paths": 0},
            repair_success=result["ok"],
            fallback_triggered=not live,
        )
        assert event["fallback_triggered"] is (not live)
        assert metrics.path.exists()
        json.loads(metrics.path.read_text(encoding="utf-8").splitlines()[-1])


if __name__ == "__main__":
    test_offline_or_live_contract()
    print("LLM repair dual-mode harness PASSED")
