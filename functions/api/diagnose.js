export async function onRequestGet() {
  return Response.json({ status: "API live. Use POST." });
}

export async function onRequestPost(context) {
  return Response.json({
    executiveSummary: "FLOW received your request successfully.",
    coreProblem: "Your business needs clearer execution, ownership, and follow-up.",
    rootCauses: ["Unclear workflow", "No clear owner", "Weak follow-up system"],
    systemBreakdown: {
      people: ["Ownership is unclear"],
      process: ["Workflow needs structure"],
      systems: ["Tracking system is missing"]
    },
    flowFramework: {
      find: "Find the main bottleneck.",
      layout: "Map the workflow.",
      optimize: "Remove friction.",
      work: "Create SOPs and KPIs."
    },
    priorityActions: ["Map workflow", "Assign owners", "Review weekly"],
    sopSuggestions: ["Task handoff SOP", "Follow-up SOP"],
    kpiSuggestions: ["Completion rate", "Turnaround time"],
    expectedOutcome: "More clarity, less confusion, stronger execution.",
    cooVerdict: "Your business can grow, but the system must get cleaner first."
  });
}
