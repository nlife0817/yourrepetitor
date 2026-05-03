/* ══════════════════════════════════════════
   ── Онбординг репетитора — моки + логика ──
   ══════════════════════════════════════════ */

// ═══ Моки ═══
const SUBJECTS = [
    'Математика', 'Физика', 'Химия', 'Русский', 'Литература',
    'Английский', 'История', 'Обществознание', 'Информатика',
    'Биология', 'География'
];

const DURATIONS = [
    { value: 30, label: '30м' },
    { value: 45, label: '45м' },
    { value: 60, label: '1ч' },
    { value: 90, label: '1.5ч' },
    { value: 120, label: '2ч' }
];

const TEMPLATE_COLORS = [
    { value: 'indigo', label: 'Индиго' },
    { value: 'orange', label: 'Оранж' },
    { value: 'green',  label: 'Зелёный' }
];

const WEEKDAYS = [
    { key: 'mon', short: 'Пн', full: 'Понедельник' },
    { key: 'tue', short: 'Вт', full: 'Вторник' },
    { key: 'wed', short: 'Ср', full: 'Среда' },
    { key: 'thu', short: 'Чт', full: 'Четверг' },
    { key: 'fri', short: 'Пт', full: 'Пятница' },
    { key: 'sat', short: 'Сб', full: 'Суббота' },
    { key: 'sun', short: 'Вс', full: 'Воскресенье' }
];

const TIMEZONES = [
    { value: 'Europe/Kaliningrad', label: 'Калининград, UTC+2' },
    { value: 'Europe/Moscow',      label: 'Москва, UTC+3' },
    { value: 'Europe/Samara',      label: 'Самара, UTC+4' },
    { value: 'Asia/Yekaterinburg', label: 'Екатеринбург, UTC+5' },
    { value: 'Asia/Omsk',          label: 'Омск, UTC+6' },
    { value: 'Asia/Krasnoyarsk',   label: 'Красноярск, UTC+7' },
    { value: 'Asia/Irkutsk',       label: 'Иркутск, UTC+8' },
    { value: 'Asia/Yakutsk',       label: 'Якутск, UTC+9' },
    { value: 'Asia/Vladivostok',   label: 'Владивосток, UTC+10' },
    { value: 'Asia/Magadan',       label: 'Магадан, UTC+11' },
    { value: 'Asia/Kamchatka',     label: 'Камчатка, UTC+12' }
];

const INVITE_LINK = 'https://t.me/tutorflow_bot?start=invite_8f2a91c';

// ═══ State ═══
const state = {
    step: 1,
    subjects: new Set(),              // active subject names
    customSubjects: [],               // added custom
    about: '',
    timezone: 'Europe/Moscow',
    tpl: {
        name: '',
        duration: 60,
        price: '',
        format: 'online',
        color: 'indigo'
    },
    availability: {
        mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []
    },
    editing: null // { dayKey }
};

// ═══ DOM helpers ═══
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ═══ Шаг 1: subjects ═══
function renderSubjects() {
    const cloud = $('#subjectsCloud');
    const all = [...SUBJECTS, ...state.customSubjects];
    cloud.innerHTML = '';
    all.forEach((name) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'subject-chip' + (state.subjects.has(name) ? ' active' : '');
        btn.textContent = name;
        btn.addEventListener('click', () => {
            if (state.subjects.has(name)) state.subjects.delete(name);
            else state.subjects.add(name);
            renderSubjects();
            updateNextButton();
        });
        cloud.appendChild(btn);
    });

    // +Другое
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'subject-chip subject-chip--add';
    addBtn.innerHTML = '+ Другое';
    addBtn.addEventListener('click', () => openCustomSubjectInput(cloud, addBtn));
    cloud.appendChild(addBtn);
}

function openCustomSubjectInput(cloud, addBtn) {
    const wrap = document.createElement('span');
    wrap.className = 'subject-chip subject-chip--input';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Например, черчение';
    inp.maxLength = 40;
    wrap.appendChild(inp);
    cloud.replaceChild(wrap, addBtn);
    inp.focus();

    const commit = () => {
        const v = inp.value.trim();
        if (v && !SUBJECTS.includes(v) && !state.customSubjects.includes(v)) {
            state.customSubjects.push(v);
            state.subjects.add(v);
        }
        renderSubjects();
        updateNextButton();
    };
    inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { renderSubjects(); }
    });
    inp.addEventListener('blur', commit);
}

