// ── State ──
let weekOffset = 0;
const BASE_MONDAY = new Date(2026, 2, 9);
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MONTHS_NOM = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function getWeekDates(offset) {
    const monday = new Date(BASE_MONDAY);
    monday.setDate(monday.getDate() + offset * 7);
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    return days;
}

function updateMonthLabel(days) {
    const label = document.getElementById('monthLabel');
    const months = new Set(days.map(d => d.getMonth()));
    if (months.size === 1) {
        label.textContent = MONTHS_NOM[days[0].getMonth()];
    } else {
        const arr = [...months];
        label.textContent = MONTHS_NOM[arr[0]] + ' / ' + MONTHS_NOM[arr[1]];
    }
}

function updateWeek(direction) {
    const days = getWeekDates(weekOffset);
    const strip = document.getElementById('weekStrip');
    const grid = document.getElementById('timeGrid');

    const slideClass = direction === 'next' ? 'sliding-left' : 'sliding-right';
    const gridSlide = direction === 'next' ? 'slide-left' : 'slide-right';
    strip.classList.add(slideClass);
    grid.classList.add(gridSlide);

    setTimeout(() => {
        updateMonthLabel(days);

        const cells = strip.querySelectorAll('.day-cell');
        const today = new Date();
        today.setHours(0,0,0,0);

        cells.forEach((cell, i) => {
            const d = days[i];
            cell.querySelector('.day-label').textContent = DAY_NAMES[i];
            cell.querySelector('.day-number').textContent = d.getDate();
            cell.classList.remove('today', 'selected');
            if (d.getTime() === today.getTime()) {
                cell.classList.add('today', 'selected');
            }
        });
    }, 140);

    setTimeout(() => {
        strip.classList.remove(slideClass);
        grid.classList.remove(gridSlide);
    }, 350);
}

// ── Week navigation ──
function animateWeekGrid(direction) {
    if (currentView !== 'week') return;
    const container = document.getElementById('weekGridContainer');
    container.style.opacity = '0';
    setTimeout(() => {
        buildWeekGrid();
        container.style.opacity = '1';
    }, 160);
}

document.getElementById('btnPrev').addEventListener('click', () => {
    weekOffset--;
    updateWeek('prev');
    animateWeekGrid('prev');
    if (currentView !== 'week') return; // day view handled by updateWeek
});

document.getElementById('btnNext').addEventListener('click', () => {
    weekOffset++;
    updateWeek('next');
    animateWeekGrid('next');
    if (currentView !== 'week') return;
});

// ── Today button ──
document.querySelector('.btn-today').addEventListener('click', () => {
    const dir = weekOffset > 0 ? 'prev' : 'next';
    weekOffset = 0;
    updateWeek(dir);
    if (currentView === 'week') {
        animateWeekGrid(dir);
        setTimeout(() => {
            const container = document.getElementById('weekGridContainer');
            const h = new Date().getHours();
            if (h >= WEEK_START_HOUR) {
                const scrollTo = Math.max(0, (h - WEEK_START_HOUR - 1) * WEEK_ROW_H);
                container.scrollTo({ top: scrollTo, behavior: 'smooth' });
            }
        }, 400);
    } else {
        const container = document.querySelector('.schedule-container');
        const hours = new Date().getHours();
        const scrollTo = Math.max(0, (hours - 1) * 60);
        setTimeout(() => container.scrollTo({ top: scrollTo, behavior: 'smooth' }), 400);
    }
});

// ── Current time indicator ──
function updateCurrentTime() {
    const indicator = document.getElementById('currentTime');
    const badge = document.getElementById('currentTimeBadge');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const rowHeight = 60;
    const offset = hours * rowHeight + (minutes / 60) * rowHeight;
    indicator.style.display = 'flex';
    indicator.style.top = offset + 'px';
    badge.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

updateCurrentTime();
setInterval(updateCurrentTime, 60000);

// ── View state ──
let currentView = 'day'; // 'day' | 'week'
const app = document.querySelector('.app');
const WEEK_START_HOUR = 0;
const WEEK_END_HOUR = 23;
const WEEK_ROW_H = 48;

// Demo events data (shared between day and week views)
const weekEvents = [
    { day: 0, hour: 9, duration: 1, name: 'Алиса Козлова', subject: 'Математика', variant: 'indigo' },
    { day: 0, hour: 15, duration: 1, name: 'Соня Волкова', subject: 'Информатика', variant: 'green' },
    { day: 1, hour: 11, duration: 1, name: 'Дима Морозов', subject: 'Физика', variant: 'orange' },
    { day: 3, hour: 9, duration: 1, name: 'Алиса Козлова', subject: 'Математика', variant: 'indigo' },
    { day: 3, hour: 14, duration: 1, name: 'Дима Морозов', subject: 'Физика', variant: 'orange' },
    { day: 6, hour: 9, duration: 1, name: 'Алиса Козлова', subject: 'Математика', variant: 'indigo' },
    { day: 6, hour: 11, duration: 1, name: 'Дима Морозов', subject: 'Физика', variant: 'orange' },
    { day: 6, hour: 15, duration: 1, name: 'Соня Волкова', subject: 'Информатика', variant: 'green' },
];

// ── Build day grid dynamically ──
let selectedDayIndex = 6; // Sunday (today) by default

function buildDayGrid(dayIndex) {
    selectedDayIndex = dayIndex;
    const grid = document.getElementById('timeGrid');
    // Remove existing event cards
    grid.querySelectorAll('.event-card').forEach(c => c.remove());

    // Place events for this day
    const dayEvents = weekEvents.filter(e => e.day === dayIndex);
    const rows = grid.querySelectorAll('.time-row');

    dayEvents.forEach(evt => {
        const row = rows[evt.hour];
        if (!row) return;
        const timeLine = row.querySelector('.time-line');
        if (!timeLine) return;

        const card = document.createElement('div');
        card.className = 'event-card variant-' + evt.variant;
        const pxHeight = evt.duration * 60 - 8;
        card.style.cssText = `top: 4px; height: ${pxHeight}px;`;
        const endHour = evt.hour + evt.duration;
        card.innerHTML = `<div class="event-title">${evt.name}</div><div class="event-meta">${String(evt.hour).padStart(2,'0')}:00 – ${String(endHour).padStart(2,'0')}:00 · ${evt.subject}</div>`;

        // Click handler for detail sheet
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const days = getWeekDates(weekOffset);
            openDetailSheet({ name: evt.name, hour: evt.hour, duration: evt.duration, date: days[dayIndex] || new Date() });
        });

        timeLine.appendChild(card);
    });

    // Update has-events dots on week strip
    const cells = document.querySelectorAll('.day-cell');
    cells.forEach((cell, i) => {
        const hasEvts = weekEvents.some(e => e.day === i);
        cell.classList.toggle('has-events', hasEvts);
    });
}

