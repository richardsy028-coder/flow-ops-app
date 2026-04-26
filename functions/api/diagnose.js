git add functions/api/diagnose.js
git status
export async function onRequestPost() {
  return Response.json({
    executiveSummary: "Your system is working.",
    coreProblem: "Now testing frontend-backend connection.",
    rootCauses: ["Test"],
    systemBreakdown: {
      people: ["Test"],
      process: ["Test"],
      systems: ["Test"]
    },
    flowFramework: {
      find: "Test",
      layout: "Test",
      optimize: "Test",
      work: "Test"
    },
    priorityActions: ["Test"],
    sopSuggestions: ["Test"],
    kpiSuggestions: ["Test"],
    expectedOutcome: "Working system",
    cooVerdict: "All connected."
  });
}
