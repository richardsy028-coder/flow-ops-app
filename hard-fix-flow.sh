#!/bin/bash

echo "🔥 HARD FIXING FLOW SITE..."

mkdir -p functions/api
mkdir -p assets

# Keep founder image powerful and connected
if [ -f founder.jpg ]; then
  cp founder.jpg assets/founder.jpg
  echo "✅ Founder image copied to assets/founder.jpg"
else
  echo "⚠️ founder.jpg missing. Put your image in project root and name it founder.jpg"
fi

# Backend always returns valid JSON
cat > functions/api/diagnose.js <<'JS'
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
JS

# Replace script safely inside index.html
python3 <<'PY'
from pathlib import Path
import re

p = Path("index.html")
html = p.read_text(encoding="utf-8")

script = r'''<script>
function safeObj(obj) {
  return obj && typeof obj === "object" ? obj : {};
}

function safeArr(arr) {
  return Array.isArray(arr) ? arr : [];
}

function bulletList(arr) {
  const safe = safeArr(arr);
  return safe.length ? safe.map(item => "• " + item).join("\n") : "• Not provided";
}

async function runDiagnosis() {
  const industryEl = document.getElementById("industryInput");
  const problemEl = document.getElementById("problem");
  const output = document.getElementById("output");

  const industry = industryEl ? industryEl.value : "General Business";
  const problem = problemEl ? problemEl.value.trim() : "";

  if (!output) {
    alert("Missing output container.");
    return;
  }

  if (!problem) {
    output.textContent = "Please describe the operational problem first.";
    return;
  }

  output.textContent = "FLOW AI is analyzing your operation...";

  try {
    const res = await fetch("/api/diagnose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ industry, problem })
    });

    const text = await res.text();

    if (!text || !text.trim()) {
      output.textContent = "Backend returned empty response. The /api/diagnose function is not deployed.";
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      output.textContent = "Backend did not return valid JSON:\n\n" + text;
      return;
    }

    if (!res.ok || data.error) {
      output.textContent = "Backend Error:\n\n" + JSON.stringify(data, null, 2);
      return;
    }

    const systemBreakdown = safeObj(data.systemBreakdown);
    const flowFramework = safeObj(data.flowFramework);

    output.textContent =
      "EXECUTIVE SUMMARY\n" + (data.executiveSummary || "Not provided") + "\n\n" +
      "CORE PROBLEM\n" + (data.coreProblem || "Not provided") + "\n\n" +
      "ROOT CAUSES\n" + bulletList(data.rootCauses) + "\n\n" +
      "PEOPLE\n" + bulletList(systemBreakdown.people) + "\n\n" +
      "PROCESS\n" + bulletList(systemBreakdown.process) + "\n\n" +
      "SYSTEMS\n" + bulletList(systemBreakdown.systems) + "\n\n" +
      "FLOW FRAMEWORK\n" +
      "Find: " + (flowFramework.find || "Not provided") + "\n" +
      "Layout: " + (flowFramework.layout || "Not provided") + "\n" +
      "Optimize: " + (flowFramework.optimize || "Not provided") + "\n" +
      "Work: " + (flowFramework.work || "Not provided") + "\n\n" +
      "PRIORITY ACTIONS\n" + bulletList(data.priorityActions) + "\n\n" +
      "SOP SUGGESTIONS\n" + bulletList(data.sopSuggestions) + "\n\n" +
      "KPI SUGGESTIONS\n" + bulletList(data.kpiSuggestions) + "\n\n" +
      "EXPECTED OUTCOME\n" + (data.expectedOutcome || "Not provided") + "\n\n" +
      "COO VERDICT\n" + (data.cooVerdict || "Not provided");

  } catch (err) {
    output.textContent = "Frontend Error:\n\n" + err.message;
  }
}

function clearOutput() {
  const problem = document.getElementById("problem");
  const output = document.getElementById("output");

  if (problem) problem.value = "";
  if (output) output.textContent = "Your diagnosis will appear here.";
}
</script>'''

if "<script>" in html and "</script>" in html:
    html = re.sub(r"<script>[\s\S]*?</script>", script, html, count=1)
else:
    html = html.replace("</body>", script + "\n</body>")

# Fix image paths
html = html.replace('src="/richard-founder.jpg"', 'src="assets/founder.jpg"')
html = html.replace('src="richard-founder.jpg"', 'src="assets/founder.jpg"')
html = html.replace('src="/founder.jpg"', 'src="assets/founder.jpg"')
html = html.replace('src="founder.jpg"', 'src="assets/founder.jpg"')

p.write_text(html, encoding="utf-8")
print("✅ index.html script + image path fixed.")
PY

echo "🔍 Checking files..."
ls -la
ls -la functions/api
ls -la assets

echo "🔍 Checking bad .json() calls..."
grep -R "json()" index.html || echo "✅ No direct .json() calls in index.html"

echo "✅ HARD FIX COMPLETE"
echo ""
echo "Now run:"
echo "git add ."
echo "git commit -m 'hard fix frontend backend image'"
echo "git push"
