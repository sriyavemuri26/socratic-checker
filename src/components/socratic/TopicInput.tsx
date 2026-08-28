import { useState } from "react";
import { Search, Sparkles, Brain, Loader2 } from "lucide-react";

const PRESETS = ["Pointer Arithmetic", "Photosynthesis", "Market Equilibrium"];

export function TopicInput({
  onStart,
  loading,
  loadingTopic,
}: {
  onStart: (topic: string) => void;
  loading: boolean;
  loadingTopic: string;
}) {
  const [value, setValue] = useState("");

  return (
    <section className="mx-auto w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="panel p-7 sm:p-9">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="size-3.5 text-mastery" />
          Conceptual diagnostic
        </div>
        <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
          What concept are you trying to <span className="text-gradient-mastery">actually</span>{" "}
          understand?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Three Socratic questions. No recall, no trivia — each answer reveals the mental model
          you&apos;re reasoning with.
        </p>

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim().length > 1) onStart(value.trim());
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
                placeholder="e.g. Recursion, Bayes' theorem, Opportunity cost"
                aria-label="Topic to diagnose"
                className="h-12 w-full rounded-xl border border-input bg-background/60 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-mastery/60 focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={loading || value.trim().length < 2}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
              Diagnose
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-muted-foreground">Try:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={loading}
              onClick={() => onStart(preset)}
              className="rounded-full border border-border bg-surface-raised px-4 py-1.5 text-xs font-medium text-foreground/85 transition-all hover:-translate-y-0.5 hover:border-mastery/50 hover:text-mastery disabled:opacity-40"
            >
              {preset}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-mastery" />
            Designing Socratic probes for{" "}
            <span className="font-medium text-foreground">{loadingTopic}</span>…
          </div>
        )}
      </div>
    </section>
  );
}
