import { FormularioRSVP } from '../components/FormularioRSVP';
import { ListaPresentes } from '../components/ListaPresentes';

export function Home() {
  return (
    <div
      className="min-h-screen py-16 px-4 md:px-8"
      style={{
        background: 'linear-gradient(160deg, #fff5f7 0%, #fef9ec 50%, #fff0f5 100%)',
        fontFamily: "'Lora', serif",
      }}
    >
      {/* Decoração de fundo sutil */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(251,207,232,0.25) 0%, transparent 50%),
                            radial-gradient(circle at 90% 80%, rgba(253,230,138,0.2) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-5xl mx-auto flex flex-col items-center relative">

        {/* ── Cabeçalho ────────────────────────────────── */}
        <header className="text-center mb-14 max-w-2xl">
          {/* Ornamento floral */}
          <p className="text-rose-300 text-3xl mb-4 tracking-[0.5em]">✦ ✦ ✦</p>

          <p
            className="text-xs uppercase tracking-[0.35em] text-rose-400/80 font-medium mb-4"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Celebração de Casamento
          </p>

          <h1
            className="text-5xl md:text-7xl text-rose-700 leading-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            João Pedro
            <span className="block text-rose-300 text-4xl md:text-5xl font-normal not-italic my-1">
              &amp;
            </span>
            Geovana
          </h1>

          {/* Data e local — personalize abaixo */}
          <p
            className="text-rose-600/70 text-sm md:text-base tracking-widest uppercase mt-4"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {/* Troque pela data e local reais */}
            12 de Dezembro de 2026 · Palmas, TO
          </p>

          <div className="w-24 h-px bg-rose-200 mx-auto mt-6" />
        </header>

        {/* ── Card do RSVP ─────────────────────────────── */}
        <div
          className="w-full max-w-md mb-16"
          style={{ filter: 'drop-shadow(0 20px 60px rgba(244,114,182,0.15))' }}
        >
          <div
            className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-rose-100 relative overflow-hidden"
          >
            {/* Detalhe decorativo no canto */}
            <div
              aria-hidden
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, #fda4af, transparent)' }}
            />
            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #f9a8d4, transparent)' }}
            />

            <FormularioRSVP />
          </div>
        </div>

        {/* ── Divisória ornamental ──────────────────────── */}
        <div className="flex items-center gap-4 w-full max-w-3xl mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-200 to-rose-200" />
          <span className="text-rose-300 text-xl">❧</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-200 to-rose-200" />
        </div>

        {/* ── Lista de Presentes ────────────────────────── */}
        <ListaPresentes />

        {/* ── Rodapé ───────────────────────────────────── */}
        <footer className="mt-20 text-center">
          <p className="text-rose-300 text-2xl tracking-[0.5em]">✦ ✦ ✦</p>
          <p
            className="text-rose-400/60 text-xs mt-3 uppercase tracking-widest"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Com amor, João Pedro &amp; Geovana
          </p>
        </footer>
      </div>
    </div>
  );
}