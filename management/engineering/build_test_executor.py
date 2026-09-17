"""Allowlisted build/test execution with bounded output and timeouts."""
from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
import os
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

    def to_dict(self) -> dict:
        return asdict(self)


class BuildTestExecutor:
    COMMANDS = {
        "build:web": "npm run build:web",
        "lint": "npm run lint",
        "test:backend": "npm run test:backend",
        "release:check": "npm run release:check",
        "fixture:test": "python run_tests.py",
    }

    def __init__(self, workspace: str | Path, timeout: int = 180):
        self.workspace = Path(workspace).resolve()
        self.timeout = max(10, min(timeout, 600))

    def run(self, name: str | list[str]) -> CommandResult:
        if isinstance(name, list):
            name = " ".join(name)
        if name in self.COMMANDS:
            command = self.COMMANDS[name]
        elif name.startswith("python ") or name.startswith("npm "):
            command = name
        else:
            raise ValueError(f"Command is not allowlisted: {name}")
        started = time.monotonic()
        env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
        try:
            p = subprocess.run(command, cwd=self.workspace, shell=True, text=True, capture_output=True, timeout=self.timeout, env=env)
            return CommandResult(command, p.returncode == 0, p.returncode, p.stdout[-30000:], p.stderr[-30000:], round(time.monotonic() - started, 2))
        except subprocess.TimeoutExpired as exc:
            return CommandResult(command, False, 124, str(exc.stdout or "")[-30000:], str(exc.stderr or "")[-30000:], round(time.monotonic() - started, 2), True)

    def run_suite(self, names: list[str] | None = None) -> dict:
        selected = names or ["release:check"]
        results = [asdict(self.run(name)) for name in selected]
        return {"ok": all(r["ok"] for r in results), "results": results}
