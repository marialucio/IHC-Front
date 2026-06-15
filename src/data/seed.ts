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
    categoria: 'Roupas',
    condicao: 'como_novo',
    localizacao: 'São Paulo, SP',
    dataCriacao: '2024-01-15',
    avaliacaoDono: 5,
    numeroTrocas: 12,
    termosTroca: 'Qualquer coisa com valor parecido',
  },
  {
    id: '2',
    titulo: 'Bolsa',
    descricao:
      'Bolsa em excelente estado. Troco por algo interessante que tenha um valor parecido.',
    imagem: '/assets/bolsa.png',
    dono: 'Carlos Silva',
    categoria: 'Acessórios',
    condicao: 'como_novo',
    localizacao: 'São Paulo, SP',
    dataCriacao: '2024-01-20',
    avaliacaoDono: 4,
    numeroTrocas: 8,
    termosTroca: 'Mochilas, cintos ou sapatos',
  },
  {
    id: '3',
    titulo: 'Fone',
    descricao:
      'Fone de áudio de alta qualidade. Estou trocando por outro modelo ou item equivalente.',
    imagem: '/assets/fone.png',
    dono: 'Marina Costa',
    categoria: 'Eletrônicos',
    condicao: 'bom',
    localizacao: 'Rio de Janeiro, RJ',
    dataCriacao: '2024-01-18',
    avaliacaoDono: 5,
    numeroTrocas: 15,
    termosTroca: 'Fones, caixas de som ou outros eletrônicos',
  },
  {
    id: '4',
    titulo: 'Garrafa',
    descricao:
      'Garrafa térmica de alumínio. Ideal para manter bebidas quentes ou frias. Troco com prazer!',
    imagem: '/assets/garrafa.png',
    dono: 'João Santos',
    categoria: 'Utensílios',
    condicao: 'novo',
    localizacao: 'Campinas, SP',
    dataCriacao: '2024-01-22',
    avaliacaoDono: 4,
    numeroTrocas: 5,
    termosTroca: 'Garrafas, copos ou itens para casa',
  },
  {
    id: '5',
    titulo: 'Mesa',
    descricao:
      'Mesa pequena para trabalho ou estudo. Bem conservada e prática. Aceito propostas de troca.',
    imagem: '/assets/mesa.png',
    dono: 'Beatriz Oliveira',
    categoria: 'Móveis',
    condicao: 'bom',
    localizacao: 'Salvador, BA',
    dataCriacao: '2024-01-19',
    avaliacaoDono: 3,
    numeroTrocas: 3,
    termosTroca: 'Móveis, prateleiras ou itens para organização',
  },
  {
    id: '6',
    titulo: 'Micro-ondas',
    descricao:
      'Micro-ondas funcionando perfeitamente. Troco por eletrodoméstico equivalente ou outro item de interesse.',
    imagem: '/assets/microondas.png',
    dono: 'Lucas Ferreira',
    categoria: 'Eletrônicos',
    condicao: 'como_novo',
    localizacao: 'Brasília, DF',
    dataCriacao: '2024-01-16',
    avaliacaoDono: 5,
    numeroTrocas: 10,
    termosTroca: 'Eletrodomésticos ou eletrônicos',
  },
  {
    id: '7',
    titulo: 'Mouse',
    descricao:
      'Mouse sem fio em perfeitas condições. Ideal para quem trabalha com computador.',
    imagem: '/assets/mouse.png',
    dono: 'Ana Paula',
    categoria: 'Eletrônicos',
    condicao: 'bom',
    localizacao: 'Curitiba, PR',
    dataCriacao: '2024-01-21',
    avaliacaoDono: 4,
    numeroTrocas: 7,
    termosTroca: 'Periféricos, teclados ou acessórios de computador',
  },
  {
    id: '8',
    titulo: 'Varal',
    descricao:
      'Varal de roupas com suporte. Prático e resistente. Disponível para troca!',
    imagem: '/assets/varal.png',
    dono: 'Ricardo Gomes',
    categoria: 'Utensílios',
    condicao: 'como_novo',
    localizacao: 'Recife, PE',
    dataCriacao: '2024-01-17',
    avaliacaoDono: 4,
    numeroTrocas: 6,
    termosTroca: 'Utensílios domésticos ou itens para limpeza',
  },
]

export const seedMeusItens: Item[] = [
  { 
    ...seedCatalogo[0],
    id: 'm1',
    dono: 'Fabiana Mendes',
  },
  {
    id: 'm2',
    titulo: 'Livro: Clean Code',
    descricao:
      'Livro de programação em excelente estado. Quase não foi usado. Perfeito para quem quer melhorar suas habilidades de codificação.',
    imagem: '',
    dono: 'Fabiana Mendes',
    categoria: 'Livros',
    condicao: 'novo',
    localizacao: 'São Paulo, SP',
    dataCriacao: '2024-01-10',
    avaliacaoDono: 5,
    numeroTrocas: 12,
    termosTroca: 'Livros de tecnologia ou negócios',
  },
  {
    id: 'm3',
    titulo: 'Webcam USB',
    descricao:
      'Webcam com excelente qualidade de imagem. Ideal para videochamadas e streaming. Em perfeitas condições.',
    imagem: '',
    dono: 'Fabiana Mendes',
    categoria: 'Eletrônicos',
    condicao: 'como_novo',
    localizacao: 'São Paulo, SP',
    dataCriacao: '2024-01-12',
    avaliacaoDono: 5,
    numeroTrocas: 12,
    termosTroca: 'Periféricos de computador ou acessórios',
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
