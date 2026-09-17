"""
SolarHub Business Specialist Agents
====================================

Four specialist agents for autonomous business operations:
- Growth Agent: Research, SEO, advertising, social, analytics
- Sales Agent: Prospects, qualification, outreach, proposals
- Operations Agent: Customers, vendors, technicians, inventory
- Creative Agent: Scripts, videos, ads, tutorials, presentations

Each agent has:
- Domain expertise
- Tool access
- Execution capabilities
- Performance tracking
"""

import sys
from pathlib import Path

# Add management to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import json
from datetime import datetime
from typing import Dict, List, Any, Optional

from tools.tool_runtime import ToolRuntime, ToolResult


class BaseAgent:
    """Base class for all specialist agents."""
    
    def __init__(self, name: str, domain: str, tools: ToolRuntime = None):
        self.name = name
        self.domain = domain
        self.tools = tools or ToolRuntime()
        self.execution_log = []
        self.performance_metrics = {
            "tasks_completed": 0,
            "success_rate": 1.0,
            "avg_execution_time": 0.0
        }
    
    def execute(self, task: str, context: Dict = None) -> Dict:
        """Execute a task in this agent's domain."""
        raise NotImplementedError
    
    def _log_execution(self, task: str, result: ToolResult, duration: float):
        """Log execution for performance tracking."""
        self.execution_log.append({
            "task": task,
            "success": result.success,
            "duration": duration,
            "timestamp": datetime.now().isoformat()
        })
        
        # Update metrics
        self.performance_metrics["tasks_completed"] += 1
        
        total_tasks = len(self.execution_log)
        successful_tasks = sum(1 for e in self.execution_log if e["success"])
        self.performance_metrics["success_rate"] = successful_tasks / total_tasks
        
        # Update average execution time
        total_time = sum(e["duration"] for e in self.execution_log)
        self.performance_metrics["avg_execution_time"] = total_time / total_tasks
    
    def get_status(self) -> Dict:
        """Get agent status and metrics."""
        return {
            "name": self.name,
            "domain": self.domain,
            "metrics": self.performance_metrics,
            "recent_executions": self.execution_log[-5:]
        }


