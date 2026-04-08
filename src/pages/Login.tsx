import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    setErro('');

    try {
      // Aqui a mágica acontece: tentamos logar no Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Se deu certo, redirecionamos para o painel de controle
      navigate('/admin');
    } catch (error) {
      setErro('E-mail ou senha incorretos. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Acesso Restrito - Noivos 💍</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input 
          type="email" 
          placeholder="Digite seu e-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        
        <input 
          type="password" 
          placeholder="Digite sua senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Entrar no Painel
        </button>
      </form>

      {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
    </div>
  );
}