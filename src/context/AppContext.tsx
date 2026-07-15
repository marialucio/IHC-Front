import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Item, Troca, User } from '../types'
import {
  seedCatalogo,
  seedMeusItens,
  seedTrocas,
  seedUser,
} from '../data/seed'

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
  login: (email: string, senha: string) => boolean
  register: (user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  addItem: (item: Omit<Item, 'id' | 'dono' | 'dataCriacao' | 'avaliacaoDono' | 'numeroTrocas'>) => void
  updateItem: (id: string, item: Omit<Item, 'id' | 'dono' | 'dataCriacao' | 'avaliacaoDono' | 'numeroTrocas'>) => void
  removeItem: (id: string) => void
  solicitarTroca: (item: Item, meuItemSelecionado: Item) => void
  aceitarSolicitacao: (id: string) => void
  recusarSolicitacao: (id: string) => void
  cancelarSolicitacao: (id: string) => void
  adicionarFavorito: (item: Item) => void
  removerFavorito: (id: string) => void
  ehFavorito: (id: string) => boolean
  showAlert: (type: AlertType, message: string) => void
  hideAlert: () => void
  confirm: (options: ConfirmOptions) => Promise<boolean>
  confirmDialog: ConfirmDialogState | null
  resolveConfirm: (confirmed: boolean) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const AUTH_STORAGE_KEY = 'trocasusp-auth-user'

  // Usuário cadastrado conhecido (semente). Começa deslogado na landing.
  const [registeredUser, setRegisteredUser] = useState<User>(seedUser)
  const [user, setUser] = useState<User | null>(() => {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  })
  const [catalogo] = useState<Item[]>(seedCatalogo)
  const [meusItens, setMeusItens] = useState<Item[]>(seedMeusItens)
  const [trocas, setTrocas] = useState<Troca[]>(seedTrocas)
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

  const value = useMemo<AppState>(
    () => ({
      user,
      isAuthenticated: user !== null,
      alert,
      catalogo,
      meusItens,
      trocas,
      itensCurtidos,
      login: (email, senha) => {
        if (email === registeredUser.email && senha === registeredUser.senha) {
          setUser(registeredUser)
          return true
        }
        return false
      },
      register: (novo) => {
        setRegisteredUser(novo)
        setUser(novo)
      },
      logout: () => setUser(null),
      updateUser: (novo) => {
        setRegisteredUser(novo)
        setUser(novo)
      },
      addItem: (item) => {
        const novo: Item = {
          ...item,
          id: `i${Date.now()}`,
          dono: user?.apelido ?? registeredUser.apelido,
          dataCriacao: new Date().toISOString().split('T')[0],
          avaliacaoDono: 4,
          numeroTrocas: 0,
        }
        setMeusItens((prev) => [novo, ...prev])
      },
      updateItem: (id, item) => {
        setMeusItens((prev) =>
          prev.map((current) =>
            current.id === id
              ? {
                  ...current,
                  ...item,
                }
              : current,
          ),
        )
      },
      removeItem: (id) => {
        setMeusItens((prev) => prev.filter((i) => i.id !== id))
      },
      solicitarTroca: (item, meuItemSelecionado) => {
        const hoje = new Date().toISOString().split('T')[0]
        const itemMeu = meuItemSelecionado.titulo

        setTrocas((prev) => [
          {
            id: `t${Date.now()}`,
            itemParaId: item.id,
            itemDe: itemMeu,
            itemPara: item.titulo,
            meuItem: {
              nome: itemMeu,
              descricao: meuItemSelecionado.descricao,
              condicao: meuItemSelecionado.condicao,
              localizacao: meuItemSelecionado.localizacao,
              imagem: meuItemSelecionado.imagem,
            },
            itemFulano: {
              nome: item.titulo,
              descricao: item.descricao,
              condicao: item.condicao,
              localizacao: item.localizacao,
              imagem: item.imagem,
            },
            status: 'pendente',
            dataSolicitacao: hoje,
            contraparte: item.dono,
            direcao: 'de_mim',
          },
          ...prev,
        ])
      },
      aceitarSolicitacao: (id) => {
        const hoje = new Date().toISOString().split('T')[0]
        setTrocas((prev) =>
          prev.map((troca) =>
            troca.id === id
              ? {
                  ...troca,
                  status: 'aceita',
                  dataRespostaCancelamento: hoje,
                  contatoContraparte:
                    troca.contatoContraparte ?? {
                      telefone: '(11) 90000-0000',
                      email: `${troca.contraparte.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                    },
                }
              : troca,
          ),
        )
      },
      recusarSolicitacao: (id) => {
        const hoje = new Date().toISOString().split('T')[0]
        setTrocas((prev) =>
          prev.map((troca) =>
            troca.id === id
              ? {
                  ...troca,
                  status: 'recusada',
                  dataRespostaCancelamento: hoje,
                }
              : troca,
          ),
        )
      },
      cancelarSolicitacao: (id) => {
        const hoje = new Date().toISOString().split('T')[0]
        setTrocas((prev) =>
          prev.map((troca) =>
            troca.id === id
              ? {
                  ...troca,
                  status: 'cancelada',
                  dataRespostaCancelamento: hoje,
                }
              : troca,
          ),
        )
      },
      adicionarFavorito: (item) => {
        setItensCurtidos((prev) => {
          if (prev.some((i) => i.id === item.id)) return prev
          return [item, ...prev]
        })
      },
      removerFavorito: (id) => {
        setItensCurtidos((prev) => prev.filter((i) => i.id !== id))
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
    [user, alert, registeredUser, catalogo, meusItens, trocas, itensCurtidos, confirmDialog],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
