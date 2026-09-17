# Autonomous Engineering Agent v0.2 — Real LLM Repair

## Scope

v0.2 adds a dual-mode verification boundary around the existing local-first
`RepairLoop`: live Ollama/Qwen-Coder inference when available, and a strict
fail-closed offline contract when it is not.

## Run

```bash
python -m management.engineering.test_llm_repair
```

Optional model configuration:

```text
OLLAMA_BASE_URL=http://127.0.0.1:11434
SOLARHUB_ENGINEERING_MODEL=qwen2.5-coder:7b
```

The harness probes `/api/tags` first. If Ollama is unavailable, it verifies
that `RepairLoop.attempt()` reports `offline: true` and leaves the fixture
unchanged. If Ollama is reachable, it verifies that a real proposal is returned
and that the controlled fixture is repaired.

## Metrics

`LLMRepairMetrics` writes append-only JSONL records to:

`management/memory/llm_repair_metrics.jsonl`

The metrics include cycle id, model, attempts, execution time, before/after
test state, model proposal metadata, changed files, diff statistics, security
result, success state, and fallback state.

## Verification boundary

A passing offline run means the adapter fails closed safely. A passing live run
means the configured model produced an applicable repair for the controlled
fixture. Neither test grants production deployment access; the existing
engineering loop remains responsible for worktree isolation, security gates,
diff verification and delivery.
