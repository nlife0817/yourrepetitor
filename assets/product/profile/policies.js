(function () {
    'use strict';

    // ── Mocks ──
    const DEFAULT_POLICY_ID = 'pol-standard';

    let POLICIES = [
        {
            id: 'pol-standard',
            name: 'Стандарт',
            isDefault: true,
            rules: [
                { hours: 24, penalty: 0 },
                { hours: 12, penalty: 50 },
                { hours: 0, penalty: 100 },
            ],
        },
        {
            id: 'pol-soft',
            name: 'Щадящая',
            isDefault: false,
            rules: [
                { hours: 12, penalty: 0 },
                { hours: 0, penalty: 50 },
            ],
        },
    ];

    let editingId = null;
    let deleteConfirmArmed = false;

    // Local state for sheets: { rules: [{hours, penalty}], isDefault, name }
    let createState = null;
    let editState = null;

    // ── DOM refs ──
    const fab = document.getElementById('btnFab');
    const overlay = document.getElementById('sheetOverlay');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    const defaultPolicyWrap = document.getElementById('defaultPolicyWrap');
    const defaultPolicyCard = document.getElementById('defaultPolicyCard');
    const policyListWrap = document.getElementById('policyListWrap');
    const policyList = document.getElementById('policyList');
    const emptyState = document.getElementById('emptyState');
    const btnEmptyCreate = document.getElementById('btnEmptyCreate');

    // Create sheet
    const createSheet = document.getElementById('createSheet');
    const createName = document.getElementById('createName');
    const createRuleList = document.getElementById('createRuleList');
    const btnCreateAddRule = document.getElementById('btnCreateAddRule');
    const createDefaultToggle = document.getElementById('createDefaultToggle');
    const btnCreateSubmit = document.getElementById('btnCreateSubmit');

    // Edit sheet
    const editSheet = document.getElementById('editSheet');
    const editSheetTitle = document.getElementById('editSheetTitle');
    const editName = document.getElementById('editName');
    const editRuleList = document.getElementById('editRuleList');
    const btnEditAddRule = document.getElementById('btnEditAddRule');
    const editDefaultToggle = document.getElementById('editDefaultToggle');
    const btnEditSave = document.getElementById('btnEditSave');
    const btnEditDelete = document.getElementById('btnEditDelete');
    const editDeleteHint = document.getElementById('editDeleteHint');

    // ── Helpers ──
    function genId() { return 'pol-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4); }

    function sortRulesDesc(rules) {
        return rules.slice().sort((a, b) => (b.hours || 0) - (a.hours || 0));
    }

    function summaryForRules(rules) {
        const n = rules.length;
        const plural = n === 1 ? 'правило' : (n >= 2 && n <= 4 ? 'правила' : 'правил');
        return `${n} ${plural} · применяется ко всем занятиям`;
    }

    // ── Icons ──
    function svgChev() {
        return '<svg class="policy-card-chev" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
    }

    function svgClose() {
        return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    }

    // ── Render list ──
    function renderPolicies() {
        const def = POLICIES.find(p => p.isDefault);
        const others = POLICIES.filter(p => !p.isDefault);

        // Empty
        if (POLICIES.length === 0) {
            defaultPolicyWrap.style.display = 'none';
            policyListWrap.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        emptyState.style.display = 'none';

        // Default card
        if (def) {
            defaultPolicyWrap.style.display = 'block';
            defaultPolicyCard.innerHTML = `
                <div class="policy-card-info">
                    <div class="policy-card-header">
                        <span class="policy-card-badge">По умолчанию</span>
                        <span class="policy-card-name">${escapeHtml(def.name)}</span>
                    </div>
                    <div class="policy-card-meta">${summaryForRules(def.rules)}</div>
                </div>
                ${svgChev()}
            `;
            defaultPolicyCard.onclick = () => openEditSheet(def.id);
        } else {
            defaultPolicyWrap.style.display = 'none';
        }

        // Others
        if (others.length > 0) {
            policyListWrap.style.display = 'block';
            policyList.innerHTML = others.map(p => `
                <div class="policy-card" data-id="${p.id}">
                    <div class="policy-card-info">
                        <div class="policy-card-header">
                            <span class="policy-card-name">${escapeHtml(p.name)}</span>
                        </div>
                        <div class="policy-card-meta">${summaryForRules(p.rules)}</div>
                    </div>
                    ${svgChev()}
                </div>
            `).join('');
            policyList.querySelectorAll('.policy-card').forEach(el => {
                el.addEventListener('click', () => openEditSheet(el.dataset.id));
            });
        } else {
            policyListWrap.style.display = 'none';
        }
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    // ── Rule row rendering ──
    function renderRuleList(container, rules) {
        container.innerHTML = '';
        const sorted = sortRulesDesc(rules);
        sorted.forEach((rule, idx) => {
            const row = document.createElement('div');
            row.className = 'rule-row';
            row.dataset.idx = String(idx);
            row.innerHTML = `
                <span class="rule-row-label">Отмена за</span>
                <input class="rule-input input-base" type="number" inputmode="numeric" min="0" value="${rule.hours}" data-field="hours" aria-label="Часов до занятия">
                <span class="rule-row-label">ч и раньше — штраф</span>
                <input class="rule-input input-base" type="number" inputmode="numeric" min="0" max="100" value="${rule.penalty}" data-field="penalty" aria-label="Процент штрафа">
                <span class="rule-row-label">%</span>
                <button class="btn-rule-delete ${sorted.length < 2 ? 'hidden-rule-delete' : ''}" type="button" aria-label="Удалить правило">
                    ${svgClose()}
                </button>
            `;
            container.appendChild(row);
        });

        // Wire inputs
        container.querySelectorAll('.rule-row').forEach((row, i) => {
            const idx = parseInt(row.dataset.idx, 10);
            const hoursInput = row.querySelector('[data-field="hours"]');
            const penaltyInput = row.querySelector('[data-field="penalty"]');
            const delBtn = row.querySelector('.btn-rule-delete');

            const state = container === createRuleList ? createState : editState;

            hoursInput.addEventListener('input', (e) => {
                const v = Math.max(0, parseInt(e.target.value, 10) || 0);
                state.rules[idx].hours = v;
            });
            hoursInput.addEventListener('blur', () => {
                // Re-sort & re-render
                state.rules = sortRulesDesc(state.rules);
                renderRuleList(container, state.rules);
            });
            penaltyInput.addEventListener('input', (e) => {
                let v = parseInt(e.target.value, 10);
                if (isNaN(v)) v = 0;
                v = Math.max(0, Math.min(100, v));
                state.rules[idx].penalty = v;
                e.target.value = v;
            });
            delBtn.addEventListener('click', () => {
                if (state.rules.length <= 1) return;
                state.rules.splice(idx, 1);
                renderRuleList(container, state.rules);
            });
        });
    }

    // ── Sheet helpers ──
    function openSheet(sheet) {
        overlay.classList.add('active');
        sheet.classList.add('open');
    }

    function closeAllSheets() {
        overlay.classList.remove('active');
        createSheet.classList.remove('open');
        editSheet.classList.remove('open');
        resetDeleteConfirm();
    }

    // ── Toggle helpers ──
    function setToggle(el, on) {
        el.classList.toggle('on', !!on);
        el.setAttribute('aria-checked', on ? 'true' : 'false');
    }

    function isToggleOn(el) {
        return el.classList.contains('on');
    }

    createDefaultToggle.addEventListener('click', () => {
        if (!createState) return;
        const next = !isToggleOn(createDefaultToggle);
        setToggle(createDefaultToggle, next);
        createState.isDefault = next;
    });

    editDefaultToggle.addEventListener('click', () => {
        if (!editState) return;
        const next = !isToggleOn(editDefaultToggle);
        setToggle(editDefaultToggle, next);
        editState.isDefault = next;
        refreshDeleteButtonState();
    });

    // ── Open create ──
    function openCreateSheet() {
        createState = {
            name: '',
            rules: [{ hours: 24, penalty: 0 }, { hours: 0, penalty: 100 }],
            isDefault: POLICIES.length === 0,
        };
        createName.value = '';
        setToggle(createDefaultToggle, createState.isDefault);
        renderRuleList(createRuleList, createState.rules);
        openSheet(createSheet);
        setTimeout(() => createName.focus(), 250);
    }

    createName.addEventListener('input', (e) => {
        if (createState) createState.name = e.target.value;
    });

    btnCreateAddRule.addEventListener('click', () => {
        if (!createState) return;
        createState.rules.push({ hours: 0, penalty: 100 });
        createState.rules = sortRulesDesc(createState.rules);
        renderRuleList(createRuleList, createState.rules);
    });

    btnCreateSubmit.addEventListener('click', () => {
        if (!createState) return;
        const name = (createState.name || '').trim() || 'Без названия';
        if (createState.rules.length < 1) return;

        // If new one is default — clear others
        if (createState.isDefault) {
            POLICIES.forEach(p => { p.isDefault = false; });
        }

        POLICIES.push({
            id: genId(),
            name,
            isDefault: createState.isDefault || POLICIES.length === 0,
            rules: sortRulesDesc(createState.rules),
        });

        closeAllSheets();
        renderPolicies();
        showToast('Политика создана');
    });

    // ── Open edit ──
    function openEditSheet(id) {
        const p = POLICIES.find(x => x.id === id);
        if (!p) return;
        editingId = id;
        editState = {
            name: p.name,
            rules: p.rules.map(r => ({ hours: r.hours, penalty: r.penalty })),
            isDefault: p.isDefault,
        };
        editSheetTitle.textContent = 'Редактировать политику';
        editName.value = p.name;
        setToggle(editDefaultToggle, p.isDefault);
        renderRuleList(editRuleList, editState.rules);
        refreshDeleteButtonState();
        resetDeleteConfirm();
        openSheet(editSheet);
    }

    editName.addEventListener('input', (e) => {
        if (editState) editState.name = e.target.value;
    });

    btnEditAddRule.addEventListener('click', () => {
        if (!editState) return;
        editState.rules.push({ hours: 0, penalty: 100 });
        editState.rules = sortRulesDesc(editState.rules);
        renderRuleList(editRuleList, editState.rules);
    });

    btnEditSave.addEventListener('click', () => {
        if (!editingId || !editState) return;
        const p = POLICIES.find(x => x.id === editingId);
        if (!p) return;
        p.name = (editState.name || '').trim() || p.name;
        p.rules = sortRulesDesc(editState.rules);

        // If toggled to default — clear others
        if (editState.isDefault && !p.isDefault) {
            POLICIES.forEach(x => { x.isDefault = false; });
            p.isDefault = true;
        } else if (!editState.isDefault && p.isDefault) {
            // User tried to turn default off — but we need at least one default
            // Keep it default unless another exists; otherwise enforce back on
            const hasOtherDefault = POLICIES.some(x => x.id !== p.id && x.isDefault);
            if (!hasOtherDefault) {
                p.isDefault = true;
            } else {
                p.isDefault = false;
            }
        }

        closeAllSheets();
        renderPolicies();
        showToast('Сохранено');
    });

    // ── Delete (double-confirm) ──
    function refreshDeleteButtonState() {
        if (!editState) return;
        const p = POLICIES.find(x => x.id === editingId);
        const isDefault = p && p.isDefault;
        if (isDefault) {
            btnEditDelete.setAttribute('disabled', 'true');
            btnEditDelete.disabled = true;
            editDeleteHint.classList.remove('hidden');
        } else {
            btnEditDelete.removeAttribute('disabled');
            btnEditDelete.disabled = false;
            editDeleteHint.classList.add('hidden');
        }
    }

    function resetDeleteConfirm() {
        deleteConfirmArmed = false;
        btnEditDelete.classList.remove('confirming');
        btnEditDelete.textContent = 'Удалить политику';
    }

    btnEditDelete.addEventListener('click', () => {
        if (btnEditDelete.disabled) return;
        if (!deleteConfirmArmed) {
            deleteConfirmArmed = true;
            btnEditDelete.classList.add('confirming');
            btnEditDelete.textContent = 'Подтвердить удаление';
            return;
        }
        // Actually delete
        POLICIES = POLICIES.filter(x => x.id !== editingId);
        editingId = null;
        editState = null;
        closeAllSheets();
        renderPolicies();
        showToast('Политика удалена');
    });

    // ── Toast ──
    let toastTimer = null;
    function showToast(text) {
        toastText.textContent = text;
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    // ── Wire entry points ──
    fab.addEventListener('click', openCreateSheet);
    btnEmptyCreate.addEventListener('click', openCreateSheet);
    overlay.addEventListener('click', closeAllSheets);

    // ── Init ──
    renderPolicies();
})();