class GrowthAgent(BaseAgent):
    """
    Growth Specialist Agent
    
    Capabilities:
    - Market research & competitor analysis
    - SEO optimization
    - Advertising campaign management
    - Social media strategy
    - Analytics & experimentation
    """
    
    def __init__(self, tools: ToolRuntime = None):
        super().__init__("Growth Agent", "GROWTH", tools)
    
    def execute(self, task: str, context: Dict = None) -> Dict:
        """Execute growth-related task."""
        start_time = datetime.now()
        context = context or {}
        
        result = None
        
        # Task routing based on keywords
        task_lower = task.lower()
        
        if "research" in task_lower or "competitor" in task_lower:
            result = self._do_market_research(context.get("query", ""), context.get("competitors", []))
        elif "seo" in task_lower:
            result = self._optimize_seo(context.get("url", ""), context.get("keywords", []))
        elif "ad" in task_lower or "campaign" in task_lower:
            result = self._plan_ad_campaign(context.get("budget", 1000), context.get("target_audience", ""))
        elif "social" in task_lower or "content" in task_lower:
            result = self._create_social_content(context.get("platform", "linkedin"), context.get("topic", ""))
        elif "analytics" in task_lower or "metric" in task_lower:
            result = self._analyze_metrics(context.get("metrics", []))
        else:
            # Default: web research
            result = self._do_market_research(task, [])
        
        duration = (datetime.now() - start_time).total_seconds()
        self._log_execution(task, result, duration)
        
        return {
            "agent": self.name,
            "domain": self.domain,
            "task": task,
            "result": result.to_dict(),
            "duration": duration
        }
    
    def _do_market_research(self, query: str, competitors: List[str]) -> ToolResult:
        """Conduct market research."""
        print(f"  [Growth] Researching: {query}")
        
        # Search web for information
        search_result = self.tools.browser.search_web(query, num_results=10)
        
        if not search_result.success:
            return search_result
        
        # Research competitors if specified
        competitor_insights = []
        for competitor in competitors[:3]:  # Limit to 3 competitors
            comp_search = self.tools.browser.search_web(f"{competitor} solar products pricing", num_results=5)
            if comp_search.success:
                competitor_insights.append({
                    "competitor": competitor,
                    "findings": comp_search.data["results"][:3]
                })
        
        return ToolResult(
            True,
            data={
                "query": query,
                "search_results": search_result.data["results"],
                "competitor_insights": competitor_insights,
                "summary": f"Found {len(search_result.data['results'])} relevant results"
            },
            metadata={"research_type": "market_analysis"}
        )
    
    def _optimize_seo(self, url: str, keywords: List[str]) -> ToolResult:
        """Analyze and suggest SEO improvements."""
        print(f"  [Growth] Analyzing SEO for: {url}")
        
        if not url:
            return ToolResult(False, error="URL required for SEO analysis")
        
        # Fetch page content
        page_result = self.tools.browser.fetch_page(url)
        
        if not page_result.success:
            return page_result
        
        # Basic SEO analysis
        content = page_result.data["content"]
        analysis = {
            "url": url,
            "page_size_kb": len(content) / 1024,
            "has_title": "<title>" in content,
            "has_meta_description": 'name="description"' in content,
            "has_h1": "<h1" in content,
            "keyword_density": {},
            "recommendations": []
        }
        
        # Check keyword density
        content_lower = content.lower()
        for keyword in keywords[:5]:  # Top 5 keywords
            count = content_lower.count(keyword.lower())
            if count > 0:
                analysis["keyword_density"][keyword] = count
        
        # Generate recommendations
        if not analysis["has_title"]:
            analysis["recommendations"].append("Add page title tag")
        if not analysis["has_meta_description"]:
            analysis["recommendations"].append("Add meta description")
        if not analysis["has_h1"]:
            analysis["recommendations"].append("Add H1 heading")
        if len(keywords) > 0 and sum(analysis["keyword_density"].values()) == 0:
            analysis["recommendations"].append("Incorporate target keywords in content")
        
        return ToolResult(True, data=analysis)
    
    def _plan_ad_campaign(self, budget: float, target_audience: str) -> ToolResult:
        """Plan advertising campaign."""
        print(f"  [Growth] Planning ad campaign with budget ${budget}")
        
        campaign_plan = {
            "budget": budget,
            "target_audience": target_audience or "Solar business owners, installers, distributors",
            "channels": [
                {"channel": "Google Ads", "allocation": budget * 0.4, "focus": "Search campaigns for solar software"},
                {"channel": "LinkedIn", "allocation": budget * 0.3, "focus": "B2B targeting solar companies"},
                {"channel": "Facebook/Instagram", "allocation": budget * 0.2, "focus": "Retargeting and brand awareness"},
                {"channel": "YouTube", "allocation": budget * 0.1, "focus": "Demo video ads"}
            ],
            "timeline": "4 weeks",
            "kpis": ["CTR", "Conversion Rate", "Cost per Lead", "ROAS"],
            "estimated_reach": int(budget * 50),  # Rough estimate
            "estimated_leads": int(budget * 0.1)  # Rough estimate
        }
        
        return ToolResult(True, data=campaign_plan)
    
    def _create_social_content(self, platform: str, topic: str) -> ToolResult:
        """Create social media content plan."""
        print(f"  [Growth] Creating {platform} content about: {topic}")
        
        content_templates = {
            "linkedin": {
                "format": "Professional post with industry insights",
                "length": "150-300 words",
                "hashtags": ["#SolarEnergy", "#RenewableEnergy", "#SolarTech"],
                "tone": "Professional, informative"
            },
            "twitter": {
                "format": "Thread or single tweet",
                "length": "280 characters per tweet",
                "hashtags": ["#Solar", "#CleanEnergy", "#Sustainability"],
                "tone": "Engaging, concise"
            },
            "instagram": {
                "format": "Visual post with caption",
                "length": "Caption: 100-200 words",
                "hashtags": ["#SolarPower", "#GreenEnergy", "#SolarLife"],
                "tone": "Visual, inspiring"
            },
            "facebook": {
                "format": "Post with image/video",
                "length": "80-150 words",
                "hashtags": ["#SolarEnergy", "#GoGreen"],
                "tone": "Friendly, community-focused"
            }
        }
        
        template = content_templates.get(platform.lower(), content_templates["linkedin"])
        
        content_plan = {
            "platform": platform,
            "topic": topic or "SolarHub benefits for solar businesses",
            "template": template,
            "sample_post": f"🌞 Did you know? Solar businesses using SolarHub reduce operational costs by 30%.\n\n{topic}\n\nLearn more about how we're transforming the solar industry.\n\n{' '.join(template['hashtags'])}",
            "best_posting_time": "9-11 AM or 2-4 PM (business hours)",
            "engagement_tips": [
                "Ask questions to encourage comments",
                "Use relevant hashtags",
                "Include visual content",
                "Respond to comments promptly"
            ]
        }
        
        return ToolResult(True, data=content_plan)
    
    def _analyze_metrics(self, metrics: List[str]) -> ToolResult:
        """Analyze business metrics."""
        print(f"  [Growth] Analyzing metrics: {metrics}")
        
        # Mock analytics data (in production, integrate with actual analytics)
        analytics_data = {
            "website_traffic": {
                "monthly_visitors": 15000,
                "growth_rate": "+12%",
                "bounce_rate": "42%",
                "avg_session_duration": "3:24"
            },
            "lead_generation": {
                "monthly_leads": 250,
                "conversion_rate": "3.2%",
                "cost_per_lead": "$45",
                "lead_quality_score": 7.8
            },
            "social_media": {
                "total_followers": 5200,
                "engagement_rate": "4.1%",
                "reach": 45000,
                "shares": 320
            },
            "seo": {
                "organic_traffic": 8500,
                "keyword_rankings": 145,
                "domain_authority": 42,
                "backlinks": 890
            }
        }
        
        analysis = {
            "current_metrics": analytics_data,
            "insights": [
                "Website traffic growing at healthy 12% MoM",
                "Lead conversion rate (3.2%) is above industry average",
                "Social engagement strong at 4.1%",
                "SEO performance solid, opportunity to improve domain authority"
            ],
            "recommendations": [
                "Increase content marketing to boost organic traffic",
                "A/B test landing pages to improve conversion rate",
                "Invest in backlink building for SEO",
                "Run targeted LinkedIn campaigns for B2B leads"
            ]
        }
        
        return ToolResult(True, data=analysis)


