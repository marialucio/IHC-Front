import { useState, type FormEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useApp } from '../context/AppContext'

/** Frame 4 — Login: Email + Senha, botão "Acessar". */
export function Login() {
  const { login, showAlert } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; senha?: boolean }>({})

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const mail = email.trim()
    const password = senha

    if (!mail || !password) {
      setFieldErrors({
        email: !mail,
        senha: !password,
      })
      showAlert('warning', 'Preencha todos os campos obrigatórios.')
      return
    }

    if (!isValidEmail(mail)) {
      setFieldErrors({ email: true })
      showAlert('warning', 'Há campos não preenchidos corretamente!')
      return
    }

    setFieldErrors({})

    if (login(mail, password)) {
      navigate('/catalogo')
    } else {
      setFieldErrors({ email: true, senha: true })
      showAlert('error', 'Email ou senha inválidos.')
    }
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email <span className="field__required">*</span></label>
          <input
            id="email"
            className={fieldErrors.email ? 'field__input--error' : ''}
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }
            }}
            placeholder="fabiana@email.com"
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha <span className="field__required">*</span></label>
          <input
            id="senha"
            className={fieldErrors.senha ? 'field__input--error' : ''}
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              if (fieldErrors.senha) {
                setFieldErrors((prev) => ({ ...prev, senha: undefined }))
              }
            }}
            placeholder="••••••••••"
          />
        </div>

        <div className="auth-card__actions auth-card__actions--login">
          <button type="submit" className="btn btn-primary auth-card__submit auth-card__submit--login">
            Acessar
          </button>
        </div>

        <p className="helper-text">
          Ainda não tem uma conta? <NavLink to="/cadastro">Cadastre-se</NavLink>
        </p>
      </form>
    </AuthLayout>
  )
}
