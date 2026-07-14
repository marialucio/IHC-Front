import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Item } from '../types'
import { SwapIcon, HeartIcon, TrashIcon, PencilIcon } from './icons'
import './ItemModal.css'

interface ItemModalProps {
  item: Item | null
  onClose: () => void
  onAction?: (item: Item) => void
  onFavorite?: (item: Item) => void
  isFavorite?: boolean
  variant?: 'catalog' | 'owner'
  onEdit?: (item: Item) => void
  onDelete?: (item: Item) => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function ItemModal({
  item,
  onClose,
  onAction,
  onFavorite,
  isFavorite,
  variant = 'catalog',
  onEdit,
  onDelete,
}: ItemModalProps) {
  const imageAreaRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<{
    pointerId: number
    startX: number
    startY: number
    startPosX: number
    startPosY: number
  } | null>(null)

  const initialImagePosition = useMemo(() => {
    if (!item) return { x: 50, y: 50 }

    const raw = (item.imagemPosicao ?? '50% 50%').toLowerCase()

    if (raw === 'center center') return { x: 50, y: 50 }
    if (raw === 'center top') return { x: 50, y: 0 }
    if (raw === 'center bottom') return { x: 50, y: 100 }
    if (raw === 'left center') return { x: 0, y: 50 }
    if (raw === 'right center') return { x: 100, y: 50 }

    const [xRaw, yRaw] = raw.split(' ')
    const x = Number.parseInt((xRaw ?? '50').replace('%', ''), 10)
    const y = Number.parseInt((yRaw ?? '50').replace('%', ''), 10)

    return {
      x: Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : 50,
      y: Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50,
    }
  }, [item])

  const [imagePosX, setImagePosX] = useState(initialImagePosition.x)
  const [imagePosY, setImagePosY] = useState(initialImagePosition.y)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    setImagePosX(initialImagePosition.x)
    setImagePosY(initialImagePosition.y)
    setDragState(null)
  }, [initialImagePosition.x, initialImagePosition.y, item?.id])

  function clampPosition(value: number) {
    return Math.min(100, Math.max(0, value))
  }

  function handleImagePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragState({
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: imagePosX,
      startPosY: imagePosY,
    })
  }

  function handleImagePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || dragState.pointerId !== e.pointerId) return

    const rect = imageAreaRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return

    const deltaX = e.clientX - dragState.startX
    const deltaY = e.clientY - dragState.startY

    setImagePosX(clampPosition(dragState.startPosX - (deltaX / rect.width) * 100))
    setImagePosY(clampPosition(dragState.startPosY - (deltaY / rect.height) * 100))
  }

  function handleImagePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || dragState.pointerId !== e.pointerId) return

    e.currentTarget.releasePointerCapture(e.pointerId)
    setDragState(null)
  }

  if (!item) return null

  return (
    <div className="item-modal__overlay" onClick={onClose}>
      <div className="item-modal__container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="item-modal__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="item-modal__content">
          <div
            ref={imageAreaRef}
            className="item-modal__image-wrapper item-modal__image-wrapper--draggable"
            onPointerDown={handleImagePointerDown}
            onPointerMove={handleImagePointerMove}
            onPointerUp={handleImagePointerUp}
            onPointerCancel={handleImagePointerUp}
          >
            {item.imagem ? (
              <img
                src={item.imagem}
                alt={item.titulo}
                className="item-modal__image"
                style={{ objectPosition: `${imagePosX}% ${imagePosY}%` }}
                draggable={false}
              />
            ) : (
              <div className="item-modal__image item-modal__image--empty" />
            )}
            {item.imagem ? <span className="item-modal__drag-hint">Arraste para ver melhor</span> : null}
          </div>

          <div className="item-modal__info">
            <h2 className="item-modal__title">{item.titulo}</h2>

            <div className="item-modal__owner-card">
              <div className="owner-card__content">
                <div className="owner-card__name">{item.dono}</div>
                <div className="owner-card__stats">
                  <span className="stat">
                    <strong>{item.numeroTrocas}</strong> trocas realizadas
                  </span>
                </div>
              </div>
            </div>

            <div className="item-modal__details-grid">
              <div className="detail-item">
                <span className="detail-label">📍 Localização</span>
                <span className="detail-value">{item.localizacao}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📅 Publicado em</span>
                <span className="detail-value">{formatDate(item.dataCriacao)}</span>
              </div>
            </div>

            <div className="item-modal__description">
              <h3 className="item-modal__desc-title">Descrição</h3>
              <p className="item-modal__desc-text">{item.descricao}</p>
            </div>

            {item.termosTroca && (
              <div className="item-modal__termos">
                <h3 className="item-modal__desc-title">🤝 Termos de Troca</h3>
                <p className="item-modal__termos-text">{item.termosTroca}</p>
              </div>
            )}

            <div className="item-modal__actions">
              {variant === 'catalog' ? (
                <>
                  <button
                    type="button"
                    className="item-modal__action-btn item-modal__action-btn--primary"
                    onClick={() => {
                      onAction?.(item)
                      onClose()
                    }}
                  >
                    <SwapIcon />
                    Solicitar Troca
                  </button>
                  <button
                    type="button"
                    className={`item-modal__action-btn item-modal__action-btn--secondary ${isFavorite ? 'item-modal__action-btn--favorited' : ''}`}
                    title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                    onClick={() => onFavorite?.(item)}
                  >
                    <HeartIcon fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="item-modal__action-btn item-modal__action-btn--primary"
                    onClick={() => {
                      onEdit?.(item)
                      onClose()
                    }}
                  >
                    <PencilIcon />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="item-modal__action-btn item-modal__action-btn--danger"
                    onClick={() => {
                      onDelete?.(item)
                      onClose()
                    }}
                  >
                    <TrashIcon />
                    Deletar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
