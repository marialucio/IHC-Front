export type WsRequestType = 'Comando' | 'Consulta'

interface WsRequest {
  tipo: WsRequestType
  topico: string
  payload: Record<string, unknown>
}

interface WsResponse {
  tipo: 'Evento'
  topico: string
  payload: unknown
}

export class BffApiError extends Error {
  constructor(
    message: string,
    public readonly topico: string,
    public readonly reason?: string,
  ) {
    super(message)
    this.name = 'BffApiError'
  }
}

const DEFAULT_TIMEOUT_MS = 12000

function getBaseWsUrl() {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
  return env?.VITE_BFF_WS_URL ?? 'ws://localhost:8000/ws'
}

function buildWsUrl(token?: string) {
  const baseUrl = getBaseWsUrl()
  if (!token) return baseUrl

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`
}

export function sendWsRequest(
  request: WsRequest,
  options?: { token?: string; timeoutMs?: number },
): Promise<WsResponse> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const socketUrl = buildWsUrl(options?.token)

  return new Promise<WsResponse>((resolve, reject) => {
    let settled = false
    const socket = new WebSocket(socketUrl)

    const timeoutId = window.setTimeout(() => {
      if (settled) return
      settled = true
      socket.close()
      reject(new Error('Tempo limite excedido ao tentar processar sua solicitacao.'))
    }, timeoutMs)

    const finalize = () => {
      window.clearTimeout(timeoutId)
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
    }

    socket.onopen = () => {
      socket.send(JSON.stringify(request))
    }

    socket.onmessage = (event) => {
      if (settled) return

      try {
        const parsed = JSON.parse(event.data) as WsResponse
        settled = true
        finalize()
        socket.close()
        resolve(parsed)
      } catch {
        settled = true
        finalize()
        socket.close()
        reject(new Error('Recebemos uma resposta invalida.'))
      }
    }

    socket.onerror = () => {
      if (settled) return
      settled = true
      finalize()
      socket.close()
      reject(new Error('Falha de conexao. Verifique sua internet e tente novamente.'))
    }

    socket.onclose = () => {
      if (settled) return
      settled = true
      finalize()
      reject(new Error('A conexao foi encerrada antes da resposta.'))
    }
  })
}
