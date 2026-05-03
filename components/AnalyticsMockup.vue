<template>
  <div class="mockup mockup-analytics">
    <div class="mockup-island" aria-hidden="true"></div>
    <div class="mockup-body">
      <div class="app">

        <div class="page-header">
          <h1 class="page-title">Аналитика</h1>
        </div>

        <div class="analytics-content no-scrollbar">

          <div class="period-sticky">
            <div class="period-switcher" role="tablist" aria-label="Период">
              <button class="picker-chip">7 дней</button>
              <button class="picker-chip active">30 дней</button>
              <button class="picker-chip">3 месяца</button>
              <button class="picker-chip">12 мес.</button>
            </div>
            <div class="period-range">1 — 30 апреля</div>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-label">Выручка</div>
              <div class="summary-value summary-value-counter">
                <span class="counter-up counter-up-revenue" aria-label="186 400 ₽">
                  <span class="counter-stack">
                    <span class="counter-step">₽ 0</span>
                    <span class="counter-step">₽ 47 200</span>
                    <span class="counter-step">₽ 112 800</span>
                    <span class="counter-step">₽ 156 000</span>
                    <span class="counter-step">₽ 186 400</span>
                  </span>
                </span>
              </div>
              <div class="summary-trend up">↑ +14%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Занятий</div>
              <div class="summary-value summary-value-counter">
                <span class="counter-up counter-up-lessons" aria-label="47">
                  <span class="counter-stack">
                    <span class="counter-step">0</span>
                    <span class="counter-step">12</span>
                    <span class="counter-step">28</span>
                    <span class="counter-step">41</span>
                    <span class="counter-step">47</span>
                  </span>
                </span>
              </div>
              <div class="summary-trend up">↑ +8%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Новые ученики</div>
              <div class="summary-value">3</div>
              <div class="summary-trend flat">—</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Средний чек</div>
              <div class="summary-value">₽ 1 900</div>
              <div class="summary-trend up">↑ +2%</div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-toggle" role="tablist">
              <button class="chart-toggle-btn active">Выручка</button>
              <button class="chart-toggle-btn">Занятия</button>
            </div>
            <div class="chart-canvas">
              <svg viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="tr-an-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e8734a" stop-opacity="0.28"/>
                    <stop offset="100%" stop-color="#e8734a" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <path class="chart-area" d="M 0 110 L 35.5 95.4 L 71.1 113.7 L 106.6 84.4 L 142.2 102.7 L 177.7 80.7 L 213.3 87.0 L 248.8 71.7 L 284.4 92.3 L 320 79.5 L 320 140 L 0 140 Z"/>
                <path class="chart-line" d="M 0 110 L 35.5 95.4 L 71.1 113.7 L 106.6 84.4 L 142.2 102.7 L 177.7 80.7 L 213.3 87.0 L 248.8 71.7 L 284.4 92.3 L 320 79.5"/>
                <g class="chart-dots">
                  <circle class="chart-dot chart-dot-1" cx="0"     cy="110"   r="3"/>
                  <circle class="chart-dot chart-dot-2" cx="106.6" cy="84.4"  r="3"/>
                  <circle class="chart-dot chart-dot-3" cx="213.3" cy="87.0"  r="3"/>
                  <circle class="chart-dot chart-dot-4" cx="320"   cy="79.5"  r="3"/>
                </g>
                <g class="chart-callout" aria-hidden="true">
                  <rect x="276" y="56" width="44" height="16" rx="4"/>
                  <text x="298" y="67" text-anchor="middle">+14%</text>
                </g>
              </svg>
            </div>
            <div class="chart-x-axis">
              <span>1</span><span>10</span><span>20</span><span>30</span>
            </div>
          </div>

          <div class="section-head">
            <div class="analytics-section-label">Разбивка · по ученикам</div>
          </div>

          <ul class="breakdown-list">
            <li class="breakdown-row">
              <div class="breakdown-avatar avatar-variant variant-orange">АС</div>
              <span class="breakdown-name">Алина Соколова</span>
              <div class="breakdown-right">
                <div class="bar-mini"><div class="bar-mini-fill" style="width:100%"></div></div>
                <span class="breakdown-value">₽ 62 000</span>
              </div>
            </li>
            <li class="breakdown-row">
              <div class="breakdown-avatar avatar-variant variant-indigo">МП</div>
              <span class="breakdown-name">Марк Павлов</span>
              <div class="breakdown-right">
                <div class="bar-mini"><div class="bar-mini-fill" style="width:78%"></div></div>
                <span class="breakdown-value">₽ 48 000</span>
              </div>
            </li>
            <li class="breakdown-row">
              <div class="breakdown-avatar avatar-variant variant-green">ДР</div>
              <span class="breakdown-name">Даша Романова</span>
              <div class="breakdown-right">
                <div class="bar-mini"><div class="bar-mini-fill" style="width:55%"></div></div>
                <span class="breakdown-value">₽ 34 000</span>
              </div>
            </li>
          </ul>

        </div>

        <div class="bottom-bar">
          <nav class="bottom-nav">
            <span class="nav-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Календарь</span>
            </span>
            <span class="nav-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Ученики</span>
            </span>
            <span class="nav-item active">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Аналитика</span>
            </span>
            <span class="nav-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Профиль</span>
            </span>
          </nav>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Frame */
