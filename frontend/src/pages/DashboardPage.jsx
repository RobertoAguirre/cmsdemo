import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

const initialForm = {
  title: "",
  slug: "",
  contentType: "pagina",
  body: ""
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);

  const contentQuery = useQuery({
    queryKey: ["content"],
    queryFn: api.getContent
  });

  const createMutation = useMutation({
    mutationFn: api.createContent,
    onSuccess: () => {
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ["content"] });
    }
  });

  const publishMutation = useMutation({
    mutationFn: api.publishContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content"] })
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-6">
      <p className="mb-6">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Volver al inicio
        </Link>
      </p>
      <div className="grid gap-8 md:grid-cols-5">
        <section className="rounded-xl bg-white p-6 shadow-sm md:col-span-2">
          <h1 className="text-xl font-semibold">CMS Composable MX 2026</h1>
          <p className="mt-2 text-sm text-slate-600">
            Alta de contenido con flujo draft → publicado.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input
              className="w-full rounded-md border border-slate-200 p-2 text-sm"
              placeholder="Titulo"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-md border border-slate-200 p-2 text-sm"
              placeholder="Slug"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              required
            />
            <select
              className="w-full rounded-md border border-slate-200 p-2 text-sm"
              value={form.contentType}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contentType: event.target.value }))
              }
            >
              <option value="pagina">Pagina</option>
              <option value="blog">Blog</option>
              <option value="landing">Landing</option>
              <option value="producto">Producto</option>
            </select>
            <textarea
              className="h-32 w-full rounded-md border border-slate-200 p-2 text-sm"
              placeholder="Contenido"
              value={form.body}
              onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
              required
            />
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Guardando..." : "Crear draft"}
            </button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm md:col-span-3">
          <h2 className="text-lg font-semibold">Contenido</h2>
          <div className="mt-4 space-y-3">
            {contentQuery.isLoading && <p className="text-sm text-slate-500">Cargando...</p>}
            {contentQuery.error && (
              <p className="text-sm text-red-600">{contentQuery.error.message}</p>
            )}
            {contentQuery.data?.items?.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
              >
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
        </section>
      </div>
    </main>
  );
}
