import type { Item } from '../types'
import { HeartIcon, SwapIcon, TrashIcon, PencilIcon } from './icons'
import './ItemCard.css'

interface ItemCardProps {
  item: Item
  /** Ação primária (catálogo: solicitar troca). */
  onAction?: (item: Item) => void
  /** catalogo = ícones + dono; meu = ícones excluir/editar. */
  variant?: 'catalogo' | 'meu'
  showOwnerActions?: boolean
  onEdit?: (item: Item) => void
  onDelete?: (item: Item) => void
  onFavorite?: (item: Item) => void
  isFavorite?: boolean
}

export function ItemCard({
  item,
  onAction,
  variant = 'catalogo',
  showOwnerActions = false,
  onEdit,
  onDelete,
  onFavorite,
  isFavorite = false,
}: ItemCardProps) {
  return (
    <article className="item-card">
      <div className="item-card__image">
        {item.imagem ? <img src={item.imagem} alt={item.titulo} /> : null}
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
                  <HeartIcon />
                </button>
                <button
                  type="button"
                  className="icon-link"
                  title="Solicitar troca"
                  aria-label="Solicitar troca"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction?.(item)
                  }}
                >
                  <SwapIcon />
                </button>
              </div>
              {item.dono && <span className="item-card__owner">{item.dono}</span>}
            </>
          ) : showOwnerActions ? (
            <div className="item-card__icons item-card__icons--right">
              <button
                type="button"
                className="icon-link icon-link--danger"
                title="Excluir"
                aria-label="Excluir item"
                onClick={() => onDelete?.(item)}
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
