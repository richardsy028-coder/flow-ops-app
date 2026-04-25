export async function onRequestPost(context) {
  try {
    const { industry, problem } = await context.request.json();

    const systemPrompt = `...your prompt...`;

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

    const data = await response.json();
    let content = data.choices[0].message.content;

    // 🔥 CLEAN JSON FIX
    content = content.trim();

    // Remove markdown if AI adds it
    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    // Try parsing
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return new Response(JSON.stringify({
        error: "Invalid JSON from AI",
        raw: content
      }), { status: 500 });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    });
  }
}