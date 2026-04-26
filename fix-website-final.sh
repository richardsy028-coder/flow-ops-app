#!/bin/bash

echo "Fixing FLOW frontend + backend..."

mkdir -p functions/api

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
JS

python3 <<'PY'
from pathlib import Path
import re

p = Path("index.html")
html = p.read_text(encoding="utf-8")

new_script = r'''<script>
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

    const list = arr => Array.isArray(arr) ? arr.map(x => "• " + x).join("\n") : "• Not provided";

    output.textContent =
      "EXECUTIVE SUMMARY\n" + (data.executiveSummary || "Not provided") + "\n\n" +
      "CORE PROBLEM\n" + (data.coreProblem || "Not provided") + "\n\n" +
      "ROOT CAUSES\n" + list(data.rootCauses) + "\n\n" +
      "PEOPLE\n" + list(data.systemBreakdown?.people) + "\n\n" +
      "PROCESS\n" + list(data.systemBreakdown?.process) + "\n\n" +
      "SYSTEMS\n" + list(data.systemBreakdown?.systems) + "\n\n" +
      "FLOW FRAMEWORK\n" +
      "Find: " + (data.flowFramework?.find || "Not provided") + "\n" +
      "Layout: " + (data.flowFramework?.layout || "Not provided") + "\n" +
      "Optimize: " + (data.flowFramework?.optimize || "Not provided") + "\n" +
      "Work: " + (data.flowFramework?.work || "Not provided") + "\n\n" +
      "PRIORITY ACTIONS\n" + list(data.priorityActions) + "\n\n" +
      "SOP SUGGESTIONS\n" + list(data.sopSuggestions) + "\n\n" +
      "KPI SUGGESTIONS\n" + list(data.kpiSuggestions) + "\n\n" +
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

html = re.sub(r"<script>[\s\S]*?</script>", new_script, html, count=1)

p.write_text(html, encoding="utf-8")
print("index.html frontend script fixed.")
PY

echo "Checking for bad .json() calls..."
grep -R "json()" index.html || echo "No bad .json() calls found."

echo "Done."
echo "Now run:"
echo "git add . && git commit -m 'final fix frontend backend json' && git push"
