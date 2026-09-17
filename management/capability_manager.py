"""Capability discovery and installation registry for SolarHub.

The manager separates *knowing a capability exists* from *being able to use it*.
It prefers local/offline capabilities and records external dependencies instead
of pretending that an unavailable provider is working.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any
import json

from tools.tool_runtime import ToolRuntime


@dataclass
class Capability:
    name: str
    description: str
    tools: list[str]
    offline: bool
    status: str = "available"
    requirement: str | None = None


class CapabilityManager:
    def __init__(self, root_dir: str | None = None):
        self.root_dir = Path(root_dir or Path(__file__).resolve().parents[1]).resolve()
        self.registry_path = self.root_dir / "management" / "capabilities.json"
        self.runtime = ToolRuntime(str(self.root_dir))
        self.capabilities = self._load()

    def _load(self) -> dict[str, Capability]:
        if not self.registry_path.exists():
            return {}
        raw = json.loads(self.registry_path.read_text(encoding="utf-8"))
        return {k: Capability(**v) for k, v in raw.items()}

    def register(self, capability: Capability) -> None:
        self.capabilities[capability.name] = capability
        self.registry_path.parent.mkdir(parents=True, exist_ok=True)
        self.registry_path.write_text(json.dumps({k: asdict(v) for k, v in self.capabilities.items()}, indent=2), encoding="utf-8")

    def discover(self, requirement: str) -> list[dict[str, Any]]:
        text = requirement.lower()
        matches = []
        for cap in self.capabilities.values():
            haystack = f"{cap.name} {cap.description} {' '.join(cap.tools)}".lower()
            if any(word in haystack for word in text.split() if len(word) > 2):
                matches.append(asdict(cap))
        return matches

    def can_run_offline(self, capability_name: str) -> bool:
        cap = self.capabilities.get(capability_name)
        return bool(cap and cap.offline and cap.status == "available")

    def plan_install(self, capability_name: str, manager: str | None = None, package: str | None = None) -> dict[str, Any]:
        """Return an installation plan; execution remains an explicit runtime action."""
        cap = self.capabilities.get(capability_name)
        if not cap:
            return {"ok": False, "error": "Unknown capability"}
        if cap.offline:
            return {"ok": True, "action": "use_local", "capability": capability_name}
        if not manager or not package:
            return {"ok": False, "action": "configure_dependency", "requirement": cap.requirement}
        return {"ok": True, "action": "install", "manager": manager, "package": package, "capability": capability_name}


if __name__ == "__main__":
    manager = CapabilityManager()
    print(json.dumps({k: asdict(v) for k, v in manager.capabilities.items()}, indent=2))
