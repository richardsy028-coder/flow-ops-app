#!/bin/bash

echo "Fixing ONLY index.html JavaScript. Design stays unchanged."

python3 <<'PY'
from pathlib import Path
import re

p = Path("index.html")
html = p.read_text(encoding="utf-8")

new_script = r'''<script>
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
      output.textContent = "Backend returned empty response. Your /api/diagnose function may not be deployed.";
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

# Replace only the first script block
if "<script>" in html and "</script>" in html:
    html = re.sub(r"<script>[\s\S]*?</script>", new_script, html, count=1)
else:
    html = html.replace("</body>", new_script + "\n</body>")

p.write_text(html, encoding="utf-8")
print("index.html fixed without changing design.")
PY

echo "Checking for bad .json() calls..."
grep -R "json()" index.html || echo "No direct .json() calls found."

echo "Done. Now deploy:"
echo "git add . && git commit -m 'master index html frontend fix' && git push"
