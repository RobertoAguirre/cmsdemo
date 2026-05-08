import { supabase } from "../../lib/supabase.js";

export async function listContent(tenantId) {
  const { data, error } = await supabase
    .from("content_items")
    .select("id,title,slug,content_type,status,updated_at")
    .eq("tenant_id", tenantId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createContent(tenantId, input) {
  const { data, error } = await supabase
    .from("content_items")
    .insert({
      tenant_id: tenantId,
      title: input.title,
      slug: input.slug,
      content_type: input.contentType,
      body: input.body,
      seo: input.seo ?? {},
      status: "draft"
    })
    .select("id,title,slug,content_type,status,updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function publishContent(tenantId, id) {
  const { data, error } = await supabase
    .from("content_items")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,title,slug,content_type,status,updated_at,published_at")
    .single();

  if (error) throw error;
  return data;
}