function buildWeekGrid() {
    const days = getWeekDates(weekOffset);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build header
    const header = document.getElementById('weekHeader');
    header.innerHTML = '<div class="week-header-spacer"></div>';
    days.forEach((d, i) => {
        const isToday = d.getTime() === today.getTime();
        const hasEvts = weekEvents.some(e => e.day === i);
        const div = document.createElement('div');
        div.className = 'week-day-header' + (isToday ? ' today' : '') + (hasEvts ? ' has-events' : '');
        div.dataset.dayIndex = i;
        div.innerHTML = `<span class="wh-label">${DAY_NAMES[i]}</span><span class="wh-number">${d.getDate()}</span>`;
        div.addEventListener('click', () => {
            // Switch to day view on that day
            switchToDay(i);
        });
        header.appendChild(div);
    });

    // Build grid body
    const grid = document.getElementById('weekGrid');
    grid.innerHTML = '';

    const todayIndex = days.findIndex(d => d.getTime() === today.getTime());

    for (let h = WEEK_START_HOUR; h <= WEEK_END_HOUR; h++) {
        // Time label
        const label = document.createElement('div');
        label.className = 'week-time-label';
        label.textContent = String(h).padStart(2, '0') + ':00';
        grid.appendChild(label);

        // 7 day cells
        for (let d = 0; d < 7; d++) {
            const cell = document.createElement('div');
            cell.className = 'week-cell';
            if (d === todayIndex) cell.classList.add('today-col');
            cell.dataset.dayIndex = d;
            cell.dataset.hour = h;

            // Click to open sheet
            cell.addEventListener('click', (e) => {
                if (e.target.closest('.week-event')) return;
                const date = days[d];
                const rect = cell.getBoundingClientRect();
                const yRatio = (e.clientY - rect.top) / rect.height;
                const mins = yRatio < 0.5 ? '00' : '30';
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                document.getElementById('dateInput').value = `${dd}.${mm}.${yyyy}`;
                document.getElementById('timeInput').value = `${String(h).padStart(2, '0')}:${mins}`;
                if (!sheetOpen) openSheet();
            });

            grid.appendChild(cell);
        }
    }

    // Place events
    weekEvents.forEach(evt => {
        if (evt.hour < WEEK_START_HOUR || evt.hour > WEEK_END_HOUR) return;
        const rowIndex = evt.hour - WEEK_START_HOUR;
        const cellIndex = rowIndex * 8 + 1 + evt.day; // +1 for time label col
        const cells = grid.children;
        const targetCell = cells[cellIndex];
        if (!targetCell) return;

        const evEl = document.createElement('div');
        evEl.className = 'week-event variant-' + evt.variant;
        const pxHeight = evt.duration * WEEK_ROW_H - 4;
        evEl.style.cssText = `top: 2px; height: ${pxHeight}px; left: 2px; right: 2px;`;
        evEl.innerHTML = `<div class="we-name">${evt.name.split(' ')[0]}</div><div class="we-time">${String(evt.hour).padStart(2,'0')}:00</div>`;
        targetCell.appendChild(evEl);
    });

    // Current time indicator
    const now = new Date();
    const nowH = now.getHours();
    const nowM = now.getMinutes();
    if (nowH >= WEEK_START_HOUR && nowH <= WEEK_END_HOUR) {
        const existingIndicator = grid.querySelector('.week-current-time');
        if (existingIndicator) existingIndicator.remove();
        const indicator = document.createElement('div');
        indicator.className = 'week-current-time';
        const offset = (nowH - WEEK_START_HOUR) * WEEK_ROW_H + (nowM / 60) * WEEK_ROW_H;
        indicator.style.top = offset + 'px';
        grid.appendChild(indicator);
    }
}

function switchToDay(dayIndex) {
    // Select the day in week strip and switch to day view
    const cells = document.querySelectorAll('.day-cell');
    cells.forEach(c => c.classList.remove('selected'));
    if (cells[dayIndex]) cells[dayIndex].classList.add('selected');
    buildDayGrid(dayIndex);
    setView('day');
    // Scroll to current time in day view
    setTimeout(() => {
        const container = document.querySelector('.schedule-container');
        const hours = new Date().getHours();
        const scrollTo = Math.max(0, (hours - 1) * 60);
        container.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }, 100);
}

function setView(view) {
    currentView = view;
    const btns = document.querySelectorAll('.view-toggle button');
    btns.forEach(b => b.classList.remove('active'));
    if (view === 'week') {
        btns[0].classList.add('active');
        app.classList.add('view-week');
        buildWeekGrid();
        // Scroll to current time
        setTimeout(() => {
            const container = document.getElementById('weekGridContainer');
            const now = new Date();
            const h = now.getHours();
            if (h >= WEEK_START_HOUR) {
                const scrollTo = Math.max(0, (h - WEEK_START_HOUR - 1) * WEEK_ROW_H);
                container.scrollTo({ top: scrollTo, behavior: 'smooth' });
            }
        }, 50);
    } else {
        btns[1].classList.add('active');
        app.classList.remove('view-week');
        buildDayGrid(selectedDayIndex);
        // Scroll to current time in day view
        setTimeout(() => {
            const container = document.querySelector('.schedule-container');
            const hours = new Date().getHours();
            const scrollTo = Math.max(0, (hours - 1) * 60);
            container.scrollTo({ top: scrollTo, behavior: 'smooth' });
        }, 100);
    }
    // Update month label
    updateMonthLabel(getWeekDates(weekOffset));
}

// ── View toggle ──
document.querySelectorAll('.view-toggle button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        setView(i === 0 ? 'week' : 'day');
    });
});

