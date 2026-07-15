import { useMemo, useState } from 'react'
import { Layout } from '../components/Layout'
import { CatalogIcon, MailIcon, MyItemsIcon, PhoneIcon, ProfileIcon, SearchIcon, SwapIcon } from '../components/icons'
import { useApp } from '../context/AppContext'
import type { Troca, TrocaStatus } from '../types'
import './Solicitacoes.css'

type ModoSolicitacoes = 'de_mim' | 'para_mim'
type FotoSelecionada =
  | {
      title: string
      image?: string
    }
  | null

const statusLabels: Record<TrocaStatus, string> = {
  pendente: 'Pendente',
  aceita: 'Aceita',
  cancelada: 'Cancelada',
  recusada: 'Recusada',
}

function formatarData(dataISO: string) {
  const [ano, mes, dia] = dataISO.split('-')
  if (!ano || !mes || !dia) return dataISO
  return `${dia}/${mes}/${ano}`
}

function labelDataResposta(status: TrocaStatus) {
  return status === 'cancelada' ? 'Data de cancelamento' : 'Data de resposta'
}

export function Solicitacoes() {
  const { trocas, aceitarSolicitacao, recusarSolicitacao, cancelarSolicitacao, confirm, showAlert } = useApp()
  const [modo, setModo] = useState<ModoSolicitacoes>('de_mim')
  const [selectedTroca, setSelectedTroca] = useState<Troca | null>(null)
  const [fotoSelecionada, setFotoSelecionada] = useState<FotoSelecionada>(null)

  const solicitacoesVisiveis = useMemo(
    () =>
      trocas.filter((troca) => {
        if (troca.direcao !== modo) return false
        if (modo === 'para_mim' && troca.status === 'cancelada') return false
        return true
      }),
    [modo, trocas],
  )

  function runActionWithFeedback(action: () => void, successMessage: string) {
    showAlert('loading', '')

    setTimeout(() => {
      action()
      showAlert('success', successMessage)
    }, 1000)
  }

  async function handleAceitar(id: string) {
    const confirmed = await confirm({
      title: 'Aceitar solicitação',
      message: 'Ao aceitar, os dados de contato serão compartilhados e essa ação não pode ser desfeita. Deseja continuar?',
      confirmText: 'Aceitar',
      cancelText: 'Voltar',
      tone: 'success',
    })

    if (!confirmed) return

    runActionWithFeedback(() => aceitarSolicitacao(id), 'Solicitação aceita com sucesso!')
  }

  async function handleRecusar(id: string) {
    const confirmed = await confirm({
      title: 'Recusar solicitação',
      message: 'Tem certeza que deseja recusar esta solicitação?',
      confirmText: 'Recusar',
      cancelText: 'Voltar',
      tone: 'danger',
    })

    if (!confirmed) return

    runActionWithFeedback(() => recusarSolicitacao(id), 'Solicitação recusada com sucesso!')
  }

  async function handleCancelar(id: string) {
    const confirmed = await confirm({
      title: 'Cancelar solicitação',
      message: 'Tem certeza que deseja cancelar esta solicitação?',
      confirmText: 'Cancelar',
      cancelText: 'Voltar',
      tone: 'danger',
    })

    if (!confirmed) return

    runActionWithFeedback(() => cancelarSolicitacao(id), 'Solicitação cancelada com sucesso!')
  }

  const trocaSelecionadaAtualizada = selectedTroca
    ? trocas.find((troca) => troca.id === selectedTroca.id) ?? selectedTroca
    : null

  return (
    <Layout>
      <main className="page solicitacoes-page">
        <div className="solicitacoes-header">
          <h1 className="solicitacoes-title">Solicitações</h1>

          <div className="solicitacoes-switch" role="group" aria-label="Filtro de solicitações">
            <button
              type="button"
              className={`solicitacoes-switch__button ${modo === 'de_mim' ? 'solicitacoes-switch__button--active' : ''}`}
              onClick={() => setModo('de_mim')}
            >
              <span className="solicitacoes-switch__arrow" aria-hidden="true">↗</span>
              De mim
            </button>
            <button
              type="button"
              className={`solicitacoes-switch__button ${modo === 'para_mim' ? 'solicitacoes-switch__button--active' : ''}`}
              onClick={() => setModo('para_mim')}
            >
              <span className="solicitacoes-switch__arrow" aria-hidden="true">↙</span>
              Para mim
            </button>
          </div>
        </div>

        {solicitacoesVisiveis.length === 0 ? (
          <p className="empty">Nenhuma solicitação encontrada.</p>
        ) : (
          <div className="solicitacoes-grid">
            {solicitacoesVisiveis.map((troca) => (
              <article key={troca.id} className="solicitacao-card">
                <button
                  type="button"
                  className="solicitacao-card__details-btn"
                  onClick={() => setSelectedTroca(troca)}
                  aria-label="Ver detalhes da solicitação"
                  title="Ver detalhes"
                >
                  <SearchIcon />
                </button>

                <div className="solicitacao-card__items">
                  <span className="solicitacao-card__item-name">{troca.itemDe}</span>
                  <SwapIcon className="solicitacao-card__swap-icon" />
                  <span className="solicitacao-card__item-name">{troca.itemPara}</span>
                </div>

                <p className="solicitacao-card__meta">
                  <span className="solicitacao-card__label">Status:</span>
                  <span className={`solicitacao-card__status solicitacao-card__status--${troca.status}`}>
                    {statusLabels[troca.status]}
                  </span>
                </p>

                <p className="solicitacao-card__meta">
                  <span className="solicitacao-card__label">Data de solicitação:</span> {formatarData(troca.dataSolicitacao)}
                </p>

                <p className="solicitacao-card__meta">
                  <span className="solicitacao-card__label">
                    {modo === 'de_mim' ? 'Solicitado para:' : 'Solicitante:'}
                  </span>{' '}
                  {troca.contraparte}
                </p>
              </article>
            ))}
          </div>
        )}

        {trocaSelecionadaAtualizada ? (
          <div className="solicitacao-modal" role="dialog" aria-modal="true" aria-label="Detalhes da solicitação">
            <div
              className="solicitacao-modal__backdrop"
              onClick={() => {
                setSelectedTroca(null)
                setFotoSelecionada(null)
              }}
            />
            <div className="solicitacao-modal__content">
              <button
                type="button"
                className="solicitacao-modal__close"
                onClick={() => {
                  setSelectedTroca(null)
                  setFotoSelecionada(null)
                }}
                aria-label="Fechar detalhes"
              >
                ✕
              </button>

              {fotoSelecionada ? (
                <div className="solicitacao-photo-viewer">
                  <div className="solicitacao-photo-viewer__top">
                    <button
                      type="button"
                      className="solicitacao-photo-viewer__back-btn"
                      onClick={() => setFotoSelecionada(null)}
                    >
                      Voltar
                    </button>
                    <h3 className="solicitacao-photo-viewer__title">{fotoSelecionada.title}</h3>
                  </div>

                  {fotoSelecionada.image ? (
                    <img src={fotoSelecionada.image} alt={fotoSelecionada.title} className="solicitacao-photo-viewer__image" />
                  ) : (
                    <div className="solicitacao-photo-viewer__empty">Imagem não disponível.</div>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="solicitacao-modal__title">Detalhes da solicitação</h2>

                  <div className="solicitacao-modal__section">
                    <h3>
                      <MyItemsIcon className="solicitacao-modal__section-icon" />
                      Meu item
                    </h3>
                    <button
                      type="button"
                      className="solicitacao-modal__view-photo-btn"
                      onClick={() =>
                        setFotoSelecionada({
                          title: trocaSelecionadaAtualizada.meuItem.nome,
                          image: trocaSelecionadaAtualizada.meuItem.imagem,
                        })
                      }
                    >
                      Ver foto
                    </button>
                    <p><strong>Nome:</strong> {trocaSelecionadaAtualizada.meuItem.nome}</p>
                    <p><strong>Descrição:</strong> {trocaSelecionadaAtualizada.meuItem.descricao}</p>
                    <p><strong>Condição:</strong> {trocaSelecionadaAtualizada.meuItem.condicao}</p>
                    <p><strong>Localização:</strong> {trocaSelecionadaAtualizada.meuItem.localizacao}</p>
                  </div>

                  <div className="solicitacao-modal__section">
                    <h3>
                      <CatalogIcon className="solicitacao-modal__section-icon" />
                      {`Item do ${trocaSelecionadaAtualizada.contraparte}`}
                    </h3>
                    <button
                      type="button"
                      className="solicitacao-modal__view-photo-btn"
                      onClick={() =>
                        setFotoSelecionada({
                          title: trocaSelecionadaAtualizada.itemFulano.nome,
                          image: trocaSelecionadaAtualizada.itemFulano.imagem,
                        })
                      }
                    >
                      Ver foto
                    </button>
                    <p><strong>Nome:</strong> {trocaSelecionadaAtualizada.itemFulano.nome}</p>
                    <p><strong>Descrição:</strong> {trocaSelecionadaAtualizada.itemFulano.descricao}</p>
                    <p><strong>Condição:</strong> {trocaSelecionadaAtualizada.itemFulano.condicao}</p>
                    <p><strong>Localização:</strong> {trocaSelecionadaAtualizada.itemFulano.localizacao}</p>
                  </div>

                  <div className="solicitacao-modal__section solicitacao-modal__section--meta">
                    <p>
                      <strong>Status:</strong>
                      <span className={`solicitacao-card__status solicitacao-card__status--${trocaSelecionadaAtualizada.status}`}>
                        {statusLabels[trocaSelecionadaAtualizada.status]}
                      </span>
                    </p>
                    <p><strong>Data de solicitação:</strong> {formatarData(trocaSelecionadaAtualizada.dataSolicitacao)}</p>
                    <p>
                      <strong>{labelDataResposta(trocaSelecionadaAtualizada.status)}:</strong>
                      {trocaSelecionadaAtualizada.dataRespostaCancelamento
                        ? formatarData(trocaSelecionadaAtualizada.dataRespostaCancelamento)
                        : '-'}
                    </p>
                  </div>

                  {trocaSelecionadaAtualizada.status === 'aceita' ? (
                    <div className="solicitacao-modal__section solicitacao-modal__section--contact">
                      <h3>
                        <ProfileIcon className="solicitacao-modal__section-icon" />
                        Contato de {trocaSelecionadaAtualizada.contraparte}
                      </h3>
                      <p className="solicitacao-modal__contact-line">
                        <PhoneIcon className="solicitacao-modal__contact-icon" />
                        {trocaSelecionadaAtualizada.contatoContraparte?.telefone ?? 'Telefone não informado'}
                      </p>
                      <p className="solicitacao-modal__contact-line">
                        <MailIcon className="solicitacao-modal__contact-icon" />
                        {trocaSelecionadaAtualizada.contatoContraparte?.email ?? 'Email não informado'}
                      </p>
                    </div>
                  ) : null}

                  {trocaSelecionadaAtualizada.status === 'pendente' ? (
                    <div className="solicitacao-modal__actions">
                      {trocaSelecionadaAtualizada.direcao === 'para_mim' ? (
                        <>
                          <button
                            type="button"
                            className="solicitacao-card__action-btn solicitacao-card__action-btn--accept"
                            onClick={() => handleAceitar(trocaSelecionadaAtualizada.id)}
                          >
                            Aceitar
                          </button>
                          <button
                            type="button"
                            className="solicitacao-card__action-btn solicitacao-card__action-btn--reject"
                            onClick={() => handleRecusar(trocaSelecionadaAtualizada.id)}
                          >
                            Recusar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="solicitacao-card__action-btn solicitacao-card__action-btn--reject"
                          onClick={() => handleCancelar(trocaSelecionadaAtualizada.id)}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  )
}
