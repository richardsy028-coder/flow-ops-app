export async function onRequestGet() {
  return Response.json({
    status: "FLOW AI API is live. Use POST."
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));

    const industry = body.industry || "General Business";
    const problem = body.problem || "";
    const mode = body.mode || "operations";

    if (!problem.trim()) {
      return Response.json(
        { error: "Please describe the operational problem first." },
        { status: 400 }
      );
    }

    const prompt = `
You are FLOW AI, an expert COO-level operations consultant.

Your job is to diagnose execution problems and generate a complete operating system.

INPUT:
Industry: ${industry}
Problem: ${problem}
Mode: ${mode}

SPECIAL CASE:
If the problem mentions LinkedIn, leads, DMs, inbox, outreach, prospects, spam, or lead filtering, generate a LinkedIn Lead Filtering System.

GENERAL TASK:
1. Diagnose the operational problem
2. Identify root causes
3. Generate a complete execution system

RETURN ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not explain outside JSON.
Use double quotes only.
No trailing commas.
No empty fields.

Return exactly this structure:

{
  "diagnosis": {
    "executiveSummary": "",
    "coreProblem": "",
    "rootCauses": [],
    "systemBreakdown": {
      "people": [],
      "process": [],
      "systems": []
    },
    "executionHealth": "",
    "severity": "",
    "priorityActions": []
  },
  "system": {
    "workflow": [
      {
        "step": "",
        "owner": "",
        "time_standard": "",
        "next_action": "",
        "risk": ""
      }
    ],
    "sops": [
      {
        "name": "",
        "purpose": "",
        "trigger": "",
        "steps": [],
        "owner": "",
        "tools": [],
        "success_metric": ""
      }
    ],
    "kpis": [
      {
        "name": "",
        "target": "",
        "owner": "",
        "review_frequency": ""
      }
    ],
    "weekly_operations_system": [],
    "implementation_plan": [
      {
        "day": "",
        "action": ""
      }
    ],
    "linkedin_filtering_system": {
      "lead_categories": [],
      "qualification_rules": [],
      "message_templates": [],
      "disqualification_rules": [],
      "follow_up_rules": []
    }
  }
}
`;

    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await aiRes.json();

    let text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "{}";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        error: "Invalid JSON from AI",
        raw: text
      };
    }

    return Response.json(parsed);

  } catch (err) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