// ── Day cell click ──
document.querySelectorAll('.day-cell').forEach((cell, i) => {
    cell.addEventListener('click', () => {
        document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');

        const grid = document.getElementById('timeGrid');
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(6px)';
        setTimeout(() => {
            buildDayGrid(i);
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 150);
    });
});

// ── Nav item click ──
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ── Scroll to current time on load ──
window.addEventListener('load', () => {
    if (currentView === 'day') {
        const container = document.querySelector('.schedule-container');
        const hours = new Date().getHours();
        const scrollTo = Math.max(0, (hours - 1) * 60);
        container.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
});

// ── Bottom Sheet ──
const fab = document.getElementById('btnFab');
const overlay = document.getElementById('sheetOverlay');
const sheet = document.getElementById('bottomSheet');
let sheetOpen = false;
let detailOpen = false;
let seriesEditMode = false;

let openSheetFromSlot = false; // track if opened via time slot click

function resetForm() {
    // Student
    selectedStudentId = null;
    document.getElementById('studentSelect').dataset.value = '';
    studentDisplay.textContent = 'Выберите ученика';
    studentDisplay.classList.remove('has-value');
    studentSearchInput.value = '';
    closeStudentDropdown();

    // Date/time (only reset if not opened from slot)
    if (!openSheetFromSlot) {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        document.getElementById('dateInput').value = `${dd}.${mm}.${now.getFullYear()}`;
        document.getElementById('timeInput').value = '';
    }

    // Recurring off
    toggleRecurring.classList.remove('on');
    toggleRecurring.setAttribute('aria-checked', 'false');
    recurringOptions.style.display = 'none';
    recurringOptions.style.maxHeight = '0';
    recurringOptions.style.opacity = '0';
    recurringOptions.classList.remove('visible');

    // Duration default 1ч
    durChips.forEach(c => c.classList.remove('active'));
    durChips[2].classList.add('active');
    durCustom.value = '';
    durCustom.classList.remove('has-value');

    // Price
    document.getElementById('priceInput').value = '';

    // Format default online
    document.querySelectorAll('#formatToggle .format-pill').forEach(b => b.classList.remove('active'));
    document.querySelector('#formatToggle .format-pill[data-value="online"]').classList.add('active');

    // Clear errors
    clearErrors();
}

function openSheet() {
    sheetOpen = true;
    clearErrors();
    overlay.classList.add('open');
    sheet.classList.add('open');
    fab.classList.add('rotated');
    document.body.style.overflow = 'hidden';
    // Focus first interactive element
    setTimeout(() => {
        const firstInput = sheet.querySelector('.student-select, .student-search-input');
        if (firstInput) firstInput.focus();
    }, 350);
}

function closeSheet() {
    sheetOpen = false;
    closeStudentDropdown();
    overlay.classList.remove('open');
    sheet.classList.remove('open');
    fab.classList.remove('rotated');
    document.body.style.overflow = '';
    openSheetFromSlot = false;
    // Return focus to FAB
    setTimeout(() => fab.focus(), 350);
}

// ── Escape key closes sheets ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sheetOpen) closeSheet();
        if (detailOpen) closeDetailSheet();
    }
});

// ── Focus trap in sheet ──
sheet.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !sheetOpen) return;
    const focusable = sheet.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// ── Click on empty time slot ──
document.querySelectorAll('.time-row').forEach(row => {
    const timeLine = row.querySelector('.time-line');
    if (!timeLine) return;

    timeLine.addEventListener('click', (e) => {
        // Skip if clicked on an event card
        if (e.target.closest('.event-card')) return;

        // Get hour from label
        const label = row.querySelector('.time-label');
        if (!label) return;
        const hour = label.textContent.trim(); // "09:00"

        // Calculate minutes from click position within the row
        const rect = timeLine.getBoundingClientRect();
        const yRatio = (e.clientY - rect.top) / rect.height;
        const minutes = yRatio < 0.5 ? '00' : '30';
        const hourNum = hour.split(':')[0];
        const clickTime = `${hourNum}:${minutes}`;

        // Get selected date from week strip
        const selectedCell = document.querySelector('.day-cell.selected');
        if (selectedCell) {
            const dayNum = selectedCell.querySelector('.day-number').textContent;
            const days = getWeekDates(weekOffset);
            const cellIndex = [...selectedCell.parentElement.children].indexOf(selectedCell);
            const selectedDate = days[cellIndex];
            if (selectedDate) {
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const yyyy = selectedDate.getFullYear();
                document.getElementById('dateInput').value = `${dd}.${mm}.${yyyy}`;
            }
        }

        // Set time
        document.getElementById('timeInput').value = clickTime;

        // Open sheet from slot
        if (!sheetOpen) {
            openSheetFromSlot = true;
            resetForm();
            openSheetFromSlot = true; // re-set after reset clears it
            // Re-fill date/time after reset
            if (selectedCell) {
                const days2 = getWeekDates(weekOffset);
                const ci2 = [...selectedCell.parentElement.children].indexOf(selectedCell);
                const sd2 = days2[ci2];
                if (sd2) {
                    document.getElementById('dateInput').value = `${String(sd2.getDate()).padStart(2,'0')}.${String(sd2.getMonth()+1).padStart(2,'0')}.${sd2.getFullYear()}`;
                }
            }
            document.getElementById('timeInput').value = clickTime;
            openSheet();
        }
    });
});

fab.addEventListener('click', () => {
    if (detailOpen) { closeDetailSheet(); return; }
    if (sheetOpen) closeSheet();
    else {
        openSheetFromSlot = false;
        resetForm();
        openSheet();
    }
});

overlay.addEventListener('click', () => {
    if (detailOpen) closeDetailSheet();
    else if (sheetOpen) closeSheet();
});

// ── Swipe-to-dismiss (handle + body when scrollTop=0) ──
let startY = 0;
let currentY = 0;
let dragging = false;

const handleArea = document.getElementById('sheetHandle');
const sheetBody = sheet.querySelector('.sheet-body');

// Close student dropdown on sheet body scroll
sheetBody.addEventListener('scroll', () => {
    if (studentDropdown.classList.contains('open')) closeStudentDropdown();
});

function initSwipeDismiss(el) {
    el.addEventListener('touchstart', (e) => {
        // For body: only start drag if scrolled to top
        if (el === sheetBody && sheetBody.scrollTop > 0) return;
        startY = e.touches[0].clientY;
        dragging = true;
        sheet.style.transition = 'none';
    }, { passive: true });
}
initSwipeDismiss(handleArea);
initSwipeDismiss(sheetBody);

document.addEventListener('touchmove', (e) => {
    if (!dragging || !sheetOpen) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
        sheet.style.transform = `translateX(-50%) translateY(${diff}px)`;
        overlay.style.background = `rgba(10, 10, 18, ${Math.max(0, 0.45 - diff * 0.003)})`;
    }
}, { passive: true });

document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    const diff = currentY - startY;
    if (diff > 100) {
        closeSheet();
    } else {
        overlay.style.background = '';
        sheet.style.transform = '';
        if (sheetOpen) sheet.classList.add('open');
    }
    currentY = 0;
    startY = 0;
});

// ── Date/Time input masks ──
document.getElementById('dateInput').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length >= 5) v = v.slice(0,2) + '.' + v.slice(2,4) + '.' + v.slice(4);
    else if (v.length >= 3) v = v.slice(0,2) + '.' + v.slice(2);
    this.value = v;
});

document.getElementById('timeInput').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 4) v = v.slice(0, 4);
    if (v.length >= 3) v = v.slice(0,2) + ':' + v.slice(2);
    this.value = v;
});

