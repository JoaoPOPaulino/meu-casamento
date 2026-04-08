import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function FormularioRSVP() {
  const [nome, setNome] = useState('');
  const [confirmado, setConfirmado] = useState(true);
  const [acompanhantes, setAcompanhantes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const convidadosRef = collection(db, 'convidados');
      await addDoc(convidadosRef, {
        nomeCompleto: nome,
        confirmado: confirmado,
        quantidadeAcompanhantes: acompanhantes,
        dataResposta: new Date().toISOString()
      });

      setSucesso(true);
      setNome('');
      setAcompanhantes(0);
    } catch (error) {
      console.error("Erro ao salvar convidado: ", error);
      alert("Ops! Deu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Obrigado! 🎉</h3>
        <p>Sua resposta foi registrada com sucesso.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <h3 className="text-2xl font-semibold text-rose-600 mb-2 text-center">Confirme sua Presença</h3>
      
      <div>
        <label className="block text-sm font-medium text-rose-900 mb-1">Nome e Sobrenome</label>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
          placeholder="Digite seu nome completo"
          className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-rose-50/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-rose-900 mb-1">Você vai comparecer?</label>
        <select 
          value={confirmado ? 'sim' : 'nao'} 
          onChange={(e) => setConfirmado(e.target.value === 'sim')}
          className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-rose-50/30"
        >
          <option value="sim">Sim, estarei lá! ✨</option>
          <option value="nao">Não poderei ir :(</option>
        </select>
      </div>

      {confirmado && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-rose-900 mb-1">Quantos acompanhantes extras? (Cônjuge/Filhos)</label>
          <input 
            type="number" 
            min="0" 
            max="5"
            value={acompanhantes} 
            onChange={(e) => setAcompanhantes(Number(e.target.value))} 
            className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-rose-50/30"
          />
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading} 
        className="mt-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-lg shadow-md transition disabled:opacity-70"
      >
        {loading ? 'Enviando...' : 'Enviar Resposta'}
      </button>
    </form>
  );
}