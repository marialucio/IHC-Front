import { NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { GlobalAlert } from './GlobalAlert'
import { CatalogIcon, MyItemsIcon, ProfileIcon, SwapIcon } from './icons'
import './Layout.css'

export function Header() {
  const { isAuthenticated } = useApp()
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to={isAuthenticated ? '/catalogo' : '/'} className="header-logo">
          <img src="/assets/logo.png" alt="Trocas USP" />
          <span className="header-logo__text">Trocas USP</span>
        </NavLink>

        {isAuthenticated ? (
          <nav className="header-nav">
            <NavLink to="/catalogo" className="header-link">
              <CatalogIcon className="header-link__icon" />
              <span className="header-link__label">Catálogo</span>
            </NavLink>
            <span className="header-divider" aria-hidden="true" />
            <NavLink to="/meus-itens" className="header-link">
              <MyItemsIcon className="header-link__icon" />
              <span className="header-link__label">Meus itens</span>
            </NavLink>
            <NavLink to="/solicitacoes" className="header-link">
              <SwapIcon className="header-link__icon" />
              <span className="header-link__label">Solicitações</span>
            </NavLink>
            <NavLink to="/perfil" className="header-link">
              <ProfileIcon className="header-link__icon" />
              <span className="header-link__label">Perfil</span>
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
  return <footer className="footer">&copy; Trocas USP - Todos os direitos reservados</footer>
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <GlobalAlert />
      <Header />
      {children}
      <Footer />
    </div>
  )
}
