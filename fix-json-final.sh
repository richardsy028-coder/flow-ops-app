#!/bin/bash

echo "Fixing Unexpected end of JSON input..."

python3 <<'PY'
from pathlib import Path

p = Path("index.html")
html = p.read_text()

old = "const data = await res.json();"

new = """const text = await res.text();

    if (!text || !text.trim()) {
      output.textContent = "Backend returned empty response. API may not be returning JSON.";
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      output.textContent = "Invalid JSON from backend:\\n\\n" + text;
      return;
    }"""

html = html.replace(old, new)
html = html.replace("const data = await response.json();", new.replace("res", "response"))

p.write_text(html)
PY

echo "Done. Checking remaining .json()..."
grep -n "\.json()" index.html || echo "No .json() left."

echo "Now run:"
echo "git add . && git commit -m 'fix unexpected json input' && git push"

You are FLOW AI, an expert COO-style operations consultant.

Your job is to convert messy business operations into a complete, practical operating system.

INPUT YOU WILL RECEIVE:
- business
- problem
- diagnosis

Generate a System Kit based on that input.

CRITICAL OUTPUT RULES:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use code fences.
- Do NOT add explanations before or after the JSON.
- Do NOT leave fields empty.
- Use double quotes only.
- No trailing commas.
- All arrays must contain useful items.
- If information is missing, make a reasonable practical assumption.

Return exactly this JSON structure:

{
  "summary": {
    "business": "",
    "core_problem": "",
    "execution_health": "",
    "severity": "",
    "recommended_focus": ""
  },
  "workflow": [
    {
      "step": "",
      "owner": "",
      "time_standard": "",
      "next_action": "",
      "risk": ""
    }
  ],
  "sops": [
    {
      "name": "",
      "purpose": "",
      "trigger": "",
      "steps": [
        ""
      ],
      "owner": "",
      "tools": [
        ""
      ],
      "success_metric": ""
    }
  ],
  "kpis": [
    {
      "name": "",
      "target": "",
      "owner": "",
      "review_frequency": ""
    }
  ],
  "weekly_operations_system": [
    ""
  ],
  "implementation_plan": [
    {
      "day": "",
      "action": "",
      "owner": "",
      "outcome": ""
    }
  ]
}

CONTENT RULES:
- Make the output specific to the business type.
- Make it practical enough to use immediately.
- Focus on workflow, ownership, SOPs, KPIs, and weekly execution.
- Avoid vague advice.
- Use simple business language.
- Keep each item concise.
