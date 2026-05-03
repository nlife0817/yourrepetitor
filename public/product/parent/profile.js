/* ══════════════════════════════════════════
   ── parent/profile.js — Профиль родителя ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ══ Моки ══
    const PARENT = {
        name: 'Ольга Соколова',
        email: 'olga.sokolova@mail.ru',
        tg_connected: true,
        tg_username: '@olga_sokolova',
        avatar_variant: 'orange',
        initial: 'О'
    };

    const CHILDREN = [
        {
            id: 'c1',
            name: 'Артём Соколов',
            age: 14,
            grade: '8 класс',
            initial: 'А',
            variant: 'indigo',
            lessons_per_month: 8
        },
        {
            id: 'c2',
            name: 'Мария Соколова',
            age: 11,
            grade: '5 класс',
            initial: 'М',
            variant: 'green',
            lessons_per_month: 6
        }
    ];

    const TUTORS = [
        {
            name: 'Елена Петрова',
            initial: 'Е',
            variant: 'indigo',
            tg: 'elena_p',
            teachesChildren: ['c1']
        },
        {
            name: 'Игорь Смирнов',
            initial: 'И',
            variant: 'orange',
            tg: 'igor_s',
            teachesChildren: ['c1', 'c2']
        },
        {
            name: 'Мария Ковалёва',
            initial: 'М',
            variant: 'green',
            tg: 'maria_k',
            teachesChildren: ['c2']
        }
    ];

    const TELEGRAM = {
        username: '@olga_sokolova'
    };

    // ══ DOM refs ══
    const $ = (id) => document.getElementById(id);

    // ══ Hero ══
    function renderHero() {
        document.querySelector('.pp-hero-name').textContent = PARENT.name;
        $('ppHeroEmail').textContent = PARENT.email;

        const avatar = $('ppHeroAvatar');
        avatar.textContent = PARENT.initial;
        avatar.classList.remove('variant-indigo', 'variant-orange', 'variant-green');
        avatar.classList.add('variant-' + PARENT.avatar_variant);

        // Toggle tg-connected line visibility
        const tgLine = $('ppHeroTg');
        tgLine.style.display = PARENT.tg_connected ? '' : 'none';
    }

    // ══ Children ══
    function renderChildren() {
        const root = $('ppChildrenList');
        root.innerHTML = '';

        CHILDREN.forEach((c) => {
            const card = document.createElement('button');
            card.className = 'pp-child-card';
            card.type = 'button';
            card.innerHTML = `
                <div class="pp-child-avatar avatar-variant variant-${c.variant}">${escapeHtml(c.initial)}</div>
                <div class="pp-child-text">
                    <div class="pp-child-name">${escapeHtml(c.name)}</div>
                    <div class="pp-child-meta">${escapeHtml(c.grade)} · ${c.age} лет</div>
                </div>
                <div class="pp-child-stats">${c.lessons_per_month} ур/мес</div>
                <svg class="pp-child-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            `;
            card.addEventListener('click', () => {
                alert(`Открывается профиль ребёнка: ${c.name}`);
            });
            root.appendChild(card);
        });
    }

    // ══ Tutors ══
    function renderTutors() {
        const root = $('ppTutorsList');
        root.innerHTML = '';

        TUTORS.forEach((t) => {
            const teachesNames = t.teachesChildren
                .map((childId) => {
                    const child = CHILDREN.find((c) => c.id === childId);
                    return child ? child.name.split(' ')[0] : null;
                })
                .filter(Boolean)
                .join(', ');

            const card = document.createElement('div');
            card.className = 'pp-tutor-card';
            card.innerHTML = `
                <div class="pp-tutor-avatar avatar-variant variant-${t.variant}">${escapeHtml(t.initial)}</div>
                <div class="pp-tutor-text">
                    <div class="pp-tutor-name">${escapeHtml(t.name)}</div>
                    <div class="pp-tutor-sub">Преподаёт ${escapeHtml(teachesNames)}</div>
                </div>
                <button class="pp-tutor-tg-btn" type="button" title="Написать в Telegram" aria-label="Написать ${escapeHtml(t.name)} в Telegram">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path d="M21.2 4.4L2.4 11.3c-.5.2-.5.9 0 1l4.4 1.5 1.7 5.3c.1.4.6.6 1 .3l2.4-2 4.7 3.5c.4.3 1 .1 1.1-.4L21.9 5.3c.1-.5-.3-.9-.7-.9z" fill="currentColor"/>
                    </svg>
                </button>
            `;
            card.querySelector('.pp-tutor-tg-btn').addEventListener('click', () => {
                showToast(`Открываем чат: @${t.tg}`);
            });
            root.appendChild(card);
        });
    }

    // ══ Telegram ══
    function renderTelegram() {
        $('ppTgUsername').textContent = TELEGRAM.username;
    }

    function handleTgUnlink() {
        openConfirm({
            title: 'Отвязать Telegram?',
            text: 'Вы перестанете получать уведомления в Telegram. Привязать снова можно будет в настройках.',
            okLabel: 'Отвязать',
            onOk: () => {
                showToast('Telegram отвязан');
            }
        });
    }

    // ══ Toggles ══
    function bindToggles() {
        document.querySelectorAll('.toggle-switch').forEach((el) => {
            el.addEventListener('click', () => {
                const on = el.classList.toggle('on');
                el.setAttribute('aria-checked', on ? 'true' : 'false');
            });
        });
    }

    // ══ Edit / Add child / Help / Logout ══
    function bindActions() {
        $('ppHeroEdit').addEventListener('click', () => {
            showToast('Редактирование профиля (мок)');
        });
        $('ppAddChildBtn').addEventListener('click', () => {
            showToast('Добавление ребёнка (мок)');
        });
        $('ppTgUnlink').addEventListener('click', handleTgUnlink);
        $('ppHelpBtn').addEventListener('click', () => {
            showToast('Открываем поддержку (мок)');
        });
        $('ppLogoutBtn').addEventListener('click', () => {
            openConfirm({
                title: 'Выйти из аккаунта?',
                text: 'Вы сможете войти снова в любое время.',
                okLabel: 'Выйти',
                onOk: () => showToast('Выход (мок)')
            });
        });
    }

    // ══ Confirm dialog ══
    let confirmState = null;

    function openConfirm({ title, text, okLabel, onOk }) {
        confirmState = { onOk };
        $('ppConfirmTitle').textContent = title;
        $('ppConfirmText').textContent = text;
        $('ppConfirmOk').textContent = okLabel || 'Подтвердить';
        $('ppConfirmOverlay').classList.add('open');
        $('ppConfirmDialog').classList.add('open');
    }

    function closeConfirm() {
        $('ppConfirmOverlay').classList.remove('open');
        $('ppConfirmDialog').classList.remove('open');
        confirmState = null;
    }

    function bindConfirm() {
        $('ppConfirmOverlay').addEventListener('click', closeConfirm);
        $('ppConfirmCancel').addEventListener('click', closeConfirm);
        $('ppConfirmOk').addEventListener('click', () => {
            const cb = confirmState && confirmState.onOk;
            closeConfirm();
            if (cb) cb();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && $('ppConfirmDialog').classList.contains('open')) {
                closeConfirm();
            }
        });
    }

    // ══ Toast ══
    let toastTimer = null;
    function showToast(text) {
        const t = $('ppToast');
        $('ppToastText').textContent = text;
        t.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    // ══ Utils ══
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ══ Init ══
    function init() {
        renderHero();
        renderChildren();
        renderTutors();
        renderTelegram();
        bindToggles();
        bindActions();
        bindConfirm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
