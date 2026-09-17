"""Phase 2 specialist business agents.

These agents expose explicit capability contracts for Growth, Sales,
Operations and Creative work. Real external execution is attached through
SolarHub tools in later phases; the contracts already produce structured
plans that the Business Brain can route and evaluate.
"""

from __future__ import annotations

from typing import Any, Dict, List


class BusinessAgent:
    name = "Business Agent"
    capabilities: List[str] = []

    def run(self, objective: str, context: Dict[str, Any] | None = None) -> Dict[str, Any]:
        context = context or {}
        return {
            "agent": self.name,
            "objective": objective,
            "capabilities": self.capabilities,
            "plan": self.plan(objective, context),
            "status": "planned",
        }

    def plan(self, objective: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        return []


class GrowthAgent(BusinessAgent):
    name = "Growth Agent"
    capabilities = ["market_research", "seo", "advertising", "social_content", "analytics", "experiments"]

    def plan(self, objective: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {"action": "research", "target": "market_and_competitors"},
            {"action": "define", "target": "audience_and_offer"},
            {"action": "create", "target": "campaign_assets"},
            {"action": "measure", "target": "acquisition_metrics"},
            {"action": "iterate", "target": "next_growth_experiment"},
        ]


class SalesAgent(BusinessAgent):
    name = "Sales Agent"
    capabilities = ["lead_qualification", "crm", "outreach", "follow_up", "proposals", "pipeline"]

    def plan(self, objective: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {"action": "identify", "target": "qualified_prospects"},
            {"action": "qualify", "target": "leads"},
            {"action": "personalize", "target": "outreach"},
            {"action": "follow_up", "target": "active_opportunities"},
            {"action": "prepare", "target": "proposal_or_demo"},
            {"action": "measure", "target": "conversion_metrics"},
        ]


class OperationsAgent(BusinessAgent):
    name = "Operations Agent"
    capabilities = ["customers", "vendors", "technicians", "inventory", "orders", "installation", "amc"]

    def plan(self, objective: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {"action": "inspect", "target": "operational_state"},
            {"action": "allocate", "target": "vendors_and_technicians"},
            {"action": "coordinate", "target": "orders_and_installations"},
            {"action": "track", "target": "inventory_and_service"},
            {"action": "measure", "target": "delivery_and_service_metrics"},
        ]


class CreativeAgent(BusinessAgent):
    name = "Creative Agent"
    capabilities = ["scripts", "demo_videos", "ad_creatives", "tutorials", "presentations", "thumbnails"]

    def plan(self, objective: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {"action": "understand", "target": "feature_or_campaign"},
            {"action": "script", "target": "content"},
            {"action": "produce", "target": "visual_and_audio_assets"},
            {"action": "edit", "target": "publishable_asset"},
            {"action": "package", "target": "platform_variants"},
        ]


AGENTS = {
    "growth": GrowthAgent,
    "sales": SalesAgent,
    "operations": OperationsAgent,
    "creative": CreativeAgent,
}
