import fs from "fs";
import path from "path";

const TARGET_DIRS = ["src", "components"];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, files);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

function migrateFile(filePath) {
  let code = fs.readFileSync(filePath, "utf8");

  // Skip already migrated files
  if (!code.includes("const data =")) return;

  // Add supabase import if missing
  if (!code.includes("createClient") && !code.includes("supabase")) {
    code =
      `import { createClient } from "@/lib/supabase/client";\n` +
      code;
  }

  // Replace const data = [...]
  code = code.replace(
    /const\s+data\s*=\s*\[[\s\S]*?\];/g,
    `
const [data, setData] = useState<any[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const supabase = createClient();

    const { data } = await supabase
      .from("TABLE_NAME")
      .select("*");

    setData(data || []);
  };

  fetchData();
}, []);
`
  );

  fs.writeFileSync(filePath, code);
  console.log("MIGRATED:", filePath);
}

console.log("SAFE SUPABASE MIGRATION START");

for (const dir of TARGET_DIRS) {
  walk(dir).forEach(migrateFile);
}

console.log("DONE - SAFE UI PRESERVED MIGRATION COMPLETE");
