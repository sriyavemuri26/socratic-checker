export type SocraticOption = {
  text: string;
  correct: boolean;
  /** Name of the flawed mental model this choice reveals (empty for the correct option). */
  misconception: string;
  /** How the concept actually works, used in the correction card. */
  correction: string;
};

export type SocraticQuestion = {
  question: string;
  subConcept: string;
  options: SocraticOption[];
};

export type RoadmapStep = {
  title: string;
  focus: string;
  detail: string;
};

export type Diagnostic = {
  topic: string;
  questions: SocraticQuestion[];
  roadmap: RoadmapStep[];
};

const SYSTEM_PROMPT = `You are a Socratic diagnostician. Given a learning topic, you design 3 questions that expose CONCEPTUAL gaps, never trivia or memory recall.

Rules:
- Exactly 3 questions, each probing a different sub-concept, ordered from foundation to application.
- Each question has exactly 4 options: exactly 1 correct (demonstrates true conceptual understanding) and 3 distractors.
- Each distractor encodes a SPECIFIC flawed mental model. Its "misconception" field names that flawed model in first person ("You treat X as if it were Y"). Its "correction" explains how the concept really works in 1-2 sentences.
- The correct option has misconception: "" and a correction that states the underlying principle.
- Randomize which position the correct answer sits in across the 3 questions.
- The roadmap has exactly 3 steps titled "Core Foundation", "Key Distinction", "Mastery Application".
Return ONLY JSON matching the schema. No markdown fences.`;

const SCHEMA_HINT = `{
  "topic": string,
  "questions": [
    {
      "question": string,
      "subConcept": string,
      "options": [{ "text": string, "correct": boolean, "misconception": string, "correction": string }]
    }
  ],
  "roadmap": [{ "title": string, "focus": string, "detail": string }]
}`;

function fallbackDiagnostic(topic: string): Diagnostic {
  const mk = (
    question: string,
    subConcept: string,
    correct: string,
    principle: string,
    wrong: [string, string, string][],
  ): SocraticQuestion => ({
    question,
    subConcept,
    options: [
      { text: correct, correct: true, misconception: "", correction: principle },
      ...wrong.map(([text, misconception, correction]) => ({
        text,
        correct: false,
        misconception,
        correction,
      })),
    ],
  });

  return {
    topic,
    questions: [
      mk(
        `Why does ${topic} behave differently when its core assumptions change?`,
        "Underlying model",
        "Because the behaviour follows from the rules of the underlying model, not from the surface example",
        `${topic} is defined by a small set of rules; every observed behaviour is a consequence of those rules.`,
        [
          [
            "Because each example is a special case with its own rules",
            "You memorise cases instead of deriving them from one model",
            "One model generates all the cases; learn the rule, not the list.",
          ],
          [
            "Because the notation changes the meaning",
            "You treat notation as the concept itself",
            "Notation only describes the concept; the meaning lives in the model.",
          ],
          [
            "Because it only works in idealised conditions",
            "You assume the concept is a convenient fiction",
            "The model has limits, but inside them its predictions are exact.",
          ],
        ],
      ),
      mk(
        `Which distinction matters most when applying ${topic} to a new situation?`,
        "Key distinction",
        "Separating what the concept guarantees from what merely tends to co-occur with it",
        "Transfer depends on isolating the guaranteed relationship from incidental correlations.",
        [
          [
            "Recognising a familiar-looking problem shape",
            "You pattern-match on surface features",
            "Surface similarity is unreliable; match on the mechanism instead.",
          ],
          [
            "Remembering the standard procedure",
            "You bind understanding to a fixed procedure",
            "Procedures are shortcuts derived from the principle, not the principle.",
          ],
          [
            "Checking the answer looks reasonable",
            "You validate outputs instead of reasoning",
            "A plausible answer can come from an invalid model; check the reasoning path.",
          ],
        ],
      ),
      mk(
        `What would falsify your current understanding of ${topic}?`,
        "Mastery application",
        "A case where the mechanism predicts one outcome and the observed result differs",
        "Mastery means knowing which observation would break your model, and why.",
        [
          [
            "Nothing — the concept is always true",
            "You hold the concept as dogma rather than a model with boundaries",
            "Every model has a scope; knowing its edges is part of knowing it.",
          ],
          [
            "Getting a question about it wrong",
            "You equate understanding with performance",
            "Understanding is tested by prediction, not by score.",
          ],
          [
            "A textbook stating something different",
            "You outsource validity to authority",
            "Authority points to the reasoning; the reasoning is what settles it.",
          ],
        ],
      ),
    ],
    roadmap: [
      {
        title: "Core Foundation",
        focus: `Rebuild the base model of ${topic}`,
        detail: "Write the defining rules in your own words, then derive one familiar example from them.",
      },
      {
        title: "Key Distinction",
        focus: "Separate guarantees from coincidences",
        detail: "Contrast two near-identical cases where the concept applies and does not apply.",
      },
      {
        title: "Mastery Application",
        focus: "Predict before you compute",
        detail: "On three fresh problems, state the expected outcome and the mechanism first, then verify.",
      },
    ],
  };
}

function normalize(raw: unknown, topic: string): Diagnostic {
  const data = raw as Partial<Diagnostic> | null;
  const questions = (data?.questions ?? [])
    .filter((q) => q && Array.isArray(q.options) && q.options.length === 4)
    .filter((q) => q.options.some((o) => o.correct))
    .slice(0, 3)
    .map((q) => ({
      question: String(q.question ?? ""),
      subConcept: String(q.subConcept ?? "Core idea"),
      options: q.options.map((o) => ({
        text: String(o.text ?? ""),
        correct: Boolean(o.correct),
        misconception: String(o.misconception ?? ""),
        correction: String(o.correction ?? ""),
      })),
    }));

  const roadmap = (data?.roadmap ?? []).slice(0, 3).map((s) => ({
    title: String(s.title ?? ""),
    focus: String(s.focus ?? ""),
    detail: String(s.detail ?? ""),
  }));

  if (questions.length !== 3 || roadmap.length !== 3) return fallbackDiagnostic(topic);
  return { topic, questions, roadmap };
}

export async function buildDiagnostic(topic: string, apiKey?: string): Promise<Diagnostic> {
  if (!apiKey) return fallbackDiagnostic(topic);

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\nSchema:\n${SCHEMA_HINT}` },
          { role: "user", content: `Topic: ${topic}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return fallbackDiagnostic(topic);
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    return normalize(JSON.parse(cleaned), topic);
  } catch {
    return fallbackDiagnostic(topic);
  }
}
