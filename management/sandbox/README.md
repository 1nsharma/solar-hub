# SolarHub Engineering Agent — Local Sandbox

This is the Phase 1 prototype for repository-aware engineering analysis.

## Runtime model

```text
SolarHub Goal
  -> Agent Runtime
  -> Engineering Sandbox
  -> Repository Scan (read-only)
  -> Local Ollama / Qwen-Coder
  -> Structured Engineering Analysis
```

The container mounts the SolarHub repository at `/workspace` as **read-only**. The prototype intentionally does not mount the Docker socket, production credentials, or a writable repository. Code mutation, tests, branch creation and PR creation remain separate Tool Runtime capabilities.

## Local setup

Install Ollama on the host and make a coding model available, for example:

```bash
ollama pull qwen2.5-coder:7b
```

Then from `management/sandbox`:

```bash
docker compose build
docker compose run --rm engineering-agent
```

If Ollama is unavailable, the scanner still inventories the repository and exits with a structured `scan_only` result.

## Next integration

The next step is to expose this sandbox as a Tool Runtime contract such as `engineering.sandbox_scan`, then add an ephemeral **writable** workspace for the controlled loop:

`inspect -> plan -> edit -> test -> security scan -> diff -> PR`

That writable stage should use a disposable branch/workspace rather than the production checkout.
