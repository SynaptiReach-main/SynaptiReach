const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "exports");
const outFile = path.join(outDir, "ONBOARDING_FOCUSED_CODE_REVIEW.md");

const exactFiles = [
  "app/onboarding/page.tsx",
  "lib/onboarding/server.ts",
  "app/api/onboarding/route.ts",
  "app/api/billing/subscription/checkout/route.ts",
  "app/api/billing/portal/route.ts",
  "app/api/billing/stripe/webhook/route.ts",
  "app/api/stripe/webhook/route.ts",
  "app/(marketing)/signup/page.tsx",
  "app/(marketing)/trial/page.tsx",
  "app/dashboard/layout.tsx",
  "app/dashboard/settings/page.tsx",
  "lib/billing/plans.ts",
  "lib/billing/services.ts",
  "lib/billing/usageCaps.ts",
  "lib/billing/stripe.ts",
  "supabase/user_crm_full_completion_schema.sql",
  "docs/onboarding.md",
  "exports/FINAL_FULL_CRM_COMPLETION_CHECKLIST.md"
];

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let md = "# SynaptiReach Focused Onboarding Code Review Export\n\n";
md += `Generated: ${new Date().toISOString()}\n\n`;

for (const rel of exactFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    md += `\n---\n\n## ${rel}\n\n`;
    md += `Missing file: ${rel}\n`;
    continue;
  }

  const ext = path.extname(full);
  const lang =
    ext === ".tsx" ? "tsx" :
    ext === ".ts" ? "ts" :
    ext === ".sql" ? "sql" :
    ext === ".json" ? "json" :
    ext === ".md" ? "md" :
    "";

  const content = fs.readFileSync(full, "utf8");

  md += `\n---\n\n## ${rel}\n\n`;
  md += "```" + lang + "\n";
  md += content;
  if (!content.endsWith("\n")) md += "\n";
  md += "```\n";
}

fs.writeFileSync(outFile, md, "utf8");
console.log(`Exported focused onboarding files to: ${outFile}`);
