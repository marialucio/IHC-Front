import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { ItemCard } from '../components/ItemCard'
import { ItemModal } from '../components/ItemModal'
import { SearchIcon } from '../components/icons'
import { useApp } from '../context/AppContext'
import type { Item } from '../types'
import { BffApiError } from '../api/wsClient'
import './Catalogo.css'

/** Frame 1 — Catálogo: grid de itens disponíveis para troca. */
export function Catalogo() {
  const {
    catalogo,
    meusItens,
    trocas,
    loadCatalogo,
    loadMeusItens,
    loadTrocas,
    solicitarTroca,
    adicionarFavorito,
    removerFavorito,
    ehFavorito,
    confirm,
    showAlert,
  } = useApp()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [mostrarSomenteFavoritos, setMostrarSomenteFavoritos] = useState(false)
  const [consulta, setConsulta] = useState('')
  const [termoAplicado, setTermoAplicado] = useState('')
  const [itemAlvoTroca, setItemAlvoTroca] = useState<Item | null>(null)
  const [itemSelecionadoTrocaId, setItemSelecionadoTrocaId] = useState<string | null>(null)
  const [permitirVoltarParaDetalhes, setPermitirVoltarParaDetalhes] = useState(false)
  const initialLoadDoneRef = useRef(false)
  const mensagemSemItensDisponiveis =
    'Você ainda não possui itens disponíveis para solicitar uma troca.'
  const mensagemTrocaParJaSolicitada =
    'Troca já solicitada.'
  const meusItensDisponiveis = meusItens.filter((item) => item.disponivelTroca)

  function mapTradeRequestErrorMessage(error: BffApiError) {
    if (error.topico.endsWith('_nao_autorizado')) {
      return 'Sua sessão expirou. Faça login novamente.'
    }

    if (error.reason === 'cannot_request_own_ad') {
      return 'Você não pode solicitar troca para um item seu.'
    }

    if (error.reason === 'target_ad_not_found') {
      return 'Esse item não foi encontrado para troca.'
    }

    if (error.reason === 'target_ad_unavailable') {
      return 'Esse item não está mais disponível para troca.'
    }

    if (error.reason === 'requester_ad_not_found') {
      return 'O item selecionado da sua lista não foi encontrado.'
    }

    if (error.reason === 'requester_ad_unavailable') {
      return 'O item selecionado da sua lista não está mais disponível para troca.'
    }

    if (error.reason === 'ad_already_traded') {
      return 'Um dos itens envolvidos já foi trocado e não aceita novas solicitações.'
    }

    if (error.reason === 'duplicate_trade_not_allowed') {
      return mensagemTrocaParJaSolicitada
    }

    return 'Não foi possível enviar solicitação de troca agora.'
  }

  function mapFavoriteErrorMessage(error: BffApiError) {
    if (error.topico.endsWith('_nao_autorizado')) {
      return 'Sua sessão expirou. Faça login novamente.'
    }

    if (error.reason === 'cannot_favorite_own_ad') {
      return 'Você não pode favoritar um item seu.'
    }

    if (error.reason === 'ad_unavailable') {
      return 'Esse item não está mais disponível para troca.'
    }

    if (error.reason === 'ad_not_found') {
      return 'Esse item não foi encontrado.'
    }

    if (error.topico === 'sistema.mensagem.nao_reconhecida' || error.topico.endsWith('_falhou')) {
      return 'O recurso de favoritos ainda não está disponível no servidor.'
    }

    return 'Não foi possível atualizar favoritos agora.'
  }

  const itensVisiveis = mostrarSomenteFavoritos
    ? catalogo.filter((item) => ehFavorito(item.id))
    : catalogo

  useEffect(() => {
    if (initialLoadDoneRef.current) return
    initialLoadDoneRef.current = true

    let mounted = true

    async function carregarCatalogoInicial() {
      try {
        await Promise.all([loadCatalogo(), loadTrocas(), loadMeusItens()])
      } catch {
        if (!mounted) return
        showAlert('error', 'Não foi possível carregar o catálogo agora. Tente novamente.')
      }
    }

    void carregarCatalogoInicial()

    return () => {
      mounted = false
    }
  }, [loadCatalogo, loadMeusItens, loadTrocas, showAlert])

  async function handleConsultar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const termo = consulta.trim()

    showAlert('loading', '')

    try {
      await loadCatalogo(termo)
      setTermoAplicado(termo)
      showAlert('success', '')
    } catch (error) {
      if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
        showAlert('warning', 'Sua sessão expirou. Faça login novamente.')
        return
      }
      showAlert('error', 'Não foi possível consultar o catálogo agora. Tente novamente.')
    }
  }

  function possuiTrocaNaoCanceladaParaPar(
    itemAlvoId: string,
    meuItemId: string,
    trocasLista: typeof trocas = trocas,
  ) {
    return trocasLista.some(
      (troca) =>
        troca.direcao === 'de_mim' &&
        troca.status !== 'cancelada' &&
        troca.itemParaId === itemAlvoId &&
        troca.itemDeId === meuItemId,
    )
  }

  function listarItensElegiveisParaTroca(
    itemAlvo: Item,
    itensDisponiveisLista: typeof meusItensDisponiveis = meusItensDisponiveis,
    trocasLista: typeof trocas = trocas,
  ) {
    return itensDisponiveisLista.filter(
      (itemMeu) => !possuiTrocaNaoCanceladaParaPar(itemAlvo.id, itemMeu.id, trocasLista),
    )
  }

  function solicitacaoDesabilitadaParaItemAlvo(itemAlvo: Item) {
    if (meusItensDisponiveis.length === 0) return true
    return listarItensElegiveisParaTroca(itemAlvo).length === 0
  }

  async function abrirSelecaoTroca(item: Item, podeVoltarParaDetalhes: boolean) {
    if (solicitacaoDesabilitadaParaItemAlvo(item)) return

    try {
      const [meusItensCarregados, trocasCarregadas] = await Promise.all([
        loadMeusItens(),
        loadTrocas(),
      ])

      const itensDisponiveisCarregados = meusItensCarregados.filter((item) => item.disponivelTroca)

      if (itensDisponiveisCarregados.length === 0) {
        showAlert('warning', mensagemSemItensDisponiveis)
        return
      }

      if (listarItensElegiveisParaTroca(item, itensDisponiveisCarregados, trocasCarregadas).length === 0) {
        showAlert('warning', mensagemTrocaParJaSolicitada)
        return
      }
    } catch (error) {
      if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
        showAlert('warning', 'Sua sessão expirou. Faça login novamente.')
      } else {
        showAlert('error', 'Não foi possível carregar seus itens e solicitações agora. Tente novamente.')
      }
      return
    }

    setItemAlvoTroca(item)
    setItemSelecionadoTrocaId(null)
    setPermitirVoltarParaDetalhes(podeVoltarParaDetalhes)
  }

  function fecharSelecaoTroca() {
    setItemAlvoTroca(null)
    setItemSelecionadoTrocaId(null)
    setPermitirVoltarParaDetalhes(false)
  }

  function handleSolicitarDoCard(item: Item) {
    void abrirSelecaoTroca(item, false)
  }

  function handleSolicitarDoDetalhe(item: Item) {
    void abrirSelecaoTroca(item, true)
  }

  async function handleConfirmarTroca() {
    if (!itemAlvoTroca) return

    const alvoTroca = itemAlvoTroca
    const podeVoltarParaDetalhes = permitirVoltarParaDetalhes
    const itensElegiveis = listarItensElegiveisParaTroca(alvoTroca)
    const meuItemSelecionado = itensElegiveis.find((item) => item.id === itemSelecionadoTrocaId)

    if (!meuItemSelecionado) {
      showAlert('warning', 'Selecione um item da sua lista para continuar.')
      return
    }

    // Fecha a modal de selecao para que o confirm a substitua, sem sobreposicao.
    setItemAlvoTroca(null)

    const confirmed = await confirm({
      title: 'Confirmar solicitação de troca',
      message:
        'Ao confirmar, sua solicitação será enviada agora. Seus dados de contato só serão compartilhados quando a outra pessoa aceitar a troca. Enquanto o status estiver PENDENTE, você poderá cancelar a solicitação na tela de Solicitações.',
      confirmText: 'Confirmar troca',
      cancelText: 'Voltar',
      tone: 'default',
    })

    if (!confirmed) {
      setItemAlvoTroca(alvoTroca)
      setItemSelecionadoTrocaId(meuItemSelecionado.id)
      setPermitirVoltarParaDetalhes(podeVoltarParaDetalhes)
      return
    }

    try {
      await solicitarTroca(alvoTroca, meuItemSelecionado)
      showAlert('success', 'Solicitação de troca enviada com sucesso!')
      fecharSelecaoTroca()
    } catch (error) {
      if (error instanceof BffApiError) {
        const message = mapTradeRequestErrorMessage(error)
        showAlert(error.topico.endsWith('_nao_autorizado') ? 'warning' : 'error', message)
      } else {
        showAlert('error', 'Não foi possível enviar solicitação de troca agora.')
      }
      setItemAlvoTroca(alvoTroca)
      setItemSelecionadoTrocaId(meuItemSelecionado.id)
      setPermitirVoltarParaDetalhes(podeVoltarParaDetalhes)
    }
  }

  function handleVoltarNaSelecaoTroca() {
    if (permitirVoltarParaDetalhes && itemAlvoTroca) {
      setSelectedItem(itemAlvoTroca)
    }
    fecharSelecaoTroca()
  }

  async function handleToggleFavorito(item: Item) {
    try {
      if (ehFavorito(item.id)) {
        await removerFavorito(item.id)
      } else {
        await adicionarFavorito(item)
      }
    } catch (error) {
      if (error instanceof BffApiError) {
        const message = mapFavoriteErrorMessage(error)
        showAlert(error.topico.endsWith('_nao_autorizado') ? 'warning' : 'error', message)
      } else {
        showAlert('error', 'Não foi possível atualizar favoritos agora.')
      }
    }
  }

  return (
    <Layout>
      <main className="page catalogo-page">
        <div className="catalogo-toolbar">
          <h1 className="catalogo-toolbar__title">Catálogo</h1>
          <div className="catalogo-toolbar__actions">
            <form className="catalogo-toolbar__search" onSubmit={handleConsultar}>
              <input
                type="text"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                className="catalogo-toolbar__search-input"
                placeholder="Consultar por titulo do item..."
                aria-label="Consultar no catálogo"
              />
              <button type="submit" className="catalogo-toolbar__search-btn" aria-label="Buscar">
                <SearchIcon />
              </button>
            </form>

            <button
              type="button"
              className={`catalogo-toolbar__filter-btn ${mostrarSomenteFavoritos ? 'catalogo-toolbar__filter-btn--active' : ''}`}
              onClick={() => setMostrarSomenteFavoritos((prev) => !prev)}
            >
              {mostrarSomenteFavoritos ? 'Mostrar todos' : 'Filtrar favoritos'}
            </button>
          </div>
        </div>

        {itensVisiveis.length === 0 ? (
          <p className="empty">
            {termoAplicado.trim()
              ? 'Nenhum resultado encontrado para sua consulta.'
              : mostrarSomenteFavoritos
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
                  onAction={handleSolicitarDoCard}
                  isTradeDisabled={solicitacaoDesabilitadaParaItemAlvo(item)}
                  tradeDisabledTooltip={mensagemTrocaParJaSolicitada}
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
          onAction={handleSolicitarDoDetalhe}
          isTradeDisabled={selectedItem ? solicitacaoDesabilitadaParaItemAlvo(selectedItem) : false}
          tradeDisabledTooltip={mensagemTrocaParJaSolicitada}
          onFavorite={handleToggleFavorito}
          isFavorite={selectedItem ? ehFavorito(selectedItem.id) : false}
        />

        {itemAlvoTroca ? (
          <div className="catalogo-trade-modal__overlay" onClick={fecharSelecaoTroca}>
            <div className="catalogo-trade-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="catalogo-trade-modal__title">Escolha um item seu para troca</h2>
              <p className="catalogo-trade-modal__subtitle">
                Item desejado: <strong>{itemAlvoTroca.titulo}</strong>
              </p>

              {(() => {
                const itensElegiveis = listarItensElegiveisParaTroca(itemAlvoTroca)

                if (meusItensDisponiveis.length === 0) {
                  return (
                    <p className="catalogo-trade-modal__empty">
                          {mensagemSemItensDisponiveis}
                    </p>
                  )
                }

                if (itensElegiveis.length === 0) {
                  return <p className="catalogo-trade-modal__empty">{mensagemTrocaParJaSolicitada}</p>
                }

                return (
                  <div className="catalogo-trade-modal__list" role="radiogroup" aria-label="Selecao de item para troca">
                    {itensElegiveis.map((item) => (
                      <label key={item.id} className="catalogo-trade-modal__option">
                        <input
                          type="radio"
                          name="meu-item-troca"
                          checked={itemSelecionadoTrocaId === item.id}
                          onChange={() => setItemSelecionadoTrocaId(item.id)}
                        />
                        <span>{item.titulo}</span>
                      </label>
                    ))}
                  </div>
                )
              })()}

              <div className="catalogo-trade-modal__actions">
                <button
                  type="button"
                  className="catalogo-trade-modal__btn catalogo-trade-modal__btn--secondary"
                  onClick={handleVoltarNaSelecaoTroca}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className="catalogo-trade-modal__btn catalogo-trade-modal__btn--primary"
                  onClick={handleConfirmarTroca}
                  disabled={!itemSelecionadoTrocaId}
                >
                  Confirmar troca
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  )
}
