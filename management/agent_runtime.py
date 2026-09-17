"""
SolarHub Agent Runtime
======================

Runtime system for executing specialist agents within the Business Brain framework.

This module:
1. Wraps existing agents (PM, Designer, Backend, QA) as callable services
2. Provides tool execution capabilities
3. Manages agent lifecycle and state
4. Connects agents to Business Brain's Plan → Act pipeline
"""

import os
import sys
import json
import time
import subprocess
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime
from enum import Enum


class AgentStatus(Enum):
    IDLE = "IDLE"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AgentCapability:
    """Defines what an agent can do."""
    
    def __init__(self, name: str, description: str, input_schema: Dict[str, Any], 
                 output_schema: Dict[str, Any]):
        self.name = name
        self.description = description
        self.input_schema = input_schema
        self.output_schema = output_schema
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.input_schema,
            "output_schema": self.output_schema
        }


class AgentTask:
    """Represents a task assigned to an agent."""
    
    def __init__(self, task_id: str, description: str, domain: str,
                 priority: str = "medium", context: Dict[str, Any] = None):
        self.id = task_id
        self.description = description
        self.domain = domain
        self.priority = priority
        self.context = context or {}
        self.status = AgentStatus.IDLE
        self.result: Optional[Dict[str, Any]] = None
        self.error: Optional[str] = None
        self.started_at: Optional[str] = None
        self.completed_at: Optional[str] = None
    
    def start(self):
        self.status = AgentStatus.RUNNING
        self.started_at = datetime.utcnow().isoformat()
    
    def complete(self, result: Dict[str, Any]):
        self.status = AgentStatus.COMPLETED
        self.result = result
        self.completed_at = datetime.utcnow().isoformat()
    
    def fail(self, error: str):
        self.status = AgentStatus.FAILED
        self.error = error
        self.completed_at = datetime.utcnow().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "description": self.description,
            "domain": self.domain,
            "priority": self.priority,
            "context": self.context,
            "status": self.status.value,
            "result": self.result,
            "error": self.error,
            "started_at": self.started_at,
            "completed_at": self.completed_at
        }


class BaseAgent:
    """Base class for all specialist agents."""
    
    def __init__(self, name: str, domain: str):
        self.name = name
        self.domain = domain
        self.capabilities: List[AgentCapability] = []
        self.status = AgentStatus.IDLE
        self.current_task: Optional[AgentTask] = None
    
    def register_capability(self, capability: AgentCapability):
        self.capabilities.append(capability)
    
    def execute(self, task: AgentTask) -> Dict[str, Any]:
        """Execute a task. Override in subclasses."""
        raise NotImplementedError
    
    def get_capabilities(self) -> List[Dict[str, Any]]:
        return [c.to_dict() for c in self.capabilities]


