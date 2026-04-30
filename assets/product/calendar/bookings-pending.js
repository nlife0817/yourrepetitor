// Bookings pending — tutor view

// ═══════════════════════════════════════════════════
// Mock data
// ═══════════════════════════════════════════════════
const BOOKINGS = [
    {
        id: 'b1',
        name: 'Анна Смирнова',
        initial: 'А',
        variant: 'indigo',
        subject: 'Математика',
        createdAt: Date.now() - 1000 * 60 * 18, // 18 minutes ago
        lessonAt: Date.now() + 1000 * 60 * 60 * 2, // in 2 hours
        dateLabel: '20 апреля (вс), 18:00–19:00',
        place: 'Онлайн',
        placeIcon: 'video',
        amount: '1 900 ₽',
        template: 'по шаблону «Индивидуальное»',
        comment: 'Здравствуйте! Хочу разобрать задачи на производные, завтра контрольная. Могу подготовить список вопросов заранее, если удобно.',
    },
    {
        id: 'b2',
        name: 'Максим Орлов',
        initial: 'М',
        variant: 'orange',
        subject: 'Физика',
        createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4h ago
        lessonAt: Date.now() + 1000 * 60 * 60 * 24, // tomorrow
        dateLabel: '21 апреля (пн), 16:00–17:30',
        place: 'У ученика (ул. Ленина, 14, кв. 32)',
        placeIcon: 'map-pin',
        amount: '2 400 ₽',
        template: 'по шаблону «Выезд»',
        comment: 'Нужно подтянуть механику к ЕГЭ.',
    },
    {
        id: 'b3',
        name: 'Софья Петрова',
        initial: 'С',
        variant: 'green',
        subject: 'Английский',
        createdAt: Date.now() - 1000 * 60 * 60 * 20, // 20h ago
        lessonAt: Date.now() + 1000 * 60 * 60 * 24 * 3, // in 3 days
        dateLabel: '23 апреля (ср), 10:00–11:00',
        place: 'Онлайн',
        placeIcon: 'video',
        amount: '1 500 ₽',
        template: 'по шаблону «Пробный урок»',
        comment: '',
    },
    {
        id: 'b4',
        name: 'Илья Захаров',
        initial: 'И',
        variant: 'indigo',
        subject: 'Информатика',
        createdAt: Date.now() - 1000 * 60 * 60 * 36,
        lessonAt: Date.now() + 1000 * 60 * 60 * 24 * 5,
        dateLabel: '25 апреля (пт), 19:00–20:30',
        place: 'Онлайн',
        placeIcon: 'video',
        amount: '2 100 ₽',
        template: 'по шаблону «Индивидуальное»',
        comment: 'Хочется подготовиться к олимпиаде, уровень — базовый Python. Также интересует задача по рекурсии из прошлого вебинара.',
    },
    {
        id: 'b5',
        name: 'Дарья Ким',
        initial: 'Д',
        variant: 'orange',
        subject: 'Математика',
        createdAt: Date.now() - 1000 * 60 * 55,
        lessonAt: Date.now() + 1000 * 60 * 60 * 6,
        dateLabel: '20 апреля (вс), 22:00–23:00',
        place: 'Онлайн',
        placeIcon: 'video',
        amount: '1 700 ₽',
        template: 'по шаблону «Интенсив»',
        comment: '',
    },
];

let state = {
    bookings: [...BOOKINGS],
    sort: 'new',
    rejectingId: null,
    selectedReason: null,
};

// ═══════════════════════════════════════════════════
// Icons (inline SVG helpers)
// ═══════════════════════════════════════════════════
const ICONS = {
    calendar: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    video: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    'map-pin': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};

// ═══════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════
function formatRelativeLesson(ts) {
    const diff = ts - Date.now();
    const hours = Math.round(diff / (1000 * 60 * 60));
    if (hours < 1) return 'менее часа';
    if (hours < 24) return `через ${hours} ${pluralHours(hours)}`;
    const days = Math.round(hours / 24);
    if (days === 1) return 'завтра';
    if (days < 5) return `через ${days} ${pluralDays(days)}`;
    return `через ${days} дн.`;
}

function pluralHours(n) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'час';
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'часа';
    return 'часов';
}

function pluralDays(n) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'день';
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дня';
    return 'дней';
}

