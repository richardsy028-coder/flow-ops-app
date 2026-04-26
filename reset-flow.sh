#!/bin/bash

echo "Resetting FLOW clean..."

mkdir -p functions/api

cat > index.html <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>FLOW AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; font-family:Arial,sans-serif; background:#080806; color:#f5e7c3; }
    main { max-width:1000px; margin:auto; padding:60px 20px; }
    h1 { font-size:48px; color:#fff4d6; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:30px; }
    .card { background:#15130d; border:1px solid #7a6425; border-radius:18px; padding:28px; }
    select, textarea { width:100%; box-sizing:border-box; padding:16px; background:#050505; color:#fff; border:1px solid #7a6425; border-radius:14px; margin-bottom:18px; }
    textarea { min-height:220px; }
    button { background:#f4cf57; color:#000; border:0; padding:14px 24px; border-radius:999px; font-weight:bold; cursor:pointer; margin-right:8px; }
    #output { white-space:pre-wrap; line-height:1.6; color:#fff; background:#050505; padding:16px; border-radius:12px; min-height:180px; }
  </style>
</head>
<body>
  <main>
    <h1>FLOW AI Operations Companion</h1>
    <p>COO-level operational clarity for any industry.</p>

    <div class="grid">
      <section class="card">
        <h2>Operational Analysis</h2>

        <select id="industryInput">
          <option>General Business</option>
          <option>Education and Training</option>
          <option>SaaS and Technology</option>
          <option>Agencies and Services</option>
          <option>E-commerce</option>
          <option>Healthcare</option>
          <option>Restaurants and Hospitality</option>
          <option>Construction and Trades</option>
          <option>Real Estate</option>
          <option>Local Business</option>
        </select>

        <textarea id="problem" placeholder="Describe your operational problem...">Low student engagement and unclear curriculum flow. Students stop attending after two weeks. Teachers are inconsistent and there is no structured follow-up system.</textarea>

        <button onclick="runDiagnosis()">Run Diagnosis</button>
        <button onclick="clearOutput()">Clear</button>
      </section>

      <section class="card">
        <h2>FLOW Output</h2>
        <div id="output">Your diagnosis will appear here.</div>
      </section>
    </div>
  </main>

  <script>
    async function runDiagnosis() {
      const industry = document.getElementById("industryInput").value;
      const problem = document.getElementById("problem").value;
      const output = document.getElementById("output");

      output.textContent = "Processing...";

      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ industry, problem })
        });

        const text = await res.text();

        if (!text.trim()) {
          output.textContent = "Backend returned empty response.";
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          output.textContent = "Invalid JSON from backend:\n\n" + text;
          return;
        }

        if (!res.ok || data.error) {
          output.textContent = "Backend Error:\n\n" + JSON.stringify(data, null, 2);
          return;
        }

        const list = arr => Array.isArray(arr) ? arr.map(x => "- " + x).join("\n") : "";

        output.textContent =
          "Executive Summary:\n" + data.executiveSummary + "\n\n" +
          "Core Problem:\n" + data.coreProblem + "\n\n" +
          "Root Causes:\n" + list(data.rootCauses) + "\n\n" +
          "People:\n" + list(data.systemBreakdown.people) + "\n\n" +
          "Process:\n" + list(data.systemBreakdown.process) + "\n\n" +
          "Systems:\n" + list(data.systemBreakdown.systems) + "\n\n" +
          "FLOW Framework:\n" +
          "Find: " + data.flowFramework.find + "\n" +
          "Layout: " + data.flowFramework.layout + "\n" +
          "Optimize: " + data.flowFramework.optimize + "\n" +
          "Work: " + data.flowFramework.work + "\n\n" +
          "Priority Actions:\n" + list(data.priorityActions) + "\n\n" +
          "SOP Suggestions:\n" + list(data.sopSuggestions) + "\n\n" +
          "KPI Suggestions:\n" + list(data.kpiSuggestions) + "\n\n" +
          "Expected Outcome:\n" + data.expectedOutcome + "\n\n" +
          "COO Verdict:\n" + data.cooVerdict;

      } catch (err) {
        output.textContent = "Frontend Error:\n\n" + err.message;
      }
    }

    function clearOutput() {
      document.getElementById("output").textContent = "Your diagnosis will appear here.";
    }
  </script>
</body>
</html>
HTML

cat > functions/api/diagnose.js <<'JS'
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
JS

rm -rf api

echo "Done. Clean FLOW reset complete."
echo "Now run:"
echo "git add . && git commit -m 'reset flow clean version' && git push"
