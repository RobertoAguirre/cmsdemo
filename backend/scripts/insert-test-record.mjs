import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en backend/.env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const slug = process.env.TEST_TENANT_SLUG ?? "demo-mx";

const { data: tenant, error: tenantError } = await supabase
  .from("tenants")
  .upsert({ name: "Tenant prueba", slug, plan: "starter" }, { onConflict: "slug" })
  .select("id,slug")
  .single();

if (tenantError) {
  console.error("Error tenants:", tenantError.message);
  process.exit(1);
}

const { data: row, error: insertError } = await supabase
  .from("content_items")
  .insert({
    tenant_id: tenant.id,
    title: `Ping CMS ${new Date().toISOString()}`,
    slug: `ping-${Date.now()}`,
    content_type: "pagina",
    body: "Registro de prueba desde scripts/insert-test-record.mjs",
    seo: { source: "smoke-test" },
    status: "draft"
  })
  .select("id,title,slug,tenant_id,status,created_at")
  .single();

if (insertError) {
  console.error("Error content_items:", insertError.message);
  process.exit(1);
}

console.log("Conexion OK. Registro insertado:", row);
