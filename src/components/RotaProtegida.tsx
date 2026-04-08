import { Navigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import type { JSX } from 'react';

// O "children" é a tela que estamos tentando proteger (ex: o Dashboard)
export function RotaProtegida({ children }: { children: JSX.Element }) {
  // Verificamos se o Firebase tem uma sessão ativa salva no navegador
  const usuarioLogado = auth.currentUser;

  if (!usuarioLogado) {
    // Se não tiver ninguém logado, redireciona para a tela de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver tudo certo, renderiza a tela normalmente
  return children;
}