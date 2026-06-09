import { Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Cadastro } from './pages/Cadastro'
import { Catalogo } from './pages/Catalogo'
import { Perfil } from './pages/Perfil'
import { CadastrarItem } from './pages/CadastrarItem'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
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
        path="/cadastrar-item"
        element={
          <ProtectedRoute>
            <CadastrarItem />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
