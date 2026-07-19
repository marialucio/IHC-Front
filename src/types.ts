export interface User {
  nomeCompleto: string
  apelido: string
  telefone: string
  email: string
  senha: string
}

export type ImagePosition = string

export interface Item {
  id: string
  titulo: string
  descricao: string
  imagem: string
  imagemPosicao?: ImagePosition
  disponivelTroca?: boolean
  dono: string // apelido do dono
  categoria: string
  condicao: 'novo' | 'como_novo' | 'bom' | 'usado'
  localizacao: string
  dataCriacao: string // ISO date string
  avaliacaoDono: number // 1-5
  numeroTrocas: number
  termosTroca?: string // o que o dono quer em troca
}

export type TrocaStatus = 'pendente' | 'aceita' | 'cancelada' | 'recusada'

export type TrocaDirecao = 'de_mim' | 'para_mim'

export interface TrocaItemDetalhe {
  nome: string
  descricao: string
  condicao: string
  localizacao: string
  imagem?: string
}

export interface TrocaContato {
  telefone: string
  email: string
}

export interface Troca {
  id: string
  itemDeId?: string
  itemParaId?: string
  itemDe: string
  itemPara: string
  meuItem: TrocaItemDetalhe
  itemFulano: TrocaItemDetalhe
  status: TrocaStatus
  dataSolicitacao: string
  dataRespostaCancelamento?: string
  contraparte: string
  contatoContraparte?: TrocaContato
  direcao: TrocaDirecao
}
