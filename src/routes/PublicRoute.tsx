import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../services/login/AuthService";

function PublicRoute() {
  const [destino, setDestino] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    async function verificarUsuario() {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setVerificando(false);
        return;
      }

      try {
        const usuario = await checkAuth(token);

        console.log(usuario);

        if (usuario.tipo === "PILOTO") {
          setDestino("/pilotoDashboard");
        } else if (usuario.tipo === "TORRE") {
          setDestino("/torreDashboard");
        }
      } catch (error) {
        localStorage.removeItem("token");
        setVerificando(false);
      }
    }

    verificarUsuario();
  }, []);

  if (destino) {
    return <Navigate to={destino} replace />;
  }

  if (verificando) {
    return <p>Verificando autenticação...</p>;
  }

  return <Outlet />;
}

export default PublicRoute;