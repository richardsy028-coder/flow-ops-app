function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  try {
    const { industry, problem } = await context.request.json();

    if (!context.env.OPENAI_API_KEY) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY in Cloudflare environment variables" }, 500);
    }

    const systemPrompt = `Return ONLY valid JSON using this schema:
{
  "executiveSummary": "",
  "coreProblem": "",
  "rootCauses": [],
  "systemBreakdown": { "people": [], "process": [], "systems": [] },
  "flowFramework": { "find": "", "layout": "", "optimize": "", "work": "" },
  "priorityActions": [],
  "sopSuggestions": [],
  "kpiSuggestions": [],
  "expectedOutcome": "",
  "cooVerdict": ""
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Industry: ${industry}\nProblem: ${problem}` }
        ],
        temperature: 0.4
      })
    });

    const raw = await response.text();

    if (!raw.trim()) {
      return jsonResponse({ error: "Empty response from OpenAI" }, 500);
    }

    let parsedOpenAI;
    try {
      parsedOpenAI = JSON.parse(raw);
    } catch {
      return jsonResponse({ error: "OpenAI response not JSON", raw }, 500);
    }

    if (!response.ok) {
      return jsonResponse({ error: "OpenAI failed", details: parsedOpenAI }, 500);
    }

    const content = parsedOpenAI?.choices?.[0]?.message?.content;

    if (!content) {
      return jsonResponse({ error: "No content from OpenAI", full: parsedOpenAI }, 500);
    }

    const clean = content.replace(/```json|```/g, "").trim();

    try {
      return jsonResponse(JSON.parse(clean), 200);
    } catch {
      return jsonResponse({ error: "AI returned invalid JSON", raw: clean }, 500);
    }

  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

export async function onRequestGet() {
  return jsonResponse({ error: "Use POST for /api/diagnose" }, 405);
}