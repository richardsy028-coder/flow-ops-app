export async function onRequestGet() {
  return Response.json({
    status: "FLOW API is live. Use POST."
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));

    const industry = body.industry || "General Business";
    const problem = body.problem || "";

    if (!problem.trim()) {
      return Response.json(
        { error: "Please describe the operational problem first." },
        { status: 400 }
      );
    }

    return Response.json({
      executiveSummary: `Your ${industry} operation has execution friction that needs clearer structure, ownership, and follow-up.`,
      coreProblem: "The business is relying too much on memory, manual reminders, and unclear workflows.",
      rootCauses: [
        "Tasks are not clearly owned",
        "The workflow is not fully documented",
        "Follow-up is reactive instead of systematic",
        "There are no simple KPIs tracking execution quality"
      ],
      systemBreakdown: {
        people: [
          "Team members may not know who owns each step",
          "The founder or manager becomes the default problem-solver"
        ],
        process: [
          "Workflows are unclear or inconsistent",
          "Handoffs are not standardized"
        ],
        systems: [
          "No visible tracker for progress",
          "No weekly review rhythm for accountability"
        ]
      },
      flowFramework: {
        find: "Find the biggest bottleneck causing repeated delay or confusion.",
        layout: "Map the workflow from request to completion.",
        optimize: "Remove unnecessary steps and clarify ownership.",
        work: "Install SOPs, KPIs, and a weekly operating rhythm."
      },
      priorityActions: [
        "Create a 7-step workflow map",
        "Assign one owner per recurring task",
        "Create a weekly operations review",
        "Track 3 KPIs only at first"
      ],
      sopSuggestions: [
        "Task handoff SOP",
        "Follow-up SOP",
        "Weekly operations review SOP"
      ],
      kpiSuggestions: [
        "On-time completion rate",
        "Average turnaround time",
        "Follow-up completion rate"
      ],
      expectedOutcome: "Clearer execution, fewer repeated problems, faster follow-up, and stronger accountability.",
      cooVerdict: "Your business does not need more effort first. It needs a cleaner operating system."
    });

  } catch (err) {
    return Response.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
