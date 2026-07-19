import { useState, type FormEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { EyeIcon, EyeOffIcon } from '../components/icons'
import { useApp } from '../context/AppContext'

/** Frame 4 — Login: Email + Senha, botão "Acessar". */
export function Login() {
  const { login, showAlert } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; senha?: boolean }>({})

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(e: FormEvent) {
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
    setIsSubmitting(true)
    showAlert('loading', '')

    try {
      const success = await login(mail, password)

      if (success) {
        showAlert('success', 'Login realizado com sucesso!')
        navigate('/catalogo')
        return
      }

      setFieldErrors({ email: true, senha: true })
      showAlert('error', 'Email ou senha inválidos.')
    } catch {
      showAlert('error', 'Não foi possível concluir o login agora. Tente novamente em instantes.')
    } finally {
      setIsSubmitting(false)
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
            disabled={isSubmitting}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }
            }}
            placeholder="Insira seu email"
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha <span className="field__required">*</span></label>
          <div className="field__password-wrap">
            <input
              id="senha"
              className={fieldErrors.senha ? 'field__input--error' : ''}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={senha}
              disabled={isSubmitting}
              onChange={(e) => {
                setSenha(e.target.value)
                if (fieldErrors.senha) {
                  setFieldErrors((prev) => ({ ...prev, senha: undefined }))
                }
              }}
              placeholder="Insira sua senha"
            />
            <button
              type="button"
              className="field__password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="auth-card__actions auth-card__actions--login">
          <button type="submit" className="btn btn-primary auth-card__submit auth-card__submit--login" disabled={isSubmitting}>
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
