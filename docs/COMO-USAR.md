# Guia rápido — como usar esta documentação

Esta pasta contém os **templates** da Etapa 1 já pré-preenchidos com a estrutura do sistema Trocas USP. Cada documento tem placeholders `_[...]_` que vocês precisam substituir com os dados reais coletados pelo grupo.

## Ordem sugerida de trabalho

### 1. Avaliação heurística (1-2 horas, em grupo)
- Cada um dos 3 integrantes abre o sistema (`npm run dev`)
- Cada um percorre os 3 cenários do `02-cenarios.md` **sozinho**, sem combinar com os outros
- Cada um preenche sua coluna em `03-avaliacao-heuristica.md` (Avaliador 1, 2, 3)
- Já deixei 5 problemas reais como exemplo em cada coluna — vocês validam, ajustam severidade e adicionam outros que encontrarem
- Depois, juntos, consolidam a tabela `3.2 Relatório Consolidado`

### 2. Testes com usuários (1-2 horas)
- **Recrutem 3 colegas** de outros grupos
- Definam quem vai ser moderador, observador e gravador (`04-testes-usuarios.md` seção 4.3)
- Sigam o roteiro da seção 4.4 com cada usuário, um por vez
- O observador preenche a tabela do usuário durante o teste
- Depois, juntos, preenchem 4.6, 4.7, 4.8 e 4.9

### 3. Revisão final
- Coloquem nomes dos integrantes em `README.md`
- Confiram se não sobrou nenhum `_[...]_`
- Exportem para PDF (Cmd+P no preview do markdown ou usem o VS Code com extensão Markdown PDF)

## Dicas práticas

- **Severidade**: não inflem. Use 4 (catastrófico) só para problemas que impedem a tarefa de ser concluída.
- **Pensar em voz alta**: avise os usuários no início. As frases espontâneas são o material mais rico.
- **Tempo**: usem o cronômetro do celular. Comecem ao entregar a tarefa, parem quando o usuário declarar concluído ou desistir.
- **Não dêem dicas**: se travarem por mais de 1 min, anotem e deixem desistir — isso É um achado.

## Estrutura final esperada (entrega)

```
docs/
├── README.md                       (capa + índice)
├── 01-sistema.md                   (descrição do sistema)
├── 02-cenarios.md                  (3 cenários definidos)
├── 03-avaliacao-heuristica.md      (heurística individual + consolidada)
└── 04-testes-usuarios.md           (testes com usuários + análise)
```

Esses 5 arquivos cobrem **toda** a documentação pedida pela Etapa 1 do PDF do professor:
- ✅ Descrição do sistema interativo a ser avaliado
- ✅ Descrição dos três cenários escolhidos para a avaliação
- ✅ Resultados da avaliação heurística (individuais + consolidado)
- ✅ Resultados dos testes com usuário (perfil, tarefas, observações, problemas, sugestões)
