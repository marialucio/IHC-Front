import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useApp } from '../context/AppContext'

/** Frame 4 — Login: Email + Senha, botão "Acessar". */
export function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (login(email.trim(), senha)) {
      navigate('/catalogo')
    } else {
      setErro('Email ou senha inválidos. Tente fabiana@email.com / senha1234.')
    }
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="fabiana@email.com"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••••"
            required
          />
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <div className="auth-card__actions">
          <button type="submit" className="btn btn-primary">
            Acessar
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
