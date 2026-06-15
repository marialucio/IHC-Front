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
  const [feedback, setFeedback] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  function handleSolicitar(item: Item) {
    solicitarTroca(item)
    setFeedback(`Solicitação de troca enviada para "${item.titulo}".`)
    window.setTimeout(() => setFeedback(''), 3500)
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
      <main className="page">
        {feedback && <div className="toast">{feedback}</div>}

        <div className="grid grid-catalogo">
          {catalogo.map((item) => (
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
