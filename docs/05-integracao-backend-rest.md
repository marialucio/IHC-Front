# Integracao Backend REST - Insumo para Desenvolvimento

Este documento descreve as chamadas REST esperadas pelo frontend para TODAS as paginas atuais do sistema, incluindo regras de negocio, validacoes e exemplos de bodies.

Objetivo: servir como contrato inicial para implementacao do backend.

## 1. Convencoes Gerais

- Base sugerida: `/api/v1`
- Formato: `application/json`
- Autenticacao para rotas privadas: `Authorization: Bearer <token>`
- Timezone de datas: ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ`)
- Erros padrao sugeridos:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Descricao amigavel",
  "details": {
    "campo": "motivo"
  }
}
```

## 2. Cobertura por Pagina

## 2.1 Landing (`/`)

Chamadas esperadas:
- Nenhuma obrigatoria.

Observacao:
- Apenas navegacao para login e cadastro.

## 2.2 Login (`/login`)

### Endpoint
- `POST /auth/login`

### Body esperado
```json
{
  "email": "fabiana@email.com",
  "senha": "Senha1234"
}
```

### Regras de negocio
- `email` obrigatorio e valido.
- `senha` obrigatoria.
- Retornar erro generico para credenciais invalidas.
- Nao expor se email existe ou nao.

### Resposta esperada (200)
```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt-refresh",
  "user": {
    "id": "u1",
    "nomeCompleto": "Fabiana Mendes Silva Oliveira",
    "apelido": "Fabiana Mendes",
    "telefone": "(11) 99999-9999",
    "email": "fabiana@email.com"
  }
}
```

## 2.3 Cadastro (`/cadastro`)

### Endpoint
- `POST /auth/register`

### Body esperado
```json
{
  "nomeCompleto": "Fabiana Mendes Silva Oliveira",
  "apelido": "Fabiana Mendes",
  "telefone": "(11) 99999-9999",
  "email": "fabiana@email.com",
  "senha": "Senha1234"
}
```

### Regras de negocio
- `nomeCompleto` obrigatorio, maximo 100.
- `apelido` obrigatorio, maximo 20.
- `telefone` obrigatorio com 10 ou 11 digitos (formatacao pode ser aplicada no backend).
- `email` obrigatorio, formato valido e unico.
- `senha` obrigatoria com politica minima:
  - 8+ caracteres
  - ao menos 1 maiuscula
  - ao menos 1 minuscula
  - ao menos 1 numero

### Resposta esperada
- `201 Created` sem senha na resposta.

## 2.4 Recuperacao de Senha (`/recuperar-senha`)

### Endpoint
- `POST /auth/forgot-password`

### Body esperado
```json
{
  "email": "fabiana@email.com"
}
```

### Regras de negocio
- Sempre retornar sucesso funcional (ex.: `204`), mesmo para email inexistente.
- Aplicar rate limit por email/IP (frontend tem timer de 2 minutos para reenviar).
- Registrar tentativa para auditoria.

### Resposta esperada
- `204 No Content` (recomendado) ou `200`.

## 2.5 Catalogo (`/catalogo`)

Esta tela possui:
- consulta por termo (disparo somente em Enter/lupa)
- filtro de favoritos
- solicitacao de troca via selecao de item proprio

### Endpoints
- `GET /catalog/items`
- `GET /favorites`
- `POST /favorites`
- `DELETE /favorites/{itemId}`
- `POST /trades`

### Consulta de catalogo

#### Exemplo de chamada
`GET /catalog/items?query=jaleco&onlyAvailable=true`

#### Regras de negocio (pre-filtragem critica)
- Retornar somente itens disponiveis para troca (`onlyAvailable=true`).
- Excluir itens do proprio usuario logado.
- Excluir itens removidos/bloqueados.
- Suportar busca por `titulo`, `descricao`, `categoria`, `dono`, `localizacao`.

