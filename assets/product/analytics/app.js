/* ══════════════════════════════════════════
   ── analytics/app.js ──
   ══════════════════════════════════════════ */

// ── Mocks ──────────────────────────────────
const PERIODS = {
    7:   { label: '7 дней',    range: '14 — 20 апреля' },
    30:  { label: '30 дней',   range: '1 — 30 апреля' },
    90:  { label: '3 месяца',  range: 'Февраль — апрель' },
    365: { label: '12 месяцев', range: 'Май 2025 — апрель 2026' },
};

const SUMMARY = {
    7: {
        revenue:  { value: '₽ 42 800',  trend: '+9%',  dir: 'up' },
        lessons:  { value: '11',        trend: '+4%',  dir: 'up' },
        students: { value: '1',         trend: '—',    dir: 'flat' },
        avgCheck: { value: '₽ 1 900',   trend: '+1%',  dir: 'up' },
    },
    30: {
        revenue:  { value: '₽ 186 400', trend: '+14%', dir: 'up' },
        lessons:  { value: '47',        trend: '+8%',  dir: 'up' },
        students: { value: '3',         trend: '—',    dir: 'flat' },
        avgCheck: { value: '₽ 1 900',   trend: '+2%',  dir: 'up' },
    },
    90: {
        revenue:  { value: '₽ 512 000', trend: '+21%', dir: 'up' },
        lessons:  { value: '132',       trend: '+12%', dir: 'up' },
        students: { value: '8',         trend: '+3',   dir: 'up' },
        avgCheck: { value: '₽ 1 950',   trend: '+4%',  dir: 'up' },
    },
    365: {
        revenue:  { value: '₽ 1 980 000', trend: '+38%', dir: 'up' },
        lessons:  { value: '524',         trend: '+19%', dir: 'up' },
        students: { value: '24',          trend: '+11', dir: 'up' },
        avgCheck: { value: '₽ 1 860',     trend: '-2%', dir: 'down' },
    },
};

const REVENUE_SERIES = {
    7:   { points: [28, 34, 22, 41, 38, 46, 52], labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] },
    30:  { points: [52, 68, 45, 72, 60, 84, 78, 92, 74, 88], labels: ['1', '5', '10', '15', '20', '25', '30'] },
    90:  { points: [120, 145, 110, 180, 165, 210, 195, 240, 220, 270, 255, 290], labels: ['Фев', 'Мар', 'Апр'] },
    365: { points: [380, 420, 510, 460, 580, 620, 710, 680, 790, 860, 920, 980], labels: ['Май', 'Июл', 'Сен', 'Ноя', 'Янв', 'Апр'] },
};

const LESSONS_SERIES = {
    7:   { points: [2, 3, 1, 3, 2, 4, 5], labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] },
    30:  { points: [8, 12, 10, 14, 11, 16, 13, 18, 15, 19], labels: ['1', '5', '10', '15', '20', '25', '30'] },
    90:  { points: [28, 35, 30, 42, 38, 48, 45, 52, 50, 58, 55, 62], labels: ['Фев', 'Мар', 'Апр'] },
    365: { points: [78, 92, 110, 98, 125, 138, 152, 145, 168, 182, 195, 210], labels: ['Май', 'Июл', 'Сен', 'Ноя', 'Янв', 'Апр'] },
};

const STUDENTS_BREAKDOWN = [
    { name: 'Алина Соколова',   initials: 'АС', variant: 'variant-orange', value: 62,  display: '₽ 62 000' },
    { name: 'Марк Павлов',      initials: 'МП', variant: 'variant-indigo', value: 48,  display: '₽ 48 000' },
    { name: 'Даша Романова',    initials: 'ДР', variant: 'variant-green',  value: 34,  display: '₽ 34 000' },
    { name: 'Илья Ветров',      initials: 'ИВ', variant: 'variant-orange', value: 22,  display: '₽ 22 400' },
    { name: 'Катя Миронова',    initials: 'КМ', variant: 'variant-indigo', value: 12,  display: '₽ 12 000' },
    { name: 'Тимур Гаврилов',   initials: 'ТГ', variant: 'variant-green',  value: 8,   display: '₽ 8 000' },
];

const TYPES_BREAKDOWN = [
    { name: 'Математика', initials: 'М', variant: 'variant-indigo', value: 98,  display: '₽ 98 000' },
    { name: 'Физика',     initials: 'Ф', variant: 'variant-orange', value: 62,  display: '₽ 62 000' },
    { name: 'Химия',      initials: 'Х', variant: 'variant-green',  value: 26,  display: '₽ 26 400' },
];

const STATUS_BREAKDOWN = [
    { name: 'Оплачено',   initials: '✓', variant: 'variant-green',  value: 142, display: '₽ 142 400' },
    { name: 'Ожидает',    initials: '⏳', variant: 'variant-orange', value: 34,  display: '₽ 34 000' },
    { name: 'Просрочено', initials: '!', variant: 'variant-indigo', value: 10,  display: '₽ 10 000' },
];

const DEBTORS = [
    { name: 'Илья Ветров',   initials: 'ИВ', variant: 'variant-orange', meta: '2 занятия · 3 800 ₽' },
    { name: 'Катя Миронова', initials: 'КМ', variant: 'variant-indigo', meta: '1 занятие · 1 900 ₽' },
    { name: 'Тимур Гаврилов', initials: 'ТГ', variant: 'variant-green',  meta: '1 занятие · 2 100 ₽' },
];

// ── State ──────────────────────────────────
let currentPeriod = 30;
let currentSeries = 'revenue';
let currentBreakdown = 'students';

// ── Helpers ────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function trendSymbol(dir) {
    if (dir === 'up') return '↑';
    if (dir === 'down') return '↓';
    return '';
}

