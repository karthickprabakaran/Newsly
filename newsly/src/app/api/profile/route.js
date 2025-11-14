import { supabaseAdmin } from '../../../../util/supabase-server';

const TABLE_NAME = "users";

function parseSuggestedCategories(input) {
  if (!input) return null;
  if (Array.isArray(input)) return input.map((v) => String(v).toLowerCase());
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed))
        return parsed.map((v) => String(v).toLowerCase());
    } catch {}
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((v) => v.toLowerCase());
  }
  return null;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  if (!userId) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select("*")
    .eq("id", userId);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!data || data.length === 0) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify({ user: data[0] }), { status: 200 });
}

export async function PATCH(req) {
  const body = await req.json();
  const { user_id, name, suggested_news } = body;

  if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });

  const updates = {};
  if (name?.trim()) updates.name = name.trim();
  const parsed = parseSuggestedCategories(suggested_news);
  if (parsed) updates.suggested_news = parsed;

  if (Object.keys(updates).length === 0) {
    return new Response(JSON.stringify({ error: "No fields to update" }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .update(updates)
    .eq("id", user_id)
    .select();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!data || data.length === 0) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify({ user: data[0] }), { status: 200 });
}