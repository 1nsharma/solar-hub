import os
import subprocess
import sys

def main():
    print("========================================")
    print("   SOLARHUB AI WORKFORCE COMMANDER      ")
    print("========================================\n")
    
    agents = {
        "1": ("Project Manager", "pm_agent.py"),
        "2": ("UI/UX Designer", "designer_agent.py"),
        "3": ("QA Tester", "qa_tester.py"),
        "4": ("Backend Developer", "backend_agent.py")
    }

    print("Select an Agent to run:")
    for key, (name, _) in agents.items():
        print(f"[{key}] {name}")
    
    print("[0] Run All Agents (Full Audit)")
    print("[5] Autonomous Health Check & Self-Heal")
    
    choice = input("\nAction: ")
    
    if choice == "0":
        for key in agents:
            run_agent(agents[key][1])
    elif choice == "5":
        run_autonomous_check()
    elif choice in agents:
        run_agent(agents[choice][1])
    else:
        print("Invalid choice.")

def run_autonomous_check():
    print("\n--- [Autonomous Mode] Running System Sweep ---")
    from agents.ai_engine import AIEngine
    engine = AIEngine()
    root = 'c:\\Users\\amits\\Desktop\\solar-hub'
    
    git = engine.get_git_context(root)
    logs = engine.get_log_context(root)
    
    print(f"Git Status: {git['status'] or 'Clean'}")
    print(f"Active Errors: {len(logs)}")
    
    if logs:
        print("\nPROPOSED RESOLUTIONS:")
        for log, error in logs.items():
            print(f"[{log}] -> Suggestion: Check recently modified files in git log for this area.")
    else:
        print("\nAll systems operational. No auto-fixes required.")

def run_agent(script_name):
    script_path = os.path.join(os.path.dirname(__file__), 'agents', script_name)
    if os.path.exists(script_path):
        print(f"\n--- Running Agent: {script_name} ---")
        subprocess.run([sys.executable, script_path])
    else:
        print(f"Error: Agent script {script_name} not found.")

if __name__ == "__main__":
    main()
