/* ══════════════════════════════════════════
   ── parent/schedule.js — Расписание ребёнка ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Mocks ──────────────────────────────
    const TUTORS = {
        petrova:  { name: 'Анна Петровна',   variant: 'indigo', avatar: 'А', subject: 'Математика' },
        ivanov:   { name: 'Дмитрий Иванов',  variant: 'orange', avatar: 'Д', subject: 'Физика' },
        smirnova: { name: 'Елена Смирнова',  variant: 'green',  avatar: 'Е', subject: 'Английский' },
    };

    const CHILDREN = [
        { id: 'c1', name: 'Артём',  age: 14, class: '8 класс', variant: 'indigo', initial: 'А' },
        { id: 'c2', name: 'София',  age: 11, class: '5 класс', variant: 'orange', initial: 'С' },
    ];

    let ACTIVE_CHILD_ID = CHILDREN[0].id;

    // Today = 2026-04-20 (Понедельник)
    const TODAY = new Date(2026, 3, 20, 14, 0);

    function mkDate(y, m, d, h, min) { return new Date(y, m, d, h, min); }

    const LESSONS_BY_CHILD = {
        c1: {
            upcoming: [
                { id: 'c1u1', tutorId: 'petrova',  start: mkDate(2026, 3, 20, 18, 0),  durationMin: 60, price: 1900, payment: 'pending', rescheduleHistory: [] },
                { id: 'c1u2', tutorId: 'ivanov',   start: mkDate(2026, 3, 21, 16, 30), durationMin: 90, price: 2400, payment: 'paid',    rescheduleHistory: [{ from: '15.04 16:30', to: '21.04 16:30', reason: 'Просьба ученика' }] },
                { id: 'c1u3', tutorId: 'petrova',  start: mkDate(2026, 3, 22, 14, 0),  durationMin: 60, price: 1900, payment: 'pending', rescheduleHistory: [] },
                { id: 'c1u4', tutorId: 'smirnova', start: mkDate(2026, 3, 23, 17, 0),  durationMin: 60, price: 1700, payment: 'pending', rescheduleHistory: [] },
                { id: 'c1u5', tutorId: 'petrova',  start: mkDate(2026, 3, 25, 15, 0),  durationMin: 60, price: 1900, payment: 'paid',    rescheduleHistory: [] },
                { id: 'c1u6', tutorId: 'ivanov',   start: mkDate(2026, 3, 28, 17, 0),  durationMin: 90, price: 2400, payment: 'pending', rescheduleHistory: [] },
            ],
            past: [
                { id: 'c1p1', tutorId: 'petrova',  start: mkDate(2026, 3, 18, 18, 0),  durationMin: 60, price: 1900, payment: 'paid', status: 'completed', rescheduleHistory: [] },
                { id: 'c1p2', tutorId: 'ivanov',   start: mkDate(2026, 3, 17, 16, 30), durationMin: 90, price: 2400, payment: 'paid', status: 'completed', rescheduleHistory: [] },
                { id: 'c1p3', tutorId: 'smirnova', start: mkDate(2026, 3, 16, 17, 0),  durationMin: 60, price: 1700, payment: 'paid', status: 'cancelled', rescheduleHistory: [] },
                { id: 'c1p4', tutorId: 'petrova',  start: mkDate(2026, 3, 14, 18, 0),  durationMin: 60, price: 1900, payment: 'paid', status: 'completed', rescheduleHistory: [{ from: '12.04 18:00', to: '14.04 18:00', reason: 'Болезнь репетитора' }] },
                { id: 'c1p5', tutorId: 'ivanov',   start: mkDate(2026, 3, 12, 17, 0),  durationMin: 60, price: 1700, payment: 'pending', status: 'missed', rescheduleHistory: [] },
                { id: 'c1p6', tutorId: 'petrova',  start: mkDate(2026, 3, 11, 18, 0),  durationMin: 60, price: 1900, payment: 'paid', status: 'completed', rescheduleHistory: [] },
            ],
        },
        c2: {
            upcoming: [
                { id: 'c2u1', tutorId: 'smirnova', start: mkDate(2026, 3, 20, 16, 0),  durationMin: 45, price: 1400, payment: 'paid',    rescheduleHistory: [] },
                { id: 'c2u2', tutorId: 'smirnova', start: mkDate(2026, 3, 22, 16, 0),  durationMin: 45, price: 1400, payment: 'pending', rescheduleHistory: [] },
                { id: 'c2u3', tutorId: 'petrova',  start: mkDate(2026, 3, 24, 15, 0),  durationMin: 60, price: 1800, payment: 'pending', rescheduleHistory: [] },
                { id: 'c2u4', tutorId: 'smirnova', start: mkDate(2026, 3, 27, 16, 0),  durationMin: 45, price: 1400, payment: 'pending', rescheduleHistory: [] },
            ],
            past: [
                { id: 'c2p1', tutorId: 'smirnova', start: mkDate(2026, 3, 17, 16, 0),  durationMin: 45, price: 1400, payment: 'paid', status: 'completed', rescheduleHistory: [] },
                { id: 'c2p2', tutorId: 'petrova',  start: mkDate(2026, 3, 15, 15, 0),  durationMin: 60, price: 1800, payment: 'paid', status: 'completed', rescheduleHistory: [] },
                { id: 'c2p3', tutorId: 'smirnova', start: mkDate(2026, 3, 13, 16, 0),  durationMin: 45, price: 1400, payment: 'paid', status: 'completed', rescheduleHistory: [] },
            ],
        },
    };

    // ── DOM ────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const el = {
        subtitle: $('#paPageSubtitle'),
        childSwitcherWrap: $('#paChildSwitcherWrap'),
        childSwitcher: $('#paChildSwitcher'),
        singleChildCard: $('#paSingleChildCard'),
        singleChildAvatar: $('#paSingleChildAvatar'),
        singleChildName: $('#paSingleChildName'),
        singleChildMeta: $('#paSingleChildMeta'),
        listUpcoming: $('#paListUpcoming'),
        listPast: $('#paListPast'),
        empty: $('#paEmpty'),
        emptyTitle: $('#paEmptyTitle'),
        toggle: $('.pa-view-toggle'),
        overlay: $('#sheetOverlay'),
        sheet: $('#detailSheet'),
        detailAccent: $('#detailAccent'),
        detailAvatar: $('#detailAvatar'),
        detailName: $('#detailName'),
        detailSubject: $('#detailSubject'),
        detailTutorAvatar: $('#detailTutorAvatar'),
        detailTutorName: $('#detailTutorName'),
        detailTutorTgBtn: $('#detailTutorTgBtn'),
        detailDate: $('#detailDate'),
        detailDuration: $('#detailDuration'),
        detailBadge: $('#detailBadge'),
        detailAmount: $('#detailAmount'),
        rescheduleHistorySection: $('#rescheduleHistorySection'),
        rescheduleHistoryToggle: $('#rescheduleHistoryToggle'),
        rescheduleHistoryBody: $('#rescheduleHistoryBody'),
        rhCount: $('#rhCount'),
        rhChevron: $('#rhChevron'),
        detailHandle: $('#detailHandle'),
        btnClose: $('#detailBtnClose'),
    };

    let currentView = 'upcoming';
    let currentLesson = null;
    let currentTutor = null;

    // ── Helpers ────────────────────────────
    const DOW_SHORT = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'];
    const DOW_LONG  = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const MONTH_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    function sameDay(a, b) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    function daysDiff(a, b) {
        const a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
        const b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.round((a0 - b0) / 86400000);
    }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmtHHMM(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
    function fmtDuration(m) {
        if (m < 60) return m + ' мин';
        if (m % 60 === 0) return (m / 60) + ' ч';
        return Math.floor(m / 60) + ' ч ' + (m % 60) + ' мин';
    }
    function fmtDurationShort(m) {
        if (m < 60) return m + ' мин';
        if (m % 60 === 0) return (m / 60 * 60) + ' мин';
        return m + ' мин';
    }
    function fmtMoney(n) { return new Intl.NumberFormat('ru-RU').format(n); }
    function dateGroupLabel(d) {
        const diff = daysDiff(d, TODAY);
        const dayName = DOW_SHORT[d.getDay()];
        const tail = d.getDate() + ' ' + MONTH_GEN[d.getMonth()];
        if (diff === 0)  return { label: 'СЕГОДНЯ', tail, today: true };
        if (diff === 1)  return { label: 'ЗАВТРА', tail, today: false };
        if (diff === -1) return { label: 'ВЧЕРА', tail, today: false };
        return { label: dayName, tail, today: false };
    }
    function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
    function fullDateLabel(d) {
        return capitalize(DOW_LONG[d.getDay()]) + ', ' + d.getDate() + ' ' + MONTH_GEN[d.getMonth()];
    }
    function groupByDay(list) {
        const map = new Map();
        for (const lesson of list) {
            const key = lesson.start.getFullYear() + '-' + lesson.start.getMonth() + '-' + lesson.start.getDate();
            if (!map.has(key)) map.set(key, { date: lesson.start, items: [] });
            map.get(key).items.push(lesson);
        }
        return Array.from(map.values());
    }

    function activeChild() { return CHILDREN.find(c => c.id === ACTIVE_CHILD_ID) || CHILDREN[0]; }

    // ── Child switcher ─────────────────────
    function renderChildSwitcher() {
        if (CHILDREN.length <= 1) {
            el.childSwitcherWrap.style.display = 'none';
            el.singleChildCard.style.display = '';
            const c = CHILDREN[0];
            el.singleChildAvatar.className = 'pa-single-child-avatar avatar-variant variant-' + c.variant;
            el.singleChildAvatar.textContent = c.initial;
            el.singleChildName.textContent = c.name;
            el.singleChildMeta.textContent = c.class + ' · ' + c.age + ' ' + pluralYears(c.age);
            return;
        }
        el.childSwitcherWrap.style.display = '';
        el.singleChildCard.style.display = 'none';
        el.childSwitcher.innerHTML = '';
        CHILDREN.forEach((c) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'pa-child-chip' + (c.id === ACTIVE_CHILD_ID ? ' active' : '');
            chip.setAttribute('role', 'tab');
            chip.setAttribute('aria-selected', c.id === ACTIVE_CHILD_ID ? 'true' : 'false');
            chip.dataset.id = c.id;
            chip.innerHTML = `
                <span class="pa-child-chip-avatar avatar-variant variant-${c.variant}">${c.initial}</span>
                <span>${c.name}</span>
            `;
            chip.addEventListener('click', () => {
                ACTIVE_CHILD_ID = c.id;
                renderChildSwitcher();
                renderCurrent();
            });
            el.childSwitcher.appendChild(chip);
        });
    }

    function pluralYears(n) {
        const mod10 = n % 10, mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'лет';
        if (mod10 === 1) return 'год';
        if (mod10 >= 2 && mod10 <= 4) return 'года';
        return 'лет';
    }

    // ── Render lesson lists ────────────────
    function paymentBadgeHTML(lesson) {
        if (lesson.payment === 'paid')    return '<span class="pa-badge paid">Оплачено</span>';
        if (lesson.payment === 'pending') return '<span class="pa-badge pending">Ожидает</span>';
        return '';
    }
    function statusBadgeHTML(lesson) {
        if (lesson.status === 'completed') return '<span class="pa-badge completed">Проведено</span>';
        if (lesson.status === 'cancelled') return '<span class="pa-badge cancelled-b">Отменено</span>';
        if (lesson.status === 'missed')    return '<span class="pa-badge missed">Не посетили</span>';
        return '';
    }

    function renderCard(lesson, isPast) {
        const t = TUTORS[lesson.tutorId];
        const card = document.createElement('div');
        card.className = 'pa-lesson-card variant-' + t.variant;
        if (isPast && lesson.status === 'cancelled') card.classList.add('cancelled');
        if (isPast && lesson.status === 'missed')    card.classList.add('missed');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', t.subject + ' с ' + t.name + ', ' + fmtHHMM(lesson.start));
        card.dataset.id = lesson.id;

        const rightHTML = isPast ? statusBadgeHTML(lesson) : paymentBadgeHTML(lesson);

        card.innerHTML = `
            <div class="pa-card-time">
                <span class="pa-card-time-hhmm">${fmtHHMM(lesson.start)}</span>
                <span class="pa-card-time-duration">${fmtDurationShort(lesson.durationMin)}</span>
            </div>
            <div class="pa-card-middle">
                <span class="pa-card-subject">${t.subject}</span>
                <span class="pa-card-tutor">
                    <span class="pa-card-tutor-label">Репетитор:</span>
                    <span class="pa-card-tutor-avatar avatar-variant variant-${t.variant}">${t.avatar}</span>
                    <span class="pa-card-tutor-name">${t.name}</span>
                </span>
            </div>
            <div class="pa-card-right">${rightHTML}</div>
        `;
        card.addEventListener('click', () => openDetail(lesson, isPast));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(lesson, isPast); }
        });
        return card;
    }

    function renderList(listEl, lessons, isPast) {
        listEl.innerHTML = '';
        const child = activeChild();
        if (lessons.length === 0) {
            el.empty.style.display = 'flex';
            el.emptyTitle.textContent = 'У ' + child.name + ' пока нет занятий';
            return;
        }
        el.empty.style.display = 'none';

        const groups = groupByDay(lessons);
        groups.forEach((g, gi) => {
            const groupEl = document.createElement('div');
            groupEl.className = 'pa-date-group';
            const label = dateGroupLabel(g.date);
            const headerEl = document.createElement('div');
            headerEl.className = 'pa-date-header' + (label.today ? ' today' : '');
            headerEl.innerHTML = `${label.label} <span class="pa-date-sep">·</span> ${label.tail}`;
            groupEl.appendChild(headerEl);

            const cards = document.createElement('div');
            cards.className = 'pa-lesson-cards';
            g.items.forEach((lesson, i) => {
                const card = renderCard(lesson, isPast);
                card.style.animationDelay = (gi * 60 + i * 30) + 'ms';
                cards.appendChild(card);
            });
            groupEl.appendChild(cards);
            listEl.appendChild(groupEl);
        });
    }

    function renderCurrent() {
        const data = LESSONS_BY_CHILD[ACTIVE_CHILD_ID] || { upcoming: [], past: [] };
        if (currentView === 'upcoming') {
            el.listUpcoming.style.display = '';
            el.listPast.style.display = 'none';
            renderList(el.listUpcoming, data.upcoming, false);
        } else {
            el.listUpcoming.style.display = 'none';
            el.listPast.style.display = '';
            renderList(el.listPast, data.past, true);
        }
    }

    function switchView(view) {
        currentView = view;
        el.toggle.querySelectorAll('button').forEach((btn) => {
            const active = btn.dataset.view === view;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderCurrent();
    }

    // ── Detail sheet (parent view-only) ────
    function openDetail(lesson, isPast) {
        currentLesson = { ...lesson, isPast };
        const t = TUTORS[lesson.tutorId];
        const child = activeChild();
        currentTutor = t;

        // Variant (based on child)
        el.detailAccent.className = 'detail-sheet-accent variant-' + child.variant;
        el.detailAvatar.className = 'detail-student-avatar avatar-variant variant-' + child.variant;
        el.detailAvatar.textContent = child.initial;
        el.detailName.textContent = child.name;
        el.detailSubject.textContent = t.subject;

        // Tutor
        el.detailTutorAvatar.className = 'pa-tutor-avatar avatar-variant variant-' + t.variant;
        el.detailTutorAvatar.textContent = t.avatar;
        el.detailTutorName.textContent = t.name;

        // Date/time
        el.detailDate.textContent = fullDateLabel(lesson.start);
        const endDate = new Date(lesson.start.getTime() + lesson.durationMin * 60000);
        el.detailDuration.textContent = `${fmtHHMM(lesson.start)} — ${fmtHHMM(endDate)} · ${fmtDuration(lesson.durationMin)}`;

        // Payment
        if (lesson.payment === 'paid') {
            el.detailBadge.className = 'detail-payment-badge paid';
            el.detailBadge.textContent = 'Оплачено';
        } else {
            el.detailBadge.className = 'detail-payment-badge pending';
            el.detailBadge.textContent = 'Ожидает оплаты';
        }
        el.detailAmount.textContent = fmtMoney(lesson.price);

        // Reschedule history
        if (lesson.rescheduleHistory && lesson.rescheduleHistory.length > 0) {
            el.rescheduleHistorySection.style.display = '';
            el.rhCount.textContent = lesson.rescheduleHistory.length;
            el.rescheduleHistoryBody.innerHTML = lesson.rescheduleHistory.map((h) => `
                <div class="reschedule-history-item">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                    </svg>
                    <div class="reschedule-history-text">
                        <strong>${h.from}</strong> → <strong>${h.to}</strong>
                        <span class="rh-reason">${h.reason || ''}</span>
                    </div>
                </div>
            `).join('');
            const autoOpen = lesson.rescheduleHistory.length <= 1;
            el.rescheduleHistoryBody.classList.toggle('open', autoOpen);
            el.rhChevron.classList.toggle('expanded', autoOpen);
            requestAnimationFrame(() => {
                el.rescheduleHistoryBody.style.maxHeight = autoOpen ? el.rescheduleHistoryBody.scrollHeight + 'px' : '0px';
            });
        } else {
            el.rescheduleHistorySection.style.display = 'none';
        }

        // Open
        el.overlay.classList.add('open');
        el.sheet.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
        el.overlay.classList.remove('open');
        el.sheet.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ── Event bindings ─────────────────────
    el.toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-view]');
        if (btn) switchView(btn.dataset.view);
    });

    el.overlay.addEventListener('click', closeDetail);
    el.detailHandle.addEventListener('click', closeDetail);
    el.btnClose.addEventListener('click', closeDetail);

    // Reschedule history toggle
    el.rescheduleHistoryToggle.addEventListener('click', () => {
        const body = el.rescheduleHistoryBody;
        const open = body.classList.toggle('open');
        el.rhChevron.classList.toggle('expanded', open);
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });

    // Tutor TG button
    el.detailTutorTgBtn.addEventListener('click', () => {
        if (currentTutor) {
            alert('Открыть чат с репетитором: ' + currentTutor.name);
        }
    });

    // ── Init ───────────────────────────────
    function updateSubtitle() {
        el.subtitle.textContent = capitalize(DOW_LONG[TODAY.getDay()]) + ', ' + TODAY.getDate() + ' ' + MONTH_GEN[TODAY.getMonth()];
    }
    updateSubtitle();
    renderChildSwitcher();
    switchView('upcoming');
})();
