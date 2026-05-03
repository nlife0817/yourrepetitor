/* ══════════════════════════════════════════
   ── student/booking.js — Записаться на занятие ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Mocks ──────────────────────────────
    const TUTOR = {
        name: 'Елена Петрова',
        variant: 'indigo',
        avatar: 'Е',
        subjects: 'Математика, физика',
    };

    // Today = 2026-04-20 (Понедельник)
    const TODAY = new Date(2026, 3, 20);

    const WEEKDAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const WEEKDAYS_FULL = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    function dayKey(d) {
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
    function addDays(d, n) {
        const r = new Date(d);
        r.setDate(r.getDate() + n);
        return r;
    }

    // AVAILABILITY: массив на 14 дней вперёд
    // Смоделируем: сегодня 0, завтра 2, +2 3, +3 4, +4 0 (выходной), +5 3, +6 2, +7 4, +8 3, +9 0, +10 2, +11 3, +12 4, +13 1
    const AVAILABILITY_COUNTS = [0, 2, 3, 4, 0, 3, 2, 4, 3, 0, 2, 3, 4, 1];

    const AVAILABILITY = AVAILABILITY_COUNTS.map((count, i) => {
        const d = addDays(TODAY, i);
        return { date: d, key: dayKey(d), count };
    });

    // SLOTS_BY_DAY: для дней где count > 0
    const SLOT_POOLS = {
        2: ['10:00', '16:00'],
        3: ['11:00', '15:00', '17:30'],
        4: ['09:00', '11:30', '14:00', '18:00'],
        1: ['16:00'],
    };

    const SLOTS_BY_DAY = {};
    AVAILABILITY.forEach(d => {
        if (d.count > 0) {
            SLOTS_BY_DAY[d.key] = SLOT_POOLS[d.count] || [];
        }
    });

    // TEMPLATES
    const TEMPLATES = [
        { id: 't1', name: 'Короткое занятие',  variant: 'indigo', duration: 45,  price: 1400 },
        { id: 't2', name: 'Стандартное',       variant: 'orange', duration: 60,  price: 1900 },
        { id: 't3', name: 'Интенсив',          variant: 'green',  duration: 90,  price: 2700 },
    ];

    // ── State ──────────────────────────────
    const state = {
        dayKey: null,
        slotTime: null,
        templateId: null,
    };

    // ── Elements ──────────────────────────
    const el = {
        stepScreen: document.getElementById('bkStepScreen'),
        pendingScreen: document.getElementById('bkPendingScreen'),

        days: document.getElementById('bkDays'),
        stepTime: document.getElementById('bkStepTime'),
        dateCaption: document.getElementById('bkDateCaption'),
        slots: document.getElementById('bkSlots'),
        stepTemplate: document.getElementById('bkStepTemplate'),
        templates: document.getElementById('bkTemplates'),
        summary: document.getElementById('bkSummary'),
        sumDay: document.getElementById('bkSumDay'),
        sumTime: document.getElementById('bkSumTime'),
        sumDuration: document.getElementById('bkSumDuration'),
        sumAmount: document.getElementById('bkSumAmount'),

        submit: document.getElementById('bkSubmit'),

        pendTutor: document.getElementById('bkPendTutor'),
        pendDay: document.getElementById('bkPendDay'),
        pendTime: document.getElementById('bkPendTime'),
        pendDuration: document.getElementById('bkPendDuration'),
        pendAmount: document.getElementById('bkPendAmount'),
        bookMore: document.getElementById('bkBookMore'),

        toast: document.getElementById('bkToast'),
        toastText: document.getElementById('bkToastText'),
    };

    // ── Formatters ─────────────────────────
    function formatPrice(n) {
        return n.toLocaleString('ru-RU').replace(/,/g, ' ');
    }
    function formatDuration(min) {
        if (min < 60) return `${min} мин`;
        const h = Math.floor(min / 60);
        const m = min % 60;
        return m === 0 ? `${h} ч` : `${h} ч ${m} мин`;
    }
    function formatDayLong(d) {
        return `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
    }
    function formatDayShort(d) {
        return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
    }
    function pluralSlots(n) {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'слотов';
        if (mod10 === 1) return 'слот';
        if (mod10 >= 2 && mod10 <= 4) return 'слота';
        return 'слотов';
    }

    function addMinutes(time, min) {
        const [h, m] = time.split(':').map(Number);
        const total = h * 60 + m + min;
        const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
        const mm = String(total % 60).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    // ── Render: days ───────────────────────
    function renderDays() {
        el.days.innerHTML = '';
        AVAILABILITY.forEach((d, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'bk-day';
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', 'false');
            btn.dataset.key = d.key;

            if (d.count === 0) {
                btn.classList.add('disabled');
                btn.setAttribute('aria-disabled', 'true');
                btn.tabIndex = -1;
            }
            if (i === 0) btn.classList.add('today');

            const label = document.createElement('span');
            label.className = 'bk-day-label';
            label.textContent = i === 0 ? 'СЕГ' : WEEKDAYS[d.date.getDay()];

            const num = document.createElement('span');
            num.className = 'bk-day-number';
            num.textContent = d.date.getDate();

            const count = document.createElement('span');
            count.className = 'bk-day-count';
            count.textContent = d.count === 0 ? 'нет' : `${d.count} ${pluralSlots(d.count)}`;

            btn.appendChild(label);
            btn.appendChild(num);
            btn.appendChild(count);

            btn.addEventListener('click', () => {
                if (d.count === 0) return;
                selectDay(d.key);
            });

            el.days.appendChild(btn);
        });
    }

    function selectDay(key) {
        if (state.dayKey === key) return;
        state.dayKey = key;
        state.slotTime = null;

        // Update UI
        el.days.querySelectorAll('.bk-day').forEach(b => {
            const isActive = b.dataset.key === key;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });

        // Show time step
        const day = AVAILABILITY.find(a => a.key === key);
        el.dateCaption.textContent = formatDayLong(day.date);
        el.stepTime.hidden = false;
        renderSlots(key);

        // Hide later steps
        el.stepTemplate.hidden = true;
        el.summary.hidden = true;
        updateSubmit();
        updateSummary();
    }

    // ── Render: slots ──────────────────────
    function renderSlots(key) {
        el.slots.innerHTML = '';
        const times = SLOTS_BY_DAY[key] || [];
        times.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'bk-slot';
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', 'false');
            btn.dataset.time = t;
            btn.textContent = t;
            btn.addEventListener('click', () => selectSlot(t));
            el.slots.appendChild(btn);
        });
    }

    function selectSlot(time) {
        state.slotTime = time;
        el.slots.querySelectorAll('.bk-slot').forEach(b => {
            const isActive = b.dataset.time === time;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });

        el.stepTemplate.hidden = false;
        if (!state.templateId) {
            // По умолчанию ничего не выбрано — ждём выбора шаблона
        }
        updateSubmit();
        updateSummary();
    }

    // ── Render: templates ──────────────────
    function renderTemplates() {
        el.templates.innerHTML = '';
        TEMPLATES.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `bk-template variant-${t.variant}`;
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', 'false');
            btn.dataset.id = t.id;
            btn.innerHTML = `
                <span class="bk-template-radio" aria-hidden="true"></span>
                <div class="bk-template-body">
                    <div class="bk-template-head">
                        <span class="bk-template-name">${t.name}</span>
                        <span class="bk-template-badge">${t.duration} мин</span>
                    </div>
                    <div class="bk-template-meta">
                        ${formatDuration(t.duration)}<span class="bk-meta-sep">·</span>${formatPrice(t.price)} ₽
                    </div>
                </div>
            `;
            btn.addEventListener('click', () => selectTemplate(t.id));
            el.templates.appendChild(btn);
        });
    }

    function selectTemplate(id) {
        state.templateId = id;
        el.templates.querySelectorAll('.bk-template').forEach(b => {
            const isActive = b.dataset.id === id;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });
        updateSubmit();
        updateSummary();
    }

    // ── Summary ────────────────────────────
    function getTemplate() {
        return TEMPLATES.find(t => t.id === state.templateId);
    }
    function getDay() {
        return AVAILABILITY.find(a => a.key === state.dayKey);
    }

    function updateSummary() {
        const day = getDay();
        const tpl = getTemplate();

        if (!day || !state.slotTime || !tpl) {
            el.summary.hidden = true;
            return;
        }
        el.summary.hidden = false;

        const endTime = addMinutes(state.slotTime, tpl.duration);

        el.sumDay.textContent = formatDayShort(day.date);
        el.sumTime.textContent = `${state.slotTime} – ${endTime}`;
        el.sumDuration.textContent = formatDuration(tpl.duration);
        el.sumAmount.textContent = `${formatPrice(tpl.price)} ₽`;
    }

    function updateSubmit() {
        const ok = state.dayKey && state.slotTime && state.templateId;
        el.submit.disabled = !ok;
    }

    // ── Submit / pending ───────────────────
    function fillPending() {
        const day = getDay();
        const tpl = getTemplate();
        if (!day || !tpl) return;
        const endTime = addMinutes(state.slotTime, tpl.duration);

        el.pendTutor.textContent = TUTOR.name;
        el.pendDay.textContent = formatDayShort(day.date);
        el.pendTime.textContent = `${state.slotTime} – ${endTime}`;
        el.pendDuration.textContent = formatDuration(tpl.duration);
        el.pendAmount.textContent = `${formatPrice(tpl.price)} ₽`;
    }

    function showPending() {
        fillPending();
        el.stepScreen.hidden = true;
        el.pendingScreen.hidden = false;
        showToast('Заявка отправлена');
    }

    function resetFlow() {
        state.dayKey = null;
        state.slotTime = null;
        state.templateId = null;

        el.days.querySelectorAll('.bk-day.active').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
        });
        el.stepTime.hidden = true;
        el.stepTemplate.hidden = true;
        el.summary.hidden = true;
        el.slots.innerHTML = '';
        el.templates.querySelectorAll('.bk-template.active').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
        });
        updateSubmit();

        el.pendingScreen.hidden = true;
        el.stepScreen.hidden = false;
    }

    // ── Toast ──────────────────────────────
    let toastTimer = null;
    function showToast(text) {
        if (toastTimer) clearTimeout(toastTimer);
        el.toastText.textContent = text;
        el.toast.classList.add('show');
        toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2800);
    }

    // ── Init ───────────────────────────────
    function init() {
        renderDays();
        renderTemplates();

        el.submit.addEventListener('click', () => {
            if (el.submit.disabled) return;
            showPending();
        });

        el.bookMore.addEventListener('click', resetFlow);
    }

    init();
})();
