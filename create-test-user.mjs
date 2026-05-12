import { createClient } from "@supabase/supabase-js";

const url =
"https://qjqyxdayqzismlaxofes.supabase.co";

const serviceKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcXl4ZGF5cXppc21sYXhvZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE0NDA4MCwiZXhwIjoyMDkxNzIwMDgwfQ.XdufpIcawDFm8GoHYtJ4YyeDCdqolPud5ZF00YZCGnA";

const supabase =
createClient(url, serviceKey);

const email =
"demo@synaptireach.com";

const password =
"SynaptiReach123!";

const { error } =
await supabase.auth.admin.createUser({
email,
password,
email_confirm: true,
});

if (error) {
console.error(error);
} else {
console.log("USER CREATED:");
console.log("Email:", email);
console.log("Password:", password);
}