function sortBookings(list, mode) {
    const copy = [...list];
    if (mode === 'new') copy.sort((a, b) => b.createdAt - a.createdAt);
    else if (mode === 'old') copy.sort((a, b) => a.createdAt - b.createdAt);
    else if (mode === 'lesson') copy.sort((a, b) => a.lessonAt - b.lessonAt);
    return copy;
}

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ═══════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════
function render() {
    const list = document.getElementById('bkpList');
    const empty = document.getElementById('bkpEmpty');
    const sub = document.getElementById('bkpHeaderSub');
    const sortRow = document.getElementById('bkpSortRow');
    const countBadge = document.getElementById('bkpCountBadge');

    countBadge.textContent = state.bookings.length;

    if (state.bookings.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'flex';
        sub.style.display = 'none';
        sortRow.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    sub.style.display = 'flex';
    sortRow.style.display = 'flex';

    const sorted = sortBookings(state.bookings, state.sort);

    list.innerHTML = sorted.map((b, i) => {
        const placeIcon = ICONS[b.placeIcon] || ICONS.video;
        const hasComment = !!b.comment && b.comment.length > 0;
        const isLongComment = hasComment && b.comment.length > 90;
        return `
            <div class="booking-card" data-id="${b.id}" style="animation-delay: ${i * 0.04}s">
                <div class="bkp-card-top">
                    <div class="bkp-card-avatar avatar-variant variant-${b.variant}">${escapeHtml(b.initial)}</div>
                    <div class="bkp-card-who">
                        <div class="bkp-card-name">${escapeHtml(b.name)}</div>
                        <div class="bkp-card-when">${formatRelativeLesson(b.lessonAt)}</div>
                    </div>
                    <span class="bkp-card-subject variant-${b.variant}">${escapeHtml(b.subject)}</span>
                </div>

                <div class="bkp-card-details">
                    <div class="bkp-detail-row">
                        ${ICONS.calendar}
                        <span class="bkp-detail-date">${escapeHtml(b.dateLabel)}</span>
                    </div>
                    <div class="bkp-detail-row">
                        ${placeIcon}
                        <span class="bkp-detail-place">${escapeHtml(b.place)}</span>
                    </div>
                </div>

                <div class="bkp-card-amount">
                    <span class="bkp-amount-value">${escapeHtml(b.amount)}</span>
                    <span class="bkp-amount-template">${escapeHtml(b.template)}</span>
                </div>

                ${hasComment ? `
                    <div class="bkp-comment-wrap">
                        <div class="bkp-card-comment${isLongComment ? ' truncated' : ''}" data-comment-id="${b.id}">${escapeHtml(b.comment)}</div>
                        ${isLongComment ? `<button class="bkp-comment-toggle" data-toggle-id="${b.id}">Показать</button>` : ''}
                    </div>
                ` : ''}

                <div class="bkp-card-actions">
                    <button class="bkp-btn-reject" data-action="reject" data-id="${b.id}">Отклонить</button>
                    <button class="bkp-btn-approve" data-action="approve" data-id="${b.id}">Подтвердить</button>
                </div>
            </div>
        `;
    }).join('');

    // Handle comment fade-out colour: need to match card bg (surface = #fff), but CSS uses --bg. Override inline.
    list.querySelectorAll('.bkp-card-comment').forEach((el) => {
        el.style.setProperty('--_fade', 'linear-gradient(to top, rgba(240,240,238,1), rgba(240,240,238,0))');
    });

    attachCardHandlers();
}

function attachCardHandlers() {
    document.querySelectorAll('[data-action="approve"]').forEach((btn) => {
        btn.addEventListener('click', onApproveClick);
    });
    document.querySelectorAll('[data-action="reject"]').forEach((btn) => {
        btn.addEventListener('click', onRejectClick);
    });
    document.querySelectorAll('[data-toggle-id]').forEach((btn) => {
        btn.addEventListener('click', onCommentToggle);
    });
}

// ═══════════════════════════════════════════════════
// Approve flow (double-confirm)
// ═══════════════════════════════════════════════════
function onApproveClick(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    if (!btn.classList.contains('confirming')) {
        // First click: arm confirmation
        resetAllConfirming();
        btn.classList.add('confirming');
        btn.textContent = 'Одобрить?';
        // Auto-reset after 4s
        btn._timeout = setTimeout(() => {
            btn.classList.remove('confirming');
            btn.textContent = 'Подтвердить';
            btn._timeout = null;
        }, 4000);
    } else {
        // Second click: confirm
        if (btn._timeout) { clearTimeout(btn._timeout); btn._timeout = null; }
        approveBooking(id);
    }
}

function resetAllConfirming() {
    document.querySelectorAll('.bkp-btn-approve.confirming').forEach((b) => {
        if (b._timeout) { clearTimeout(b._timeout); b._timeout = null; }
        b.classList.remove('confirming');
        b.textContent = 'Подтвердить';
    });
}

function approveBooking(id) {
    removeCardWithAnim(id, () => {
        state.bookings = state.bookings.filter((b) => b.id !== id);
        showToast('Заявка одобрена');
        render();
    });
}

function removeCardWithAnim(id, done) {
    const card = document.querySelector(`.booking-card[data-id="${id}"]`);
    if (!card) { done && done(); return; }
    card.classList.add('removing');
    setTimeout(() => { done && done(); }, 380);
}

// ═══════════════════════════════════════════════════
// Reject flow (sheet)
// ═══════════════════════════════════════════════════
function onRejectClick(e) {
    const id = e.currentTarget.dataset.id;
    state.rejectingId = id;
    state.selectedReason = null;
    const booking = state.bookings.find((b) => b.id === id);
    if (!booking) return;

    // Populate compact card
    const compact = document.getElementById('rejectLessonCompact');
    compact.innerHTML = `
        <div class="bkp-card-avatar avatar-variant variant-${booking.variant}">${escapeHtml(booking.initial)}</div>
        <div class="bkp-lesson-compact-info">
            <div class="bkp-lesson-compact-name">${escapeHtml(booking.name)}</div>
            <div class="bkp-lesson-compact-meta">${escapeHtml(booking.dateLabel)}</div>
        </div>
    `;

    // Reset radios & textarea
    document.querySelectorAll('input[name="rejectReason"]').forEach((r) => (r.checked = false));
    const taWrap = document.getElementById('reasonTextareaWrap');
    taWrap.classList.remove('open');
    taWrap.style.maxHeight = '';
    document.getElementById('reasonTextarea').value = '';

    openSheet();
}

function openSheet() {
    document.getElementById('sheetOverlay').classList.add('active');
    document.getElementById('rejectSheet').classList.add('open');
}

function closeSheet() {
    document.getElementById('sheetOverlay').classList.remove('active');
    document.getElementById('rejectSheet').classList.remove('open');
    state.rejectingId = null;
}

function onReasonChange(e) {
    state.selectedReason = e.target.value;
    const taWrap = document.getElementById('reasonTextareaWrap');
    if (state.selectedReason === 'other') {
        taWrap.classList.add('open');
        taWrap.style.maxHeight = '200px';
        setTimeout(() => document.getElementById('reasonTextarea').focus(), 220);
    } else {
        taWrap.classList.remove('open');
        taWrap.style.maxHeight = '0';
    }
}

function confirmReject() {
    const id = state.rejectingId;
    if (!id) return;
    closeSheet();
    setTimeout(() => {
        removeCardWithAnim(id, () => {
            state.bookings = state.bookings.filter((b) => b.id !== id);
            showToast('Заявка отклонена');
            render();
        });
    }, 300);
}

// ═══════════════════════════════════════════════════
// Comment expand
// ═══════════════════════════════════════════════════
function onCommentToggle(e) {
    const id = e.currentTarget.dataset.toggleId;
    const comment = document.querySelector(`.bkp-card-comment[data-comment-id="${id}"]`);
    if (!comment) return;
    const expanded = comment.classList.toggle('expanded');
    e.currentTarget.textContent = expanded ? 'Свернуть' : 'Показать';
}

// ═══════════════════════════════════════════════════
// Sort chips
// ═══════════════════════════════════════════════════
function onSortClick(e) {
    const chip = e.currentTarget;
    const mode = chip.dataset.sort;
    if (mode === state.sort) return;
    state.sort = mode;
    document.querySelectorAll('.bkp-sort-chip').forEach((c) => c.classList.toggle('active', c.dataset.sort === mode));
    render();
}

// ═══════════════════════════════════════════════════
// Toast
// ═══════════════════════════════════════════════════
let toastTimer = null;
function showToast(text) {
    const toast = document.getElementById('bkpToast');
    document.getElementById('bkpToastText').textContent = text;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ═══════════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    render();

    // Sort chips
    document.querySelectorAll('.bkp-sort-chip').forEach((c) => c.addEventListener('click', onSortClick));

    // Reason radios
    document.querySelectorAll('input[name="rejectReason"]').forEach((r) => r.addEventListener('change', onReasonChange));

    // Sheet actions
    document.getElementById('btnRejectCancel').addEventListener('click', closeSheet);
    document.getElementById('btnRejectConfirm').addEventListener('click', confirmReject);
    document.getElementById('sheetOverlay').addEventListener('click', closeSheet);

    // Sheet handle basic tap-to-close (swipe would require more code; overlay tap suffices)
    document.getElementById('rejectHandle').addEventListener('click', closeSheet);
});
