import { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { ItemCard } from '../components/ItemCard'
import { ItemModal } from '../components/ItemModal'
import { AddItemModal } from '../components/AddItemModal'
import { EditItemModal } from '../components/EditItemModal'
import { useApp } from '../context/AppContext'
import type { Item } from '../types'
import { BffApiError } from '../api/wsClient'
import './MeusItens.css'

export function MeusItens() {
  const { meusItens, trocas, loadMeusItens, loadTrocas, removeItem, confirm, showAlert } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const initialLoadDoneRef = useRef(false)
  const blockedActionMessage = 'Item já trocado não pode ser editado nem deletado.'

  function isItemLocked(item: Item) {
    return item.disponivelTroca === false
  }

  function itemEnvolvidoEmTrocaAceita(itemId: string) {
    return trocas.some(
      (troca) =>
        troca.status === 'aceita' && (troca.itemDeId === itemId || troca.itemParaId === itemId),
    )
  }

  const itensVisiveis = meusItens.filter(
    (item) => item.disponivelTroca !== false || itemEnvolvidoEmTrocaAceita(item.id),
  )

  useEffect(() => {
    if (initialLoadDoneRef.current) return
    initialLoadDoneRef.current = true

    let mounted = true

    async function carregarMeusItens() {
      try {
        await Promise.all([loadMeusItens(), loadTrocas()])
      } catch {
        if (!mounted) return
        showAlert('error', 'Não foi possível carregar seus itens agora.')
      }
    }

    void carregarMeusItens()

    return () => {
      mounted = false
    }
  }, [loadMeusItens, loadTrocas, showAlert])

  async function handleDelete(item: Item) {
    try {
      await loadTrocas()
    } catch {
      showAlert('error', 'Não foi possível carregar as solicitações deste item agora.')
      return
    }

    const mensagemConfirmacao =
      `Tem certeza que deseja deletar "${item.titulo}"? ` +
      'Esta ação irá encerrar solicitações de troca pendentes com este item.'

    const shouldDelete = await confirm({
      title: 'Deletar item',
      message: mensagemConfirmacao,
      confirmText: 'Deletar',
      cancelText: 'Voltar',
      tone: 'danger',
    })

    if (!shouldDelete) return

    try {
      await removeItem(item.id)
      showAlert('success', 'Item deletado com sucesso!')
      setSelectedItem((prev) => (prev?.id === item.id ? null : prev))
    } catch (error) {
      if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
        showAlert('warning', 'Sua sessão expirou. Faça login novamente.')
      } else {
        showAlert('error', 'Não foi possível deletar item agora.')
      }
    }
  }

  function handleEdit(item: Item) {
    if (isItemLocked(item)) {
      showAlert('warning', blockedActionMessage)
      return
    }
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
        ownerActionsDisabled={selectedItem ? isItemLocked(selectedItem) : false}
        ownerActionsDisabledTooltip={blockedActionMessage}
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

        {itensVisiveis.length === 0 ? (
          <p className="empty">Você ainda não cadastrou itens.</p>
        ) : (
          <div className="grid grid-meus-itens">
            {itensVisiveis.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)}>
                <ItemCard
                  item={item}
                  variant="meu"
                  showOwnerActions
                  ownerActionsDisabled={isItemLocked(item)}
                  ownerActionsDisabledTooltip={blockedActionMessage}
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
