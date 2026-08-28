import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  RefreshCw,
  Route,
  Target,
  XCircle,
} from "lucide-react";

import type { Diagnostic } from "@/lib/socratic.server";

const STEP_ICONS = [Compass, Target, Route];

export function GapReport({
  diagnostic,
  answers,
  onReset,
}: {
  diagnostic: Diagnostic;
  answers: number[];
  onReset: () => void;
}) {
  const results = diagnostic.questions.map((q, i) => {
    const chosen = q.options[answers[i]];
    const correctOption = q.options.find((o) => o.correct)!;
    return { q, chosen, correctOption, correct: Boolean(chosen?.correct) };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const total = results.length;
  const alignment = Math.round((correctCount / total) * 100);
  const missed = results.filter((r) => !r.correct);

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score card */}
      <div className="panel p-7 sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Diagnostic gap report
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{diagnostic.topic}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {alignment === 100
                ? "Your reasoning matched the underlying model on every probe."
                : "Your answers point to specific flawed mental models, listed below."}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-semibold text-gradient-mastery">{alignment}%</div>
            <p className="mt-1 text-xs text-muted-foreground">conceptual alignment</p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-mastery/30 bg-mastery/10 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-mastery">
              <CheckCircle2 className="size-4" />
              Aligned reasoning
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {correctCount}
              <span className="text-sm font-normal text-muted-foreground"> / {total}</span>
            </p>
          </div>
          <div className="rounded-xl border border-gap/30 bg-gap/10 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gap">
              <AlertTriangle className="size-4" />
              Misconceptions found
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {missed.length}
              <span className="text-sm font-normal text-muted-foreground"> / {total}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-1.5">
          {results.map((r, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${r.correct ? "bg-mastery" : "bg-gap"}`}
              title={r.q.subConcept}
            />
          ))}
        </div>
      </div>

      {/* Missed sub-concepts */}
      <div className="panel p-7 sm:p-9">
        <h3 className="text-lg font-semibold">Missed sub-concepts</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Where the reasoning chain broke down.
        </p>
        <ul className="mt-5 space-y-2.5">
          {results.map((r, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm"
            >
              {r.correct ? (
                <CheckCircle2 className="size-4 shrink-0 text-mastery" />
              ) : (
                <XCircle className="size-4 shrink-0 text-gap" />
              )}
              <span className="font-medium">{r.q.subConcept}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {r.correct ? "Solid" : "Needs repair"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Misconception corrections */}
      {missed.length > 0 && (
        <div className="space-y-4">
          <h3 className="px-1 text-lg font-semibold">Cognitive misconception correction</h3>
          {missed.map((r, i) => (
            <div key={i} className="panel p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {r.q.subConcept}
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed">{r.q.question}</p>
              <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-xl border border-gap/30 bg-gap/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gap">
                    What you thought
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.chosen?.text}</p>
                  {r.chosen?.misconception && (
                    <p className="mt-3 border-t border-gap/20 pt-3 text-xs leading-relaxed text-muted-foreground">
                      {r.chosen.misconception}
                    </p>
                  )}
                </div>
                <div className="hidden items-center justify-center md:flex">
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>
                <div className="rounded-xl border border-mastery/30 bg-mastery/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-mastery">
                    How the concept works
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.correctOption.text}</p>
                  <p className="mt-3 border-t border-mastery/20 pt-3 text-xs leading-relaxed text-muted-foreground">
                    {r.correctOption.correction || r.chosen?.correction}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap */}
      <div className="panel p-7 sm:p-9">
        <h3 className="text-lg font-semibold">Targeted micro-roadmap</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Repair understanding in this exact order.
        </p>
        <ol className="mt-6 space-y-0">
          {diagnostic.roadmap.map((step, i) => {
            const Icon = STEP_ICONS[i] ?? Compass;
            const last = i === diagnostic.roadmap.length - 1;
            return (
              <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
                {!last && (
                  <span className="absolute left-[19px] top-11 bottom-2 w-px bg-border" aria-hidden />
                )}
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-mastery/40 bg-mastery/10 text-mastery">
                  <Icon className="size-4" />
                </span>
                <div className="pt-0.5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Step {i + 1} · {step.title}
                  </p>
                  <p className="mt-1.5 font-semibold">{step.focus}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface-raised px-6 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-mastery/50 hover:text-mastery"
        >
          <RefreshCw className="size-4" />
          Test another topic
        </button>
      </div>
    </section>
  );
}