// ── Searchable student dropdown ──
const students = [
    { id: 1, name: 'Алиса Козлова', initial: 'А', variant: 'indigo', subjects: [{ name: 'Математика', variant: 'indigo' }] },
    { id: 2, name: 'Дима Морозов', initial: 'Д', variant: 'orange', subjects: [{ name: 'Физика', variant: 'orange' }] },
    { id: 3, name: 'Соня Волкова', initial: 'С', variant: 'green', subjects: [{ name: 'Информатика', variant: 'green' }] },
    { id: 4, name: 'Катя Петрова', initial: 'К', variant: 'indigo', subjects: [{ name: 'Математика', variant: 'indigo' }, { name: 'Физика', variant: 'orange' }] },
    { id: 5, name: 'Артём Сидоров', initial: 'А', variant: 'green', subjects: [{ name: 'Информатика', variant: 'green' }] },
];

const studentTrigger = document.getElementById('studentTrigger');
const studentDropdown = document.getElementById('studentDropdown');
const studentSearchInput = document.getElementById('studentSearchInput');
const studentList = document.getElementById('studentList');
const studentDisplay = document.getElementById('studentDisplay');
const studentSelect = document.getElementById('studentSelect');

let selectedStudentId = null;

function renderStudentList(filter = '') {
    const lf = filter.toLowerCase();
    const filtered = students.filter(s => s.name.toLowerCase().includes(lf));
    studentList.innerHTML = '';
    if (filtered.length === 0) {
        studentList.innerHTML = '<div class="student-empty">Ничего не найдено</div>';
        return;
    }
    filtered.forEach(s => {
        const opt = document.createElement('div');
        opt.className = 'student-option';
        opt.dataset.id = s.id;
        const tags = s.subjects.map(sub => `<span class="student-tag variant-${sub.variant}">${sub.name}</span>`).join('');
        opt.innerHTML = `
            <div class="student-option-avatar variant-${s.variant}">${s.initial}</div>
            <div class="student-option-info">
                <div class="student-option-name">${s.name}</div>
                <div class="student-option-tags">${tags}</div>
            </div>
        `;
        opt.addEventListener('click', () => selectStudent(s));
        studentList.appendChild(opt);
    });
}

function selectStudent(s) {
    selectedStudentId = s.id;
    studentDisplay.textContent = s.name;
    studentDisplay.classList.add('has-value');
    studentSelect.dataset.value = s.id;
    closeStudentDropdown();
}

function openStudentDropdown() {
    studentDropdown.classList.add('open');
    studentTrigger.classList.add('open');
    studentSearchInput.value = '';
    renderStudentList();
    // Position fixed dropdown below trigger
    const rect = studentTrigger.getBoundingClientRect();
    studentDropdown.style.top = (rect.bottom + 6) + 'px';
    studentDropdown.style.left = rect.left + 'px';
    studentDropdown.style.right = (window.innerWidth - rect.right) + 'px';
    setTimeout(() => studentSearchInput.focus(), 50);
}

function closeStudentDropdown() {
    studentDropdown.classList.remove('open');
    studentTrigger.classList.remove('open');
}

studentTrigger.addEventListener('click', () => {
    if (studentDropdown.classList.contains('open')) closeStudentDropdown();
    else openStudentDropdown();
});

studentSearchInput.addEventListener('input', () => {
    renderStudentList(studentSearchInput.value);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!studentSelect.contains(e.target)) closeStudentDropdown();
});

// ── Toggle recurring ──
const toggleRecurring = document.getElementById('toggleRecurring');
const recurringOptions = document.getElementById('recurringOptions');

toggleRecurring.addEventListener('click', function () {
    const isOn = !this.classList.contains('on');
    this.classList.toggle('on', isOn);
    this.setAttribute('aria-checked', isOn);
    if (isOn) {
        recurringOptions.style.display = 'block';
        recurringOptions.style.maxHeight = recurringOptions.scrollHeight + 'px';
        recurringOptions.style.opacity = '1';
        recurringOptions.classList.add('visible');
    } else {
        recurringOptions.style.maxHeight = '0';
        recurringOptions.style.opacity = '0';
        setTimeout(() => {
            if (!toggleRecurring.classList.contains('on')) {
                recurringOptions.style.display = 'none';
                recurringOptions.classList.remove('visible');
            }
        }, 300);
    }
});

// ── Weekday chips (multi-select, min 1 active) ──
document.querySelectorAll('#weekdayChips .wd-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const allChips = document.querySelectorAll('#weekdayChips .wd-chip');
        const activeCount = [...allChips].filter(c => c.classList.contains('active')).length;
        // Don't allow deactivating the last chip
        if (chip.classList.contains('active') && activeCount <= 1) {
            chip.classList.add('shake');
            setTimeout(() => chip.classList.remove('shake'), 400);
            return;
        }
        chip.classList.toggle('active');
    });
});

// ── Frequency input ──
document.getElementById('freqInput').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
    if (this.value === '0') this.value = '1';
});

document.getElementById('freqInput').addEventListener('blur', function () {
    if (!this.value) this.value = '1';
});

// ── End select → show/hide count/date input ──
const endSelect = document.getElementById('endSelect');
const endCountInput = document.getElementById('endCountInput');
const endDateInput = document.getElementById('endDateInput');

endSelect.addEventListener('change', function () {
    endCountInput.classList.toggle('visible', this.value === 'count');
    endDateInput.classList.toggle('visible', this.value === 'date');
    if (this.value === 'count') {
        setTimeout(() => endCountInput.focus(), 50);
    } else if (this.value === 'date') {
        setTimeout(() => endDateInput.focus(), 50);
    }
});

endCountInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
});

// Date mask for end date input
endDateInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length >= 5) v = v.slice(0,2) + '.' + v.slice(2,4) + '.' + v.slice(4);
    else if (v.length >= 3) v = v.slice(0,2) + '.' + v.slice(2);
    this.value = v;
});

// ── Duration chips + custom input ──
const durChips = document.querySelectorAll('#durationRow .dur-chip');
const durCustom = document.getElementById('durCustom');

durChips.forEach(chip => {
    chip.addEventListener('click', () => {
        durChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        durCustom.value = '';
        durCustom.classList.remove('has-value');
    });
});

durCustom.addEventListener('input', function () {
    const val = this.value.replace(/\D/g, '');
    this.value = val;
    if (val) {
        durChips.forEach(c => c.classList.remove('active'));
        this.classList.add('has-value');
    } else {
        this.classList.remove('has-value');
    }
});

durCustom.addEventListener('focus', function () {
    if (this.value) {
        durChips.forEach(c => c.classList.remove('active'));
    }
});

