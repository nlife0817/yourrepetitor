(function() {
    'use strict';
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('on');
            const isOn = toggle.classList.contains('on');
            toggle.setAttribute('aria-checked', isOn);
        });
    });
})();
