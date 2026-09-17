"""Allowlisted build/test execution with bounded output and timeouts."""
from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
import subprocess
import time


@dataclass
class CommandResult:
    command: str
    ok: bool
    returncode: int
    stdout: str
    stderr: str
    duration_seconds: float
    timed_out: bool = False


class BuildTestExecutor:
    COMMANDS = {
        "build:web": "npm run build:web",
        "lint": "npm run lint",
        "test:backend": "npm run test:backend",
        "release:check": "npm run release:check",
    }

    def __init__(self, workspace: str | Path, timeout: int = 180):
        self.workspace = Path(workspace).resolve()
        self.timeout = max(10, min(timeout, 600))

    def run(self, name_or_cmd: str | list[str]) -> CommandResult:
        if isinstance(name_or_cmd, list):
            # Direct command execution for fixtures
            command = " ".join(name_or_cmd)
            cmd_key = None
        else:
            if name_or_cmd not in self.COMMANDS:
                raise ValueError(f"Command is not allowlisted: {name_or_cmd}")
            command = self.COMMANDS[name_or_cmd]
            cmd_key = name_or_cmd
        started = time.monotonic()
        try:
            p = subprocess.run(command, cwd=self.workspace, shell=True, text=True, capture_output=True, timeout=self.timeout)
            return CommandResult(command, p.returncode == 0, p.returncode, p.stdout[-30000:], p.stderr[-30000:], round(time.monotonic() - started, 2))
        except subprocess.TimeoutExpired as exc:
            return CommandResult(command, False, 124, str(exc.stdout or "")[-30000:], str(exc.stderr or "")[-30000:], round(time.monotonic() - started, 2), True)

    def run_suite(self, names: list[str] | None = None) -> dict:
        selected = names or ["release:check"]
        results = [asdict(self.run(name)) for name in selected]
        return {"ok": all(r["ok"] for r in results), "results": results}
