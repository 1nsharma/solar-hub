"""Append-only metrics for autonomous LLM repair cycles."""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import json
import uuid


class LLMRepairMetrics:
    def __init__(self, root_dir: str | Path):
        self.root = Path(root_dir).resolve()
        self.path = self.root / "management" / "memory" / "llm_repair_metrics.jsonl"

    def record(self, *, model: str, repair_attempts: int, execution_time_seconds: float,
               tests_before: dict, tests_after: dict | None, model_response: dict | None,
               files_changed: list[str], diff_size: dict, security_result: dict,
               repair_success: bool, fallback_triggered: bool, cycle_id: str | None = None) -> dict:
        event = {
            "cycle_id": cycle_id or uuid.uuid4().hex[:12],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "model": model,
            "repair_attempts": repair_attempts,
            "execution_time_seconds": round(max(0.0, execution_time_seconds), 3),
            "tests_before": tests_before,
            "tests_after": tests_after,
            "model_response": model_response,
            "files_changed": files_changed,
            "diff_size": diff_size,
            "security_result": security_result,
            "repair_success": repair_success,
            "fallback_triggered": fallback_triggered,
        }
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event, ensure_ascii=False) + "\n")
        return event
