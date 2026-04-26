#!/bin/bash

echo "Fixing frontend JS placement..."

cat > index.html <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>FLOW AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; font-family:Arial; background:#080806; color:#f5e7c3; }
    main { max-width:900px; margin:auto; padding:40px; }
    textarea, select { width:100%; padding:10px; margin:10px 0; }
    button { padding:10px 16px; margin-right:10px; }
    #output { margin-top:20px; background:#000; color:#fff; padding:15px; white-space:pre-wrap; }
  </style>
</head>
<body>

<main>
  <h1>FLOW AI</h1>

  <select id="industryInput">
    <option>General Business</option>
    <option>Education</option>
    <option>SaaS</option>
  </select>

  <textarea id="problem">My team misses deadlines and I always follow up.</textarea>

  <button onclick="runDiagnosis()">Run Diagnosis</button>
  <button onclick="clearOutput()">Clear</button>

  <div id="output">Your diagnosis will appear here.</div>
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ industry, problem })
    });

    const text = await res.text();

    if (!text || !text.trim()) {
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

    const list = arr => Array.isArray(arr) ? arr.map(x => "- " + x).join("\\n") : "";

    output.textContent =
      "Executive Summary:\\n" + data.executiveSummary + "\\n\\n" +
      "Core Problem:\\n" + data.coreProblem + "\\n\\n" +
      "Root Causes:\\n" + list(data.rootCauses) + "\\n\\n" +
      "People:\\n" + list(data.systemBreakdown.people) + "\\n\\n" +
      "Process:\\n" + list(data.systemBreakdown.process) + "\\n\\n" +
      "Systems:\\n" + list(data.systemBreakdown.systems) + "\\n\\n" +
      "COO Verdict:\\n" + data.cooVerdict;

  } catch (err) {
    output.textContent = "Frontend Error:\\n\\n" + err.message;
  }
}

function clearOutput() {
  document.getElementById("output").textContent = "Your diagnosis will appear here.";
}
</script>

</body>
</html>
HTML

echo "Frontend fixed."

echo ""
echo "Now run:"
echo "git add ."
echo "git commit -m 'fix frontend js placement'"
echo "git push"