durCustom.addEventListener('blur', function () {
    if (!this.value) {
        this.classList.remove('has-value');
        const hasActive = [...durChips].some(c => c.classList.contains('active'));
        if (!hasActive) {
            durChips[2].classList.add('active'); // default 1ч
        }
    }
});

// ── Format toggle ──
document.querySelectorAll('#formatToggle .format-pill').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#formatToggle .format-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ── Toast ──
function showToast(text) {
    const toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Validation ──
function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    document.querySelectorAll('.error-hint').forEach(el => el.remove());
}

function addError(el, msg) {
    el.classList.add('field-error');
    if (msg) {
        const hint = document.createElement('div');
        hint.className = 'error-hint';
        hint.textContent = msg;
        el.parentElement.appendChild(hint);
    }
}

function parseDate(str) {
    const parts = str.split('.');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1, y = parseInt(parts[2]);
    const date = new Date(y, m, d);
    if (date.getDate() !== d || date.getMonth() !== m) return null;
    return date;
}

function validateForm() {
    clearErrors();
    let valid = true;

    // Student
    const studentWrap = document.getElementById('studentSelect');
    const studentVal = studentWrap.dataset.value || '';
    if (!studentVal) {
        const trigger = document.getElementById('studentTrigger');
        addError(trigger, 'Выберите ученика');
        valid = false;
    }

    // Date
    const dateInput = document.getElementById('dateInput');
    const dateVal = parseDate(dateInput.value);
    if (!dateVal) {
        addError(dateInput, 'Некорректная дата');
        valid = false;
    }

    // Time
    const timeInput = document.getElementById('timeInput');
    const timeParts = timeInput.value.split(':');
    const timeH = parseInt(timeParts[0]), timeM = parseInt(timeParts[1]);
    if (isNaN(timeH) || isNaN(timeM) || timeH < 0 || timeH > 23 || timeM < 0 || timeM > 59) {
        addError(timeInput, 'Некорректное время');
        valid = false;
    }

    // Check not in the past
    if (dateVal && !isNaN(timeH)) {
        const lessonDate = new Date(dateVal);
        lessonDate.setHours(timeH, timeM, 0, 0);
        if (lessonDate < new Date()) {
            addError(dateInput, 'Нельзя создать занятие в прошлом');
            valid = false;
        }
    }

    // Price
    const priceInput = document.getElementById('priceInput');
    const price = parseInt(priceInput.value.replace(/\D/g, ''));
    if (!price || price <= 0) {
        addError(priceInput, 'Укажите стоимость');
        valid = false;
    }

    // Duration
    const hasActiveDur = [...durChips].some(c => c.classList.contains('active'));
    const customDurVal = durCustom.value;
    if (!hasActiveDur && !customDurVal) {
        durChips[0]?.parentElement?.classList.add('field-error');
        valid = false;
    }

    // Recurring validation
    if (toggleRecurring.classList.contains('on')) {
        const activeWdChips = document.querySelectorAll('#weekdayChips .wd-chip.active');
        if (activeWdChips.length === 0) {
            document.getElementById('weekdayChips').classList.add('field-error');
            valid = false;
        }
        const freq = parseInt(document.getElementById('freqInput').value);
        if (!freq || freq <= 0) {
            document.getElementById('freqInput').classList.add('field-error');
            valid = false;
        }
    }

    return valid;
}

// ── Submit ──
document.getElementById('btnSubmit').addEventListener('click', () => {
    if (!validateForm()) {
        const btn = document.getElementById('btnSubmit');
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 400);
        return;
    }
    closeSheet();
    showToast('Занятие создано');
});

// ── Swipe navigation (day ↔ day, week ↔ week) ──
(function initSwipeNav() {
    let swStartX = 0;
    let swStartY = 0;
    let swDeltaX = 0;
    let swActive = false;
    let swTarget = null;
    const SWIPE_THRESHOLD = 60;
    const SWIPE_MAX_Y = 50; // ignore if mostly vertical scroll

    function getSwipeContainer() {
        if (currentView === 'week') return document.getElementById('weekGridContainer');
        return document.querySelector('.schedule-container');
    }

    // Only attach to the app area (not the sheet)
    const appEl = document.querySelector('.app');

    appEl.addEventListener('touchstart', (e) => {
        if (sheetOpen) return;
        swStartX = e.touches[0].clientX;
        swStartY = e.touches[0].clientY;
        swDeltaX = 0;
        swActive = true;
        swTarget = getSwipeContainer();
    }, { passive: true });

    appEl.addEventListener('touchmove', (e) => {
        if (!swActive || sheetOpen) return;
        const dx = e.touches[0].clientX - swStartX;
        const dy = e.touches[0].clientY - swStartY;

        // If mostly vertical, abort swipe nav
        if (Math.abs(dy) > SWIPE_MAX_Y && Math.abs(dy) > Math.abs(dx)) {
            swActive = false;
            if (swTarget) {
                swTarget.style.transform = '';
                swTarget.classList.remove('swiping');
            }
            return;
        }

        swDeltaX = dx;

        // Visual feedback: slight horizontal shift
        if (Math.abs(dx) > 15 && swTarget) {
            swTarget.classList.add('swiping');
            const clampedDx = Math.sign(dx) * Math.min(Math.abs(dx) * 0.3, 80);
            swTarget.style.transform = `translateX(${clampedDx}px)`;
        }
    }, { passive: true });

    appEl.addEventListener('touchend', () => {
        if (!swActive) return;
        swActive = false;

        if (swTarget) {
            swTarget.classList.remove('swiping');
            swTarget.classList.add('snap-back');
            swTarget.style.transform = '';
            setTimeout(() => swTarget.classList.remove('snap-back'), 300);
        }

        if (Math.abs(swDeltaX) < SWIPE_THRESHOLD) return;

        const direction = swDeltaX < 0 ? 'next' : 'prev';

        if (currentView === 'week') {
            // Swipe changes week
            if (direction === 'next') weekOffset++;
            else weekOffset--;
            updateWeek(direction);
            animateWeekGrid(direction);
        } else {
            // Swipe changes selected day
            const cells = [...document.querySelectorAll('.day-cell')];
            const currentIdx = cells.findIndex(c => c.classList.contains('selected'));
            let nextIdx;

            if (direction === 'next') {
                nextIdx = currentIdx + 1;
                if (nextIdx >= cells.length) {
                    // Go to next week, select Monday
                    weekOffset++;
                    updateWeek('next');
                    setTimeout(() => {
                        const newCells = document.querySelectorAll('.day-cell');
                        newCells.forEach(c => c.classList.remove('selected'));
                        newCells[0].classList.add('selected');
                        buildDayGrid(0);
                    }, 150);
                    return;
                }
            } else {
                nextIdx = currentIdx - 1;
                if (nextIdx < 0) {
                    // Go to prev week, select Sunday
                    weekOffset--;
                    updateWeek('prev');
                    setTimeout(() => {
                        const newCells = document.querySelectorAll('.day-cell');
                        newCells.forEach(c => c.classList.remove('selected'));
                        newCells[6].classList.add('selected');
                        buildDayGrid(6);
                    }, 150);
                    return;
                }
            }

            cells.forEach(c => c.classList.remove('selected'));
            cells[nextIdx].classList.add('selected');

            // Animate grid content
            const grid = document.getElementById('timeGrid');
            grid.style.opacity = '0';
            grid.style.transform = direction === 'next' ? 'translateX(-10px)' : 'translateX(10px)';
            setTimeout(() => {
                buildDayGrid(nextIdx);
                grid.style.opacity = '1';
                grid.style.transform = 'translateX(0)';
            }, 120);
        }
    });
})();

