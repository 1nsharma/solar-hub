import os
import json

class ProjectManager:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.task_file = os.path.join(root_dir, 'C:\\Users\\amits\\.gemini\\antigravity\\brain\\0db7c0b9-0756-4858-9d10-7108e39b8a59\\task.md')

    def audit_project(self):
        print("--- [Project Manager] Auditing SolarHub Status ---")
        
        # 1. Check Backend structure
        backend_path = os.path.join(self.root_dir, 'apps', 'backend')
        has_routes = os.path.exists(os.path.join(backend_path, 'routes'))
        has_controllers = os.path.exists(os.path.join(backend_path, 'controllers'))
        
        print(f"Backend Status: {'Refactored' if has_routes and has_controllers else 'Monolithic'}")
        
        # 2. Check Mobile
        mobile_path = os.path.join(self.root_dir, 'apps', 'mobile')
        has_persona = os.path.exists(os.path.join(mobile_path, 'components', 'persona'))
        print(f"Mobile UI: {'Persona-ready' if has_persona else 'Basic'}")

        # 3. Next Priorities
        print("\nNext Strategic Priorities:")
        print("1. Authentication Hardening (Move from 1234 to real OTP)")
        print("2. Payment Webhook Implementation")
        print("3. Documentation for Partners")

    def get_task_summary(self):
        if os.path.exists(self.task_file):
            with open(self.task_file, 'r') as f:
                content = f.read()
            completed = content.count('[x]')
            pending = content.count('[ ]')
            print(f"\nTask Progress: {completed} Completed, {pending} Pending")
        else:
            print("\nTask file not found.")

if __name__ == "__main__":
    pm = ProjectManager('c:\\Users\\amits\\Desktop\\solar-hub')
    pm.audit_project()
    pm.get_task_summary()
