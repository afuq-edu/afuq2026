// رفع صور وملفات المنصات إلى مخزن pf-media بعد التحقق من رمز المعلمة
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const OK_TYPES = /^(image\/(jpeg|png|webp|gif|svg\+xml|heic)|application\/pdf|application\/(msword|vnd\.openxmlformats-officedocument\.[a-z.]+|vnd\.ms-(excel|powerpoint))|text\/plain|video\/mp4|audio\/(mpeg|mp4))$/;
const MAX = 15 * 1024 * 1024;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const fd = await req.formData();
    const slug = String(fd.get("slug") || "");
    const pin = String(fd.get("pin") || "");
    const file = fd.get("file");
    if (!/^[a-z0-9-]{2,40}$/.test(slug) || !(file instanceof File)) return json({ error: "bad request" }, 400);
    if (file.size > MAX) return json({ error: "too large" }, 413);
    const type = file.type || "application/octet-stream";
    if (!OK_TYPES.test(type)) return json({ error: "type" }, 415);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: ok, error: e1 } = await sb.rpc("pf_check", { p_slug: slug, p_pin: pin });
    if (e1) return json({ error: e1.message }, 429);
    if (!ok) return json({ error: "bad pin" }, 401);

    const ext = (file.name.match(/\.([a-z0-9]{1,5})$/i)?.[1] || type.split("/")[1] || "bin").toLowerCase().replace("svg+xml", "svg");
    const path = `${slug}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    const { error: e2 } = await sb.storage.from("pf-media").upload(path, file, { contentType: type, cacheControl: "31536000", upsert: false });
    if (e2) return json({ error: e2.message }, 500);
    const { data } = sb.storage.from("pf-media").getPublicUrl(path);
    return json({ url: data.publicUrl });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