// ══════════════════════════════════════════
// ── Lesson Detail Sheet ──
// ══════════════════════════════════════════

const detailSheet = document.getElementById('detailSheet');
const detailOverlay = document.getElementById('sheetOverlay'); // reuse same overlay

// Demo data for lessons (maps to events on the calendar)
const DAY_NAMES_FULL = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
const lessonData = {
    'Алиса Козлова': { subject: 'Математика', price: '2 000', variant: 'indigo', initial: 'А', payment: 'pending', recurring: { days: [1, 3, 5], freq: 1, end: 'never' } },
    'Дима Морозов': { subject: 'Физика', price: '1 500', variant: 'orange', initial: 'Д', payment: 'pending', recurring: { days: [2, 4], freq: 1, end: 'count', count: 12 } },
    'Соня Волкова': { subject: 'Информатика', price: '1 800', variant: 'green', initial: 'С', payment: 'paid', recurring: null },
};

function openDetailSheet(eventInfo) {
    if (sheetOpen) return; // don't open if create-sheet is open
    if (detailOpen) return;

    const data = lessonData[eventInfo.name] || {
        subject: '—', price: '0', variant: 'indigo', initial: eventInfo.name[0], payment: 'pending'
    };

    // Fill content
    document.getElementById('detailAccent').className = 'detail-sheet-accent variant-' + data.variant;
    document.getElementById('detailAvatar').className = 'detail-student-avatar avatar-variant variant-' + data.variant;
    document.getElementById('detailAvatar').textContent = data.initial;
    document.getElementById('detailName').textContent = eventInfo.name;
    document.getElementById('detailSubject').textContent = data.subject;

    // Date (no time in main line)
    const dayName = DAY_NAMES_FULL[eventInfo.date.getDay()];
    const dayNum = eventInfo.date.getDate();
    const monthName = MONTHS_GEN[eventInfo.date.getMonth()];
    const hourStr = String(eventInfo.hour).padStart(2, '0');
    const endHour = String(eventInfo.hour + (eventInfo.duration || 1)).padStart(2, '0');
    document.getElementById('detailDate').textContent = `${dayName}, ${dayNum} ${monthName}`;
    document.getElementById('detailDuration').textContent = `${hourStr}:00 – ${endHour}:00 · ${eventInfo.duration || 1} ч`;

    // Payment
    document.getElementById('detailAmount').textContent = data.price;
    const badge = document.getElementById('detailBadge');
    badge.className = 'detail-payment-badge ' + data.payment;
    badge.textContent = data.payment === 'paid' ? 'Оплачено' : 'Ожидает оплаты';

    // Toggle paid button appearance via class
    const paidBtn = document.getElementById('detailBtnPaid');
    paidBtn.classList.toggle('is-paid', data.payment === 'paid');

    // Recurring info
    const editSeriesBtn = document.getElementById('detailEditSeriesBtn');
    const recurringBadge = document.getElementById('detailRecurringBadge');
    if (data.recurring) {
        editSeriesBtn.style.display = '';
        recurringBadge.style.display = '';
        const dayLabels = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
        const daysStr = data.recurring.days.map(d => dayLabels[d]).join(', ');
        const freqStr = data.recurring.freq === 1 ? 'каждую неделю' : `каждые ${data.recurring.freq} нед.`;
        document.getElementById('detailRecurringText').textContent = `${daysStr} · ${freqStr}`;
    } else {
        editSeriesBtn.style.display = 'none';
        recurringBadge.style.display = 'none';
    }

    // Store current event info for series editing
    detailSheet._currentEvent = eventInfo;
    detailSheet._currentData = data;

    // Make sure series edit mode is off
    exitSeriesEditMode(true);

    // Reschedule history (shown by default if exists)
    renderRescheduleHistory(eventInfo.name);

    // Open
    detailOpen = true;
    detailOverlay.classList.add('open');
    detailSheet.classList.add('open');
    fab.classList.add('rotated');
    document.body.style.overflow = 'hidden';
}

function closeDetailSheet() {
    if (!detailOpen) return;
    detailOpen = false;
    detailOverlay.classList.remove('open');
    detailSheet.classList.remove('open');
    fab.classList.remove('rotated');
    document.body.style.overflow = '';
    // Hide action forms
    document.querySelectorAll('.detail-action-form').forEach(f => {
        f.style.maxHeight = '0';
        f.classList.remove('open');
    });
    // Exit series edit mode if active
    if (seriesEditMode) exitSeriesEditMode(true);
}

// ── Cancel / Reschedule forms ──
const cancelForm = document.getElementById('cancelForm');
const rescheduleForm = document.getElementById('rescheduleForm');
const cancelReason = document.getElementById('cancelReason');
const rescheduleReason = document.getElementById('rescheduleReason');
const cancelCommentGroup = document.getElementById('cancelCommentGroup');
const rescheduleCommentGroup = document.getElementById('rescheduleCommentGroup');
let cancelReady = false;

function showActionForm(form) {
    form.classList.add('open');
    form.style.maxHeight = form.scrollHeight + 'px';
}

function hideActionForm(form) {
    form.style.maxHeight = '0';
    form.classList.remove('open');
}

function hideActionForms() {
    hideActionForm(cancelForm);
    hideActionForm(rescheduleForm);
    cancelReason.value = 'none';
    rescheduleReason.value = 'none';
    document.getElementById('cancelComment').value = '';
    document.getElementById('rescheduleComment').value = '';
    cancelCommentGroup.style.display = 'none';
    rescheduleCommentGroup.style.display = 'none';
    // Reset cancel button state
    cancelReady = false;
    const cBtn = document.getElementById('detailBtnCancel');
    cBtn.textContent = 'Отменить занятие';
    cBtn.classList.remove('confirm');
}

