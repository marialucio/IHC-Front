# 2. Cenários de Avaliação

Foram definidos **três cenários** que cobrem as transações principais do sistema. Os mesmos cenários serão usados tanto na avaliação heurística quanto nos testes com usuários, conforme recomendado pelo enunciado.

## Cenário 1 — Cadastro e primeiro acesso

> Você é um(a) estudante da USP que ouviu falar da plataforma Trocas USP por meio de um colega. Você quer criar uma conta na plataforma e ver quais itens estão disponíveis para troca.

**Tarefas envolvidas:**
1. Acessar a plataforma
2. Criar uma nova conta com seus dados
3. Visualizar o catálogo de itens disponíveis

**Telas percorridas:** Landing → Cadastro → Catálogo

**Critérios de sucesso:**
- Tarefa concluída em menos de 2 minutos
- Sem necessidade de pedir ajuda
- Sem erros de preenchimento que bloqueiem o cadastro

---

## Cenário 2 — Cadastrar um item para troca

> Você tem um livro de Cálculo I em bom estado que não usa mais e gostaria de oferecê-lo em troca por outro material de estudo. Cadastre esse item na plataforma.

**Tarefas envolvidas:**
1. Localizar a opção de cadastrar item
2. Adicionar uma foto (pode usar qualquer imagem)
3. Preencher título e descrição
4. Confirmar o cadastro
5. Verificar se o item aparece em "Seus itens"

**Telas percorridas:** Catálogo (autenticado) → Cadastrar item → Perfil → Seus itens

**Critérios de sucesso:**
- Tarefa concluída em menos de 3 minutos
- Usuário consegue localizar a função sem ajuda
- Item aparece corretamente listado em "Seus itens" após o cadastro

---

## Cenário 3 — Solicitar troca e acompanhar status

> Você se interessou por um jaleco que viu no catálogo e quer iniciar uma troca por ele. Solicite a troca e, em seguida, verifique o status da sua solicitação.

**Tarefas envolvidas:**
1. Localizar o item desejado no catálogo
2. Solicitar a troca
3. Navegar até "Minhas trocas"
4. Filtrar apenas as trocas que ainda estão "Em espera"

**Telas percorridas:** Catálogo → Perfil → Minhas trocas (com filtro)

**Critérios de sucesso:**
- Tarefa concluída em menos de 2 minutos
- Usuário recebe feedback claro de que a solicitação foi enviada
- Usuário descobre o filtro "Em espera" sem ajuda
