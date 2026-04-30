/* ══════════════════════════════════════════
   ── parent/payment.js — Оплата (родитель) ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ══ Моки ══
    const TOTAL = {
        amount: 24200,
        period: 'Апрель 2026',
    };

    const CHILDREN = [
        {
            id: 'c1',
            name: 'Артём Соколов',
            initial: 'А',
            variant: 'indigo',
            meta: '8 класс · Математика',
            total: 15200,
            breakdown: [
                { kind: 'lesson',  title: 'Математика',         sub: '15 апреля · 14:00', amount: 1900 },
                { kind: 'lesson',  title: 'Математика',         sub: '17 апреля · 14:00', amount: 1900 },
                { kind: 'lesson',  title: 'Математика',         sub: '22 апреля · 14:00', amount: 1900 },
                { kind: 'package', title: 'Пакет «8 занятий»',  sub: 'Математика',         amount: 9500 },
            ],
        },
        {
            id: 'c2',
            name: 'Мария Соколова',
            initial: 'М',
            variant: 'green',
            meta: '5 класс · Английский',
            total: 9000,
            breakdown: [
                { kind: 'lesson',  title: 'Английский', sub: '14 апреля · 16:30', amount: 1500 },
                { kind: 'lesson',  title: 'Английский', sub: '16 апреля · 16:30', amount: 1500 },
                { kind: 'lesson',  title: 'Английский', sub: '21 апреля · 16:30', amount: 1500 },
                { kind: 'lesson',  title: 'Английский', sub: '23 апреля · 16:30', amount: 1500 },
                { kind: 'lesson',  title: 'Английский', sub: '28 апреля · 16:30', amount: 1500 },
                { kind: 'lesson',  title: 'Английский', sub: '30 апреля · 16:30', amount: 1500 },
            ],
        },
    ];

    const HISTORY = [
        { id: 'h1', date: '2026-03-31', method: 'Visa •••• 4321', amount: 22800 },
        { id: 'h2', date: '2026-02-28', method: 'Visa •••• 4321', amount: 19400 },
        { id: 'h3', date: '2026-01-31', method: 'СБП',            amount: 21600 },
        { id: 'h4', date: '2025-12-30', method: 'Visa •••• 4321', amount: 24000 },
        { id: 'h5', date: '2025-11-29', method: 'Apple Pay',      amount: 18200 },
    ];

    const DEFAULT_METHOD = {
        id: 'card-saved',
        brand: 'Visa',
        last4: '4321',
    };

    const PAYMENT_METHODS = [
        {
            id: 'card-saved',
            type: 'saved-card',
            title: 'Visa',
            sub: '•••• 4321',
            subMono: true,
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
        },
        {
            id: 'card-new',
            type: 'new-card',
            title: 'Новая карта',
            sub: 'Ввести данные карты',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>',
        },
        {
            id: 'apple-pay',
            type: 'apple-pay',
            title: 'Apple Pay',
            sub: 'Оплата через Apple Pay',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.23c-.03-2.85 2.33-4.22 2.44-4.29-1.33-1.95-3.41-2.22-4.14-2.25-1.76-.18-3.44 1.04-4.34 1.04-.9 0-2.28-1.02-3.75-.99-1.93.03-3.71 1.12-4.7 2.85-2 3.47-.51 8.6 1.44 11.41.95 1.38 2.08 2.92 3.56 2.87 1.43-.06 1.97-.92 3.7-.92 1.72 0 2.22.92 3.74.89 1.54-.03 2.52-1.4 3.46-2.79.73-1.02 1.3-2.14 1.65-3.36-3.34-1.27-3.05-4.4-3.06-4.46zM14.47 3.46c.79-.97 1.33-2.3 1.18-3.64-1.14.05-2.52.76-3.34 1.72-.73.85-1.38 2.22-1.21 3.53 1.27.1 2.57-.65 3.37-1.61z"/></svg>',
        },
        {
            id: 'tg-stars',
            type: 'telegram-stars',
            title: 'Telegram Stars',
            sub: 'Оплата звёздами в Telegram',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.6L22 9.3l-5.5 5 1.7 7.3L12 17.9 5.8 21.6l1.7-7.3L2 9.3l7.4-.7L12 2z"/></svg>',
        },
    ];

    // ══ State ══
    const state = {
        expandedChildId: null,
        selectedMethodId: DEFAULT_METHOD.id,
        // контекст текущего открытия sheet: null = все дети, иначе childId
        paymentContext: null,
        paymentAmount: TOTAL.amount,
    };

    // ══ Формат ══
    const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

    function fmtAmount(n) {
        return n.toLocaleString('ru-RU').replace(/\s/g, ' ');
    }
    function fmtRub(n) {
        return fmtAmount(n) + ' ₽';
    }
    function fmtHistoryDate(iso) {
        const d = new Date(iso + 'T00:00:00');
        const day = d.getDate();
        const month = MONTHS_GEN[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    }

    // ══ DOM ══
    const $total = document.getElementById('pmTotalValue');
    const $period = document.getElementById('pmTotalPeriod');
    const $payAll = document.getElementById('pmPayAllBtn');
    const $childrenList = document.getElementById('pmChildrenList');
    const $historyList = document.getElementById('pmHistoryList');
    const $defaultMethodTitle = document.getElementById('pmDefaultMethodTitle');
    const $defaultMethodNumber = document.getElementById('pmDefaultMethodNumber');
    const $changeMethodBtn = document.getElementById('pmChangeMethodBtn');

    const $overlay = document.getElementById('sheetOverlay');
    const $sheet = document.getElementById('methodSheet');
    const $methodsList = document.getElementById('pmMethodsList');
    const $sheetAmount = document.getElementById('pmSheetAmount');
    const $payConfirmBtn = document.getElementById('pmPayConfirmBtn');
    const $payConfirmAmount = document.getElementById('pmPayConfirmAmount');

    const $toast = document.getElementById('pmToast');
    const $toastText = document.getElementById('pmToastText');

    // ══ Render: Total ══
    function renderTotal() {
        $total.textContent = fmtRub(TOTAL.amount);
        $period.textContent = 'за ' + TOTAL.period;
    }

    // ══ Render: Default method ══
    function renderDefaultMethod() {
        $defaultMethodTitle.textContent = DEFAULT_METHOD.brand;
        $defaultMethodNumber.textContent = '•••• ' + DEFAULT_METHOD.last4;
    }

    // ══ Render: Children list ══
    function renderChildren() {
        $childrenList.innerHTML = '';
        CHILDREN.forEach(function (child) {
            const card = document.createElement('div');
            card.className = 'pm-child-card';
            card.dataset.childId = child.id;

            const breakdownHtml = child.breakdown.map(function (b) {
                const isPackage = b.kind === 'package';
                const icon = isPackage
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
                return (
                    '<div class="pm-breakdown-row ' + (isPackage ? 'is-package' : '') + '">' +
                        '<div class="pm-breakdown-icon">' + icon + '</div>' +
                        '<div class="pm-breakdown-text">' + escapeHtml(b.title) +
                            '<span class="pm-breakdown-sub">' + escapeHtml(b.sub) + '</span>' +
                        '</div>' +
                        '<div class="pm-breakdown-amount">' + fmtRub(b.amount) + '</div>' +
                    '</div>'
                );
            }).join('');

            card.innerHTML =
                '<button class="pm-child-head" type="button" aria-expanded="false">' +
                    '<div class="pm-child-avatar avatar-variant variant-' + child.variant + '">' + escapeHtml(child.initial) + '</div>' +
                    '<div class="pm-child-text">' +
                        '<div class="pm-child-name">' + escapeHtml(child.name) + '</div>' +
                        '<div class="pm-child-meta">' + escapeHtml(child.meta) + '</div>' +
                    '</div>' +
                    '<div class="pm-child-amount">' + fmtRub(child.total) + '</div>' +
                    '<svg class="pm-child-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
                '</button>' +
                '<div class="pm-child-breakdown">' +
                    '<div class="pm-breakdown-list">' + breakdownHtml + '</div>' +
                    '<div class="pm-child-actions">' +
                        '<button class="pm-child-pay-btn" type="button" data-action="pay-child">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' +
                            '<span>Оплатить ' + fmtRub(child.total) + '</span>' +
                        '</button>' +
                    '</div>' +
                '</div>';

            // Header click — expand
            const $head = card.querySelector('.pm-child-head');
            $head.addEventListener('click', function () {
                toggleExpand(child.id);
            });

            // Pay-child button
            const $payBtn = card.querySelector('[data-action="pay-child"]');
            $payBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openSheet(child.id, child.total);
            });

            $childrenList.appendChild(card);
        });
    }

    function toggleExpand(childId) {
        state.expandedChildId = (state.expandedChildId === childId) ? null : childId;
        const cards = $childrenList.querySelectorAll('.pm-child-card');
        cards.forEach(function (card) {
            const isOpen = card.dataset.childId === state.expandedChildId;
            card.classList.toggle('expanded', isOpen);
            const head = card.querySelector('.pm-child-head');
            if (head) head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // ══ Render: History list ══
    function renderHistory() {
        $historyList.innerHTML = '';
        HISTORY.forEach(function (h) {
            const row = document.createElement('div');
            row.className = 'pm-history-row';
            row.innerHTML =
                '<div class="pm-history-icon">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
                '</div>' +
                '<div class="pm-history-text">' +
                    '<div class="pm-history-date">' + fmtHistoryDate(h.date) + '</div>' +
                    '<div class="pm-history-method">' + escapeHtml(h.method) + '</div>' +
                '</div>' +
                '<div class="pm-history-right">' +
                    '<div class="pm-history-amount">' + fmtRub(h.amount) + '</div>' +
                    '<span class="pm-badge pm-badge--paid">Оплачено</span>' +
                '</div>';
            $historyList.appendChild(row);
        });
    }

    // ══ Render: Methods list (in sheet) ══
    function renderMethods() {
        $methodsList.innerHTML = '';
        PAYMENT_METHODS.forEach(function (m) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pm-method-option' + (m.id === state.selectedMethodId ? ' selected' : '');
            btn.dataset.methodId = m.id;
            btn.innerHTML =
                '<div class="pm-method-option-icon">' + m.icon + '</div>' +
                '<div class="pm-method-option-text">' +
                    '<div class="pm-method-option-title">' + escapeHtml(m.title) + '</div>' +
                    '<div class="pm-method-option-sub ' + (m.subMono ? 'is-mono' : '') + '">' + escapeHtml(m.sub) + '</div>' +
                '</div>' +
                '<div class="pm-method-radio"></div>';

            btn.addEventListener('click', function () {
                state.selectedMethodId = m.id;
                renderMethods();
            });
            $methodsList.appendChild(btn);
        });
    }

    // ══ Sheet ══
    function openSheet(context, amount) {
        state.paymentContext = context; // null | childId
        state.paymentAmount = amount;
        $sheetAmount.textContent = fmtRub(amount);
        $payConfirmAmount.textContent = fmtRub(amount);
        renderMethods();
        $overlay.classList.add('active');
        $sheet.classList.add('open');
    }

    function closeSheet() {
        $overlay.classList.remove('active');
        $sheet.classList.remove('open');
    }

    // ══ Pay confirm ══
    function handlePayConfirm() {
        if ($payConfirmBtn.classList.contains('is-loading')) return;
        $payConfirmBtn.classList.add('is-loading');
        $payConfirmBtn.disabled = true;

        setTimeout(function () {
            $payConfirmBtn.classList.remove('is-loading');
            $payConfirmBtn.disabled = false;
            closeSheet();

            const whom = state.paymentContext
                ? (CHILDREN.find(function (c) { return c.id === state.paymentContext; }) || {}).name
                : 'все занятия';
            const msg = state.paymentContext
                ? 'Оплачено: ' + whom
                : 'Оплата прошла успешно';
            showToast(msg, true);
        }, 1100);
    }

    // ══ Toast ══
    let toastTimer = null;
    function showToast(text, success) {
        $toastText.textContent = text;
        $toast.classList.toggle('toast--success', !!success);
        $toast.classList.add('active');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            $toast.classList.remove('active');
        }, 2400);
    }

    // ══ Utils ══
    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ══ Events ══
    $payAll.addEventListener('click', function () {
        openSheet(null, TOTAL.amount);
    });

    $changeMethodBtn.addEventListener('click', function () {
        // мок: открываем sheet в контексте "сменить" (сумма = total)
        openSheet(null, TOTAL.amount);
    });

    $overlay.addEventListener('click', closeSheet);

    $payConfirmBtn.addEventListener('click', handlePayConfirm);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && $sheet.classList.contains('open')) {
            closeSheet();
        }
    });

    // ══ Init ══
    renderTotal();
    renderDefaultMethod();
    renderChildren();
    renderHistory();

})();
