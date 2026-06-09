import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'

/** Redireciona para o login caso o usuário não esteja autenticado. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
