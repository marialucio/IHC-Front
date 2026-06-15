import { useEffect } from 'react'
import type { Item } from '../types'
import { SwapIcon, HeartIcon } from './icons'
import './ItemModal.css'

interface ItemModalProps {
  item: Item | null
  onClose: () => void
  onAction?: (item: Item) => void
  onFavorite?: (item: Item) => void
  isFavorite?: boolean
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function ItemModal({ item, onClose, onAction, onFavorite, isFavorite }: ItemModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

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
          <div className="item-modal__image-wrapper">
            {item.imagem ? (
              <img src={item.imagem} alt={item.titulo} className="item-modal__image" />
            ) : (
              <div className="item-modal__image item-modal__image--empty" />
            )}
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
                <HeartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
