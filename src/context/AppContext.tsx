import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Item, Troca, User } from '../types'
import { BffApiError } from '../api/wsClient'
import { loginUser, registerUser, updateProfileUser } from '../api/auth'
import {
  createAd,
  deleteAd,
  favoriteAd,
  listAvailableAds,
  listFavoriteAdIds,
  listMyAds,
  searchAvailableAds,
  updateAd,
  type CreateOrUpdateAdParams,
  type BackendAd,
  unfavoriteAd,
} from '../api/ads'
import {
  acceptTrade,
  cancelTrade,
  listTradesForMe,
  listTradesFromMe,
  rejectTrade,
  requestTrade,
  type TradeViewPayload,
} from '../api/trades'

export type AlertType = 'success' | 'error' | 'warning' | 'loading'

export interface AppAlert {
  id: number
  type: AlertType
  message: string
}

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  tone?: 'default' | 'danger' | 'success'
}

interface ConfirmDialogState {
  title: string
  message: string
  confirmText: string
  cancelText: string
  tone: 'default' | 'danger' | 'success'
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  alert: AppAlert | null
  catalogo: Item[]
  meusItens: Item[]
  trocas: Troca[]
  itensCurtidos: Item[]
  loadCatalogo: (query?: string) => Promise<Item[]>
  loadMeusItens: () => Promise<Item[]>
  loadTrocas: () => Promise<Troca[]>
  login: (email: string, senha: string) => Promise<boolean>
  register: (user: User) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => Promise<boolean>
  addItem: (item: Omit<Item, 'id' | 'dono' | 'dataCriacao' | 'avaliacaoDono' | 'numeroTrocas'>) => Promise<void>
  updateItem: (id: string, item: Omit<Item, 'id' | 'dono' | 'dataCriacao' | 'avaliacaoDono' | 'numeroTrocas'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  solicitarTroca: (item: Item, meuItemSelecionado: Item) => Promise<void>
  aceitarSolicitacao: (id: string) => Promise<void>
  recusarSolicitacao: (id: string) => Promise<void>
  cancelarSolicitacao: (id: string) => Promise<void>
  adicionarFavorito: (item: Item) => Promise<void>
  removerFavorito: (id: string) => Promise<void>
  ehFavorito: (id: string) => boolean
  showAlert: (type: AlertType, message: string) => void
  hideAlert: () => void
  confirm: (options: ConfirmOptions) => Promise<boolean>
  confirmDialog: ConfirmDialogState | null
  resolveConfirm: (confirmed: boolean) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

function toNickname(nomeCompleto: string) {
  const trimmed = nomeCompleto.trim()
  if (!trimmed) return 'Usuario'

  const parts = trimmed.split(/\s+/)
  return parts.slice(0, 2).join(' ')
}

function toItemCondition(raw?: string): Item['condicao'] {
  if (raw === 'novo' || raw === 'como_novo' || raw === 'bom' || raw === 'usado') return raw

  if (raw === 'new') return 'novo'
  if (raw === 'like_new') return 'como_novo'
  if (raw === 'good') return 'bom'

  return 'usado'
}

function mapCatalogItem(ad: BackendAd): Item {
  return {
    id: ad.id,
    titulo: ad.title,
    descricao: ad.description,
    imagem: ad.image ?? '',
    imagemPosicao: ad.image_position ?? undefined,
    disponivelTroca: ad.is_available ?? true,
    dono: ad.owner_name || 'Usuario',
    categoria: ad.category ?? 'Geral',
    condicao: toItemCondition(ad.condition),
    localizacao: ad.location ?? 'Nao informado',
    dataCriacao: new Date().toISOString().split('T')[0],
    avaliacaoDono: 4,
    numeroTrocas: 0,
    termosTroca: ad.trade_terms ?? undefined,
  }
}

function toAdPayload(item: Omit<Item, 'id' | 'dono' | 'dataCriacao' | 'avaliacaoDono' | 'numeroTrocas'>): CreateOrUpdateAdParams {
  return {
    title: item.titulo,
    description: item.descricao,
    image: item.imagem,
    image_position: item.imagemPosicao,
    category: item.categoria,
    condition: item.condicao,
    location: item.localizacao,
    trade_terms: item.termosTroca,
  }
}

function mapOwnedItem(ad: BackendAd, ownerName: string): Item {
  return {
    id: ad.id,
    titulo: ad.title,
    descricao: ad.description,
    imagem: ad.image ?? '',
    imagemPosicao: ad.image_position ?? undefined,
    disponivelTroca: ad.is_available ?? true,
    dono: ownerName,
    categoria: ad.category ?? 'Geral',
    condicao: toItemCondition(ad.condition),
    localizacao: ad.location ?? 'Nao informado',
    dataCriacao: new Date().toISOString().split('T')[0],
    avaliacaoDono: 4,
    numeroTrocas: 0,
    termosTroca: ad.trade_terms ?? undefined,
  }
}

function mapTradePayload(trade: TradeViewPayload): Troca {
  return {
    id: trade.id,
    itemDeId: trade.itemDeId,
    itemParaId: trade.itemParaId,
    itemDe: trade.itemDe,
    itemPara: trade.itemPara,
    meuItem: trade.meuItem,
    itemFulano: trade.itemFulano,
    status: trade.status,
    dataSolicitacao: trade.dataSolicitacao,
    dataRespostaCancelamento: trade.dataRespostaCancelamento,
    contraparte: trade.contraparte,
    contatoContraparte: trade.contatoContraparte,
    direcao: trade.direcao,
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const AUTH_STORAGE_KEY = 'trocasusp-auth-user'
  const AUTH_TOKEN_STORAGE_KEY = 'trocasusp-auth-token'

  const [user, setUser] = useState<User | null>(() => {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  })
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  })
  const [catalogo, setCatalogo] = useState<Item[]>([])
  const [meusItens, setMeusItens] = useState<Item[]>([])
  const [trocas, setTrocas] = useState<Troca[]>([])
  const [itensCurtidos, setItensCurtidos] = useState<Item[]>([])
  const [alert, setAlert] = useState<AppAlert | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null)
  const confirmResolverRef = useRef<((confirmed: boolean) => void) | null>(null)

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      return
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [user])

  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken)
      return
    }

    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }, [authToken])

  const value = useMemo<AppState>(
    () => ({
      user,
      isAuthenticated: user !== null && authToken !== null,
      alert,
      catalogo,
      meusItens,
      trocas,
      itensCurtidos,
      loadCatalogo: async (query) => {
        if (!authToken) {
          setCatalogo([])
          return []
        }

        const normalizedQuery = query?.trim() ?? ''

        try {
          const ads = normalizedQuery
            ? await searchAvailableAds(authToken, normalizedQuery)
            : await listAvailableAds(authToken)

          let favoriteIds: string[] = []
          try {
            favoriteIds = await listFavoriteAdIds(authToken)
          } catch (error) {
            if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
              throw error
            }
          }

          const mapped = ads.map(mapCatalogItem).filter((item) => item.disponivelTroca)
          const favoriteIdSet = new Set(favoriteIds)

          setCatalogo(mapped)
          setItensCurtidos(mapped.filter((item) => favoriteIdSet.has(item.id)))
          return mapped
        } catch (error) {
          if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
            setUser(null)
            setAuthToken(null)
            setCatalogo([])
            return []
          }
          throw error
        }
      },
      loadMeusItens: async () => {
        if (!authToken) {
          setMeusItens([])
          return []
        }

        try {
          const ads = await listMyAds(authToken)
          const ownerName = user?.apelido ?? 'Usuario'
          const mapped = ads.map((ad) => mapOwnedItem(ad, ownerName))
          setMeusItens(mapped)
          return mapped
        } catch (error) {
          if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
            setUser(null)
            setAuthToken(null)
            setMeusItens([])
            return []
          }
          throw error
        }
      },
      loadTrocas: async () => {
        if (!authToken) {
          setTrocas([])
          return []
        }

        try {
          const [deMim, paraMim] = await Promise.all([
            listTradesFromMe(authToken),
            listTradesForMe(authToken),
          ])

          const mapped = [...deMim, ...paraMim].map(mapTradePayload)
          setTrocas(mapped)
          return mapped
        } catch (error) {
          if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
            setUser(null)
            setAuthToken(null)
            setTrocas([])
            return []
          }
          throw error
        }
      },
      login: async (email, senha) => {
        try {
          const result = await loginUser({ email, password: senha })

          setAuthToken(result.accessToken)
          setUser({
            nomeCompleto: result.profile.name,
            apelido: toNickname(result.profile.name),
            telefone: result.profile.phone,
            email: result.profile.email,
            senha,
          })
          return true
        } catch (error) {
          if (error instanceof BffApiError && error.topico === 'users.usuario.autenticacao_falhou') {
            return false
          }
          throw error
        }
      },
      register: async (novo) => {
        try {
          await registerUser({
            name: novo.nomeCompleto,
            email: novo.email,
            phone: novo.telefone,
            password: novo.senha,
          })
          return true
        } catch (error) {
          if (error instanceof BffApiError && error.topico === 'users.usuario.cadastro_falhou') {
            return false
          }
          throw error
        }
      },
      logout: () => {
        setUser(null)
        setAuthToken(null)
      },
      updateUser: async (novo) => {
        if (!authToken || !user) return false

        try {
          const result = await updateProfileUser({
            token: authToken,
            name: novo.nomeCompleto,
            email: novo.email,
            phone: novo.telefone,
          })

          if (result.failed) {
            return false
          }

          setUser({
            ...novo,
            nomeCompleto: result.profile.name,
            email: result.profile.email,
            telefone: result.profile.phone,
          })
          return true
        } catch (error) {
          if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
            setUser(null)
            setAuthToken(null)
            return false
          }
          throw error
        }
      },
      addItem: async (item) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'ads.anuncio.criar_nao_autorizado', 'missing_token')
        }

        const created = await createAd(authToken, toAdPayload(item))
        const mapped = mapOwnedItem(created, user?.apelido ?? 'Usuario')
        setMeusItens((prev) => [mapped, ...prev])
      },
      updateItem: async (id, item) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'ads.anuncio.atualizar_nao_autorizado', 'missing_token')
        }

        const updated = await updateAd(authToken, id, toAdPayload(item))
        const mapped = mapOwnedItem(updated, user?.apelido ?? 'Usuario')
        setMeusItens((prev) => prev.map((current) => (current.id === id ? mapped : current)))
      },
      removeItem: async (id) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'ads.anuncio.remover_nao_autorizado', 'missing_token')
        }

        await deleteAd(authToken, id)
        setMeusItens((prev) => prev.filter((i) => i.id !== id))
      },
      solicitarTroca: async (item, meuItemSelecionado) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'trades.troca.solicitar_nao_autorizado', 'missing_token')
        }

        await requestTrade(authToken, meuItemSelecionado.id, item.id)
        const [deMim, paraMim] = await Promise.all([
          listTradesFromMe(authToken),
          listTradesForMe(authToken),
        ])
        setTrocas([...deMim, ...paraMim].map(mapTradePayload))
      },
      aceitarSolicitacao: async (id) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'trades.troca.aceitar_nao_autorizado', 'missing_token')
        }

        await acceptTrade(authToken, id)
        const [deMim, paraMim] = await Promise.all([
          listTradesFromMe(authToken),
          listTradesForMe(authToken),
        ])
        setTrocas([...deMim, ...paraMim].map(mapTradePayload))
      },
      recusarSolicitacao: async (id) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'trades.troca.recusar_nao_autorizado', 'missing_token')
        }

        await rejectTrade(authToken, id)
        const [deMim, paraMim] = await Promise.all([
          listTradesFromMe(authToken),
          listTradesForMe(authToken),
        ])
        setTrocas([...deMim, ...paraMim].map(mapTradePayload))
      },
      cancelarSolicitacao: async (id) => {
        if (!authToken) {
          throw new BffApiError('Sessao nao autorizada.', 'trades.troca.cancelar_nao_autorizado', 'missing_token')
        }

        await cancelTrade(authToken, id)
        const [deMim, paraMim] = await Promise.all([
          listTradesFromMe(authToken),
          listTradesForMe(authToken),
        ])
        setTrocas([...deMim, ...paraMim].map(mapTradePayload))
      },
      adicionarFavorito: async (item) => {
        if (!authToken) {
          throw new BffApiError(
            'Sessao nao autorizada.',
            'ads.anuncio.favoritar_nao_autorizado',
            'missing_token',
          )
        }

        try {
          await favoriteAd(authToken, item.id)
          setItensCurtidos((prev) => {
            if (prev.some((i) => i.id === item.id)) return prev
            return [item, ...prev]
          })
        } catch (error) {
          if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
            setUser(null)
            setAuthToken(null)
            setCatalogo([])
            setItensCurtidos([])
          }
          throw error
        }
      },
      removerFavorito: async (id) => {
        if (!authToken) {
          throw new BffApiError(
            'Sessao nao autorizada.',
            'ads.anuncio.desfavoritar_nao_autorizado',
            'missing_token',
          )
        }

        try {
          await unfavoriteAd(authToken, id)
          setItensCurtidos((prev) => prev.filter((i) => i.id !== id))
        } catch (error) {
          if (error instanceof BffApiError && error.topico.endsWith('_nao_autorizado')) {
            setUser(null)
            setAuthToken(null)
            setCatalogo([])
            setItensCurtidos([])
          }
          throw error
        }
      },
      ehFavorito: (id) => {
        return itensCurtidos.some((i) => i.id === id)
      },
      showAlert: (type, message) => {
        setAlert({
          id: Date.now(),
          type,
          message,
        })
      },
      hideAlert: () => {
        setAlert(null)
      },
      confirm: (options) => {
        const normalized: ConfirmDialogState = {
          title: options.title ?? 'Confirmar deleção',
          message: options.message,
          confirmText: options.confirmText ?? 'Deletar',
          cancelText: options.cancelText ?? 'Voltar',
          tone: options.tone ?? 'danger',
        }

        setConfirmDialog(normalized)
        return new Promise<boolean>((resolve) => {
          confirmResolverRef.current = resolve
        })
      },
      confirmDialog,
      resolveConfirm: (confirmed) => {
        confirmResolverRef.current?.(confirmed)
        confirmResolverRef.current = null
        setConfirmDialog(null)
      },
    }),
    [user, authToken, alert, catalogo, meusItens, trocas, itensCurtidos, confirmDialog],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
