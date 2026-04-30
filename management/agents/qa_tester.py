import os

from ai_engine import AIEngine

class QATester:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.ai = AIEngine()

    def run_smoke_test(self):
        print("--- [QA Tester] Running Smoke Tests ---")
        
        # Check Environment Files
        backend_env = os.path.exists(os.path.join(self.root_dir, 'apps', 'backend', '.env'))
        mobile_env = os.path.exists(os.path.join(self.root_dir, 'apps', 'mobile', '.env'))
        
        # New Context: Logs
        log_context = self.ai.get_log_context(self.root_dir)
        git_context = self.ai.get_git_context(self.root_dir)
        
        env_status = "STABLE" if backend_env and mobile_env else "INCOMPLETE"
        print(f"RESULT: Environment: {env_status}")
        print(f"RESULT: Error Logs Found: {len(log_context)}")

        # AI Analysis
        context = {
            "env": env_status,
            "logs": log_context,
            "git": git_context
        }
        print("\nQA Status Analysis (AI Powered):")
        print(self.ai.generate_report("QA Tester", context))

if __name__ == "__main__":
    qa = QATester('c:\\Users\\amits\\Desktop\\solar-hub')
    qa.run_smoke_test()
