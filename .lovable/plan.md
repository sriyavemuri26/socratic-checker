# README.md for Socratic Checker

Create a project README.md at the repository root using the exact heading and subheading structure requested by the user. The README will frame Socratic Checker as a vibecoded application built for DevFest DC 2026 using Lovable.

Sections to include:

1. `# Socratic Checker`
2. `> **Note**:` — introductory note
3. `**[Live Demo Link]**` — placeholder for the demo URL
4. `## Video Demo` — with a placeholder for a Loom link
5. `## What "Socratic Checker" Accomplishes` — describe the app: 3-question conceptual diagnostic that surfaces misconceptions and generates a targeted learning roadmap instead of testing recall
6. `## How It Works`
   - `### 1. Data Acquisition` — explain the user provides a topic, and the Lovable AI Gateway (Gemini 2.5 Flash via `buildDiagnostic`) generates questions, distractors, and a roadmap; include the fallback diagnostic
   - `### 2. Data Processing & Algorithms` — describe the prompt engineering, schema normalization, misconception mapping, and client-side state machine (input → quiz → report)
   - `### 3. Output & User Feedback` — describe the Gap Report: score, missed sub-concepts, correction cards, and 3-step micro-roadmap
7. `## Tech Stack`
   - `### Frontend` — React 19, TanStack Start, TanStack Router, Tailwind CSS v4, Lucide icons, Sonner toasts
   - `### Backend, Tooling & Infrastructure` — Lovable AI Gateway, `createServerFn` from `@tanstack/react-start`, Vite 7, edge/serverless runtime
8. `## What I Learned` — reflect on building with AI-assisted tooling, prompt engineering for conceptual diagnostics, edge runtime constraints, and schema normalization/fallback design
9. `## Getting Started Locally`
   - `### Prerequisites` — Node.js, npm/bun, Lovable API key
   - `### Installation & Run` — clone, install, run dev, env notes

Tone: enthusiastic but professional, DevFest DC 2026 context, concise but informative. No emojis. Preserve the exact heading hierarchy from the template.
