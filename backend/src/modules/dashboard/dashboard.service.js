import { supabase } from "../../lib/supabase.js";

export async function getOverview(tenantId) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);
  const dateText = fromDate.toISOString().slice(0, 10);

  const [{ data: metricsRows, error: metricsError }, { count: activeSites, error: sitesError }] =
    await Promise.all([
      supabase
        .from("site_metrics_daily")
        .select("leads,reactions,sessions,total_time_seconds")
        .eq("tenant_id", tenantId)
        .gte("metric_date", dateText),
      supabase
        .from("monitored_sites")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("status", "active")
    ]);

  if (metricsError) throw metricsError;
  if (sitesError) throw sitesError;

  const totals = (metricsRows ?? []).reduce(
    (acc, row) => {
      acc.leads += row.leads ?? 0;
      acc.reactions += row.reactions ?? 0;
      acc.sessions += row.sessions ?? 0;
      acc.totalTimeSeconds += row.total_time_seconds ?? 0;
      return acc;
    },
    { leads: 0, reactions: 0, sessions: 0, totalTimeSeconds: 0 }
  );

  const avgTimeOnSiteSeconds = totals.sessions > 0 ? Math.round(totals.totalTimeSeconds / totals.sessions) : 0;

  return {
    periodDays: 30,
    leads: totals.leads,
    reactions: totals.reactions,
    sessions: totals.sessions,
    avgTimeOnSiteSeconds,
    activeSites: activeSites ?? 0
  };
}

export async function listSites(tenantId) {
  const { data, error } = await supabase
    .from("monitored_sites")
    .select("id,nombre,dominio,plataforma,status,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createSite(tenantId, payload) {
  const trackingKey = `trk_${Math.random().toString(36).slice(2, 12)}`;

  const { data, error } = await supabase
    .from("monitored_sites")
    .insert({
      tenant_id: tenantId,
      nombre: payload.nombre,
      dominio: normalizeDomain(payload.dominio),
      plataforma: payload.plataforma,
      tracking_key: trackingKey,
      status: "active"
    })
    .select("id,nombre,dominio,plataforma,status,tracking_key,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      const dup = new Error("Ese dominio ya esta registrado para este tenant");
      dup.status = 409;
      throw dup;
    }
    throw error;
  }

  await supabase.from("site_metrics_daily").insert({
    tenant_id: tenantId,
    site_id: data.id,
    metric_date: new Date().toISOString().slice(0, 10),
    leads: 0,
    reactions: 0,
    sessions: 0,
    total_time_seconds: 0
  });

  return data;
}

function normalizeDomain(rawDomain) {
  return rawDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
}
