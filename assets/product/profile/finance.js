/* ══════════════════════════════════════════
   ── Finance — моки и логика ──
   ══════════════════════════════════════════ */

const SUMMARY = {
    income:  { value: '₽ 186 400', trend: '+12%' },
    pending: { value: '₽ 12 500',  trend: '3 платежа' },
    overdue: { value: '₽ 7 600',   trend: '2 клиента' },
};

const CLIENTS = [
    { id: 'c1', name: 'Анна Сергеева',   initial: 'А', variant: 'indigo' },
    { id: 'c2', name: 'Михаил Орлов',    initial: 'М', variant: 'orange' },
    { id: 'c3', name: 'Елена Ковалёва',  initial: 'Е', variant: 'green' },
    { id: 'c4', name: 'Пётр Гришин',     initial: 'П', variant: 'indigo' },
    { id: 'c5', name: 'София Лебедева',  initial: 'С', variant: 'orange' },
    { id: 'c6', name: 'Дмитрий Волков',  initial: 'Д', variant: 'green' },
];

const METHOD_LABEL = {
    cash:     'Наличные',
    transfer: 'Перевод',
    package:  'Пакет',
    card:     'Карта',
};

const STATUS_LABEL = {
    paid:    'Оплачено',
    pending: 'Ожидает',
    overdue: 'Просрочено',
};

// Транзакции. Даты группируются: 20 апр, 18 апр, 15 апр, 12 апр, 8 апр
const TXNS = [
    // 20 апреля (пн)
    { id: 'TX-2026-04-20-A8F3', clientId: 'c1', date: '2026-04-20', time: '14:30', amount: 15200, lessons: 8, method: 'transfer', status: 'paid' },
    { id: 'TX-2026-04-20-B2D1', clientId: 'c3', date: '2026-04-20', time: '11:15', amount: 3800,  lessons: 2, method: 'cash',     status: 'paid' },
    { id: 'TX-2026-04-20-C9E2', clientId: 'c2', date: '2026-04-20', time: '09:00', amount: 5700,  lessons: 3, method: 'transfer', status: 'pending' },

    // 18 апреля (сб)
    { id: 'TX-2026-04-18-D1A3', clientId: 'c4', date: '2026-04-18', time: '18:45', amount: 7600,  lessons: 4, method: 'package',  status: 'overdue' },
    { id: 'TX-2026-04-18-E4B7', clientId: 'c5', date: '2026-04-18', time: '16:20', amount: 3800,  lessons: 2, method: 'transfer', status: 'paid' },
    { id: 'TX-2026-04-18-F7C5', clientId: 'c6', date: '2026-04-18', time: '13:00', amount: 1900,  lessons: 1, method: 'cash',     status: 'paid' },

    // 15 апреля (ср)
    { id: 'TX-2026-04-15-G2H8', clientId: 'c1', date: '2026-04-15', time: '19:00', amount: 11400, lessons: 6, method: 'transfer', status: 'paid' },
    { id: 'TX-2026-04-15-H5K1', clientId: 'c2', date: '2026-04-15', time: '15:30', amount: 5700,  lessons: 3, method: 'card',     status: 'paid' },
    { id: 'TX-2026-04-15-I3L9', clientId: 'c3', date: '2026-04-15', time: '10:00', amount: 3800,  lessons: 2, method: 'transfer', status: 'pending' },

    // 12 апреля (вс)
    { id: 'TX-2026-04-12-J6M2', clientId: 'c5', date: '2026-04-12', time: '17:00', amount: 15200, lessons: 8, method: 'package',  status: 'paid' },
    { id: 'TX-2026-04-12-K8N7', clientId: 'c4', date: '2026-04-12', time: '14:00', amount: 3000,  lessons: 2, method: 'transfer', status: 'pending' },
    { id: 'TX-2026-04-12-L1P4', clientId: 'c6', date: '2026-04-12', time: '12:30', amount: 1900,  lessons: 1, method: 'cash',     status: 'paid' },

    // 8 апреля (ср)
    { id: 'TX-2026-04-08-M2Q6', clientId: 'c1', date: '2026-04-08', time: '20:00', amount: 7600,  lessons: 4, method: 'transfer', status: 'paid' },
    { id: 'TX-2026-04-08-N9R3', clientId: 'c3', date: '2026-04-08', time: '16:00', amount: 3800,  lessons: 2, method: 'card',     status: 'paid' },
    { id: 'TX-2026-04-08-O4S8', clientId: 'c2', date: '2026-04-08', time: '11:00', amount: 5700,  lessons: 3, method: 'cash',     status: 'paid' },
];

