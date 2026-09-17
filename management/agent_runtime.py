"""SolarHub Agent -> Capability -> Tool execution bridge.

The runtime turns specialist plans into explicit tool calls. It is local-first:
local tools can execute without internet; external tools return a structured
failure when connectivity or credentials are missing.
"""
from __future__ import annotations

from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
import json
import uuid

try:
    from .tools.tool_runtime import ToolRuntime
except ImportError:
    from tools.tool_runtime import ToolRuntime


DOMAIN_TO_CAPABILITY = {
    "build": "software_delivery",
    "growth": "growth_research",
    "sales": "sales_operations",
    "operations": "solar_operations",
    "creative": "content_production",
    "security": "security_audit",
    "finance": "finance_analysis",
    "payments": "payment_intelligence",
}


class AgentRuntime:
    """Dispatch specialist work through explicit, auditable tool contracts."""

    def __init__(self, root_dir: str | None = None):
        self.root_dir = Path(root_dir or Path(__file__).resolve().parents[1]).resolve()
        self.tools = ToolRuntime(str(self.root_dir))
        self.events = self.root_dir / "management" / "memory" / "events.jsonl"

    def _event(self, payload: dict[str, Any]) -> None:
        self.events.parent.mkdir(parents=True, exist_ok=True)
        payload = {"timestamp": datetime.now(timezone.utc).isoformat(), **payload}
        with self.events.open("a", encoding="utf-8") as f:
            f.write(json.dumps(payload, ensure_ascii=False) + "\n")

    def required_capability(self, domain: str) -> str:
        return DOMAIN_TO_CAPABILITY.get(domain.lower(), "general_automation")

    def execute(self, domain: str, objective: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        context = context or {}
        task_id = str(uuid.uuid4())
        domain = domain.lower()
        calls = self._build_tool_plan(domain, objective, context)
        results = []
        for call in calls:
            result = self.tools.execute(call["tool"], **call.get("args", {}))
            item = {"tool": call["tool"], "args": call.get("args", {}), "result": asdict(result)}
            results.append(item)
            self._event({"type": "tool_execution", "task_id": task_id, "domain": domain, "objective": objective, **item})
        ok = all(item["result"]["ok"] for item in results) if results else False
        return {"task_id": task_id, "domain": domain, "capability": self.required_capability(domain), "objective": objective, "status": "completed" if ok else "partial_or_failed", "results": results}

    def _build_tool_plan(self, domain: str, objective: str, context: dict[str, Any]) -> list[dict[str, Any]]:
        """Choose safe, deterministic starter tool chains until LLM planning is connected."""
        if domain == "build":
            return [
                {"tool": "git.status"},
                {"tool": "security.secrets"},
                {"tool": "security.dependencies"},
            ]
        if domain == "security":
            return [{"tool": "security.secrets"}, {"tool": "security.dependencies"}]
        if domain == "creative":
            return [{"tool": "media.script", "args": {"title": objective, "outline": context.get("outline", [])}}]
        if domain == "sales":
            return [{"tool": "business.leads"}, {"tool": "business.crm"}]
        if domain == "operations":
            return [{"tool": "business.customer"}, {"tool": "business.inventory"}, {"tool": "business.crm"}]
        if domain == "growth":
            calls = [{"tool": "website.status", "args": {"url": context["url"]}}] if context.get("url") else []
            return calls or [{"tool": "file.list", "args": {"path": "."}}]
        if domain in {"finance", "payments"}:
            return [{"tool": "file.list", "args": {"path": "."}}]
        return [{"tool": "file.list", "args": {"path": "."}}]


if __name__ == "__main__":
    runtime = AgentRuntime()
    print(json.dumps(runtime.execute("build", "Inspect SolarHub build health"), indent=2))
