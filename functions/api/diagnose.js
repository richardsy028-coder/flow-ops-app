export async function onRequestPost({ request, env }) {
  try {
    const { type, pain, situation } = await request.json();
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Act as a COO-level operations strategist for Clarity System Flow.

Industry: ${type}
Problem: ${pain}
Situation: ${situation}

Return JSON only:
{
 "score": number,
 "diagnosis": string,
 "prompt": string
}

Make the free answer useful but incomplete. Recommend a paid COO-level report for full workflow, KPI dashboard, SOP priorities, and execution roadmap.`
      })
    });
    const data = await r.json();
    return Response.json(JSON.parse(data.output_text || "{}"));
  } catch (err) {
    return Response.json({ error: "AI diagnosis failed" }, { status: 500 });
  }
}
