import { useState } from 'react';

// Dados das cotas (Fica no front-end mesmo, não precisamos do banco para isso)
const cotas = [
  { id: 1, titulo: 'Brinde de embarque', valor: 50, emoji: '🥂', desc: 'Para começarmos a viagem brindando no aeroporto!' },
  { id: 2, titulo: 'Café da manhã na cama', valor: 100, emoji: '🥐', desc: 'Aquele café de hotel padrão novela.' },
  { id: 3, titulo: 'Jantar Romântico', valor: 200, emoji: '🍷', desc: 'Para um fondue em Bariloche ou frutos do mar em Maragogi.' },
  { id: 4, titulo: 'Passeio Turístico', valor: 350, emoji: '🗺️', desc: 'Ajude a financiar nossas aventuras e passeios.' },
  { id: 5, titulo: 'Diária do Hotel', valor: 500, emoji: '🏨', desc: 'Para dormirmos com muito conforto.' },
  { id: 6, titulo: 'Cota "Padrinho Rico"', valor: 1000, emoji: '💎', desc: 'Para quem quer nos mimar de verdade!' },
];

export function ListaPresentes() {
  const [modalAberto, setModalAberto] = useState(false);
  const [cotaSelecionada, setCotaSelecionada] = useState<typeof cotas[0] | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Coloque a sua chave PIX real aqui
  const chavePix = "dbb6e571-261e-4f47-9bc7-c7f9bb76cac6"; 

  const abrirModal = (cota: typeof cotas[0]) => {
    setCotaSelecionada(cota);
    setModalAberto(true);
    setCopiado(false); // Reseta o botão de copiar
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    // Volta o texto do botão ao normal após 3 segundos
    setTimeout(() => setCopiado(false), 3000); 
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="w-full mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-rose-600 font-serif mb-3">Lista de Presentes 🎁</h2>
        <p className="text-rose-800/80 max-w-2xl mx-auto">
          Nosso maior presente é a sua presença! Mas, se desejar nos presentear, 
          criamos algumas cotas simbólicas para nos ajudar a realizar a lua de mel dos nossos sonhos.
        </p>
      </div>

      {/* Grid de Cotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cotas.map((cota) => (
          <div key={cota.id} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center text-center hover:shadow-md transition">
            <span className="text-5xl mb-4">{cota.emoji}</span>
            <h3 className="text-xl font-bold text-rose-900 mb-2">{cota.titulo}</h3>
            <p className="text-sm text-pink-400 mb-4 flex-grow">{cota.desc}</p>
            <p className="text-2xl font-bold text-purple-500 mb-4">{formatarMoeda(cota.valor)}</p>
            <button 
              onClick={() => abrirModal(cota)}
              className="w-full bg-rose-50 text-rose-600 font-semibold py-2 rounded-lg border border-pink-200 hover:bg-rose-500 hover:text-white transition"
            >
              Presentear
            </button>
          </div>
        ))}
      </div>

      {/* O Modal (Fica escondido até o modalAberto ser true) */}
      {modalAberto && cotaSelecionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in border border-pink-100">
            
            {/* Botão de Fechar */}
            <button 
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-pink-300 hover:text-rose-500 transition text-2xl font-bold"
            >
              &times;
            </button>

            <div className="text-center">
              <span className="text-6xl mb-4 block">{cotaSelecionada.emoji}</span>
              <h3 className="text-2xl font-bold text-rose-900 mb-2">{cotaSelecionada.titulo}</h3>
              <p className="text-rose-800/80 mb-6">Você está nos presenteando com o valor de <strong className="text-purple-500">{formatarMoeda(cotaSelecionada.valor)}</strong>.</p>
              
              <div className="bg-rose-50 p-4 rounded-xl border border-pink-200 mb-6">
                <p className="text-sm text-rose-600 font-semibold mb-2 uppercase tracking-wide">Nossa Chave PIX</p>
                <code className="block bg-white p-3 rounded-lg text-slate-700 font-mono text-sm border border-pink-100 break-all">
                  {chavePix}
                </code>
              </div>

              <button 
                onClick={copiarPix}
                className={`w-full font-bold py-3 rounded-xl transition shadow-md ${
                  copiado 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {copiado ? '✓ Chave Copiada!' : '📋 Copiar Chave PIX'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}