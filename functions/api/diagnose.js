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

    if (!context.env.OPENAI_API_KEY) {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const systemPrompt = `
You are FLOW AI, a COO-level operations diagnosis engine.

Return ONLY valid JSON. No markdown. No backticks.

Use this exact schema:
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

For Education and Training, focus on:
student engagement, learner retention, curriculum flow, teacher consistency, assessment, follow-up, and measurable learning outcomes.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Industry: ${industry}\nProblem: ${problem}\nDiagnose this using the FLOW framework.`
          }
        ],
        temperature: 0.3
      })
    });

    const raw = await openaiRes.text();

    if (!raw || !raw.trim()) {
      return json({ error: "Empty response from OpenAI" }, 500);
    }

    let openaiData;
    try {
      openaiData = JSON.parse(raw);
    } catch {
      return json({ error: "OpenAI returned invalid JSON", raw }, 500);
    }

    if (!openaiRes.ok) {
      return json({ error: "OpenAI API failed", details: openaiData }, 500);
    }

    let content = openaiData?.choices?.[0]?.message?.content;

    if (!content) {
      return json({ error: "No AI content returned", details: openaiData }, 500);
    }

    content = content.replace(/```json|```/g, "").trim();

    try {
      return json(JSON.parse(content));
    } catch {
      return json({ error: "AI returned invalid JSON", raw: content }, 500);
    }

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestGet() {
  return json({ status: "FLOW API is working. Use POST." });
}
