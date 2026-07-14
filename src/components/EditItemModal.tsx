import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { Item } from '../types'
import { UploadIcon } from './icons'
import { useApp } from '../context/AppContext'
import './AddItemModal.css'

interface EditItemModalProps {
  item: Item | null
  isOpen: boolean
  onClose: () => void
  onSaved?: (item: Item) => void
}

function parseImagePosition(pos?: string): { x: number; y: number } {
  if (!pos) return { x: 50, y: 50 }

  const trimmed = pos.trim().toLowerCase()
  if (trimmed === 'center center') return { x: 50, y: 50 }
  if (trimmed === 'center top') return { x: 50, y: 0 }
  if (trimmed === 'center bottom') return { x: 50, y: 100 }
  if (trimmed === 'left center') return { x: 0, y: 50 }
  if (trimmed === 'right center') return { x: 100, y: 50 }

  const [xRaw, yRaw] = trimmed.split(' ')
  const x = Number.parseInt((xRaw ?? '50').replace('%', ''), 10)
  const y = Number.parseInt((yRaw ?? '50').replace('%', ''), 10)

  return {
    x: Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : 50,
    y: Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50,
  }
}

export function EditItemModal({ item, isOpen, onClose, onSaved }: EditItemModalProps) {
  const { updateItem, showAlert } = useApp()
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

  useEffect(() => {
    if (!isOpen || !item) return
    setTitulo(item.titulo)
    setDescricao(item.descricao)
    setLocalizacao(item.localizacao)
    setTermosTroca(item.termosTroca ?? '')
    setPreview(item.imagem ?? null)
    const parsed = parseImagePosition(item.imagemPosicao)
    setImagemPosX(parsed.x)
    setImagemPosY(parsed.y)
    setErrors({})
  }, [isOpen, item])

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setErrors((prev) => ({ ...prev, preview: undefined }))
    }
  }

  function handleTituloChange(value: string) {
    setTitulo(value)
    if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: undefined }))
  }

  function handleDescricaoChange(value: string) {
    setDescricao(value)
    if (errors.descricao) setErrors((prev) => ({ ...prev, descricao: undefined }))
  }

  function handleLocalizacaoChange(value: string) {
    setLocalizacao(value)
    if (errors.localizacao) setErrors((prev) => ({ ...prev, localizacao: undefined }))
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
    if (!item) return

    const newErrors: typeof errors = {}
    if (!preview) newErrors.preview = true
    if (!titulo.trim()) newErrors.titulo = true
    if (!descricao.trim()) newErrors.descricao = true
    if (!localizacao.trim()) newErrors.localizacao = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showAlert('warning', 'Preencha todos os campos obrigatorios.')
      return
    }

    setErrors({})
    setIsSubmitting(true)
    showAlert('loading', '')

    setTimeout(() => {
      const updatedItem: Item = {
        ...item,
        titulo,
        descricao,
        imagem: preview ?? item.imagem,
        imagemPosicao,
        localizacao,
        termosTroca,
      }

      updateItem(item.id, {
        titulo,
        descricao,
        imagem: preview ?? item.imagem,
        imagemPosicao,
        categoria: item.categoria,
        condicao: item.condicao,
        localizacao,
        termosTroca,
      })

      showAlert('success', 'Item atualizado com sucesso!')
      onSaved?.(updatedItem)
      setIsSubmitting(false)
      onClose()
    }, 1200)
  }

  if (!isOpen || !item) return null

  return (
    <div className="add-item-modal__backdrop" onClick={() => !isSubmitting && onClose()}>
      <div className="add-item-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="add-item-modal__header">
          <h2>Editar item</h2>
          <button
            className="add-item-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form className="add-item-modal__form" onSubmit={handleSubmit}>
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
                  alt="Pre-visualizacao"
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

          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Titulo <span className="add-item-modal__required">*</span>
            </label>
            <input
              className={`add-item-modal__field ${errors.titulo ? 'add-item-modal__field--error' : ''}`}
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              placeholder="Titulo do item"
              disabled={isSubmitting}
            />
          </div>

          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Descricao <span className="add-item-modal__required">*</span>
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

          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">
              Localizacao <span className="add-item-modal__required">*</span>
            </label>
            <input
              className={`add-item-modal__field ${errors.localizacao ? 'add-item-modal__field--error' : ''}`}
              value={localizacao}
              onChange={(e) => handleLocalizacaoChange(e.target.value)}
              placeholder="Localizacao (ex: Sao Paulo, SP)"
              disabled={isSubmitting}
            />
          </div>

          <div className="add-item-modal__field-group">
            <label className="add-item-modal__label">O que voce quer em troca?</label>
            <textarea
              className="add-item-modal__field add-item-modal__textarea"
              rows={2}
              value={termosTroca}
              onChange={(e) => setTermosTroca(e.target.value)}
              placeholder="Descreva o que voce quer em troca (opcional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="add-item-modal__buttons">
            <button
              type="button"
              className="add-item-modal__btn add-item-modal__btn--cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="add-item-modal__btn add-item-modal__btn--confirm"
              disabled={isSubmitting}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
