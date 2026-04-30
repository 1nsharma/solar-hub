import os
import json

from ai_engine import AIEngine

class ProjectManager:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.task_file = os.path.join(root_dir, 'C:\\Users\\amits\\.gemini\\antigravity\\brain\\07636434-e1e7-4b01-ae97-60ec991d5ac4\\task.md')
        self.ai = AIEngine()

    def audit_project(self):
        print("--- [Project Manager] Auditing SolarHub Status ---")
        
        # Gather context
        backend_path = os.path.join(self.root_dir, 'apps', 'backend')
        has_services = os.path.exists(os.path.join(backend_path, 'services'))
        mobile_path = os.path.join(self.root_dir, 'apps', 'mobile')
        persona_path = os.path.join(mobile_path, 'components', 'persona')
        persona_count = len([f for f in os.listdir(persona_path) if f.endswith('.tsx')]) if os.path.exists(persona_path) else 0
        
        # New Context: Git & Logs
        git_context = self.ai.get_git_context(self.root_dir)
        log_context = self.ai.get_log_context(self.root_dir)
        
        status = "Production-Ready" if has_services else "Refactored"
        print(f"Backend Status: {status}")
        print(f"Mobile UI: {persona_count} Persona Dashboards Detected")

        # AI Analysis
        context = {
            "status": status,
            "persona_count": persona_count,
            "tasks": self.get_task_summary(silent=True),
            "git": git_context,
            "logs": log_context
        }
        print("\nAI Strategic Insights:")
        print(self.ai.generate_report("Project Manager", context))

    def get_task_summary(self, silent=False):
        if os.path.exists(self.task_file):
            with open(self.task_file, 'r', encoding='utf-8') as f:
                content = f.read()
            completed = content.count('[x]')
            pending = content.count('[ ]')
            in_progress = content.count('[/]')
            summary = f"{completed} Completed, {in_progress} In Progress, {pending} Pending"
            if not silent:
                print(f"\nTask Progress: {summary}")
            return summary
        else:
            if not silent: print("\nTask file not found.")
            return "Task file missing"

if __name__ == "__main__":
    pm = ProjectManager('c:\\Users\\amits\\Desktop\\solar-hub')
    pm.audit_project()
    pm.get_task_summary()
