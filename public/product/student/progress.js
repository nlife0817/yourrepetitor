/* ══════════════════════════════════════════
   ── student/progress.js ──
   ══════════════════════════════════════════ */

// ── Mocks ──────────────────────────────────
const SUMMARY = [
    { key: 'completed', label: 'Проведено', value: '47', trend: '+8 за 30д', dir: 'up' },
    { key: 'cancelled', label: 'Отменено',  value: '3',  trend: 'за 30 дней', dir: 'flat' },
    { key: 'missed',    label: 'Пропущено', value: '1',  trend: 'за 30 дней', dir: 'down' },
];

// 4 weeks × { plan, fact }
const WEEKLY_DATA = [
    { week: 'Нед. 1', plan: 7, fact: 6 },
    { week: 'Нед. 2', plan: 7, fact: 8 },
    { week: 'Нед. 3', plan: 7, fact: 7 },
    { week: 'Нед. 4', plan: 7, fact: 7 },
];

const BY_SUBJECT = [
    { name: 'Математика', icon: 'calculator', count: 24, variant: 'variant-indigo' },
    { name: 'Физика',     icon: 'flask',      count: 18, variant: 'variant-orange' },
    { name: 'Химия',      icon: 'book',       count: 5,  variant: 'variant-green' },
];

const LAST_LESSONS = [
    { id: 'l-01', day: '20', month: 'апр', subject: 'Математика', tutor: 'ЕП', tutorVariant: 'variant-orange', time: '16:00 · 1ч', status: 'completed' },
    { id: 'l-02', day: '19', month: 'апр', subject: 'Физика',     tutor: 'МК', tutorVariant: 'variant-indigo', time: '14:00 · 1ч', status: 'completed' },
    { id: 'l-03', day: '18', month: 'апр', subject: 'Химия',      tutor: 'АС', tutorVariant: 'variant-green',  time: '12:00 · 1ч', status: 'cancelled' },
    { id: 'l-04', day: '17', month: 'апр', subject: 'Математика', tutor: 'ЕП', tutorVariant: 'variant-orange', time: '16:00 · 1ч', status: 'completed' },
    { id: 'l-05', day: '16', month: 'апр', subject: 'Математика', tutor: 'ЕП', tutorVariant: 'variant-orange', time: '17:00 · 1ч', status: 'completed' },
    { id: 'l-06', day: '15', month: 'апр', subject: 'Физика',     tutor: 'МК', tutorVariant: 'variant-indigo', time: '14:00 · 1ч', status: 'completed' },
    { id: 'l-07', day: '14', month: 'апр', subject: 'Математика', tutor: 'ЕП', tutorVariant: 'variant-orange', time: '16:00 · 1.5ч', status: 'completed' },
    { id: 'l-08', day: '12', month: 'апр', subject: 'Химия',      tutor: 'АС', tutorVariant: 'variant-green',  time: '12:00 · 1ч', status: 'missed' },
    { id: 'l-09', day: '11', month: 'апр', subject: 'Физика',     tutor: 'МК', tutorVariant: 'variant-indigo', time: '14:00 · 1ч', status: 'completed' },
    { id: 'l-10', day: '10', month: 'апр', subject: 'Математика', tutor: 'ЕП', tutorVariant: 'variant-orange', time: '16:00 · 1ч', status: 'completed' },
];

const ACHIEVEMENTS = [
    { key: 'streak',  label: '10 занятий подряд',  state: 'unlocked', icon: 'flame' },
    { key: 'package', label: 'Первый пакет',       state: 'unlocked', icon: 'package' },
    { key: 'month',   label: 'Месяц на платформе', state: 'locked',   icon: 'calendar-check' },
    { key: 'marathon', label: 'Марафон 20 занятий', state: 'locked',  icon: 'trophy' },
];

// ── Helpers ────────────────────────────────
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const SVG_NS = 'http://www.w3.org/2000/svg';

function trendSymbol(dir) {
    if (dir === 'up')   return '↑';
    if (dir === 'down') return '↓';
    return '';
}

// ── Subject icons (lucide-style inline SVG) ─
const SUBJECT_ICONS = {
    calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="8" y1="18" x2="8.01" y2="18"/>',
    flask: '<path d="M9 2v6L4.2 17.1A2 2 0 0 0 6 20h12a2 2 0 0 0 1.8-2.9L15 8V2"/><line x1="8" y1="2" x2="16" y2="2"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
};

// ── Achievement icons ──────────────────────
const ACH_ICONS = {
    flame:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    'calendar-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="8 14 11 17 16 12"/></svg>',
    trophy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
};

// ── Render: summary ────────────────────────
function renderSummary() {
    const grid = $('#prSummaryGrid');
    grid.innerHTML = '';
    SUMMARY.forEach((s, idx) => {
        const sym = trendSymbol(s.dir);
        const trendTxt = sym ? `${sym} ${s.trend}` : s.trend;
        const card = document.createElement('div');
        card.className = 'pr-summary-card';
        card.dataset.key = s.key;
        card.style.animationDelay = `${idx * 0.04}s`;
        card.innerHTML = `
            <div class="pr-summary-label">${s.label}</div>
            <div class="pr-summary-value">${s.value}</div>
            <div class="pr-summary-trend ${s.dir}">${trendTxt}</div>
        `;
        grid.appendChild(card);
    });
}

