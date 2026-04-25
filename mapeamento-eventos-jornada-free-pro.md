# Mapeamento de Eventos · Jornada Free → Pro

**Squad:** Ativação
**Iniciativa:** Conversão Free → Pro via trigger contextual de AUM
**Versão do protótipo:** v0.1
**Data:** 25/04/2026

---

## Contexto

Protótipo da jornada de conversão de usuários Free para Pro. O gatilho aparece na Home quando o usuário cruza R$ 500 de patrimônio (AUM), levando a uma tela de comparativo Free vs Pro com CTA de trial de 7 dias, e finalmente à tela de confirmação do trial ativado.

**Funil principal a medir:**
`home_screen` → `pro_trigger_view` → `pro_trigger_click` → `pro_plan_screen` → `trial_start_click` → `trial_started` → `trial_activated_screen`

**Perguntas-chave de produto:**
- Qual % dos usuários que cruzam o trigger de R$500 clicam no CTA?
- Qual a taxa de conversão da tela do plano Pro para o início do trial?
- Onde está o maior drop-off do funil?
- Qual o ticket médio (AUM) no momento do trigger?
- Quantos voltam pra Home (declinam) na tela do plano?

---

## Convenções utilizadas

Seguem o **Guia de Eventos ArenaCash v1.0**:
- `snake_case` em todos os nomes
- `{tela}_screen` para visualizações
- `{objeto}_{ação}` para interações
- `{objeto}_{estado}` para mudanças de estado
- Toda propriedade conecta-se a uma pergunta de produto real

---

## Tela 01 · Home (com trigger contextual)

Tela inicial com saudação, card de patrimônio (R$ 532,40), banner do trigger Pro, lista de 3 investimentos e tab bar (Home / Investir / Carteira / Cripto / Perfil).

| Nome do Evento | Propriedades | Gatilho | Pergunta que responde |
|---|---|---|---|
| `home_screen` | `user_id`, `plan_type`, `total_portfolio_brl`, `entry_point` | Usuário abre o app ou navega para a Home | Quantos usuários acessam a Home por dia? Qual o ponto de entrada mais comum? |
| `pro_trigger_view` | `user_id`, `trigger_type` (aum_500), `total_portfolio_brl`, `days_since_signup` | Banner "Passou dos R$500" é renderizado/visualizado pelo usuário | Quantos usuários cruzam o trigger de AUM por semana? |
| `pro_trigger_click` | `user_id`, `trigger_type`, `total_portfolio_brl`, `entry_point` (home) | Usuário toca em "Começar trial grátis" no banner do trigger | Qual % dos usuários expostos ao trigger clicam no CTA? |
| `asset_click` | `user_id`, `asset_id`, `asset_name`, `asset_type` (cdb / tesouro / lci), `position_in_list` | Usuário toca em um item da lista "Meus investimentos" | Qual ativo gera mais interesse na Home? Há correlação com aporte? |
| `tab_changed` | `user_id`, `from_tab`, `to_tab` (home / investir / carteira / cripto / perfil) | Usuário toca em um item da tab bar inferior | Qual aba é mais usada? Usuários do trigger exploram outras seções antes de converter? |

---

## Tela 02 · Plano Pro

Tela do plano Pro com hero (preço R$ 19,90/mês após 7 dias grátis), tabela comparativa Free vs Pro (5 recursos), 3 cards de benefícios, CTA primário do trial e CTA terciário para continuar no Free.

| Nome do Evento | Propriedades | Gatilho | Pergunta que responde |
|---|---|---|---|
| `pro_plan_screen` | `user_id`, `entry_point` (trigger_home / direct_link), `total_portfolio_brl`, `plan_type` (free) | Usuário visualiza a tela do plano Pro | Qual o ponto de entrada mais comum para a tela do plano? |
| `pro_plan_back_click` | `user_id`, `entry_point`, `time_on_screen_s` | Usuário toca no botão de voltar (seta no topo) | Quantos usuários abandonam pelo voltar antes de decidir? |
| `trial_start_click` | `user_id`, `entry_point`, `total_portfolio_brl`, `time_on_screen_s` | Usuário toca em "Começar 7 dias grátis" | Qual a conversão da tela do plano para início do trial? |
| `trial_decline_click` | `user_id`, `entry_point`, `time_on_screen_s` | Usuário toca em "Continuar no Free por enquanto" | Quantos usuários declinam ativamente o Pro? |