// ═══ Шаг 1: about textarea ═══
function setupAbout() {
    const ta = $('#aboutMe');
    const counter = $('#aboutCounter');
    const update = () => {
        const len = ta.value.length;
        counter.textContent = `${len} / 280`;
        counter.classList.toggle('over', len > 280);
        state.about = ta.value;
    };
    ta.addEventListener('input', update);
    update();
}

// ═══ Шаг 1: timezone ═══
function setupTimezone() {
    const sel = $('#timezoneSelect');
    sel.innerHTML = '';
    TIMEZONES.forEach(tz => {
        const opt = document.createElement('option');
        opt.value = tz.value;
        opt.textContent = tz.label;
        if (tz.value === state.timezone) opt.selected = true;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
        state.timezone = sel.value;
        const label = TIMEZONES.find(t => t.value === state.timezone)?.label || '';
        $('#tzReadoutText').textContent = label;
    });
    const label = TIMEZONES.find(t => t.value === state.timezone)?.label || '';
    $('#tzReadoutText').textContent = label;
}

// ═══ Шаг 2: template ═══
function setupTemplate() {
    // name
    $('#tplName').addEventListener('input', (e) => { state.tpl.name = e.target.value; });

    // duration chips
    const durRow = $('#durationRow');
    durRow.addEventListener('click', (e) => {
        const btn = e.target.closest('.picker-chip');
        if (!btn) return;
        $$('#durationRow .picker-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        state.tpl.duration = Number(btn.dataset.value);
        $('#durationCustom').value = '';
    });
    $('#durationCustom').addEventListener('input', (e) => {
        const v = e.target.value.replace(/\D/g, '').slice(0, 3);
        e.target.value = v;
        if (v) {
            $$('#durationRow .picker-chip').forEach(c => c.classList.remove('active'));
            state.tpl.duration = Number(v);
        }
    });

    // price: digits + formatted
    const priceInp = $('#tplPrice');
    priceInp.addEventListener('input', (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 7);
        state.tpl.price = digits;
        e.target.value = digits ? Number(digits).toLocaleString('ru-RU') : '';
    });

    // format
    const fmtWrap = $('#formatPills');
    fmtWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.format-pill');
        if (!btn) return;
        $$('#formatPills .format-pill').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        state.tpl.format = btn.dataset.value;
    });

    // color
    const colorWrap = $('#colorPills');
    colorWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.color-pill');
        if (!btn) return;
        $$('#colorPills .color-pill').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        state.tpl.color = btn.dataset.value;
    });
}

