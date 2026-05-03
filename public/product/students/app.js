// ── Data ──
const STUDENTS = [
    { id: 1, name: 'Алиса Козлова', initial: 'А', level: '9 класс', price: 2000, variant: 'indigo', notes: '', status: 'active' },
    { id: 2, name: 'Дмитрий Волков', initial: 'Д', level: 'ЕГЭ', price: 1500, variant: 'orange', notes: 'Подготовка к ЕГЭ по математике', status: 'active' },
    { id: 3, name: 'Мария Петрова', initial: 'М', level: 'Студент', price: 1800, variant: 'green', notes: '', status: 'active' },
    { id: 4, name: 'Евгений Никитин', initial: 'Е', level: '11 класс', price: 1000, variant: 'indigo', notes: 'Физика + математика', status: 'active' },
    { id: 5, name: 'Софья Ларина', initial: 'С', level: '7 класс', price: 1200, variant: 'green', notes: '', status: 'active' },
    { id: 6, name: 'Артём Белов', initial: 'А', level: 'ОГЭ', price: 1600, variant: 'orange', notes: 'Готовится к ОГЭ, нужен упор на геометрию', status: 'active' },
    { id: 7, name: 'Полина Чернова', initial: 'П', level: '5 класс', price: 1000, variant: 'indigo', notes: '', status: 'active' },
    { id: 8, name: 'Кирилл Соколов', initial: 'К', level: 'Взрослый', price: 2500, variant: 'green', notes: 'Английский для работы', status: 'active' },
    { id: 9, name: 'Виталий Олегович', initial: 'В', level: '', price: 0, variant: 'orange', notes: '', status: 'pending', inviteLink: 'https://t.me/tutorflow2u_bot?startapp=INV_857259d24031820e2b7b3cd0' },
    { id: 10, name: 'Никита Фёдоров', initial: 'Н', level: '10 класс', price: 1400, variant: 'indigo', notes: '', status: 'active' },
    { id: 11, name: 'Ольга Маслова', initial: 'О', level: '8 класс', price: 1300, variant: 'green', notes: 'Химия', status: 'archived' },
];

const VARIANTS = ['indigo', 'orange', 'green'];

// ── State ──
let activeSheet = null; // 'invite' | 'detail' | 'pending' | null
let selectedStudent = null;
let isEditMode = false;
let archiveConfirming = false;
let searchQuery = '';

// ── Elements ──
const overlay = document.getElementById('sheetOverlay');
const fab = document.getElementById('btnFab');
const inviteSheet = document.getElementById('inviteSheet');
const detailSheet = document.getElementById('detailSheet');
const pendingDetailSheet = document.getElementById('pendingDetailSheet');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');

// ════════════════════════════════════════
// ── Sheet Management ──
// ════════════════════════════════════════

function openSheet(type) {
    if (activeSheet) closeSheet();
    activeSheet = type;
    overlay.classList.add('active');
    fab.classList.add('rotated');

    if (type === 'invite') {
        inviteSheet.classList.add('open');
        updateSubmitState();
    } else if (type === 'detail') {
        detailSheet.classList.add('open');
    } else if (type === 'pending') {
        pendingDetailSheet.classList.add('open');
    }
}

function closeSheet() {
    overlay.classList.remove('active');
    fab.classList.remove('rotated');
    inviteSheet.classList.remove('open');
    detailSheet.classList.remove('open');
    pendingDetailSheet.classList.remove('open');

    if (activeSheet === 'detail' && isEditMode) exitEditMode();

    // Reset archive confirm
    resetArchiveBtn();

    // Reset invite to step 1
    document.getElementById('inviteFormStep').style.display = '';
    document.getElementById('inviteLinkStep').style.display = 'none';
    document.getElementById('inviteFooter').style.display = '';

    activeSheet = null;
    selectedStudent = null;
}

fab.addEventListener('click', () => {
    if (activeSheet) {
        closeSheet();
    } else {
        resetInviteForm();
        openSheet('invite');
    }
});

overlay.addEventListener('click', closeSheet);

// ════════════════════════════════════════
// ── Sheet Swipe to Dismiss ──
// ════════════════════════════════════════

