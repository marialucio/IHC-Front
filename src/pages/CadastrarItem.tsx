import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { UploadIcon } from '../components/icons'
import { useApp } from '../context/AppContext'
import { itemImg } from '../data/seed'
import './CadastrarItem.css'

/**
 * Frame 7 — Cadastrar item.
 * Mesma estrutura de dashboard; à direita o formulário:
 * área de upload + Título + Descrição.
 */
export function CadastrarItem() {
  const { addItem } = useApp()
  const navigate = useNavigate()
  const inputFile = useRef<HTMLInputElement>(null)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [termosTroca, setTermosTroca] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!localizacao.trim()) {
      alert('Por favor, preencha a localização.')
      return
    }
    addItem({
      titulo,
      descricao,
      imagem: preview ?? itemImg,
      categoria: 'Geral',
      condicao: 'bom' as 'novo' | 'como_novo' | 'bom' | 'usado',
      localizacao,
      termosTroca,
    })
    navigate('/perfil')
  }

  return (
    <DashboardLayout>
      <form className="cadastrar-form" onSubmit={handleSubmit}>
        {/* Upload de foto — Rectangle 15 */}
        <button
          type="button"
          className="upload-area"
          onClick={() => inputFile.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="upload-preview" />
          ) : (
            <div className="upload-placeholder">
              <span>Upload de foto</span>
              <UploadIcon className="upload-icon" />
            </div>
          )}
          <input
            ref={inputFile}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
        </button>

        {/* Título — Rectangle 16 */}
        <input
          className="campo-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          required
        />

        {/* Descrição — Rectangle 17 */}
        <textarea
          className="campo-descricao"
          rows={2}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          required
        />

        {/* Localização */}
        <input
          className="campo-localizacao"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
          placeholder="Localização (ex: São Paulo, SP)"
          required
        />

        {/* Termos de Troca */}
        <textarea
          className="campo-termos"
          rows={2}
          value={termosTroca}
          onChange={(e) => setTermosTroca(e.target.value)}
          placeholder="O que você quer em troca? (opcional)"
        />

        {/* Submit acionado via Enter / fora da tela conforme protótipo */}
        <button type="submit" className="campo-submit">
          Cadastrar item
        </button>
      </form>
    </DashboardLayout>
  )
}
