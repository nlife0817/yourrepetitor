---
layout: default
---
<section class="slide-body s12-body">
  <div class="s12-intro">
    <span class="s12-eyebrow">Команда · Почему именно вы</span>
    <h1 class="s12-headline">
      AI-first основатель: 3+ года в&nbsp;IT-продуктах и&nbsp;<span class="s12-headline-num">84</span> платящих клиента, привлечённых лично
    </h1>
  </div>
  <div class="s12-layout">
    <aside class="s12-photo-wrap">
      <div class="s12-photo">
        <div class="s12-photo-img" role="img" aria-label="Виталий Ожигов"></div>
        <div class="s12-photo-fallback" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="78" r="42" stroke="currentColor" stroke-width="3"/>
            <path d="M30 196 Q30 130 100 130 Q170 130 170 196" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <span>фото: <span class="is-mono">public/team/founder.png</span></span>
        </div>
      </div>
      <blockquote class="s12-quote">
        <p>AI-first модель уже снизила стоимость разработки почти до&nbsp;нуля. Следующий ограничитель&nbsp;— не&nbsp;продукт, а&nbsp;скорость привлечения клиентов.</p>
      </blockquote>
    </aside>
    <main class="s12-content">
      <header class="s12-founder-head">
        <div class="s12-founder-name">
          <span class="s12-founder-eyebrow">Основатель</span>
          <h2 class="s12-founder-title">Виталий Ожигов</h2>
        </div>
        <div class="s12-founder-meta">
          <span class="s12-founder-role">Product Manager / Product Owner</span>
          <span class="s12-founder-edu">НГУ · менеджмент · 2024</span>
        </div>
      </header>
      <div class="s12-cards">
        <article class="s12-card">
          <span class="s12-card-num">01</span>
          <h3 class="s12-card-title">Продуктовый опыт</h3>
          <ul class="s12-card-list">
            <li>3+ года в&nbsp;IT-продуктах</li>
            <li>Экспобанк: корпоративный портал для&nbsp;1&nbsp;500 сотрудников</li>
            <li>МКК Корона (CFT): продукт автоматизации судебного взыскания с&nbsp;процессами на&nbsp;100+&nbsp;млрд&nbsp;₽</li>
            <li>IT-компания: product owner B2B чат-платформы, стратегия, roadmap, операционные показатели</li>
          </ul>
        </article>
        <article class="s12-card">
          <span class="s12-card-num">02</span>
          <h3 class="s12-card-title">AI-first execution</h3>
          <ul class="s12-card-list">
            <li>Спроектировал архитектуру, роли и&nbsp;флоу репетитора, ученика и&nbsp;родителя</li>
            <li>Собрал код и&nbsp;инфраструктуру через Codex и&nbsp;Claude</li>
            <li>Управлял AI-агентами: ставил ТЗ, проверял код, тестировал, вносил правки</li>
            <li>Закрывает продукт, архитектуру, код, продажи и&nbsp;тестирование без&nbsp;раздутой команды</li>
          </ul>
        </article>
        <article class="s12-card is-accent">
          <span class="s12-card-num">03</span>
          <h3 class="s12-card-title">Доказанный результат</h3>
          <ul class="s12-card-list">
            <li><strong>84&nbsp;платящих репетитора</strong> привлечены лично</li>
            <li>Около&nbsp;20% клиентов пришли органически и&nbsp;по&nbsp;сарафану</li>
            <li>Первые каналы: Profi.ru, Авито Услуги, личные контакты</li>
            <li>Наладил первичные платежи и&nbsp;подтвердил спрос в&nbsp;целевом сегменте</li>
          </ul>
        </article>
      </div>
      <footer class="s12-team-model">
        <span class="s12-team-model-label">Модель команды</span>
        <p>Основатель закрывает продукт, архитектуру, код, продажи и&nbsp;тестирование; правовой консультант точечно помогает с&nbsp;офертой, персональными данными и&nbsp;юридическими вопросами мессенджеров.</p>
      </footer>
    </main>
  </div>
</section>

<style>
.s12-body {
  flex: 1;
  padding: 144px var(--slide-pad-x) 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background:
    radial-gradient(circle at 78% 8%, rgba(232, 115, 74, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 6% 94%, rgba(99, 102, 241, 0.05) 0%, transparent 48%),
    var(--bg);
}

.s12-body .s12-intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 1680px;
}

