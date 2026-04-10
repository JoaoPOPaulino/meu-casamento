import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface ConviteInfo {
  nomeConvidado: string;
  usado: boolean;
}

export function PaginaConvite() {
  const [info, setInfo] = useState<ConviteInfo | null>(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Extrai o código da URL: /convite/A3BK9ZR2
  const codigo = window.location.pathname.split('/convite/')[1]?.toUpperCase();

  useEffect(() => {
    if (!codigo) {
      setErro('Link inválido.');
      setLoading(false);
      return;
    }

    const buscar = async () => {
      try {
        const q = query(collection(db, 'convites'), where('codigo', '==', codigo));
        const snap = await getDocs(q);

        if (snap.empty) {
          setErro('Este convite não foi encontrado.');
          setLoading(false);
          return;
        }

        const dados = snap.docs[0].data();
        setInfo({ nomeConvidado: dados.nomeConvidado, usado: dados.usado });
      } catch (err) {
        setErro('Erro ao carregar convite.');
      } finally {
        setLoading(false);
      }
    };

    buscar();
  }, [codigo]);

  const irParaRSVP = () => {
    navigate(`/?convite=${codigo}`);
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="convite-bg min-h-screen flex items-center justify-center">
        <div className="convite-loader" />
      </div>
    );
  }

  // ── Erro ──────────────────────────────────────────────────
  if (erro || !info) {
    return (
      <div className="convite-bg min-h-screen flex items-center justify-center p-6">
        <div className="convite-card text-center max-w-sm w-full">
          <p className="convite-ornamento">✦</p>
          <h2 className="convite-titulo-erro">Convite não encontrado</h2>
          <p className="convite-subtexto mt-3">{erro || 'Verifique o link e tente novamente.'}</p>
        </div>
      </div>
    );
  }

  // ── Já respondeu ──────────────────────────────────────────
  if (info.usado) {
    return (
      <div className="convite-bg min-h-screen flex items-center justify-center p-6">
        <div className="convite-card text-center max-w-sm w-full">
          <p className="convite-ornamento">💌</p>
          <h2 className="convite-titulo">Já recebemos sua resposta!</h2>
          <p className="convite-subtexto mt-4">
            Obrigado, <em>{info.nomeConvidado}</em>.<br />
            Sua confirmação já foi registrada.
          </p>
        </div>
      </div>
    );
  }

  // ── Convite principal ─────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400;700&display=swap');

        .convite-bg {
          min-height: 100vh;
          background: #fdf8f0;
          background-image:
            radial-gradient(ellipse at 15% 15%, rgba(251, 207, 191, 0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 85%, rgba(249, 168, 212, 0.25) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 50%, rgba(254, 243, 199, 0.3) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Lato', sans-serif;
        }

        .convite-card {
          background: rgba(255, 252, 248, 0.92);
          border: 1px solid rgba(244, 194, 194, 0.4);
          border-radius: 4px;
          padding: 3.5rem 2.5rem 3rem;
          max-width: 480px;
          width: 100%;
          text-align: center;
          position: relative;
          box-shadow:
            0 2px 4px rgba(200, 100, 100, 0.04),
            0 8px 32px rgba(200, 100, 100, 0.07),
            0 32px 80px rgba(200, 100, 100, 0.07);
        }

        /* Borda dupla decorativa */
        .convite-card::before {
          content: '';
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(244, 194, 194, 0.3);
          border-radius: 2px;
          pointer-events: none;
        }

        .convite-linha-topo {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8a0a0, transparent);
          margin: 0 auto 2rem;
        }

        .convite-pre {
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c87878;
          margin-bottom: 1.5rem;
        }

        .convite-nome-casal {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(2.2rem, 7vw, 3rem);
          color: #7a2d2d;
          line-height: 1.2;
          margin-bottom: 0.3rem;
        }

        .convite-e {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.4rem;
          color: #c87878;
          display: block;
          margin: 0.2rem 0;
        }

        .convite-divisor {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.8rem 0;
        }

        .convite-divisor-linha {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200, 120, 120, 0.35));
        }

        .convite-divisor-linha.invertida {
          background: linear-gradient(270deg, transparent, rgba(200, 120, 120, 0.35));
        }

        .convite-divisor-sym {
          font-size: 0.7rem;
          color: #c87878;
          letter-spacing: 0.15em;
        }

        .convite-chamada {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.25rem;
          color: #8a4a4a;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }

        .convite-nome-convidado {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #6b2c2c;
          margin: 0.5rem 0 1.5rem;
        }

        .convite-frase {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: #a06060;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .convite-data-local {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #b07070;
          margin-bottom: 2.5rem;
          line-height: 2;
        }

        .convite-btn {
          display: inline-block;
          background: #8b3a3a;
          color: #fdf2f2;
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          width: 100%;
        }

        .convite-btn:hover {
          background: #6f2d2d;
          transform: translateY(-1px);
        }

        .convite-btn:active {
          transform: translateY(0);
        }

        .convite-rodape {
          margin-top: 2rem;
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c8a0a0;
        }

        .convite-ornamento {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .convite-titulo {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.6rem;
          color: #7a2d2d;
        }

        .convite-titulo-erro {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: #8a4a4a;
        }

        .convite-subtexto {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.1rem;
          color: #a06060;
          line-height: 1.7;
        }

        .convite-loader {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(200, 120, 120, 0.2);
          border-top-color: #c87878;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .convite-card { animation: fadeUp 0.7s ease both; }

        @media (max-width: 480px) {
          .convite-card { padding: 2.5rem 1.5rem 2rem; }
        }
      `}</style>

      <div className="convite-bg">
        <div className="convite-card">
          
          <div className="convite-linha-topo" />

          <p className="convite-pre">Convite de Casamento</p>

          {/* Nome do casal */}
          <h1 className="convite-nome-casal">
            João Pedro
            <span className="convite-e">&amp;</span>
            Geovana
          </h1>

          {/* Divisor ornamental */}
          <div className="convite-divisor">
            <div className="convite-divisor-linha" />
            <span className="convite-divisor-sym">✦ ✦ ✦</span>
            <div className="convite-divisor-linha invertida" />
          </div>

          {/* Chamada personalizada */}
          <p className="convite-chamada">Com imenso amor e alegria,<br />convidamos</p>
          <p className="convite-nome-convidado">{info.nomeConvidado}</p>

          <p className="convite-frase">
            para celebrar conosco<br />
            o início da nossa mais bela história.<br />
            Sua presença tornará este dia<br />
            ainda mais especial.
          </p>

          {/* Data e local — personalize */}
          <p className="convite-data-local">
            12 de Dezembro de 2026<br />
            Palmas · Tocantins
          </p>

          <button className="convite-btn" onClick={irParaRSVP}>
            Confirmar Presença
          </button>

          <p className="convite-rodape">
            João Pedro &amp; Geovana · 2026
          </p>

        </div>
      </div>
    </>
  );
}