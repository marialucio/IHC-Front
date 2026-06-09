# 3. Avaliação Heurística

## Heurísticas de Nielsen (referência)
| # | Heurística |
|---|---|
| H1 | Visibilidade do status do sistema |
| H2 | Correspondência entre o sistema e o mundo real |
| H3 | Liberdade e controle do usuário |
| H4 | Consistência e padrões |
| H5 | Prevenção de erros |
| H6 | Reconhecimento em vez de memorização |
| H7 | Flexibilidade e eficiência de uso |
| H8 | Estética e design minimalista |
| H9 | Ajude usuários a reconhecer, diagnosticar e recuperar de erros |
| H10 | Ajuda e documentação |

## Escala de severidade
| Nível | Significado |
|---|---|
| 0 | Não é um problema de usabilidade |
| 1 | Cosmético — corrigir se sobrar tempo |
| 2 | Pequeno — prioridade baixa |
| 3 | Grande — prioridade alta |
| 4 | Catastrófico — corrigir antes do lançamento |

---

## 3.1 Avaliações individuais

### Avaliador 1 — _[Nome]_

| # | Heurística | Local | Justificativa | Severidade | Proposta de solução |
|---|---|---|---|---|---|
| 1 | H1 — Visibilidade do status | Tela "Cadastrar item" | Após clicar em "Cadastrar item", o sistema redireciona ao perfil sem mensagem confirmando que o item foi cadastrado. O usuário não sabe se a ação deu certo. | 3 | Exibir um toast ou mensagem "Item cadastrado com sucesso" antes ou após o redirecionamento. |
| 2 | H5 — Prevenção de erros | Tela "Perfil — Seus itens", botão de excluir (lixeira) | Clicar na lixeira exclui o item imediatamente, sem pedir confirmação. Risco de exclusão acidental. | 3 | Exibir modal "Tem certeza que deseja excluir este item?" com botões Cancelar / Confirmar. |
| 3 | H9 — Recuperação de erros | Tela "Login" | Ao errar email ou senha, a mensagem revela qual é o usuário válido ("Tente fabiana@email.com / senha1234"), o que é inadequado em produção e não ajuda a recuperar do erro. | 2 | Exibir apenas "Email ou senha inválidos. Verifique seus dados." |
| 4 | H6 — Reconhecimento | Tela "Perfil" | O select "Seus itens / Minhas trocas" não tem rótulo explícito; o usuário pode não perceber que pode trocar de seção ali. | 2 | Adicionar um rótulo "Visualizar:" antes do select, ou usar abas em vez de select. |
| 5 | H10 — Ajuda e documentação | Sistema todo | Não há nenhum tipo de ajuda, FAQ, ou orientação sobre como funciona uma troca dentro da plataforma. | 2 | Adicionar página "Como funciona" acessível pelo header. |

### Avaliador 2 — _[Nome]_

| # | Heurística | Local | Justificativa | Severidade | Proposta de solução |
|---|---|---|---|---|---|
| 1 | H3 — Liberdade e controle | Tela "Cadastrar item" | Não há botão "Cancelar" ou "Voltar"; o usuário precisa usar a navegação do header para sair. | 2 | Adicionar botão "Cancelar" ao lado do "Cadastrar item". |
| 2 | H1 — Visibilidade do status | Catálogo, ao solicitar troca | O toast aparece, mas dura pouco tempo (3,5s) e some sem deixar histórico. Se o usuário olhou para outro lugar, perde a confirmação. | 2 | Aumentar duração para 5s ou exibir um indicador persistente em "Minhas trocas". |
| 3 | H4 — Consistência | Header das telas internas vs. Landing | A landing tem header roxo com botões pílula; o resto do sistema tem header cinza com links de texto. Mudança visual brusca. | 1 | Manter visualmente alinhados, mesmo que o conteúdo mude. |
| 4 | H7 — Flexibilidade | Tela "Catálogo" | Não há campo de busca nem filtros (por categoria, por dono). Em um catálogo grande, fica difícil encontrar itens específicos. | 3 | Adicionar barra de busca e filtros básicos. |
| 5 | H2 — Correspondência com o mundo real | Cards do catálogo | Os ícones ❤ (coração) e ⇄ (setas) não têm rótulos. Usuários novos podem não entender o que cada um faz. | 2 | Adicionar tooltips visíveis ou texto auxiliar ao passar o mouse. |