.s12-body .s12-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.s12-body .s12-headline {
  font-size: 44px;
  font-weight: 600;
  letter-spacing: -0.026em;
  line-height: 1.08;
  color: var(--text-primary);
  max-width: 1500px;
}

.s12-body .s12-headline-num {
  font-family: var(--font-mono);
  font-feature-settings: 'tnum';
  font-weight: 600;
  color: var(--orange-text);
  letter-spacing: -0.02em;
}

.s12-body .s12-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 560px 1fr;
  gap: 40px;
  min-height: 0;
}

.s12-body .s12-photo-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 22px;
  overflow: hidden;
  background: var(--surface-sheet);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.s12-body .s12-photo {
  position: relative;
  flex: 1;
  background: linear-gradient(180deg, #ece9e3 0%, #d8d4cb 100%);
  overflow: hidden;
}

.s12-body .s12-photo-img {
  position: absolute;
  inset: 0;
  background-image: url(/team/founder.png);
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  z-index: 1;
}

.s12-body .s12-photo-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: var(--text-muted);
  z-index: 0;
  pointer-events: none;
}

.s12-body .s12-photo-fallback svg {
  width: 144px;
  height: 144px;
  opacity: 0.55;
}

.s12-body .s12-photo-fallback span {
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.s12-body .s12-photo-fallback .is-mono {
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.s12-body .s12-quote {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  background: rgba(26, 26, 31, 0.92);
  color: #f6f5f1;
  border-radius: 14px;
  padding: 18px 22px;
  backdrop-filter: blur(8px);
  z-index: 2;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.20);
  border-left: 3px solid var(--accent);
}

.s12-body .s12-quote p {
  font-size: 17px;
  line-height: 1.45;
  letter-spacing: -0.005em;
  font-weight: 400;
}

.s12-body .s12-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.s12-body .s12-founder-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-divider);
}

.s12-body .s12-founder-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.s12-body .s12-founder-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.s12-body .s12-founder-title {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.024em;
  line-height: 1.05;
  color: var(--text-primary);
}

.s12-body .s12-founder-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right;
}

.s12-body .s12-founder-role {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
}

.s12-body .s12-founder-edu {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-muted);
}

.s12-body .s12-cards {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  min-height: 0;
}

.s12-body .s12-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 22px 22px;
  box-shadow: var(--shadow-sm);
}

.s12-body .s12-card.is-accent {
  background:
    radial-gradient(circle at 100% 0%, rgba(232, 115, 74, 0.14) 0%, transparent 60%),
    linear-gradient(180deg, #fff8f4 0%, #fffdfb 100%);
  border: 1.5px solid var(--accent);
  box-shadow:
    0 0 0 3px rgba(232, 115, 74, 0.05),
    0 8px 18px rgba(232, 115, 74, 0.10),
    var(--shadow-sm);
}

.s12-body .s12-card-num {
  font-family: var(--font-mono);
  font-feature-settings: 'tnum';
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.s12-body .s12-card.is-accent .s12-card-num {
  color: var(--accent);
}

.s12-body .s12-card-title {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-divider);
}

.s12-body .s12-card.is-accent .s12-card-title {
  border-bottom-color: rgba(232, 115, 74, 0.22);
}

.s12-body .s12-card-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0;
  margin: 0;
}

.s12-body .s12-card-list li {
  position: relative;
  padding-left: 16px;
  font-size: 14px;
  line-height: 1.42;
  color: var(--text-secondary);
  letter-spacing: -0.003em;
}

.s12-body .s12-card-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
}

.s12-body .s12-card.is-accent .s12-card-list li::before {
  background: var(--accent);
}

.s12-body .s12-card-list li strong {
  color: var(--text-primary);
  font-weight: 600;
}

.s12-body .s12-team-model {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  padding: 18px 22px;
  background: var(--surface-sheet);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 12px;
  align-items: start;
}

.s12-body .s12-team-model-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  padding-top: 3px;
}

.s12-body .s12-team-model p {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  letter-spacing: -0.003em;
}

@media print {
  .s12-body .s12-photo-wrap,
  .s12-body .s12-card { box-shadow: none !important; }
  .s12-body .s12-card.is-accent { box-shadow: 0 0 0 3px rgba(232, 115, 74, 0.05) !important; }
  .s12-body .s12-quote { box-shadow: none !important; }
}
</style>