/* ══════════════════════════════════════════
   ── Состояние ──
   ══════════════════════════════════════════ */
const state = {
    period: 'month',
    status: 'all',
    openTxnId: null,
};

/* ══════════════════════════════════════════
   ── Форматтеры ──
   ══════════════════════════════════════════ */
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const WEEKDAYS_SHORT = ['вс','пн','вт','ср','чт','пт','сб'];

function fmtAmount(n) {
    return n.toLocaleString('ru-RU').replace(/\s/g, ' ');
}

function fmtPlus(n) {
    return `+ ${fmtAmount(n)} ₽`;
}

function fmtDateHeader(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = MONTHS_GEN[d.getMonth()];
    const wd = WEEKDAYS_SHORT[d.getDay()];
    return `${day} ${month}, ${wd}`;
}

function getClient(id) {
    return CLIENTS.find(c => c.id === id);
}

/* ══════════════════════════════════════════
   ── Фильтрация ──
   ══════════════════════════════════════════ */
function filterTxns() {
    const now = new Date('2026-04-20');
    const startDate = new Date(now);
    switch (state.period) {
        case 'today':    startDate.setDate(now.getDate());      break;
        case 'week':     startDate.setDate(now.getDate() - 7);  break;
        case 'month':    startDate.setDate(now.getDate() - 30); break;
        case 'quarter':  startDate.setDate(now.getDate() - 90); break;
        case 'all':      startDate.setFullYear(2000);           break;
    }

    return TXNS.filter(t => {
        const d = new Date(t.date);
        if (state.period === 'today') {
            if (t.date !== '2026-04-20') return false;
        } else if (d < startDate) {
            return false;
        }
        if (state.status !== 'all' && t.status !== state.status) return false;
        return true;
    });
}

/* ══════════════════════════════════════════
   ── Рендер ──
   ══════════════════════════════════════════ */
function renderSummary() {
    const sumIncome = document.getElementById('sumIncome');
    const sumPending = document.getElementById('sumPending');
    const sumOverdue = document.getElementById('sumOverdue');
    if (sumIncome)  sumIncome.textContent  = SUMMARY.income.value;
    if (sumPending) sumPending.textContent = SUMMARY.pending.value;
    if (sumOverdue) sumOverdue.textContent = SUMMARY.overdue.value;
}

