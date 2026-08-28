import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { SocraticQuestion } from "@/lib/socratic.server";

export function QuestionStage({
  topic,
  question,
  index,
  total,
  onAnswer,
}: {
  topic: string;
  question: SocraticQuestion;
  index: number;
  total: number;
  onAnswer: (optionIndex: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [index]);

  const progress = ((index + (selected !== null ? 1 : 0)) / total) * 100;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    window.setTimeout(() => onAnswer(i), 620);
  };

  return (
    <section
      key={index}
      className="mx-auto w-full max-w-3xl animate-in fade-in slide-in-from-right-6 duration-400"
    >
      <div className="panel p-7 sm:p-9">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span className="text-mastery">{topic}</span>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Probing: <span className="text-foreground/80">{question.subConcept}</span>
        </p>

        <h2 className="mt-6 text-xl font-semibold leading-snug sm:text-2xl">{question.question}</h2>

        <div className="mt-7 space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={[
                  "group flex w-full items-start gap-4 rounded-xl border p-4 text-left text-sm transition-all duration-200",
                  isSelected
                    ? "border-mastery/70 bg-mastery/10 text-foreground"
                    : "border-border bg-surface-raised hover:-translate-y-0.5 hover:border-mastery/40 hover:bg-accent",
                  selected !== null && !isSelected ? "opacity-40" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                    isSelected
                      ? "border-mastery/60 bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin text-mastery" />
            {index + 1 === total ? "Compiling your gap report…" : "Loading next probe…"}
          </div>
        )}
      </div>
    </section>
  );
}
