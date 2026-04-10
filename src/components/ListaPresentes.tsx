import { useState } from 'react';

const cotas = [
  { id: 1, titulo: 'Brinde de Embarque', valor: 50,   emoji: '🥂', desc: 'Para começarmos a viagem brindando no aeroporto.' },
  { id: 2, titulo: 'Café da Manhã na Cama', valor: 100, emoji: '🥐', desc: 'Aquele café de hotel que parece coisa de novela.' },
  { id: 3, titulo: 'Jantar Romântico',   valor: 200, emoji: '🍷', desc: 'Um fondue em Bariloche ou frutos do mar em Maragogi.' },
  { id: 4, titulo: 'Passeio Turístico',  valor: 350, emoji: '🗺️', desc: 'Financie nossas aventuras e descobertas pelo mundo.' },
  { id: 5, titulo: 'Diária do Hotel',    valor: 500, emoji: '🏨', desc: 'Para dormirmos com muito conforto e romantismo.' },
  { id: 6, titulo: 'Padrinho Diamante',  valor: 1000, emoji: '💎', desc: 'Para quem quer nos presentear de um jeito inesquecível.' },
];

export function ListaPresentes() {
  const [modalAberto, setModalAberto] = useState(false);
  const [cotaSelecionada, setCotaSelecionada] = useState<typeof cotas[0] | null>(null);
  const [copiado, setCopiado] = useState(false);

  const chavePix = "dbb6e571-261e-4f47-9bc7-c7f9bb76cac6";

  const abrirModal = (cota: typeof cotas[0]) => {
    setCotaSelecionada(cota);
    setModalAberto(true);
    setCopiado(false);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400;700&display=swap');

        .presentes-secao {
          width: 100%;
          max-width: 640px;
          font-family: 'Lato', sans-serif;
        }

        .presentes-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .presentes-pre {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c87878;
          margin-bottom: 0.75rem;
        }

        .presentes-titulo {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 2.2rem;
          color: #7a2d2d;
          margin-bottom: 1rem;
        }

        .presentes-descricao {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: #a06060;
          line-height: 1.8;
          max-width: 420px;
          margin: 0 auto;
        }

        /* Linha decorativa com flor */
        .presentes-ornamento {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem auto 2.5rem;
          max-width: 280px;
        }
        .presentes-ornamento-linha {
          flex: 1;
          height: 1px;
          background: rgba(200, 120, 120, 0.3);
        }
        .presentes-ornamento-sym {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #c87878;
        }

        /* Lista estilo cardápio / papelaria */
        .presentes-lista {
          width: 100%;
          border: 1px solid rgba(200, 120, 120, 0.25);
          border-radius: 2px;
          background: rgba(255, 252, 248, 0.95);
          overflow: hidden;
          box-shadow: 0 4px 30px rgba(160, 80, 80, 0.06);
          position: relative;
        }

        /* Borda dupla interna */
        .presentes-lista::before {
          content: '';
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(200, 120, 120, 0.15);
          border-radius: 1px;
          pointer-events: none;
          z-index: 0;
        }

        .presentes-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid rgba(200, 120, 120, 0.12);
          transition: background 0.15s ease;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }

        .presentes-item:last-child {
          border-bottom: none;
        }

        .presentes-item:hover {
          background: rgba(253, 240, 240, 0.6);
        }

        .presentes-item:hover .presentes-item-btn {
          opacity: 1;
          transform: translateX(0);
        }

        .presentes-item-emoji {
          font-size: 1.4rem;
          width: 2rem;
          text-align: center;
          flex-shrink: 0;
        }

        .presentes-item-corpo {
          flex: 1;
          min-width: 0;
        }

        .presentes-item-titulo {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          color: #6b2c2c;
          margin-bottom: 0.1rem;
        }

        .presentes-item-desc {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.9rem;
          color: #b08080;
          line-height: 1.4;
        }

        .presentes-item-direita {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .presentes-item-valor {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #8b3a3a;
          font-weight: 400;
          white-space: nowrap;
        }

        .presentes-item-btn {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c87878;
          border: 1px solid rgba(200, 120, 120, 0.4);
          padding: 0.25rem 0.65rem;
          border-radius: 1px;
          background: transparent;
          transition: all 0.15s ease;
          opacity: 0.7;
          transform: translateX(4px);
          cursor: pointer;
          white-space: nowrap;
        }

        .presentes-item:hover .presentes-item-btn {
          color: #8b3a3a;
          border-color: #c87878;
          background: rgba(200, 120, 120, 0.06);
        }

        /* Modal */
        .presentes-overlay {
          position: fixed;
          inset: 0;
          background: rgba(60, 20, 20, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        .presentes-modal {
          background: #fdf8f0;
          border: 1px solid rgba(200, 120, 120, 0.3);
          border-radius: 2px;
          padding: 2.5rem 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
          position: relative;
          animation: slideUp 0.25s ease both;
          box-shadow: 0 20px 60px rgba(100, 30, 30, 0.15);
        }

        .presentes-modal::before {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1px solid rgba(200, 120, 120, 0.18);
          border-radius: 1px;
          pointer-events: none;
        }

        .presentes-modal-fechar {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          color: #c8a0a0;
          font-size: 1.2rem;
          background: none;
          border: none;
          cursor: pointer;
          line-height: 1;
          transition: color 0.15s;
          z-index: 1;
        }

        .presentes-modal-fechar:hover { color: #8b3a3a; }

        .presentes-modal-emoji {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .presentes-modal-titulo {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.5rem;
          color: #7a2d2d;
          margin-bottom: 0.5rem;
        }

        .presentes-modal-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          color: #a06060;
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }

        .presentes-modal-sub strong {
          color: #8b3a3a;
          font-weight: 400;
        }

        .presentes-pix-box {
          background: rgba(255, 245, 245, 0.8);
          border: 1px solid rgba(200, 120, 120, 0.25);
          border-radius: 2px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
          text-align: left;
        }

        .presentes-pix-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c87878;
          margin-bottom: 0.5rem;
        }

        .presentes-pix-codigo {
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          color: #6b2c2c;
          word-break: break-all;
          line-height: 1.5;
        }

        .presentes-copiar-btn {
          width: 100%;
          padding: 0.9rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .presentes-copiar-btn.normal {
          background: #8b3a3a;
          color: #fdf2f2;
        }

        .presentes-copiar-btn.normal:hover {
          background: #6f2d2d;
        }

        .presentes-copiar-btn.copiado {
          background: #4a7c59;
          color: #f0faf4;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .presentes-item { padding: 1rem 1.25rem; gap: 0.75rem; }
          .presentes-item-emoji { font-size: 1.2rem; }
          .presentes-item-btn { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="presentes-secao">
        {/* Cabeçalho */}
        <div className="presentes-header">
          <p className="presentes-pre">Lista de Presentes</p>
          <h2 className="presentes-titulo">Presentes para a Nossa Lua de Mel</h2>
          <div className="presentes-ornamento">
            <div className="presentes-ornamento-linha" />
            <span className="presentes-ornamento-sym">✦ ✦ ✦</span>
            <div className="presentes-ornamento-linha" />
          </div>
          <p className="presentes-descricao">
            Sua presença já é o maior presente.<br />
            Mas se desejar nos oferecer um mimo,<br />
            escolha uma das experiências abaixo.
          </p>
        </div>

        {/* Lista estilo cardápio */}
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
                  onClick={(e) => { e.stopPropagation(); abrirModal(cota); }}
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
          onClick={(e) => { if (e.target === e.currentTarget) setModalAberto(false); }}
        >
          <div className="presentes-modal">
            <button className="presentes-modal-fechar" onClick={() => setModalAberto(false)}>✕</button>

            <span className="presentes-modal-emoji">{cotaSelecionada.emoji}</span>
            <h3 className="presentes-modal-titulo">{cotaSelecionada.titulo}</h3>
            <p className="presentes-modal-sub">
              Você está nos presenteando com<br />
              <strong>{fmt(cotaSelecionada.valor)}</strong>
            </p>

            <div className="presentes-pix-box">
              <p className="presentes-pix-label">Chave PIX</p>
              <p className="presentes-pix-codigo">{chavePix}</p>
            </div>

            <button
              onClick={copiarPix}
              className={`presentes-copiar-btn ${copiado ? 'copiado' : 'normal'}`}
            >
              {copiado ? '✓ Chave Copiada!' : 'Copiar Chave PIX'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}