class ProjectManagerAgent(BaseAgent):
    """PM Agent - Strategic planning and task coordination."""
    
    def __init__(self, root_dir: str = None):
        super().__init__("Project Manager", "BUILD")
        self.root_dir = root_dir or os.path.dirname(os.path.dirname(__file__))
        
        # Register capabilities
        self.register_capability(AgentCapability(
            name="audit_project",
            description="Audit project status, progress, and health",
            input_schema={"type": "object", "properties": {}},
            output_schema={"type": "object", "properties": {"status": "string", "insights": "array"}}
        ))
        
        self.register_capability(AgentCapability(
            name="analyze_tasks",
            description="Analyze task progress and bottlenecks",
            input_schema={"type": "object", "properties": {"task_file": "string"}},
            output_schema={"type": "object", "properties": {"summary": "string", "pending": "number"}}
        ))
    
    def execute(self, task: AgentTask) -> Dict[str, Any]:
        task.start()
        print(f"[PM Agent] Executing: {task.description}")
        
        try:
            # Gather project context
            git_status = self._get_git_status()
            task_summary = self._get_task_summary()
            
            result = {
                "git_status": git_status,
                "task_summary": task_summary,
                "recommendations": self._generate_recommendations(git_status, task_summary)
            }
            
            task.complete(result)
            return result
            
        except Exception as e:
            task.fail(str(e))
            return {"error": str(e)}
    
    def _get_git_status(self) -> Dict[str, Any]:
        """Get git repository status."""
        try:
            import subprocess
            cwd = self.root_dir
            
            # Get recent commits
            commits = subprocess.check_output(
                ['git', 'log', '-n', '5', '--pretty=format:%h - %s (%cr)'],
                cwd=cwd, text=True
            ).strip().split('\n')
            
            # Get status
            status = subprocess.check_output(
                ['git', 'status', '--short'],
                cwd=cwd, text=True
            ).strip()
            
            return {
                "commits": commits,
                "status": status if status else "Clean",
                "health": "good"
            }
        except Exception as e:
            return {"error": str(e), "health": "unknown"}
    
    def _get_task_summary(self) -> Dict[str, Any]:
        """Get task progress summary."""
        # Look for task files in common locations
        task_locations = [
            os.path.join(self.root_dir, 'task.md'),
            os.path.join(self.root_dir, 'TODO.md'),
            os.path.join(self.root_dir, 'docs', 'tasks.md'),
        ]
        
        for task_file in task_locations:
            if os.path.exists(task_file):
                with open(task_file, 'r') as f:
                    content = f.read()
                
                completed = content.count('[x]')
                pending = content.count('[ ]')
                in_progress = content.count('[/]')
                
                return {
                    "file": task_file,
                    "completed": completed,
                    "in_progress": in_progress,
                    "pending": pending,
                    "total": completed + pending + in_progress
                }
        
        return {"file": None, "message": "No task file found"}
    
    def _generate_recommendations(self, git_status: Dict, task_summary: Dict) -> List[str]:
        """Generate strategic recommendations."""
        recommendations = []
        
        if git_status.get("status") != "Clean":
            recommendations.append("Commit or stash uncommitted changes before major updates")
        
        if task_summary.get("pending", 0) > 5:
            recommendations.append("High number of pending tasks - consider prioritization")
        
        if not recommendations:
            recommendations.append("Project is on track - continue current velocity")
        
        return recommendations


class DesignerAgent(BaseAgent):
    """UI/UX Designer Agent - Interface design and improvements."""
    
    def __init__(self, root_dir: str = None):
        super().__init__("UI/UX Designer", "BUILD")
        self.root_dir = root_dir or os.path.dirname(os.path.dirname(__file__))
        
        self.register_capability(AgentCapability(
            name="audit_ui",
            description="Audit UI components and consistency",
            input_schema={"type": "object", "properties": {}},
            output_schema={"type": "object", "properties": {"components": "number", "issues": "array"}}
        ))
        
        self.register_capability(AgentCapability(
            name="suggest_improvements",
            description="Suggest UI/UX improvements",
            input_schema={"type": "object", "properties": {"page": "string"}},
            output_schema={"type": "object", "properties": {"suggestions": "array"}}
        ))
    
    def execute(self, task: AgentTask) -> Dict[str, Any]:
        task.start()
        print(f"[Designer Agent] Executing: {task.description}")
        
        try:
            ui_audit = self._audit_components()
            
            result = {
                "ui_audit": ui_audit,
                "design_system_status": "consistent",
                "improvement_areas": self._identify_improvement_areas(ui_audit)
            }
            
            task.complete(result)
            return result
            
        except Exception as e:
            task.fail(str(e))
            return {"error": str(e)}
    
    def _audit_components(self) -> Dict[str, Any]:
        """Audit UI components."""
        mobile_path = os.path.join(self.root_dir, 'apps', 'mobile', 'components')
        
        component_count = 0
        components_by_type = {}
        
        if os.path.exists(mobile_path):
            for root, dirs, files in os.walk(mobile_path):
                tsx_files = [f for f in files if f.endswith('.tsx')]
                component_count += len(tsx_files)
                
                # Categorize by directory
                rel_path = os.path.relpath(root, mobile_path)
                if rel_path != '.':
                    components_by_type[rel_path] = len(tsx_files)
        
        return {
            "total_components": component_count,
            "by_type": components_by_type,
            "health": "good" if component_count > 0 else "needs_attention"
        }
    
    def _identify_improvement_areas(self, audit: Dict) -> List[str]:
        """Identify areas for improvement."""
        improvements = []
        
        if audit.get("total_components", 0) < 10:
            improvements.append("Expand component library for better reusability")
        
        if len(audit.get("by_type", {})) < 3:
            improvements.append("Consider organizing components into more categories")
        
        if not improvements:
            improvements.append("Component structure looks good - focus on polish")
        
        return improvements


