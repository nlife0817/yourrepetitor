(function () {
    'use strict';

    // ── State ──
    let packages = [
        { id: 'p1', name: '8 занятий по математике', count: 8, price: 1000, threshold: 2, archived: false },
        { id: 'p2', name: '12 занятий по английскому', count: 12, price: 1200, threshold: 3, archived: false },
        { id: 'p3', name: '5 занятий по физике', count: 5, price: 1500, threshold: 1, archived: false },
        { id: 'p4', name: '4 занятия по химии', count: 4, price: 900, threshold: 1, archived: true },
    ];
    let editingId = null;

    // ── DOM refs ──
    const fab = document.getElementById('btnFab');
    const emptyState = document.getElementById('emptyState');
    const activeList = document.getElementById('activeList');
    const archivedSection = document.getElementById('archivedSection');
    const archivedList = document.getElementById('archivedList');
    const overlay = document.getElementById('sheetOverlay');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    // Create sheet
    const createSheet = document.getElementById('createSheet');
    const createName = document.getElementById('createName');
    const createCountRow = document.getElementById('createCountRow');
    const createCountCustom = document.getElementById('createCountCustom');
    const createPrice = document.getElementById('createPrice');
    const createThresholdRow = document.getElementById('createThresholdRow');
    const createSummary = document.getElementById('createSummary');
    const btnCreateSubmit = document.getElementById('btnCreateSubmit');

    // Edit sheet
    const editSheet = document.getElementById('editSheet');
    const editSheetTitle = document.getElementById('editSheetTitle');
    const editName = document.getElementById('editName');
    const editPrice = document.getElementById('editPrice');
    const editThresholdRow = document.getElementById('editThresholdRow');
    const editSummary = document.getElementById('editSummary');
    const btnEditSave = document.getElementById('btnEditSave');
    const btnEditArchive = document.getElementById('btnEditArchive');

    // ── Helpers ──
    function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

    function formatPrice(n) {
        return n.toLocaleString('ru-RU');
    }

    // ── Chip-only picker logic ──
    function setupChipPicker(row, onChange) {
        const chips = row.querySelectorAll('.picker-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                if (onChange) onChange(parseInt(chip.dataset.value));
            });
        });
    }

    function getChipValue(row) {
        const active = row.querySelector('.picker-chip.active');
        return active ? parseInt(active.dataset.value) : 0;
    }

    function setChipValue(row, value) {
        const chips = row.querySelectorAll('.picker-chip');
        chips.forEach(c => {
            c.classList.remove('active');
            if (parseInt(c.dataset.value) === value) c.classList.add('active');
        });
    }

    // ── Picker with custom input (chips + custom) ──
    function setupPickerWithCustom(row, customInput, onChange) {
        const chips = row.querySelectorAll('.picker-chip');

        // Chip click → deactivate custom, activate chip
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                customInput.value = '';
                customInput.classList.remove('has-value');
                if (onChange) onChange(parseInt(chip.dataset.value));
            });
        });

        // Custom input → deactivate all chips
        customInput.addEventListener('input', () => {
            customInput.value = customInput.value.replace(/[^\d]/g, '');
            if (customInput.value) {
                chips.forEach(c => c.classList.remove('active'));
                customInput.classList.add('has-value');
            } else {
                customInput.classList.remove('has-value');
            }
            if (onChange) onChange(getPickerValue(row, customInput));
        });

        // Blur empty → restore default chip
        customInput.addEventListener('blur', () => {
            if (!customInput.value) {
                customInput.classList.remove('has-value');
                if (!row.querySelector('.picker-chip.active')) {
                    setChipValue(row, 8);
                    if (onChange) onChange(8);
                }
            }
        });
    }

    function getPickerValue(row, customInput) {
        if (customInput && customInput.value) {
            return parseInt(customInput.value) || 0;
        }
        return getChipValue(row);
    }

    // ── Create sheet summary ──
    function updateCreateSummary() {
        const count = getPickerValue(createCountRow, createCountCustom);
        const price = parseInt(createPrice.value.replace(/\D/g, '')) || 0;
        const total = count * price;
        createSummary.innerHTML = `Итого: <strong>${formatPrice(total)} \u20BD</strong>`;
    }

    // ── Edit sheet summary ──
    function updateEditSummary() {
        if (!editingId) return;
        const pkg = packages.find(p => p.id === editingId);
        if (!pkg) return;
        const price = parseInt(editPrice.value.replace(/\D/g, '')) || 0;
        const total = pkg.count * price;
        editSummary.innerHTML = `${pkg.count} занятий \u00B7 итого <strong>${formatPrice(total)} \u20BD</strong>`;
    }

    // ── Render ──
    function render() {
        const active = packages.filter(p => !p.archived);
        const archived = packages.filter(p => p.archived);

        // Empty state
        emptyState.style.display = active.length === 0 && archived.length === 0 ? '' : 'none';

        // Active list
        activeList.innerHTML = '';
        if (active.length) {
            const wrap = document.createElement('div');
            wrap.className = 'package-list-wrap';
            active.forEach((pkg, i) => {
                const card = document.createElement('div');
                card.className = 'package-card';
                card.style.animationDelay = `${i * 0.05}s`;
                card.innerHTML = `
                    <div class="package-card-info">
                        <div class="package-card-name">${esc(pkg.name)}</div>
                        <div class="package-card-meta">${pkg.count} занятий \u00B7 ${formatPrice(pkg.price)} \u20BD/занятие</div>
                    </div>
                    <div class="package-card-right">
                        <div class="package-card-price">${formatPrice(pkg.count * pkg.price)} \u20BD</div>
                        <div class="package-card-threshold">порог: ${pkg.threshold}</div>
                    </div>
                `;
                card.addEventListener('click', () => openEdit(pkg.id));
                wrap.appendChild(card);
            });
            activeList.appendChild(wrap);
        }

        // Archived list
        if (archived.length) {
            archivedSection.style.display = '';
            archivedList.innerHTML = '';
            const wrap = document.createElement('div');
            wrap.className = 'package-list-wrap';
            archived.forEach((pkg, i) => {
                const card = document.createElement('div');
                card.className = 'package-card archived';
                card.style.animationDelay = `${i * 0.05}s`;
                card.innerHTML = `
                    <div class="package-card-info">
                        <div class="package-card-name">
                            ${esc(pkg.name)}
                            <span class="package-card-badge">Архив</span>
                        </div>
                        <div class="package-card-meta">${pkg.count} занятий \u00B7 ${formatPrice(pkg.price)} \u20BD/занятие</div>
                    </div>
                    <div class="package-card-right">
                        <div class="package-card-price">${formatPrice(pkg.count * pkg.price)} \u20BD</div>
                        <div class="package-card-threshold">порог: ${pkg.threshold}</div>
                    </div>
                `;
                card.addEventListener('click', () => openEdit(pkg.id));
                wrap.appendChild(card);
            });
            archivedList.appendChild(wrap);
        } else {
            archivedSection.style.display = 'none';
        }
    }

    function esc(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    // ── Sheet open/close ──
    let currentSheet = null;

    function openSheet(sheet) {
        currentSheet = sheet;
        overlay.classList.add('active');
        sheet.classList.add('open');
        fab.classList.add('rotated');
    }

    function closeSheet() {
        if (!currentSheet) return;
        overlay.classList.remove('active');
        currentSheet.classList.remove('open');
        fab.classList.remove('rotated');
        currentSheet = null;
        editingId = null;
        btnEditArchive.classList.remove('confirming');
        btnEditArchive.textContent = 'В архив';
    }

    // ── Create ──
    function openCreate() {
        createName.value = '';
        createPrice.value = '';
        createName.classList.remove('field-error');

        // Reset count chips (default 8) and custom input
        setChipValue(createCountRow, 8);
        createCountCustom.value = '';
        createCountCustom.classList.remove('has-value');

        // Reset threshold chips (default 2)
        setChipValue(createThresholdRow, 2);

        updateCreateSummary();
        openSheet(createSheet);
    }

    function submitCreate() {
        const name = createName.value.trim();
        if (!name) {
            createName.classList.add('field-error');
            createName.focus();
            return;
        }
        createName.classList.remove('field-error');

        const count = getPickerValue(createCountRow, createCountCustom) || 8;
        const price = parseInt(createPrice.value.replace(/\D/g, '')) || 0;
        const threshold = getChipValue(createThresholdRow) || 2;

        packages.push({
            id: genId(),
            name,
            count,
            price,
            threshold,
            archived: false
        });

        closeSheet();
        render();
        showToast('Пакет создан');
    }

    // ── Edit ──
    function openEdit(id) {
        const pkg = packages.find(p => p.id === id);
        if (!pkg) return;
        editingId = id;

        editSheetTitle.textContent = pkg.name;
        editName.value = pkg.name;
        editPrice.value = pkg.price;

        setChipValue(editThresholdRow, pkg.threshold);
        updateEditSummary();

        // Archive button text
        btnEditArchive.classList.remove('confirming');
        btnEditArchive.textContent = pkg.archived ? 'Восстановить из архива' : 'В архив';

        openSheet(editSheet);
    }

    function submitEdit() {
        if (!editingId) return;
        const pkg = packages.find(p => p.id === editingId);
        if (!pkg) return;

        pkg.name = editName.value.trim() || pkg.name;
        pkg.price = parseInt(editPrice.value.replace(/\D/g, '')) || pkg.price;
        pkg.threshold = getChipValue(editThresholdRow) || pkg.threshold;

        closeSheet();
        render();
        showToast('Пакет сохранён');
    }

    function handleArchive() {
        if (!editingId) return;
        const pkg = packages.find(p => p.id === editingId);
        if (!pkg) return;

        if (btnEditArchive.classList.contains('confirming')) {
            pkg.archived = !pkg.archived;
            closeSheet();
            render();
            showToast(pkg.archived ? 'Пакет в архиве' : 'Пакет восстановлен');
        } else {
            btnEditArchive.classList.add('confirming');
            btnEditArchive.textContent = pkg.archived ? 'Подтвердить восстановление' : 'Подтвердить архивацию';
        }
    }

    // ── Toast ──
    let toastTimer;
    function showToast(text) {
        toastText.textContent = text;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ── Swipe-to-dismiss sheets ──
    function setupSwipeDismiss(handleEl, sheet) {
        let startY = 0, currentY = 0, dragging = false;

        handleEl.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
            dragging = true;
            sheet.style.transition = 'none';
        }, { passive: true });

        handleEl.addEventListener('touchmove', e => {
            if (!dragging) return;
            currentY = e.touches[0].clientY;
            const dy = Math.max(0, currentY - startY);
            sheet.style.transform = `translateX(-50%) translateY(${dy}px)`;
        }, { passive: true });

        handleEl.addEventListener('touchend', () => {
            if (!dragging) return;
            dragging = false;
            sheet.style.transition = '';
            const dy = currentY - startY;
            if (dy > 100) {
                closeSheet();
            } else {
                sheet.style.transform = '';
            }
        });
    }

    // ── Init ──
    function init() {
        // Chip picker setup
        setupPickerWithCustom(createCountRow, createCountCustom, updateCreateSummary);
        setupChipPicker(createThresholdRow, null);
        setupChipPicker(editThresholdRow, updateEditSummary);

        // Price input events
        createPrice.addEventListener('input', () => {
            createPrice.value = createPrice.value.replace(/[^\d]/g, '');
            updateCreateSummary();
        });

        editPrice.addEventListener('input', () => {
            editPrice.value = editPrice.value.replace(/[^\d]/g, '');
            updateEditSummary();
        });

        // Create name validation clear
        createName.addEventListener('input', () => createName.classList.remove('field-error'));

        // FAB / empty create
        fab.addEventListener('click', () => {
            if (currentSheet) { closeSheet(); return; }
            openCreate();
        });
        document.getElementById('btnEmptyCreate').addEventListener('click', openCreate);

        // Overlay close
        overlay.addEventListener('click', closeSheet);

        // Submit
        btnCreateSubmit.addEventListener('click', submitCreate);
        btnEditSave.addEventListener('click', submitEdit);
        btnEditArchive.addEventListener('click', handleArchive);

        // Swipe
        setupSwipeDismiss(document.getElementById('createHandle'), createSheet);
        setupSwipeDismiss(document.getElementById('editHandle'), editSheet);

        render();
    }

    init();
})();
