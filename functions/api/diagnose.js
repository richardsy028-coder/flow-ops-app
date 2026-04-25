export async function onRequestPost(context) {
  try {
    const { problem, industry } = await context.request.json();

    if (!problem) {
      return Response.json({ error: "Problem is required." }, { status: 400 });
    }

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "You are a senior COO and operations strategist. Return only valid JSON."
          },
          {
            role: "user",
            content: `
Diagnose this business operations problem.

Industry: ${industry}

Problem:
${problem}

Return ONLY valid JSON:
{
  "executiveSummary": "",
  "coreProblem": "",
  "rootCauses": [],
  "systemBreakdown": {
    "people": [],
    "process": [],
    "systems": []
  },
  "priorityActions": [],
  "kpis": [],
  "expectedOutcome": "",
  "cooVerdict": ""
}
`
          }
        ]
      })
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return Response.json(
        { error: data.error?.message || "OpenAI request failed." },
        { status: aiResponse.status }
      );
    }

    const raw = data.choices?.[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return Response.json({ error: "AI did not return valid JSON." }, { status: 500 });
    }

    return new Response(jsonMatch[0], {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}