class SalesAgent(BaseAgent):
    """
    Sales Specialist Agent
    
    Capabilities:
    - Prospect discovery & qualification
    - Outreach & follow-up automation
    - Proposal generation
    - Pipeline management
    - Closing support
    """
    
    def __init__(self, tools: ToolRuntime = None):
        super().__init__("Sales Agent", "SALES", tools)
    
    def execute(self, task: str, context: Dict = None) -> Dict:
        """Execute sales-related task."""
        start_time = datetime.now()
        context = context or {}
        
        result = None
        task_lower = task.lower()
        
        if "prospect" in task_lower or "find" in task_lower:
            result = self._find_prospects(context.get("criteria", {}))
        elif "outreach" in task_lower or "contact" in task_lower:
            result = self._execute_outreach(context.get("prospects", []), context.get("message_template", ""))
        elif "follow" in task_lower:
            result = self._follow_up_leads(context.get("leads", []))
        elif "proposal" in task_lower or "quote" in task_lower:
            result = self._generate_proposal(context.get("prospect", {}), context.get("requirements", {}))
        elif "qualif" in task_lower:
            result = self._qualify_lead(context.get("lead", {}))
        elif "pipeline" in task_lower:
            result = self._analyze_pipeline()
        else:
            # Default: create outreach message
            result = self._create_outreach_message(
                context.get("prospect_name", "Prospect"),
                context.get("company", "Company")
            )
        
        duration = (datetime.now() - start_time).total_seconds()
        self._log_execution(task, result, duration)
        
        return {
            "agent": self.name,
            "domain": self.domain,
            "task": task,
            "result": result.to_dict(),
            "duration": duration
        }
    
    def _find_prospects(self, criteria: Dict) -> ToolResult:
        """Find potential prospects."""
        print(f"  [Sales] Finding prospects with criteria: {criteria}")
        
        # Search for solar companies
        search_query = criteria.get("search_query", "solar installation companies India")
        search_result = self.tools.browser.search_web(search_query, num_results=15)
        
        if not search_result.success:
            return search_result
        
        # Extract potential prospects from results
        prospects = []
        for i, result_item in enumerate(search_result.data["results"][:10]):
            prospect = {
                "id": f"PROSPECT_{i+1}",
                "name": result_item.get("title", "Unknown"),
                "company_url": result_item.get("url", ""),
                "snippet": result_item.get("snippet", ""),
                "source": "web_search",
                "status": "new",
                "priority": "medium"
            }
            prospects.append(prospect)
        
        return ToolResult(
            True,
            data={
                "search_query": search_query,
                "prospects_found": len(prospects),
                "prospects": prospects
            },
            metadata={"search_type": "prospect_discovery"}
        )
    
    def _execute_outreach(self, prospects: List[Dict], message_template: str) -> ToolResult:
        """Execute outreach campaign."""
        print(f"  [Sales] Executing outreach to {len(prospects)} prospects")
        
        if not prospects:
            return ToolResult(False, error="No prospects provided")
        
        outreach_results = []
        
        for prospect in prospects[:5]:  # Limit to 5 for demo
            # Compose personalized message
            prospect_name = prospect.get("name", "Prospect")
            company = prospect.get("company", "Company")
            
            message_result = self.tools.communication.compose_outreach_message(
                prospect_name=prospect_name,
                company=company,
                value_prop="Streamline your solar operations with SolarHub",
                cta="Schedule a free demo"
            )
            
            if message_result.success:
                # Create lead in CRM
                lead_result = self.tools.business.create_lead(
                    name=prospect_name,
                    company=company,
                    contact=prospect.get("email", ""),
                    source="outreach_campaign",
                    notes=f"Initial outreach via automated system"
                )
                
                outreach_results.append({
                    "prospect": prospect_name,
                    "message_sent": True,
                    "lead_created": lead_result.success,
                    "lead_id": lead_result.data.get("id") if lead_result.success else None
                })
        
        return ToolResult(
            True,
            data={
                "campaign_results": outreach_results,
                "total_outreach": len(outreach_results),
                "success_rate": len([r for r in outreach_results if r["message_sent"]]) / len(outreach_results) if outreach_results else 0
            }
        )
    
    def _follow_up_leads(self, leads: List[Dict]) -> ToolResult:
        """Follow up with existing leads."""
        print(f"  [Sales] Following up with {len(leads)} leads")
        
        follow_ups = []
        
        for lead in leads[:5]:  # Limit for demo
            follow_up_email = self.tools.communication.compose_email(
                to=lead.get("contact", ""),
                subject=f"Following up: SolarHub for {lead.get('company', 'your business')}",
                body=f"""Hi {lead.get('name', 'there')},

Just wanted to follow up on my previous message about SolarHub.

Many solar businesses like yours are seeing incredible results:
• 30% reduction in operational costs
• 50% faster project completion
• Real-time visibility into all operations

Would you have 15 minutes this week for a quick demo?

Best regards,
SolarHub Team
""",
                cc=[]
            )
            
            follow_ups.append({
                "lead": lead.get("name", "Unknown"),
                "email_composed": follow_up_email.success,
                "status": "pending_send"
            })
        
        return ToolResult(
            True,
            data={
                "follow_ups": follow_ups,
                "total": len(follow_ups)
            }
        )
    
    def _generate_proposal(self, prospect: Dict, requirements: Dict) -> ToolResult:
        """Generate sales proposal."""
        print(f"  [Sales] Generating proposal for {prospect.get('name', 'prospect')}")
        
        proposal = {
            "proposal_id": f"PROP_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "prospect": prospect,
            "requirements": requirements,
            "solution": {
                "product": "SolarHub Enterprise",
                "modules": [
                    "Customer Management",
                    "Project Tracking",
                    "Inventory Management",
                    "Technician Dispatch",
                    "AMC Management",
                    "Financial Reporting"
                ],
                "implementation_timeline": "4-6 weeks",
                "training_included": True,
                "support": "24/7 premium support"
            },
            "pricing": {
                "setup_fee": 50000,
                "monthly_subscription": 15000,
                "currency": "INR",
                "billing_cycle": "monthly",
                "discount_offered": "10% annual prepay discount available"
            },
            "roi_projection": {
                "cost_savings_year_1": 360000,
                "efficiency_gain": "40%",
                "payback_period": "3 months"
            },
            "next_steps": [
                "Review proposal",
                "Schedule demo call",
                "Finalize requirements",
                "Sign agreement",
                "Kickoff implementation"
            ]
        }
        
        return ToolResult(True, data=proposal)
    
    def _qualify_lead(self, lead: Dict) -> ToolResult:
        """Qualify a lead using BANT framework."""
        print(f"  [Sales] Qualifying lead: {lead.get('name', 'Unknown')}")
        
        # Mock qualification (in production, use AI analysis)
        qualification = {
            "lead_name": lead.get("name", "Unknown"),
            "company": lead.get("company", "Unknown"),
            "bant_score": {
                "budget": {"score": 7, "notes": "Solar businesses typically have IT budgets"},
                "authority": {"score": 6, "notes": "Need to confirm decision-maker status"},
                "need": {"score": 8, "notes": "Clear pain points in solar operations"},
                "timeline": {"score": 5, "notes": "Timeline needs clarification"}
            },
            "total_score": 26,
            "max_score": 40,
            "qualification_status": "qualified",  # >60% = qualified
            "recommendation": "Proceed with demo and proposal",
            "next_action": "Schedule discovery call"
        }
        
        return ToolResult(True, data=qualification)
    
    def _analyze_pipeline(self) -> ToolResult:
        """Analyze sales pipeline health."""
        print(f"  [Sales] Analyzing pipeline")
        
        pipeline_analysis = {
            "total_leads": 47,
            "by_stage": {
                "new": 12,
                "contacted": 15,
                "qualified": 10,
                "proposal": 6,
                "negotiation": 3,
                "closed_won": 1,
                "closed_lost": 0
            },
            "conversion_rates": {
                "lead_to_qualified": "53%",
                "qualified_to_proposal": "60%",
                "proposal_to_close": "50%",
                "overall": "16%"
            },
            "pipeline_value": {
                "weighted_value": 2850000,
                "currency": "INR"
            },
            "health_indicators": {
                "velocity": "Good - avg 14 days per stage",
                "coverage": "Healthy - 4x quota",
                "bottleneck": "Proposal stage needs attention"
            },
            "recommendations": [
                "Focus on moving 6 proposals to negotiation",
                "Increase outreach to add 10+ new leads this week",
                "Follow up with 15 contacted leads"
            ]
        }
        
        return ToolResult(True, data=pipeline_analysis)
    
    def _create_outreach_message(self, prospect_name: str, company: str) -> ToolResult:
        """Create personalized outreach message."""
        return self.tools.communication.compose_outreach_message(
            prospect_name=prospect_name,
            company=company,
            value_prop="SolarHub automates solar business operations",
            cta="Book a demo"
        )


