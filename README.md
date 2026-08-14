# Buildify

> React + Vite application maintained under the OAE™ engineering standard.

## OAE™ Engineering Status

**Current classification:** active frontend application / professionalization in progress.

This repository contains a Vite + React + TypeScript application with Tailwind CSS, shadcn-style components, ESLint, and a substantial UI dependency set. fileciteturn99file0

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ESLint
- React Router
- React Query
- Zod

## Engineering Standard

OAE™ applies the following requirements to this repository:

- Security first
- Validate untrusted input at application boundaries
- Never commit credentials or secrets
- Keep configuration explicit and environment-specific
- Prefer small, cohesive components and services
- Avoid duplicated business logic
- Add automated tests for substantive behaviour
- Verify builds and linting before acceptance
- Preserve existing behaviour unless a change is intentional
- Document consequential architectural decisions

## OAE™ Improvement Loop

```text
Observe → Understand → Plan → Approve → Implement → Test → Verify → Measure
```

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Before accepting changes:

```bash
npm run lint
npm run build
```

## Production Readiness

Production readiness is evidence-based. A production release must have a verified build, configuration contract, security review, automated tests appropriate to the application, and a documented deployment path.

## Status

Active development and OAE™ professionalization.

---

**Engineered under the OAE™ standard — Open Autonomous Engineer**
