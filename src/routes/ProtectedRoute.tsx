import { useEffect, useState } from "react";
import {Navigate, Outlet} from "react-router-dom";

import { checkAuth } from "../services/login/AuthService";

interface ProtectedRouteProps {
  tipoPermitido: "PILOTO" | "TORRE";
}

export default function ProtectedRoute({tipoPermitido}: ProtectedRouteProps){
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  useEffect(() => {
    async function verificaAcesso() {
      const token = localStorage.getItem("token");

      if(!token){
        setAutorizado(false);
        return;
      }

      try{
        const usuario = await checkAuth(token);

        setAutorizado(usuario.tipo === tipoPermitido);
      }catch{
        localStorage.removeItem("token");
        setAutorizado(false);
      }
    }

    verificaAcesso();

  }, [tipoPermitido]);

  if(autorizado === null){
    return <p>Verificando acesso...</p>;
  }

  if(autorizado === false){
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;

}


