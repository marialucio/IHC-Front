import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useApp } from '../context/AppContext'

/** Frame 3 — Cadastro: Nome, Apelido, Telefone, Email, Senha, Confirmação. */
export function Cadastro() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nomeCompleto: '',
    apelido: '',
    telefone: '',
    email: '',
    senha: '',
    confirmacao: '',
  })
  const [erro, setErro] = useState('')

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }
    register({
      nomeCompleto: form.nomeCompleto,
      apelido: form.apelido,
      telefone: form.telefone,
      email: form.email,
      senha: form.senha,
    })
    navigate('/catalogo')
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            value={form.nomeCompleto}
            onChange={(e) => update('nomeCompleto', e.target.value)}
            placeholder="Fabiana Mendes Silva Oliveira"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="apelido">Apelido</label>
          <input
            id="apelido"
            value={form.apelido}
            onChange={(e) => update('apelido', e.target.value)}
            placeholder="Fabiana Mendes"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            value={form.telefone}
            onChange={(e) => update('telefone', e.target.value)}
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="fabiana@email.com"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={form.senha}
            onChange={(e) => update('senha', e.target.value)}
            placeholder="••••••••••"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="confirmacao">Confirmação da senha</label>
          <input
            id="confirmacao"
            type="password"
            value={form.confirmacao}
            onChange={(e) => update('confirmacao', e.target.value)}
            placeholder="••••••••••"
            required
          />
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <div className="auth-card__actions">
          <button type="submit" className="btn btn-primary">
            Cadastrar
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