function renderGroups() {
    const container = document.getElementById('finGroups');
    const empty = document.getElementById('finEmpty');
    const filtered = filterTxns();

    if (!filtered.length) {
        container.innerHTML = '';
        empty.style.display = 'flex';
        return;
    }
    empty.style.display = 'none';

    // Группируем по дате
    const byDate = {};
    filtered.forEach(t => {
        (byDate[t.date] = byDate[t.date] || []).push(t);
    });
    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

    const html = sortedDates.map(date => {
        const items = byDate[date];
        const total = items.reduce((sum, t) => sum + (t.status === 'paid' ? t.amount : 0), 0);
        const totalStr = total > 0 ? `+ ${fmtAmount(total)} ₽` : '—';

        const rows = items.map(t => {
            const client = getClient(t.clientId);
            const badgeCls = `fin-badge-${t.status}`;
            const metaStr = `${t.lessons} занят${t.lessons === 1 ? 'ие' : t.lessons < 5 ? 'ия' : 'ий'} · ${METHOD_LABEL[t.method]} · ${t.time}`;
            return `
                <div class="txn-row" data-txn-id="${t.id}">
                    <div class="avatar-variant variant-${client.variant} txn-avatar">${client.initial}</div>
                    <div class="txn-mid">
                        <div class="txn-name">${client.name}</div>
                        <div class="txn-meta txn-meta-mono">${metaStr}</div>
                    </div>
                    <div class="txn-right">
                        <div class="txn-amount">${fmtPlus(t.amount)}</div>
                        <span class="fin-badge ${badgeCls}">${STATUS_LABEL[t.status]}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="fin-txn-group">
                <div class="fin-date-header">
                    <span class="fin-date-header-title">${fmtDateHeader(date)}</span>
                    <span class="fin-date-header-total">${totalStr}</span>
                </div>
                <div class="txn-list-wrap">${rows}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;

    container.querySelectorAll('.txn-row').forEach(row => {
        row.addEventListener('click', () => openTxnSheet(row.dataset.txnId));
    });
}

/* ══════════════════════════════════════════
   ── Фильтры: клики ──
   ══════════════════════════════════════════ */
function initFilters() {
    const filters = document.getElementById('finFilters');
    filters.addEventListener('click', e => {
        const chip = e.target.closest('.picker-chip');
        if (!chip) return;

        if (chip.dataset.period) {
            filters.querySelectorAll('[data-period]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.period = chip.dataset.period;
        } else if (chip.dataset.status) {
            filters.querySelectorAll('[data-status]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.status = chip.dataset.status;
        }
        renderGroups();
    });

    const resetBtn = document.getElementById('btnResetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.period = 'month';
            state.status = 'all';
            filters.querySelectorAll('[data-period]').forEach(c => c.classList.toggle('active', c.dataset.period === 'month'));
            filters.querySelectorAll('[data-status]').forEach(c => c.classList.toggle('active', c.dataset.status === 'all'));
            renderGroups();
        });
    }

    const exportBtn = document.getElementById('btnExport');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => showToast('Экспорт начат'));
    }
}

/* ══════════════════════════════════════════
   ── Txn Detail Sheet ──
   ══════════════════════════════════════════ */
function openTxnSheet(txnId) {
    const txn = TXNS.find(t => t.id === txnId);
    if (!txn) return;
    state.openTxnId = txnId;

    const client = getClient(txn.clientId);

    // Amount
    const amountEl = document.getElementById('detailAmount');
    amountEl.textContent = fmtPlus(txn.amount);
    amountEl.classList.remove('amount-paid', 'amount-pending', 'amount-overdue');
    amountEl.classList.add(`amount-${txn.status}`);

    // Client
    const avatar = document.getElementById('detailAvatar');
    avatar.className = `fin-detail-avatar avatar-variant variant-${client.variant}`;
    avatar.textContent = client.initial;
    document.getElementById('detailClient').textContent = client.name;
    document.getElementById('detailDate').textContent = `${fmtDateHeader(txn.date)} · ${txn.time}`;

    // Badge top
    const topBadge = document.getElementById('detailBadge');
    topBadge.className = `fin-badge fin-badge-${txn.status}`;
    topBadge.textContent = STATUS_LABEL[txn.status];

    // Details
    document.getElementById('detailClientName').textContent = client.name;
    document.getElementById('detailMethod').textContent = METHOD_LABEL[txn.method];
    document.getElementById('detailLessons').textContent = String(txn.lessons);
    const statusPill = document.getElementById('detailStatusPill');
    statusPill.className = `fin-badge fin-badge-${txn.status}`;
    statusPill.textContent = STATUS_LABEL[txn.status];
    document.getElementById('detailTxnId').textContent = txn.id;

    // Action button
    const action = document.getElementById('btnDetailAction');
    action.classList.remove('action-danger', 'action-remind');
    if (txn.status === 'pending') {
        action.textContent = 'Отметить как «Оплачено»';
    } else if (txn.status === 'paid') {
        action.textContent = 'Отметить возврат';
        action.classList.add('action-danger');
    } else if (txn.status === 'overdue') {
        action.textContent = 'Напомнить';
        action.classList.add('action-remind');
    }

    // Open
    document.getElementById('sheetOverlay').classList.add('active');
    document.getElementById('txnSheet').classList.add('open');
}

function closeTxnSheet() {
    document.getElementById('sheetOverlay').classList.remove('active');
    document.getElementById('txnSheet').classList.remove('open');
    state.openTxnId = null;
}

function initSheet() {
    document.getElementById('sheetOverlay').addEventListener('click', closeTxnSheet);
    document.getElementById('txnHandle').addEventListener('click', closeTxnSheet);

    document.getElementById('btnDetailAction').addEventListener('click', () => {
        const txn = TXNS.find(t => t.id === state.openTxnId);
        if (!txn) return;
        if (txn.status === 'pending') {
            txn.status = 'paid';
            showToast('Платёж отмечен как оплаченный');
        } else if (txn.status === 'paid') {
            showToast('Возврат отмечен');
        } else if (txn.status === 'overdue') {
            showToast('Напоминание отправлено');
        }
        closeTxnSheet();
        renderGroups();
    });
}

/* ══════════════════════════════════════════
   ── Toast ──
   ══════════════════════════════════════════ */
let toastTimer = null;
function showToast(text) {
    const toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ══════════════════════════════════════════
   ── Init ──
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    renderSummary();
    renderGroups();
    initFilters();
    initSheet();
});
