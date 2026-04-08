import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function FormularioRSVP() {
  // Estados para guardar o que o usuário digita
  const [nome, setNome] = useState('');
  const [confirmado, setConfirmado] = useState(true);
  const [acompanhantes, setAcompanhantes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Apontamos para a coleção 'convidados' no banco de dados
      const convidadosRef = collection(db, 'convidados');
      
      // Enviamos o documento (JSON) para o Firestore
      await addDoc(convidadosRef, {
        nomeCompleto: nome,
        confirmado: confirmado,
        quantidadeAcompanhantes: acompanhantes,
        dataResposta: new Date().toISOString()
      });

      setSucesso(true);
      setNome(''); // Limpa o formulário
      setAcompanhantes(0);
    } catch (error) {
      console.error("Erro ao salvar convidado: ", error);
      alert("Ops! Deu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return <div style={{ color: 'green', marginTop: '20px' }}>Obrigado! Sua resposta foi registrada com sucesso. 🎉</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
      <h3>Confirme sua Presença</h3>
      
      <div>
        <label>Nome e Sobrenome:</label><br/>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div>
        <label>Você vai comparecer?</label><br/>
        <select 
          value={confirmado ? 'sim' : 'nao'} 
          onChange={(e) => setConfirmado(e.target.value === 'sim')}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="sim">Sim, estarei lá!</option>
          <option value="nao">Não poderei ir :(</option>
        </select>
      </div>

      {/* Só mostra a opção de acompanhantes se a pessoa confirmou que vai */}
      {confirmado && (
        <div>
          <label>Quantos acompanhantes extras? (Cônjuge/Filhos)</label><br/>
          <input 
            type="number" 
            min="0" 
            max="5"
            value={acompanhantes} 
            onChange={(e) => setAcompanhantes(Number(e.target.value))} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      )}

      <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
        {loading ? 'Enviando...' : 'Enviar Resposta'}
      </button>
    </form>
  );
}