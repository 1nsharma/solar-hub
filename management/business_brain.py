"""SolarHub Business Brain - autonomous orchestration core."""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import json
import os
import uuid

AGENT_NAMES = {
    "build": "Build Agent",
    "growth": "Growth Agent",
    "sales": "Sales Agent",
    "operations": "Operations Agent",
    "creative": "Creative Agent",
}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Goal:
    objective: str
    success_metrics: Dict[str, Any] = field(default_factory=dict)
    goal_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "active"
    created_at: str = field(default_factory=now)


class BusinessBrain:
    """Central Observe -> Think -> Plan -> Act -> Verify -> Learn loop."""

    def __init__(self, root_dir: Optional[str] = None):
        self.root_dir = root_dir or os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.memory_dir = os.path.join(os.path.dirname(__file__), "memory")
        os.makedirs(self.memory_dir, exist_ok=True)
        self.events_file = os.path.join(self.memory_dir, "events.jsonl")
        self.goal: Optional[Goal] = None

    def observe(self) -> Dict[str, Any]:
        return {
            "timestamp": now(),
            "root_dir": self.root_dir,
            "active_goal": asdict(self.goal) if self.goal else None,
            "environment": {
                "ai_provider_configured": bool(os.getenv("GOOGLE_API_KEY") or os.getenv("OPENAI_API_KEY")),
                "github_configured": bool(os.getenv("GITHUB_TOKEN")),
            },
        }

    def think(self, objective: str, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "objective": objective,
            "reasoning_mode": "goal_decomposition",
            "strategy": "decompose objective into specialist work, resolve capabilities, execute tools, verify outcomes",
            "context": context,
        }

    def plan(self, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        objective = strategy["objective"]
        text = objective.lower()
        tasks: List[Dict[str, Any]] = []
        if any(k in text for k in ("build", "code", "bug", "feature", "ui", "backend", "test", "deploy")):
            tasks.append({"agent": "build", "objective": objective})
        if any(k in text for k in ("market", "ads", "seo", "growth", "campaign", "lead")):
            tasks.append({"agent": "growth", "objective": objective})
        if any(k in text for k in ("sales", "sell", "outreach", "customer", "closing")):
            tasks.append({"agent": "sales", "objective": objective})
        if any(k in text for k in ("operation", "vendor", "technician", "installation", "amc", "order")):
            tasks.append({"agent": "operations", "objective": objective})
        if any(k in text for k in ("video", "creative", "content", "demo", "thumbnail", "presentation")):
            tasks.append({"agent": "creative", "objective": objective})
        if not tasks:
            tasks.append({"agent": "build", "objective": objective})
        return tasks

    def act(self, tasks: List[Dict[str, Any]], context: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Execute planned work through AgentRuntime -> Capability -> ToolRuntime."""
        try:
            from .agent_runtime import AgentRuntime
        except ImportError:
            from agent_runtime import AgentRuntime
        runtime = AgentRuntime(self.root_dir)
        results = []
        for task in tasks:
            domain = task["agent"]
            execution = runtime.execute(domain, task["objective"], context or {})
            results.append({
                "task_id": execution["task_id"],
                "agent": AGENT_NAMES.get(domain, domain),
                "status": execution["status"],
                "objective": task["objective"],
                "capability": execution["capability"],
                "tool_results": execution["results"],
            })
        return results

    def verify(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        completed = sum(r.get("status") == "completed" for r in results)
        return {
            "ok": bool(results) and completed == len(results),
            "tasks": len(results),
            "completed": completed,
            "pending_or_failed": len(results) - completed,
        }

    def learn(self, objective: str, observation: Dict[str, Any], results: List[Dict[str, Any]], verification: Dict[str, Any]) -> None:
        event = {"timestamp": now(), "type": "business_cycle", "objective": objective, "observation": observation, "results": results, "verification": verification}
        with open(self.events_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(event, ensure_ascii=False) + "\n")

    def run(self, objective: str, success_metrics: Optional[Dict[str, Any]] = None, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        self.goal = Goal(objective=objective, success_metrics=success_metrics or {})
        observation = self.observe()
        strategy = self.think(objective, observation)
        tasks = self.plan(strategy)
        results = self.act(tasks, context)
        verification = self.verify(results)
        self.learn(objective, observation, results, verification)
        return {"goal": asdict(self.goal), "observation": observation, "strategy": strategy, "tasks": tasks, "results": results, "verification": verification}


if __name__ == "__main__":
    brain = BusinessBrain()
    print(json.dumps(brain.run("Inspect SolarHub autonomous business foundation"), indent=2))
