import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

type Etapa = 'codigo' | 'formulario' | 'sucesso' | 'jaRespondeu';

export function FormularioRSVP() {
  const [etapa, setEtapa] = useState<Etapa>('codigo');
  const [codigoInput, setCodigoInput] = useState('');
  const [erroCodigo, setErroCodigo] = useState('');
  const [conviteId, setConviteId] = useState('');
  const [nomeConvite, setNomeConvite] = useState('');
  const [confirmado, setConfirmado] = useState(true);
  const [acompanhantes, setAcompanhantes] = useState(0);
  const [loading, setLoading] = useState(false);

  // Lê código da URL (?convite=XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigoUrl = params.get('convite');
    if (codigoUrl) {
      setCodigoInput(codigoUrl.toUpperCase());
    }
  }, []);

  const validarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroCodigo('');
    setLoading(true);

    try {
      const codigo = codigoInput.trim().toUpperCase();
      const q = query(collection(db, 'convites'), where('codigo', '==', codigo));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setErroCodigo('Código não encontrado. Verifique e tente novamente.');
        return;
      }

      const conviteDoc = snapshot.docs[0];
      const dados = conviteDoc.data();

      if (dados.usado) {
        setNomeConvite(dados.nomeConvidado);
        setEtapa('jaRespondeu');
        return;
      }

      setConviteId(conviteDoc.id);
      setNomeConvite(dados.nomeConvidado);
      setEtapa('formulario');
    } catch (err) {
      console.error(err);
      setErroCodigo('Erro ao verificar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'convidados'), {
        nomeCompleto: nomeConvite,
        confirmado,
        quantidadeAcompanhantes: confirmado ? acompanhantes : 0,
        dataResposta: new Date().toISOString(),
        codigoConvite: codigoInput.trim().toUpperCase(),
      });

      await updateDoc(doc(db, 'convites', conviteId), { usado: true });

      setEtapa('sucesso');
      toast.success(confirmado ? 'Presença confirmada! 🎉' : 'Resposta registrada.');
    } catch (err) {
      console.error(err);
      toast.error('Ops! Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Tela: Já respondeu
  if (etapa === 'jaRespondeu') {
    return (
      <div className="text-center py-8 space-y-4 animate-fade-in">
        <span className="text-5xl block">💌</span>
        <h3 className="text-2xl font-bold text-rose-700">Já recebemos sua resposta!</h3>
        <p className="text-rose-700/70">
          Olá, <strong>{nomeConvite}</strong>!<br />
          Este convite já foi utilizado.
        </p>
      </div>
    );
  }

  // Tela: Sucesso
  if (etapa === 'sucesso') {
    return (
      <div className="text-center py-8 space-y-4 animate-fade-in">
        <span className="text-5xl block">🎉</span>
        <h3 className="text-2xl font-bold text-rose-700">
          {confirmado ? 'Até lá!' : 'Sentiremos sua falta!'}
        </h3>
        <p className="text-rose-700/70 leading-relaxed">
          {confirmado
            ? `Obrigado, ${nomeConvite}! Estamos ansiosos para celebrar com você.`
            : `Obrigado por avisar, ${nomeConvite}.`}
        </p>
      </div>
    );
  }

  // Tela: Formulário
  if (etapa === 'formulario') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full animate-fade-in">
        <div className="text-center">
          <p className="text-xs text-pink-400 uppercase tracking-widest">Convite de</p>
          <h3 className="text-3xl font-bold text-rose-700 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {nomeConvite}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { val: true, label: 'Sim, estarei lá!', emoji: '✨' },
            { val: false, label: 'Não poderei ir', emoji: '😢' },
          ].map(({ val, label, emoji }) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setConfirmado(val)}
              className={`p-5 rounded-2xl border-2 text-sm font-semibold transition flex flex-col items-center gap-2 ${
                confirmado === val
                  ? val
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-300 bg-slate-50 text-slate-600'
                  : 'border-pink-100 hover:border-pink-200 bg-white'
              }`}
            >
              <span className="text-3xl">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {confirmado && (
          <div>
            <label className="block text-sm font-medium text-rose-900 mb-3">
              Quantos acompanhantes?
            </label>
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setAcompanhantes(Math.max(0, acompanhantes - 1))}
                className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 text-2xl hover:bg-rose-200 transition"
              >
                −
              </button>
              <span className="text-4xl font-bold text-rose-800 w-12 text-center">{acompanhantes}</span>
              <button
                type="button"
                onClick={() => setAcompanhantes(Math.min(6, acompanhantes + 1))}
                className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 text-2xl hover:bg-rose-200 transition"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-4 rounded-2xl transition text-lg"
        >
          {loading ? 'Enviando...' : 'Confirmar Resposta'}
        </button>
      </form>
    );
  }

  // Tela inicial: Inserir código
  return (
    <form onSubmit={validarCodigo} className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <p className="text-xs text-pink-400 uppercase tracking-widest">Você foi convidado</p>
        <h3 className="text-3xl font-bold text-rose-700 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Confirme sua Presença
        </h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-900 mb-2">Código do Convite</label>
        <input
          type="text"
          required
          placeholder="Ex: A3BK9ZR2"
          value={codigoInput}
          onChange={(e) => {
            setCodigoInput(e.target.value.toUpperCase());
            setErroCodigo('');
          }}
          maxLength={8}
          className="w-full p-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-center text-xl font-mono tracking-widest bg-rose-50/50"
        />
        {erroCodigo && <p className="mt-3 text-red-500 text-sm text-center">{erroCodigo}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-4 rounded-2xl transition text-lg"
      >
        {loading ? 'Verificando...' : 'Acessar Convite →'}
      </button>
    </form>
  );
}