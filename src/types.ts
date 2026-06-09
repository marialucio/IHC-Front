export interface User {
  nomeCompleto: string
  apelido: string
  telefone: string
  email: string
  senha: string
}

export interface Item {
  id: string
  titulo: string
  descricao: string
  imagem: string
  dono: string // apelido do dono
}

export type TrocaStatus = 'em_espera' | 'finalizado'

export interface Troca {
  id: string
  itemTitulo: string
  itemImagem: string
  descricao: string
  status: TrocaStatus
}
