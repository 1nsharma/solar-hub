"""
SolarHub Tool Runtime
=====================

Real execution capabilities for autonomous agents.

Tools are categorized by capability:
- CODE: Code generation, file operations, git operations
- BROWSER: Web research, scraping, form filling, testing
- API: External API calls, webhooks, integrations
- MEDIA: Video generation, image creation, audio synthesis
- COMMUNICATION: Email, SMS, WhatsApp, notifications
- BUSINESS: CRM updates, order management, inventory ops

Each tool returns structured result with:
- success: bool
- data: any (tool-specific output)
- error: str (if failed)
- metadata: dict (execution details)
"""

import os
import json
import subprocess
import requests
from datetime import datetime
from typing import Any, Dict, List, Optional
from pathlib import Path


class ToolResult:
    """Standardized tool execution result."""
    
    def __init__(self, success: bool, data: Any = None, error: str = None, metadata: Dict = None):
        self.success = success
        self.data = data
        self.error = error
        self.metadata = metadata or {}
        self.timestamp = datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        return {
            "success": self.success,
            "data": self.data,
            "error": self.error,
            "metadata": self.metadata,
            "timestamp": self.timestamp
        }


class CodeTools:
    """Code generation, file operations, and Git tools."""
    
    def __init__(self, base_path: str = "/workspace"):
        self.base_path = Path(base_path)
    
    def read_file(self, file_path: str) -> ToolResult:
        """Read content of a file."""
        try:
            full_path = self.base_path / file_path
            if not full_path.exists():
                return ToolResult(False, error=f"File not found: {file_path}")
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return ToolResult(True, data={"content": content, "lines": len(content.splitlines())})
        except Exception as e:
            return ToolResult(False, error=str(e))
    
    def write_file(self, file_path: str, content: str, create_dirs: bool = True) -> ToolResult:
        """Write content to a file."""
        try:
            full_path = self.base_path / file_path
            
            if create_dirs:
                full_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return ToolResult(True, data={"path": str(full_path), "bytes": len(content)})
        except Exception as e:
            return ToolResult(False, error=str(e))
    
    def execute_command(self, command: str, cwd: str = None, timeout: int = 300) -> ToolResult:
        """Execute shell command safely."""
        try:
            working_dir = cwd or str(self.base_path)
            result = subprocess.run(
                command,
                shell=True,
                cwd=working_dir,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            return ToolResult(
                success=(result.returncode == 0),
                data={
                    "stdout": result.stdout,
                    "stderr": result.stderr,
                    "returncode": result.returncode
                },
                metadata={"command": command, "duration": result.elapsed.total_seconds() if hasattr(result, 'elapsed') else 0}
            )
        except subprocess.TimeoutExpired:
            return ToolResult(False, error=f"Command timed out after {timeout}s")
        except Exception as e:
            return ToolResult(False, error=str(e))
    
    def git_status(self) -> ToolResult:
        """Get Git repository status."""
        return self.execute_command("git status --porcelain")
    
    def git_log(self, n: int = 10) -> ToolResult:
        """Get recent Git commits."""
        return self.execute_command(f"git log -{n} --oneline")
    
    def git_diff(self, file_path: str = None) -> ToolResult:
        """Get Git diff for file or all changes."""
        cmd = f"git diff {file_path}" if file_path else "git diff"
        return self.execute_command(cmd)
    
    def create_file(self, file_path: str, template: str = "python") -> ToolResult:
        """Create new file with template."""
        templates = {
            "python": "#!/usr/bin/env python3\n\"\"\"Module docstring.\"\"\"\n\n\ndef main():\n    pass\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "html": "<!DOCTYPE html>\n<html>\n<head>\n    <title></title>\n</head>\n<body>\n</body>\n</html>\n",
            "css": "/* Styles */\n",
            "js": "// JavaScript\n",
            "json": "{}\n",
            "md": "# Title\n\n",
        }
        
        content = templates.get(template, "")
        return self.write_file(file_path, content)


class BrowserTools:
    """Web research, scraping, and browser automation."""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 SolarHub/1.0"
        })
    
    def fetch_page(self, url: str, timeout: int = 30) -> ToolResult:
        """Fetch webpage content."""
        try:
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            
            return ToolResult(
                True,
                data={
                    "url": url,
                    "status_code": response.status_code,
                    "content": response.text,
                    "headers": dict(response.headers),
                    "length": len(response.text)
                },
                metadata={"fetch_time": response.elapsed.total_seconds()}
            )
        except Exception as e:
            return ToolResult(False, error=str(e))
    
    def search_web(self, query: str, num_results: int = 10) -> ToolResult:
        """Search web using DuckDuckGo HTML interface."""
        try:
            from urllib.parse import urlencode
            search_url = f"https://html.duckduckgo.com/html/?{urlencode({'q': query})}"
            
            response = self.session.get(search_url, timeout=30)
            response.raise_for_status()
            
            # Simple extraction of results (can be enhanced with proper parsing)
            results = []
            content = response.text
            
            # Extract titles and snippets (basic parsing)
            import re
            title_pattern = r'<a class="result__a" href="(.*?)">(.*?)</a>'
            snippet_pattern = r'<a class="result__snippet" href.*?>(.*?)</a>'
            
            titles = re.findall(title_pattern, content, re.DOTALL)
            snippets = re.findall(snippet_pattern, content, re.DOTALL)
            
            for i, (href, title) in enumerate(titles[:num_results]):
                snippet = snippets[i] if i < len(snippets) else ""
                # Clean HTML tags
                clean_title = re.sub(r'<.*?>', '', title).strip()
                clean_snippet = re.sub(r'<.*?>', '', snippet).strip()
                
                results.append({
                    "title": clean_title,
                    "snippet": clean_snippet,
                    "url": href
                })
            
            return ToolResult(True, data={"query": query, "results": results, "count": len(results)})
        except Exception as e:
            return ToolResult(False, error=str(e))
    
    def check_website_status(self, url: str) -> ToolResult:
        """Check if website is accessible and get basic info."""
        try:
            response = self.session.get(url, timeout=10)
            
            return ToolResult(
                True,
                data={
                    "url": url,
                    "status_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "accessible": response.status_code < 400
                }
            )
        except Exception as e:
            return ToolResult(False, error=str(e))


