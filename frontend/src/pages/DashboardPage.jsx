import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

const initialSiteForm = {
  nombre: "",
  dominio: "",
  plataforma: "web"
};

const initialContentForm = {
  title: "",
  slug: "",
  contentType: "pagina",
  body: ""
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [siteForm, setSiteForm] = useState(initialSiteForm);
  const [contentForm, setContentForm] = useState(initialContentForm);

  const overviewQuery = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: api.getDashboardOverview
  });

  const sitesQuery = useQuery({
    queryKey: ["dashboard-sites"],
    queryFn: api.getMonitoredSites
  });

  const createSiteMutation = useMutation({
    mutationFn: api.createMonitoredSite,
    onSuccess: () => {
      setSiteForm(initialSiteForm);
      queryClient.invalidateQueries({ queryKey: ["dashboard-sites"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    }
  });

  const contentQuery = useQuery({
    queryKey: ["content"],
    queryFn: api.getContent
  });

  const createContentMutation = useMutation({
    mutationFn: api.createContent,
    onSuccess: () => {
      setContentForm(initialContentForm);
      queryClient.invalidateQueries({ queryKey: ["content"] });
    }
  });

  const publishMutation = useMutation({
    mutationFn: api.publishContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content"] })
  });

  const summary = overviewQuery.data?.summary;

  const cards = useMemo(
    () => [
      { label: "Leads (30 dias)", value: formatNumber(summary?.leads) },
      { label: "Reacciones (30 dias)", value: formatNumber(summary?.reactions) },
      { label: "Sesiones (30 dias)", value: formatNumber(summary?.sessions) },
      {
        label: "Tiempo promedio en sitio",
        value: formatDuration(summary?.avgTimeOnSiteSeconds)
      },
      { label: "Sitios activos", value: formatNumber(summary?.activeSites) }
    ],
    [summary]
  );

  const handleSiteSubmit = (event) => {
    event.preventDefault();
    createSiteMutation.mutate(siteForm);
  };

  const handleContentSubmit = (event) => {
    event.preventDefault();
    createContentMutation.mutate(contentForm);
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Volver al inicio
        </Link>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          Dashboard principal
        </span>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Resumen de adquisicion y engagement</h1>
        <p className="mt-1 text-sm text-slate-600">
          Primer panel para monitorear leads de sitios web y apps moviles por tenant.
        </p>

        {overviewQuery.error ? (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {overviewQuery.error.message}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card) => (
            <article key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {overviewQuery.isLoading ? "..." : card.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold">Crear nuevo sitio a monitorear</h2>
          <p className="mt-1 text-sm text-slate-600">
            Al crearlo generamos una tracking key para eventos de leads y reacciones.
          </p>

          {createSiteMutation.error ? (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {createSiteMutation.error.message}
            </p>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={handleSiteSubmit}>
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Nombre del sitio o app"
              value={siteForm.nombre}
              onChange={(event) => setSiteForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="dominio.com o app.bundle"
              value={siteForm.dominio}
              onChange={(event) => setSiteForm((prev) => ({ ...prev, dominio: event.target.value }))}
              required
            />
            <select
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              value={siteForm.plataforma}
              onChange={(event) =>
                setSiteForm((prev) => ({ ...prev, plataforma: event.target.value }))
              }
            >
              <option value="web">Web</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
            <button
              type="submit"
              disabled={createSiteMutation.isPending}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {createSiteMutation.isPending ? "Creando..." : "Crear sitio"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <h2 className="text-lg font-semibold">Sitios monitoreados</h2>
          <p className="mt-1 text-sm text-slate-600">Administra propiedades web y productos moviles.</p>

          <div className="mt-5 space-y-3">
            {sitesQuery.isLoading && <p className="text-sm text-slate-500">Cargando sitios...</p>}
            {sitesQuery.error && <p className="text-sm text-red-600">{sitesQuery.error.message}</p>}
            {sitesQuery.data?.sites?.length === 0 && (
              <p className="text-sm text-slate-500">Aun no hay sitios registrados.</p>
            )}
            {sitesQuery.data?.sites?.map((site) => (
              <article
                key={site.id}
                className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-4"
              >
                <div className="md:col-span-2">
                  <p className="font-medium text-slate-900">{site.nombre}</p>
                  <p className="text-sm text-slate-600">{site.dominio}</p>
                </div>
                <p className="text-sm capitalize text-slate-700">{site.plataforma}</p>
                <div className="text-sm">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                    {site.status}
                  </span>
                  {site.tracking_key ? (
                    <p className="mt-2 text-xs text-slate-500">Key: {site.tracking_key}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 grid gap-8 md:grid-cols-5">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold">Publicar contenido</h2>
          <form className="mt-5 space-y-4" onSubmit={handleContentSubmit}>
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Titulo"
              value={contentForm.title}
              onChange={(event) =>
                setContentForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Slug"
              value={contentForm.slug}
              onChange={(event) => setContentForm((prev) => ({ ...prev, slug: event.target.value }))}
              required
            />
            <select
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              value={contentForm.contentType}
              onChange={(event) =>
                setContentForm((prev) => ({ ...prev, contentType: event.target.value }))
              }
            >
              <option value="pagina">Pagina</option>
              <option value="blog">Blog</option>
              <option value="landing">Landing</option>
              <option value="producto">Producto</option>
            </select>
            <textarea
              className="h-24 w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Contenido"
              value={contentForm.body}
              onChange={(event) => setContentForm((prev) => ({ ...prev, body: event.target.value }))}
              required
            />
            <button
              type="submit"
              disabled={createContentMutation.isPending}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {createContentMutation.isPending ? "Guardando..." : "Crear draft"}
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-3">
          <h2 className="text-lg font-semibold">Contenido reciente</h2>
          <div className="mt-4 space-y-3">
            {contentQuery.isLoading && <p className="text-sm text-slate-500">Cargando...</p>}
            {contentQuery.error && <p className="text-sm text-red-600">{contentQuery.error.message}</p>}
            {contentQuery.data?.items?.map((item) => (
              <article key={item.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    /{item.slug} · {item.content_type} · {item.status}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium disabled:opacity-40"
                  onClick={() => publishMutation.mutate(item.id)}
                  disabled={item.status === "published" || publishMutation.isPending}
                >
                  Publicar
                </button>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function formatNumber(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("es-MX").format(safe);
}

function formatDuration(seconds) {
  const safe = Number.isFinite(seconds) ? seconds : 0;
  if (safe <= 0) return "0s";
  const mins = Math.floor(safe / 60);
  const sec = safe % 60;
  if (mins === 0) return `${sec}s`;
  return `${mins}m ${sec}s`;
}
