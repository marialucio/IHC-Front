import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from './Layout'
import { LogoutIcon, PencilIcon } from './icons'
import { useApp } from '../context/AppContext'
import './DashboardLayout.css'

/**
 * Layout das telas internas do perfil (Frames 2, 6 e 7 do Figma).
 * Painel fixo de dados à esquerda + área de conteúdo variável à direita.
 */
export function DashboardLayout({
  children,
  centerPanel = false,
}: {
  children?: ReactNode
  centerPanel?: boolean
}) {
  const { user, logout, updateUser, showAlert } = useApp()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [nomeCompleto, setNomeCompleto] = useState(user?.nomeCompleto ?? '')
  const [apelido, setApelido] = useState(user?.apelido ?? '')
  const [telefone, setTelefone] = useState(user?.telefone ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [fieldErrors, setFieldErrors] = useState<{
    nomeCompleto?: boolean
    apelido?: boolean
    telefone?: boolean
    email?: boolean
  }>({})

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

    if (digits.length <= 6) {
      return `(${ddd}) ${restante}`
    }

    if (digits.length === 10) {
      return `(${ddd}) ${restante.slice(0, 4)}-${restante.slice(4, 8)}`
    }

    return `(${ddd}) ${restante.slice(0, 5)}-${restante.slice(5, 9)}`
  }

  function extractDigits(value: string) {
    return value.replace(/\D/g, '')
  }

  useEffect(() => {
    setNomeCompleto(user?.nomeCompleto ?? '')
    setApelido(user?.apelido ?? '')
    setTelefone(user?.telefone ?? '')
    setEmail(user?.email ?? '')
  }, [user])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleEditar() {
    setIsEditing(true)
    setFieldErrors({})
  }

  function handleCancelar() {
    setNomeCompleto(user?.nomeCompleto ?? '')
    setApelido(user?.apelido ?? '')
    setTelefone(user?.telefone ?? '')
    setEmail(user?.email ?? '')
    setFieldErrors({})
    setIsEditing(false)
  }

  function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})

    const nome = nomeCompleto.trim()
    const nick = apelido.trim()
    const phoneDigits = extractDigits(telefone)
    const mail = email.trim()

    const requiredErrors: typeof fieldErrors = {}
    const formatErrors: typeof fieldErrors = {}

    if (!nome) requiredErrors.nomeCompleto = true
    if (!nick) requiredErrors.apelido = true
    if (!phoneDigits) requiredErrors.telefone = true
    if (!mail) requiredErrors.email = true

    if (Object.keys(requiredErrors).length > 0) {
      setFieldErrors(requiredErrors)
      showAlert('warning', 'Preencha todos os campos obrigatórios.')
      return
    }

    if (!isValidPhone(phoneDigits) || !isValidEmail(mail)) {
      if (!isValidPhone(phoneDigits)) formatErrors.telefone = true
      if (!isValidEmail(mail)) formatErrors.email = true

      setFieldErrors(formatErrors)
      showAlert('warning', 'Há campos não preenchidos corretamente!')
      return
    }

    showAlert('loading', '')

    setTimeout(() => {
      updateUser({
        nomeCompleto: nome,
        apelido: nick,
        telefone: formatPhone(phoneDigits),
        email: mail,
        senha: user?.senha ?? '',
      })
      showAlert('success', 'Alteração realizada com sucesso!')
      setIsEditing(false)
    }, 1200)
  }

  return (
    <Layout>
      <main className={`page dashboard ${centerPanel ? 'dashboard--single' : ''}`}>
        <aside className="dados-panel">
          <h1 className="dados-panel__name">{user?.apelido}</h1>
          <form className="dados-panel__card" onSubmit={handleSalvar}>
            <Campo
              id="nomeCompleto"
              label="Nome completo"
              valor={nomeCompleto}
              required
              hasError={!!fieldErrors.nomeCompleto}
              disabled={!isEditing}
              onChange={(value) => {
                setNomeCompleto(value.slice(0, 100))
                if (fieldErrors.nomeCompleto) {
                  setFieldErrors((prev) => ({ ...prev, nomeCompleto: undefined }))
                }
              }}
            />
            <Campo
              id="apelido"
              label="Apelido"
              valor={apelido}
              required
              hasError={!!fieldErrors.apelido}
              disabled={!isEditing}
              onChange={(value) => {
                setApelido(value.slice(0, 20))
                if (fieldErrors.apelido) {
                  setFieldErrors((prev) => ({ ...prev, apelido: undefined }))
                }
              }}
            />
            <Campo
              id="telefone"
              label="Telefone"
              valor={telefone}
              required
              hasError={!!fieldErrors.telefone}
              disabled={!isEditing}
              onChange={(value) => {
                const digits = value.replace(/\D/g, '').slice(0, 11)
                setTelefone(formatPhone(digits))
                if (fieldErrors.telefone) {
                  setFieldErrors((prev) => ({ ...prev, telefone: undefined }))
                }
              }}
            />
            <Campo
              id="email"
              label="Email"
              valor={email}
              required
              hasError={!!fieldErrors.email}
              disabled={!isEditing}
              onChange={(value) => {
                setEmail(value.slice(0, 100))
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
            />

            <div className="dados-panel__footer">
              {isEditing ? (
                <div className="dados-panel__actions dados-panel__actions--editing">
                  <button type="button" className="dados-panel__cancelar" onClick={handleCancelar}>
                    Cancelar
                  </button>
                  <button type="submit" className="dados-panel__salvar">
                    Salvar
                  </button>
                </div>
              ) : (
                <>
                  <button type="button" className="dados-panel__sair" onClick={handleLogout}>
                    <LogoutIcon className="dados-panel__sair-icon" />
                    Sair
                  </button>
                  <div className="dados-panel__actions">
                    <button
                      type="button"
                      className="dados-panel__edit"
                      title="Editar perfil"
                      aria-label="Editar perfil"
                      onClick={handleEditar}
                    >
                      <PencilIcon />
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </aside>

        {!centerPanel && <section className="dashboard__content">{children}</section>}
      </main>
    </Layout>
  )
}

function Campo({
  id,
  label,
  valor,
  required = false,
  hasError = false,
  disabled,
  onChange,
}: {
  id: string
  label: string
  valor: string
  required?: boolean
  hasError?: boolean
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="dados-campo">
      <label className="dados-campo__label" htmlFor={id}>
        {label}
        {required ? <span className="dados-campo__required"> *</span> : null}
      </label>
      <input
        id={id}
        className={`dados-campo__valor dados-campo__input ${hasError ? 'dados-campo__input--error' : ''}`}
        value={valor}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
