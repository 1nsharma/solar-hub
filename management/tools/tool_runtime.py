"""SolarHub tool runtime: explicit, inspectable capabilities for autonomous agents."""
from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Dict, Optional
import json, os, subprocess, urllib.error, urllib.request

@dataclass
class ToolResult:
    tool: str
    ok: bool
    output: Any = None
    error: Optional[str] = None
    metadata: Dict[str, Any] | None = None

@dataclass
class ToolSpec:
    name: str
    category: str
    description: str
    offline: bool
    handler: Callable[..., ToolResult]

class ToolRuntime:
    def __init__(self, root_dir: str | None = None):
        self.root_dir = Path(root_dir or Path(__file__).resolve().parents[2]).resolve(); self.tools: Dict[str, ToolSpec] = {}; self._register_core_tools()

    def register(self, spec: ToolSpec) -> None: self.tools[spec.name] = spec
    def list_tools(self) -> list[dict[str, Any]]: return [{"name":s.name,"category":s.category,"description":s.description,"offline":s.offline} for s in self.tools.values()]
    def execute(self, name: str, **kwargs: Any) -> ToolResult:
        spec=self.tools.get(name)
        if not spec: return ToolResult(name,False,error="Unknown tool")
        try: return spec.handler(**kwargs)
        except Exception as exc: return ToolResult(name,False,error=f"{type(exc).__name__}: {exc}")

    def _register_core_tools(self) -> None:
        core=[("file.read","code","Read a UTF-8 text file",True,self._file_read),("file.write","code","Write a UTF-8 text file",True,self._file_write),("file.list","code","List files",True,self._file_list),("command.run","code","Run an approved local command",True,self._command_run),("git.status","code","Read git status",True,self._git_status),("git.diff","code","Read git diff",True,self._git_diff),("git.log","code","Read recent git history",True,self._git_log),("git.branch","code","Create a local git branch",True,self._git_branch),("git.commit","code","Create a local git commit",True,self._git_commit),("test.run","code","Run a repository test command",True,self._command_run),("engineering.execute_loop","engineering","Run isolated build/test/repair/security/diff/PR workflow",True,self._engineering_execute_loop),("package.install","code","Install a declared npm/pip package",False,self._package_install),("browser.fetch","browser","Fetch a public HTTP page",False,self._http_fetch),("website.status","browser","Check public website HTTP status",False,self._website_status),("api.request","api","Make an HTTP API request",False,self._api_request),("github.request","api","Call a GitHub API endpoint",False,self._github_request),("gemini.request","api","Call Gemini",False,self._gemini_request),("security.secrets","security","Scan for leaked-secret patterns",True,self._security_secrets),("security.dependencies","security","Run npm audit",True,self._security_dependencies),("security.headers","security","Inspect HTTP security headers",False,self._security_headers),("business.crm","business","CRM adapter contract",True,self._not_configured),("business.leads","business","Read active SolarHub leads from event store",True,self._business_leads),("business.customer","business","Customer adapter contract",True,self._not_configured),("business.inventory","business","Inventory adapter contract",True,self._not_configured),("business.invoice","business","Invoice adapter contract",True,self._not_configured),("media.script","media","Create a structured video script artifact",True,self._media_script),("media.thumbnail","media","Create a thumbnail job specification",True,self._media_job),("media.presentation","media","Create a presentation job specification",True,self._media_job)]
        for item in core: self.register(ToolSpec(*item))

    def _engineering_execute_loop(self, objective: str, allowed_paths=None, checks=None, max_attempts=3, timeout=180, **_):
        from ..engineering.engineering_loop import EngineeringLoop
        result=EngineeringLoop(self.root_dir,max_attempts=max_attempts,timeout=timeout).run(objective,allowed_paths,checks)
        return ToolResult("engineering.execute_loop",bool(result.get("ok")),result,None if result.get("ok") else result.get("error") or result.get("stage"))
    def _safe_path(self,path):
        target=(self.root_dir/path).resolve()
        if target!=self.root_dir and self.root_dir not in target.parents: raise ValueError("Path escapes SolarHub workspace")
        return target
    def _file_read(self,path,**_): return ToolResult("file.read",True,self._safe_path(path).read_text(encoding="utf-8"))
    def _file_write(self,path,content,**_):
        p=self._safe_path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text(content,encoding="utf-8"); return ToolResult("file.write",True,{"path":str(p.relative_to(self.root_dir))})
    def _file_list(self,path=".",**_): return ToolResult("file.list",True,[str(x.relative_to(self.root_dir)) for x in self._safe_path(path).rglob("*") if x.is_file()][:2000])
    def _run(self,command,timeout=120,cwd=None): return subprocess.run(command,cwd=cwd or self.root_dir,shell=True,text=True,capture_output=True,timeout=max(1,min(timeout,600)))
    def _command_run(self,command,timeout=120,**_):
        p=self._run(command,timeout); return ToolResult("command.run",p.returncode==0,{"stdout":p.stdout[-20000:],"stderr":p.stderr[-20000:],"returncode":p.returncode})
    def _git_status(self,**_): return self._command_run("git status --short")
    def _git_diff(self,**_): return self._command_run("git diff --")
    def _git_log(self,limit=10,**_): return self._command_run(f"git log --oneline -n {max(1,min(limit,50))}")
    def _git_branch(self,name,**_): return self._command_run(f"git switch -c {name}")
    def _git_commit(self,message,**_): return self._command_run(f'git add -A && git commit -m "{message.replace(chr(34),chr(39))}"')
    def _package_install(self,manager,package,**_): return self._command_run(f"{manager} install {package}" if manager=="npm" else f"python -m pip install {package}",timeout=600) if manager in {"npm","pip"} else ToolResult("package.install",False,error="Only npm and pip are supported")
    def _http_fetch(self,url,**_):
        with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"SolarHub-Agent/1.0"}),timeout=20) as r: return ToolResult("browser.fetch",True,r.read(50000).decode("utf-8",errors="replace"),{"status":r.status,"url":r.url})
    def _website_status(self,url,**_):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,method="HEAD",headers={"User-Agent":"SolarHub-Agent/1.0"}),timeout=15) as r:return ToolResult("website.status",True,{"status":r.status,"url":r.url})
        except urllib.error.HTTPError as e:return ToolResult("website.status",True,{"status":e.code,"url":url})
    def _api_request(self,url,method="GET",body=None,headers=None,**_):
        req=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,method=method.upper(),headers=headers or {"Content-Type":"application/json"})
        with urllib.request.urlopen(req,timeout=30) as r:return ToolResult("api.request",True,r.read(50000).decode("utf-8",errors="replace"),{"status":r.status})
    def _github_request(self,path,**_):
        token=os.getenv("GITHUB_TOKEN")
        return self._api_request("https://api.github.com"+path,headers={"Authorization":f"Bearer {token}","Accept":"application/vnd.github+json"}) if token else ToolResult("github.request",False,error="GITHUB_TOKEN is not configured")
    def _gemini_request(self,prompt,**_): return ToolResult("gemini.request",False,error="Provider adapter not enabled in this local runtime") if os.getenv("GOOGLE_API_KEY") else ToolResult("gemini.request",False,error="GOOGLE_API_KEY is not configured")
    def _security_secrets(self,**_):
        patterns=["BEGIN PRIVATE KEY","ghp_","github_pat_","sk-proj-","AIza"]; hits=[]
        for p in self.root_dir.rglob("*"):
            if not p.is_file() or any(x in p.parts for x in {"node_modules",".git","dist","build","__pycache__"}): continue
            try:t=p.read_text(encoding="utf-8",errors="ignore")
            except OSError:continue
            for marker in patterns:
                if marker in t:hits.append({"file":str(p.relative_to(self.root_dir)),"pattern":marker})
        return ToolResult("security.secrets",not hits,{"findings":hits})
    def _security_dependencies(self,**_): return ToolResult("security.dependencies",True,{"skipped":"No package-lock.json"}) if not (self.root_dir/"package-lock.json").exists() else self._command_run("npm audit --omit=dev",timeout=300)
    def _security_headers(self,url,**_):
        with urllib.request.urlopen(urllib.request.Request(url,method="HEAD",headers={"User-Agent":"SolarHub-Agent/1.0"}),timeout=20) as r:return ToolResult("security.headers",True,{h:r.headers.get(h) for h in ["content-security-policy","strict-transport-security","x-content-type-options","x-frame-options","referrer-policy"]})
    def _business_leads(self,limit=100,**_):
        events=self.root_dir/"management"/"memory"/"events.jsonl"
        if not events.exists(): return ToolResult("business.leads",True,[])
        leads=[]
        for line in events.read_text(encoding="utf-8").splitlines():
            try:
                e=json.loads(line)
                if e.get("event_type") in {"lead.created","lead_created"}:
                    p=e.get("payload",{}); leads.append(p.get("lead",p))
            except json.JSONDecodeError: continue
        return ToolResult("business.leads",True,leads[-max(1,min(int(limit),500)):])
    def _not_configured(self,**_): return ToolResult("business.adapter",False,error="Adapter contract registered; external business system is not configured")
    def _media_script(self,title,outline=None,**_): return ToolResult("media.script",True,{"title":title,"outline":outline or [],"status":"draft_spec"})
    def _media_job(self,title,**_): return ToolResult("media.job",True,{"title":title,"status":"job_spec_created"})

if __name__=="__main__": print(json.dumps(ToolRuntime().list_tools(),indent=2))
