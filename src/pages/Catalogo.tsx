import { useState } from 'react'
import { Layout } from '../components/Layout'
import { ItemCard } from '../components/ItemCard'
import { useApp } from '../context/AppContext'
import type { Item } from '../types'
import './Catalogo.css'

/** Frame 1 — Catálogo: grid de itens disponíveis para troca. */
export function Catalogo() {
  const { catalogo, solicitarTroca } = useApp()
  const [feedback, setFeedback] = useState('')

  function handleSolicitar(item: Item) {
    solicitarTroca(item)
    setFeedback(`Solicitação de troca enviada para "${item.titulo}".`)
    window.setTimeout(() => setFeedback(''), 3500)
  }

  return (
    <Layout>
      <main className="page">
        {feedback && <div className="toast">{feedback}</div>}

        <div className="grid grid-catalogo">
          {catalogo.map((item) => (
            <ItemCard key={item.id} item={item} onAction={handleSolicitar} />
          ))}
        </div>
      </main>
    </Layout>
  )
}
