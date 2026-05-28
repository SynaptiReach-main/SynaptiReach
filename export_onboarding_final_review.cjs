const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "exports");
const outFile = path.join(outDir, "ONBOARDING_FINAL_REVIEW_CODE.md");

const files = [
  "app/onboarding/page.tsx",
  "app/onboarding/status/page.tsx",
  "lib/onboarding/server.ts",
  "app/api/onboarding/stripe-session/route.ts",
  "app/api/onboarding/save/route.ts",
  "app/api/onboarding/complete/route.ts",
  "app/api/onboarding/upload/route.ts",
  "app/dashboard/layout.tsx",
  "app/dashboard/settings/page.tsx",
  "docs/onboarding.md",
  "exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md"
];

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let md = "# SynaptiReach Onboarding Final Review Code\n\n";
md += `Generated: ${new Date().toISOString()}\n\n`;

for (const rel of files) {
  const full = path.join(root, rel);
  md += `\n---\n\n## ${rel}\n\n`;

  if (!fs.existsSync(full)) {
    md += "Missing file.\n";
    continue;
  }

  const ext = path.extname(full);
  const lang =
    ext === ".tsx" ? "tsx" :
    ext === ".ts" ? "ts" :
    ext === ".md" ? "md" :
    "";

  const content = fs.readFileSync(full, "utf8");
  md += "```" + lang + "\n";
  md += content;
  if (!content.endsWith("\n")) md += "\n";
  md += "```\n";
}

fs.writeFileSync(outFile, md, "utf8");
console.log(`Exported to ${outFile}`);
