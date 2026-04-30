const fs = require("fs");
const path = require("path");

const TARGET = /Synergy English Studio/gi;
const REPLACEMENT = "Clarity System";

// file types to scan
const VALID_EXT = [
  ".html", ".htm", ".js", ".jsx", ".ts", ".tsx",
  ".css", ".scss", ".json", ".md", ".txt", ".xml"
];

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const updated = content.replace(TARGET, REPLACEMENT);

    if (content !== updated) {
      fs.writeFileSync(filePath, updated, "utf8");
      console.log("✔ Updated:", filePath);
    }
  } catch (err) {
    console.log("⚠ Skipped:", filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // skip node_modules or build folders if needed
      if (!["node_modules", ".git", "dist", "build"].includes(file)) {
        walk(fullPath);
      }
    } else {
      if (VALID_EXT.includes(path.extname(fullPath))) {
        processFile(fullPath);
      }
    }
  });
}

// 👉 change this if your site is in a specific folder
const ROOT_DIR = "./";

console.log("🚀 Cleaning old brand...");
walk(ROOT_DIR);
console.log("✅ Done. 'Synergy English Studio' → 'Clarity System'");