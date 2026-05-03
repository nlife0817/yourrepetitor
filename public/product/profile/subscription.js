/* Subscription page — preview/mock */

// ─────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────
const SUBSCRIPTIONS = {
    active: {
        status: 'active',
        nextCharge: '20.05.2026',
        amount: 300,
        method: 'Карта Сбер ***4321',
        daysLeft: 30
    },
    trial: {
        status: 'trial',
        trialDaysTotal: 14,
        trialDaysLeft: 9,
        amount: 300,
        method: 'Не привязана',
        endDate: '29.04.2026'
    },
    expiring: {
        status: 'expiring',
        nextCharge: '23.04.2026',
        amount: 300,
        method: 'Карта Сбер ***4321',
        daysLeft: 2
    },
    expired: {
        status: 'expired',
        endedAt: '17.04.2026',
        graceDaysLeft: 3,
        amount: 300,
        method: 'Карта Сбер ***4321'
    }
};

const HISTORY = [
    { date: '20.03.26', method: 'Карта Сбер ***4321', amount: 300, status: 'paid' },
    { date: '20.02.26', method: 'Карта Сбер ***4321', amount: 300, status: 'paid' },
    { date: '20.01.26', method: 'Карта Сбер ***4321', amount: 300, status: 'paid' },
    { date: '20.12.25', method: 'Карта Тинькофф ***8812', amount: 300, status: 'failed' },
    { date: '21.12.25', method: 'Карта Тинькофф ***8812', amount: 300, status: 'paid' },
    { date: '20.11.25', method: 'Карта Тинькофф ***8812', amount: 300, status: 'paid' },
    { date: '20.10.25', method: 'Карта Тинькофф ***8812', amount: 300, status: 'paid' }
];

// ─────────────────────────────────────────
// DOM refs
// ─────────────────────────────────────────
const $hero = document.getElementById('subHero');
const $statusLabel = document.getElementById('subStatusLabel');
const $heroSub = document.getElementById('subHeroSublabel');
const $heroMain = document.getElementById('subHeroMain');
const $heroPrice = document.getElementById('subHeroPrice');
const $methodText = document.getElementById('subMethodText');
const $cta = document.getElementById('subHeroCta');
const $warning = document.getElementById('subWarning');
const $warningTitle = document.getElementById('subWarningTitle');
const $warningText = document.getElementById('subWarningText');
const $historyList = document.getElementById('subHistory');
const $demoRow = document.getElementById('subDemoRow');
const $toast = document.getElementById('subToast');
const $toastText = document.getElementById('subToastText');
const $confirmOverlay = document.getElementById('subConfirmOverlay');
const $btnConfirmCancel = document.getElementById('btnConfirmCancel');
const $btnConfirmOk = document.getElementById('btnConfirmOk');
const $btnCancel = document.getElementById('btnCancel');
const $btnChangeMethod = document.getElementById('btnChangeMethod');
const $btnAllHistory = document.getElementById('btnAllHistory');

// ─────────────────────────────────────────
// Render hero
// ─────────────────────────────────────────
function renderHero(state) {
    $hero.setAttribute('data-status', state);
    const data = SUBSCRIPTIONS[state];

    $warning.hidden = true;
    $warning.classList.remove('sub-warning-banner--danger');

    switch (state) {
        case 'active':
            $statusLabel.textContent = 'АКТИВНА';
            $heroSub.textContent = 'Следующее списание';
            $heroMain.innerHTML = data.nextCharge;
            $heroPrice.innerHTML = `${data.amount} ₽<span class="sub-hero-price-sub">/мес</span>`;
            $methodText.textContent = data.method;
            $cta.textContent = 'Продлить';
            break;

        case 'trial':
            $statusLabel.textContent = 'ПРОБНЫЙ ПЕРИОД';
            $heroSub.textContent = `${data.trialDaysTotal} дней пробного периода`;
            $heroMain.innerHTML = `Осталось ${data.trialDaysLeft} ${pluralDays(data.trialDaysLeft)}<span class="sub-hero-main-sub">До ${data.endDate}</span>`;
            $heroPrice.innerHTML = `${data.amount} ₽<span class="sub-hero-price-sub">/мес после</span>`;
            $methodText.textContent = data.method;
            $cta.textContent = 'Оплатить подписку';
            break;

        case 'expiring':
            $statusLabel.textContent = 'ИСТЕКАЕТ СКОРО';
            $heroSub.textContent = 'Следующее списание';
            $heroMain.innerHTML = `${data.nextCharge}<span class="sub-hero-main-sub">Осталось ${data.daysLeft} ${pluralDays(data.daysLeft)}</span>`;
            $heroPrice.innerHTML = `${data.amount} ₽<span class="sub-hero-price-sub">/мес</span>`;
            $methodText.textContent = data.method;
            $cta.textContent = 'Продлить';

            $warning.hidden = false;
            $warningTitle.textContent = 'Подписка истекает';
            $warningText.textContent = `Осталось ${data.daysLeft} ${pluralDays(data.daysLeft)} до окончания. Продлите, чтобы не потерять доступ.`;
            break;

        case 'expired':
            $statusLabel.textContent = 'ИСТЕКЛА';
            $heroSub.textContent = 'Доступ истёк';
            $heroMain.innerHTML = `${data.endedAt}<span class="sub-hero-main-sub">Период ожидания: ${data.graceDaysLeft} ${pluralDays(data.graceDaysLeft)}</span>`;
            $heroPrice.innerHTML = `${data.amount} ₽<span class="sub-hero-price-sub">/мес</span>`;
            $methodText.textContent = data.method;
            $cta.textContent = 'Оплатить';

            $warning.hidden = false;
            $warning.classList.add('sub-warning-banner--danger');
            $warningTitle.textContent = 'Доступ ограничен';
            $warningText.textContent = 'Оплатите подписку в течение grace-периода, чтобы сохранить все данные.';
            break;
    }
}

