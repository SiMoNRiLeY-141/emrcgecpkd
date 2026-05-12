const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const envFile = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  const [key, ...value] = line.split("=");
  if (key && value) envVars[key.trim()] = value.join("=").trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing Insert into maintenance_requests table...");
  try {
    const { data, error } = await supabase.from("maintenance_requests").insert([
      {
        name: "Test",
        department: "CSE",
        location: "Lab 1",
        issue: "Broken wire",
      },
    ]);

    if (error) {
      console.error("Insert failed:", error);
    } else {
      console.log("Insert successful:", data);
    }
  } catch (err) {
    console.error("Fetch failed completely:", err.message);
  }
}

testInsert();
