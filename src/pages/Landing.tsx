import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Layout'
import './Landing.css'

/** Frame 5 — tela inicial: header roxo (Cadastrar/Acessar) + logo central. */
export function Landing() {
  const navigate = useNavigate()
  return (
    <div className="app-shell">
      <header className="landing-header">
        <div className="landing-header__bar">
          <div className="landing-header__actions">
            <button
              className="btn-pill btn-pill--cadastrar"
              onClick={() => navigate('/cadastro')}
            >
              Cadastrar
            </button>
            <button
              className="btn-pill btn-pill--acessar"
              onClick={() => navigate('/login')}
            >
              Acessar
            </button>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <img className="landing-logo" src="/assets/logo.png" alt="Trocas USP" />
      </main>

      <Footer />
    </div>
  )
}
