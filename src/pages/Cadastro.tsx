import { useState, type FormEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useApp } from '../context/AppContext'

/** Frame 3 — Cadastro: Nome, Apelido, Telefone, Email, Senha, Confirmação. */
export function Cadastro() {
  const { register, showAlert } = useApp()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    nomeCompleto: '',
    apelido: '',
    telefone: '',
    email: '',
    senha: '',
    confirmacao: '',
  })
  const [fieldErrors, setFieldErrors] = useState<{
    nomeCompleto?: boolean
    apelido?: boolean
    telefone?: boolean
    email?: boolean
    senha?: boolean
    confirmacao?: boolean
  }>({})

  function isValidName(value: string) {
    return value.length <= 100
  }

  function isValidNickname(value: string) {
    return value.length <= 20
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  function isValidPhone(value: string) {
    const digits = value.replace(/\D/g, '')
    return digits.length === 10 || digits.length === 11
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (!digits) return ''

    const ddd = digits.slice(0, 2)
    const restante = digits.slice(2)

    if (digits.length <= 2) return `(${ddd}`
    if (digits.length <= 6) return `(${ddd}) ${restante}`
    if (digits.length === 10) return `(${ddd}) ${restante.slice(0, 4)}-${restante.slice(4, 8)}`
    return `(${ddd}) ${restante.slice(0, 5)}-${restante.slice(5, 9)}`
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => {
      if (field === 'telefone') {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        return { ...prev, telefone: formatPhone(digits) }
      }

      if (field === 'nomeCompleto') {
        return { ...prev, nomeCompleto: value.slice(0, 100) }
      }

      if (field === 'apelido') {
        return { ...prev, apelido: value.slice(0, 20) }
      }

      if (field === 'email') {
        return { ...prev, email: value.slice(0, 100) }
      }

      return { ...prev, [field]: value }
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldErrors({})

    const nome = form.nomeCompleto.trim()
    const apelido = form.apelido.trim()
    const telefone = form.telefone.trim()
    const email = form.email.trim()
    const senha = form.senha
    const confirmacao = form.confirmacao

    const requiredErrors: typeof fieldErrors = {}
    const formatErrors: typeof fieldErrors = {}

    if (!nome) requiredErrors.nomeCompleto = true
    if (!apelido) requiredErrors.apelido = true
    if (!telefone) requiredErrors.telefone = true
    if (!email) requiredErrors.email = true
    if (!senha) requiredErrors.senha = true
    if (!confirmacao) requiredErrors.confirmacao = true

    if (Object.keys(requiredErrors).length > 0) {
      setFieldErrors(requiredErrors)
      showAlert('warning', 'Preencha todos os campos obrigatórios.')
      return
    }

    if (!isValidName(nome)) formatErrors.nomeCompleto = true
    if (!isValidNickname(apelido)) formatErrors.apelido = true
    if (!isValidPhone(telefone)) formatErrors.telefone = true
    if (!isValidEmail(email)) formatErrors.email = true
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(senha)) formatErrors.senha = true

    if (Object.keys(formatErrors).length > 0) {
      setFieldErrors(formatErrors)
      showAlert('warning', 'Há campos não preenchidos corretamente!')
      return
    }

    if (senha !== confirmacao) {
      setFieldErrors({ senha: true, confirmacao: true })
      showAlert('warning', 'As senhas não coincidem.')
      return
    }

    showAlert('loading', '')
    setIsSubmitting(true)

    try {
      const success = await register({
        nomeCompleto: nome,
        apelido,
        telefone: formatPhone(telefone),
        email,
        senha,
      })

      if (!success) {
        showAlert('error', 'Nao foi possivel concluir o cadastro com os dados informados.')
        return
      }

      showAlert('success', 'Cadastro realizado com sucesso!')
      navigate('/login')
    } catch {
      showAlert('error', 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="auth-card auth-card--compact" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="nome">Nome completo <span className="field__required">*</span></label>
          <input
            id="nome"
            className={fieldErrors.nomeCompleto ? 'field__input--error' : ''}
            value={form.nomeCompleto}
            disabled={isSubmitting}
            onChange={(e) => {
              update('nomeCompleto', e.target.value)
              if (fieldErrors.nomeCompleto) setFieldErrors((prev) => ({ ...prev, nomeCompleto: undefined }))
            }}
            placeholder="Insira seu nome completo"
            maxLength={100}
          />
        </div>

        <div className="field">
          <label htmlFor="apelido">Apelido <span className="field__required">*</span></label>
          <input
            id="apelido"
            className={fieldErrors.apelido ? 'field__input--error' : ''}
            value={form.apelido}
            disabled={isSubmitting}
            onChange={(e) => {
              update('apelido', e.target.value)
              if (fieldErrors.apelido) setFieldErrors((prev) => ({ ...prev, apelido: undefined }))
            }}
            placeholder="Insira seu apelido"
            maxLength={20}
          />
        </div>

        <div className="field">
          <label htmlFor="telefone">Telefone <span className="field__required">*</span></label>
          <input
            id="telefone"
            className={fieldErrors.telefone ? 'field__input--error' : ''}
            value={form.telefone}
            disabled={isSubmitting}
            onChange={(e) => {
              update('telefone', e.target.value)
              if (fieldErrors.telefone) setFieldErrors((prev) => ({ ...prev, telefone: undefined }))
            }}
            placeholder="Insira seu telefone"
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email <span className="field__required">*</span></label>
          <input
            id="email"
            className={fieldErrors.email ? 'field__input--error' : ''}
            value={form.email}
            disabled={isSubmitting}
            onChange={(e) => {
              update('email', e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
            }}
            placeholder="Insira seu email"
            maxLength={100}
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha <span className="field__required">*</span></label>
          <input
            id="senha"
            className={fieldErrors.senha ? 'field__input--error' : ''}
            type="password"
            value={form.senha}
            disabled={isSubmitting}
            onChange={(e) => {
              update('senha', e.target.value)
              if (fieldErrors.senha) setFieldErrors((prev) => ({ ...prev, senha: undefined }))
            }}
            placeholder="Insira sua senha"
          />
          <small className="field__hint">Mínimo de 8 caracteres, com letras maiúsculas, minúsculas e números.</small>
        </div>

        <div className="field">
          <label htmlFor="confirmacao">Confirmação da senha <span className="field__required">*</span></label>
          <input
            id="confirmacao"
            className={fieldErrors.confirmacao ? 'field__input--error' : ''}
            type="password"
            value={form.confirmacao}
            disabled={isSubmitting}
            onChange={(e) => {
              update('confirmacao', e.target.value)
              if (fieldErrors.confirmacao) setFieldErrors((prev) => ({ ...prev, confirmacao: undefined }))
            }}
            placeholder="Confirme sua senha"
          />
        </div>

        <div className="auth-card__actions auth-card__actions--compact">
          <button type="submit" className="btn btn-primary auth-card__submit auth-card__submit--compact" disabled={isSubmitting}>
            Cadastrar
          </button>
        </div>

        <p className="helper-text">
          Já tem cadastro? <NavLink to="/login">Login</NavLink>
        </p>
      </form>
    </AuthLayout>
  )
}
