#!/usr/bin/env bash
set -e

echo "⚡ Running Clarity System build override..."

FILE="index.html"

if [ ! -f "$FILE" ]; then
  echo "❌ index.html not found"
  exit 1
fi

# Backup (optional for local debugging)
cp "$FILE" "index.backup.html"

# Use Node (available in Cloudflare build env) instead of Python
node <<'NODE'
const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// ✅ FAIR PRICING UPDATE
html = html.replace(/₱4,999\s*\/\s*\$89/g, '₱1,499 / $27');
html = html.replace(/₱15K.?₱30K\s*\/\s*\$299.?\\$599/g, '₱7,500–₱15,000 / $135–$270');

// ✅ BETTER DESCRIPTION
html = html.replace(
  /Includes full operational analysis[\s\S]*?14-day implementation path\./i,
  "Includes a clearer diagnosis, bottleneck explanation, priority actions, KPI suggestions, and a practical improvement roadmap for your business."
);

// ✅ INSERT DOWNLOAD SECTION (if not exists)
if (!html.includes("report-downloads")) {
  const section = `
<section id="report-downloads" style="padding:80px 6vw;">
  <div style="opacity:.7; margin-bottom:10px;">REPORT DOWNLOADS</div>

  <h2>Download your FLOW diagnosis.</h2>
  <p>Start free. Upgrade only if you want the full clarity.</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin-top:30px;">

    <div style="padding:24px;border-radius:16px;background:rgba(255,255,255,0.06);">
      <h3>Free Summary</h3>
      <div style="font-size:28px;font-weight:800;">₱0 / $0</div>
      <p>Quick diagnosis, main issue, and first action step.</p>
      <a href="flow-summary.pdf" download class="btn">Download PDF</a>
    </div>

    <div style="padding:24px;border-radius:16px;border:1px solid #d8ff7a;">
      <h3>Full Report</h3>
      <div style="font-size:28px;font-weight:800;">₱1,499 / $27</div>
      <p>Deeper analysis, bottlenecks, KPI fixes, and execution roadmap.</p>
      <a href="#contact" class="btn">Unlock Full Report</a>
    </div>

    <div style="padding:24px;border-radius:16px;background:rgba(255,255,255,0.06);">
      <h3>Execution Help</h3>
      <div style="font-size:28px;font-weight:800;">₱7,500–₱15,000</div>
      <p>Hands-on help to implement your system.</p>
      <a href="#contact" class="btn">Work With Me</a>
    </div>

  </div>
</section>
`;

  html = html.replace('</body>', section + '\n</body>');
}

// Save
fs.writeFileSync(file, html);
console.log("✅ Build modifications applied.");
NODE

echo "🚀 Build complete."