#### Resposta esperada
```json
{
  "items": [
    {
      "id": "i10",
      "titulo": "Jaleco Tamanho M",
      "descricao": "Jaleco em bom estado",
      "imagem": "https://cdn.exemplo.com/i10.jpg",
      "imagemPosicao": "50% 50%",
      "dono": "Carlos Silva",
      "categoria": "Roupas",
      "condicao": "como_novo",
      "localizacao": "Sao Paulo, SP",
      "dataCriacao": "2026-07-10",
      "avaliacaoDono": 4,
      "numeroTrocas": 8,
      "termosTroca": "Itens de valor similar",
      "disponibilidade": "disponivel"
    }
  ]
}
```

### Favoritos

#### Adicionar favorito
- `POST /favorites`

Body:
```json
{
  "itemId": "i10"
}
```

#### Remover favorito
- `DELETE /favorites/i10`

#### Listar favoritos
- `GET /favorites`

### Solicitar troca

#### Endpoint
- `POST /trades`

#### Body esperado
```json
{
  "itemParaId": "i10",
  "meuItemId": "m3"
}
```

#### Regras de negocio
- Permitir selecionar UM item proprio por solicitacao.
- Impedir nova solicitacao pendente para o mesmo item alvo pelo mesmo solicitante.
- Impedir troca de item indisponivel.
- Status inicial da troca: `pendente`.
- Contatos das partes NAO devem ser expostos enquanto pendente.

## 2.6 Meus Itens (`/meus-itens`)

A pagina suporta listar, adicionar, editar e deletar item proprio.

### Endpoints
- `GET /my/items`
- `POST /my/items`
- `PUT /my/items/{itemId}`
- `DELETE /my/items/{itemId}`

### Listar meus itens
- Retornar apenas itens do usuario autenticado.

### Adicionar item

Body exemplo:
```json
{
  "titulo": "Livro: Clean Code",
  "descricao": "Livro em excelente estado",
  "imagem": "https://cdn.exemplo.com/items/clean-code.jpg",
  "imagemPosicao": "50% 50%",
  "categoria": "Livros",
  "condicao": "bom",
  "localizacao": "Sao Paulo, SP",
  "termosTroca": "Troco por livro tecnico"
}
```

Regras:
- Obrigatorios: `titulo`, `descricao`, `localizacao`, `imagem`.
- `condicao` em: `novo`, `como_novo`, `bom`, `usado`.
- `categoria` pode ter default (`Geral`) se nao informado.

### Editar item

Body exemplo:
```json
{
  "titulo": "Livro: Clean Code (2a edicao)",
  "descricao": "Livro conservado",
  "imagem": "https://cdn.exemplo.com/items/clean-code-v2.jpg",
  "imagemPosicao": "42% 48%",
  "categoria": "Livros",
  "condicao": "bom",
  "localizacao": "Sao Paulo, SP",
  "termosTroca": "Aceito livros de arquitetura"
}
```

Regras:
- Somente dono pode editar.
- Se item estiver vinculado a troca ativa, backend pode bloquear parte dos campos ou a edicao inteira.

### Deletar item

Regras:
- Somente dono pode deletar.
- Bloquear delecao se houver troca pendente/aceita envolvendo o item.

## 2.7 Perfil (`/perfil`)

A tela permite visualizar e atualizar dados do usuario logado.

### Endpoints
- `GET /me`
- `PUT /me`
- `POST /auth/logout` (opcional, para invalidar refresh token)

### Atualizacao de perfil

Body exemplo:
```json
{
  "nomeCompleto": "Fabiana Mendes Silva Oliveira",
  "apelido": "Fabiana Mendes",
  "telefone": "(11) 99999-9999",
  "email": "fabiana@email.com"
}
```

Regras:
- `nomeCompleto` obrigatorio, max 100.
- `apelido` obrigatorio, max 20.
- `telefone` valido (10 ou 11 digitos).
- `email` valido e unico no sistema.

