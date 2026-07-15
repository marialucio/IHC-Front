import { useEffect, useState, type FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useApp } from '../context/AppContext'

const REENVIO_TEMPO_SEGUNDOS = 120

function formatarTempo(segundos: number) {
  const minutos = Math.floor(segundos / 60)
  const segundosRestantes = segundos % 60
  return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function RecuperarSenha() {
  const { showAlert } = useApp()
  const [email, setEmail] = useState('')
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [segundosRestantes, setSegundosRestantes] = useState(0)
  const [fieldError, setFieldError] = useState(false)

  useEffect(() => {
    if (segundosRestantes <= 0) return

    const timerId = window.setTimeout(() => {
      setSegundosRestantes((prev) => prev - 1)
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [segundosRestantes])

  async function enviarRecuperacao(e: FormEvent) {
    e.preventDefault()

    const emailNormalizado = email.trim()

    if (!emailNormalizado) {
      setFieldError(true)
      showAlert('warning', 'Preencha o campo de email.')
      return
    }

    if (!isValidEmail(emailNormalizado)) {
      setFieldError(true)
      showAlert('warning', 'Informe um email válido.')
      return
    }

    setFieldError(false)
    showAlert('loading', '')

    await new Promise((resolve) => window.setTimeout(resolve, 900))

    setEmailEnviado(true)
    setSegundosRestantes(REENVIO_TEMPO_SEGUNDOS)
    showAlert('success', '')
  }

  return (
    <AuthLayout>
      <form className="auth-card auth-card--recover" onSubmit={enviarRecuperacao}>
        <h1 className="auth-card__title">Recuperação de senha</h1>

        <p className="auth-card__description">
          Informe o email da sua conta para receber as instruções de recuperação.
        </p>

        <div className="field">
          <label htmlFor="email-recuperacao">Email</label>
          <input
            id="email-recuperacao"
            className={fieldError ? 'field__input--error' : ''}
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldError) {
                setFieldError(false)
              }
            }}
            placeholder="voce@email.com"
          />
        </div>

        {emailEnviado ? (
          <p className="auth-card__sent-message">
            Enviaremos um email com as instruções para recuperação de senha.
          </p>
        ) : null}

        <div className="auth-card__actions auth-card__actions--recover">
          <button type="submit" className="btn btn-primary auth-card__submit auth-card__submit--recover">
            Enviar
          </button>
          <button
            type="submit"
            className={`btn btn-outline auth-card__submit auth-card__submit--recover ${
              segundosRestantes > 0 ? 'auth-card__submit--recover-counting' : ''
            }`}
            disabled={!emailEnviado || segundosRestantes > 0}
          >
            <span className="auth-card__resend-label">Reenviar</span>
            <span
              className={`auth-card__resend-timer ${segundosRestantes > 0 ? 'auth-card__resend-timer--visible' : ''}`}
              aria-hidden={segundosRestantes <= 0}
            >
              ({formatarTempo(segundosRestantes)})
            </span>
          </button>
        </div>

        <div className="auth-card__back-links">
          <NavLink to="/login" className="auth-card__back-link">
            Voltar para login
          </NavLink>
          <span className="auth-card__back-divider" aria-hidden="true" />
          <NavLink to="/cadastro" className="auth-card__back-link">
            Ir para cadastro
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  )
}
