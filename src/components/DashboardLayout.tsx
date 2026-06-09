import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from './Layout'
import { LogoutIcon, PencilIcon } from './icons'
import { useApp } from '../context/AppContext'
import './DashboardLayout.css'

/**
 * Layout das telas internas do perfil (Frames 2, 6 e 7 do Figma).
 * Painel fixo de dados à esquerda + área de conteúdo variável à direita.
 */
export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <Layout>
      <main className="page dashboard">
        <aside className="dados-panel">
          <h1 className="dados-panel__name">{user?.apelido}</h1>
          <div className="dados-panel__card">
            <Campo label="Nome completo" valor={user?.nomeCompleto ?? ''} />
            <Campo label="Apelido" valor={user?.apelido ?? ''} />
            <Campo label="Telefone" valor={user?.telefone ?? ''} />
            <Campo label="Email" valor={user?.email ?? ''} />

            <div className="dados-panel__footer">
              <button className="dados-panel__sair" onClick={handleLogout}>
                <LogoutIcon className="dados-panel__sair-icon" />
                Sair
              </button>
              <button
                className="dados-panel__edit"
                title="Editar perfil"
                aria-label="Editar perfil"
              >
                <PencilIcon />
              </button>
            </div>
          </div>
        </aside>

        <section className="dashboard__content">{children}</section>
      </main>
    </Layout>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="dados-campo">
      <span className="dados-campo__label">{label}</span>
      <div className="dados-campo__valor">{valor}</div>
    </div>
  )
}
