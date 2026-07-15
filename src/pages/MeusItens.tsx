import { useState } from 'react'
import { Layout } from '../components/Layout'
import { ItemCard } from '../components/ItemCard'
import { ItemModal } from '../components/ItemModal'
import { AddItemModal } from '../components/AddItemModal'
import { EditItemModal } from '../components/EditItemModal'
import { useApp } from '../context/AppContext'
import type { Item } from '../types'
import './MeusItens.css'

export function MeusItens() {
  const { meusItens, removeItem, confirm, showAlert } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  async function handleDelete(item: Item) {
    const shouldDelete = await confirm({
      title: 'Deletar item',
      message: `Tem certeza que deseja deletar "${item.titulo}"?`,
      confirmText: 'Deletar',
      cancelText: 'Voltar',
      tone: 'danger',
    })

    if (!shouldDelete) return

    removeItem(item.id)
    showAlert('success', 'Item deletado com sucesso!')
    setSelectedItem((prev) => (prev?.id === item.id ? null : prev))
  }

  function handleEdit(item: Item) {
    setSelectedItem(null)
    setEditingItem(item)
  }

  return (
    <Layout>
      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditItemModal
        isOpen={editingItem !== null}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSaved={(updatedItem) => setSelectedItem(updatedItem)}
      />
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        variant="owner"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <main className="page meus-itens-page">
        <div className="meus-itens__header">
          <h1 className="meus-itens__title">Meus itens</h1>
          <button
            type="button"
            className="meus-itens__add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            Adicionar item
          </button>
        </div>

        {meusItens.length === 0 ? (
          <p className="empty">Você ainda não cadastrou itens.</p>
        ) : (
          <div className="grid grid-meus-itens">
            {meusItens.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)}>
                <ItemCard
                  item={item}
                  variant="meu"
                  showOwnerActions
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}
