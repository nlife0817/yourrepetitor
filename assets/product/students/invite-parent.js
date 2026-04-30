/* ══════════════════════════════════════════
   ── InviteParentSheet: mock interactions ──
   ══════════════════════════════════════════ */

const STUDENT = {
    name: 'Анна Иванова',
    firstName: 'Анной',
    subject: 'Математика',
    lessons: 8,
    initial: 'А',
    variant: 'variant-indigo',
};

const INVITE_LINK = 'https://t.me/tutorflow_bot?start=parent_a1b2c3';

// ── DOM refs ──
const $ = (id) => document.getElementById(id);

const overlay = $('invOverlay');
const sheet = $('invSheet');
const handleArea = $('invHandle');
const closeBtn = $('invCloseBtn');
const closeFooterBtn = $('invCloseFooter');

const studentAvatar = $('invStudentAvatar');
const studentName = $('invStudentName');
const studentMeta = $('invStudentMeta');
const hintName = $('invHintName');

const pills = document.querySelectorAll('.inv-format-pill');
const tgPanel = $('invTgPanel');
const emailPanel = $('invEmailPanel');

const linkInput = $('invLinkInput');
const copyBtn = $('invCopyBtn');
const shareTgBtn = $('invShareTgBtn');

const emailInput = $('invEmailInput');
const emailSubmit = $('invEmailSubmit');

const permsHeader = $('invPermsHeader');
const permsList = $('invPermsList');

const toast = $('invToast');
const toastText = $('invToastText');

// ── Hydrate student context ──
studentAvatar.textContent = STUDENT.initial;
studentAvatar.classList.remove('variant-indigo', 'variant-orange', 'variant-green');
studentAvatar.classList.add(STUDENT.variant);
studentName.textContent = STUDENT.name;
studentMeta.textContent = `${STUDENT.subject} · ${STUDENT.lessons} занятий`;
hintName.textContent = STUDENT.firstName;
linkInput.value = INVITE_LINK;

// ── Close handlers ──
function closeSheet() {
    sheet.classList.remove('open');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
}
overlay.addEventListener('click', closeSheet);
closeBtn.addEventListener('click', closeSheet);
closeFooterBtn.addEventListener('click', closeSheet);
handleArea.addEventListener('click', (e) => {
    if (e.target === handleArea || e.target.classList.contains('sheet-handle')) {
        closeSheet();
    }
});

// ── Format pills switch ──
pills.forEach((pill) => {
    pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        const method = pill.dataset.method;
        if (method === 'telegram') {
            tgPanel.classList.remove('hidden');
            emailPanel.classList.add('hidden');
        } else {
            tgPanel.classList.add('hidden');
            emailPanel.classList.remove('hidden');
        }
    });
});

// ── Copy link ──
let copyTimer = null;
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(INVITE_LINK);
    } catch (e) {
        // fallback: select + execCommand
        linkInput.select();
        try { document.execCommand('copy'); } catch (_) {}
    }
    copyBtn.classList.add('copied');
    copyBtn.setAttribute('aria-label', 'Скопировано');
    showToast('Ссылка скопирована');

    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.setAttribute('aria-label', 'Копировать ссылку');
    }, 2000);
});

// ── Share in Telegram (mock) ──
shareTgBtn.addEventListener('click', () => {
    alert('Открывается Telegram...');
});

// ── Email submit ──
function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

emailSubmit.addEventListener('click', () => {
    const val = emailInput.value.trim();
    if (!isValidEmail(val)) {
        emailInput.focus();
        emailInput.style.borderColor = 'var(--error)';
        setTimeout(() => { emailInput.style.borderColor = ''; }, 1400);
        showToast('Введите корректный email');
        return;
    }
    emailInput.value = '';
    showToast('Приглашение отправлено');
});

emailInput.addEventListener('input', () => {
    emailInput.style.borderColor = '';
});

// ── Collapsible perms ──
permsHeader.addEventListener('click', () => {
    const isOpen = permsList.classList.toggle('open');
    permsHeader.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
        permsList.style.maxHeight = permsList.scrollHeight + 'px';
    } else {
        permsList.style.maxHeight = '0px';
    }
});

// ── Toast ──
let toastTimer = null;
function showToast(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