## 2.8 Solicitacoes (`/solicitacoes`)

A tela tem dois modos:
- `de_mim`
- `para_mim`

Suporta detalhes, aceite, recusa e cancelamento.

### Endpoints
- `GET /trades?direction=de_mim|para_mim`
- `PATCH /trades/{tradeId}/status`

### Listagem

#### Exemplo
`GET /trades?direction=para_mim`

#### Regras
- `de_mim`: listar solicitacoes criadas pelo usuario.
- `para_mim`: listar solicitacoes recebidas pelo usuario.
- Pode ocultar `cancelada` em `para_mim` se esta for a regra de produto vigente.

### Atualizacao de status

#### Endpoint
- `PATCH /trades/{tradeId}/status`

#### Body exemplo
```json
{
  "acao": "aceitar"
}
```

Valores de `acao`:
- `aceitar`
- `recusar`
- `cancelar`

#### Regras de negocio
- `aceitar` e `recusar`: apenas destinatario da solicitacao (`para_mim`) e somente quando `pendente`.
- `cancelar`: apenas solicitante (`de_mim`) e somente quando `pendente`.
- Ao `aceitar`:
  - status vira `aceita`
  - backend passa a permitir exibicao de contato da contraparte.
- Ao `recusar` ou `cancelar`:
  - registrar data de resposta/cancelamento.

### Modelo de resposta esperado para detalhes
```json
{
  "id": "t20",
  "itemParaId": "i10",
  "itemDe": "Livro: Clean Code",
  "itemPara": "Fone",
  "meuItem": {
    "nome": "Livro: Clean Code",
    "descricao": "Livro em excelente estado",
    "condicao": "Novo",
    "localizacao": "Sao Paulo, SP",
    "imagem": "https://cdn.exemplo.com/m3.jpg"
  },
  "itemFulano": {
    "nome": "Fone",
    "descricao": "Fone bluetooth",
    "condicao": "Bom",
    "localizacao": "Rio de Janeiro, RJ",
    "imagem": "https://cdn.exemplo.com/i10.jpg"
  },
  "status": "pendente",
  "dataSolicitacao": "2026-07-15",
  "dataRespostaCancelamento": null,
  "contraparte": "Marina Costa",
  "contatoContraparte": null,
  "direcao": "de_mim"
}
```

Regra de privacidade:
- `contatoContraparte` so pode ser retornado quando `status = aceita`.

## 3. Regras Transversais de Negocio

- Catalogo deve respeitar disponibilidade real e ownership (nao listar item proprio).
- Troca pendente duplicada para mesmo item alvo e mesmo solicitante deve ser bloqueada.
- Contatos de troca devem ser ocultos ate aceite.
- Todas as mutacoes devem validar permissao por usuario autenticado.
- Operacoes de escrita devem ser idempotentes quando aplicavel (ex.: favoritar item ja favoritado nao deve falhar).

## 4. Matriz de Endpoints (Resumo)

- Publicos:
  - `POST /auth/login`
  - `POST /auth/register`
  - `POST /auth/forgot-password`

- Privados:
  - `GET /me`
  - `PUT /me`
  - `POST /auth/logout` (opcional)
  - `GET /catalog/items`
  - `GET /favorites`
  - `POST /favorites`
  - `DELETE /favorites/{itemId}`
  - `GET /my/items`
  - `POST /my/items`
  - `PUT /my/items/{itemId}`
  - `DELETE /my/items/{itemId}`
  - `POST /trades`
  - `GET /trades?direction=...`
  - `PATCH /trades/{tradeId}/status`

## 5. Ordem Recomendada de Implementacao Backend

1. Auth (`login`, `register`, `forgot-password`).
2. Perfil (`GET /me`, `PUT /me`).
3. Catalogo (`GET /catalog/items`) + favoritos.
4. Meus itens (CRUD).
5. Trocas (`POST /trades`, `GET /trades`, `PATCH status`) com regras de permissao e privacidade.