class QAAgent(BaseAgent):
    """QA Tester Agent - Quality assurance and testing."""
    
    def __init__(self, root_dir: str = None):
        super().__init__("QA Tester", "BUILD")
        self.root_dir = root_dir or os.path.dirname(os.path.dirname(__file__))
        
        self.register_capability(AgentCapability(
            name="run_health_checks",
            description="Run system health checks",
            input_schema={"type": "object", "properties": {}},
            output_schema={"type": "object", "properties": {"status": "string", "errors": "array"}}
        ))
        
        self.register_capability(AgentCapability(
            name="analyze_errors",
            description="Analyze error logs",
            input_schema={"type": "object", "properties": {"log_dir": "string"}},
            output_schema={"type": "object", "properties": {"errors": "array", "severity": "string"}}
        ))
    
    def execute(self, task: AgentTask) -> Dict[str, Any]:
        task.start()
        print(f"[QA Agent] Executing: {task.description}")
        
        try:
            health = self._run_health_checks()
            errors = self._analyze_errors()
            
            result = {
                "health_status": health,
                "error_analysis": errors,
                "quality_score": self._calculate_quality_score(health, errors)
            }
            
            task.complete(result)
            return result
            
        except Exception as e:
            task.fail(str(e))
            return {"error": str(e)}
    
    def _run_health_checks(self) -> Dict[str, Any]:
        """Run basic health checks."""
        checks = {
            "backend_exists": os.path.exists(os.path.join(self.root_dir, 'apps', 'backend')),
            "mobile_exists": os.path.exists(os.path.join(self.root_dir, 'apps', 'mobile')),
            "package_json_exists": os.path.exists(os.path.join(self.root_dir, 'package.json')),
            "db_exists": os.path.exists(os.path.join(self.root_dir, 'db'))
        }
        
        passed = sum(1 for v in checks.values() if v)
        total = len(checks)
        
        return {
            "checks": checks,
            "passed": passed,
            "total": total,
            "status": "healthy" if passed == total else "degraded"
        }
    
    def _analyze_errors(self) -> Dict[str, Any]:
        """Analyze error logs."""
        log_dir = os.path.join(self.root_dir, '.local-logs')
        errors = []
        
        if os.path.exists(log_dir):
            for filename in os.listdir(log_dir):
                if filename.endswith('.err.log'):
                    filepath = os.path.join(log_dir, filename)
                    with open(filepath, 'r') as f:
                        lines = f.readlines()[-10:]  # Last 10 lines
                        errors.append({
                            "file": filename,
                            "recent_errors": lines
                        })
        
        return {
            "errors_found": len(errors),
            "details": errors,
            "severity": "critical" if errors else "none"
        }
    
    def _calculate_quality_score(self, health: Dict, errors: Dict) -> float:
        """Calculate overall quality score (0-1)."""
        health_score = health.get("passed", 0) / max(health.get("total", 1), 1)
        error_penalty = min(errors.get("errors_found", 0) * 0.1, 0.5)
        
        return max(0, min(1, health_score - error_penalty))


class BackendAgent(BaseAgent):
    """Backend Developer Agent - API and service development."""
    
    def __init__(self, root_dir: str = None):
        super().__init__("Backend Developer", "BUILD")
        self.root_dir = root_dir or os.path.dirname(os.path.dirname(__file__))
        
        self.register_capability(AgentCapability(
            name="audit_backend",
            description="Audit backend services and APIs",
            input_schema={"type": "object", "properties": {}},
            output_schema={"type": "object", "properties": {"services": "number", "apis": "number"}}
        ))
        
        self.register_capability(AgentCapability(
            name="check_dependencies",
            description="Check backend dependencies",
            input_schema={"type": "object", "properties": {}},
            output_schema={"type": "object", "properties": {"dependencies": "object", "issues": "array"}}
        ))
    
    def execute(self, task: AgentTask) -> Dict[str, Any]:
        task.start()
        print(f"[Backend Agent] Executing: {task.description}")
        
        try:
            backend_audit = self._audit_services()
            deps_check = self._check_dependencies()
            
            result = {
                "backend_audit": backend_audit,
                "dependencies": deps_check,
                "architecture_health": self._assess_architecture(backend_audit)
            }
            
            task.complete(result)
            return result
            
        except Exception as e:
            task.fail(str(e))
            return {"error": str(e)}
    
    def _audit_services(self) -> Dict[str, Any]:
        """Audit backend services."""
        backend_path = os.path.join(self.root_dir, 'apps', 'backend')
        
        services = []
        apis = []
        
        if os.path.exists(backend_path):
            # Look for service directories
            for item in os.listdir(backend_path):
                item_path = os.path.join(backend_path, item)
                if os.path.isdir(item_path):
                    services.append(item)
                    
                    # Check for route files
                    for root, dirs, files in os.walk(item_path):
                        for f in files:
                            if 'route' in f.lower() or 'api' in f.lower():
                                apis.append(f"{item}/{f}")
        
        return {
            "services": services,
            "service_count": len(services),
            "api_endpoints": apis,
            "api_count": len(apis)
        }
    
    def _check_dependencies(self) -> Dict[str, Any]:
        """Check backend dependencies."""
        package_json = os.path.join(self.root_dir, 'package.json')
        
        if os.path.exists(package_json):
            with open(package_json, 'r') as f:
                data = json.load(f)
            
            deps = data.get('dependencies', {})
            dev_deps = data.get('devDependencies', {})
            
            return {
                "production": len(deps),
                "development": len(dev_deps),
                "total": len(deps) + len(dev_deps),
                "issues": []
            }
        
        return {"error": "package.json not found", "issues": ["Missing package.json"]}
    
    def _assess_architecture(self, audit: Dict) -> str:
        """Assess backend architecture health."""
        if audit.get("service_count", 0) >= 3:
            return "well_structured"
        elif audit.get("service_count", 0) >= 1:
            return "basic"
        else:
            return "needs_development"