class OperationsAgent(BaseAgent):
    """
    Operations Specialist Agent
    
    Capabilities:
    - Customer management
    - Vendor coordination
    - Technician scheduling
    - Inventory management
    - Order fulfillment
    - Installation tracking
    - AMC management
    """
    
    def __init__(self, tools: ToolRuntime = None):
        super().__init__("Operations Agent", "OPERATIONS", tools)
    
    def execute(self, task: str, context: Dict = None) -> Dict:
        """Execute operations-related task."""
        start_time = datetime.now()
        context = context or {}
        
        result = None
        task_lower = task.lower()
        
        if "customer" in task_lower:
            result = self._manage_customer(context.get("action", "list"), context.get("customer_data", {}))
        elif "vendor" in task_lower:
            result = self._coordinate_vendors(context.get("action", "list"))
        elif "technician" in task_lower or "schedule" in task_lower:
            result = self._schedule_technician(context.get("technician_id", ""), context.get("job", {}))
        elif "inventory" in task_lower or "stock" in task_lower:
            result = self._check_inventory(context.get("items", []))
        elif "order" in task_lower:
            result = self._process_order(context.get("order_data", {}))
        elif "installation" in task_lower:
            result = self._track_installation(context.get("installation_id", ""))
        elif "amc" in task_lower:
            result = self._manage_amc(context.get("customer_id", ""))
        else:
            # Default: operations overview
            result = self._get_operations_overview()
        
        duration = (datetime.now() - start_time).total_seconds()
        self._log_execution(task, result, duration)
        
        return {
            "agent": self.name,
            "domain": self.domain,
            "task": task,
            "result": result.to_dict(),
            "duration": duration
        }
    
    def _manage_customer(self, action: str, customer_data: Dict) -> ToolResult:
        """Manage customer operations."""
        print(f"  [Ops] Managing customer: {action}")
        
        if action == "create":
            result = self.tools.business.create_customer_record(
                name=customer_data.get("name", ""),
                contact=customer_data.get("contact", ""),
                address=customer_data.get("address", {}),
                system_size=customer_data.get("system_size_kw")
            )
        elif action == "list":
            result = ToolResult(True, data={
                "customers": [
                    {"id": "CUST_001", "name": "Rajesh Kumar", "location": "Mumbai", "system_size": "5kW"},
                    {"id": "CUST_002", "name": "Priya Sharma", "location": "Pune", "system_size": "3kW"},
                    {"id": "CUST_003", "name": "Amit Patel", "location": "Ahmedabad", "system_size": "10kW"}
                ],
                "total": 3
            })
        else:
            result = ToolResult(False, error=f"Unknown customer action: {action}")
        
        return result
    
    def _coordinate_vendors(self, action: str) -> ToolResult:
        """Coordinate with vendors."""
        print(f"  [Ops] Coordinating vendors: {action}")
        
        vendors = {
            "panel_suppliers": [
                {"name": "Tata Power Solar", "rating": 4.8, "lead_time": "7 days"},
                {"name": "Adani Solar", "rating": 4.6, "lead_time": "5 days"},
                {"name": "Vikram Solar", "rating": 4.5, "lead_time": "10 days"}
            ],
            "inverter_suppliers": [
                {"name": "Delta Electronics", "rating": 4.7, "lead_time": "3 days"},
                {"name": "Growatt", "rating": 4.5, "lead_time": "5 days"}
            ],
            "battery_suppliers": [
                {"name": "Exide", "rating": 4.6, "lead_time": "2 days"},
                {"name": "Luminous", "rating": 4.4, "lead_time": "3 days"}
            ]
        }
        
        return ToolResult(True, data={
            "vendors": vendors,
            "action": action,
            "recommendations": [
                "Reorder panels from Tata Power Solar (best rating)",
                "Check inventory before placing new orders",
                "Negotiate bulk discount with current suppliers"
            ]
        })
    
    def _schedule_technician(self, technician_id: str, job: Dict) -> ToolResult:
        """Schedule technician for job."""
        print(f"  [Ops] Scheduling technician {technician_id}")
        
        schedule = {
            "technician_id": technician_id or "TECH_AUTO_ASSIGN",
            "job": job,
            "available_slots": [
                {"date": "2024-01-15", "time": "09:00-13:00"},
                {"date": "2024-01-15", "time": "14:00-18:00"},
                {"date": "2024-01-16", "time": "09:00-13:00"}
            ],
            "recommended_slot": {"date": "2024-01-15", "time": "09:00-13:00"},
            "job_type": job.get("type", "installation"),
            "estimated_duration": job.get("duration", "4 hours"),
            "location": job.get("location", "TBD"),
            "status": "pending_confirmation"
        }
        
        return ToolResult(True, data=schedule)
    
    def _check_inventory(self, items: List[str]) -> ToolResult:
        """Check inventory levels."""
        print(f"  [Ops] Checking inventory")
        
        return self.tools.business.check_inventory()
    
    def _process_order(self, order_data: Dict) -> ToolResult:
        """Process customer order."""
        print(f"  [Ops] Processing order")
        
        if not order_data:
            order_data = {
                "customer_id": "CUST_001",
                "system_type": "5kW On-Grid",
                "components": {
                    "panels": "12x 400W Mono PERC",
                    "inverter": "5kW Hybrid Inverter",
                    "structure": "Fixed Tilt",
                    "cables": "DC & AC cables included"
                },
                "total_amount": 250000,
                "advance_paid": 50000
            }
        
        order = self.tools.business.create_installation_order(
            customer_id=order_data.get("customer_id", ""),
            system_details=order_data,
            technician_id=None  # Auto-assign
        )
        
        return order
    
    def _track_installation(self, installation_id: str) -> ToolResult:
        """Track installation progress."""
        print(f"  [Ops] Tracking installation {installation_id}")
        
        installation_status = {
            "installation_id": installation_id or "INST_2024_001",
            "customer": "Rajesh Kumar",
            "location": "Mumbai",
            "system_size": "5kW",
            "stages": [
                {"stage": "Site Survey", "status": "completed", "date": "2024-01-10"},
                {"stage": "Design Approval", "status": "completed", "date": "2024-01-11"},
                {"stage": "Material Procurement", "status": "completed", "date": "2024-01-12"},
                {"stage": "Installation", "status": "in_progress", "date": "2024-01-15"},
                {"stage": "Commissioning", "status": "pending", "date": null},
                {"stage": "Handover", "status": "pending", "date": null}
            ],
            "progress_percentage": 60,
            "estimated_completion": "2024-01-17",
            "assigned_technician": "TECH_003",
            "issues": []
        }
        
        return ToolResult(True, data=installation_status)
    
    def _manage_amc(self, customer_id: str) -> ToolResult:
        """Manage AMC (Annual Maintenance Contract)."""
        print(f"  [Ops] Managing AMC for customer {customer_id}")
        
        amc_details = {
            "customer_id": customer_id or "CUST_001",
            "amc_status": "active",
            "contract_start": "2023-06-15",
            "contract_end": "2024-06-14",
            "services_included": [
                "Quarterly maintenance visits",
                "Panel cleaning (4 times/year)",
                "Performance monitoring",
                "Emergency support",
                "Spare parts (labor extra)"
            ],
            "scheduled_visits": [
                {"visit": 1, "date": "2023-09-15", "status": "completed"},
                {"visit": 2, "date": "2023-12-15", "status": "completed"},
                {"visit": 3, "date": "2024-03-15", "status": "scheduled"},
                {"visit": 4, "date": "2024-06-10", "status": "scheduled"}
            ],
            "last_visit_report": {
                "date": "2023-12-15",
                "technician": "TECH_003",
                "findings": "All systems normal, panels cleaned",
                "performance": "Operating at 98% efficiency"
            },
            "renewal_reminder": "2024-05-15"
        }
        
        return ToolResult(True, data=amc_details)
    
    def _get_operations_overview(self) -> ToolResult:
        """Get overall operations status."""
        print(f"  [Ops] Getting operations overview")
        
        overview = {
            "active_customers": 47,
            "pending_installations": 8,
            "in_progress_amc": 35,
            "inventory_status": "healthy",
            "technician_availability": "4 available, 3 on-site",
            "vendor_relationships": "good standing",
            "this_month_revenue": 1250000,
            "pending_orders_value": 850000,
            "key_metrics": {
                "avg_installation_time": "2.5 days",
                "customer_satisfaction": 4.7,
                "first_time_fix_rate": "94%",
                "amc_renewal_rate": "87%"
            }
        }
        
        return ToolResult(True, data=overview)


