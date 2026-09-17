"""
SolarHub Business Brain
=======================

The central autonomous orchestrator for SolarHub's business operations.

Implements the core loop:
  Observe → Think → Plan → Act → Verify → Learn

Business Domains:
  - BUILD: Product development (UI/UX, Backend, Database, APIs, Testing)
  - GROWTH: Marketing (SEO, Ads, Content, Social, Analytics)
  - SALES: Revenue generation (Leads, Outreach, CRM, Proposals, Closing)
  - OPERATIONS: Business operations (Customers, Vendors, Technicians, Inventory, Payments)
  - CREATIVE: Content creation (Videos, Presentations, Graphics, Tutorials)
"""

import os
import json
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from enum import Enum


class BusinessDomain(Enum):
    BUILD = "BUILD"
    GROWTH = "GROWTH"
    SALES = "SALES"
    OPERATIONS = "OPERATIONS"
    CREATIVE = "CREATIVE"


class LoopPhase(Enum):
    OBSERVE = "OBSERVE"
    THINK = "THINK"
    PLAN = "PLAN"
    ACT = "ACT"
    VERIFY = "VERIFY"
    LEARN = "LEARN"


class BusinessEvent:
    """Represents a business event in the memory system."""
    
    def __init__(self, event_type: str, domain: BusinessDomain, data: Dict[str, Any]):
        self.id = f"{int(time.time() * 1000)}"
        self.timestamp = datetime.utcnow().isoformat()
        self.event_type = event_type
        self.domain = domain.value
        self.data = data
        self.outcome: Optional[str] = None
        self.metrics: Dict[str, Any] = {}
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "domain": self.domain,
            "data": self.data,
            "outcome": self.outcome,
            "metrics": self.metrics
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BusinessEvent':
        event = cls(
            event_type=data["event_type"],
            domain=BusinessDomain(data["domain"]),
            data=data["data"]
        )
        event.id = data["id"]
        event.timestamp = data["timestamp"]
        event.outcome = data.get("outcome")
        event.metrics = data.get("metrics", {})
        return event
    
    def _json_serial(self, obj):
        """JSON serializer for objects not serializable by default json code"""
        if isinstance(obj, BusinessDomain):
            return obj.value
        raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


