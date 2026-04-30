import os
import re

from ai_engine import AIEngine

class DesignerAgent:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.ai = AIEngine()

    def scan_design_tokens(self):
        print("--- [UI/UX Designer] Scanning Design Tokens ---")
        
        # Scan mobile constants
        mobile_styles = os.path.join(self.root_dir, 'apps', 'mobile', 'constants', 'theme.ts')
        palette_found = os.path.exists(mobile_styles)
        
        # Check for consistency in components
        persona_dir = os.path.join(self.root_dir, 'apps', 'mobile', 'components', 'persona')
        files = [f for f in os.listdir(persona_dir) if f.endswith('.tsx')] if os.path.exists(persona_dir) else []
        
        print(f"Detected Palette: {'Premium Dark Mode' if palette_found else 'Default'}")
        print(f"Scanning {persona_dir}...")
        print(f"Detected {len(files)} specialized persona components.")
        
        # AI Analysis
        context = {
            "palette": "Premium Dark Mode" if palette_found else "Default",
            "components": files
        }
        print("\nDesigner Recommendations (AI Powered):")
        print(self.ai.generate_report("UI/UX Designer", context))

if __name__ == "__main__":
    designer = DesignerAgent('c:\\Users\\amits\\Desktop\\solar-hub')
    designer.scan_design_tokens()