---

## Tela 03 · Trial ativado

Tela de confirmação após o trial ser ativado: ícone de check, badge "Pro · ativo", detalhes (plano, data limite, primeira cobrança), lista de 4 recursos liberados e dois CTAs (Explorar Pro / Ir para Home).

| Nome do Evento | Propriedades | Gatilho | Pergunta que responde |
|---|---|---|---|
| `trial_started` | `user_id`, `plan_name` (arenacash_pro), `trial_end_date`, `first_charge_brl`, `first_charge_date`, `entry_point` | Backend confirma ativação do trial (estado, dispara junto com a tela) | Quantos trials são iniciados por semana? Qual o tempo médio entre clique e ativação? |
| `trial_activated_screen` | `user_id`, `plan_name`, `trial_end_date`, `first_charge_brl` | Usuário visualiza a tela de confirmação do trial | Qual % dos `trial_start_click` chega na confirmação? (medir falha de ativação) |
| `pro_explore_click` | `user_id`, `entry_point` (trial_activated) | Usuário toca em "Explorar recursos Pro" | Quantos usuários do trial exploram ativamente os recursos novos? |
| `home_return_click` | `user_id`, `entry_point` (trial_activated) | Usuário toca em "Ir para a Home" | Quantos voltam direto pra Home sem explorar o Pro? |

---

## Funil de conversão (a medir)

| Etapa | Evento | Expectativa inicial |
|---|---|---|
| 1 | `pro_trigger_view` | 100% — base de usuários expostos ao trigger |
| 2 | `pro_trigger_click` | ~25% — clicam no CTA do banner |
| 3 | `pro_plan_screen` | ~24% — chegam na tela do plano (descontando falhas técnicas) |
| 4 | `trial_start_click` | ~12% — clicam no CTA do trial |
| 5 | `trial_started` | ~11% — trial efetivamente ativado |
| 6 | `pro_explore_click` | ~6% — engajam com recursos Pro pós-ativação |

> **Insight do guia:** o par `trial_start_click` (intenção) + `trial_started` (estado) permite medir falhas técnicas de ativação. Sem essa separação, perde-se um drop-off invisível.

---

## Perguntas de produto que o mapeamento responde

1. **Trigger funciona?** `pro_trigger_view` → `pro_trigger_click` revela o CTR do banner.
2. **Qual o AUM ideal para disparar o trigger?** A propriedade `total_portfolio_brl` em todos os eventos do funil permite testar variações (R$300, R$500, R$1000).
3. **Onde os usuários abandonam?** Funil completo identifica a etapa de maior drop-off.
4. **Quanto tempo pensam antes de decidir?** `time_on_screen_s` em `trial_start_click` e `trial_decline_click`.
5. **Trial ativado = engajamento?** `pro_explore_click` vs `home_return_click` mede se o usuário usa o Pro ou só "deixa ativo".
6. **Há falha técnica de ativação?** Diferença entre `trial_start_click` e `trial_started`.

---

## Status e responsáveis

| Evento | Status | Responsável | Sprint |
|---|---|---|---|
| `home_screen` | Pendente | — | — |
| `pro_trigger_view` | Pendente | — | — |
| `pro_trigger_click` | Pendente | — | — |
| `asset_click` | Pendente | — | — |
| `tab_changed` | Pendente | — | — |
| `pro_plan_screen` | Pendente | — | — |
| `pro_plan_back_click` | Pendente | — | — |
| `trial_start_click` | Pendente | — | — |
| `trial_decline_click` | Pendente | — | — |
| `trial_started` | Pendente | — | — |
| `trial_activated_screen` | Pendente | — | — |
| `pro_explore_click` | Pendente | — | — |
| `home_return_click` | Pendente | — | — |

---

## Pontos para alinhar com o time

- **`tab_changed` está no escopo da iniciativa de Ativação?** Se a tab bar é shared, talvez já exista — checar com Dados antes de duplicar.
- **`asset_click` na Home vs Carteira:** o guia já tem `asset_click` no contexto de Carteira. Confirmar se faz sentido reusar o mesmo nome com `screen_name` como diferenciador, ou criar `home_asset_click`.
- **Trigger backend ou client-side?** `pro_trigger_view` precisa disparar quando o banner é renderizado, não quando a regra de negócio é avaliada. Alinhar com engenharia.
