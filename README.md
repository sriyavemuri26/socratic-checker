# Socratic Insight

Build a clean, high-impact diagnostic web application called 'Socratic Checker' using React, Tailwind CSS, and Lucide icons.

Core Objective: Instead of testing basic memory recall, this app dynamically asks 3 Socratic questions to identify a learner's underlying conceptual gaps on any topic, then generates a diagnostic report with a targeted learning roadmap.

1. Application State & Flow (Single Page Experience)

Topic Input Screen:

A search bar where users can type any topic (e.g., Pointer Arithmetic, Recursion, Supply & Demand).

Include 3 preset pill buttons for rapid testing (Pointer Arithmetic, Photosynthesis, Market Equilibrium).

Dynamic 3-Question Diagnostic (Interactive Mode):

Show 1 Socratic question at a time with a progress bar (Question X of 3).

Each question must have 4 multiple-choice options:

1 Correct Answer (demonstrates true conceptual understanding).

3 Misconception Distractors (each choice represents a specific flawed mental model or baseline confusion).

Selecting an answer saves the choice and smoothly transitions to the next question.

Final Diagnostic Gap Report Dashboard:

Render automatically after Question 3 is answered.

Primary Concept Breakdown: Visual score card showing conceptual alignment vs. identified misconceptions.

Missed Sub-Concepts List: Call out the specific sub-concepts where reasoning broke down based on the distractor choices selected.

Cognitive Misconception Correction: For each missed question, show a clean comparison card: 'What You Thought' vs. 'How the Concept Works'.

Targeted Micro-Roadmap: Render a 3-step vertical timeline (Step 1: Core Foundation, Step 2: Key Distinction, Step 3: Mastery Application) showing the exact order to repair understanding.

Reset Button: A 'Test Another Topic' button to reset state and return to Step 1.

2. UI & Design System

Theme: Modern, sleek dark-mode aesthetic (slate/neutral dark background, crisp emerald green accents for mastery, warm amber/coral for identified gaps).

Header: Minimalist logo, title (Socratic Checker), and tagline ('Locate the cognitive gap, not just the test score.').

Cards & Motion: Clean rounded borders, subtle hover effects on multiple-choice options, and clear loading state indicators between questions.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://socratic-checker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ea1c2d2a-ce1f-44c2-b55f-0451d7fe0772).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
