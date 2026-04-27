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
        input: `Return JSON only with score, diagnosis, and prompt. Act as a COO-level operations strategist for Clarity System Flow. Industry: ${type}. Problem: ${pain}. Situation: ${situation}. Make the free answer useful but incomplete and recommend the paid COO-level report.`
      })
    });
    const data = await r.json();
    return Response.json(JSON.parse(data.output_text || "{}"));
  } catch (err) {
    return Response.json({ error: "AI diagnosis failed" }, { status: 500 });
  }
}
