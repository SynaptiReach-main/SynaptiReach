const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "exports");
const outFile = path.join(outDir, "ONBOARDING_CODE_REVIEW.md");

const includeDirs = ["app", "components", "lib", "supabase", "docs"];
const includeExt = new Set([".ts", ".tsx", ".js", ".jsx", ".sql", ".md", ".json"]);
const pattern = /(onboard|signup|trial|billing|stripe|checkout|subscription|workspace|business profile|provider|api key|usage cap|caps|byok|launch readiness|staff|import|settings|workflow|lead import|twilio|resend|ayrshare|openrouter|gemini|openai)/i;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git", "dist", "build"].includes(entry.name)) continue;
      walk(full, files);
    } else {
      const ext = path.extname(entry.name);
      if (!includeExt.has(ext)) continue;

      const rel = path.relative(root, full).replaceAll("\\", "/");
      const nameMatch = pattern.test(rel);
      let content = "";
      try {
        content = fs.readFileSync(full, "utf8");
      } catch {
        continue;
      }

      if (nameMatch || pattern.test(content)) {
        files.push({ full, rel, ext, content });
      }
    }
  }
  return files;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = [];
for (const dir of includeDirs) {
  walk(path.join(root, dir), files);
}

files.sort((a, b) => a.rel.localeCompare(b.rel));

let md = "# SynaptiReach Onboarding Code Review Export\n\n";
md += `Generated: ${new Date().toISOString()}\n\n`;
md += `Files included: ${files.length}\n\n`;

for (const file of files) {
  const lang =
    file.ext === ".tsx" ? "tsx" :
    file.ext === ".ts" ? "ts" :
    file.ext === ".sql" ? "sql" :
    file.ext === ".json" ? "json" :
    file.ext === ".md" ? "md" :
    "";

  md += `\n---\n\n## ${file.rel}\n\n`;
  md += "```" + lang + "\n";
  md += file.content;
  if (!file.content.endsWith("\n")) md += "\n";
  md += "```\n";
}

fs.writeFileSync(outFile, md, "utf8");

console.log(`Exported ${files.length} files to: ${outFile}`);
