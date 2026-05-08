import { Link } from "react-router-dom";

const stats = [
  { value: "2.400+", label: "Equipos en Mexico y LATAM (demo)" },
  { value: "18M+", label: "Impresiones de contenido / mes (ficticio)" },
  { value: "99.97%", label: "Disponibilidad declarada en SLA enterprise (demo)" }
];

const features = [
  {
    title: "Multi-tenant listo para SaaS",
    text: "Cada cliente con su espacio aislado, roles y permisos sin compartir datos."
  },
  {
    title: "Editorial moderno",
    text: "Borradores, revision y publicacion con SEO por pieza y vista previa rapida."
  },
  {
    title: "API primero",
    text: "Conecta web, app y canales desde un mismo contenido composable."
  },
  {
    title: "Pensado para Mexico",
    text: "Rendimiento movil, localizacion y checklist para negocios omnicanal."
  }
];

const testimonials = [
  {
    quote:
      "Pasamos de hojas de calculo a un flujo real de contenido en tres semanas. Los numeros son ilustrativos.",
    author: "Mariana V.",
    role: "Directora de marketing · Retail ficticio"
  },
  {
    quote:
      "La curva de aprendizaje fue baja para el equipo comercial. Recomendado si vendes como SaaS.",
    author: "Luis G.",
    role: "CTO · Agencia demo"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">Nimbus CMS</span>
          <nav className="flex items-center gap-3 text-sm">
            <a href="#planes" className="hidden text-slate-600 hover:text-slate-900 sm:inline">
              Planes
            </a>
            <Link
              to="/registro"
              className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white shadow-sm hover:bg-slate-800"
            >
              Crear cuenta gratis
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20">
        <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          Nuevo · Programa early access Mexico 2026
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          El CMS para equipos que facturan como SaaS, sin friccion operativa.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Centraliza paginas, blog, landings y catalogo ligero. Publica mas rapido, con
          gobernanza clara y listo para crecer con tus clientes. Los datos de promocion en esta
          pagina son <strong className="font-medium text-slate-800">ficticios</strong> para
          demostracion.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/registro"
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
          >
            Registrarme y empezar
          </Link>
          <a
            href="#demo"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Ver demo guiada (pronto)
          </a>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Todo lo que venden los CMS top, sin el peso</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Inspirado en plataformas lideres del mercado, enfocado en equipos que operan varios
          tenants y necesitan claridad editorial.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold md:text-3xl">Lo que dicen equipos como el tuyo</h2>
          <p className="mt-2 text-slate-300">Testimonios de ejemplo para la landing.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6"
              >
                <p className="text-slate-100">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm text-slate-400">
                  <cite className="not-italic font-medium text-slate-300">{t.author}</cite>
                  <span className="block text-slate-500">{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="planes" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Planes que escalan contigo</h2>
        <p className="mt-2 text-slate-600">
          Precios ilustrativos. Ajustamos facturacion en MXN y add-ons locales cuando entres en
          produccion.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { name: "Starter", price: "$499 MXN", note: "/mes por sitio · demo" },
            { name: "Growth", price: "$1.299 MXN", note: "/mes multi-sitio · demo", highlight: true },
            { name: "Scale", price: "Hablemos", note: "SLA y soporte dedicado · demo" }
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="mt-4 text-3xl font-bold">{plan.price}</p>
              <p className="text-sm text-slate-600">{plan.note}</p>
              <Link
                to="/registro"
                className={`mt-6 block w-full rounded-full py-2.5 text-center text-sm font-semibold ${
                  plan.highlight
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "border border-slate-300 bg-white hover:bg-slate-50"
                }`}
              >
                Elegir {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-12 text-center text-white shadow-xl md:px-16">
          <h2 className="text-2xl font-bold md:text-3xl">Listo para tu primer tenant</h2>
          <p className="mx-auto mt-3 max-w-xl text-emerald-50">
            Registrate y te guiaremos para crear tu cuenta, invitar a tu equipo y publicar tu
            primer contenido en minutos.
          </p>
          <Link
            to="/registro"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-emerald-800 shadow-lg hover:bg-emerald-50"
          >
            Crear mi cuenta en Nimbus CMS
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>Nimbus CMS · Datos promocionales ficticios · Mexico 2026</p>
        <Link to="/app" className="mt-2 inline-block text-slate-700 underline hover:text-slate-900">
          Ir al panel (existentes)
        </Link>
      </footer>
    </div>
  );
}