// ═══ Шаг 3: availability ═══
function renderAvailability() {
    const list = $('#availabilityList');
    list.innerHTML = '';

    WEEKDAYS.forEach(day => {
        const intervals = state.availability[day.key];
        const hasIntervals = intervals.length > 0;

        const card = document.createElement('div');
        card.className = 'availability-day' + (hasIntervals ? ' has-intervals' : '');
        card.dataset.day = day.key;

        // основная строка
        const row = document.createElement('div');
        row.className = 'availability-day__row';

        const chip = document.createElement('div');
        chip.className = 'availability-day__chip';
        chip.textContent = day.short;
        row.appendChild(chip);

        const body = document.createElement('div');
        body.className = 'availability-day__body';

        if (!hasIntervals) {
            const empty = document.createElement('span');
            empty.className = 'availability-day__empty';
            empty.textContent = 'Выходной';
            body.appendChild(empty);

            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'availability-day__add-text';
            addBtn.textContent = '+ Добавить интервал';
            addBtn.addEventListener('click', () => toggleEditor(day.key, true));
            body.appendChild(addBtn);
        } else {
            const intervalsWrap = document.createElement('div');
            intervalsWrap.className = 'availability-day__intervals';
            intervals.forEach((iv, idx) => {
                const pill = document.createElement('span');
                pill.className = 'interval-pill';
                pill.innerHTML = `${iv.start} — ${iv.end}`;
                const rm = document.createElement('button');
                rm.type = 'button';
                rm.className = 'interval-pill__remove';
                rm.setAttribute('aria-label', 'Удалить интервал');
                rm.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`;
                rm.addEventListener('click', () => {
                    state.availability[day.key].splice(idx, 1);
                    renderAvailability();
                });
                pill.appendChild(rm);
                intervalsWrap.appendChild(pill);
            });
            const plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'availability-day__add-plus';
            plus.setAttribute('aria-label', 'Добавить интервал');
            plus.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
            plus.addEventListener('click', () => toggleEditor(day.key, true));
            intervalsWrap.appendChild(plus);
            body.appendChild(intervalsWrap);
        }

        row.appendChild(body);
        card.appendChild(row);

        // Редактор (collapsible)
        const editor = document.createElement('div');
        editor.className = 'availability-day__editor';
        editor.dataset.editor = day.key;
        editor.innerHTML = `
            <div class="availability-day__editor-inner">
                <div class="time-row">
                    <input type="time" class="time-input input-base" data-role="start" value="09:00">
                    <span class="time-dash">—</span>
                    <input type="time" class="time-input input-base" data-role="end" value="13:00">
                    <div class="time-row__actions">
                        <button type="button" class="btn-ghost" data-role="cancel">Отмена</button>
                        <button type="button" class="btn-accent-sm" data-role="add">Добавить</button>
                    </div>
                </div>
                <div class="time-error" data-role="error"></div>
            </div>
        `;
        card.appendChild(editor);

        // обработчики редактора
        editor.querySelector('[data-role="cancel"]').addEventListener('click', () => toggleEditor(day.key, false));
        editor.querySelector('[data-role="add"]').addEventListener('click', () => handleAddInterval(day.key, editor));

        list.appendChild(card);
    });

    // если есть открытый редактор — восстановить
    if (state.editing) {
        const ed = list.querySelector(`[data-editor="${state.editing}"]`);
        if (ed) ed.classList.add('open');
    }
}

function toggleEditor(dayKey, open) {
    const list = $('#availabilityList');
    // закрыть все
    $$('.availability-day__editor', list).forEach(ed => ed.classList.remove('open'));
    state.editing = open ? dayKey : null;
    if (open) {
        const ed = list.querySelector(`[data-editor="${dayKey}"]`);
        if (ed) {
            ed.classList.add('open');
            const errEl = ed.querySelector('[data-role="error"]');
            if (errEl) errEl.textContent = '';
        }
    }
}

function handleAddInterval(dayKey, editor) {
    const start = editor.querySelector('[data-role="start"]').value;
    const end   = editor.querySelector('[data-role="end"]').value;
    const errEl = editor.querySelector('[data-role="error"]');

    if (!start || !end) {
        errEl.textContent = 'Укажите время начала и окончания';
        return;
    }
    if (start >= end) {
        errEl.textContent = 'Начало должно быть раньше окончания';
        return;
    }
    const overlaps = state.availability[dayKey].some(iv =>
        !(end <= iv.start || start >= iv.end)
    );
    if (overlaps) {
        errEl.textContent = 'Интервал пересекается с существующим';
        return;
    }

    state.availability[dayKey].push({ start, end });
    state.availability[dayKey].sort((a, b) => a.start.localeCompare(b.start));
    state.editing = null;
    renderAvailability();
}

// ═══ Шаг 4: invite ═══
function setupInvite() {
    $('#inviteInput').value = INVITE_LINK;
    $('#inviteCopyBtn').addEventListener('click', copyInvite);
}

async function copyInvite() {
    const btn = $('#inviteCopyBtn');
    const iconEl = $('#inviteCopyIcon');
    const originalSvg = iconEl.outerHTML;
    try {
        await navigator.clipboard.writeText(INVITE_LINK);
    } catch (_) {
        // fallback — selection
        const inp = $('#inviteInput');
        inp.select();
        try { document.execCommand('copy'); } catch (_) {}
    }
    // визуальный feedback
    btn.classList.add('copied');
    iconEl.outerHTML = `<svg id="inviteCopyIcon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    showToast('Ссылка скопирована');
    setTimeout(() => {
        btn.classList.remove('copied');
        const cur = $('#inviteCopyIcon');
        if (cur) cur.outerHTML = originalSvg;
    }, 2000);
}

// ═══ Toast ═══
let toastTimer = null;
function showToast(text) {
    const t = $('#toast');
    $('#toastText').textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ═══ Навигация между шагами ═══
function goToStep(target) {
    if (target < 1 || target > 4) return;
    const from = state.step;
    if (from === target) return;

    const cur = document.querySelector(`.onb-step[data-step="${from}"]`);
    const next = document.querySelector(`.onb-step[data-step="${target}"]`);
    if (!cur || !next) return;

    const forward = target > from;

    // exit current
    cur.classList.remove('active');
    cur.style.opacity = '0';
    cur.style.transform = forward ? 'translateX(-20px)' : 'translateX(20px)';

    // prepare next
    next.style.transition = 'none';
    next.style.opacity = '0';
    next.style.transform = forward ? 'translateX(20px)' : 'translateX(-20px)';
    next.style.visibility = 'visible';
    // force reflow, then animate
    void next.offsetWidth;
    next.style.transition = '';
    next.classList.add('active');
    next.style.opacity = '';
    next.style.transform = '';

    // после перехода — скрыть предыдущий
    setTimeout(() => {
        cur.style.opacity = '';
        cur.style.transform = '';
        cur.style.visibility = '';
    }, 360);

    state.step = target;
    updateHeader();
    updateFooter();
    updateNextButton();
}

function updateHeader() {
    $('#onbStepCounter').textContent = `Шаг ${state.step} из 4`;
    $$('.onb-progress__segment').forEach(seg => {
        const idx = Number(seg.dataset.idx);
        seg.classList.remove('onb-progress__segment--active', 'onb-progress__segment--done');
        if (idx < state.step - 1) seg.classList.add('onb-progress__segment--done');
        else if (idx === state.step - 1) seg.classList.add('onb-progress__segment--active');
    });
}

function updateFooter() {
    const back = $('#onbBackBtn');
    const next = $('#onbNextBtn');
    const finish = $('#onbFinishLink');
    const nextLabel = $('#onbNextLabel');

    // back visible only for steps 2..4
    back.classList.toggle('hidden', state.step === 1);

    if (state.step === 4) {
        nextLabel.textContent = 'Поделиться ссылкой';
        next.innerHTML = `<span id="onbNextLabel">Поделиться ссылкой</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>`;
        finish.classList.remove('hidden');
        back.classList.add('hidden'); // на шаге 4 назад скрыта для чистоты
    } else {
        next.innerHTML = `<span id="onbNextLabel">Далее</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>`;
        finish.classList.add('hidden');
    }
}

function isStepValid(step) {
    switch (step) {
        case 1: return state.subjects.size > 0 && state.about.length <= 280;
        case 2: return true; // все значения имеют дефолты
        case 3: return true; // можно без интервалов (все выходные — валидно)
        case 4: return true;
        default: return false;
    }
}

function updateNextButton() {
    const btn = $('#onbNextBtn');
    if (state.step === 4) {
        btn.disabled = false;
        return;
    }
    btn.disabled = !isStepValid(state.step);
}

function handleNext() {
    if (state.step === 4) {
        // share action: просто скопировать ссылку + тост
        copyInvite();
        return;
    }
    if (!isStepValid(state.step)) return;
    goToStep(state.step + 1);
}

function handleBack() {
    if (state.step > 1) goToStep(state.step - 1);
}

// ═══ Init ═══
function init() {
    renderSubjects();
    setupAbout();
    setupTimezone();
    setupTemplate();
    renderAvailability();
    setupInvite();

    $('#onbNextBtn').addEventListener('click', handleNext);
    $('#onbBackBtn').addEventListener('click', handleBack);

    updateHeader();
    updateFooter();
    updateNextButton();
}

document.addEventListener('DOMContentLoaded', init);