function initSheetDrag(handleEl, sheetEl) {
    let startY = 0, currentY = 0, dragging = false;
    handleEl.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        dragging = true;
        sheetEl.style.transition = 'none';
    }, { passive: true });

    handleEl.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        currentY = e.touches[0].clientY;
        const dy = Math.max(0, currentY - startY);
        sheetEl.style.transform = `translateX(-50%) translateY(${dy}px)`;
    }, { passive: true });

    handleEl.addEventListener('touchend', () => {
        if (!dragging) return;
        dragging = false;
        const dy = currentY - startY;
        sheetEl.style.transition = '';
        sheetEl.style.transform = '';
        if (dy > 100) closeSheet();
    });
}

initSheetDrag(document.getElementById('inviteHandle'), inviteSheet);
initSheetDrag(document.getElementById('detailHandle'), detailSheet);
initSheetDrag(document.getElementById('pendingHandle'), pendingDetailSheet);

// ════════════════════════════════════════
// ── Search ──
// ════════════════════════════════════════

const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');

document.getElementById('btnSearch').addEventListener('click', () => {
    const isOpen = searchBar.classList.contains('open');
    if (isOpen) {
        searchBar.classList.remove('open');
        if (searchQuery) {
            searchInput.value = '';
            searchQuery = '';
            renderStudentList();
        }
    } else {
        searchBar.classList.add('open');
        searchInput.focus();
    }
});

document.getElementById('searchClear').addEventListener('click', () => {
    searchBar.classList.remove('open');
    if (searchQuery) {
        searchInput.value = '';
        searchQuery = '';
        renderStudentList();
    }
});

searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderStudentList();
});

// ════════════════════════════════════════
// ── Invite Sheet Logic ──
// ════════════════════════════════════════

const inviteName = document.getElementById('inviteName');
const btnInviteSubmit = document.getElementById('btnInviteSubmit');

function updateSubmitState() {
    const hasName = inviteName.value.trim().length > 0;
    btnInviteSubmit.classList.toggle('disabled', !hasName);
}

inviteName.addEventListener('input', updateSubmitState);

function resetInviteForm() {
    inviteName.value = '';
    document.getElementById('inviteNotes').value = '';
    inviteName.classList.remove('field-error');
    // Reset level chips
    document.querySelectorAll('#inviteLevelChips .level-chip').forEach(c => c.classList.remove('active'));
    // Reset steps
    document.getElementById('inviteFormStep').style.display = '';
    document.getElementById('inviteLinkStep').style.display = 'none';
    document.getElementById('inviteFooter').style.display = '';
    updateSubmitState();
}

// Invite level chips
document.getElementById('inviteLevelChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.level-chip');
    if (!chip) return;
    document.querySelectorAll('#inviteLevelChips .level-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
});

function generateInviteLink() {
    const id = Math.random().toString(16).slice(2, 26);
    return `https://t.me/tutorflow2u_bot?startapp=INV_${id}`;
}

btnInviteSubmit.addEventListener('click', () => {
    const name = inviteName.value.trim();
    if (!name) {
        inviteName.classList.add('field-error');
        inviteName.focus();
        return;
    }

    // Get selected level
    const activeChip = document.querySelector('#inviteLevelChips .level-chip.active');
    const level = activeChip ? activeChip.dataset.value : '';

    const link = generateInviteLink();

    // Add student as pending
    const newStudent = {
        id: Date.now(),
        name: name,
        initial: name[0].toUpperCase(),
        level: level,
        price: 0,
        variant: VARIANTS[STUDENTS.length % VARIANTS.length],
        notes: document.getElementById('inviteNotes').value.trim(),
        status: 'pending',
        inviteLink: link,
    };
    STUDENTS.push(newStudent);
    renderStudentList();

    // Switch to step 2
    document.getElementById('inviteFormStep').style.display = 'none';
    document.getElementById('inviteLinkStep').style.display = '';
    document.getElementById('inviteFooter').style.display = 'none';
    document.getElementById('inviteLinkName').textContent = name;
    document.getElementById('inviteLinkText').textContent = link;
});

document.getElementById('btnCopyLink').addEventListener('click', () => {
    const text = document.getElementById('inviteLinkText').textContent;
    navigator.clipboard.writeText(text).catch(() => {});
    showToast('Ссылка скопирована');
});

document.getElementById('btnCloseInvite').addEventListener('click', closeSheet);