class BusinessMemory:
    """
    Persistent memory system for SolarHub's business context.
    
    Stores:
    - Events (actions taken, outcomes)
    - Goals (current and historical)
    - Strategies (what worked, what didn't)
    - Metrics (business KPIs)
    """
    
    def __init__(self, memory_dir: str = None):
        if memory_dir is None:
            memory_dir = os.path.join(os.path.dirname(__file__), 'memory')
        
        self.memory_dir = memory_dir
        os.makedirs(memory_dir, exist_ok=True)
        
        self.events_file = os.path.join(memory_dir, 'events.jsonl')
        self.goals_file = os.path.join(memory_dir, 'goals.json')
        self.strategies_file = os.path.join(memory_dir, 'strategies.json')
        self.metrics_file = os.path.join(memory_dir, 'metrics.json')
        
        # Initialize files if they don't exist
        self._init_files()
    
    def _init_files(self):
        """Initialize memory files with empty structures if needed."""
        if not os.path.exists(self.goals_file):
            with open(self.goals_file, 'w') as f:
                json.dump({"active": [], "completed": [], "archived": []}, f, indent=2)
        
        if not os.path.exists(self.strategies_file):
            with open(self.strategies_file, 'w') as f:
                json.dump({"by_domain": {}, "learnings": []}, f, indent=2)
        
        if not os.path.exists(self.metrics_file):
            with open(self.metrics_file, 'w') as f:
                json.dump({
                    "last_updated": datetime.utcnow().isoformat(),
                    "domains": {d.value: {} for d in BusinessDomain}
                }, f, indent=2)
    
    def record_event(self, event: BusinessEvent):
        """Persist an event to the event log."""
        with open(self.events_file, 'a') as f:
            f.write(json.dumps(event.to_dict(), default=lambda o: str(o) if hasattr(o, 'value') else str(o)) + '\n')
    
    def get_recent_events(self, limit: int = 50, domain: Optional[BusinessDomain] = None) -> List[BusinessEvent]:
        """Retrieve recent events, optionally filtered by domain."""
        events = []
        if os.path.exists(self.events_file):
            with open(self.events_file, 'r') as f:
                for line in f:
                    if line.strip():
                        event_data = json.loads(line)
                        if domain is None or event_data["domain"] == domain.value:
                            events.append(BusinessEvent.from_dict(event_data))
        
        # Sort by timestamp descending and limit
        events.sort(key=lambda e: e.timestamp, reverse=True)
        return events[:limit]
    
    def get_active_goals(self) -> List[Dict[str, Any]]:
        """Retrieve active business goals."""
        with open(self.goals_file, 'r') as f:
            data = json.load(f)
        return data.get("active", [])
    
    def add_goal(self, goal: Dict[str, Any]):
        """Add a new active goal."""
        with open(self.goals_file, 'r') as f:
            data = json.load(f)
        
        goal["created_at"] = datetime.utcnow().isoformat()
        goal["status"] = "active"
        data["active"].append(goal)
        
        with open(self.goals_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def complete_goal(self, goal_id: str, outcome: Dict[str, Any]):
        """Mark a goal as completed with outcome data."""
        with open(self.goals_file, 'r') as f:
            data = json.load(f)
        
        for i, goal in enumerate(data["active"]):
            if goal.get("id") == goal_id:
                goal["status"] = "completed"
                goal["outcome"] = outcome
                goal["completed_at"] = datetime.utcnow().isoformat()
                data["completed"].append(data["active"].pop(i))
                break
        
        with open(self.goals_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_strategy(self, domain: BusinessDomain) -> Dict[str, Any]:
        """Get current strategy for a domain."""
        with open(self.strategies_file, 'r') as f:
            data = json.load(f)
        return data.get("by_domain", {}).get(domain.value, {"tactics": [], "effectiveness": []})
    
    def update_strategy(self, domain: BusinessDomain, strategy: Dict[str, Any]):
        """Update strategy for a domain."""
        with open(self.strategies_file, 'r') as f:
            data = json.load(f)
        
        if "by_domain" not in data:
            data["by_domain"] = {}
        
        data["by_domain"][domain.value] = strategy
        data["learnings"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "domain": domain.value,
            "change": "strategy_update"
        })
        
        with open(self.strategies_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def update_metrics(self, domain: BusinessDomain, metrics: Dict[str, Any]):
        """Update metrics for a domain."""
        with open(self.metrics_file, 'r') as f:
            data = json.load(f)
        
        data["last_updated"] = datetime.utcnow().isoformat()
        data["domains"][domain.value].update(metrics)
        
        with open(self.metrics_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_context(self, domain: Optional[BusinessDomain] = None) -> Dict[str, Any]:
        """
        Get comprehensive business context for decision making.
        
        Returns:
        - Active goals
        - Recent events
        - Current strategies
        - Latest metrics
        """
        context = {
            "timestamp": datetime.utcnow().isoformat(),
            "goals": self.get_active_goals(),
            "recent_events": [e.to_dict() for e in self.get_recent_events(limit=20, domain=domain)],
            "strategies": {},
            "metrics": {}
        }
        
        if domain:
            context["strategies"][domain.value] = self.get_strategy(domain)
            with open(self.metrics_file, 'r') as f:
                all_metrics = json.load(f)
            context["metrics"][domain.value] = all_metrics.get("domains", {}).get(domain.value, {})
        else:
            with open(self.strategies_file, 'r') as f:
                strategies_data = json.load(f)
            context["strategies"] = strategies_data.get("by_domain", {})
            
            with open(self.metrics_file, 'r') as f:
                metrics_data = json.load(f)
            context["metrics"] = metrics_data.get("domains", {})
        
        return context


class BusinessBrain:
    """
    The central autonomous orchestrator for SolarHub.
    
    Responsible for:
    1. Observing business state and environment
    2. Thinking about opportunities and threats
    3. Planning actions and strategies
    4. Acting through specialist agents
    5. Verifying outcomes
    6. Learning and improving
    """
    
    def __init__(self, memory_dir: str = None):
        self.memory = BusinessMemory(memory_dir)
        self.current_phase: Optional[LoopPhase] = None
        self.running = False
    
    def observe(self, domain: Optional[BusinessDomain] = None) -> Dict[str, Any]:
        """
        OBSERVE phase: Gather information about business state.
        
        Collects:
        - Internal metrics (revenue, orders, leads, etc.)
        - External signals (market trends, competitor activity)
        - System health (errors, performance)
        - Recent events and their outcomes
        """
        print(f"[BusinessBrain.OBSERVE] Gathering business intelligence...")
        
        context = self.memory.get_context(domain)
        
        # TODO: Integrate with actual business data sources
        # - Database queries for revenue, orders, customers
        # - External APIs for market data
        # - System monitoring for errors/performance
        
        observation = {
            "timestamp": datetime.utcnow().isoformat(),
            "context": context,
            "signals": [],
            "anomalies": []
        }
        
        # Analyze for anomalies
        if context["goals"]:
            observation["signals"].append(f"{len(context['goals'])} active goals in progress")
        
        if context["recent_events"]:
            observation["signals"].append(f"{len(context['recent_events'])} recent business events")
        
        return observation
    
    def think(self, observation: Dict[str, Any]) -> Dict[str, Any]:
        """
        THINK phase: Analyze observations and identify opportunities.
        
        Processes:
        - Pattern recognition in business data
        - Opportunity identification
        - Risk assessment
        - Priority determination
        """
        print(f"[BusinessBrain.THINK] Analyzing business state...")
        
        analysis = {
            "timestamp": datetime.utcnow().isoformat(),
            "opportunities": [],
            "risks": [],
            "priorities": [],
            "recommendations": []
        }
        
        # TODO: Implement AI-powered analysis
        # For now, basic heuristic analysis
        
        goals = observation["context"].get("goals", [])
        if not goals:
            analysis["opportunities"].append({
                "type": "goal_setting",
                "description": "No active goals detected. Set strategic objectives.",
                "priority": "high"
            })
            analysis["recommendations"].append("Define quarterly business goals")
        
        events = observation["context"].get("recent_events", [])
        failed_events = [e for e in events if e.get("outcome") == "failed"]
        if failed_events:
            analysis["risks"].append({
                "type": "execution_failure",
                "description": f"{len(failed_events)} recent failed actions",
                "priority": "medium"
            })
            analysis["recommendations"].append("Review and adjust execution strategy")
        
        return analysis
    
    def plan(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        PLAN phase: Create actionable plans based on analysis.
        
        Produces:
        - Specific tasks with owners
        - Resource requirements
        - Success criteria
        - Timeline estimates
        """
        print(f"[BusinessBrain.PLAN] Creating action plan...")
        
        plan = {
            "timestamp": datetime.utcnow().isoformat(),
            "tasks": [],
            "resources_needed": [],
            "success_criteria": [],
            "timeline": {}
        }
        
        # Convert recommendations into tasks
        for i, rec in enumerate(analysis.get("recommendations", [])):
            task = {
                "id": f"task_{int(time.time())}_{i}",
                "description": rec,
                "domain": self._infer_domain(rec),
                "priority": "medium",
                "status": "pending",
                "assigned_to": None,
                "estimated_duration": "1h"
            }
            plan["tasks"].append(task)
        
        # Define success criteria
        if plan["tasks"]:
            plan["success_criteria"].append("All planned tasks completed")
            plan["success_criteria"].append("Measurable business impact")
        
        return plan
    
    def _infer_domain(self, description: str) -> BusinessDomain:
        """Infer business domain from task description."""
        desc_lower = description.lower()
        
        if any(kw in desc_lower for kw in ["build", "develop", "code", "ui", "backend", "test"]):
            return BusinessDomain.BUILD
        elif any(kw in desc_lower for kw in ["market", "seo", "ads", "content", "social", "growth"]):
            return BusinessDomain.GROWTH
        elif any(kw in desc_lower for kw in ["sale", "lead", "crm", "outreach", "proposal", "close"]):
            return BusinessDomain.SALES
        elif any(kw in desc_lower for kw in ["operat", "customer", "vendor", "inventory", "payment"]):
            return BusinessDomain.OPERATIONS
        elif any(kw in desc_lower for kw in ["creative", "video", "design", "graphic", "presentation"]):
            return BusinessDomain.CREATIVE
        else:
            return BusinessDomain.OPERATIONS  # Default
    
    def act(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        ACT phase: Execute the plan through specialist agents.
        
        Executes:
        - Task delegation to appropriate agents
        - Tool invocation
        - Progress tracking
        """
        print(f"[BusinessBrain.ACT] Executing plan...")
        
        # Import agent runtime for actual execution
        from agent_runtime import AgentRuntime, AgentTask
        
        runtime = AgentRuntime()
        execution = runtime.execute_plan(plan)
        
        # Record events for each task
        for task_id, output in execution.get("outputs", {}).items():
            task_data = next((t for t in plan.get("tasks", []) if t.get("id") == task_id), {})
            domain = self._infer_domain(task_data.get("description", ""))
            
            event = BusinessEvent(
                event_type="task_execution",
                domain=domain,
                data={"task_id": task_id, "task": task_data, "output": output}
            )
            self.memory.record_event(event)
        
        return execution
    
    def verify(self, execution: Dict[str, Any], plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        VERIFY phase: Check if execution met success criteria.
        
        Validates:
        - Task completion status
        - Quality of outputs
        - Alignment with success criteria
        """
        print(f"[BusinessBrain.VERIFY] Validating execution...")
        
        verification = {
            "timestamp": datetime.utcnow().isoformat(),
            "success": True,
            "metrics": {},
            "gaps": [],
            "notes": []
        }
        
        # Check if all tasks completed
        planned_tasks = len(plan.get("tasks", []))
        completed_tasks = len(execution.get("completed_tasks", []))
        failed_tasks = len(execution.get("failed_tasks", []))
        
        verification["metrics"]["completion_rate"] = completed_tasks / max(planned_tasks, 1)
        verification["metrics"]["failure_rate"] = failed_tasks / max(planned_tasks, 1)
        
        if completed_tasks < planned_tasks:
            verification["success"] = False
            verification["gaps"].append(f"{planned_tasks - completed_tasks} tasks not completed")
        
        if failed_tasks > 0:
            verification["success"] = False
            verification["notes"].append(f"{failed_tasks} tasks failed during execution")
        
        if verification["success"]:
            verification["notes"].append("All planned tasks executed successfully")
        
        return verification
    
    def learn(self, verification: Dict[str, Any], execution: Dict[str, Any], plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        LEARN phase: Extract learnings and improve strategy.
        
        Updates:
        - Strategy effectiveness scores
        - Best practices database
        - Future planning heuristics
        """
        print(f"[BusinessBrain.LEARN] Extracting learnings...")
        
        learning = {
            "timestamp": datetime.utcnow().isoformat(),
            "insights": [],
            "strategy_updates": [],
            "next_iteration_improvements": []
        }
        
        # Analyze verification results
        if verification["success"]:
            learning["insights"].append("Execution strategy was effective")
            learning["next_iteration_improvements"].append("Maintain current approach")
        else:
            learning["insights"].append("Execution gaps identified")
            for gap in verification.get("gaps", []):
                learning["insights"].append(f"Gap: {gap}")
            learning["next_iteration_improvements"].append("Review task estimation and resource allocation")
        
        # Update strategies
        domains_affected = set()
        for task in plan.get("tasks", []):
            domains_affected.add(task["domain"])
        
        for domain in domains_affected:
            current_strategy = self.memory.get_strategy(domain)
            effectiveness = 1.0 if verification["success"] else 0.5
            
            current_strategy.setdefault("effectiveness", []).append({
                "timestamp": datetime.utcnow().isoformat(),
                "score": effectiveness,
                "context": f"Plan with {len(plan['tasks'])} tasks"
            })
            
            # Keep only last 10 effectiveness records
            current_strategy["effectiveness"] = current_strategy["effectiveness"][-10:]
            
            self.memory.update_strategy(domain, current_strategy)
            learning["strategy_updates"].append(f"Updated {domain.value} strategy effectiveness")
        
        return learning
    
    def run_cycle(self, domain: Optional[BusinessDomain] = None) -> Dict[str, Any]:
        """
        Execute one complete Observe → Think → Plan → Act → Verify → Learn cycle.
        
        Returns comprehensive report of the cycle.
        """
        print("\n" + "="*60)
        print("  SOLARHUB BUSINESS BRAIN - AUTONOMOUS CYCLE")
        print("="*60 + "\n")
        
        cycle_report = {
            "cycle_id": f"cycle_{int(time.time())}",
            "timestamp": datetime.utcnow().isoformat(),
            "domain": domain.value if domain else "ALL",
            "phases": {}
        }
        
        try:
            # Phase 1: Observe
            self.current_phase = LoopPhase.OBSERVE
            observation = self.observe(domain)
            cycle_report["phases"]["observe"] = observation
            
            # Phase 2: Think
            self.current_phase = LoopPhase.THINK
            analysis = self.think(observation)
            cycle_report["phases"]["think"] = analysis
            
            # Phase 3: Plan
            self.current_phase = LoopPhase.PLAN
            plan = self.plan(analysis)
            cycle_report["phases"]["plan"] = plan
            
            # Phase 4: Act
            self.current_phase = LoopPhase.ACT
            execution = self.act(plan)
            cycle_report["phases"]["act"] = execution
            
            # Phase 5: Verify
            self.current_phase = LoopPhase.VERIFY
            verification = self.verify(execution, plan)
            cycle_report["phases"]["verify"] = verification
            
            # Phase 6: Learn
            self.current_phase = LoopPhase.LEARN
            learning = self.learn(verification, execution, plan)
            cycle_report["phases"]["learn"] = learning
            
            # Summary
            cycle_report["summary"] = {
                "success": verification["success"],
                "tasks_planned": len(plan.get("tasks", [])),
                "tasks_completed": len(execution.get("completed_tasks", [])),
                "tasks_failed": len(execution.get("failed_tasks", [])),
                "key_learnings": len(learning.get("insights", []))
            }
            
            print("\n" + "-"*60)
            print(f"  CYCLE COMPLETE: {'SUCCESS' if verification['success'] else 'PARTIAL'}")
            print(f"  Tasks: {cycle_report['summary']['tasks_completed']}/{cycle_report['summary']['tasks_planned']} completed")
            print(f"  Learnings: {cycle_report['summary']['key_learnings']} insights generated")
            print("-"*60 + "\n")
            
        except Exception as e:
            cycle_report["error"] = str(e)
            print(f"[BusinessBrain.ERROR] Cycle failed: {e}")
        
        return cycle_report
    
    def run_continuous(self, interval_seconds: int = 300, domain: Optional[BusinessDomain] = None):
        """
        Run continuous autonomous cycles.
        
        Args:
            interval_seconds: Time between cycles (default: 5 minutes)
            domain: Optional domain focus
        """
        print(f"[BusinessBrain] Starting continuous operation (interval: {interval_seconds}s)...")
        print("Press Ctrl+C to stop.\n")
        
        self.running = True
        
        try:
            while self.running:
                self.run_cycle(domain)
                time.sleep(interval_seconds)
        except KeyboardInterrupt:
            print("\n[BusinessBrain] Stopping continuous operation...")
            self.running = False
    
    def set_goal(self, goal_description: str, domain: BusinessDomain, 
                 success_criteria: List[str], priority: str = "medium"):
        """Set a new business goal."""
        goal = {
            "id": f"goal_{int(time.time())}",
            "description": goal_description,
            "domain": domain.value,
            "success_criteria": success_criteria,
            "priority": priority,
            "status": "active"
        }
        self.memory.add_goal(goal)
        print(f"[BusinessBrain] Goal set: {goal_description}")
        return goal


# CLI entry point
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="SolarHub Business Brain")
    parser.add_argument("--mode", choices=["cycle", "continuous", "goal"], 
                        default="cycle", help="Operation mode")
    parser.add_argument("--domain", choices=[d.value for d in BusinessDomain],
                        help="Focus domain")
    parser.add_argument("--interval", type=int, default=300,
                        help="Cycle interval in seconds (for continuous mode)")
    parser.add_argument("--set-goal", type=str, help="Set a new goal")
    parser.add_argument("--goal-priority", choices=["low", "medium", "high"],
                        default="medium", help="Goal priority")
    
    args = parser.parse_args()
    
    brain = BusinessBrain()
    
    if args.set_goal:
        domain = BusinessDomain(args.domain) if args.domain else BusinessDomain.OPERATIONS
        brain.set_goal(
            args.set_goal,
            domain,
            success_criteria=["Goal achieved"],
            priority=args.goal_priority
        )
    elif args.mode == "cycle":
        domain = BusinessDomain(args.domain) if args.domain else None
        brain.run_cycle(domain)
    elif args.mode == "continuous":
        domain = BusinessDomain(args.domain) if args.domain else None
        brain.run_continuous(args.interval, domain)


if __name__ == "__main__":
    main()
