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
      return jsonResponse({
        error: "Missing OPENAI_API_KEY in Cloudflare environment variables."
      }, 500);
    }

    const prompt = `
You are FLOW — a high-level COO operations strategist specializing in Education and Training systems.

Industry: ${industry}

Operational Situation:
${problem}

Return ONLY valid JSON.
`;

    // 🔥 THIS WAS MISSING IN YOUR FILE
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Return valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" }
      })
    });

    const raw = await aiResponse.text();

    if (!raw || raw.trim() === "") {
      return jsonResponse({
        error: "OpenAI returned empty response",
        hint: "Check API key or model access"
      }, 500);
    }

    let openaiData;
    try {
      openaiData = JSON.parse(raw);
    } catch (e) {
      return jsonResponse({
        error: "OpenAI response is not JSON",
        raw: raw
      }, 500);
    }

    const content = openaiData?.choices?.[0]?.message?.content;

    if (!content) {
      return jsonResponse({
        error: "No content returned from OpenAI",
        debug: openaiData
      }, 500);
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return jsonResponse({
        error: "AI returned invalid JSON format",
        raw: content
      }, 500);
    }

    return jsonResponse(parsed, 200);

  } catch (err) {
    return jsonResponse({
      error: "Server crash",
      details: err.message
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
