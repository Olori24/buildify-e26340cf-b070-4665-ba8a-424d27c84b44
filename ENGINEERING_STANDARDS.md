# OAE™ Engineering Standards

This repository is maintained under the **Open Autonomous Engineer (OAE™)** engineering standard.

## Required practices

- Security first; never commit credentials, tokens, private keys, or production secrets.
- Validate untrusted input at system boundaries.
- Keep configuration explicit and reviewable.
- Prefer small, cohesive modules and avoid duplicated domain logic.
- Every substantive capability should have automated tests appropriate to its risk.
- Cover normal, edge, and failure cases where applicable.
- Do not rely on hidden network state in unit tests.
- Verify lint, build, and tests before acceptance.
- Make one coherent change at a time.
- Preserve existing behaviour unless a contract change is intentional.
- Record consequential architectural decisions.

## Frontend quality gate

Changes to the frontend should pass:

```bash
npm run lint
npm run build
```

Substantive user-facing behaviour should also have automated regression coverage.

## Production readiness

Production readiness must be demonstrated, not assumed. The repository must have a reproducible build, explicit configuration contract, security controls, appropriate automated tests, deployment path, and operational documentation before it is described as production-ready.

## OAE™ improvement loop

```text
Observe → Understand → Plan → Approve → Implement → Test → Verify → Measure
```