inviteName.addEventListener('focus', () => inviteName.classList.remove('field-error'));

// ════════════════════════════════════════
// ── Student List ──
// ════════════════════════════════════════

function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function renderStudentList() {
    const activeList = document.getElementById('studentList');
    const pendingSection = document.getElementById('pendingSection');
    const pendingList = document.getElementById('pendingList');
    const archivedSection = document.getElementById('archivedSection');
    const archivedList = document.getElementById('archivedList');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('studentCount');

    const activeStudents = STUDENTS.filter(s => s.status === 'active' && matchesSearch(s));
    const pendingStudents = STUDENTS.filter(s => s.status === 'pending' && matchesSearch(s));
    const archivedStudents = STUDENTS.filter(s => s.status === 'archived' && matchesSearch(s));

    const totalActive = STUDENTS.filter(s => s.status === 'active').length;
    const totalPending = STUDENTS.filter(s => s.status === 'pending').length;

    // Subtitle
    let subtitle = `${totalActive} активных`;
    if (totalPending > 0) subtitle += ` · ${totalPending} ожидают`;
    countEl.textContent = subtitle;

    // Empty
    if (activeStudents.length === 0 && pendingStudents.length === 0 && archivedStudents.length === 0) {
        activeList.innerHTML = '';
        pendingSection.style.display = 'none';
        archivedSection.style.display = 'none';
        emptyState.style.display = '';
        return;
    }
    emptyState.style.display = 'none';

    // Active
    activeList.innerHTML = activeStudents.map((s, i) => renderActiveCard(s, i)).join('');

    // Pending
    if (pendingStudents.length > 0) {
        pendingSection.style.display = '';
        pendingList.innerHTML = pendingStudents.map((s, i) => renderPendingCard(s, i)).join('');
    } else {
        pendingSection.style.display = 'none';
    }

    // Archived
    if (archivedStudents.length > 0) {
        archivedSection.style.display = '';
        archivedList.innerHTML = archivedStudents.map((s, i) => renderArchivedCard(s, i)).join('');
    } else {
        archivedSection.style.display = 'none';
    }

    // Attach click handlers
    document.querySelectorAll('.student-card[data-status="active"]').forEach(card => {
        card.addEventListener('click', () => {
            const student = STUDENTS.find(s => s.id === parseInt(card.dataset.id));
            if (student) openDetailSheet(student);
        });
    });

    document.querySelectorAll('.student-card[data-status="pending"]').forEach(card => {
        card.addEventListener('click', () => {
            const student = STUDENTS.find(s => s.id === parseInt(card.dataset.id));
            if (student) openPendingSheet(student);
        });
    });
}

function matchesSearch(s) {
    if (!searchQuery) return true;
    return s.name.toLowerCase().includes(searchQuery);
}

function renderActiveCard(s, i) {
    return `
        <div class="student-card" data-id="${s.id}" data-status="active" style="animation-delay: ${0.04 * (i + 1)}s">
            <div class="student-card-avatar avatar-variant variant-${s.variant}">${s.initial}</div>
            <div class="student-card-info">
                <div class="student-card-name">${s.name}</div>
                <div class="student-card-meta">
                    <span class="student-card-price">${formatPrice(s.price)} &#8381;</span>
                    ${s.level ? `<span class="student-card-tag">${s.level}</span>` : ''}
                </div>
            </div>
            <div class="student-card-actions">
                <a class="student-card-tg" href="#" title="Telegram" onclick="event.stopPropagation()">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M21.2 4.4L2.4 11.3c-.5.2-.5.9 0 1l4.4 1.5 1.7 5.3c.1.4.6.6 1 .3l2.4-2 4.7 3.5c.4.3 1 .1 1.1-.4L21.9 5.3c.1-.5-.3-.9-.7-.9z" fill="currentColor"/></svg>
                </a>
                <svg class="student-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
            </div>
        </div>`;
}

function renderPendingCard(s, i) {
    return `
        <div class="student-card" data-id="${s.id}" data-status="pending" style="animation-delay: ${0.04 * (i + 1)}s">
            <div class="student-card-avatar avatar-variant variant-${s.variant}">${s.initial}</div>
            <div class="student-card-info">
                <div class="student-card-name">${s.name}</div>
                <div class="student-card-meta">
                    <span class="student-card-sub">Ожидает привязки</span>
                </div>
            </div>
            <div class="student-card-actions">
                <button class="student-card-copy" onclick="event.stopPropagation(); copyLink('${s.inviteLink}')" title="Копировать ссылку">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <span class="student-card-badge">Ожидает</span>
            </div>
        </div>`;
}

