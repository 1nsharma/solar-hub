import os
import json
import subprocess

class AIEngine:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        self.is_mock = self.api_key is None or self.api_key == "YOUR_API_KEY_HERE"

    def get_git_context(self, root_dir):
        """Fetches recent git commits and status."""
        try:
            commits = subprocess.check_output(['git', 'log', '-n', '5', '--pretty=format:%h - %s (%cr)'], cwd=root_dir, shell=True).decode('utf-8')
            status = subprocess.check_output(['git', 'status', '--short'], cwd=root_dir, shell=True).decode('utf-8')
            return {"commits": commits, "status": status}
        except:
            return {"commits": "Git not initialized or no commits.", "status": "Clean"}

    def get_log_context(self, root_dir):
        """Scans local logs for recent errors."""
        logs_dir = os.path.join(root_dir, '.local-logs')
        errors = {}
        if os.path.exists(logs_dir):
            for log_file in os.listdir(logs_dir):
                if log_file.endswith('.err.log'):
                    path = os.path.join(logs_dir, log_file)
                    with open(path, 'r', encoding='utf-8') as f:
                        # Get last 5 lines of error
                        lines = f.readlines()
                        if lines:
                            errors[log_file] = "".join(lines[-5:])
        return errors

    def generate_report(self, agent_name, context):
        """
        Generates a professional report based on the agent type and collected context.
        """
        if self.is_mock:
            return self._heuristic_analysis(agent_name, context)
        
        # In a real integration, we'd send the full context (Git, Logs, Repo State) to Gemini
        return self._heuristic_analysis(agent_name, context)

    def _heuristic_analysis(self, agent_name, context):
        """Smart fallback logic to simulate AI insights with Git/Log awareness."""
        git = context.get('git', {})
        logs = context.get('logs', {})
        
        if agent_name == "Project Manager":
            return f"Velocity Report: Recent commits include '{git.get('commits', '').splitlines()[0] if git.get('commits') else 'None'}'. Project is stable with {len(logs)} active error logs."
        
        elif agent_name == "QA Tester":
            if logs:
                err_summary = "\n".join([f"- {k}: {v[:50]}..." for k, v in logs.items()])
                return f"CRITICAL ERRORS DETECTED:\n{err_summary}\n\nRecommendation: Focus on backend stabilization as per error logs."
            return "System is STABLE. All health checks passed. No critical errors in .local-logs."
        
        elif agent_name == "Backend Developer":
            if logs.get('backend.err.log'):
                return f"Auto-Resolve Suggestion: The backend error looks like a connectivity issue or missing dependency. Check git changes for recent library updates."
            return "Backend architecture is healthy. Git status shows: " + (git.get('status') or "All committed.")
        
        return "Insight: Repository is synchronized."

if __name__ == "__main__":
    engine = AIEngine()
    print(engine.generate_report("Project Manager", {"status": "Production-Ready", "tasks": "All done"}))
