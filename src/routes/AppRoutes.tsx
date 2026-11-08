import { Routes, Route, Navigate } from "react-router-dom";

//pages
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PilotoDashboard from "../pages/dashboard/PilotoDashboard/PilotoDashboard";
import TorreDashboard from "../pages/dashboard/TorreDashboard/TorreDashboard";
import PublicRoute from "./PublicRoute";


function AppRoutes(){
  return (
    <Routes>
      <Route element={
        <ProtectedRoute tipoPermitido="PILOTO">
        </ProtectedRoute>}>
        <Route path="/pilotoDashboard" element={<PilotoDashboard></PilotoDashboard>}>
        </Route>
      </Route>

      <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/torreDashboard" element={<TorreDashboard></TorreDashboard>}>
        </Route>
      </Route>


      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Rotas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    
     
  )
}

export default AppRoutes;