// ── Render: summary cards ──────────────────
function renderSummary() {
    const data = SUMMARY[currentPeriod];
    $$('.summary-card').forEach(card => {
        const key = card.dataset.key;
        const entry = data[key];
        if (!entry) return;
        card.querySelector('[data-role="value"]').textContent = entry.value;
        const trendEl = card.querySelector('[data-role="trend"]');
        trendEl.className = 'summary-trend ' + entry.dir;
        const sym = trendSymbol(entry.dir);
        trendEl.textContent = sym ? `${sym} ${entry.trend}` : entry.trend;
    });
}

// ── Render: period range label ─────────────
function renderPeriodRange() {
    $('#periodRange').textContent = PERIODS[currentPeriod].range;
}

// ── Render: chart ──────────────────────────
function renderChart() {
    const series = currentSeries === 'revenue' ? REVENUE_SERIES : LESSONS_SERIES;
    const data = series[currentPeriod];
    const points = data.points;
    const labels = data.labels;

    const W = 320;
    const H = 140;
    const padX = 6;
    const padTop = 10;
    const padBottom = 10;
    const innerW = W - padX * 2;
    const innerH = H - padTop - padBottom;

    const maxVal = Math.max(...points);
    const minVal = Math.min(...points);
    const range = Math.max(1, maxVal - minVal);

    const coords = points.map((v, i) => {
        const x = padX + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
        const y = padTop + innerH - ((v - minVal) / range) * innerH;
        return { x, y };
    });

    // Line path
    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');

    // Area path
    const areaPath = linePath +
        ` L${coords[coords.length - 1].x.toFixed(2)},${(padTop + innerH).toFixed(2)}` +
        ` L${coords[0].x.toFixed(2)},${(padTop + innerH).toFixed(2)} Z`;

    $('#chartLine').setAttribute('d', linePath);
    $('#chartArea').setAttribute('d', areaPath);

    // Grid: 3 horizontal lines
    const grid = $('#chartGrid');
    grid.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const y = padTop + (innerH / 2) * i;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', padX);
        line.setAttribute('x2', W - padX);
        line.setAttribute('y1', y);
        line.setAttribute('y2', y);
        grid.appendChild(line);
    }

    // Dots
    const dots = $('#chartDots');
    dots.innerHTML = '';
    coords.forEach(c => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', c.x.toFixed(2));
        circle.setAttribute('cy', c.y.toFixed(2));
        circle.setAttribute('r', '3');
        dots.appendChild(circle);
    });

    // X-axis labels (up to 6)
    const axis = $('#chartXAxis');
    axis.innerHTML = '';
    const slice = labels.length > 6 ? labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0).slice(0, 6) : labels;
    slice.forEach(l => {
        const span = document.createElement('span');
        span.textContent = l;
        axis.appendChild(span);
    });
}

// ── Render: breakdown ──────────────────────
function renderBreakdown() {
    let data;
    if (currentBreakdown === 'students') data = STUDENTS_BREAKDOWN;
    else if (currentBreakdown === 'types') data = TYPES_BREAKDOWN;
    else data = STATUS_BREAKDOWN;

    const leader = Math.max(...data.map(d => d.value));
    const list = $('#breakdownList');
    list.innerHTML = '';

    data.forEach((item, idx) => {
        const pct = Math.round((item.value / leader) * 100);
        const li = document.createElement('li');
        li.className = 'breakdown-row';
        li.style.animationDelay = `${idx * 0.03}s`;
        li.innerHTML = `
            <div class="avatar-variant breakdown-avatar ${item.variant}">${item.initials}</div>
            <div class="breakdown-name">${item.name}</div>
            <div class="breakdown-right">
                <div class="bar-mini"><div class="bar-mini-fill" style="width:${pct}%"></div></div>
                <div class="breakdown-value">${item.display}</div>
            </div>
        `;
        list.appendChild(li);
    });
}

// ── Render: debtors ────────────────────────
function renderDebtors() {
    const list = $('#debtorsList');
    const empty = $('#debtorsEmpty');
    const label = $('#debtorsLabel');

    label.textContent = `Должники (${DEBTORS.length})`;
    list.innerHTML = '';

    if (DEBTORS.length === 0) {
        list.classList.add('hidden');
        empty.classList.remove('hidden');
        label.textContent = 'Должники';
        return;
    }

    list.classList.remove('hidden');
    empty.classList.add('hidden');

    DEBTORS.forEach((d, idx) => {
        const li = document.createElement('li');
        li.style.animationDelay = `${idx * 0.04}s`;
        li.innerHTML = `
            <div class="debtor-card">
                <div class="avatar-variant debtor-avatar ${d.variant}">${d.initials}</div>
                <div class="debtor-info">
                    <div class="debtor-name">${d.name}</div>
                    <div class="debtor-meta">${d.meta}</div>
                </div>
                <button class="btn-remind" type="button">Напомнить</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ── Events ─────────────────────────────────
function bindEvents() {
    // Period switcher
    $$('.period-switcher .picker-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.period-switcher .picker-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPeriod = parseInt(btn.dataset.period, 10);
            renderPeriodRange();
            renderSummary();
            renderChart();
        });
    });

    // Chart toggle
    $$('.chart-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSeries = btn.dataset.series;
            renderChart();
        });
    });

    // Breakdown toggle
    $$('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.view-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBreakdown = btn.dataset.breakdown;
            renderBreakdown();
        });
    });

    // Remind buttons (delegated)
    $('#debtorsList').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-remind');
        if (!btn) return;
        btn.textContent = 'Отправлено';
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
}

// ── Init ───────────────────────────────────
function init() {
    renderPeriodRange();
    renderSummary();
    renderChart();
    renderBreakdown();
    renderDebtors();
    bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
