export async function onRequestPost({ request, env }) {
  const { type, pain, situation } = await request.json();

  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5.5",
      input: `
Act as a COO-level AI operations strategist.

Business type: ${type}
Pain point: ${pain}
Situation: ${situation}

Return JSON only:
{
 "score": number,
 "scoreText": string,
 "diagnosis": string,
 "prompt": string
}

Make the free answer useful but clearly incomplete. End by making the paid COO-level report feel necessary for execution.
`
    })
  });

  const data = await r.json();
  const text = data.output_text || "{}";

  return Response.json(JSON.parse(text));
}