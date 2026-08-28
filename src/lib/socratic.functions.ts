import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buildDiagnostic } from "./socratic.server";

export const generateDiagnostic = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ topic: z.string().min(2).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    return buildDiagnostic(data.topic.trim(), apiKey);
  });