function renderArchivedCard(s, i) {
    return `
        <div class="student-card archived" data-id="${s.id}" data-status="archived" style="animation-delay: ${0.04 * (i + 1)}s">
            <div class="student-card-avatar avatar-variant variant-${s.variant}">${s.initial}</div>
            <div class="student-card-info">
                <div class="student-card-name">${s.name}</div>
                <div class="student-card-meta">
                    ${s.level ? `<span class="student-card-tag">${s.level}</span>` : ''}
                </div>
            </div>
            <svg class="student-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
        </div>`;
}

function copyLink(link) {
    navigator.clipboard.writeText(link).catch(() => {});
    showToast('Ссылка скопирована');
}

// ════════════════════════════════════════
// ── Detail Sheet (active student) ──
// ════════════════════════════════════════

function openDetailSheet(student) {
    selectedStudent = student;
    isEditMode = false;
    archiveConfirming = false;

    // Accent bar
    document.getElementById('detailAccent').className = `detail-sheet-accent variant-${student.variant}`;

    // Show view, hide edit
    document.getElementById('detailViewMode').style.display = '';
    document.getElementById('detailEditMode').style.display = 'none';

    // Avatar
    const avatar = document.getElementById('detailAvatar');
    avatar.className = `detail-student-avatar avatar-variant variant-${student.variant}`;
    avatar.textContent = student.initial;

    // Info
    document.getElementById('detailName').textContent = student.name;
    const levelEl = document.getElementById('detailLevel');
    levelEl.textContent = student.level || '';
    levelEl.style.display = student.level ? '' : 'none';

    // Notes inline
    const notesInline = document.getElementById('detailNotesInline');
    const notesText = document.getElementById('detailNotesText');
    if (student.notes) {
        notesInline.style.display = '';
        notesText.textContent = student.notes;
    } else {
        notesInline.style.display = 'none';
    }

    // Price
    document.getElementById('detailPrice').textContent = formatPrice(student.price);

    // Reset archive button
    resetArchiveBtn();

    openSheet('detail');
}

// Edit mode
document.getElementById('btnEdit').addEventListener('click', enterEditMode);
document.getElementById('btnCancelEdit').addEventListener('click', exitEditMode);
document.getElementById('btnSaveEdit').addEventListener('click', saveEdit);

function enterEditMode() {
    if (!selectedStudent) return;
    isEditMode = true;

    document.getElementById('detailViewMode').style.display = 'none';
    document.getElementById('detailEditMode').style.display = '';

    document.getElementById('editName').value = selectedStudent.name;
    document.getElementById('editPrice').value = selectedStudent.price || '';
    document.getElementById('editNotes').value = selectedStudent.notes || '';

    // Set active level chip
    document.querySelectorAll('#levelChips .level-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.value === selectedStudent.level);
    });

    document.getElementById('detailBody').scrollTop = 0;
}

function exitEditMode() {
    isEditMode = false;
    document.getElementById('detailViewMode').style.display = '';
    document.getElementById('detailEditMode').style.display = 'none';
    document.getElementById('detailBody').scrollTop = 0;
}

function saveEdit() {
    if (!selectedStudent) return;

    const newName = document.getElementById('editName').value.trim();
    if (!newName) {
        document.getElementById('editName').classList.add('field-error');
        return;
    }

    selectedStudent.name = newName;
    selectedStudent.initial = newName[0].toUpperCase();
    selectedStudent.price = parseInt(document.getElementById('editPrice').value) || 0;
    selectedStudent.notes = document.getElementById('editNotes').value.trim();

    const activeChip = document.querySelector('#levelChips .level-chip.active');
    selectedStudent.level = activeChip ? activeChip.dataset.value : '';

    // Update view mode
    document.getElementById('detailAvatar').textContent = selectedStudent.initial;
    document.getElementById('detailName').textContent = selectedStudent.name;
    const levelEl = document.getElementById('detailLevel');
    levelEl.textContent = selectedStudent.level;
    levelEl.style.display = selectedStudent.level ? '' : 'none';
    document.getElementById('detailPrice').textContent = formatPrice(selectedStudent.price);

    const notesInline = document.getElementById('detailNotesInline');
    const notesText = document.getElementById('detailNotesText');
    if (selectedStudent.notes) {
        notesInline.style.display = '';
        notesText.textContent = selectedStudent.notes;
    } else {
        notesInline.style.display = 'none';
    }

    exitEditMode();
    renderStudentList();
    showToast('Изменения сохранены');
}

