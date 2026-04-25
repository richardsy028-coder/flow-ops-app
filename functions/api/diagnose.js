function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  try {
    const bodyText = await context.request.text();
    const body = bodyText ? JSON.parse(bodyText) : {};

    const industry = body.industry || "Education";
    const problem = body.problem || "No problem provided.";

    const prompt = `
Return ONLY valid JSON.

{
  "executiveSummary": "",
  "coreProblem": "",
  "rootCauses": [],
  "systemBreakdown": {
    "people": [],
    "process": [],
    "systems": []
  },
  "flowFramework": {
    "find": "",
    "layout": "",
    "optimize": "",
    "work": ""
  },
  "priorityActions": [],
  "sopSuggestions": [],
  "kpiSuggestions": [],
  "expectedOutcome": "",
  "cooVerdict": ""
}

Industry: ${industry}
Problem: ${problem}
`;

    const ai = await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      prompt
    });

    let content = ai?.response || ai?.result || "";

    // 🔥 HARD SAFETY: if empty, return fallback JSON
    if (!content || !content.trim()) {
      return json({
        executiveSummary: "AI returned empty response.",
        coreProblem: problem,
        rootCauses: ["AI failure"],
        systemBreakdown: { people: [], process: [], systems: [] },
        flowFramework: { find: "", layout: "", optimize: "", work: "" },
        priorityActions: [],
        sopSuggestions: [],
        kpiSuggestions: [],
        expectedOutcome: "",
        cooVerdict: "Fallback response used."
      });
    }

    content = content.replace(/```json|```/g, "").trim();

    try {
      return json(JSON.parse(content));
    } catch {
      return json({
        error: "AI returned invalid JSON",
        raw: content
      }, 500);
    }

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