class APITools:
    """External API calls and webhooks."""
    
    def __init__(self):
        self.session = requests.Session()
    
    def http_request(self, method: str, url: str, headers: Dict = None, 
                     params: Dict = None, json_data: Dict = None, 
                     timeout: int = 30) -> ToolResult:
        """Make HTTP request to any API."""
        try:
            response = self.session.request(
                method=method.upper(),
                url=url,
                headers=headers,
                params=params,
                json=json_data,
                timeout=timeout
            )
            response.raise_for_status()
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return ToolResult(
                True,
                data={
                    "status_code": response.status_code,
                    "body": response_data,
                    "headers": dict(response.headers)
                },
                metadata={"method": method, "url": url}
            )
        except Exception as e:
            return ToolResult(False, error=str(e))
    
    def send_webhook(self, webhook_url: str, payload: Dict) -> ToolResult:
        """Send webhook notification."""
        return self.http_request("POST", webhook_url, json_data=payload)
    
    def github_api(self, endpoint: str, token: str = None, method: str = "GET") -> ToolResult:
        """GitHub API wrapper."""
        headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            headers["Authorization"] = f"token {token}"
        
        url = f"https://api.github.com/{endpoint}"
        return self.http_request(method, url, headers=headers)
    
    def gemini_api(self, prompt: str, api_key: str, model: str = "gemini-2.0-flash") -> ToolResult:
        """Google Gemini API for AI analysis."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        headers = {"Content-Type": "application/json"}
        
        return self.http_request("POST", url, headers=headers, json_data=payload)


class MediaTools:
    """Video, image, and audio generation tools."""
    
    def __init__(self, output_dir: str = "/workspace/media/output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_script(self, topic: str, duration: str = "2min", style: str = "tutorial") -> ToolResult:
        """Generate video script structure."""
        script = f"""# Video Script: {topic}
