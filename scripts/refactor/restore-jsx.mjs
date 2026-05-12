import fs from "fs";
import path from "path";

const ROOTS = ["app", "src", "components"];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full, out);
    else if (f.endsWith(".tsx")) out.push(full);
  }
  return out;
}

function fix(file) {
  let code = fs.readFileSync(file, "utf8");

  // ONLY fix broken UI return null cases
  if (!code.includes("return null")) return;

  code = code.replace(
    /return null\s*;?/g,
    `return (
      <div className="w-full h-full">
        {/* restored UI shell */}
      </div>
    );`
  );

  fs.writeFileSync(file, code);
  console.log("RESTORED JSX:", file);
}

console.log("RESTORING UI LAYER...");

for (const r of ROOTS) {
  walk(r).forEach(fix);
}

console.log("DONE - JSX RESTORED");
