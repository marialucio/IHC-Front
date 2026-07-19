import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Cadastro } from './pages/Cadastro'
import { Catalogo } from './pages/Catalogo'
import { MeusItens } from './pages/MeusItens'
import { Perfil } from './pages/Perfil'
import { Solicitacoes } from './pages/Solicitacoes'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GlobalConfirm } from './components/GlobalConfirm'
import { useApp } from './context/AppContext'

export default function App() {
  const location = useLocation()
  const { hideAlert } = useApp()

  useEffect(() => {
    hideAlert()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <GlobalConfirm />
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Autenticadas */}
        <Route
          path="/catalogo"
          element={
            <ProtectedRoute>
              <Catalogo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meus-itens"
          element={
            <ProtectedRoute>
              <MeusItens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitacoes"
          element={
            <ProtectedRoute>
              <Solicitacoes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
