/* ============================================================
   Tracking de eventos · Protótipo Jornada Free → Pro
   ------------------------------------------------------------
   Cada clique dispara um console.log estruturado seguindo
   o Guia de Eventos ArenaCash v1.0 e o mapeamento em
   mapeamento-eventos-jornada-free-pro.md.

   Eventos marcados como [SUGERIDO] não constam no mapeamento
   original — foram propostos seguindo o padrão {objeto}_{ação}
   do guia.
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Mock de contexto do usuário (no app real vem do auth/state)
  // ----------------------------------------------------------
  const MOCK_USER = {
    user_id: 'usr_lucas_andrade_001',
    plan_type: 'free',
    total_portfolio_brl: 532.40,
    days_since_signup: 42
  };

  // Catálogo dos ativos exibidos na Home (para enriquecer asset_click)
  const ASSETS = [
    { asset_id: 'cdb_liq_001', asset_name: 'CDB Liquidez Diária', asset_type: 'cdb',     amount_brl: 320.00, yield_aa: 12.3 },
    { asset_id: 'tes_selic_002', asset_name: 'Tesouro Selic',     asset_type: 'tesouro', amount_brl: 150.00, yield_aa: 11.8 },
    { asset_id: 'lci_xp_003',    asset_name: 'LCI Banco XP',      asset_type: 'lci',     amount_brl:  62.40, yield_aa: 10.5 }
  ];

  // Estado leve para preencher propriedades de contexto
  let entryPointForProPlan = null; // de onde o usuário chegou na tela do plano
  let proPlanArrivedAt = null;     // timestamp de entrada na tela do plano (time_on_screen_s)

  // ----------------------------------------------------------
  // Helper de tracking
  // ----------------------------------------------------------
  function trackEvent(name, properties = {}, meta = {}) {
    const payload = {
      event: name,
      timestamp: new Date().toISOString(),
      properties: { user_id: MOCK_USER.user_id, ...properties }
    };
    const tag = meta.suggested ? '[evt · SUGERIDO]' : '[evt]';
    console.log(tag, name, payload);
  }

  function secondsSince(ts) {
    if (!ts) return null;
    return Math.round((Date.now() - ts) / 1000);
  }

  // ----------------------------------------------------------
  // Eventos de visualização de tela (disparam via MutationObserver
  // quando a .app-screen ganha .active — assim cobrem qualquer
  // caminho de navegação, inclusive o switcher do protótipo)
  // ----------------------------------------------------------
  function fireScreenView(screenId) {
    if (screenId === 'screen-1') {
      trackEvent('home_screen', {
        plan_type: MOCK_USER.plan_type,
        total_portfolio_brl: MOCK_USER.total_portfolio_brl,
        entry_point: 'app_launch'
      });
      // Banner do trigger Pro está sempre renderizado nessa tela
      trackEvent('pro_trigger_view', {
        trigger_type: 'aum_500',
        total_portfolio_brl: MOCK_USER.total_portfolio_brl,
        days_since_signup: MOCK_USER.days_since_signup
      });
    }

    if (screenId === 'screen-2') {
      proPlanArrivedAt = Date.now();
      trackEvent('pro_plan_screen', {
        entry_point: entryPointForProPlan || 'direct',
        total_portfolio_brl: MOCK_USER.total_portfolio_brl,
        plan_type: MOCK_USER.plan_type
      });
    }

    if (screenId === 'screen-3') {
      // Estado: trial efetivado (no app real, viria após resposta do backend)
      trackEvent('trial_started', {
        plan_name: 'arenacash_pro',
        trial_end_date: '2026-05-02',
        first_charge_brl: 19.90,
        first_charge_date: '2026-05-03',
        entry_point: entryPointForProPlan || 'pro_plan_screen'
      });
      trackEvent('trial_activated_screen', {
        plan_name: 'arenacash_pro',
        trial_end_date: '2026-05-02',
        first_charge_brl: 19.90
      });
    }
  }

  function setupScreenViewObserver() {
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(screen => {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
          if (m.attributeName === 'class' && screen.classList.contains('active')) {
            fireScreenView(screen.id);
          }
        });
      });
      observer.observe(screen, { attributes: true });
    });

    // Dispara o screen_view inicial (tela já ativa no DOM ready)
    const active = document.querySelector('.app-screen.active');
    if (active) fireScreenView(active.id);
  }

  // ----------------------------------------------------------
  // Listeners de clique
  // ----------------------------------------------------------
  function setupClickListeners() {

    // ===== Topbar do protótipo (meta-navegação, não é evento do app) =====
    document.querySelectorAll('.switcher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('[prototype_nav]', 'screen_switch_click', {
          target_screen: btn.dataset.nav,
          label: btn.textContent.trim()
        });
      });
    });

    // ===== TELA 01 — HOME =====

    // Avatar do usuário (sugerido — não está no mapeamento original)
    const avatar = document.querySelector('#screen-1 .avatar');
    if (avatar) {
      avatar.addEventListener('click', () => {
        trackEvent('profile_avatar_click', {
          entry_point: 'home_header'
        }, { suggested: true });
      });
    }

    // Card de patrimônio (sugerido — clicável visualmente, pode levar a detalhes)
    const balanceCard = document.querySelector('#screen-1 .balance-card');
    if (balanceCard) {
      balanceCard.addEventListener('click', () => {
        trackEvent('balance_card_click', {
          total_portfolio_brl: MOCK_USER.total_portfolio_brl,
          entry_point: 'home'
        }, { suggested: true });
      });
    }

    // CTA do trigger Pro
    const triggerCta = document.querySelector('#screen-1 .trigger-cta');
    if (triggerCta) {
      triggerCta.addEventListener('click', () => {
        entryPointForProPlan = 'trigger_home';
        trackEvent('pro_trigger_click', {
          trigger_type: 'aum_500',
          total_portfolio_brl: MOCK_USER.total_portfolio_brl,
          entry_point: 'home'
        });
      });
    }

    // Itens da lista de investimentos
    document.querySelectorAll('#screen-1 .invest-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        const asset = ASSETS[idx] || {};
        trackEvent('asset_click', {
          asset_id: asset.asset_id,
          asset_name: asset.asset_name,
          asset_type: asset.asset_type,
          position_in_list: idx + 1,
          screen_name: 'home'
        });
      });
    });

    // Tab bar (todas as telas mas só renderiza na 01)
    document.querySelectorAll('.tab-bar .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        const currentActive = document.querySelector('.tab-bar .tab-item.active');
        const fromTab = currentActive ? currentActive.querySelector('span').textContent.toLowerCase() : null;
        const toTab = tab.querySelector('span').textContent.toLowerCase();
        trackEvent('tab_changed', {
          from_tab: fromTab,
          to_tab: toTab
        });
      });
    });

    // ===== TELA 02 — PLANO PRO =====

    // Botão voltar
    const backBtn = document.querySelector('#screen-2 .icon-button');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        trackEvent('pro_plan_back_click', {
          entry_point: entryPointForProPlan || 'direct',
          time_on_screen_s: secondsSince(proPlanArrivedAt)
        });
      });
    }

    // CTA primário — começar trial
    const trialStartBtn = document.querySelector('#screen-2 .btn-primary');
    if (trialStartBtn) {
      trialStartBtn.addEventListener('click', () => {
        trackEvent('trial_start_click', {
          entry_point: entryPointForProPlan || 'direct',
          total_portfolio_brl: MOCK_USER.total_portfolio_brl,
          time_on_screen_s: secondsSince(proPlanArrivedAt)
        });
      });
    }

    // CTA terciário — continuar no Free
    const trialDeclineBtn = document.querySelector('#screen-2 .btn-tertiary');
    if (trialDeclineBtn) {
      trialDeclineBtn.addEventListener('click', () => {
        trackEvent('trial_decline_click', {
          entry_point: entryPointForProPlan || 'direct',
          time_on_screen_s: secondsSince(proPlanArrivedAt)
        });
      });
    }

    // ===== TELA 03 — TRIAL ATIVO =====

    // CTA primário — explorar recursos Pro
    const exploreBtn = document.querySelector('#screen-3 .btn-primary');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        trackEvent('pro_explore_click', {
          entry_point: 'trial_activated'
        });
      });
    }

    // CTA secundário — ir para a Home
    const homeReturnBtn = document.querySelector('#screen-3 .btn-secondary');
    if (homeReturnBtn) {
      homeReturnBtn.addEventListener('click', () => {
        trackEvent('home_return_click', {
          entry_point: 'trial_activated'
        });
      });
    }
  }

  // ----------------------------------------------------------
  // Bootstrap
  // ----------------------------------------------------------
  function init() {
    console.log('%c[ArenaCash · tracking ativo]', 'color:#E63946;font-weight:bold');
    console.log('Eventos seguem o Guia ArenaCash v1.0. Veja mapeamento-eventos-jornada-free-pro.md');
    setupScreenViewObserver();
    setupClickListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
