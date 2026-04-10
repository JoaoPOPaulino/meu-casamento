import { useState } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useEffect } from 'react';

interface Convite {
  id: string;
  codigo: string;
  nomeConvidado: string;
  usado: boolean;
  criadoEm: string;
}

// Gera um código alfanumérico único de 8 caracteres
const gerarCodigo = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export function GeradorConvites() {
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'convites'), (snapshot) => {
      const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Convite[];
      // Ordena: não usados primeiro, depois por data
      lista.sort((a, b) => {
        if (a.usado !== b.usado) return a.usado ? 1 : -1;
        return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      });
      setConvites(lista);
    });
    return () => unsub();
  }, []);

  const criarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeConvidado.trim()) return;
    setLoading(true);

    try {
      const codigo = gerarCodigo();
      await addDoc(collection(db, 'convites'), {
        codigo,
        nomeConvidado: nomeConvidado.trim(),
        usado: false,
        criadoEm: new Date().toISOString(),
      });
      setNomeConvidado('');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar convite.');
    } finally {
      setLoading(false);
    }
  };

  const excluirConvite = async (id: string, nome: string) => {
    if (!window.confirm(`Excluir convite de "${nome}"?`)) return;
    await deleteDoc(doc(db, 'convites', id));
  };

  const copiarLink = (codigo: string) => {
    const url = `${window.location.origin}/convite/${codigo}`;
    navigator.clipboard.writeText(url);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Formulário de criação */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
        <h3 className="text-xl font-semibold text-rose-900 mb-5">Gerar Convite com Código</h3>
        <form onSubmit={criarConvite} className="flex gap-3">
          <input
            type="text"
            required
            placeholder="Nome do convidado (ex: Família Silva)"
            value={nomeConvidado}
            onChange={(e) => setNomeConvidado(e.target.value)}
            className="flex-1 p-2.5 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/20 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-rose-500 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-rose-600 transition shadow-sm disabled:opacity-70 whitespace-nowrap text-sm"
          >
            {loading ? 'Gerando...' : '+ Gerar'}
          </button>
        </form>
      </div>

      {/* Lista de convites */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="bg-rose-50/50 border-b border-pink-100 px-4 py-3 flex justify-between items-center">
          <h4 className="font-semibold text-rose-800 text-sm uppercase tracking-wide">Convites Gerados</h4>
          <span className="text-xs text-pink-400">
            {convites.filter(c => c.usado).length}/{convites.length} utilizados
          </span>
        </div>

        <div className="divide-y divide-pink-50 max-h-80 overflow-y-auto">
          {convites.length === 0 && (
            <p className="p-6 text-center text-pink-400 text-sm">Nenhum convite gerado ainda.</p>
          )}
          {convites.map((convite) => (
            <div key={convite.id} className="flex items-center gap-3 p-4 hover:bg-rose-50/30 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-rose-900 truncate">{convite.nomeConvidado}</p>
                <code className="text-xs text-purple-500 font-mono tracking-widest">{convite.codigo}</code>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                convite.usado
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {convite.usado ? 'Usado' : 'Pendente'}
              </span>
              <button
                onClick={() => copiarLink(convite.codigo)}
                title="Copiar link do convite"
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                  copiado === convite.codigo
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-pink-200'
                }`}
              >
                {copiado === convite.codigo ? '✓ Copiado' : '🔗 Link'}
              </button>
              <button
                onClick={() => excluirConvite(convite.id, convite.nomeConvidado)}
                className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded transition bg-red-50 hover:bg-red-100 shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}