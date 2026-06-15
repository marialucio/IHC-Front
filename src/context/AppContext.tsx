import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Item, Troca, User } from '../types'
import {
  seedCatalogo,
  seedMeusItens,
  seedTrocas,
  seedUser,
} from '../data/seed'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  catalogo: Item[]
  meusItens: Item[]
  trocas: Troca[]
  itensCurtidos: Item[]
  login: (email: string, senha: string) => boolean
  register: (user: User) => void
  logout: () => void
  addItem: (item: Omit<Item, 'id' | 'dono'>) => void
  removeItem: (id: string) => void
  solicitarTroca: (item: Item) => void
  adicionarFavorito: (item: Item) => void
  removerFavorito: (id: string) => void
  ehFavorito: (id: string) => boolean
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // Usuário cadastrado conhecido (semente). Começa deslogado na landing.
  const [registeredUser, setRegisteredUser] = useState<User>(seedUser)
  const [user, setUser] = useState<User | null>(null)
  const [catalogo] = useState<Item[]>(seedCatalogo)
  const [meusItens, setMeusItens] = useState<Item[]>(seedMeusItens)
  const [trocas, setTrocas] = useState<Troca[]>(seedTrocas)
  const [itensCurtidos, setItensCurtidos] = useState<Item[]>([])

  const value = useMemo<AppState>(
    () => ({
      user,
      isAuthenticated: user !== null,
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
      removeItem: (id) => {
        setMeusItens((prev) => prev.filter((i) => i.id !== id))
      },
      solicitarTroca: (item) => {
        setTrocas((prev) => [
          {
            id: `t${Date.now()}`,
            itemTitulo: item.titulo,
            itemImagem: item.imagem,
            descricao: item.descricao,
            status: 'em_espera',
          },
          ...prev,
        ])
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
    }),
    [user, registeredUser, catalogo, meusItens, trocas, itensCurtidos],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
