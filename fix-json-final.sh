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