.mockup {
  position: relative;
  background: #1a1a1f;
  border-radius: 44px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10);
  padding: 8px;
  width: 300px;
  height: 600px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.mockup-island {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 28px;
  border-radius: 14px;
  background: #1a1a1f;
  z-index: 50;
  pointer-events: none;
}
.mockup-body {
  width: 100%;
  height: 100%;
  background: var(--bg);
  border-radius: 36px;
  overflow: hidden;
  position: relative;
}
.mockup-body .app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'Onest', sans-serif;
  padding-top: 48px;
  position: relative;
}

/* Header */
.page-header {
  padding: 8px 14px 6px;
  flex-shrink: 0;
}
.page-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--text-primary);
  margin: 0;
}

.analytics-content {
  flex: 1;
  overflow: hidden;
  padding: 0 14px 0;
}
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

.period-sticky {
  background: var(--bg);
  padding: 6px 0 10px;
}
.period-switcher {
  display: flex;
  gap: 4px;
}
.picker-chip {
  flex: 1;
  min-width: 0;
  padding: 6px 4px;
  font-family: 'Onest', sans-serif;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 999px;
  cursor: default;
  line-height: 1;
  white-space: nowrap;
}
.picker-chip.active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(26,26,31,0.2);
}
.period-range {
  margin-top: 6px;
  font-size: 10.5px;
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: -0.1px;
}

/* Summary cards 2×2 */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}
.summary-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  padding: 9px 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.summary-label {
  font-size: 8.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.summary-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--text-primary);
  line-height: 1.05;
  animation: tr-revenue-in 8s ease-out infinite;
}
.summary-value-counter {
  animation: none;
  overflow: visible;
}
.counter-up {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  vertical-align: top;
  animation: tr-counter-glow 2s ease-in-out infinite;
  animation-delay: 4s;
}
.counter-stack {
  display: flex;
  flex-direction: column;
  will-change: transform;
}
.counter-stack .counter-step {
  display: block;
  height: 16px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}
.counter-up-revenue .counter-stack,
.counter-up-lessons .counter-stack {
  animation: tr-counter-5 8s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}
@keyframes tr-counter-5 {
  0%   { transform: translateY(0); }
  10%  { transform: translateY(-16px); }
  20%  { transform: translateY(-32px); }
  30%  { transform: translateY(-48px); }
  37.5%, 100% { transform: translateY(-64px); }
}
@keyframes tr-counter-glow {
  0%, 100% { text-shadow: none; }
  50%      { text-shadow: 0 0 12px rgba(232, 115, 74, 0.55); }
}
@keyframes tr-revenue-in {
  0%       { opacity: 0.55; transform: scale(0.96); }
  6.25%, 100% { opacity: 1; transform: scale(1); }
}
.summary-trend {
  font-size: 10px;
  font-weight: 500;
}
.summary-trend.up   { color: var(--green-text); }
.summary-trend.flat { color: var(--text-muted); }
.summary-trend.down { color: var(--danger); }

