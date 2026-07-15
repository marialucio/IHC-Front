import { useState, type FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { ItemCard } from '../components/ItemCard'
import { ItemModal } from '../components/ItemModal'
import { SearchIcon } from '../components/icons'
import { useApp } from '../context/AppContext'
import type { Item } from '../types'
import './Catalogo.css'

/** Frame 1 — Catálogo: grid de itens disponíveis para troca. */
export function Catalogo() {
  const {
    catalogo,
    meusItens,
    trocas,
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
  const mensagemTrocaJaSolicitada =
    'Você já enviou uma solicitação para este item. Acompanhe o status na tela de Solicitações.'

  const termoConsultaNormalizado = normalizarTexto(termoAplicado.trim())
  const itensFiltradosConsulta = termoConsultaNormalizado
    ? catalogo.filter((item) => {
        const alvoBusca = normalizarTexto(
          `${item.titulo} ${item.descricao} ${item.categoria} ${item.dono} ${item.localizacao}`,
        )
        return alvoBusca.includes(termoConsultaNormalizado)
      })
    : catalogo

  const itensVisiveis = mostrarSomenteFavoritos
    ? itensFiltradosConsulta.filter((item) => ehFavorito(item.id))
    : itensFiltradosConsulta

  function normalizarTexto(texto: string) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  async function handleConsultar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Placeholder de consulta remota: quando API existir, substituir pelo fetch real aqui.
    showAlert('loading', '')

    await new Promise((resolve) => window.setTimeout(resolve, 500))

    setTermoAplicado(consulta)
    showAlert('success', '')
  }

  function abrirSelecaoTroca(item: Item, podeVoltarParaDetalhes: boolean) {
    if (possuiTrocaPendenteParaItem(item)) return

    setItemAlvoTroca(item)
    setItemSelecionadoTrocaId(null)
    setPermitirVoltarParaDetalhes(podeVoltarParaDetalhes)
  }

  function possuiTrocaPendenteParaItem(item: Item) {
    return trocas.some(
      (troca) =>
        troca.direcao === 'de_mim' &&
        troca.status === 'pendente' &&
        (troca.itemParaId === item.id || (troca.itemPara === item.titulo && troca.contraparte === item.dono)),
    )
  }

  function fecharSelecaoTroca() {
    setItemAlvoTroca(null)
    setItemSelecionadoTrocaId(null)
    setPermitirVoltarParaDetalhes(false)
  }

  function handleSolicitarDoCard(item: Item) {
    abrirSelecaoTroca(item, false)
  }

  function handleSolicitarDoDetalhe(item: Item) {
    abrirSelecaoTroca(item, true)
  }

  async function handleConfirmarTroca() {
    if (!itemAlvoTroca) return

    const alvoTroca = itemAlvoTroca
    const podeVoltarParaDetalhes = permitirVoltarParaDetalhes
    const meuItemSelecionado = meusItens.find((item) => item.id === itemSelecionadoTrocaId)

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

    solicitarTroca(alvoTroca, meuItemSelecionado)
    fecharSelecaoTroca()
  }

  function handleVoltarNaSelecaoTroca() {
    if (permitirVoltarParaDetalhes && itemAlvoTroca) {
      setSelectedItem(itemAlvoTroca)
    }
    fecharSelecaoTroca()
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
          <div className="catalogo-toolbar__actions">
            <form className="catalogo-toolbar__search" onSubmit={handleConsultar}>
              <input
                type="text"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                className="catalogo-toolbar__search-input"
                placeholder="Consultar item, categoria, local..."
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
                  isTradeDisabled={possuiTrocaPendenteParaItem(item)}
                  tradeDisabledTooltip={mensagemTrocaJaSolicitada}
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
          isTradeDisabled={selectedItem ? possuiTrocaPendenteParaItem(selectedItem) : false}
          tradeDisabledTooltip={mensagemTrocaJaSolicitada}
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

              {meusItens.length === 0 ? (
                <p className="catalogo-trade-modal__empty">
                  Voce ainda nao possui itens cadastrados para solicitar uma troca.
                </p>
              ) : (
                <div className="catalogo-trade-modal__list" role="radiogroup" aria-label="Selecao de item para troca">
                  {meusItens.map((item) => (
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
              )}

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
