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
        input: `Return JSON only with score, diagnosis, and prompt. You are FLOW, the operating companion inside Clarity System. Act as a COO-level operations strategist. Industry: ${type}. Problem: ${pain}. Situation: ${situation}. Make the free answer useful but incomplete and recommend the paid Clarity System Report for KPI dashboard, SOP priorities, and execution roadmap.`
      })
    });
    const data = await r.json();
    return Response.json(JSON.parse(data.output_text || "{}"));
  } catch (err) {
    return Response.json({ error: "FLOW diagnosis failed" }, { status: 500 });
  }
}
