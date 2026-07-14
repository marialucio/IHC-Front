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
  dono: string // apelido do dono
  categoria: string
  condicao: 'novo' | 'como_novo' | 'bom' | 'usado'
  localizacao: string
  dataCriacao: string // ISO date string
  avaliacaoDono: number // 1-5
  numeroTrocas: number
  termosTroca?: string // o que o dono quer em troca
}

export type TrocaStatus = 'em_espera' | 'finalizado'

export interface Troca {
  id: string
  itemTitulo: string
  itemImagem: string
  descricao: string
  status: TrocaStatus
}
