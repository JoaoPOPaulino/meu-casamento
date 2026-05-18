import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import type { JSX } from "react";

export function RotaProtegida({ children }: { children: JSX.Element }) {
  const [usuario, setUsuario] = useState<null | false | object>(null);
  // null = ainda carregando, false = não logado, object = logado

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user ?? false);
    });
    return unsub;
  }, []);

  // Ainda verificando sessão — não redireciona ainda
  if (usuario === null) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-rose-400 text-sm">Verificando acesso...</p>
      </div>
    );
  }

  // Sessão confirmada como inativa
  if (usuario === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
