/* ══════════════════════════════════════════
   ── student/schedule.js — Моё расписание ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Mocks ──────────────────────────────
    const TUTORS = {
        petrova: { name: 'Елена Петрова', variant: 'indigo', avatar: 'Е', subject: 'Математика' },
        ivanov:  { name: 'Дмитрий Иванов', variant: 'orange', avatar: 'Д', subject: 'Физика' },
        smirnova:{ name: 'Анна Смирнова',  variant: 'green',  avatar: 'А', subject: 'Английский' },
    };

    // Today = 2026-04-20 (Понедельник)
    const TODAY = new Date(2026, 3, 20, 14, 0);  // апрель = month 3

    // Upcoming lessons (sorted by date asc)
    const LESSONS_UPCOMING = [
        // today
        { id: 'u1', tutorId: 'petrova', start: mkDate(2026, 3, 20, 18, 0), durationMin: 60, price: 1900, payment: 'pending',  format: 'online',  rescheduleHistory: [] },
        // tomorrow
        { id: 'u2', tutorId: 'ivanov',  start: mkDate(2026, 3, 21, 16, 30), durationMin: 90, price: 0,    payment: 'package', format: 'online',  rescheduleHistory: [{ from: '15.04 16:30', to: '21.04 16:30', reason: 'Просьба ученика' }] },
        { id: 'u3', tutorId: 'petrova', start: mkDate(2026, 3, 21, 19, 0),  durationMin: 60, price: 1900, payment: 'paid',    format: 'online',  rescheduleHistory: [] },
        // +5 days (25 apr — saturday)
        { id: 'u4', tutorId: 'smirnova',start: mkDate(2026, 3, 25, 11, 0),  durationMin: 60, price: 1600, payment: 'pending', format: 'offline', rescheduleHistory: [] },
        { id: 'u5', tutorId: 'petrova', start: mkDate(2026, 3, 25, 15, 0),  durationMin: 60, price: 1900, payment: 'paid',    format: 'online',  rescheduleHistory: [] },
        // +6 days
        { id: 'u6', tutorId: 'ivanov',  start: mkDate(2026, 3, 26, 17, 0),  durationMin: 60, price: 0,    payment: 'package', format: 'online',  rescheduleHistory: [] },
        // next week
        { id: 'u7', tutorId: 'petrova', start: mkDate(2026, 3, 28, 18, 0),  durationMin: 60, price: 1900, payment: 'paid',    format: 'online',  rescheduleHistory: [] },
    ];

    // Past lessons (sorted by date desc)
    const LESSONS_PAST = [
        { id: 'p1', tutorId: 'petrova', start: mkDate(2026, 3, 18, 18, 0),  durationMin: 60, price: 1900, payment: 'paid', format: 'online',  status: 'completed', rescheduleHistory: [] },
        { id: 'p2', tutorId: 'ivanov',  start: mkDate(2026, 3, 17, 16, 30), durationMin: 90, price: 0,    payment: 'package', format: 'online', status: 'completed', rescheduleHistory: [] },
        { id: 'p3', tutorId: 'smirnova',start: mkDate(2026, 3, 15, 11, 0),  durationMin: 60, price: 1600, payment: 'paid', format: 'offline', status: 'cancelled', rescheduleHistory: [] },
        { id: 'p4', tutorId: 'petrova', start: mkDate(2026, 3, 14, 19, 0),  durationMin: 60, price: 1900, payment: 'paid', format: 'online',  status: 'completed', rescheduleHistory: [{ from: '12.04 19:00', to: '14.04 19:00', reason: 'Болезнь' }] },
        { id: 'p5', tutorId: 'ivanov',  start: mkDate(2026, 3, 12, 17, 0),  durationMin: 60, price: 1700, payment: 'pending', format: 'online', status: 'missed',   rescheduleHistory: [] },
        { id: 'p6', tutorId: 'petrova', start: mkDate(2026, 3, 11, 18, 0),  durationMin: 60, price: 1900, payment: 'paid', format: 'online',  status: 'completed', rescheduleHistory: [] },
        { id: 'p7', tutorId: 'smirnova',start: mkDate(2026, 3,  8, 11, 0),  durationMin: 60, price: 1600, payment: 'paid', format: 'offline', status: 'completed', rescheduleHistory: [] },
    ];

    const ACTIVE_POLICY = {
        name: 'Стандарт',
        // Returns { percent, label }. hoursLeft может быть отрицательным
        calc(hoursLeft) {
            if (hoursLeft >= 24) return { percent: 0,   label: 'Бесплатная отмена' };
            if (hoursLeft >= 12) return { percent: 50,  label: 'Частичный штраф' };
            return { percent: 100, label: 'Полный штраф' };
        }
    };

    function mkDate(y, m, d, h, min) { return new Date(y, m, d, h, min); }

    // ── DOM ────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const el = {
        subtitle: $('#stPageSubtitle'),
        listUpcoming: $('#stListUpcoming'),
        listPast: $('#stListPast'),
        empty: $('#stEmpty'),
        emptySub: $('#stEmptySub'),
        toggle: $('.st-view-toggle'),
        fab: $('#stFab'),
        overlay: $('#sheetOverlay'),
        sheet: $('#detailSheet'),
        detailAccent: $('#detailAccent'),
        detailAvatar: $('#detailAvatar'),
        detailName: $('#detailName'),
        detailSubject: $('#detailSubject'),
        detailDate: $('#detailDate'),
        detailDuration: $('#detailDuration'),
        detailBadge: $('#detailBadge'),
        detailAmount: $('#detailAmount'),
        detailTgBtn: $('#detailTgBtn'),
        rescheduleHistorySection: $('#rescheduleHistorySection'),
        rescheduleHistoryToggle: $('#rescheduleHistoryToggle'),
        rescheduleHistoryBody: $('#rescheduleHistoryBody'),
        rhCount: $('#rhCount'),
        rhChevron: $('#rhChevron'),
        btnReschedule: $('#detailBtnReschedule'),
        btnCancel: $('#detailBtnCancel'),
        cancelForm: $('#cancelForm'),
        cancelFormClose: $('#cancelFormClose'),
        cancelReason: $('#cancelReason'),
        cancelCommentGroup: $('#cancelCommentGroup'),
        cancelConfirm: $('#cancelConfirm'),
        stPenalty: $('#stPenalty'),
        stPenaltyText: $('#stPenaltyText'),
        stPenaltyPolicy: $('#stPenaltyPolicy'),
        stPenaltyPercent: $('#stPenaltyPercent'),
        stPenaltyAmount: $('#stPenaltyAmount'),
        rescheduleForm: $('#rescheduleForm'),
        rescheduleFormClose: $('#rescheduleFormClose'),
        rescheduleReason: $('#rescheduleReason'),
        rescheduleCommentGroup: $('#rescheduleCommentGroup'),
        rescheduleConfirm: $('#rescheduleConfirm'),
        detailHandle: $('#detailHandle'),
        toast: $('#toast'),
        toastText: $('#toastText'),
    };

    let currentView = 'upcoming';
    let currentLesson = null;

    // ── Format helpers ─────────────────────
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
    function fmtMoney(n) {
        return new Intl.NumberFormat('ru-RU').format(n);
    }
    function dateGroupLabel(d) {
        const diff = daysDiff(d, TODAY);
        const dayName = DOW_SHORT[d.getDay()];
        const tail = d.getDate() + ' ' + MONTH_GEN[d.getMonth()];
        if (diff === 0)  return { label: 'СЕГОДНЯ', tail, today: true };
        if (diff === 1)  return { label: 'ЗАВТРА', tail, today: false };
        if (diff === -1) return { label: 'ВЧЕРА', tail, today: false };
        return { label: dayName, tail, today: false };
    }
    function fullDateLabel(d) {
        return DOW_LONG[d.getDay()] + ', ' + d.getDate() + ' ' + MONTH_GEN[d.getMonth()];
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

    // ── Render ─────────────────────────────
    function paymentBadgeHTML(lesson) {
        if (lesson.payment === 'paid')    return '<span class="st-badge paid">Оплачено</span>';
        if (lesson.payment === 'pending') return '<span class="st-badge pending">Ожидает</span>';
        if (lesson.payment === 'package') return '<span class="st-badge package">В пакете</span>';
        return '';
    }
    function statusBadgeHTML(lesson) {
        if (lesson.status === 'completed') return '<span class="st-badge completed">Проведено</span>';
        if (lesson.status === 'cancelled') return '<span class="st-badge cancelled-b">Отменено</span>';
        if (lesson.status === 'missed')    return '<span class="st-badge missed">Не посетили</span>';
        return '';
    }

    function renderCard(lesson, isPast) {
        const t = TUTORS[lesson.tutorId];
        const card = document.createElement('div');
        card.className = 'st-lesson-card variant-' + t.variant;
        if (isPast && lesson.status === 'cancelled') card.classList.add('cancelled');
        if (isPast && lesson.status === 'missed')    card.classList.add('missed');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', t.subject + ' с ' + t.name + ', ' + fmtHHMM(lesson.start));
        card.dataset.id = lesson.id;

        const rightHTML = isPast ? statusBadgeHTML(lesson) : paymentBadgeHTML(lesson);
        const missedNote = (isPast && lesson.status === 'missed')
            ? '<span class="st-card-missed-note">Не посетили</span>' : '';

        card.innerHTML = `
            <div class="st-card-time">
                <span class="st-card-time-hhmm">${fmtHHMM(lesson.start)}</span>
                <span class="st-card-time-duration">${fmtDuration(lesson.durationMin)}</span>
            </div>
            <div class="st-card-middle">
                <span class="st-card-subject">${t.subject}</span>
                <span class="st-card-tutor">
                    <span class="st-card-tutor-avatar avatar-variant variant-${t.variant}">${t.avatar}</span>
                    <span class="st-card-tutor-name">${t.name}</span>
                </span>
                ${missedNote}
            </div>
            <div class="st-card-right">${rightHTML}</div>
        `;
        card.addEventListener('click', () => openDetail(lesson, isPast));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(lesson, isPast); }
        });
        return card;
    }

    function renderList(listEl, lessons, isPast) {
        listEl.innerHTML = '';
        if (lessons.length === 0) {
            el.empty.style.display = 'flex';
            el.emptySub.textContent = isPast
                ? 'Здесь будут отображаться прошедшие занятия'
                : 'Запишитесь на первое занятие — и оно появится здесь';
            return;
        }
        el.empty.style.display = 'none';

        const groups = groupByDay(lessons);
        groups.forEach((g, gi) => {
            const groupEl = document.createElement('div');
            groupEl.className = 'st-date-group';
            const label = dateGroupLabel(g.date);
            const headerEl = document.createElement('div');
            headerEl.className = 'st-date-header' + (label.today ? ' today' : '');
            headerEl.innerHTML = `${label.label} <span class="st-date-sep">·</span> ${label.tail}`;
            groupEl.appendChild(headerEl);

            const cards = document.createElement('div');
            cards.className = 'st-lesson-cards';
            g.items.forEach((lesson, i) => {
                const card = renderCard(lesson, isPast);
                card.style.animationDelay = (gi * 60 + i * 30) + 'ms';
                cards.appendChild(card);
            });
            groupEl.appendChild(cards);
            listEl.appendChild(groupEl);
        });
    }

    function switchView(view) {
        currentView = view;
        el.toggle.querySelectorAll('button').forEach((btn) => {
            const active = btn.dataset.view === view;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        if (view === 'upcoming') {
            el.listUpcoming.style.display = '';
            el.listPast.style.display = 'none';
            el.fab.classList.remove('hidden');
            renderList(el.listUpcoming, LESSONS_UPCOMING, false);
        } else {
            el.listUpcoming.style.display = 'none';
            el.listPast.style.display = '';
            el.fab.classList.add('hidden');
            renderList(el.listPast, LESSONS_PAST, true);
        }
    }

    // ── Detail sheet ───────────────────────
    function openDetail(lesson, isPast) {
        currentLesson = { ...lesson, isPast };
        const t = TUTORS[lesson.tutorId];

        // Variant
        el.detailAccent.className = 'detail-sheet-accent variant-' + t.variant;
        el.detailAvatar.className = 'detail-student-avatar avatar-variant variant-' + t.variant;
        el.detailAvatar.textContent = t.avatar;
        el.detailName.textContent = t.name;
        el.detailSubject.textContent = t.subject;

        // Date/time
        el.detailDate.textContent = fullDateLabel(lesson.start);
        const endDate = new Date(lesson.start.getTime() + lesson.durationMin * 60000);
        el.detailDuration.textContent = `${fmtHHMM(lesson.start)} – ${fmtHHMM(endDate)} · ${fmtDuration(lesson.durationMin)}`;

        // Payment
        if (lesson.payment === 'paid') {
            el.detailBadge.className = 'detail-payment-badge paid';
            el.detailBadge.textContent = 'Оплачено';
            el.detailAmount.textContent = fmtMoney(lesson.price);
        } else if (lesson.payment === 'pending') {
            el.detailBadge.className = 'detail-payment-badge pending';
            el.detailBadge.textContent = 'Ожидает оплаты';
            el.detailAmount.textContent = fmtMoney(lesson.price);
        } else if (lesson.payment === 'package') {
            el.detailBadge.className = 'detail-payment-badge package';
            el.detailBadge.textContent = 'В пакете';
            el.detailAmount.textContent = '—';
        }

        // Reschedule history
        if (lesson.rescheduleHistory && lesson.rescheduleHistory.length > 0) {
            el.rescheduleHistorySection.style.display = '';
            el.rhCount.textContent = lesson.rescheduleHistory.length;
            el.rescheduleHistoryBody.innerHTML = lesson.rescheduleHistory.map((h) => `
                <div class="reschedule-history-item">
                    <svg class="reschedule-history-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                    </svg>
                    <div class="reschedule-history-text">
                        <strong>${h.from}</strong> → <strong>${h.to}</strong>
                        <span class="rh-reason">${h.reason || ''}</span>
                    </div>
                </div>
            `).join('');
            el.rescheduleHistoryBody.classList.remove('open');
            el.rescheduleHistoryBody.style.maxHeight = '0px';
            el.rhChevron.classList.remove('expanded');
        } else {
            el.rescheduleHistorySection.style.display = 'none';
        }

        // Hide actions for past
        const actionsRow = el.btnReschedule.parentElement;
        const cancelRow = el.btnCancel.parentElement;
        if (isPast) {
            actionsRow.style.display = 'none';
            cancelRow.style.display = 'none';
        } else {
            actionsRow.style.display = '';
            cancelRow.style.display = '';
        }

        // Reset forms
        closeAllForms();

        // Open
        el.overlay.classList.add('open');
        el.sheet.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
        el.overlay.classList.remove('open');
        el.sheet.classList.remove('open');
        document.body.style.overflow = '';
        closeAllForms();
    }

    function closeAllForms() {
        collapseForm(el.cancelForm);
        collapseForm(el.rescheduleForm);
        el.btnCancel.textContent = 'Отменить занятие';
    }

    function openForm(formEl) {
        formEl.classList.add('open');
        // measure
        formEl.style.maxHeight = formEl.scrollHeight + 'px';
    }
    function collapseForm(formEl) {
        formEl.classList.remove('open');
        formEl.style.maxHeight = '0px';
    }

    // ── Penalty calculation ────────────────
    function calcPenalty() {
        if (!currentLesson) return;
        const hoursLeft = (currentLesson.start - TODAY) / 3600000;
        const p = ACTIVE_POLICY.calc(hoursLeft);
        const priceForPenalty = currentLesson.payment === 'package' ? 0 : currentLesson.price;
        const amount = Math.round(priceForPenalty * p.percent / 100);

        el.stPenaltyPolicy.textContent = ACTIVE_POLICY.name;
        el.stPenaltyPercent.textContent = p.percent + '%';

        const hoursLabel = Math.abs(hoursLeft) < 1
            ? 'меньше часа'
            : `${Math.floor(hoursLeft)} ${pluralHours(Math.floor(hoursLeft))}`;

        if (p.percent === 0) {
            el.stPenalty.classList.add('success');
            el.stPenaltyIcon().innerHTML = `
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>`;
            el.stPenaltyText.innerHTML = `До занятия осталось <strong>${hoursLabel}</strong>. По политике «<strong>${ACTIVE_POLICY.name}</strong>» занятие отменится <strong>бесплатно</strong>.`;
        } else {
            el.stPenalty.classList.remove('success');
            el.stPenaltyIcon().innerHTML = `
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>`;
            const amountLine = currentLesson.payment === 'package'
                ? 'Занятие будет списано из пакета.'
                : `Сумма к удержанию: <strong>${fmtMoney(amount)} ₽</strong>.`;
            el.stPenaltyText.innerHTML = `До занятия осталось <strong>${hoursLabel}</strong>. По политике «<strong>${ACTIVE_POLICY.name}</strong>» штраф составит <strong>${p.percent}%</strong>. ${amountLine}`;
        }
    }
    el.stPenaltyIcon = () => document.getElementById('stPenaltyIcon');

    function pluralHours(n) {
        const mod10 = n % 10, mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'часов';
        if (mod10 === 1) return 'час';
        if (mod10 >= 2 && mod10 <= 4) return 'часа';
        return 'часов';
    }

    // ── Toast ──────────────────────────────
    function toast(text) {
        el.toastText.textContent = text;
        el.toast.classList.add('show');
        setTimeout(() => el.toast.classList.remove('show'), 2200);
    }

    // ── Event bindings ─────────────────────
    el.toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-view]');
        if (btn) switchView(btn.dataset.view);
    });

    el.overlay.addEventListener('click', closeDetail);
    el.detailHandle.addEventListener('click', closeDetail);

    // Reschedule history toggle
    el.rescheduleHistoryToggle.addEventListener('click', () => {
        const body = el.rescheduleHistoryBody;
        const open = body.classList.toggle('open');
        el.rhChevron.classList.toggle('expanded', open);
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });

    // Reschedule form
    el.btnReschedule.addEventListener('click', () => {
        collapseForm(el.cancelForm);
        el.btnCancel.textContent = 'Отменить занятие';
        openForm(el.rescheduleForm);
    });
    el.rescheduleFormClose.addEventListener('click', () => collapseForm(el.rescheduleForm));
    el.rescheduleReason.addEventListener('change', () => {
        el.rescheduleCommentGroup.style.display = el.rescheduleReason.value === 'other' ? '' : 'none';
        el.rescheduleForm.style.maxHeight = el.rescheduleForm.scrollHeight + 'px';
    });
    el.rescheduleConfirm.addEventListener('click', () => {
        closeDetail();
        toast('Запрос на перенос отправлен');
    });

    // Cancel form
    el.btnCancel.addEventListener('click', () => {
        if (el.cancelForm.classList.contains('open')) {
            collapseForm(el.cancelForm);
            el.btnCancel.textContent = 'Отменить занятие';
            return;
        }
        collapseForm(el.rescheduleForm);
        calcPenalty();
        openForm(el.cancelForm);
        el.btnCancel.textContent = 'Закрыть';
    });
    el.cancelFormClose.addEventListener('click', () => {
        collapseForm(el.cancelForm);
        el.btnCancel.textContent = 'Отменить занятие';
    });
    el.cancelReason.addEventListener('change', () => {
        el.cancelCommentGroup.style.display = el.cancelReason.value === 'other' ? '' : 'none';
        el.cancelForm.style.maxHeight = el.cancelForm.scrollHeight + 'px';
    });
    el.cancelConfirm.addEventListener('click', () => {
        closeDetail();
        toast('Занятие отменено');
    });

    // ── Init ───────────────────────────────
    function updateSubtitle() {
        el.subtitle.textContent = DOW_LONG[TODAY.getDay()].charAt(0).toUpperCase() + DOW_LONG[TODAY.getDay()].slice(1) + ', ' + TODAY.getDate() + ' ' + MONTH_GEN[TODAY.getMonth()];
    }
    updateSubtitle();
    switchView('upcoming');
})();
