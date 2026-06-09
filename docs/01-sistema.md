# 1. Descrição do Sistema Interativo

## Nome
**Trocas USP** — Plataforma web de trocas entre estudantes da Universidade de São Paulo.

## Objetivo
Permitir que estudantes da USP cadastrem itens que não usam mais (livros, jalecos, materiais de estudo, eletrônicos etc.) e os ofereçam para troca com outros estudantes, fomentando consumo consciente e circulação de bens dentro da comunidade acadêmica.

## Público-alvo
Estudantes de graduação e pós-graduação da USP, com idade entre 17 e 35 anos, com familiaridade média com sistemas web.

## Tipo de sistema
Sistema web responsivo, desenvolvido em React + TypeScript com Vite.

## Principais transações suportadas
1. **Cadastro de usuário** — criação de conta com nome, apelido, telefone, email e senha
2. **Autenticação** — login com email e senha
3. **Cadastro de item** — disponibilização de um item para troca, com foto, título e descrição
4. **Catálogo** — visualização de todos os itens disponíveis para troca
5. **Solicitação de troca** — envio de uma solicitação para o dono de um item
6. **Gerenciamento de itens próprios** — visualização, edição e exclusão dos itens cadastrados pelo usuário
7. **Acompanhamento de trocas** — visualização das trocas com filtros por status (Finalizado / Em espera)

## Telas do sistema
| Tela | Descrição |
|---|---|
| Landing | Página inicial pública com logo e botões de Acessar/Cadastrar |
| Login | Autenticação de usuários cadastrados |
| Cadastro | Formulário de criação de conta |
| Catálogo | Grid de itens de outros usuários, com possibilidade de favoritar e solicitar troca |
| Perfil — Seus itens | Painel de dados do usuário + grid dos itens próprios, com opções de editar/excluir |
| Perfil — Minhas trocas | Mesma tela com select alternando para histórico de trocas, com filtros Finalizado / Em espera |
| Cadastrar item | Formulário com upload de foto, título e descrição |

## Acesso ao sistema
- **Repositório:** https://github.com/marialucio/IHC-Front
- **Para executar localmente:** `npm install && npm run dev`
- **Credenciais de teste:** email `fabiana@email.com` / senha `senha1234` (ou cadastrar novo usuário)
