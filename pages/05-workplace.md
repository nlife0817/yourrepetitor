---
layout: clean
---
<section class="slide-body s5-body">
  <div class="s5-intro">
    <h1 class="s5-headline">
      Все инструменты для&nbsp;управления 15+&nbsp;учениками&nbsp;— календарь, аналитика, уведомления и&nbsp;многое другое&nbsp;— в&nbsp;одном месте
    </h1>
  </div>
  <div class="s5-mockups">
    <article class="s5-mockup s5-mockup--left">
      <span class="s5-mockup-eyebrow">01 · Календарь</span>
      <div class="s5-phone">
        <div class="s5-phone-screen">
          <iframe src="/product/calendar/index.html" title="Календарь репетитора" loading="eager" frameborder="0" referrerpolicy="no-referrer"></iframe>
        </div>
      </div>
      <p class="s5-mockup-caption">
        Главный экран. Запись, перенос, отмена, ДЗ&nbsp;— в&nbsp;одном месте.
      </p>
    </article>
    <article class="s5-mockup s5-mockup--center">
      <span class="s5-mockup-eyebrow">02 · Аналитика</span>
      <div class="s5-phone">
        <div class="s5-phone-screen">
          <iframe src="/product/analytics/index.html" title="Аналитика" loading="eager" frameborder="0" referrerpolicy="no-referrer"></iframe>
        </div>
      </div>
      <p class="s5-mockup-caption">
        Доход, отмены, нагрузка по&nbsp;предметам&nbsp;— с&nbsp;прокруткой по&nbsp;периоду.
      </p>
    </article>
    <article class="s5-mockup s5-mockup--right">
      <span class="s5-mockup-eyebrow">03 · Уведомления</span>
      <div class="s5-phone">
        <div class="s5-phone-screen">
          <iframe src="/product/profile/notifications.html" title="Настройки уведомлений" loading="eager" frameborder="0" referrerpolicy="no-referrer"></iframe>
        </div>
      </div>
      <p class="s5-mockup-caption">
        Свои правила: за&nbsp;сколько часов, в&nbsp;какой канал, с&nbsp;каким акцентом.
      </p>
    </article>
  </div>
</section>

<style>
.s5-body {
  flex: 1;
  padding: 60px var(--slide-pad-x) 60px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background:
    radial-gradient(circle at 50% 0%, rgba(232, 115, 74, 0.06) 0%, transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
    var(--bg);
}

.s5-body .s5-intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
  text-align: center;
}

.s5-body .s5-headline {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.028em;
  line-height: 1.06;
  color: var(--text-primary);
  text-align: center;
  max-width: 1400px;
}

.s5-body .s5-mockups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
  justify-items: center;
  flex: 1;
  min-height: 0;
}

.s5-body .s5-mockup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 390px;
}

.s5-body .s5-mockup-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  line-height: 1;
}

.s5-body .s5-phone {
  position: relative;
  width: 370px;
  height: 760px;
  flex-shrink: 0;
  border-radius: 44px;
  padding: 6px;
  background: linear-gradient(150deg, #2a2a30 0%, #1a1a1f 30%, #131316 60%, #1f1f24 100%);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 40px 80px rgba(0, 0, 0, 0.28),
    0 16px 32px rgba(0, 0, 0, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.10);
}

.s5-body .s5-phone::before {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 40px;
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 30%, rgba(0, 0, 0, 0.20) 100%);
  pointer-events: none;
  z-index: 0;
}

.s5-body .s5-phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 38px;
  overflow: hidden;
  background: var(--bg);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.s5-body .s5-phone-screen iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: var(--bg);
}

.s5-body .s5-mockup-caption {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary);
  letter-spacing: -0.005em;
  text-align: center;
  max-width: 420px;
}

@media print {
  .s5-body .s5-phone {
    box-shadow:
      0 16px 32px rgba(0, 0, 0, 0.16),
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.06) inset !important;
  }
  .s5-body .s5-phone-screen iframe {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>