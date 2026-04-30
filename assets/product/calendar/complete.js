/* ══════════════════════════════════════════
   ── complete.js — поведение CompleteSheet ──
   ══════════════════════════════════════════ */

(() => {
    const PRICE_DEFAULT = '1 900 ₽';
    const PRICE_FROM_PACKAGE = '1 занятие из пакета';

    const sheet      = document.getElementById('completeSheet');
    const overlay    = document.getElementById('sheetOverlay');
    const btnClose   = document.getElementById('btnClose');
    const btnCancel  = document.getElementById('btnCancel');
    const btnConfirm = document.getElementById('btnConfirm');

    const statusPills    = document.getElementById('statusPills');
    const methodSection  = document.getElementById('methodSection');
    const methodChips    = document.getElementById('methodChips');
    const packageSelect  = document.getElementById('packageSelect');
    const amountValue    = document.getElementById('amountValue');

    const toast     = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    let status = 'pending';   // 'paid' | 'pending'
    let method = 'transfer';  // 'cash' | 'transfer' | 'package'
    let selectedPackage = 'p1';

    // ── Helpers ──
    function updateAmount() {
        if (status === 'paid' && method === 'package') {
            amountValue.textContent = PRICE_FROM_PACKAGE;
            amountValue.classList.add('from-package');
        } else {
            amountValue.textContent = PRICE_DEFAULT;
            amountValue.classList.remove('from-package');
        }
    }

    function applyStatus() {
        statusPills.querySelectorAll('.format-pill').forEach(pill => {
            const isActive = pill.dataset.status === status;
            pill.classList.toggle('active', isActive);
            pill.setAttribute('aria-checked', isActive ? 'true' : 'false');
            pill.classList.remove('variant-success', 'variant-warning');
            if (isActive) {
                pill.classList.add(status === 'paid' ? 'variant-success' : 'variant-warning');
            }
        });

        if (status === 'paid') {
            methodSection.classList.remove('hidden-block');
        } else {
            methodSection.classList.add('hidden-block');
        }
        updateAmount();
    }

    function applyMethod() {
        methodChips.querySelectorAll('.method-chip').forEach(chip => {
            const isActive = chip.dataset.method === method;
            chip.classList.toggle('active', isActive);
            chip.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });

        if (method === 'package') {
            packageSelect.classList.remove('hidden-block');
        } else {
            packageSelect.classList.add('hidden-block');
        }
        updateAmount();
    }

    function applyPackage() {
        packageSelect.querySelectorAll('.package-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.package === selectedPackage);
        });
    }

    function showToast(text) {
        toastText.textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function closeSheet() {
        sheet.classList.remove('open');
        overlay.classList.remove('active');
    }

    // ── Events ──
    statusPills.addEventListener('click', (e) => {
        const pill = e.target.closest('.format-pill');
        if (!pill) return;
        status = pill.dataset.status;
        applyStatus();
    });

    methodChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.method-chip');
        if (!chip) return;
        method = chip.dataset.method;
        applyMethod();
    });

    packageSelect.addEventListener('click', (e) => {
        const opt = e.target.closest('.package-option');
        if (!opt) return;
        selectedPackage = opt.dataset.package;
        applyPackage();
    });

    btnClose.addEventListener('click', closeSheet);
    btnCancel.addEventListener('click', closeSheet);
    overlay.addEventListener('click', closeSheet);

    btnConfirm.addEventListener('click', () => {
        showToast('Занятие проведено');
        closeSheet();
    });

    // ── Init ──
    applyStatus();
    applyMethod();
    applyPackage();
})();
