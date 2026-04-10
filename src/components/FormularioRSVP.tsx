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

  // Lê o código da URL automaticamente (?convite=XXXX)
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
        setLoading(false);
        return;
      }

      const conviteDoc = snapshot.docs[0];
      const dados = conviteDoc.data();

      if (dados.usado) {
        setNomeConvite(dados.nomeConvidado);
        setEtapa('jaRespondeu');
        setLoading(false);
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
      // Salva o RSVP na coleção de convidados
      await addDoc(collection(db, 'convidados'), {
        nomeCompleto: nomeConvite,
        confirmado,
        quantidadeAcompanhantes: confirmado ? acompanhantes : 0,
        dataResposta: new Date().toISOString(),
        codigoConvite: codigoInput.trim().toUpperCase(),
      });

      // Marca o convite como usado
      await updateDoc(doc(db, 'convites', conviteId), { usado: true });

      setEtapa('sucesso');
    } catch (err) {
      console.error(err);
      alert('Ops! Deu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Tela: Já respondeu ──────────────────────────────────────
  if (etapa === 'jaRespondeu') {
    return (
      <div className="text-center py-4 space-y-3 animate-fade-in">
        <span className="text-5xl block">💌</span>
        <h3 className="text-xl font-bold text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
          Já recebemos sua resposta!
        </h3>
        <p className="text-rose-800/70 text-sm">
          Olá, <strong>{nomeConvite}</strong>! Este convite já foi utilizado.<br />
          Se precisar alterar sua resposta, entre em contato conosco.
        </p>
      </div>
    );
  }

  // ─── Tela: Sucesso ──────────────────────────────────────────
  if (etapa === 'sucesso') {
    return (
      <div className="text-center py-4 space-y-3 animate-fade-in">
        <span className="text-5xl block">🎉</span>
        <h3 className="text-xl font-bold text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
          {confirmado ? 'Até lá!' : 'Sentiremos sua falta!'}
        </h3>
        <p className="text-rose-800/70 text-sm leading-relaxed">
          {confirmado
            ? `Obrigado, ${nomeConvite}! Estamos ansiosos para celebrar com você.`
            : `Obrigado por avisar, ${nomeConvite}. Estaremos com você em pensamento.`}
        </p>
      </div>
    );
  }

  // ─── Tela: Formulário após código validado ───────────────────
  if (etapa === 'formulario') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full animate-fade-in">
        <div className="text-center pb-1">
          <p className="text-xs text-pink-400 uppercase tracking-widest font-medium mb-1">Convite de</p>
          <h3 className="text-2xl font-bold text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
            {nomeConvite}
          </h3>
        </div>

        {/* Vai ou não vai */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: true, label: 'Sim, estarei lá!', emoji: '✨' },
            { val: false, label: 'Não poderei ir', emoji: '😢' },
          ].map(({ val, label, emoji }) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setConfirmado(val)}
              className={`p-4 rounded-xl border-2 text-sm font-semibold transition flex flex-col items-center gap-1 ${
                confirmado === val
                  ? val
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : 'border-slate-300 bg-slate-50 text-slate-600'
                  : 'border-pink-100 bg-white text-rose-800/60 hover:border-pink-200'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Acompanhantes */}
        {confirmado && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-rose-900 mb-2">
              Quantos acompanhantes? <span className="text-pink-400">(cônjuge / filhos)</span>
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAcompanhantes(Math.max(0, acompanhantes - 1))}
                className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 font-bold text-xl hover:bg-rose-200 transition flex items-center justify-center"
              >
                −
              </button>
              <span className="text-3xl font-bold text-rose-800 w-8 text-center">{acompanhantes}</span>
              <button
                type="button"
                onClick={() => setAcompanhantes(Math.min(5, acompanhantes + 1))}
                className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 font-bold text-xl hover:bg-rose-200 transition flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 rounded-xl shadow-md transition disabled:opacity-70 tracking-wide"
        >
          {loading ? 'Enviando...' : 'Confirmar Resposta'}
        </button>
      </form>
    );
  }

  // ─── Tela: Inserir código ────────────────────────────────────
  return (
    <form onSubmit={validarCodigo} className="flex flex-col gap-5 w-full">
      <div className="text-center pb-1">
        <p className="text-xs text-pink-400 uppercase tracking-widest font-medium mb-2">Você foi convidado</p>
        <h3 className="text-2xl font-bold text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
          Confirme sua Presença
        </h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-900 mb-2">
          Código do Convite
        </label>
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
          className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition bg-rose-50/30 text-center text-xl font-mono tracking-[0.3em] font-bold text-rose-800 uppercase placeholder:text-pink-300 placeholder:tracking-normal placeholder:text-base placeholder:font-sans placeholder:font-normal"
        />
        {erroCodigo && (
          <p className="mt-2 text-xs text-red-500 text-center animate-fade-in">{erroCodigo}</p>
        )}
        <p className="mt-2 text-xs text-pink-400 text-center">
          O código está no seu convite físico ou foi enviado pelo WhatsApp.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 rounded-xl shadow-md transition disabled:opacity-70 tracking-wide"
      >
        {loading ? 'Verificando...' : 'Acessar Convite →'}
      </button>
    </form>
  );
}