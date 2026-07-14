import { useState } from 'react'
import { Layout } from '../components/Layout'
import { ItemCard } from '../components/ItemCard'
import { ItemModal } from '../components/ItemModal'
import { useApp } from '../context/AppContext'
import type { Item } from '../types'
import './Catalogo.css'

/** Frame 1 — Catálogo: grid de itens disponíveis para troca. */
export function Catalogo() {
  const { catalogo, solicitarTroca, adicionarFavorito, removerFavorito, ehFavorito } = useApp()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [mostrarSomenteFavoritos, setMostrarSomenteFavoritos] = useState(false)

  const itensVisiveis = mostrarSomenteFavoritos
    ? catalogo.filter((item) => ehFavorito(item.id))
    : catalogo

  function handleSolicitar(item: Item) {
    solicitarTroca(item)
  }

  function handleToggleFavorito(item: Item) {
    if (ehFavorito(item.id)) {
      removerFavorito(item.id)
    } else {
      adicionarFavorito(item)
    }
  }

  return (
    <Layout>
      <main className="page catalogo-page">
        <div className="catalogo-toolbar">
          <h1 className="catalogo-toolbar__title">Catálogo</h1>
          <button
            type="button"
            className={`catalogo-toolbar__filter-btn ${mostrarSomenteFavoritos ? 'catalogo-toolbar__filter-btn--active' : ''}`}
            onClick={() => setMostrarSomenteFavoritos((prev) => !prev)}
          >
            {mostrarSomenteFavoritos ? 'Mostrar todos' : 'Filtrar favoritos'}
          </button>
        </div>

        {itensVisiveis.length === 0 ? (
          <p className="empty">
            {mostrarSomenteFavoritos
              ? 'Nenhum item favorito foi encontrado.'
              : 'Nenhum item encontrado no catálogo.'}
          </p>
        ) : (
          <div className="grid grid-catalogo">
            {itensVisiveis.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedItem(item)
                  }
                }}
                className="item-card-wrapper"
              >
                <ItemCard
                  item={item}
                  onAction={handleSolicitar}
                  onFavorite={handleToggleFavorito}
                  isFavorite={ehFavorito(item.id)}
                />
              </div>
            ))}
          </div>
        )}

        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAction={handleSolicitar}
          onFavorite={handleToggleFavorito}
          isFavorite={selectedItem ? ehFavorito(selectedItem.id) : false}
        />
      </main>
    </Layout>
  )
}
