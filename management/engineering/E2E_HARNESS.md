# Autonomous Engineering Agent v0.1 — E2E Harness

`test_e2e_harness.py` validates the engineering primitives end-to-end against a disposable fixture repository.

## Contract

1. Create isolated Git worktree.
2. Start from a deterministic failing test.
3. Capture the failure.
4. Apply a deterministic repair (no Ollama/network dependency).
5. Re-test and require success.
6. Run the security gate.
7. Verify the expected diff scope.
8. Generate a PR specification artifact.
9. Commit the verified change inside the disposable worktree.
10. Remove the worktree and verify the fixture root remains clean.

The deterministic repair is deliberate: this test proves the orchestration and safety boundaries independently of model availability. Live Qwen/Ollama behavior should be validated separately when Ollama is configured.

## Run

From the repository root:

```bash
pytest management/engineering/test_e2e_harness.py
```

Or:

```bash
python -m management.engineering.test_e2e_harness
```

A passing run is evidence that the disposable workspace → test failure → repair → security → diff → PR-spec → commit → cleanup contract works. It is not evidence that an LLM autonomously selected the repair; that requires a separate live-model test.
