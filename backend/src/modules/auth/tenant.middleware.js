import crypto from "node:crypto";
import { env } from "../../config/env.js";
import { supabase } from "../../lib/supabase.js";

export async function requireTenantAccess(req, _res, next) {
  try {
    const tenantSlug = req.headers["x-tenant-slug"];
    const bearer = readBearerToken(req.headers.authorization);
    const headerKey = req.headers["x-api-key"];
    const apiKey = bearer ?? headerKey;

    if (!tenantSlug || typeof tenantSlug !== "string") {
      const error = new Error("Header x-tenant-slug requerido");
      error.status = 400;
      throw error;
    }

    if (!apiKey || typeof apiKey !== "string") {
      const error = new Error("API key requerida (Authorization: Bearer o x-api-key)");
      error.status = 401;
      throw error;
    }

    if (!timingSafeEqualString(apiKey, env.CMS_API_KEY)) {
      const error = new Error("API key invalida");
      error.status = 401;
      throw error;
    }

    const tenant = await getTenantBySlug(tenantSlug);
    req.tenantContext = {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      userId: "api-key",
      role: "owner"
    };

    next();
  } catch (error) {
    next(error);
  }
}

function readBearerToken(authorizationHeader) {
  if (!authorizationHeader) return null;
  const [type, token] = authorizationHeader.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function timingSafeEqualString(a, b) {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

async function getTenantBySlug(tenantSlug) {
  const { data, error } = await supabase
    .from("tenants")
    .select("id,slug,name")
    .eq("slug", tenantSlug)
    .maybeSingle();

  if (error) throw error;
  if (!data?.id) {
    const notFoundError = new Error("Tenant no encontrado");
    notFoundError.status = 404;
    throw notFoundError;
  }

  return data;
}
