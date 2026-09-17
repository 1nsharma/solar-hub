# LLM Repair v0.3 — Live Qwen Proof

## Purpose

v0.3 is the first strict proof that SolarHub can use a real local Qwen-Coder model to repair a controlled software failure. It is intentionally stronger than the v0.2 dual-mode contract test: Ollama/model availability is a prerequisite, not a fallback.

## Proof chain

```text
Controlled Bug
  -> Real Test Failure
  -> Qwen-Coder 7B
  -> JSON Proposal
  -> Safe Proposal Validation
  -> Apply in Disposable Fixture
  -> Re-test
  -> Security Gate
  -> Diff Scope Verification
  -> PR Spec Artifact
  -> Temporary Workspace Cleanup
```

## Run

From the repository root:

```powershell
ollama serve
ollama pull qwen2.5-coder:7b
python -m management.engineering.test_live_qwen_repair_v0_3
```

Optional environment overrides:

```powershell
$env:OLLAMA_BASE_URL="http://127.0.0.1:11434"
$env:SOLARHUB_ENGINEERING_MODEL="qwen2.5-coder:7b"
```

The harness requires the configured model to be present in `/api/tags`. If Ollama is unreachable or the model is missing, the command fails rather than claiming a live proof.

## Negative safety cases

Before live inference, the harness verifies that proposals targeting:

- `.env` files
- `.github/workflows/*`
- paths outside the workspace
- non-string file content

are rejected without changing the fixture.

## Success criteria

A v0.3 PASS requires all of the following:

1. Ollama is reachable and the configured model is installed.
2. The controlled test fails before repair.
3. Qwen returns a JSON repair proposal.
4. The proposal is accepted only through the existing `RepairLoop.apply()` safety checks.
5. The repaired test passes.
6. Security verification passes.
7. Only the explicitly allowed file is changed.
8. A verified `.solarhub/pr_spec.json` artifact is generated.
9. The entire proof runs in a temporary fixture and does not mutate the SolarHub checkout.
10. No more than three repair attempts are made.

## What v0.3 does not prove

A PASS does **not** establish production autonomy, arbitrary repository repair, business-level learning, automatic merge, or safe deployment. Those require separate milestones and controls.
