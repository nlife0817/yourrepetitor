/* ══════════════════════════════════════════
   ── parent/reports.js — Отчёты родителя ──
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Mocks ──────────────────────────────
    const CHILDREN = [
        { id: 'c1', name: 'Артём',  age: 14, class: '8 класс', variant: 'indigo', initial: 'А' },
        { id: 'c2', name: 'София',  age: 11, class: '5 класс', variant: 'orange', initial: 'С' },
    ];

    let ACTIVE_CHILD_ID = CHILDREN[0].id;

    const PERIODS = {
        7:   { label: '7 дней',     range: '14 — 20 апреля' },
        30:  { label: '30 дней',    range: '22 марта — 20 апреля' },
        90:  { label: '3 месяца',   range: 'Февраль — апрель' },
        365: { label: '12 месяцев', range: 'Май 2025 — апрель 2026' },
    };

    const REPORTS_BY_CHILD = {
        c1: {
            summary: {
                7:   { lessons: { value: '3',  trend: '+1',  dir: 'up' },   paid: { value: '4 800 ₽',   trend: '+5%',  dir: 'up' },   missed: { value: '0', trend: '—',   dir: 'flat' }, attendance: { value: '100%', pct: 100 } },
                30:  { lessons: { value: '12', trend: '+2',  dir: 'up' },   paid: { value: '15 800 ₽',  trend: '+8%',  dir: 'up' },   missed: { value: '1', trend: '-1',  dir: 'up' },   attendance: { value: '93%',  pct: 93 }  },
                90:  { lessons: { value: '34', trend: '+6',  dir: 'up' },   paid: { value: '48 200 ₽',  trend: '+14%', dir: 'up' },   missed: { value: '3', trend: '+1',  dir: 'down' }, attendance: { value: '91%',  pct: 91 }  },
                365: { lessons: { value: '126',trend: '+18', dir: 'up' },   paid: { value: '186 400 ₽', trend: '+22%', dir: 'up' },   missed: { value: '8', trend: '+2',  dir: 'down' }, attendance: { value: '94%',  pct: 94 }  },
            },
            weekly: {
                7:   { points: [1, 0, 1, 0, 1, 0, 0],            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] },
                30:  { points: [3, 4, 2, 3],                      labels: ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'] },
                90:  { points: [8, 10, 12, 9, 11, 13, 12],       labels: ['Фев', 'Фев', 'Мар', 'Мар', 'Мар', 'Апр', 'Апр'] },
                365: { points: [9, 11, 10, 12, 11, 13, 10, 14, 12, 13, 12, 14], labels: ['Май', 'Июл', 'Сен', 'Ноя', 'Янв', 'Апр'] },
            },
            spend: {
                7:   { points: [1900, 0, 1900, 0, 1000, 0, 0] },
                30:  { points: [4200, 5200, 3400, 3000] },
                90:  { points: [11200, 14600, 16800, 12400, 15200, 18400, 16200] },
                365: { points: [12800, 14200, 13600, 15800, 14200, 16400, 13800, 18200, 15400, 16400, 15200, 17600] },
            },
            subjects: [
                { name: 'Математика', variant: 'indigo', lessons: 8, spend: 12400, share: 100 },
                { name: 'Физика',     variant: 'orange', lessons: 3, spend: 3600,  share: 60 },
                { name: 'Английский', variant: 'green',  lessons: 1, spend: 1400,  share: 20 },
            ],
            attendance: {
                7:   [{ label: 'Пн', pct: 100 }, { label: 'Вт', pct: 100 }, { label: 'Ср', pct: 100 }, { label: 'Чт', pct: 100 }],
                30:  [{ label: 'Нед 1', pct: 100 }, { label: 'Нед 2', pct: 75 }, { label: 'Нед 3', pct: 100 }, { label: 'Нед 4', pct: 100 }],
                90:  [{ label: 'Фев', pct: 88 }, { label: 'Мар 1', pct: 92 }, { label: 'Мар 2', pct: 100 }, { label: 'Апр', pct: 93 }],
                365: [{ label: 'Q2', pct: 90 }, { label: 'Q3', pct: 95 }, { label: 'Q4', pct: 93 }, { label: 'Q1', pct: 96 }],
            },
            files: [
                { name: 'Отчёт за неделю 14–20 апреля', date: '20 апреля' },
                { name: 'Отчёт за март',                date: '1 апреля' },
                { name: 'Отчёт за февраль',             date: '3 марта' },
                { name: 'Отчёт за январь',              date: '2 февраля' },
            ],
        },
        c2: {
            summary: {
                7:   { lessons: { value: '2',  trend: '—',   dir: 'flat' }, paid: { value: '2 800 ₽',   trend: '—',    dir: 'flat' }, missed: { value: '0', trend: '—',   dir: 'flat' }, attendance: { value: '100%', pct: 100 } },
                30:  { lessons: { value: '8',  trend: '+1',  dir: 'up' },   paid: { value: '11 200 ₽',  trend: '+12%', dir: 'up' },   missed: { value: '0', trend: '-1',  dir: 'up' },   attendance: { value: '100%',  pct: 100 } },
                90:  { lessons: { value: '24', trend: '+4',  dir: 'up' },   paid: { value: '33 600 ₽',  trend: '+9%',  dir: 'up' },   missed: { value: '1', trend: '—',   dir: 'flat' }, attendance: { value: '96%',  pct: 96 }  },
                365: { lessons: { value: '92', trend: '+14', dir: 'up' },   paid: { value: '128 800 ₽', trend: '+18%', dir: 'up' },   missed: { value: '4', trend: '+1',  dir: 'down' }, attendance: { value: '96%',  pct: 96 }  },
            },
            weekly: {
                7:   { points: [1, 0, 0, 1, 0, 0, 0],            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] },
                30:  { points: [2, 2, 2, 2],                      labels: ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'] },
                90:  { points: [6, 8, 8, 7, 8, 9, 8],             labels: ['Фев', 'Фев', 'Мар', 'Мар', 'Мар', 'Апр', 'Апр'] },
                365: { points: [6, 7, 8, 7, 8, 9, 7, 9, 8, 9, 8, 10], labels: ['Май', 'Июл', 'Сен', 'Ноя', 'Янв', 'Апр'] },
            },
            spend: {
                7:   { points: [1400, 0, 0, 1400, 0, 0, 0] },
                30:  { points: [2800, 2800, 2800, 2800] },
                90:  { points: [8400, 11200, 11200, 9800, 11200, 12600, 11200] },
                365: { points: [8400, 9800, 11200, 9800, 11200, 12600, 9800, 12600, 11200, 12600, 11200, 14000] },
            },
            subjects: [
                { name: 'Английский', variant: 'green',  lessons: 6, spend: 8400,  share: 100 },
                { name: 'Математика', variant: 'indigo', lessons: 2, spend: 2800,  share: 34 },
            ],
            attendance: {
                7:   [{ label: 'Пн', pct: 100 }, { label: 'Вт', pct: 100 }, { label: 'Ср', pct: 100 }, { label: 'Чт', pct: 100 }],
                30:  [{ label: 'Нед 1', pct: 100 }, { label: 'Нед 2', pct: 100 }, { label: 'Нед 3', pct: 100 }, { label: 'Нед 4', pct: 100 }],
                90:  [{ label: 'Фев', pct: 92 }, { label: 'Мар 1', pct: 96 }, { label: 'Мар 2', pct: 100 }, { label: 'Апр', pct: 96 }],
                365: [{ label: 'Q2', pct: 94 }, { label: 'Q3', pct: 96 }, { label: 'Q4', pct: 98 }, { label: 'Q1', pct: 96 }],
            },
            files: [
                { name: 'Отчёт за неделю 14–20 апреля', date: '20 апреля' },
                { name: 'Отчёт за март',                date: '2 апреля' },
                { name: 'Отчёт за февраль',             date: '4 марта' },
            ],
        },
    };

    // Subject icon (book)
    const SUBJECT_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
    const FILE_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M9 18h4"/></svg>`;
    const CHEVRON_SVG = `<svg class="pr2-file-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

    // ── State ──────────────────────────────
    let currentPeriod = 30;
    let currentSeries = 'lessons';

    // ── DOM ────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const el = {
        childSwitcherWrap: $('#pr2ChildSwitcherWrap'),
        childSwitcher:     $('#pr2ChildSwitcher'),
        singleChildCard:   $('#pr2SingleChildCard'),
        singleChildAvatar: $('#pr2SingleChildAvatar'),
        singleChildName:   $('#pr2SingleChildName'),
        singleChildMeta:   $('#pr2SingleChildMeta'),
        periodRange:       $('#pr2PeriodRange'),
        summaryGrid:       $('#pr2SummaryGrid'),
        circleFg:          $('#pr2CircleFg'),
        chartArea:         $('#pr2ChartArea'),
        chartLine:         $('#pr2ChartLine'),
        chartGrid:         $('#pr2ChartGrid'),
        chartDots:         $('#pr2ChartDots'),
        chartXAxis:        $('#pr2ChartXAxis'),
        subjectsList:      $('#pr2SubjectsList'),
        attendanceBars:    $('#pr2AttendanceBars'),
        filesList:         $('#pr2FilesList'),
    };

    // ── Helpers ────────────────────────────
    function pluralYears(n) {
        const mod10 = n % 10, mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'лет';
        if (mod10 === 1) return 'год';
        if (mod10 >= 2 && mod10 <= 4) return 'года';
        return 'лет';
    }
    function trendSymbol(dir) {
        if (dir === 'up') return '↑';
        if (dir === 'down') return '↓';
        return '';
    }
    function fmtMoney(n) { return new Intl.NumberFormat('ru-RU').format(n) + ' ₽'; }
    function pluralLessons(n) {
        const mod10 = n % 10, mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'уроков';
        if (mod10 === 1) return 'урок';
        if (mod10 >= 2 && mod10 <= 4) return 'урока';
        return 'уроков';
    }
    function activeChild() { return CHILDREN.find(c => c.id === ACTIVE_CHILD_ID) || CHILDREN[0]; }
    function currentData() { return REPORTS_BY_CHILD[ACTIVE_CHILD_ID]; }

    // ── Render: child switcher ─────────────
    function renderChildSwitcher() {
        if (CHILDREN.length <= 1) {
            el.childSwitcherWrap.style.display = 'none';
            el.singleChildCard.style.display = 'flex';
            const c = CHILDREN[0];
            el.singleChildAvatar.className = 'pr2-single-child-avatar avatar-variant variant-' + c.variant;
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
            chip.className = 'pr2-child-chip' + (c.id === ACTIVE_CHILD_ID ? ' active' : '');
            chip.setAttribute('role', 'tab');
            chip.setAttribute('aria-selected', c.id === ACTIVE_CHILD_ID ? 'true' : 'false');
            chip.dataset.id = c.id;
            chip.innerHTML = `
                <span class="pr2-child-chip-avatar avatar-variant variant-${c.variant}">${c.initial}</span>
                <span>${c.name}</span>
            `;
            chip.addEventListener('click', () => {
                ACTIVE_CHILD_ID = c.id;
                renderChildSwitcher();
                renderAll();
            });
            el.childSwitcher.appendChild(chip);
        });
    }

    // ── Render: period range ───────────────
    function renderPeriodRange() {
        el.periodRange.textContent = PERIODS[currentPeriod].range;
    }

    // ── Render: summary cards ──────────────
    function renderSummary() {
        const data = currentData().summary[currentPeriod];
        $$('.pr2-summary-card').forEach(card => {
            const key = card.dataset.key;
            const entry = data[key];
            if (!entry) return;
            const valueEl = card.querySelector('[data-role="value"]');
            if (valueEl) valueEl.textContent = entry.value;

            const trendEl = card.querySelector('[data-role="trend"]');
            if (trendEl) {
                let dirClass = entry.dir || 'flat';
                // Для missed: меньше = лучше
                if (key === 'missed') {
                    if (entry.dir === 'up') dirClass = 'down';
                    else if (entry.dir === 'down') dirClass = 'up';
                }
                trendEl.className = 'pr2-summary-trend ' + dirClass;
                const sym = trendSymbol(dirClass);
                trendEl.textContent = sym ? `${sym} ${entry.trend}` : entry.trend;
            }
        });
        // Progress circle
        const pct = data.attendance.pct;
        const offset = 100 - pct;
        el.circleFg.style.strokeDashoffset = String(offset);
    }

    // ── Render: chart ──────────────────────
    function renderChart() {
        const dataset = currentData();
        let pointsObj;
        if (currentSeries === 'lessons') pointsObj = dataset.weekly[currentPeriod];
        else pointsObj = { points: dataset.spend[currentPeriod].points, labels: dataset.weekly[currentPeriod].labels };

        const points = pointsObj.points;
        const labels = pointsObj.labels;

        const W = 320, H = 140;
        const padX = 6, padTop = 10, padBottom = 10;
        const innerW = W - padX * 2;
        const innerH = H - padTop - padBottom;

        const maxVal = Math.max(...points, 1);
        const minVal = Math.min(...points, 0);
        const range = Math.max(1, maxVal - minVal);

        const coords = points.map((v, i) => {
            const x = padX + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
            const y = padTop + innerH - ((v - minVal) / range) * innerH;
            return { x, y };
        });

        const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
        const areaPath = linePath +
            ` L${coords[coords.length - 1].x.toFixed(2)},${(padTop + innerH).toFixed(2)}` +
            ` L${coords[0].x.toFixed(2)},${(padTop + innerH).toFixed(2)} Z`;

        el.chartLine.setAttribute('d', linePath);
        el.chartArea.setAttribute('d', areaPath);

        // Grid
        el.chartGrid.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const y = padTop + (innerH / 2) * i;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', padX);
            line.setAttribute('x2', W - padX);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            el.chartGrid.appendChild(line);
        }

        // Dots
        el.chartDots.innerHTML = '';
        coords.forEach(c => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', c.x.toFixed(2));
            circle.setAttribute('cy', c.y.toFixed(2));
            circle.setAttribute('r', '3');
            el.chartDots.appendChild(circle);
        });

        // X-axis
        el.chartXAxis.innerHTML = '';
        const slice = labels.length > 6 ? labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0).slice(0, 6) : labels;
        slice.forEach(l => {
            const span = document.createElement('span');
            span.textContent = l;
            el.chartXAxis.appendChild(span);
        });
    }

    // ── Render: subjects ───────────────────
    function renderSubjects() {
        const subjects = currentData().subjects;
        el.subjectsList.innerHTML = '';
        subjects.forEach((s, idx) => {
            const li = document.createElement('li');
            li.className = 'pr2-subject-row variant-' + s.variant;
            li.style.animationDelay = `${idx * 0.04}s`;
            li.innerHTML = `
                <div class="pr2-subject-icon">${SUBJECT_ICON_SVG}</div>
                <div class="pr2-subject-info">
                    <div class="pr2-subject-name">${s.name}</div>
                    <div class="pr2-subject-meta">${s.lessons} ${pluralLessons(s.lessons)} · ${fmtMoney(s.spend)}</div>
                </div>
                <div class="pr2-subject-bar">
                    <div class="pr2-subject-bar-fill" style="width:${Math.max(4, Math.min(100, s.share))}%"></div>
                </div>
            `;
            el.subjectsList.appendChild(li);
        });
    }

    // ── Render: attendance bars ────────────
    function renderAttendance() {
        const weeks = currentData().attendance[currentPeriod];
        el.attendanceBars.innerHTML = '';
        weeks.forEach((w, idx) => {
            const col = document.createElement('div');
            col.className = 'pr2-week-col';
            col.innerHTML = `
                <div class="pr2-week-pct">${w.pct}%</div>
                <div class="pr2-week-bar">
                    <div class="pr2-week-bar-fill" style="height:0%"></div>
                </div>
                <div class="pr2-week-label">${w.label}</div>
            `;
            el.attendanceBars.appendChild(col);
            // Animate in
            requestAnimationFrame(() => {
                const fill = col.querySelector('.pr2-week-bar-fill');
                fill.style.transitionDelay = `${idx * 0.05}s`;
                fill.style.height = w.pct + '%';
            });
        });
    }

    // ── Render: files ──────────────────────
    function renderFiles() {
        const files = currentData().files;
        el.filesList.innerHTML = '';
        files.forEach((f, idx) => {
            const li = document.createElement('li');
            li.className = 'pr2-file-row';
            li.style.animationDelay = `${idx * 0.04}s`;
            li.setAttribute('role', 'button');
            li.setAttribute('tabindex', '0');
            li.innerHTML = `
                <div class="pr2-file-icon">${FILE_ICON_SVG}</div>
                <div class="pr2-file-info">
                    <div class="pr2-file-name">${f.name}</div>
                    <div class="pr2-file-date">Отправлен ${f.date}</div>
                </div>
                ${CHEVRON_SVG}
            `;
            const handler = () => alert('Открыть: ' + f.name);
            li.addEventListener('click', handler);
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
            });
            el.filesList.appendChild(li);
        });
    }

    // ── Combined ───────────────────────────
    function renderAll() {
        renderPeriodRange();
        renderSummary();
        renderChart();
        renderSubjects();
        renderAttendance();
        renderFiles();
    }

    // ── Events ─────────────────────────────
    function bindEvents() {
        // Period switcher
        $$('.pr2-period-switcher .picker-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.pr2-period-switcher .picker-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPeriod = parseInt(btn.dataset.period, 10);
                renderPeriodRange();
                renderSummary();
                renderChart();
                renderAttendance();
            });
        });

        // Chart toggle
        $$('.pr2-chart-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.pr2-chart-toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSeries = btn.dataset.series;
                renderChart();
            });
        });
    }

    // ── Init ───────────────────────────────
    function init() {
        renderChildSwitcher();
        renderAll();
        bindEvents();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