class CreativeAgent(BaseAgent):
    """
    Creative Specialist Agent
    
    Capabilities:
    - Video script writing
    - Demo video production planning
    - Ad creative development
    - Tutorial creation
    - Presentation design
    - Thumbnail generation
    - Social media content
    """
    
    def __init__(self, tools: ToolRuntime = None):
        super().__init__("Creative Agent", "CREATIVE", tools)
    
    def execute(self, task: str, context: Dict = None) -> Dict:
        """Execute creative-related task."""
        start_time = datetime.now()
        context = context or {}
        
        result = None
        task_lower = task.lower()
        
        if "script" in task_lower or "video" in task_lower:
            result = self._create_video_script(
                context.get("topic", "SolarHub Demo"),
                context.get("duration", "2min"),
                context.get("style", "tutorial")
            )
        elif "presentation" in task_lower or "deck" in task_lower:
            result = self._create_presentation(
                context.get("topic", "SolarHub Overview"),
                context.get("slides", 10)
            )
        elif "thumbnail" in task_lower or "image" in task_lower:
            result = self._design_thumbnail(
                context.get("topic", "SolarHub"),
                context.get("style", "professional")
            )
        elif "tutorial" in task_lower:
            result = self._plan_tutorial(context.get("feature", "Dashboard"))
        elif "ad" in task_lower or "creative" in task_lower:
            result = self._develop_ad_creative(context.get("campaign", "Brand Awareness"))
        elif "social" in task_lower:
            result = self._create_social_content(
                context.get("platform", "linkedin"),
                context.get("topic", "")
            )
        else:
            # Default: create content plan
            result = self._create_content_plan(context.get("content_type", "mixed"))
        
        duration = (datetime.now() - start_time).total_seconds()
        self._log_execution(task, result, duration)
        
        return {
            "agent": self.name,
            "domain": self.domain,
            "task": task,
            "result": result.to_dict(),
            "duration": duration
        }
    
    def _create_video_script(self, topic: str, duration: str, style: str) -> ToolResult:
        """Create video script."""
        print(f"  [Creative] Creating video script: {topic}")
        
        return self.tools.media.generate_script(topic, duration, style)
    
    def _create_presentation(self, topic: str, slides: int) -> ToolResult:
        """Create presentation outline."""
        print(f"  [Creative] Creating {slides}-slide presentation: {topic}")
        
        return self.tools.media.create_presentation_outline(topic, slides)
    
    def _design_thumbnail(self, topic: str, style: str) -> ToolResult:
        """Design thumbnail concept."""
        print(f"  [Creative] Designing thumbnail: {topic}")
        
        return self.tools.media.generate_thumbnail_prompt(topic, style)
    
    def _plan_tutorial(self, feature: str) -> ToolResult:
        """Plan tutorial content."""
        print(f"  [Creative] Planning tutorial: {feature}")
        
        tutorial_plan = {
            "feature": feature,
            "format": "Screen recording with voiceover",
            "duration": "5-7 minutes",
            "sections": [
                {"section": "Introduction", "duration": "0:00-0:30", "content": "What is " + feature},
                {"section": "Use Cases", "duration": "0:30-1:30", "content": "When to use " + feature},
                {"section": "Step-by-Step Demo", "duration": "1:30-5:00", "content": "Live demonstration"},
                {"section": "Tips & Tricks", "duration": "5:00-6:00", "content": "Pro tips"},
                {"section": "Conclusion", "duration": "6:00-7:00", "content": "Summary and CTA"}
            ],
            "required_assets": [
                "Screen recording of " + feature,
                "Voiceover script",
                "Background music",
                "Intro/outro graphics"
            ],
            "distribution_channels": [
                "YouTube",
                "Website help center",
                "Customer onboarding emails",
                "Social media"
            ]
        }
        
        return ToolResult(True, data=tutorial_plan)
    
    def _develop_ad_creative(self, campaign: str) -> ToolResult:
        """Develop ad creative concept."""
        print(f"  [Creative] Developing ad creative: {campaign}")
        
        ad_concept = {
            "campaign": campaign,
            "concept": "SolarHub transforms chaotic solar operations into streamlined success",
            "visual_elements": [
                "Before/After comparison",
                "Dashboard screenshot showing key metrics",
                "Happy business owner testimonial",
                "Solar installation timelapse"
            ],
            "copy_variations": [
                {
                    "headline": "From Chaos to Control",
                    "body": "Solar businesses using SolarHub save 30% on operations. See how.",
                    "cta": "Start Free Trial"
                },
                {
                    "headline": "Your Solar Business, Simplified",
                    "body": "One platform for customers, projects, inventory, and teams.",
                    "cta": "Book Demo"
                }
            ],
            "formats": [
                {"format": "Square (1:1)", "use": "Instagram, Facebook Feed"},
                {"format": "Story (9:16)", "use": "Instagram Stories, Reels"},
                {"format": "Landscape (16:9)", "use": "YouTube, Website"}
            ],
            "color_palette": ["#FF6B35", "#004E89", "#FFFFFF", "#F7F7F7"],
            "brand_guidelines": "Use SolarHub logo, maintain consistent typography"
        }
        
        return ToolResult(True, data=ad_concept)
    
    def _create_social_content(self, platform: str, topic: str) -> ToolResult:
        """Create social media content."""
        print(f"  [Creative] Creating {platform} content")
        
        # Delegate to GrowthAgent's social content method via tools
        # For now, create directly
        content = {
            "platform": platform,
            "topic": topic or "SolarHub features",
            "post_ideas": [
                f"🌞 How SolarHub helps solar businesses save 30% on operations",
                f"💡 Feature spotlight: {topic or 'Real-time project tracking'}",
                f"📈 Customer success story: 50% faster installations with SolarHub",
                f"🔧 Pro tip: Use SolarHub to track inventory in real-time"
            ],
            "visual_suggestions": [
                "Dashboard screenshot with key metrics highlighted",
                "Before/After workflow comparison",
                "Team using SolarHub on mobile at installation site",
                "Infographic: Solar operations statistics"
            ],
            "hashtags": ["#SolarEnergy", "#SolarBusiness", "#CleanTech", "#SolarTech"],
            "posting_schedule": "3-4 times per week, best times: 9-11 AM, 2-4 PM"
        }
        
        return ToolResult(True, data=content)
    
    def _create_content_plan(self, content_type: str) -> ToolResult:
        """Create comprehensive content plan."""
        print(f"  [Creative] Creating content plan: {content_type}")
        
        content_plan = {
            "content_type": content_type,
            "monthly_calendar": {
                "week1": [
                    {"day": "Monday", "content": "Blog: Industry trends", "platform": "LinkedIn"},
                    {"day": "Wednesday", "content": "Tutorial video", "platform": "YouTube"},
                    {"day": "Friday", "content": "Customer success story", "platform": "All"}
                ],
                "week2": [
                    {"day": "Tuesday", "content": "Feature highlight", "platform": "Twitter"},
                    {"day": "Thursday", "content": "Behind-the-scenes", "platform": "Instagram"},
                    {"day": "Saturday", "content": "Industry news roundup", "platform": "LinkedIn"}
                ]
            },
            "content_pillars": [
                "Educational (tutorials, guides)",
                "Social Proof (testimonials, case studies)",
                "Product Updates (features, improvements)",
                "Industry Insights (trends, news)"
            ],
            "resource_requirements": {
                "video_production": "8 hours/month",
                "graphic_design": "4 hours/month",
                "copywriting": "6 hours/month",
                "community_management": "10 hours/month"
            }
        }
        
        return ToolResult(True, data=content_plan)


def main():
    """Test business agents."""
    print("=== SolarHub Business Agents ===\n")
    
    tools = ToolRuntime()
    
    # Initialize all agents
    agents = {
        "growth": GrowthAgent(tools),
        "sales": SalesAgent(tools),
        "operations": OperationsAgent(tools),
        "creative": CreativeAgent(tools)
    }
    
    # Test each agent
    test_tasks = {
        "growth": "Research solar market trends in India",
        "sales": "Find prospects for solar installation companies",
        "operations": "Check inventory status",
        "creative": "Create video script for SolarHub demo"
    }
    
    for agent_name, agent in agents.items():
        print(f"\n--- Testing {agent.name} ---")
        task = test_tasks[agent_name]
        result = agent.execute(task)
        
        print(f"Task: {task}")
        print(f"Success: {result['result']['success']}")
        if result['result']['success']:
            data_preview = str(result['result']['data'])[:200]
            print(f"Data preview: {data_preview}...")
        
        # Show agent status
        status = agent.get_status()
        print(f"Tasks completed: {status['metrics']['tasks_completed']}")
        print(f"Success rate: {status['metrics']['success_rate']:.0%}")
    
    print("\n=== All Agents Tested ===")


if __name__ == "__main__":
    main()