// Demo reschedule history
const rescheduleHistoryData = {
    'Алиса Козлова': [
        { from: 'пн, 3 марта · 09:00', to: 'ср, 5 марта · 10:00', reason: 'Просьба ученика' },
        { from: 'ср, 5 марта · 10:00', to: 'пт, 7 марта · 09:00', reason: 'Не могу провести' },
        { from: 'пт, 7 марта · 09:00', to: 'вс, 15 марта · 09:00', reason: 'Болезнь' }
    ],
    'Дима Морозов': [
        { from: 'вт, 11 марта · 11:00', to: 'чт, 13 марта · 14:00', reason: 'Просьба ученика' }
    ]
};

const rhSection = document.getElementById('rescheduleHistorySection');
const rhBody = document.getElementById('rescheduleHistoryBody');
const rhCount = document.getElementById('rhCount');
const rhChevron = document.getElementById('rhChevron');

function renderRescheduleHistory(studentName) {
    const items = rescheduleHistoryData[studentName];
    if (!items || items.length === 0) {
        rhSection.style.display = 'none';
        return;
    }
    rhSection.style.display = '';
    rhCount.textContent = items.length;

    rhBody.innerHTML = items.map(it => `
        <div class="reschedule-history-item">
            <svg class="reschedule-history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
            </svg>
            <div class="reschedule-history-text">
                <strong>${it.from}</strong> → <strong>${it.to}</strong>
                <span class="rh-reason">${it.reason}</span>
            </div>
        </div>
    `).join('');

    // Auto-expand if 1 item, collapse if 2+
    if (items.length <= 1) {
        expandRescheduleHistory();
    } else {
        collapseRescheduleHistory();
    }
}

function expandRescheduleHistory() {
    rhBody.classList.add('open');
    rhBody.style.maxHeight = rhBody.scrollHeight + 'px';
    rhChevron.classList.add('expanded');
}

function collapseRescheduleHistory() {
    rhBody.style.maxHeight = '0';
    rhBody.classList.remove('open');
    rhChevron.classList.remove('expanded');
}

document.getElementById('rescheduleHistoryToggle').addEventListener('click', () => {
    if (rhBody.classList.contains('open')) {
        collapseRescheduleHistory();
    } else {
        expandRescheduleHistory();
    }
});

// Cancel button — first click: show form + transform to confirm; second click: confirm cancel
const cancelBtn = document.getElementById('detailBtnCancel');

function resetCancelBtn() {
    cancelReady = false;
    cancelBtn.textContent = 'Отменить занятие';
    cancelBtn.classList.remove('confirm');
    hideActionForm(cancelForm);
}

// Cancel form close button — reset everything
document.getElementById('cancelFormClose').addEventListener('click', resetCancelBtn);

cancelBtn.addEventListener('click', function() {
    if (!cancelReady) {
        // First click — show reason form + transform button
        hideActionForm(rescheduleForm);
        cancelReady = true;
        this.textContent = 'Подтвердить отмену';
        this.classList.add('confirm');
        setTimeout(() => {
            showActionForm(cancelForm);
            cancelForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    } else {
        // Second click — confirm
        closeDetailSheet();
        hideActionForms();
        resetCancelBtn();
        showToast('Занятие отменено');
    }
});

// Cancel reason → show comment when "other"
cancelReason.addEventListener('change', function() {
    cancelCommentGroup.style.display = this.value === 'other' ? 'block' : 'none';
    if (cancelForm.classList.contains('open')) {
        setTimeout(() => cancelForm.style.maxHeight = cancelForm.scrollHeight + 'px', 10);
    }
});

// Reschedule button → show reschedule form
document.getElementById('detailBtnReschedule').addEventListener('click', function() {
    hideActionForms();
    setTimeout(() => {
        showActionForm(rescheduleForm);
        rescheduleForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
});

// Reschedule form close
document.getElementById('rescheduleFormClose').addEventListener('click', () => hideActionForm(rescheduleForm));

// Reschedule reason → show comment when "other"
rescheduleReason.addEventListener('change', function() {
    rescheduleCommentGroup.style.display = this.value === 'other' ? 'block' : 'none';
    if (rescheduleForm.classList.contains('open')) {
        setTimeout(() => rescheduleForm.style.maxHeight = rescheduleForm.scrollHeight + 'px', 10);
    }
});

// Reschedule confirm
document.getElementById('rescheduleConfirm').addEventListener('click', function() {
    closeDetailSheet();
    hideActionForms();
    setTimeout(() => {
        openSheet();
    }, 350);
});

// Paid button toggles payment status and badge
document.getElementById('detailBtnPaid').addEventListener('click', function() {
    const badge = document.getElementById('detailBadge');
    const isPaid = badge.classList.contains('pending');
    badge.className = 'detail-payment-badge ' + (isPaid ? 'paid' : 'pending');
    badge.textContent = isPaid ? 'Оплачено' : 'Ожидает оплаты';
    this.classList.toggle('is-paid', isPaid);
});

// Swipe-to-dismiss for detail sheet
(function() {
    let dStartY = 0, dCurrY = 0, dDragging = false;
    const dHandle = document.getElementById('detailHandle');

    dHandle.addEventListener('touchstart', (e) => {
        dStartY = e.touches[0].clientY;
        dDragging = true;
        detailSheet.style.transition = 'none';
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!dDragging) return;
        dCurrY = e.touches[0].clientY;
        const diff = dCurrY - dStartY;
        if (diff > 0) {
            detailSheet.style.transform = `translateX(-50%) translateY(${diff}px)`;
            detailOverlay.style.background = `rgba(10, 10, 18, ${Math.max(0, 0.45 - diff * 0.003)})`;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (!dDragging) return;
        dDragging = false;
        detailSheet.style.transition = '';
        detailOverlay.style.background = '';
        const diff = dCurrY - dStartY;
        if (diff > 100) {
            closeDetailSheet();
        } else {
            detailSheet.style.transform = '';
            if (detailOpen) detailSheet.classList.add('open');
        }
        dCurrY = 0;
        dStartY = 0;
    });
})();

// ── Attach click to WeekEvents (added dynamically in buildWeekGrid) ──
// We patch buildWeekGrid to add click handlers on week events
const _origBuildWeekGrid = buildWeekGrid;
buildWeekGrid = function() {
    _origBuildWeekGrid();

    // Attach click handlers to week events
    document.querySelectorAll('.week-event').forEach(evEl => {
        evEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = evEl.querySelector('.we-name')?.textContent || '';
            const timeText = evEl.querySelector('.we-time')?.textContent || '09:00';
            const hour = parseInt(timeText.split(':')[0]) || 9;
            const dayIndex = parseInt(evEl.closest('.week-cell')?.dataset.dayIndex || '0');

            const days = getWeekDates(weekOffset);
            const date = days[dayIndex] || new Date();

            // Resolve full name from first name
            let fullName = name;
            for (const key in lessonData) {
                if (key.startsWith(name) || key.split(' ')[0] === name) {
                    fullName = key;
                    break;
                }
            }

            openDetailSheet({ name: fullName, hour, duration: 1, date });
        });
    });
};

// ══════════════════════════════════════════
// ── Series Edit Mode ──
// ══════════════════════════════════════════

const seriesEditBlock = document.getElementById('seriesEditBlock');
const seriesConfirmOverlay = document.getElementById('seriesConfirmOverlay');

function enterSeriesEditMode() {
    seriesEditMode = true;
    detailSheet.classList.add('series-editing');

    // Populate edit fields from current recurring data
    const data = detailSheet._currentData;
    const eventInfo = detailSheet._currentEvent;
    if (data && data.recurring) {
        // Time
        const hourStr = String(eventInfo.hour).padStart(2, '0');
        document.getElementById('seriesTimeInput').value = hourStr + ':00';

        // Days
        const chips = document.querySelectorAll('#seriesWeekdayChips .wd-chip');
        chips.forEach(c => {
            const day = parseInt(c.dataset.day);
            c.classList.toggle('active', data.recurring.days.includes(day));
        });

        // Duration
        const durChips = document.querySelectorAll('#seriesDurationRow .dur-chip');
        const dur = (eventInfo.duration || 1) * 60;
        durChips.forEach(c => c.classList.toggle('active', parseInt(c.dataset.value) === dur));

        // Frequency
        document.getElementById('seriesFreqInput').value = data.recurring.freq || 1;

        // End condition
        const endSelect = document.getElementById('seriesEndSelect');
        endSelect.value = data.recurring.end || 'never';
        updateSeriesEndInputs();

        if (data.recurring.end === 'count' && data.recurring.count) {
            document.getElementById('seriesEndCountInput').value = data.recurring.count;
        }
    }

    // Animate open
    seriesEditBlock.classList.add('open');
    seriesEditBlock.style.maxHeight = seriesEditBlock.scrollHeight + 'px';

    // Scroll to top of detail sheet
    const body = detailSheet.querySelector('.detail-sheet-body');
    if (body) body.scrollTo({ top: 0, behavior: 'smooth' });
}

function exitSeriesEditMode(instant) {
    seriesEditMode = false;
    detailSheet.classList.remove('series-editing');

    if (instant) {
        seriesEditBlock.classList.remove('open');
        seriesEditBlock.style.maxHeight = '0';
    } else {
        seriesEditBlock.style.maxHeight = '0';
        setTimeout(() => seriesEditBlock.classList.remove('open'), 300);
    }
}

// Edit Series button
document.getElementById('detailEditSeriesBtn').addEventListener('click', () => {
    enterSeriesEditMode();
});

// Cancel series edit
document.getElementById('seriesEditCancel').addEventListener('click', () => {
    exitSeriesEditMode(false);
});

// Save series edit → show confirmation dialog
document.getElementById('seriesEditSave').addEventListener('click', () => {
    openSeriesConfirmDialog();
});

// Series weekday chips toggle
document.querySelectorAll('#seriesWeekdayChips .wd-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const activeChips = document.querySelectorAll('#seriesWeekdayChips .wd-chip.active');
        // Don't allow deselecting the last one
        if (chip.classList.contains('active') && activeChips.length <= 1) return;
        chip.classList.toggle('active');
    });
});

