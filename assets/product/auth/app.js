/* ══════════════════════════════════════════
   ── auth/app.js — общая логика сервисных экранов ──
   ══════════════════════════════════════════ */

// Все CTA-кнопки на странице — прикрепляем click handlers
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-action="mock"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = el.dataset.mockMsg || 'Действие выполнено (мок)';
            alert(msg);
        });
    });
});