### Avaliador 3 — _[Nome]_

| # | Heurística | Local | Justificativa | Severidade | Proposta de solução |
|---|---|---|---|---|---|
| 1 | H5 — Prevenção de erros | Tela "Cadastro" | Não há validação de formato em telefone nem confirmação visual de que as senhas coincidem em tempo real (só após submit). | 2 | Validar formato do telefone (máscara) e mostrar indicador "senhas coincidem ✓" abaixo do campo de confirmação. |
| 2 | H1 — Visibilidade do status | Tela "Perfil — Seus itens" | Ao excluir um item, ele some sem nenhum aviso ou mensagem. | 3 | Mostrar toast "Item excluído" e oferecer botão "Desfazer" por alguns segundos. |
| 3 | H8 — Estética minimalista | Catálogo — descrição dos cards | Todos os cards (exceto o jaleco) têm o mesmo texto Lorem ipsum, o que parece um bug ou conteúdo de teste para o usuário final. | 1 | Substituir por descrições reais ou estado vazio explícito. |
| 4 | H6 — Reconhecimento | Tela "Cadastrar item" | O ícone de upload é uma seta para cima sem rótulo claro do que aceita (PNG, JPG, tamanho máximo etc.). | 2 | Adicionar texto auxiliar: "Aceita PNG, JPG até 5MB". |
| 5 | H3 — Liberdade e controle | Tela "Perfil" | O botão "Sair" não pede confirmação; clique acidental encerra a sessão. | 2 | Pedir confirmação simples antes de sair, ou exibir como ação secundária. |

---

## 3.2 Relatório Consolidado

Compilação dos problemas encontrados, indicando **quantos avaliadores** identificaram cada um. Problemas com mais avaliadores tendem a ser mais relevantes.

| ID | Problema consolidado | Heurística | Local | Avaliadores que reportaram | Severidade (média) | Proposta de solução (consenso) |
|---|---|---|---|---|---|---|
| P1 | Falta de confirmação ao executar ações destrutivas (excluir item) | H5 | Perfil — Seus itens | 1, 3 (2 de 3) | 3 | Adicionar modal de confirmação antes de excluir |
| P2 | Falta de feedback após cadastrar/excluir item | H1 | Cadastrar item, Perfil | 1, 3 (2 de 3) | 3 | Toast de sucesso visível após cada ação |
| P3 | Catálogo sem busca nem filtros | H7 | Catálogo | 2 (1 de 3) | 3 | Implementar busca por título e filtros básicos |
| P4 | Ícones do catálogo (♥ ⇄) sem rótulo | H2/H6 | Cards do catálogo | 2 (1 de 3) | 2 | Tooltips e/ou rótulos textuais |
| P5 | Mensagem de erro do login expõe credenciais válidas | H9 | Login | 1 (1 de 3) | 2 | Mensagem genérica em produção |
| P6 | Ausência de página de ajuda/documentação | H10 | Sistema todo | 1 (1 de 3) | 2 | Criar seção "Como funciona" |
| P7 | Validação fraca no cadastro (telefone, senha) | H5 | Cadastro | 3 (1 de 3) | 2 | Adicionar máscaras e validação em tempo real |
| P8 | Botão "Sair" sem confirmação | H3 | Perfil | 3 (1 de 3) | 2 | Confirmação simples antes de encerrar sessão |
| P9 | Sem botão Cancelar/Voltar em "Cadastrar item" | H3 | Cadastrar item | 2 (1 de 3) | 2 | Adicionar botão "Cancelar" |
| P10 | Inconsistência visual entre header da landing e header interno | H4 | Header geral | 2 (1 de 3) | 1 | Padronizar identidade visual |
| P11 | Cards com texto placeholder (Lorem ipsum) | H8 | Catálogo | 3 (1 de 3) | 1 | Substituir por dados reais |

### Conclusões da avaliação heurística

- **Problemas mais críticos** (severidade 3): falta de feedback após ações importantes e ausência de busca/filtros no catálogo.
- **Padrão observado:** o sistema é funcional mas carece de mecanismos de **feedback** (H1) e **prevenção/recuperação de erros** (H5/H9).
- **Pontos fortes:** layout consistente, hierarquia visual clara, navegação previsível entre telas.