// Series duration chips + custom input
document.querySelectorAll('#seriesDurationRow .dur-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('#seriesDurationRow .dur-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const customInput = document.getElementById('seriesDurCustom');
        if (customInput) {
            customInput.value = '';
            customInput.parentElement.classList.remove('has-value');
        }
    });
});

// Series custom duration input
const seriesDurCustom = document.getElementById('seriesDurCustom');
if (seriesDurCustom) {
    seriesDurCustom.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value) {
            document.querySelectorAll('#seriesDurationRow .dur-chip').forEach(c => c.classList.remove('active'));
            this.parentElement.classList.add('has-value');
        } else {
            this.parentElement.classList.remove('has-value');
        }
    });
    seriesDurCustom.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('has-value');
            const activeChip = document.querySelector('#seriesDurationRow .dur-chip.active');
            if (!activeChip) {
                const defaultChip = document.querySelector('#seriesDurationRow .dur-chip[data-value="60"]');
                if (defaultChip) defaultChip.classList.add('active');
            }
        }
    });
}

// Series end select
function updateSeriesEndInputs() {
    const val = document.getElementById('seriesEndSelect').value;
    document.getElementById('seriesEndCountInput').style.display = val === 'count' ? '' : 'none';
    document.getElementById('seriesEndDateInput').style.display = val === 'date' ? '' : 'none';
}
document.getElementById('seriesEndSelect').addEventListener('change', updateSeriesEndInputs);
updateSeriesEndInputs();

// Series freq input — numbers only
document.getElementById('seriesFreqInput').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});
document.getElementById('seriesFreqInput').addEventListener('blur', function() {
    if (!this.value || parseInt(this.value) < 1) this.value = '1';
});

// ══════════════════════════════════════════
// ── Series Confirmation Dialog ──
// ══════════════════════════════════════════

function openSeriesConfirmDialog() {
    seriesConfirmOverlay.classList.add('open');
}

function closeSeriesConfirmDialog() {
    seriesConfirmOverlay.classList.remove('open');
}

// "Apply to all"
document.getElementById('seriesConfirmAll').addEventListener('click', () => {
    closeSeriesConfirmDialog();
    exitSeriesEditMode(false);
    setTimeout(() => {
        closeDetailSheet();
        showToast('Серия обновлена для всех занятий');
    }, 200);
});

// "Apply to this and future"
document.getElementById('seriesConfirmFuture').addEventListener('click', () => {
    closeSeriesConfirmDialog();
    exitSeriesEditMode(false);
    setTimeout(() => {
        closeDetailSheet();
        showToast('Серия обновлена с этого занятия');
    }, 200);
});

// Cancel dialog
document.getElementById('seriesConfirmCancel').addEventListener('click', closeSeriesConfirmDialog);

// Close dialog on overlay click
seriesConfirmOverlay.addEventListener('click', (e) => {
    if (e.target === seriesConfirmOverlay) closeSeriesConfirmDialog();
});

// ── Initialize with week view (matches active button in HTML) ──
setView('week');