// ── Render: chart ──────────────────────────
function renderChart() {
    const W = 320, H = 120;
    const padX = 10, padTop = 10, padBottom = 10;
    const innerW = W - padX * 2;
    const innerH = H - padTop - padBottom;

    const planVals = WEEKLY_DATA.map(w => w.plan);
    const factVals = WEEKLY_DATA.map(w => w.fact);
    const allVals = [...planVals, ...factVals];
    const maxVal = Math.max(...allVals);
    const minVal = Math.min(...allVals);
    const range = Math.max(1, maxVal - minVal + 2); // padding headroom

    const coordsFor = (vals) => vals.map((v, i) => {
        const x = padX + (vals.length === 1 ? innerW / 2 : (i / (vals.length - 1)) * innerW);
        const y = padTop + innerH - ((v - minVal + 1) / range) * innerH;
        return { x, y };
    });

    const planCoords = coordsFor(planVals);
    const factCoords = coordsFor(factVals);

    const pathFrom = (cs) => cs.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');

    const factLine = pathFrom(factCoords);
    const planLine = pathFrom(planCoords);
    const areaPath = factLine
        + ` L${factCoords[factCoords.length - 1].x.toFixed(2)},${(padTop + innerH).toFixed(2)}`
        + ` L${factCoords[0].x.toFixed(2)},${(padTop + innerH).toFixed(2)} Z`;

    $('#prChartFact').setAttribute('d', factLine);
    $('#prChartPlan').setAttribute('d', planLine);
    $('#prChartArea').setAttribute('d', areaPath);

    // Grid (3 horizontal lines)
    const grid = $('#prChartGrid');
    grid.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const y = padTop + (innerH / 2) * i;
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', padX);
        line.setAttribute('x2', W - padX);
        line.setAttribute('y1', y);
        line.setAttribute('y2', y);
        grid.appendChild(line);
    }

    // Dots
    const planDots = $('#prChartDotsPlan');
    const factDots = $('#prChartDotsFact');
    planDots.innerHTML = '';
    factDots.innerHTML = '';
    planCoords.forEach(c => {
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', c.x.toFixed(2));
        circle.setAttribute('cy', c.y.toFixed(2));
        circle.setAttribute('r', '2.5');
        planDots.appendChild(circle);
    });
    factCoords.forEach(c => {
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', c.x.toFixed(2));
        circle.setAttribute('cy', c.y.toFixed(2));
        circle.setAttribute('r', '3');
        factDots.appendChild(circle);
    });
}

// ── Render: subjects ───────────────────────
function renderSubjects() {
    const maxCount = Math.max(...BY_SUBJECT.map(s => s.count));
    const wrap = $('#prSubjects');
    wrap.innerHTML = '';
    BY_SUBJECT.forEach((s, idx) => {
        const pct = Math.round((s.count / maxCount) * 100);
        const iconSvg = SUBJECT_ICONS[s.icon] || '';
        const row = document.createElement('div');
        row.className = `pr-subject-row ${s.variant}`;
        row.style.animationDelay = `${idx * 0.05}s`;
        row.innerHTML = `
            <div class="pr-subject-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</svg>
            </div>
            <div class="pr-subject-name">${s.name}</div>
            <div class="pr-subject-bar"><div class="pr-subject-bar-fill" style="width:${pct}%"></div></div>
            <div class="pr-subject-value">${s.count}</div>
        `;
        wrap.appendChild(row);
    });
}

// ── Render: history ────────────────────────
const STATUS_ICON = {
    completed: '<polyline points="20 6 9 17 4 12"/>',
    cancelled: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    missed:    '<line x1="5" y1="12" x2="19" y2="12"/>',
};

let historyShownCount = 8;
function renderHistory() {
    const wrap = $('#prHistory');
    wrap.innerHTML = '';
    const items = LAST_LESSONS.slice(0, historyShownCount);
    items.forEach((l, idx) => {
        const clickable = l.status === 'completed';
        const item = document.createElement('div');
        item.className = `pr-history-item ${l.status} ${clickable ? 'completed' : 'non-clickable'}`;
        item.style.animationDelay = `${idx * 0.03}s`;
        item.dataset.id = l.id;
        item.innerHTML = `
            <div class="pr-date-chip">${l.day}</div>
            <div class="pr-history-info">
                <div class="pr-history-subject">${l.subject}</div>
                <div class="pr-history-meta">${l.time}</div>
            </div>
            <div class="avatar-variant pr-tutor-avatar ${l.tutorVariant}">${l.tutor}</div>
            <div class="pr-status-icon ${l.status}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${STATUS_ICON[l.status]}</svg>
            </div>
        `;
        if (clickable) {
            item.addEventListener('click', () => {
                // Mock navigation to LessonDetail
                console.log('Open lesson detail:', l.id);
            });
        }
        wrap.appendChild(item);
    });

    const showAllBtn = $('#prShowAll');
    if (historyShownCount >= LAST_LESSONS.length) {
        showAllBtn.style.display = 'none';
    } else {
        showAllBtn.style.display = 'block';
    }
}

// ── Render: achievements ───────────────────
function renderAchievements() {
    const wrap = $('#prAchievements');
    wrap.innerHTML = '';
    ACHIEVEMENTS.forEach((a, idx) => {
        const el = document.createElement('div');
        el.className = `pr-achievement ${a.state}`;
        el.style.animationDelay = `${idx * 0.04}s`;
        el.innerHTML = `
            <div class="pr-achievement-icon">${ACH_ICONS[a.icon] || ''}</div>
            <div class="pr-achievement-label">${a.label}</div>
        `;
        wrap.appendChild(el);
    });
}

// ── Events ─────────────────────────────────
function bindEvents() {
    $('#prShowAll').addEventListener('click', () => {
        historyShownCount = LAST_LESSONS.length;
        renderHistory();
    });
}

// ── Init ───────────────────────────────────
function init() {
    renderSummary();
    renderChart();
    renderSubjects();
    renderHistory();
    renderAchievements();
    bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
