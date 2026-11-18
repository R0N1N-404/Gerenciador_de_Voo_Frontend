import { Routes, Route, Navigate } from "react-router-dom";

//pages
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PilotoDashboard from "../pages/dashboard/PilotoDashboard/PilotoDashboard";
import TorreDashboard from "../pages/dashboard/TorreDashboard/TorreDashboard";
import PublicRoute from "./PublicRoute";
import CreateRequest from "../pages/piloto/CreateRequisicao";
import PilotoList from "../pages/piloto/PilotoList";
import PilotoCreate from "../pages/piloto/pilotoCreate";
import PilotoEdit from "../pages/piloto/editarPiloto";
import AeronaveList from "../pages/aeronaves/AeronaveList";
import AeronaveCreate from "../pages/aeronaves/AeronaveCreate";
import AeronaveEdit from "../pages/aeronaves/AeronaveEdit";


function AppRoutes(){
  return (
    <Routes>
      <Route element={
        <ProtectedRoute tipoPermitido="PILOTO">
        </ProtectedRoute>}>
        <Route path="/pilotoDashboard" element={<PilotoDashboard></PilotoDashboard>}>
        </Route>
      </Route>

      <Route
          element={<ProtectedRoute tipoPermitido="PILOTO" />}
        >
          <Route
            path="/requisicao/create"
            element={<CreateRequest />}
          />
        </Route>

      <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/torreDashboard" element={<TorreDashboard></TorreDashboard>}>
        </Route>
      </Route>

      <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/pilotos" element={<PilotoList></PilotoList>}>
        </Route>
      </Route>

        <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/piloto/criar" element={<PilotoCreate></PilotoCreate>}>
        </Route>
      </Route>

      <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/aeronaves/" element={<AeronaveList></AeronaveList>}>
        </Route>
      </Route>

       <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/aeronave/criar" element={<AeronaveCreate></AeronaveCreate>}>
        </Route>
      </Route>

       <Route element={
        <ProtectedRoute tipoPermitido="TORRE">
        </ProtectedRoute>}>
        <Route path="/aeronave/editar/:id" element={<AeronaveEdit></AeronaveEdit>}>
        </Route>
      </Route>

      <Route element={<ProtectedRoute tipoPermitido="TORRE" />}>
    <Route
      path="/piloto/editar/:id"
      element={<PilotoEdit/>}
    />
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