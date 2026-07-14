import { useMemo, useRef, useState, type ChangeEvent, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { UploadIcon } from './icons'
import { useApp } from '../context/AppContext'
import { itemImg } from '../data/seed'
import './AddItemModal.css'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const { addItem, showAlert } = useApp()
  const inputFile = useRef<HTMLInputElement>(null)
  const cropAreaRef = useRef<HTMLDivElement>(null)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [termosTroca, setTermosTroca] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [imagemPosX, setImagemPosX] = useState(50)
  const [imagemPosY, setImagemPosY] = useState(50)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ preview?: boolean; titulo?: boolean; descricao?: boolean; localizacao?: boolean }>({})
  const [dragState, setDragState] = useState<{
    pointerId: number
    startX: number
    startY: number
    startPosX: number
    startPosY: number
  } | null>(null)
  const imagemPosicao = useMemo(() => `${imagemPosX}% ${imagemPosY}%`, [imagemPosX, imagemPosY])

  function clampPosition(value: number) {
    return Math.min(100, Math.max(0, value))
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setErrors((prev) => ({ ...prev, preview: undefined }))
    }
  }

  function handleTituloChange(value: string) {
    setTitulo(value)
    if (errors.titulo) {
      setErrors((prev) => ({ ...prev, titulo: undefined }))
    }
  }

  function handleDescricaoChange(value: string) {
    setDescricao(value)
    if (errors.descricao) {
      setErrors((prev) => ({ ...prev, descricao: undefined }))
    }
  }

  function handleLocalizacaoChange(value: string) {
    setLocalizacao(value)
    if (errors.localizacao) {
      setErrors((prev) => ({ ...prev, localizacao: undefined }))
    }
  }

  function handlePreviewPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (isSubmitting) return

    e.currentTarget.setPointerCapture(e.pointerId)
    setDragState({
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: imagemPosX,
      startPosY: imagemPosY,
    })
  }

  function handlePreviewPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || dragState.pointerId !== e.pointerId) return

    const rect = cropAreaRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return

    const deltaX = e.clientX - dragState.startX
    const deltaY = e.clientY - dragState.startY

    setImagemPosX(clampPosition(dragState.startPosX - (deltaX / rect.width) * 100))
    setImagemPosY(clampPosition(dragState.startPosY - (deltaY / rect.height) * 100))
  }

  function handlePreviewPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || dragState.pointerId !== e.pointerId) return

    e.currentTarget.releasePointerCapture(e.pointerId)
    setDragState(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Validar campos obrigatórios
    const newErrors: typeof errors = {}
    if (!preview) newErrors.preview = true
    if (!titulo.trim()) newErrors.titulo = true
    if (!descricao.trim()) newErrors.descricao = true
    if (!localizacao.trim()) newErrors.localizacao = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showAlert('warning', 'Preencha todos os campos obrigatórios.')
      return
    }

    setErrors({})
    setIsSubmitting(true)
    showAlert('loading', '')

    setTimeout(() => {
      addItem({
        titulo,
        descricao,
        imagem: preview ?? itemImg,
        imagemPosicao,
        categoria: 'Geral',
        condicao: 'bom' as 'novo' | 'como_novo' | 'bom' | 'usado',
        localizacao,
        termosTroca,
      })

      showAlert('success', 'Item adicionado com sucesso!')
      handleReset()
      setIsSubmitting(false)
      onClose()
    }, 1200)
  }

  function handleReset() {
    setTitulo('')
    setDescricao('')
    setLocalizacao('')
    setTermosTroca('')
    setPreview(null)
    setImagemPosX(50)
    setImagemPosY(50)
    setDragState(null)
    setErrors({})
  }

  function handleClose() {
    if (!isSubmitting) {
      handleReset()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="add-item-modal__backdrop" onClick={handleClose}>
      <div className="add-item-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="add-item-modal__header">
          <h2>Adicionar item</h2>
          <button
            className="add-item-modal__close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form className="add-item-modal__form" onSubmit={handleSubmit}>
          {/* Upload de foto */}
          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Upload de foto <span className="add-item-modal__required">*</span>
            </label>
            {preview ? (
              <div
                ref={cropAreaRef}
                className={`add-item-modal__upload-area add-item-modal__upload-area--draggable ${errors.preview ? 'add-item-modal__upload-area--error' : ''}`}
                onPointerDown={handlePreviewPointerDown}
                onPointerMove={handlePreviewPointerMove}
                onPointerUp={handlePreviewPointerUp}
                onPointerCancel={handlePreviewPointerUp}
              >
                <img
                  src={preview}
                  alt="Pré-visualização"
                  className="add-item-modal__upload-preview"
                  style={{ objectPosition: imagemPosicao }}
                  draggable={false}
                />
              </div>
            ) : (
              <button
                type="button"
                className={`add-item-modal__upload-area ${errors.preview ? 'add-item-modal__upload-area--error' : ''}`}
                onClick={() => inputFile.current?.click()}
                disabled={isSubmitting}
              >
                <div className="add-item-modal__upload-placeholder">
                  <span>Upload de foto</span>
                  <UploadIcon className="add-item-modal__upload-icon" />
                </div>
              </button>
            )}
            {preview ? (
              <div className="add-item-modal__crop-helper">
                <span>Arraste a imagem para ajustar o enquadramento.</span>
                <button
                  type="button"
                  className="add-item-modal__change-photo"
                  onClick={() => inputFile.current?.click()}
                  disabled={isSubmitting}
                >
                  Trocar foto
                </button>
              </div>
            ) : null}
            <input
              ref={inputFile}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFile}
            />
          </div>

          {/* Título */}
          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Título <span className="add-item-modal__required">*</span>
            </label>
            <input
              className={`add-item-modal__field ${errors.titulo ? 'add-item-modal__field--error' : ''}`}
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              placeholder="Título do item"
              disabled={isSubmitting}
            />
          </div>

          {/* Descrição */}
          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Descrição <span className="add-item-modal__required">*</span>
            </label>
            <textarea
              className={`add-item-modal__field add-item-modal__textarea ${errors.descricao ? 'add-item-modal__field--error' : ''}`}
              rows={2}
              value={descricao}
              onChange={(e) => handleDescricaoChange(e.target.value)}
              placeholder="Descreva o item"
              disabled={isSubmitting}
            />
          </div>

          {/* Localização */}
          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Localização <span className="add-item-modal__required">*</span>
            </label>
            <input
              className={`add-item-modal__field ${errors.localizacao ? 'add-item-modal__field--error' : ''}`}
              value={localizacao}
              onChange={(e) => handleLocalizacaoChange(e.target.value)}
              placeholder="Localização (ex: São Paulo, SP)"
              disabled={isSubmitting}
            />
          </div>

          {/* Termos de Troca */}
          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              O que você quer em troca?
            </label>
            <textarea
              className="add-item-modal__field add-item-modal__textarea"
              rows={2}
              value={termosTroca}
              onChange={(e) => setTermosTroca(e.target.value)}
              placeholder="Descreva o que você quer em troca (opcional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <div className="add-item-modal__buttons">
            <button
              type="button"
              className="add-item-modal__btn add-item-modal__btn--cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="add-item-modal__btn add-item-modal__btn--confirm"
              disabled={isSubmitting}
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