class AgentRuntime:
    """
    Runtime system for managing and executing agents.
    
    Features:
    - Agent registration and discovery
    - Task routing to appropriate agents
    - Execution tracking and reporting
    - Integration with Business Brain
    """
    
    def __init__(self, root_dir: str = None):
        self.root_dir = root_dir or os.path.dirname(os.path.dirname(__file__))
        self.agents: Dict[str, BaseAgent] = {}
        self.task_history: List[AgentTask] = []
        
        # Initialize built-in agents
        self._register_builtin_agents()
    
    def _register_builtin_agents(self):
        """Register built-in specialist agents."""
        self.register_agent(ProjectManagerAgent(self.root_dir))
        self.register_agent(DesignerAgent(self.root_dir))
        self.register_agent(QAAgent(self.root_dir))
        self.register_agent(BackendAgent(self.root_dir))
        
        # Register business specialist agents from business_agents.py
        try:
            import sys
            import os
            management_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            if management_dir not in sys.path:
                sys.path.insert(0, management_dir)
            
            from agents.business_agents import (
                GrowthAgent, SalesAgent, OperationsAgent, CreativeAgent
            )
            self.register_agent(GrowthAgent(self.root_dir))
            self.register_agent(SalesAgent(self.root_dir))
            self.register_agent(OperationsAgent(self.root_dir))
            self.register_agent(CreativeAgent(self.root_dir))
            print("[AgentRuntime] Business specialist agents loaded successfully")
        except ImportError as e:
            print(f"[AgentRuntime] Warning: Could not load business agents: {e}")
    
    def register_agent(self, agent: BaseAgent):
        """Register an agent with the runtime."""
        self.agents[agent.name] = agent
        print(f"[AgentRuntime] Registered agent: {agent.name} ({agent.domain})")
    
    def get_agent(self, name: str) -> Optional[BaseAgent]:
        """Get an agent by name."""
        return self.agents.get(name)
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """List all registered agents with their capabilities."""
        result = []
        for agent in self.agents.values():
            agent_info = {
                "name": agent.name,
                "domain": agent.domain,
                "capabilities": agent.get_capabilities() if hasattr(agent, 'get_capabilities') else []
            }
            
            # Handle both BaseAgent types (runtime and business_agents)
            if hasattr(agent, 'status'):
                agent_info["status"] = agent.status.value if hasattr(agent.status, 'value') else str(agent.status)
            else:
                agent_info["status"] = "IDLE"
            
            if hasattr(agent, 'performance_metrics'):
                agent_info["metrics"] = agent.performance_metrics
            
            result.append(agent_info)
        
        return result
    
    def route_task(self, task: AgentTask) -> Optional[BaseAgent]:
        """Route a task to the appropriate agent based on domain."""
        domain_to_agent = {
            "BUILD": ["Project Manager", "UI/UX Designer", "Backend Developer", "QA Tester"],
            "GROWTH": ["Growth Specialist", "Project Manager"],
            "SALES": ["Sales Specialist", "Project Manager"],
            "OPERATIONS": ["Operations Specialist", "Project Manager"],
            "CREATIVE": ["Creative Specialist", "UI/UX Designer"]
        }
        
        # Handle BusinessDomain enum if passed as domain
        task_domain = str(task.domain)
        if "BusinessDomain." in task_domain:
            task_domain = task_domain.replace("BusinessDomain.", "")
        
        candidate_agents = domain_to_agent.get(task_domain, ["Project Manager"])
        
        for agent_name in candidate_agents:
            agent = self.agents.get(agent_name)
            if agent and agent.status == AgentStatus.IDLE:
                return agent
        
        # Fallback to any idle agent
        for agent in self.agents.values():
            if agent.status == AgentStatus.IDLE:
                return agent
        
        return None
    
    def execute_task(self, task: AgentTask) -> Dict[str, Any]:
        """Execute a task by routing it to an appropriate agent."""
        agent = self.route_task(task)
        
        if not agent:
            error_result = {"error": "No available agents to execute task"}
            task.fail(error_result["error"])
            self.task_history.append(task)
            return error_result
        
        print(f"[AgentRuntime] Routing task '{task.description}' to {agent.name}")
        
        result = agent.execute(task)
        self.task_history.append(task)
        
        return result
    
    def execute_plan(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a plan from Business Brain.
        
        Args:
            plan: Plan dict with 'tasks' array
        
        Returns:
            Execution results
        """
        execution = {
            "timestamp": datetime.utcnow().isoformat(),
            "started_tasks": [],
            "completed_tasks": [],
            "failed_tasks": [],
            "outputs": {}
        }
        
        for task_data in plan.get("tasks", []):
            task = AgentTask(
                task_id=task_data.get("id", f"task_{int(time.time())}"),
                description=task_data.get("description", "Unknown task"),
                domain=task_data.get("domain", "OPERATIONS"),
                priority=task_data.get("priority", "medium"),
                context=task_data.get("context", {})
            )
            
            print(f"\n[AgentRuntime] Executing task: {task.description}")
            result = self.execute_task(task)
            
            execution["started_tasks"].append(task.id)
            
            if task.status == AgentStatus.COMPLETED:
                execution["completed_tasks"].append(task.id)
                execution["outputs"][task.id] = result
            else:
                execution["failed_tasks"].append(task.id)
                execution["outputs"][task.id] = result
        
        return execution
    
    def get_execution_report(self) -> Dict[str, Any]:
        """Generate execution report."""
        total_tasks = len(self.task_history)
        completed = sum(1 for t in self.task_history if t.status == AgentStatus.COMPLETED)
        failed = sum(1 for t in self.task_history if t.status == AgentStatus.FAILED)
        
        return {
            "total_tasks": total_tasks,
            "completed": completed,
            "failed": failed,
            "success_rate": completed / max(total_tasks, 1),
            "recent_tasks": [t.to_dict() for t in self.task_history[-10:]]
        }


# CLI entry point
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="SolarHub Agent Runtime")
    parser.add_argument("--list-agents", action="store_true", help="List all agents")
    parser.add_argument("--execute-task", type=str, help="Execute a specific task")
    parser.add_argument("--domain", choices=["BUILD", "GROWTH", "SALES", "OPERATIONS", "CREATIVE"],
                        default="BUILD", help="Task domain")
    parser.add_argument("--report", action="store_true", help="Show execution report")
    
    args = parser.parse_args()
    
    runtime = AgentRuntime()
    
    if args.list_agents:
        print("\n=== Registered Agents ===\n")
        for agent_info in runtime.list_agents():
            print(f"Agent: {agent_info['name']}")
            print(f"  Domain: {agent_info['domain']}")
            print(f"  Status: {agent_info['status']}")
            print(f"  Capabilities:")
            for cap in agent_info['capabilities']:
                print(f"    - {cap['name']}: {cap['description']}")
            print()
    
    elif args.execute_task:
        task = AgentTask(
            task_id=f"cli_task_{int(time.time())}",
            description=args.execute_task,
            domain=args.domain
        )
        result = runtime.execute_task(task)
        print("\n=== Task Result ===\n")
        print(json.dumps(result, indent=2))
    
    elif args.report:
        report = runtime.get_execution_report()
        print("\n=== Execution Report ===\n")
        print(f"Total Tasks: {report['total_tasks']}")
        print(f"Completed: {report['completed']}")
        print(f"Failed: {report['failed']}")
        print(f"Success Rate: {report['success_rate']:.1%}")
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
