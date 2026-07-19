import { BffApiError, sendWsRequest } from './wsClient'

interface TradeViewPayload {
  id: string
  itemDeId: string
  itemParaId: string
  itemDe: string
  itemPara: string
  meuItem: {
    nome: string
    descricao: string
    condicao: string
    localizacao: string
    imagem?: string
  }
  itemFulano: {
    nome: string
    descricao: string
    condicao: string
    localizacao: string
    imagem?: string
  }
  status: 'pendente' | 'aceita' | 'cancelada' | 'recusada'
  dataSolicitacao: string
  dataRespostaCancelamento?: string
  contraparte: string
  contatoContraparte?: {
    telefone: string
    email: string
  }
  direcao: 'de_mim' | 'para_mim'
}

function parseErrorReason(payload: unknown) {
  if (!payload || typeof payload !== 'object') return undefined
  const reason = (payload as { reason?: unknown }).reason
  return typeof reason === 'string' ? reason : undefined
}

function ensureTrades(payload: unknown): TradeViewPayload[] {
  return Array.isArray(payload) ? (payload as TradeViewPayload[]) : []
}

export async function requestTrade(token: string, requesterAdId: string, targetAdId: string): Promise<void> {
  const response = await sendWsRequest(
    {
      tipo: 'Comando',
      topico: 'trades.troca.solicitar',
      payload: {
        requester_ad_id: requesterAdId,
        target_ad_id: targetAdId,
      },
    },
    { token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico === 'trades.troca.solicitacao_falhou') {
    throw new BffApiError('Nao foi possivel solicitar troca agora.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'trades.troca.solicitada') {
    throw new BffApiError('Resposta inesperada ao solicitar troca.', response.topico, parseErrorReason(response.payload))
  }
}

export async function listTradesFromMe(token: string): Promise<TradeViewPayload[]> {
  const response = await sendWsRequest(
    {
      tipo: 'Consulta',
      topico: 'trades.troca.consultar_de_mim',
      payload: {},
    },
    { token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'trades.troca.de_mim_listadas') {
    throw new BffApiError('Resposta inesperada ao consultar solicitacoes enviadas.', response.topico, parseErrorReason(response.payload))
  }

  return ensureTrades(response.payload)
}

export async function listTradesForMe(token: string): Promise<TradeViewPayload[]> {
  const response = await sendWsRequest(
    {
      tipo: 'Consulta',
      topico: 'trades.troca.consultar_para_mim',
      payload: {},
    },
    { token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'trades.troca.para_mim_listadas') {
    throw new BffApiError('Resposta inesperada ao consultar solicitacoes recebidas.', response.topico, parseErrorReason(response.payload))
  }

  return ensureTrades(response.payload)
}

export async function acceptTrade(token: string, tradeId: string): Promise<void> {
  const response = await sendWsRequest(
    {
      tipo: 'Comando',
      topico: 'trades.troca.aceitar',
      payload: { id: tradeId },
    },
    { token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico === 'trades.troca.decisao_falhou') {
    throw new BffApiError('Nao foi possivel aceitar solicitacao.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'trades.troca.aprovada') {
    throw new BffApiError('Resposta inesperada ao aceitar solicitacao.', response.topico, parseErrorReason(response.payload))
  }
}

export async function rejectTrade(token: string, tradeId: string): Promise<void> {
  const response = await sendWsRequest(
    {
      tipo: 'Comando',
      topico: 'trades.troca.recusar',
      payload: { id: tradeId },
    },
    { token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico === 'trades.troca.decisao_falhou') {
    throw new BffApiError('Nao foi possivel recusar solicitacao.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'trades.troca.recusada') {
    throw new BffApiError('Resposta inesperada ao recusar solicitacao.', response.topico, parseErrorReason(response.payload))
  }
}

export async function cancelTrade(token: string, tradeId: string): Promise<void> {
  const response = await sendWsRequest(
    {
      tipo: 'Comando',
      topico: 'trades.troca.cancelar',
      payload: { id: tradeId },
    },
    { token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico === 'trades.troca.cancelamento_falhou') {
    throw new BffApiError('Nao foi possivel cancelar solicitacao.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'trades.troca.cancelada') {
    throw new BffApiError('Resposta inesperada ao cancelar solicitacao.', response.topico, parseErrorReason(response.payload))
  }
}

export type { TradeViewPayload }
