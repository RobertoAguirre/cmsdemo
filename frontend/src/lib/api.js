const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG ?? "demo-mx";
const CMS_API_KEY = import.meta.env.VITE_CMS_API_KEY ?? "";

async function request(path, options = {}) {
  if (!CMS_API_KEY) {
    throw new Error("Falta VITE_CMS_API_KEY en frontend/.env");
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-tenant-slug": TENANT_SLUG,
      Authorization: `Bearer ${CMS_API_KEY}`,
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error no controlado" }));
    throw new Error(error.message ?? "Error no controlado");
  }

  return response.json();
}

export const api = {
  getDashboardOverview: () => request("/dashboard/overview"),
  getMonitoredSites: () => request("/dashboard/sites"),
  createMonitoredSite: (payload) =>
    request("/dashboard/sites", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getContent: () => request("/content"),
  createContent: (payload) =>
    request("/content", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  publishContent: (id) =>
    request(`/content/${id}/publish`, {
      method: "PATCH"
    }),

  submitSignup: async (payload) => {
    const response = await fetch(`${API_URL}/signups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message ?? "No se pudo completar el registro");
    }
    return data;
  }
};
