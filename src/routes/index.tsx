import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { toast } from "sonner";

import { GapReport } from "@/components/socratic/GapReport";
import { QuestionStage } from "@/components/socratic/QuestionStage";
import { TopicInput } from "@/components/socratic/TopicInput";

import { generateDiagnostic } from "@/lib/socratic.functions";
import type { Diagnostic } from "@/lib/socratic.server";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Socratic Checker — Find Your Conceptual Gaps" },
      {
        name: "description",
        content:
          "Answer 3 Socratic questions on any topic and get a diagnostic report of your misconceptions plus a targeted 3-step learning roadmap.",
      },
      { property: "og:title", content: "Socratic Checker — Find Your Conceptual Gaps" },
      {
        property: "og:description",
        content:
          "Locate the cognitive gap, not just the test score. A 3-question conceptual diagnostic for any topic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Phase = "input" | "quiz" | "report";

function Index() {
  const runDiagnostic = useServerFn(generateDiagnostic);
  const [phase, setPhase] = useState<Phase>("input");
  const [loading, setLoading] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState("");
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);

  const start = async (topic: string) => {
    setLoading(true);
    setLoadingTopic(topic);
    try {
      const result = await runDiagnostic({ data: { topic } });
      setDiagnostic(result);
      setAnswers([]);
      setCurrent(0);
      setPhase("quiz");
    } catch {
      toast.error("Couldn't build that diagnostic. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const answer = (optionIndex: number) => {
    if (!diagnostic) return;
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (next.length >= diagnostic.questions.length) {
      setPhase("report");
    } else {
      setCurrent(next.length);
    }
  };

  const reset = () => {
    setPhase("input");
    setDiagnostic(null);
    setAnswers([]);
    setCurrent(0);
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      
      <header className="mx-auto mb-10 flex max-w-4xl flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-mastery/40 bg-mastery/10 text-mastery">
            <BrainCircuit className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold sm:text-3xl">Socratic Checker</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Locate the cognitive gap, not just the test score.
        </p>
      </header>

      {phase === "input" && (
        <TopicInput onStart={start} loading={loading} loadingTopic={loadingTopic} />
      )}

      {phase === "quiz" && diagnostic && diagnostic.questions[current] && (
        <QuestionStage
          topic={diagnostic.topic}
          question={diagnostic.questions[current]!}
          index={current}
          total={diagnostic.questions.length}
          onAnswer={answer}
        />
      )}


      {phase === "report" && diagnostic && (
        <GapReport diagnostic={diagnostic} answers={answers} onReset={reset} />
      )}
    </main>
  );
}
