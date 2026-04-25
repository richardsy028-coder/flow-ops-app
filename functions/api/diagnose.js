function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  try {
    const bodyText = await context.request.text();

    let body = {};
    try {
      body = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      return json({ error: "Invalid request body", raw: bodyText }, 400);
    }

    const industry = body.industry || "Education and Training";
    const problem = body.problem || "No problem provided.";

    return json({
      executiveSummary: `FLOW AI diagnosed an operational issue in ${industry}.`,
      coreProblem: `The main issue appears to be: ${problem}`,
      rootCauses: [
        "Unclear operating process",
        "Inconsistent execution",
        "Weak follow-up system"
      ],
      systemBreakdown: {
        people: ["Roles and responsibilities are unclear"],
        process: ["Workflow is not standardized"],
        systems: ["No reliable tracking system is in place"]
      },
      flowFramework: {
        find: "Identify the biggest bottleneck affecting outcomes.",
        layout: "Map the current workflow from start to finish.",
        optimize: "Standardize the process and remove weak steps.",
        work: "Execute weekly, measure results, and improve."
      },
      priorityActions: [
        "Create one standard operating process",
        "Assign owners for each step",
        "Track weekly KPIs"
      ],
      sopSuggestions: [
        "Student follow-up SOP",
        "Teacher delivery SOP",
        "Weekly review SOP"
      ],
      kpiSuggestions: [
        "Attendance rate",
        "Completion rate",
        "Engagement score"
      ],
      expectedOutcome: "Clearer execution, better retention, and improved operational control.",
      cooVerdict: "The business does not need more activity first. It needs a clearer operating system."
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestGet() {
  return json({ status: "FLOW API is working. Use POST." });
}
