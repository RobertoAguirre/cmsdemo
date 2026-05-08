import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function RegisterPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteHint, setInviteHint] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    segment: "saas"
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInviteHint("");
    setLoading(true);
    try {
      const data = await api.submitSignup({
        nombre_completo: form.name.trim(),
        correo_laboral: form.email.trim(),
        empresa_proyecto: form.company.trim(),
        tipo_negocio: form.segment
      });
      setSent(true);
      if (data.inviteSent) {
        setInviteHint("Revisa tu correo: enviamos una invitacion para activar tu acceso.");
      } else if (data.inviteMessage) {
        setInviteHint(data.inviteMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-lg">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Volver al inicio
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-slate-600">
            Tus datos se guardan en tu proyecto Supabase y, si Auth tiene SMTP configurado,
            recibiras una invitacion por correo para entrar al panel.
          </p>

          {sent ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
              <p className="font-semibold">Registro guardado</p>
              <p className="mt-2 text-sm">
                Usamos el correo <strong>{form.email}</strong> para crear tu acceso.
              </p>
              {inviteHint ? (
                <p className="mt-3 text-sm text-emerald-800">{inviteHint}</p>
              ) : (
                <p className="mt-3 text-sm text-emerald-800">
                  Si no llega correo, configura SMTP en Supabase (Authentication → Emails) o revisa
                  spam.
                </p>
              )}
              <Link
                to="/app"
                className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Ir al panel de contenido
              </Link>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              ) : null}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Nombre completo
                </label>
                <input
                  id="name"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Correo laboral
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                  Empresa o proyecto
                </label>
                <input
                  id="company"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="segment" className="block text-sm font-medium text-slate-700">
                  Tipo de negocio
                </label>
                <select
                  id="segment"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.segment}
                  onChange={(e) => setForm((p) => ({ ...p, segment: e.target.value }))}
                >
                  <option value="saas">SaaS / software</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="agency">Agencia</option>
                  <option value="corp">Corporativo</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Registrarme y generar mi cuenta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
