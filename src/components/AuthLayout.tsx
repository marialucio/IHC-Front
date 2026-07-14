import type { ReactNode } from 'react'
import { GlobalAlert } from './GlobalAlert'
import { Footer } from './Layout'
import './AuthLayout.css'

/**
 * Layout das telas de Login (Frame 4) e Cadastro (Frame 3).
 * Painel de fundo grande ("fundo") + card branco centralizado.
 * Sem header de navegação, conforme o protótipo.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <GlobalAlert />
      <div className="auth-stage">
        <div className="auth-fundo">
          <div className="auth-fundo__inner">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
