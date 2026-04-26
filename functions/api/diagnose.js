export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));

    const industry = body.industry || "General Business";
    const problem = body.problem || "";

    if (!problem.trim()) {
      return Response.json(
        { error: "Please enter an operational problem." },
        { status: 400 }
      );
    }

    return Response.json({
      executiveSummary: `This ${industry} operation is experiencing execution friction because ownership, workflow, and follow-up are unclear.`,
      coreProblem: "The business is relying on memory, manual reminders, and inconsistent habits instead of a visible operating system.",
      rootCauses: [
        "Responsibilities are not clearly owned",
        "The workflow is not documented",
        "Follow-up happens reactively",
        "KPIs are missing or not reviewed consistently"
      ],
      systemBreakdown: {
        people: [
          "Team members may not know exactly who owns each step",
          "Accountability depends too much on the founder or manager"
        ],
        process: [
          "Handoffs are inconsistent",
          "Repeated problems are being solved manually instead of systemized"
        ],
        systems: [
          "No central tracker or dashboard",
          "No simple weekly review rhythm"
        ]
      },
      flowFramework: {
        find: "Find the biggest bottleneck causing delay, confusion, or rework.",
        layout: "Map the real workflow from start to finish, including owner, trigger, deadline, and output.",
        optimize: "Remove unnecessary steps, simplify approvals, and clarify communication.",
        work: "Install SOPs, task ownership, weekly review cadence, and 1-3 KPIs."
      },
      priorityActions: [
        "Map the current workflow in 7 steps or fewer",
        "Assign one clear owner to every recurring task",
        "Create one weekly operations review",
        "Track only 1-3 KPIs first"
      ],
      sopSuggestions: [
        "Task Handoff SOP",
        "Weekly Operations Review SOP",
        "Follow-Up and Escalation SOP"
      ],
      kpiSuggestions: [
        "On-time completion rate",
        "Average turnaround time",
        "Follow-up completion rate"
      ],
      expectedOutcome: "Clearer execution, fewer repeated mistakes, faster follow-up, and better visibility.",
      cooVerdict: "The problem is not effort. The system is leaking. Fix ownership, workflow, and follow-up before blaming people."
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
