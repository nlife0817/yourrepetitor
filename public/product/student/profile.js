/* ══════════════════════════════════════════
   ── student/profile.js — Профиль ученика ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ══ Моки ══
    const STUDENT = {
        name: 'Анна Соколова',
        age: 15,
        grade: '9 класс',
        level: 'Intermediate',
        tz: 'Europe/Moscow · UTC+3',
        avatar_variant: 'orange',
        initial: 'А'
    };

    const TUTORS = [
        { name: 'Елена Петрова', subject: 'Математика', initial: 'Е', variant: 'indigo', tg: 'elena_p' },
        { name: 'Игорь Смирнов', subject: 'Английский язык', initial: 'И', variant: 'green', tg: 'igor_s' },
        { name: 'Мария Ковалёва', subject: 'Физика', initial: 'М', variant: 'orange', tg: 'maria_k' }
    ];

    const PARENTS = [
        { name: 'Ольга Соколова', relation: 'Мама', initial: 'О', variant: 'indigo' },
        { name: 'Дмитрий Соколов', relation: 'Папа', initial: 'Д', variant: 'green' }
    ];

    const TELEGRAM = {
        username: '@anna_sokolova'
    };

    // ══ DOM refs ══
    const $ = (id) => document.getElementById(id);

    // ══ Hero ══
    function renderHero() {
        $('puHeroName').textContent = STUDENT.name;
        $('puHeroMeta').textContent = `${STUDENT.age} лет · ${STUDENT.grade} · ${STUDENT.level}`;
        $('puTzText').textContent = STUDENT.tz;

        const avatar = $('puHeroAvatar');
        avatar.textContent = STUDENT.initial;
        avatar.classList.remove('variant-indigo', 'variant-orange', 'variant-green');
        avatar.classList.add('variant-' + STUDENT.avatar_variant);
    }

    // ══ Tutors ══
    function renderTutors() {
        const root = $('puTutorsList');
        root.innerHTML = '';
        TUTORS.forEach((t) => {
            const card = document.createElement('div');
            card.className = 'pu-person-card';
            card.innerHTML = `
                <div class="pu-person-avatar avatar-variant variant-${t.variant}">${escapeHtml(t.initial)}</div>
                <div class="pu-person-text">
                    <div class="pu-person-name">${escapeHtml(t.name)}</div>
                    <div class="pu-person-sub">${escapeHtml(t.subject)}</div>
                </div>
                <button class="pu-person-tg-btn" type="button" title="Написать в Telegram" aria-label="Написать ${escapeHtml(t.name)} в Telegram" data-tg="${escapeHtml(t.tg)}">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path d="M21.2 4.4L2.4 11.3c-.5.2-.5.9 0 1l4.4 1.5 1.7 5.3c.1.4.6.6 1 .3l2.4-2 4.7 3.5c.4.3 1 .1 1.1-.4L21.9 5.3c.1-.5-.3-.9-.7-.9z" fill="currentColor"/>
                    </svg>
                </button>
            `;
            card.querySelector('.pu-person-tg-btn').addEventListener('click', () => {
                showToast(`Открываем чат: @${t.tg}`);
            });
            root.appendChild(card);
        });
    }

    // ══ Parents ══
    function renderParents() {
        const root = $('puParentsList');
        const empty = $('puParentsEmpty');
        root.innerHTML = '';

        if (!PARENTS.length) {
            root.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        root.style.display = '';
        empty.style.display = 'none';

        PARENTS.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'pu-person-card';
            card.innerHTML = `
                <div class="pu-person-avatar avatar-variant variant-${p.variant}">${escapeHtml(p.initial)}</div>
                <div class="pu-person-text">
                    <div class="pu-person-name">${escapeHtml(p.name)} · ${escapeHtml(p.relation)}</div>
                    <div class="pu-person-sub muted">может видеть расписание и оплаты</div>
                </div>
                <button class="pu-person-unlink" type="button" data-idx="${idx}">Отвязать</button>
            `;
            const btn = card.querySelector('.pu-person-unlink');
            btn.addEventListener('click', () => handleUnlinkParent(btn, p, idx));
            root.appendChild(card);
        });
    }

    function handleUnlinkParent(btn, parent, idx) {
        // step 1 — inline confirming state
        if (!btn.classList.contains('confirming')) {
            btn.classList.add('confirming');
            btn.textContent = 'Точно?';
            const reset = () => {
                btn.classList.remove('confirming');
                btn.textContent = 'Отвязать';
                btn.removeEventListener('blur', reset);
            };
            setTimeout(() => btn.addEventListener('blur', reset), 0);
            setTimeout(() => {
                if (btn.classList.contains('confirming')) reset();
            }, 3000);
            return;
        }
        // step 2 — full modal confirm
        openConfirm({
            title: 'Отвязать родителя?',
            text: `${parent.name} (${parent.relation}) больше не сможет видеть ваши занятия и оплаты.`,
            okLabel: 'Отвязать',
            onOk: () => {
                PARENTS.splice(idx, 1);
                renderParents();
                showToast('Родитель отвязан');
            }
        });
    }

    // ══ Telegram ══
    function renderTelegram() {
        $('puTgUsername').textContent = TELEGRAM.username;
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

    // ══ Edit / Help / Logout ══
    function bindActions() {
        $('puHeroEdit').addEventListener('click', () => {
            showToast('Редактирование профиля (мок)');
        });
        $('puTgUnlink').addEventListener('click', handleTgUnlink);
        $('puHelpBtn').addEventListener('click', () => {
            showToast('Открываем поддержку (мок)');
        });
        $('puLogoutBtn').addEventListener('click', () => {
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
        $('puConfirmTitle').textContent = title;
        $('puConfirmText').textContent = text;
        $('puConfirmOk').textContent = okLabel || 'Подтвердить';
        $('puConfirmOverlay').classList.add('open');
        $('puConfirmDialog').classList.add('open');
    }

    function closeConfirm() {
        $('puConfirmOverlay').classList.remove('open');
        $('puConfirmDialog').classList.remove('open');
        confirmState = null;
    }

    function bindConfirm() {
        $('puConfirmOverlay').addEventListener('click', closeConfirm);
        $('puConfirmCancel').addEventListener('click', closeConfirm);
        $('puConfirmOk').addEventListener('click', () => {
            const cb = confirmState && confirmState.onOk;
            closeConfirm();
            if (cb) cb();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && $('puConfirmDialog').classList.contains('open')) {
                closeConfirm();
            }
        });
    }

    // ══ Toast ══
    let toastTimer = null;
    function showToast(text) {
        const t = $('puToast');
        $('puToastText').textContent = text;
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
        renderTutors();
        renderParents();
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
