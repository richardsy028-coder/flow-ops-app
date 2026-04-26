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
      executiveSummary: `Your ${industry} operation is showing execution friction. The issue is not effort — it is unclear ownership, weak workflow visibility, and inconsistent follow-up.`,
      coreProblem: "The business is relying too much on memory, manual reminders, and unclear workflows instead of a visible operating system.",
      rootCauses: [
        "Tasks are not clearly owned",
        "Workflow steps are not documented",
        "Follow-up is reactive instead of systematic",
        "KPIs are missing or not reviewed consistently"
      ],
      systemBreakdown: {
        people: [
          "Team members may not know who owns each step",
          "The founder or manager becomes the default problem solver"
        ],
        process: [
          "Handoffs are inconsistent",
          "Repeated problems are solved manually instead of systemized"
        ],
        systems: [
          "No central tracker",
          "No weekly review rhythm",
          "No simple KPI dashboard"
        ]
      },
      flowFramework: {
        find: "Find the single biggest bottleneck causing delays or repeated confusion.",
        layout: "Map the real workflow from start to finish with owner, trigger, deadline, and output.",
        optimize: "Remove unnecessary steps, clarify handoffs, and simplify approvals.",
        work: "Install SOPs, KPIs, ownership rules, and a weekly operating rhythm."
      },
      priorityActions: [
        "Map the workflow in 7 steps or fewer",
        "Assign one owner per recurring task",
        "Create one weekly operations review",
        "Track only 3 KPIs first"
      ],
      sopSuggestions: [
        "Task handoff SOP",
        "Follow-up and escalation SOP",
        "Weekly operations review SOP"
      ],
      kpiSuggestions: [
        "On-time completion rate",
        "Average turnaround time",
        "Follow-up completion rate"
      ],
      expectedOutcome: "Clearer execution, fewer repeated mistakes, faster follow-up, and stronger accountability.",
      cooVerdict: "Your business does not need more chaos management. It needs a cleaner operating system."
    });

  } catch (err) {
    return Response.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
