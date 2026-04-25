cat > functions/api/diagnose.js <<'EOF'
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid request body." }, 400);
    }

    const problem = body.problem || "";
    const industry = body.industry || "General Business";

    if (!problem || problem.length < 20) {
      return jsonResponse({ error: "Please provide a more detailed operational problem." }, 400);
    }

    if (!env.OPENAI_API_KEY) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY in Cloudflare environment variables." }, 500);
    }

    const prompt = `
You are FLOW, a premium COO-level AI operations diagnosis assistant.

Industry: ${industry}

Operational Problem:
${problem}

Return ONLY valid JSON. No markdown. No explanations outside JSON.

Use this exact JSON structure:
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
`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a COO-level operations consultant. Always return valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" }
      })
    });

    const raw = await aiResponse.text();

    if (!aiResponse.ok) {
      return jsonResponse({
        error: "OpenAI API error",
        details: raw
      }, aiResponse.status);
    }

    let openaiData;
    try {
      openaiData = JSON.parse(raw);
    } catch {
      return jsonResponse({
        error: "OpenAI returned invalid JSON",
        details: raw
      }, 500);
    }

    const content = openaiData?.choices?.[0]?.message?.content;

    if (!content) {
      return jsonResponse({
        error: "OpenAI returned no content.",
        details: openaiData
      }, 500);
    }

    let diagnosis;
    try {
      diagnosis = JSON.parse(content);
    } catch {
      return jsonResponse({
        error: "AI content was not valid JSON.",
        details: content
      }, 500);
    }

    return jsonResponse(diagnosis, 200);

  } catch (error) {
    return jsonResponse({
      error: "Server crash",
      details: error.message
    }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
EOF