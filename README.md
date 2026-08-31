# Socratic Checker

> **Note**: This was a vibecoded application built for **DevFest DC 2026** using [Lovable](https://lovable.dev). The entire experience — from the dark-mode UI to the AI-powered diagnostic engine — was generated and iterated on with AI assistance, then refined into a polished single-page learning tool.

**[Live Demo](https://socratic-checker.lovable.app)**

---

## Video Demo

[Loom / video demo link — add here]

---

## What "Socratic Checker" Accomplishes

Socratic Checker is a conceptual diagnostic tool. Instead of quizzing users on memorized facts, it asks **three Socratic questions** about any topic the learner enters. Each question has one correct answer and three distractors, where every distractor is deliberately designed to expose a specific flawed mental model.

After the three questions, the app generates a **Gap Report** that shows:

- A conceptual alignment score
- Which sub-concepts were misunderstood
- Correction cards contrasting "What you thought" with "How it actually works"
- A targeted 3-step micro-roadmap for repairing the gap

The goal is to help learners locate the *cognitive gap*, not just the test score.

---

## How It Works

### 1. Data Acquisition

The user enters any topic — for example, "Pointer Arithmetic," "Photosynthesis," or "Market Equilibrium" — either by typing into a search-style input or selecting a preset pill.

That topic is sent to a server function (`generateDiagnostic`) which calls the **Lovable AI Gateway** using the `google/gemini-2.5-flash` model. The prompt instructs the model to act as a Socratic diagnostician and return strictly formatted JSON containing:

- 3 conceptual questions, each probing a different sub-concept
- 4 options per question: 1 correct and 3 distractors
- A "misconception" label and "correction" explanation for every distractor
- A 3-step learning roadmap

If the AI call fails or returns malformed data, the app falls back to a deterministic diagnostic generated locally.

### 2. Data Processing & Algorithms

Once the raw diagnostic payload is received, it is normalized by the `normalize` function in `src/lib/socratic.server.ts`. This step:

- Filters out questions that do not have exactly 4 options
- Ensures every question has at least one correct answer
- Truncates the set to exactly 3 questions and 3 roadmap steps
- Coerces all fields into strings and booleans to prevent runtime type issues

If normalization fails, the system returns a fallback diagnostic so the user never sees a broken screen.

On the client, a simple state machine in `src/routes/index.tsx` manages three phases:

1. **Input** — collect the topic
2. **Quiz** — render one question at a time, locking the choice after selection and advancing automatically
3. **Report** — compare answers against correct options and render the Gap Report

### 3. Output & User Feedback

The final screen is the **Gap Report**, composed of:

- **Score Card**: a visual summary of how many answers aligned with the correct conceptual model
- **Missed Sub-Concepts**: a list of topics where the chosen answer revealed a misconception
- **Correction Cards**: for each missed question, a side-by-side contrast of the flawed mental model the user selected and the correct principle
- **Targeted Micro-Roadmap**: three ordered steps — "Core Foundation," "Key Distinction," and "Mastery Application" — each with a focus area and concrete action

The report is designed to feel like feedback from a tutor, not a grade from a test.

---

## Tech Stack

### Frontend

- **React 19** — UI components and state management
- **TanStack Start** — full-stack React framework with file-based routing and server functions
- **TanStack Router** — type-safe routing and loaders
- **Tailwind CSS v4** — utility-first styling with a custom dark-mode color palette
- **Lucide React** — iconography
- **Sonner** — lightweight toast notifications for error handling

### Backend, Tooling & Infrastructure

- **Lovable AI Gateway** — hosted access to `google/gemini-2.5-flash` for generating diagnostics
- **`createServerFn` from `@tanstack/react-start`** — type-safe server functions for the AI call
- **Vite 7** — build tool and dev server
- **Edge / serverless runtime** — TanStack Start targets a Worker environment, so all server-side code avoids Node-only APIs and stays transform-safe

---

## What I Learned

Building Socratic Checker with Lovable taught me a few concrete lessons:

- **Prompt engineering is interface design.** The quality of the diagnostic depends entirely on how precisely the prompt constrains the model: exactly 3 questions, exactly 4 options, randomized correct positions, and explicit misconception/correction fields. The schema hint acts as a contract.
- **Always plan for failure.** AI calls can timeout, return markdown fences, or produce partial JSON. A robust `normalize` step plus a deterministic fallback keeps the app usable even when the model misbehaves.
- **Edge runtimes change how you write backend code.** Because TanStack Start targets a Worker environment, I had to avoid Node-only modules and keep server functions self-contained. Reading environment variables inside handlers rather than at module scope was a small but important shift.
- **AI-assisted coding accelerates exploration, but curation matters.** Lovable generated the structure, styling, and wiring quickly, but the real product value came from refining the Socratic logic, the correction-card UX, and the fallback behavior.

---

## Getting Started Locally

### Prerequisites

- Node.js 18+ or Bun
- A Lovable API key (used to call the AI Gateway)

### Installation & Run

```bash
# 1. Clone the repository
git clone <repository-url>
cd socratic-checker

# 2. Install dependencies
npm install
# or
bun install

# 3. Add your Lovable API key
# Create a .env file at the project root with:
# LOVABLE_API_KEY=your_key_here

# 4. Start the dev server
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:8080`.