# Duration: {duration}
# Style: {style}

## Hook (0:00-0:15)
[Opening visual]
Narrator: "Did you know..."

## Problem (0:15-0:45)
[Show problem scenario]
Narrator: "Many people face..."

## Solution (0:45-1:30)
[Demonstrate solution]
Narrator: "Here's how SolarHub helps..."

## Call-to-Action (1:30-{duration})
[Show CTA]
Narrator: "Visit SolarHub today!"
"""
        return ToolResult(True, data={"script": script, "topic": topic})
    
    def create_presentation_outline(self, topic: str, slides: int = 10) -> ToolResult:
        """Create presentation outline."""
        outline = {
            "title": topic,
            "slides": slides,
            "structure": [
                {"slide": 1, "type": "title", "content": f"{topic}"},
                {"slide": 2, "type": "agenda", "content": "What we'll cover"},
                {"slide": 3, "type": "problem", "content": "The challenge"},
                {"slide": 4, "type": "solution", "content": "Our approach"},
                {"slide": 5, "type": "demo", "content": "Live demonstration"},
                {"slide": 6, "type": "features", "content": "Key features"},
                {"slide": 7, "type": "benefits", "content": "Why choose us"},
                {"slide": 8, "type": "case_study", "content": "Success story"},
                {"slide": 9, "type": "pricing", "content": "Plans & pricing"},
                {"slide": 10, "type": "cta", "content": "Next steps"}
            ]
        }
        
        return ToolResult(True, data=outline)
    
    def generate_thumbnail_prompt(self, topic: str, style: str = "professional") -> ToolResult:
        """Generate AI image generation prompt for thumbnail."""
        prompts = {
            "professional": f"Professional business thumbnail for '{topic}', clean design, modern typography, blue and white color scheme, high contrast, 16:9 aspect ratio",
            "vibrant": f"Vibrant eye-catching thumbnail for '{topic}', bold colors, dynamic composition, engaging visuals, YouTube style, 16:9",
            "minimal": f"Minimalist thumbnail for '{topic}', simple geometric shapes, limited color palette, elegant typography, 16:9"
        }
        
        prompt = prompts.get(style, prompts["professional"])
        return ToolResult(True, data={"prompt": prompt, "style": style})
    
    def export_video_project(self, project_data: Dict, format: str = "json") -> ToolResult:
        """Export video project for external rendering tools."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"video_project_{timestamp}.{format}"
        filepath = self.output_dir / filename
        
        with open(filepath, 'w') as f:
            if format == "json":
                json.dump(project_data, f, indent=2)
            else:
                f.write(str(project_data))
        
        return ToolResult(True, data={"filepath": str(filepath), "format": format})


class CommunicationTools:
    """Email, SMS, WhatsApp, and notification tools."""
    
    def __init__(self):
        self.sent_messages = []
    
    def compose_email(self, to: str, subject: str, body: str, 
                      cc: List[str] = None, attachments: List[str] = None) -> ToolResult:
        """Compose email (ready for sending via SMTP)."""
        email_data = {
            "to": to,
            "subject": subject,
            "body": body,
            "cc": cc or [],
            "attachments": attachments or [],
            "timestamp": datetime.now().isoformat()
        }
        
        self.sent_messages.append(email_data)
        
        return ToolResult(True, data=email_data, metadata={"queued": True})
    
    def compose_outreach_message(self, prospect_name: str, company: str, 
                                  value_prop: str, cta: str = "Schedule a demo") -> ToolResult:
        """Compose personalized outreach message."""
        template = f"""Subject: Quick question about {company}'s solar operations

Hi {prospect_name},

I noticed {company} is in the solar industry. Many companies like yours are struggling with [common pain point].

SolarHub helps solar businesses:
✓ Automate customer onboarding
✓ Streamline installation workflows  
✓ Reduce operational costs by 30%

{cta}

Best regards,
SolarHub Team
"""
        
        return ToolResult(True, data={"message": template, "prospect": prospect_name})
    
    def send_notification(self, channel: str, recipient: str, message: str) -> ToolResult:
        """Send notification (simulated - integrate with actual providers)."""
        notification = {
            "channel": channel,  # email, sms, whatsapp, push
            "recipient": recipient,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "status": "sent"
        }
        
        self.sent_messages.append(notification)
        
        return ToolResult(True, data=notification)


