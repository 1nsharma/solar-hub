import os

from ai_engine import AIEngine

class BackendAgent:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.ai = AIEngine()

    def analyze_logic(self):
        print("--- [Backend Developer] Analyzing Architecture ---")
        
        backend_dir = os.path.join(self.root_dir, 'apps', 'backend')
        controllers = os.listdir(os.path.join(backend_dir, 'controllers')) if os.path.exists(os.path.join(backend_dir, 'controllers')) else []
        services_dir = os.path.join(backend_dir, 'services')
        services = os.listdir(services_dir) if os.path.exists(services_dir) else []
        
        # New Context: Logs & Git
        log_context = self.ai.get_log_context(self.root_dir)
        git_context = self.ai.get_git_context(self.root_dir)
        
        print(f"Active Controllers: {len(controllers)}")
        print(f"Active Services: {len(services)}")
        
        # AI Analysis
        context = {
            "controllers": controllers,
            "services": services,
            "logs": log_context,
            "git": git_context
        }
        print("\nArchitectural Insights (AI Powered):")
        print(self.ai.generate_report("Backend Developer", context))

if __name__ == "__main__":
    be = BackendAgent('c:\\Users\\amits\\Desktop\\solar-hub')
    be.analyze_logic()