// Level chips (edit mode)
document.getElementById('levelChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.level-chip');
    if (!chip) return;
    document.querySelectorAll('#levelChips .level-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
});

// Edit name error clear
document.getElementById('editName').addEventListener('focus', function() {
    this.classList.remove('field-error');
});

// ════════════════════════════════════════
// ── Archive with confirmation ──
// ════════════════════════════════════════

const btnArchiveView = document.getElementById('btnArchiveView');
let archiveTimer = null;

function resetArchiveBtn() {
    archiveConfirming = false;
    btnArchiveView.textContent = 'Архивировать ученика';
    btnArchiveView.classList.remove('confirming');
    clearTimeout(archiveTimer);
}

btnArchiveView.addEventListener('click', () => {
    if (!selectedStudent) return;

    if (!archiveConfirming) {
        // First click — ask confirmation
        archiveConfirming = true;
        btnArchiveView.textContent = 'Подтвердить архивацию';
        btnArchiveView.classList.add('confirming');

        // Auto-reset after 4 seconds
        archiveTimer = setTimeout(resetArchiveBtn, 4000);
    } else {
        // Second click — archive
        selectedStudent.status = 'archived';
        closeSheet();
        renderStudentList();
        showToast('Ученик архивирован');
    }
});

// ════════════════════════════════════════
// ── Pending Student Detail Sheet ──
// ════════════════════════════════════════

function openPendingSheet(student) {
    selectedStudent = student;

    // Avatar
    const avatar = document.getElementById('pendingAvatar');
    avatar.className = `detail-student-avatar avatar-variant variant-${student.variant}`;
    avatar.textContent = student.initial;

    // Accent
    document.getElementById('pendingAccent').className = `detail-sheet-accent variant-${student.variant}`;

    // Name
    document.getElementById('pendingName').textContent = student.name;

    // Link
    document.getElementById('pendingLinkText').textContent = student.inviteLink || '';

    // Notes
    document.getElementById('pendingNotes').value = student.notes || '';

    // Level chips
    document.querySelectorAll('#pendingLevelChips .level-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.value === student.level);
    });

    openSheet('pending');
}

// Pending level chips
document.getElementById('pendingLevelChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.level-chip');
    if (!chip) return;
    document.querySelectorAll('#pendingLevelChips .level-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
});

document.getElementById('btnPendingCopy').addEventListener('click', () => {
    const text = document.getElementById('pendingLinkText').textContent;
    navigator.clipboard.writeText(text).catch(() => {});
    showToast('Ссылка скопирована');
});

document.getElementById('btnPendingClose').addEventListener('click', closeSheet);

document.getElementById('btnPendingSave').addEventListener('click', () => {
    if (!selectedStudent) return;

    selectedStudent.notes = document.getElementById('pendingNotes').value.trim();
    const activeChip = document.querySelector('#pendingLevelChips .level-chip.active');
    selectedStudent.level = activeChip ? activeChip.dataset.value : '';

    closeSheet();
    renderStudentList();
    showToast('Изменения сохранены');
});

// ════════════════════════════════════════
// ── Toast ──
// ════════════════════════════════════════

let toastTimer = null;

function showToast(text) {
    toastText.textContent = text;
    // Show at top if a sheet is open (sheet over sheet scenario)
    if (activeSheet) {
        toast.classList.add('toast-top');
    } else {
        toast.classList.remove('toast-top');
    }
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ════════════════════════════════════════
// ── Keyboard ──
// ════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (activeSheet) closeSheet();
        else if (searchBar.classList.contains('open')) {
            searchBar.classList.remove('open');
            if (searchQuery) {
                searchInput.value = '';
                searchQuery = '';
                renderStudentList();
            }
        }
    }
});

// ════════════════════════════════════════
// ── Init ──
// ════════════════════════════════════════

renderStudentList();
