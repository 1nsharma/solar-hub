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
    "pm": "software_delivery",
    "project_manager": "software_delivery",
    "designer": "content_production",
    "ui_ux_designer": "content_production",
    "qa": "software_delivery",
    "qa_tester": "software_delivery",
    "backend": "software_delivery",
    "backend_developer": "software_delivery",
    "growth": "growth_research",
    "growth_agent": "growth_research",
    "sales": "sales_operations",
    "sales_agent": "sales_operations",
    "operations": "solar_operations",
    "operations_agent": "solar_operations",
    "creative": "content_production",
    "creative_agent": "content_production",
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
        self.strategies_path = self.root_dir / "management" / "memory" / "strategies.json"
        self.goals_path = self.root_dir / "management" / "memory" / "goals.json"
        self.strategies = self._load_strategies()

    def _load_strategies(self) -> dict[str, Any]:
        if self.strategies_path.exists():
            try:
                return json.loads(self.strategies_path.read_text(encoding="utf-8"))
            except Exception:
                return {}
        return {}

    def _event(self, payload: dict[str, Any]) -> None:
        self.events.parent.mkdir(parents=True, exist_ok=True)
        payload = {"timestamp": datetime.now(timezone.utc).isoformat(), **payload}
        with self.events.open("a", encoding="utf-8") as f:
            f.write(json.dumps(payload, ensure_ascii=False) + "\n")

    def required_capability(self, domain: str) -> str:
        key = domain.lower()
        if key in self.strategies:
            return self.strategies[key].get("capability", "general_automation")
        return DOMAIN_TO_CAPABILITY.get(key, "general_automation")

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
        """Choose tool chains dynamically from strategies or safe deterministic defaults."""
        for strat in self.strategies.values():
            if strat.get("domain") == domain and "plan_template" in strat:
                template = strat["plan_template"]
                plan = []
                for step in template:
                    args = dict(step.get("args", {}))
                    if step.get("tool") == "media.script" and "outline" in context:
                        args["outline"] = context["outline"]
                    if step.get("tool") == "website.status" and "url" in context:
                        args["url"] = context["url"]
                    plan.append({"tool": step["tool"], "args": args})
                return plan

        if domain in {"build", "pm", "project_manager"}:
            return [
                {"tool": "git.status"},
                {"tool": "git.log", "args": {"limit": 5}},
            ]
        if domain in {"qa", "qa_tester"}:
            return [{"tool": "git.status"}, {"tool": "security.dependencies"}]
        if domain in {"backend", "backend_developer"}:
            return [{"tool": "file.list", "args": {"path": "apps/backend"}}, {"tool": "security.secrets"}]
        if domain in {"designer", "ui_ux_designer"}:
            return [{"tool": "file.list", "args": {"path": "apps/mobile/components/persona"}}]
        if domain == "security":
            return [{"tool": "security.secrets"}, {"tool": "security.dependencies"}]
        if domain in {"creative", "creative_agent"}:
            return [{"tool": "media.script", "args": {"title": objective, "outline": context.get("outline", [])}}]
        if domain in {"sales", "sales_agent"}:
            return [{"tool": "business.leads"}, {"tool": "business.crm"}]
        if domain in {"operations", "operations_agent"}:
            return [{"tool": "business.customer"}, {"tool": "business.inventory"}, {"tool": "business.crm"}]
        if domain in {"growth", "growth_agent"}:
            calls = [{"tool": "website.status", "args": {"url": context["url"]}}] if context.get("url") else []
            return calls or [{"tool": "file.list", "args": {"path": "."}}]
        if domain in {"finance", "payments"}:
            return [{"tool": "file.list", "args": {"path": "."}}]
        return [{"tool": "file.list", "args": {"path": "."}}]


if __name__ == "__main__":
    runtime = AgentRuntime()
    print(json.dumps(runtime.execute("build", "Inspect SolarHub build health"), indent=2))
