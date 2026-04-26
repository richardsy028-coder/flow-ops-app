#!/bin/bash

echo "Fixing frontend JSON + aligning script..."

python3 <<'PY'
from pathlib import Path

p = Path("index.html")
html = p.read_text()

# Replace entire runDiagnosis safely
import re

pattern = r'async function runDiagnosis\([\s\S]*?\}'

replacement = """async function runDiagnosis() {
  const industry = document.getElementById("industryInput").value;
  const problem = document.getElementById("problem").value.trim();
  const output = document.getElementById("output");

  output.textContent = "Analyzing...";

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
    } catch (err) {
      output.textContent = "Invalid JSON from backend:\\n\\n" + text;
      return;
    }

    if (!res.ok || data.error) {
      output.textContent = "Backend Error:\\n\\n" + JSON.stringify(data, null, 2);
      return;
    }

    output.textContent =
      "EXECUTIVE SUMMARY\\n" + (data.executiveSummary || "") + "\\n\\n" +
      "CORE PROBLEM\\n" + (data.coreProblem || "") + "\\n\\n" +
      "COO VERDICT\\n" + (data.cooVerdict || "");

  } catch (err) {
    output.textContent = "Frontend Error:\\n\\n" + err.message;
  }
}"""

html = re.sub(pattern, replacement, html)

p.write_text(html)
print("index.html fixed and aligned.")
PY

echo "Done."
