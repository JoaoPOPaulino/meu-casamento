import { useState } from "react";
import toast from "react-hot-toast";

const cotas = [
  {
    id: 1,
    titulo: "Brinde de Embarque",
    valor: 50,
    emoji: "🥂",
    desc: "Para começarmos a viagem brindando no aeroporto.",
  },
  {
    id: 2,
    titulo: "Café da Manhã na Cama",
    valor: 100,
    emoji: "🥐",
    desc: "Aquele café de hotel que parece coisa de novela.",
  },
  {
    id: 3,
    titulo: "Jantar Romântico",
    valor: 200,
    emoji: "🍷",
    desc: "Um fondue em Bariloche ou frutos do mar em Maragogi.",
  },
  {
    id: 4,
    titulo: "Passeio Turístico",
    valor: 350,
    emoji: "🗺️",
    desc: "Financie nossas aventuras e descobertas pelo mundo.",
  },
  {
    id: 5,
    titulo: "Diária do Hotel",
    valor: 500,
    emoji: "🏨",
    desc: "Para dormirmos com muito conforto e romantismo.",
  },
  {
    id: 6,
    titulo: "Padrinho Diamante",
    valor: 1000,
    emoji: "💎",
    desc: "Para quem quer nos presentear de um jeito inesquecível.",
  },
];

