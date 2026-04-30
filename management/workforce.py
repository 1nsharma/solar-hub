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
    
    choice = input("\nAction: ")
    
    if choice == "0":
        for key in agents:
            run_agent(agents[key][1])
    elif choice in agents:
        run_agent(agents[choice][1])
    else:
        print("Invalid choice.")

def run_agent(script_name):
    script_path = os.path.join(os.path.dirname(__file__), 'agents', script_name)
    if os.path.exists(script_path):
        print(f"\n--- Running Agent: {script_name} ---")
        subprocess.run([sys.executable, script_path])
    else:
        print(f"Error: Agent script {script_name} not found.")

if __name__ == "__main__":
    main()