class BusinessTools:
    """CRM, orders, inventory, and business operations."""
    
    def __init__(self, db_path: str = "/workspace/backend/db.sqlite3"):
        self.db_path = Path(db_path)
    
    def create_lead(self, name: str, company: str, contact: str, 
                    source: str = "outreach", notes: str = "") -> ToolResult:
        """Create new lead in CRM."""
        lead = {
            "id": f"LEAD_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "name": name,
            "company": company,
            "contact": contact,
            "source": source,
            "notes": notes,
            "status": "new",
            "created_at": datetime.now().isoformat()
        }
        
        # In production: insert into database
        # For now: return lead data
        return ToolResult(True, data=lead)
    
    def update_lead_status(self, lead_id: str, status: str, notes: str = "") -> ToolResult:
        """Update lead status in pipeline."""
        valid_statuses = ["new", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]
        
        if status not in valid_statuses:
            return ToolResult(False, error=f"Invalid status. Must be one of: {valid_statuses}")
        
        update = {
            "lead_id": lead_id,
            "status": status,
            "notes": notes,
            "updated_at": datetime.now().isoformat()
        }
        
        return ToolResult(True, data=update)
    
    def create_customer_record(self, name: str, contact: str, address: Dict, 
                                system_size: float = None) -> ToolResult:
        """Create customer record after sale."""
        customer = {
            "id": f"CUST_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "name": name,
            "contact": contact,
            "address": address,
            "system_size_kw": system_size,
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
        
        return ToolResult(True, data=customer)
    
    def create_installation_order(self, customer_id: str, system_details: Dict, 
                                   technician_id: str = None) -> ToolResult:
        """Create installation work order."""
        order = {
            "id": f"ORD_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "customer_id": customer_id,
            "system_details": system_details,
            "technician_id": technician_id,
            "status": "pending",
            "scheduled_date": None,
            "created_at": datetime.now().isoformat()
        }
        
        return ToolResult(True, data=order)
    
    def check_inventory(self, item_sku: str = None) -> ToolResult:
        """Check inventory levels."""
        # Mock inventory data
        inventory = {
            "panels_400w": {"quantity": 150, "unit": "pieces", "reorder_level": 50},
            "inverter_5kw": {"quantity": 25, "unit": "pieces", "reorder_level": 10},
            "battery_10kwh": {"quantity": 40, "unit": "pieces", "reorder_level": 15},
            "mounting_structure": {"quantity": 200, "unit": "sets", "reorder_level": 75},
        }
        
        if item_sku:
            item_data = inventory.get(item_sku, {"error": "Item not found"})
            return ToolResult(True, data={item_sku: item_data})
        
        return ToolResult(True, data=inventory)
    
    def generate_invoice(self, customer_id: str, items: List[Dict], 
                         amount: float, due_date: str = None) -> ToolResult:
        """Generate invoice for customer."""
        invoice = {
            "id": f"INV_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "customer_id": customer_id,
            "items": items,
            "subtotal": amount,
            "tax": amount * 0.18,  # 18% GST
            "total": amount * 1.18,
            "due_date": due_date or datetime.now().isoformat(),
            "status": "pending",
            "created_at": datetime.now().isoformat()
        }
        
        return ToolResult(True, data=invoice)


class ToolRuntime:
    """Main runtime for executing tools."""
    
    def __init__(self, config: Dict = None):
        self.config = config or {}
        
        # Initialize all tool categories
        self.code = CodeTools()
        self.browser = BrowserTools()
        self.api = APITools()
        self.media = MediaTools()
        self.communication = CommunicationTools()
        self.business = BusinessTools()
        
        # Tool registry for dynamic lookup
        self._tool_registry = self._build_registry()
    
    def _build_registry(self) -> Dict:
        """Build tool registry for dynamic access."""
        return {
            "code.read_file": self.code.read_file,
            "code.write_file": self.code.write_file,
            "code.execute_command": self.code.execute_command,
            "code.git_status": self.code.git_status,
            "code.git_log": self.code.git_log,
            "code.git_diff": self.code.git_diff,
            "code.create_file": self.code.create_file,
            
            "browser.fetch_page": self.browser.fetch_page,
            "browser.search_web": self.browser.search_web,
            "browser.check_website_status": self.browser.check_website_status,
            
            "api.http_request": self.api.http_request,
            "api.send_webhook": self.api.send_webhook,
            "api.github_api": self.api.github_api,
            "api.gemini_api": self.api.gemini_api,
            
            "media.generate_script": self.media.generate_script,
            "media.create_presentation_outline": self.media.create_presentation_outline,
            "media.generate_thumbnail_prompt": self.media.generate_thumbnail_prompt,
            "media.export_video_project": self.media.export_video_project,
            
            "communication.compose_email": self.communication.compose_email,
            "communication.compose_outreach_message": self.communication.compose_outreach_message,
            "communication.send_notification": self.communication.send_notification,
            
            "business.create_lead": self.business.create_lead,
            "business.update_lead_status": self.business.update_lead_status,
            "business.create_customer_record": self.business.create_customer_record,
            "business.create_installation_order": self.business.create_installation_order,
            "business.check_inventory": self.business.check_inventory,
            "business.generate_invoice": self.business.generate_invoice,
        }
    
    def execute(self, tool_name: str, **kwargs) -> ToolResult:
        """Execute tool by name."""
        if tool_name not in self._tool_registry:
            return ToolResult(False, error=f"Unknown tool: {tool_name}")
        
        tool_func = self._tool_registry[tool_name]
        return tool_func(**kwargs)
    
    def list_tools(self) -> List[str]:
        """List all available tools."""
        return list(self._tool_registry.keys())
    
    def get_tool_categories(self) -> Dict[str, List[str]]:
        """Get tools organized by category."""
        categories = {
            "code": [],
            "browser": [],
            "api": [],
            "media": [],
            "communication": [],
            "business": []
        }
        
        for tool_name in self._tool_registry.keys():
            category = tool_name.split('.')[0]
            if category in categories:
                categories[category].append(tool_name)
        
        return categories


def main():
    """Test tool runtime."""
    runtime = ToolRuntime()
    
    print("=== SolarHub Tool Runtime ===\n")
    
    # List all tools
    print("Available Tools:")
    for tool in runtime.list_tools():
        print(f"  - {tool}")
    
    print("\n=== Testing Tools ===\n")
    
    # Test code tools
    print("1. Reading business_brain.py...")
    result = runtime.code.read_file("management/business_brain.py")
    print(f"   Success: {result.success}")
    if result.success:
        print(f"   Lines: {result.data['lines']}")
    
    # Test browser tools
    print("\n2. Checking SolarHub website...")
    result = runtime.browser.check_website_status("https://github.com")
    print(f"   Success: {result.success}")
    if result.success:
        print(f"   Status: {result.data['status_code']}")
    
    # Test media tools
    print("\n3. Generating video script...")
    result = runtime.media.generate_script("SolarHub Demo", "2min", "tutorial")
    print(f"   Success: {result.success}")
    if result.success:
        print(f"   Topic: {result.data['topic']}")
    
    # Test business tools
    print("\n4. Creating sample lead...")
    result = runtime.business.create_lead("John Doe", "Solar Corp", "john@solarcorp.com")
    print(f"   Success: {result.success}")
    if result.success:
        print(f"   Lead ID: {result.data['id']}")
    
    print("\n=== All Tests Complete ===")


if __name__ == "__main__":
    main()
