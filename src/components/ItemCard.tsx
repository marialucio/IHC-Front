import type { Item } from '../types'
import { HeartIcon, SwapIcon, TrashIcon, PencilIcon } from './icons'
import './ItemCard.css'

interface ItemCardProps {
  item: Item
  /** Ação primária (catálogo: solicitar troca). */
  onAction?: (item: Item) => void
  isTradeDisabled?: boolean
  tradeDisabledTooltip?: string
  /** catalogo = ícones + dono; meu = ícones excluir/editar. */
  variant?: 'catalogo' | 'meu'
  showOwnerActions?: boolean
  onDelete?: (item: Item) => void
  onEdit?: (item: Item) => void
  onFavorite?: (item: Item) => void
  isFavorite?: boolean
}

export function ItemCard({
  item,
  onAction,
  isTradeDisabled = false,
  tradeDisabledTooltip,
  variant = 'catalogo',
  showOwnerActions = false,
  onDelete,
  onEdit,
  onFavorite,
  isFavorite = false,
}: ItemCardProps) {
  return (
    <article className="item-card">
      <div className="item-card__image">
        {item.imagem ? (
          <img src={item.imagem} alt={item.titulo} style={{ objectPosition: item.imagemPosicao ?? 'center center' }} />
        ) : null}
      </div>
      <div className="item-card__body">
        <h3 className="item-card__title">{item.titulo}</h3>
        <p className="item-card__desc">{item.descricao}</p>

        <div className="item-card__footer">
          {variant === 'catalogo' ? (
            <>
              <div className="item-card__icons">
                <button
                  type="button"
                  className={`icon-link ${isFavorite ? 'icon-link--favorited' : ''}`}
                  title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                  aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar item'}
                  onClick={(e) => {
                    e.stopPropagation()
                    onFavorite?.(item)
                  }}
                >
                  <HeartIcon fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <span
                  className="icon-link-tooltip"
                  data-tooltip={isTradeDisabled ? tradeDisabledTooltip : undefined}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={`icon-link ${isTradeDisabled ? 'icon-link--disabled' : ''}`}
                    title={isTradeDisabled ? undefined : 'Solicitar troca'}
                    aria-label={isTradeDisabled ? 'Troca já solicitada para este item' : 'Solicitar troca'}
                    disabled={isTradeDisabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isTradeDisabled) return
                      onAction?.(item)
                    }}
                  >
                    <SwapIcon />
                  </button>
                </span>
              </div>
              {item.dono && <span className="item-card__owner">{item.dono}</span>}
            </>
          ) : showOwnerActions ? (
            <div className="item-card__icons item-card__icons--right">
              <button
                type="button"
                className="icon-link"
                title="Editar"
                aria-label="Editar item"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(item)
                }}
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                className="icon-link icon-link--danger"
                title="Excluir"
                aria-label="Excluir item"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(item)
                }}
              >
                <TrashIcon />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
