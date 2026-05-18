import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useWeddingStore } from '../store/weddingStore';
import type { Convite } from '../types';

const gerarCodigo = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export function GeradorConvites() {
  const { convites, setConvites } = useWeddingStore();

  const [nomeConvidado, setNomeConvidado] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  // Listener do Firebase (mantido aqui pois é específico desta tela)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'convites'), (snapshot) => {
      const lista = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Convite[];

      // Ordena: não usados primeiro
      lista.sort((a, b) => {
        if (a.usado !== b.usado) return a.usado ? 1 : -1;
        return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      });

      setConvites(lista);
    });

    return () => unsub();
  }, [setConvites]);

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
    } finally {
      setLoading(false);
    }
  };

  const excluirConvite = async (id: string, nome: string) => {
    if (!window.confirm(`Excluir convite de "${nome}"?`)) return;

    try {
      await deleteDoc(doc(db, 'convites', id));
    } catch (err) {
      console.error(err);
    }
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
        <h3 className="text-xl font-semibold text-rose-900 mb-5">Gerar Novo Convite</h3>
        <form onSubmit={criarConvite} className="flex gap-3">
          <input
            type="text"
            required
            placeholder="Nome do convidado (ex: Família Silva)"
            value={nomeConvidado}
            onChange={(e) => setNomeConvidado(e.target.value)}
            className="flex-1 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/20 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-rose-500 text-white font-medium px-6 py-3 rounded-xl hover:bg-rose-600 transition disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? 'Gerando...' : '+ Gerar Convite'}
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

        <div className="divide-y divide-pink-50 max-h-96 overflow-y-auto">
          {convites.length === 0 && (
            <p className="p-8 text-center text-pink-400">Nenhum convite gerado ainda.</p>
          )}

          {convites.map((convite) => (
            <div key={convite.id} className="flex items-center gap-3 p-4 hover:bg-rose-50/30 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-rose-900 truncate">{convite.nomeConvidado}</p>
                <code className="text-xs text-purple-600 font-mono tracking-widest">{convite.codigo}</code>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                convite.usado
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {convite.usado ? 'Usado' : 'Pendente'}
              </span>

              <button
                onClick={() => copiarLink(convite.codigo)}
                className={`shrink-0 text-xs font-medium px-4 py-2 rounded-lg transition ${
                  copiado === convite.codigo
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-pink-200'
                }`}
              >
                {copiado === convite.codigo ? '✓ Copiado' : '🔗 Copiar Link'}
              </button>

              <button
                onClick={() => excluirConvite(convite.id, convite.nomeConvidado)}
                className="text-red-400 hover:text-red-600 text-sm px-3 py-2 rounded transition hover:bg-red-50"
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