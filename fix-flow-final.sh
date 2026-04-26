#!/bin/bash

echo "Fixing AI reply + founder image..."

mkdir -p functions/api
mkdir -p assets

cat > functions/api/diagnose.js <<'JS'
export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));

    const industry = body.industry || "General Business";
    const problem = body.problem || "";

    if (!problem.trim()) {
      return Response.json({
        error: "Please describe your operational problem first."
      }, { status: 400 });
    }

    return Response.json({
      executiveSummary: `Your ${industry} operation is showing execution friction. The issue is not effort — it is unclear ownership, weak workflow visibility, and inconsistent follow-up.`,
      coreProblem: "The business is operating without a clear execution system.",
      rootCauses: [
        "Tasks are not clearly owned",
        "Follow-up depends on memory",
        "There is no simple workflow map",
        "KPIs are not being reviewed consistently"
      ],
      systemBreakdown: {
        people: [
          "People may be working hard but without clear responsibility",
          "The founder or manager is becoming the fallback owner"
        ],
        process: [
          "The workflow is not documented clearly",
          "Handoffs and follow-ups are inconsistent"
        ],
        systems: [
          "No visible tracker",
          "No weekly operations review rhythm"
        ]
      },
      flowFramework: {
        find: "Find the bottleneck causing the most repeated delay.",
        layout: "Map the real workflow from start to finish.",
        optimize: "Remove unnecessary steps and clarify ownership.",
        work: "Install SOPs, KPIs, and a weekly review habit."
      },
      priorityActions: [
        "Create a 7-step workflow map",
        "Assign one owner per recurring task",
        "Set a weekly review meeting",
        "Track only 3 KPIs first"
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
      expectedOutcome: "Less confusion, faster execution, clearer accountability, and fewer repeated mistakes.",
      cooVerdict: "Your business does not need more chaos management. It needs a simple operating system."
    });
  } catch (err) {
    return Response.json({
      error: err.message || "Server error"
    }, { status: 500 });
  }
}
JS

# Fix broken founder image reference in index.html
if [ -f index.html ]; then
  sed -i.bak 's|src="/richard-founder.jpg"|src="https://placehold.co/600x700/15130d/f4cf57?text=Richard+Sy"|g' index.html
  sed -i.bak 's|src="richard-founder.jpg"|src="https://placehold.co/600x700/15130d/f4cf57?text=Richard+Sy"|g' index.html
fi

echo "Done."
echo "Now run:"
echo "git add . && git commit -m 'fix ai response and founder image' && git push"
