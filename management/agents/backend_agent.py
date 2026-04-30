import os

class BackendAgent:
    def __init__(self, root_dir):
        self.root_dir = root_dir

    def analyze_logic(self):
        print("--- [Backend Developer] Analyzing Architecture ---")
        
        backend_dir = os.path.join(self.root_dir, 'apps', 'backend')
        controllers = os.listdir(os.path.join(backend_dir, 'controllers'))
        
        print(f"Active Controllers: {', '.join(controllers)}")
        print("\nTechnical Debt / Suggestions:")
        print("- Implement JWT middleware for all /api/admin routes.")
        print("- Add structured logging (Winston/Pino) instead of console.log.")
        print("- Implement rate-limiting for OTP endpoints.")

if __name__ == "__main__":
    be = BackendAgent('c:\\Users\\amits\\Desktop\\solar-hub')
    be.analyze_logic()
