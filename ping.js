import fetch from "node-fetch";

async function pingSupabase() {
  try {
    const res = await fetch("https://dscxjvhgdechhmakdgwc.supabase.co/rest/v1/", {
      method: "OPTIONS", 
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    });
    console.log("Ping status:", res.status);
  } catch (err) {
    console.error("Ping failed:", err.message);
  }
}

pingSupabase();