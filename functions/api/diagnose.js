export async function onRequestPost() {
  return new Response(JSON.stringify({
    executiveSummary: "FLOW API is working.",
    coreProblem: "The frontend and Cloudflare function are now connected.",
    rootCauses: ["Previous route returned an empty response"],
    systemBreakdown: {
      people: ["Clear ownership needed"],
      process: ["Standard workflow needed"],
      systems: ["Tracking system needed"]
    },
    flowFramework: {
      find: "Find the bottleneck",
      layout: "Map the workflow",
      optimize: "Improve weak steps",
      work: "Execute weekly"
    },
    priorityActions: ["Confirm API works", "Then reconnect AI"],
    sopSuggestions: ["Weekly diagnosis SOP"],
    kpiSuggestions: ["Completion rate", "Retention rate"],
    expectedOutcome: "Stable app behavior.",
    cooVerdict: "Connection test passed."
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
