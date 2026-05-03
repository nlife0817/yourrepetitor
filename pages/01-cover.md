---
layout: cover
---
<div class="cover-text">
<h1 class="cover-title">Твой репетитор</h1>
<p class="cover-tagline">
  Инструмент для частных репетиторов, встроенный в&nbsp;МАКС, ВКонтакте и&nbsp;Телеграм — повышаем конверсию, уменьшаем отмены, автоматизируем рутину.
</p>
<p class="cover-tagline">
  Помогаем <span class="accent-num">400&nbsp;000</span> репетиторам в&nbsp;России превратить хобби в&nbsp;управляемый бизнес — без таблиц, инструкций и&nbsp;часов на&nbsp;настройку.
</p>
<dl class="cover-meta">
  <div>
    <dt>Основатель</dt>
    <dd>Виталий Ожигов</dd>
  </div>
  <div>
    <dt>Email</dt>
    <dd class="is-mono">ozhigovvv@gmail.com</dd>
  </div>
  <div>
    <dt>Клиенты</dt>
    <dd class="cover-meta__clients">
      <span class="client-pulse" aria-hidden="true"></span>
      <span><span class="is-mono client-num">84</span> платящих репетитора</span>
    </dd>
  </div>
  <div>
    <dt>Интерактивная презентация</dt>
    <dd><a class="is-mono" href="https://nlife0817.github.io/yourrepetitor/" target="_blank" rel="noopener">presentation.ru</a></dd>
  </div>
</dl>
</div>
<div class="cover-mockups">
  <AnalyticsMockup class="cover-mockups__analytics" />
  <CalendarMockup class="cover-mockups__calendar" />
</div>

<style>
.cover-text {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cover-title {
  font-size: 128px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.cover-tagline {
  font-size: 28px;
  font-weight: 400;
  line-height: 1.32;
  color: var(--text-secondary);
  letter-spacing: -0.005em;
  max-width: 720px;
}
.cover-tagline .accent-num {
  color: var(--orange-text);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.cover-meta {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 24px 48px;
  margin-top: 24px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  align-items: flex-start;
  justify-content: start;
}
.cover-meta dt {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.cover-meta dd {
  font-size: 19px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.2;
}
.cover-meta dd.is-mono,
.cover-meta dd a.is-mono {
  font-family: var(--font-mono);
  font-size: 18px;
  letter-spacing: -0.01em;
}
.cover-meta a.is-mono {
  color: var(--accent);
  text-decoration: none;
}
.cover-meta__clients {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.client-pulse {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.18);
  flex-shrink: 0;
}
.client-pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid var(--success);
  opacity: 0;
  animation: tr-client-pulse 2s ease-out infinite;
}
@keyframes tr-client-pulse {
  0%   { transform: scale(0.9); opacity: 0.5; }
  70%  { transform: scale(1.8); opacity: 0; }
  100% { transform: scale(2);   opacity: 0; }
}
.client-num {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.cover-mockups {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 760px;
  perspective: 2000px;
  transform-style: preserve-3d;
}
.cover-mockups__analytics {
  position: absolute !important;
  top: 0;
  right: 0;
  z-index: 2;
  transform: perspective(2000px) rotateY(-10deg) rotateX(2deg) rotate(2deg);
  transform-origin: center center;
  animation: tr-analytics-rise 8s ease-in-out infinite;
}
.cover-mockups__calendar {
  position: absolute !important;
  top: 140px;
  left: 30px;
  z-index: 1;
  transform: perspective(2000px) rotateY(-14deg) rotateX(3deg) rotate(-3deg);
  transform-origin: center center;
}
@keyframes tr-analytics-rise {
  0% {
    transform: perspective(2000px) rotateY(-10deg) rotateX(2deg) rotate(2deg) translateY(6px) scale(0.985);
    opacity: 0.6;
  }
  6.25%, 100% {
    transform: perspective(2000px) rotateY(-10deg) rotateX(2deg) rotate(2deg) translateY(0) scale(1);
    opacity: 1;
  }
}

@media print {
  .client-pulse::after { animation: none; }
  .cover-mockups__analytics {
    transform: perspective(2000px) rotateY(-10deg) rotateX(2deg) rotate(2deg) !important;
    opacity: 1 !important;
    animation: none !important;
  }
}
</style>