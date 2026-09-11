# Film Production Planning Prototype

This repository is a local-first film-production planning prototype for turning screenplay PDFs into project, breakdown, schedule, call-sheet, report, and budget views.

## Core features

- Create and manage a browser-local film project from an uploaded screenplay PDF.
- Express endpoint for PDF upload and scripted screenplay parsing.
- Script, scene, character, location, prop, and production-requirement analysis views.
- Scheduling, call-sheet, report, summary, and budgeting interfaces.
- Optional Gemini-powered depth analysis and schedule/budget generation.
- Local persistence for projects, generated schedules, budgets, and model responses.
- Raw JSON inspection pages for agent outputs.

## Technology stack

- React 18 and TypeScript
- Vite 5 with the React SWC plugin
- Express 5, Multer, and PDF parsing/extraction packages
- Google Gen AI SDKs
- React Router, TanStack Query, and Recharts
- Tailwind CSS and Radix UI components

## Prerequisites

- Node.js compatible with the package dependencies
- npm
- A Gemini API key only for AI-assisted analysis features

## Local setup

```bash
git clone https://github.com/varunisrani/hh.git
cd hh
npm install
npm run dev
```

`npm run dev` starts both the Express service and the Vite client. To run them separately:

```bash
npm run dev:server
npm run dev:client
```

Build and preview the client with:

```bash
npm run build
npm run preview
```

The manifest also provides `npm run build:dev`, `npm run lint`, and `npm run test:gemini`. The Gemini test makes an external API request and is not required for local UI development.

## Configuration

- `VITE_GEMINI_API_KEY` — enables Gemini-backed depth analysis in browser code

**Security warning:** the current repository contains committed Google-key-pattern material in a tracked `.env` and in multiple source and test files. No credential from this snapshot should be trusted. Provider-side revocation and rotation are mandatory; deleting or documenting the committed strings does not revoke them. Removing the material from reachable Git history is a separate cleanup task and cannot invalidate copies already retained in forks or caches. Never commit replacement API-key values.

## Project structure

- `src/pages/` — project, script, analysis, schedule, call-sheet, report, and budget screens
- `src/services/` — screenplay, scheduling, budgeting, costing, and Gemini services
- `src/components/` — application layout and reusable UI components
- `src/hooks/` — selected-project state and UI hooks
- `server/server.cjs` — local Express upload and analysis endpoint
- `server/pdfscript.cjs` — screenplay PDF analyzer
- `server/uploads/` and `server/analysis_outputs/` — tracked sample inputs and generated examples

## Status and limitations

This is a prototype, not a validated production budgeting or scheduling system. Most project data and generated outputs are kept in browser `localStorage`; the upload service writes files locally and listens on a fixed development port. A Gemini key configured through the current browser code would be exposed in a deployed client, so AI calls should move behind a secured server endpoint before production use. README-only changes do not remediate the existing credential incident described above. Review uploaded scripts and generated artifacts for rights and sensitive content before sharing them.
