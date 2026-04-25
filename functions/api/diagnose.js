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

    const industry = body.industry || "Education and Training";
    const problem = body.problem || "No problem provided.";

    const prompt = `
You are FLOW AI, a COO-level operations diagnosis engine.

Return ONLY valid JSON. No markdown. No backticks.

Schema:
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

For Education and Training, focus on student engagement, retention, curriculum flow, teacher consistency, follow-up systems, and measurable outcomes.
`;

    const aiResponse = await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      prompt
    });

    let content = aiResponse.response || aiResponse.result || "";

    content = content.replace(/```json|```/g, "").trim();

    try {
      return json(JSON.parse(content));
    } catch {
      return json({
        error: "Cloudflare AI returned invalid JSON",
        raw: content
      }, 500);
    }

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestGet() {
  return json({ status: "FLOW Cloudflare AI API is working. Use POST." });
}
