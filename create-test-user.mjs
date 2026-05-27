import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.CRM_TEST_USER_EMAIL;
const password = process.env.CRM_TEST_USER_PASSWORD;

const missing = [
  ["NEXT_PUBLIC_SUPABASE_URL", url],
  ["SUPABASE_SERVICE_ROLE_KEY", serviceKey],
  ["CRM_TEST_USER_EMAIL", email],
  ["CRM_TEST_USER_PASSWORD", password],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Created test user ${data.user?.id || "(id unavailable)"} for ${email}.`);