export function ListaPresentes() {
  const [modalAberto, setModalAberto] = useState(false);
  const [cotaSelecionada, setCotaSelecionada] = useState<
    (typeof cotas)[0] | null
  >(null);
  const [copiado, setCopiado] = useState(false);

  const chavePix = "dbb6e571-261e-4f47-9bc7-c7f9bb76cac6";

  const abrirModal = (cota: (typeof cotas)[0]) => {
    setCotaSelecionada(cota);
    setModalAberto(true);
    setCopiado(false);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopiado(false), 2500);
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400;700&display=swap');

        .presentes-secao {
          padding: 5rem 1.5rem;
          background: #fdf8f0;
          background-image:
            radial-gradient(ellipse at 20% 20%, rgba(251, 207, 191, 0.3) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, rgba(249, 168, 212, 0.2) 0%, transparent 55%);
          font-family: 'Lato', sans-serif;
        }

        /* ── Cabeçalho ── */
        .presentes-header {
          text-align: center;
          max-width: 520px;
          margin: 0 auto 3.5rem;
        }

        .presentes-pre {
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c87878;
          margin-bottom: 0.75rem;
        }

        .presentes-titulo {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          color: #7a2d2d;
          line-height: 1.3;
          margin-bottom: 1.5rem;
        }

        .presentes-ornamento {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .presentes-ornamento-linha {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200, 120, 120, 0.4));
        }

        .presentes-ornamento-linha:last-child {
          background: linear-gradient(270deg, transparent, rgba(200, 120, 120, 0.4));
        }

        .presentes-ornamento-sym {
          font-size: 0.65rem;
          color: #c87878;
          letter-spacing: 0.2em;
        }

        .presentes-descricao {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.15rem;
          color: #a06060;
          line-height: 1.8;
        }

        /* ── Lista ── */
        .presentes-lista {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .presentes-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: rgba(255, 252, 248, 0.92);
          border: 1px solid rgba(244, 194, 194, 0.4);
          border-radius: 4px;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: box-shadow 0.2s ease, transform 0.15s ease, border-color 0.2s ease;
          position: relative;
        }

        .presentes-item:hover {
          box-shadow:
            0 4px 16px rgba(200, 100, 100, 0.1),
            0 1px 4px rgba(200, 100, 100, 0.06);
          transform: translateY(-2px);
          border-color: rgba(200, 120, 120, 0.5);
        }

        .presentes-item-emoji {
          font-size: 2rem;
          flex-shrink: 0;
          width: 2.5rem;
          text-align: center;
        }

        .presentes-item-corpo {
          flex: 1;
          min-width: 0;
        }

        .presentes-item-titulo {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          color: #6b2c2c;
          margin-bottom: 0.25rem;
        }

        .presentes-item-desc {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: #a07070;
          line-height: 1.5;
        }

        .presentes-item-direita {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .presentes-item-valor {
          font-family: 'Lato', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #8b3a3a;
          white-space: nowrap;
        }

        .presentes-item-btn {
          background: #8b3a3a;
          color: #fdf2f2;
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s ease;
          white-space: nowrap;
        }

        .presentes-item-btn:hover {
          background: #6f2d2d;
        }

        /* ── Modal overlay ── */
        .presentes-overlay {
          position: fixed;
          inset: 0;
          background: rgba(80, 20, 20, 0.35);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Modal card ── */
        .presentes-modal {
          background: #fffaf7;
          border: 1px solid rgba(244, 194, 194, 0.5);
          border-radius: 4px;
          padding: 2.5rem 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
          position: relative;
          box-shadow:
            0 8px 32px rgba(120, 40, 40, 0.12),
            0 2px 8px rgba(120, 40, 40, 0.08);
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .presentes-modal-fechar {
          position: absolute;
          top: 0.9rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1rem;
          color: #c8a0a0;
          cursor: pointer;
          line-height: 1;
          padding: 0.25rem;
          transition: color 0.15s ease;
        }

        .presentes-modal-fechar:hover {
          color: #8b3a3a;
        }

        .presentes-modal-emoji {
          font-size: 2.8rem;
          display: block;
          margin-bottom: 1rem;
        }

        .presentes-modal-titulo {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.5rem;
          color: #7a2d2d;
          margin-bottom: 0.75rem;
        }

        .presentes-modal-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: #a06060;
          line-height: 1.7;
          margin-bottom: 1.75rem;
        }

        .presentes-modal-sub strong {
          font-family: 'Playfair Display', serif;
          font-style: normal;
          font-size: 1.2rem;
          color: #7a2d2d;
        }

        /* ── PIX box ── */
        .presentes-pix-box {
          background: rgba(244, 194, 194, 0.15);
          border: 1px dashed rgba(200, 120, 120, 0.4);
          border-radius: 3px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
        }

        .presentes-pix-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c87878;
          margin-bottom: 0.4rem;
        }

        .presentes-pix-codigo {
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem;
          color: #8b3a3a;
          word-break: break-all;
          line-height: 1.5;
        }

        /* ── Botão copiar ── */
        .presentes-copiar-btn {
          width: 100%;
          padding: 0.9rem;
          border: none;
          border-radius: 2px;
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .presentes-copiar-btn.normal {
          background: #8b3a3a;
          color: #fdf2f2;
        }

        .presentes-copiar-btn.normal:hover {
          background: #6f2d2d;
          transform: translateY(-1px);
        }

        .presentes-copiar-btn.copiado {
          background: #5a8a5a;
          color: #f0faf0;
        }

        /* ── Responsivo ── */
        @media (max-width: 500px) {
          .presentes-item {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .presentes-item-direita {
            flex-direction: row;
            align-items: center;
            width: 100%;
            justify-content: space-between;
          }

          .presentes-modal {
            padding: 2rem 1.25rem;
          }
        }
      `}</style>

      <div className="presentes-secao">
        {/* Cabeçalho */}
        <div className="presentes-header">
          <p className="presentes-pre">Lista de Presentes</p>
          <h2 className="presentes-titulo">
            Presentes para a Nossa Lua de Mel
          </h2>
          <div className="presentes-ornamento">
            <div className="presentes-ornamento-linha" />
            <span className="presentes-ornamento-sym">✦ ✦ ✦</span>
            <div className="presentes-ornamento-linha" />
          </div>
          <p className="presentes-descricao">
            Sua presença já é o maior presente.
            <br />
            Mas se desejar nos oferecer um mimo,
            <br />
            escolha uma das experiências abaixo.
          </p>
        </div>

        {/* Lista */}
        <div className="presentes-lista">
          {cotas.map((cota) => (
            <div
              key={cota.id}
              className="presentes-item"
              onClick={() => abrirModal(cota)}
            >
              <span className="presentes-item-emoji">{cota.emoji}</span>
              <div className="presentes-item-corpo">
                <p className="presentes-item-titulo">{cota.titulo}</p>
                <p className="presentes-item-desc">{cota.desc}</p>
              </div>
              <div className="presentes-item-direita">
                <span className="presentes-item-valor">{fmt(cota.valor)}</span>
                <button
                  className="presentes-item-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirModal(cota);
                  }}
                >
                  Presentear
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalAberto && cotaSelecionada && (
        <div
          className="presentes-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalAberto(false);
          }}
        >
          <div className="presentes-modal">
            <button
              className="presentes-modal-fechar"
              onClick={() => setModalAberto(false)}
            >
              ✕
            </button>

            <span className="presentes-modal-emoji">
              {cotaSelecionada.emoji}
            </span>
            <h3 className="presentes-modal-titulo">{cotaSelecionada.titulo}</h3>
            <p className="presentes-modal-sub">
              Você está nos presenteando com
              <br />
              <strong>{fmt(cotaSelecionada.valor)}</strong>
            </p>

            <div className="presentes-pix-box">
              <p className="presentes-pix-label">Chave PIX</p>
              <p className="presentes-pix-codigo">{chavePix}</p>
            </div>

            <button
              onClick={copiarPix}
              className={`presentes-copiar-btn ${copiado ? "copiado" : "normal"}`}
            >
              {copiado ? "✓ Chave Copiada!" : "Copiar Chave PIX"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
