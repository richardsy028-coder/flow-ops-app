export async function onRequestPost(context) {
  try {
    const { industry, problem } = await context.request.json();

    const systemPrompt = `
You are a COO-level operations strategist.

Return ONLY valid JSON.
Do NOT wrap in markdown.
Do NOT add extra text.

Use this schema:

{
  "executiveSummary": "...",
  "coreProblem": "...",
  "rootCauses": ["..."],
  "systemBreakdown": {
    "people": ["..."],
    "process": ["..."],
    "systems": ["..."]
  },
  "flowFramework": {
    "find": "...",
    "layout": "...",
    "optimize": "...",
    "work": "..."
  },
  "priorityActions": ["..."],
  "sopSuggestions": ["..."],
  "kpiSuggestions": ["..."],
  "expectedOutcome": "...",
  "cooVerdict": "..."
}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Industry: ${industry}\nProblem: ${problem}` }
        ],
        temperature: 0.7
      })
    });

    const raw = await response.text();

    if (!raw || raw.trim() === "") {
      return new Response(JSON.stringify({
        error: "Empty response from OpenAI"
      }), { status: 500 });
    }

    let parsedOpenAI;
    try {
      parsedOpenAI = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({
        error: "OpenAI response not JSON",
        raw
      }), { status: 500 });
    }

    const content = parsedOpenAI?.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({
        error: "No content from OpenAI",
        full: parsedOpenAI
      }), { status: 500 });
    }

    let clean = content.trim();

    // Remove markdown if exists
    clean = clean.replace(/```json|```/g, "").trim();

    let finalJSON;
    try {
      finalJSON = JSON.parse(clean);
    } catch {
      return new Response(JSON.stringify({
        error: "AI returned invalid JSON",
        raw: clean
      }), { status: 500 });
    }

    return new Response(JSON.stringify(finalJSON), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), { status: 500 });
  }
}