import { NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import './Layout.css'

export function Header() {
  const { isAuthenticated } = useApp()
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to={isAuthenticated ? '/catalogo' : '/'} className="header-logo">
          <img src="/assets/logo.png" alt="Trocas USP" />
        </NavLink>

        {isAuthenticated ? (
          <nav className="header-nav">
            <NavLink to="/cadastrar-item" className="header-link">
              Cadastrar item
            </NavLink>
            <NavLink to="/catalogo" className="header-link">
              Catálogo
            </NavLink>
            <NavLink to="/perfil" className="header-link">
              Perfil
            </NavLink>
          </nav>
        ) : (
          <nav className="header-nav">
            <button className="btn btn-outline" onClick={() => navigate('/cadastro')}>
              Cadastrar
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Acessar
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export function Footer() {
  return <footer className="footer" />
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