/* Chart card */
.chart-card {
  margin-top: 8px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  padding: 9px 10px 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  color: var(--accent);
}
.chart-toggle {
  display: inline-flex;
  gap: 3px;
  padding: 2px;
  background: rgba(0,0,0,0.05);
  border-radius: 8px;
  margin-bottom: 6px;
}
.chart-toggle-btn {
  border: none;
  background: transparent;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  cursor: default;
  line-height: 1;
}
.chart-toggle-btn.active {
  background: #fff;
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}
.chart-canvas {
  width: 100%;
  height: 70px;
  color: var(--accent);
}
.chart-canvas svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}
.chart-area  { fill: url(#tr-an-gradient); }
.chart-line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: tr-chart-draw 8s ease-in-out infinite;
}
.chart-dots circle {
  fill: currentColor;
  opacity: 0;
}
.chart-x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  color: var(--text-muted);
}
@keyframes tr-chart-draw {
  0%, 6%     { stroke-dashoffset: 800; }
  50%, 100%  { stroke-dashoffset: 0; }
}
.chart-dots .chart-dot {
  animation: tr-chart-dot-step 8s ease-out infinite;
}
@keyframes tr-chart-dot-step {
  0%, 37%    { opacity: 0; transform: scale(0.6); transform-origin: center; }
  50%, 100%  { opacity: 1; transform: scale(1); }
}
.chart-dot-1 { animation-name: tr-dot-1; }
.chart-dot-2 { animation-name: tr-dot-2; }
.chart-dot-3 { animation-name: tr-dot-3; }
.chart-dot-4 { animation-name: tr-dot-4; }
@keyframes tr-dot-1 { 0%, 37% { opacity: 0; } 40%, 100% { opacity: 1; } }
@keyframes tr-dot-2 { 0%, 42% { opacity: 0; } 45%, 100% { opacity: 1; } }
@keyframes tr-dot-3 { 0%, 47% { opacity: 0; } 50%, 100% { opacity: 1; } }
@keyframes tr-dot-4 { 0%, 50% { opacity: 0; } 53%, 100% { opacity: 1; } }

.chart-callout rect {
  fill: rgba(232, 115, 74, 0.14);
  stroke: rgba(232, 115, 74, 0.55);
  stroke-width: 1;
}
.chart-callout text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  font-weight: 700;
  fill: var(--orange-text);
}
.chart-callout {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: tr-callout-in 8s ease-out infinite;
}
@keyframes tr-callout-in {
  0%, 50%   { opacity: 0; transform: translateY(4px) scale(0.9); }
  56%, 100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Section head + breakdown */
.section-head {
  padding: 10px 0 6px;
}
.analytics-section-label {
  font-size: 8.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.9px;
}

.breakdown-list {
  list-style: none;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.breakdown-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  position: relative;
}
.breakdown-row + .breakdown-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  height: 1px;
  background: rgba(0,0,0,0.05);
}

/* Avatar variants */
.avatar-variant.variant-orange {
  --v-bg-from: #ffe5d9;
  --v-bg-to:   #ffd0bd;
  --v-border:  rgba(232,115,74,0.3);
  --v-text:    var(--orange-text);
  --v-color:   var(--accent);
  --v-grad-from: #ff9b6b;
  --v-grad-to:   #e8734a;
}
.avatar-variant.variant-indigo {
  --v-bg-from: #e0e2ff;
  --v-bg-to:   #c7caff;
  --v-border:  rgba(99,102,241,0.3);
  --v-text:    var(--indigo-text);
  --v-color:   var(--indigo);
  --v-grad-from: #818cff;
  --v-grad-to:   #6366f1;
}
.avatar-variant.variant-green {
  --v-bg-from: #d4f4e3;
  --v-bg-to:   #b8eccd;
  --v-border:  rgba(16,185,129,0.3);
  --v-text:    var(--green-text);
  --v-color:   var(--success);
  --v-grad-from: #34d399;
  --v-grad-to:   #10b981;
}

.breakdown-avatar {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--v-text);
  background: linear-gradient(135deg, var(--v-bg-from), var(--v-bg-to));
  border: 1px solid var(--v-border);
  flex-shrink: 0;
}
.breakdown-name {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.breakdown-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.bar-mini {
  width: 28px;
  height: 3px;
  border-radius: 2px;
  background: var(--accent-soft);
  overflow: hidden;
}
.bar-mini-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
}
.breakdown-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 44px;
  text-align: right;
}

/* Bottom navigation */
.bottom-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 48px;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,0.06);
  z-index: 20;
}
.bottom-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 100%;
  align-items: center;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 8.5px;
  font-weight: 500;
}
.nav-item svg {
  width: 16px;
  height: 16px;
}
.nav-item.active { color: var(--accent); }

@media print {
  .mockup, .mockup * {
    animation: none !important;
    transition: none !important;
  }
  .summary-value { opacity: 1 !important; transform: none !important; }
  .chart-line    { stroke-dashoffset: 0 !important; }
  .chart-dots circle { opacity: 1 !important; transform: none !important; }
  .counter-stack { transform: translateY(-64px) !important; }
  .chart-callout { opacity: 1 !important; transform: none !important; }
}
</style>
