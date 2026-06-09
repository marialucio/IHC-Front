import type { Item, Troca, User } from '../types'

/** Foto real (apenas no item do jaleco). Demais ficam vazias = placeholder cinza. */
export const itemImg = '/assets/item-exemplo.png'

export const seedUser: User = {
  nomeCompleto: 'Fabiana Mendes Silva Oliveira',
  apelido: 'Fabiana Mendes',
  telefone: '(11) 99999-9999',
  email: 'fabiana@email.com',
  senha: 'senha1234',
}

export const seedCatalogo: Item[] = [
  {
    id: '1',
    titulo: 'Jaleco Tamanho M',
    descricao:
      'Estou trocando esse jaleco por qualquer coisa que tenha um valor parecido. Estou prestes a me formar na faculdade e não vou mais usar.',
    imagem: itemImg,
    dono: 'Fabiana Mendes',
  },
  {
    id: '2',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
  {
    id: '3',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
  {
    id: '4',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
  {
    id: '5',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
  {
    id: '6',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
  {
    id: '7',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
  {
    id: '8',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fulano de Tal',
  },
]

export const seedMeusItens: Item[] = [
  { ...seedCatalogo[0] }, // jaleco com foto
  {
    id: 'm2',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fabiana Mendes',
  },
  {
    id: 'm3',
    titulo: 'Item',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imagem: '',
    dono: 'Fabiana Mendes',
  },
]

const loremDesc =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export const seedTrocas: Troca[] = [
  { id: 't1', itemTitulo: 'Item', itemImagem: '', descricao: loremDesc, status: 'em_espera' },
  { id: 't2', itemTitulo: 'Item', itemImagem: '', descricao: loremDesc, status: 'finalizado' },
  { id: 't3', itemTitulo: 'Item', itemImagem: '', descricao: loremDesc, status: 'em_espera' },
  { id: 't4', itemTitulo: 'Item', itemImagem: '', descricao: loremDesc, status: 'finalizado' },
  { id: 't5', itemTitulo: 'Item', itemImagem: '', descricao: loremDesc, status: 'em_espera' },
  { id: 't6', itemTitulo: 'Item', itemImagem: '', descricao: loremDesc, status: 'finalizado' },
]