// ─────────────────────────────────────────
// Render history
// ─────────────────────────────────────────
function renderHistory() {
    $historyList.innerHTML = HISTORY.slice(0, 6).map((h, i) => {
        const dotCls = h.status === 'paid' ? 'sub-row-dot--paid' : 'sub-row-dot--failed';
        const badgeCls = h.status === 'paid' ? 'sub-badge--paid' : 'sub-badge--failed';
        const badgeText = h.status === 'paid' ? 'Оплачено' : 'Ошибка';
        return `
            <div class="sub-row" style="animation-delay:${i * 0.03}s">
                <span class="sub-row-date">${h.date}</span>
                <span class="sub-row-dot ${dotCls}"></span>
                <span class="sub-row-method">${h.method}</span>
                <div class="sub-row-right">
                    <span class="sub-row-amount">${h.amount} ₽</span>
                    <span class="sub-badge ${badgeCls}">${badgeText}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
function pluralDays(n) {
    const abs = Math.abs(n) % 100;
    const n1 = abs % 10;
    if (abs > 10 && abs < 20) return 'дней';
    if (n1 > 1 && n1 < 5) return 'дня';
    if (n1 === 1) return 'день';
    return 'дней';
}

function showToast(text) {
    $toastText.textContent = text;
    $toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => $toast.classList.remove('show'), 2200);
}

// ─────────────────────────────────────────
// Demo chip handling
// ─────────────────────────────────────────
$demoRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.sub-demo-chip');
    if (!chip) return;
    const state = chip.dataset.demo;
    $demoRow.querySelectorAll('.sub-demo-chip').forEach(c => {
        const on = c === chip;
        c.classList.toggle('active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    renderHero(state);
});

// ─────────────────────────────────────────
// CTA / actions
// ─────────────────────────────────────────
$cta.addEventListener('click', () => {
    const state = $hero.getAttribute('data-status');
    if (state === 'trial') {
        showToast('Переход к оплате...');
    } else {
        showToast('Подписка продлена');
    }
});

$btnChangeMethod.addEventListener('click', () => {
    showToast('Открываем способы оплаты');
});

$btnAllHistory.addEventListener('click', () => {
    showToast('История списаний');
});

// ─────────────────────────────────────────
// Cancel with double-confirm
// ─────────────────────────────────────────
let cancelArmed = false;
let cancelArmTimer = null;

$btnCancel.addEventListener('click', () => {
    if (!cancelArmed) {
        cancelArmed = true;
        const span = $btnCancel.querySelector('span');
        const prev = span.textContent;
        span.textContent = 'Нажмите ещё раз для подтверждения';
        clearTimeout(cancelArmTimer);
        cancelArmTimer = setTimeout(() => {
            cancelArmed = false;
            span.textContent = prev;
        }, 2500);
        return;
    }
    cancelArmed = false;
    clearTimeout(cancelArmTimer);
    $btnCancel.querySelector('span').textContent = 'Отменить подписку';
    openConfirm();
});

function openConfirm() {
    $confirmOverlay.hidden = false;
}
function closeConfirm() {
    $confirmOverlay.hidden = true;
}

$btnConfirmCancel.addEventListener('click', closeConfirm);
$btnConfirmOk.addEventListener('click', () => {
    closeConfirm();
    showToast('Подписка отменена');
});
$confirmOverlay.addEventListener('click', (e) => {
    if (e.target === $confirmOverlay) closeConfirm();
});

// ─────────────────────────────────────────
// Init
// ─────────────────────────────────────────
renderHero('active');
renderHistory();
