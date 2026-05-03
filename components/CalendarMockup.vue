<template>
  <div class="mockup mockup-calendar">
    <div class="mockup-island" aria-hidden="true"></div>
    <div class="mockup-body">
      <div class="app">

        <div class="header">
          <div class="nav-row">
            <div class="view-toggle">
              <button class="active">День</button>
              <button>Неделя</button>
            </div>
            <div class="month-label">Апрель</div>
            <div class="nav-arrows">
              <button class="btn-today">Сегодня</button>
            </div>
          </div>
        </div>

        <div class="week-strip">
          <div class="day-cell"><span class="day-label">Пн</span><span class="day-number">14</span></div>
          <div class="day-cell has-events"><span class="day-label">Вт</span><span class="day-number">15</span></div>
          <div class="day-cell"><span class="day-label">Ср</span><span class="day-number">16</span></div>
          <div class="day-cell has-events"><span class="day-label">Чт</span><span class="day-number">17</span></div>
          <div class="day-cell has-events"><span class="day-label">Пт</span><span class="day-number">18</span></div>
          <div class="day-cell"><span class="day-label">Сб</span><span class="day-number">19</span></div>
          <div class="day-cell today selected has-events"><span class="day-label">Вс</span><span class="day-number">20</span></div>
        </div>

        <div class="schedule-container no-scrollbar">
          <div class="time-grid">
            <div class="time-row"><span class="time-label">11:00</span><div class="time-line"></div></div>
            <div class="time-row">
              <span class="time-label">12:00</span>
              <div class="time-line">
                <div class="event-card variant-orange" style="top:4px;height:52px;">
                  <div class="event-title">Дима Морозов</div>
                  <div class="event-meta">12:00 – 13:00 · Физика</div>
                </div>
              </div>
            </div>
            <div class="time-row"><span class="time-label">13:00</span><div class="time-line"></div></div>
            <div class="time-row">
              <span class="time-label">14:00</span>
              <div class="time-line">
                <div class="event-card variant-indigo" style="top:4px;height:52px;">
                  <div class="event-title">Алиса Козлова</div>
                  <div class="event-meta">14:00 – 15:00 · Математика</div>
                </div>
              </div>
            </div>
            <div class="time-row"><span class="time-label">15:00</span><div class="time-line"></div></div>
            <div class="time-row">
              <span class="time-label">16:00</span>
              <div class="time-line">
                <div class="event-card variant-green" style="top:4px;height:52px;">
                  <div class="event-title">Соня Волкова</div>
                  <div class="event-meta">16:00 – 17:00 · Информатика</div>
                </div>
              </div>
            </div>
            <div class="time-row free-slot-row">
              <span class="time-label">17:00</span>
              <div class="time-line"></div>
            </div>
            <div class="time-row"><span class="time-label">18:00</span><div class="time-line"></div></div>
          </div>
        </div>

        <div class="cal-sheet">
          <div class="sheet-handle-area"><div class="sheet-handle"></div></div>
          <div class="cal-sheet-body">
            <div class="sheet-title">Заявка на запись</div>

            <div class="booking-card">
              <div class="bkp-card-top">
                <div class="bkp-card-avatar avatar-variant variant-indigo">А</div>
                <div class="bkp-card-who">
                  <span class="bkp-card-name">Анна Смирнова</span>
                  <span class="bkp-card-when">18 минут назад</span>
                </div>
                <span class="bkp-card-subject variant-indigo">Математика</span>
              </div>

              <div class="bkp-card-details">
                <div class="bkp-detail-row">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span class="bkp-detail-date">20 апреля (вс), 18:00–19:00</span>
                </div>
                <div class="bkp-detail-row">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
                  <span class="bkp-detail-place">Онлайн</span>
                </div>
              </div>

              <div class="bkp-card-amount">
                <span class="bkp-amount-value">1 900 ₽</span>
                <span class="bkp-amount-template">по шаблону «Индивидуальное»</span>
              </div>

              <div class="bkp-card-actions">
                <button class="bkp-btn-reject">Отклонить</button>
                <button class="bkp-btn-approve">Принять</button>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-bar">
          <nav class="bottom-nav">
            <span class="nav-item active">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Календарь</span>
            </span>
            <span class="nav-item">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <span>Ученики</span>
            </span>
            <span class="nav-item">
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

.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

.header {
  padding: 6px 10px 0;
  flex-shrink: 0;
}
.nav-row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 6px;
  gap: 6px;
}
.view-toggle {
  display: flex;
  background: rgba(0,0,0,0.04);
  border-radius: 7px;
  padding: 2px;
  border: 1px solid rgba(0,0,0,0.07);
  flex-shrink: 0;
}
.view-toggle button {
  padding: 3px 8px;
  border: none;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 500;
  font-family: 'Onest', sans-serif;
  background: transparent;
  color: var(--text-muted);
  cursor: default;
}
.view-toggle button.active {
  background: #fff;
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.month-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  padding: 0 2px;
  white-space: nowrap;
}
.nav-arrows {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}
.btn-today {
  font-size: 10px;
  font-weight: 500;
  font-family: 'Onest', sans-serif;
  padding: 0 10px;
  border-radius: 7px;
  border: 1px solid rgba(0,0,0,0.07);
  background: #fff;
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  white-space: nowrap;
  cursor: default;
}

/* Week strip */
.week-strip {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  padding: 0 8px 6px;
  flex-shrink: 0;
}
.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 3px 0;
  border-radius: 8px;
  position: relative;
}
.day-cell.selected { background: rgba(0,0,0,0.04); }
.day-label {
  font-size: 8px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.day-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  font-weight: 500;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--text-primary);
}
.day-cell.today .day-label  { color: var(--accent); }
.day-cell.today .day-number {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 3px 10px rgba(232,115,74,0.22);
  animation: tr-today-pulse 8s ease-in-out infinite;
}
.day-cell.has-events::after {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--indigo);
  position: absolute;
  bottom: 1px;
}
.day-cell.today.has-events::after { background: #fff; }

@keyframes tr-today-pulse {
  0%, 100% { box-shadow: 0 3px 10px rgba(232,115,74,0.22); }
  50%      { box-shadow: 0 3px 14px rgba(232,115,74,0.45), 0 0 0 3px rgba(232,115,74,0.14); }
}

/* Schedule */
.schedule-container {
  flex: 1;
  overflow: hidden;
  padding: 0 10px;
  min-height: 0;
}
.time-grid {
  position: relative;
  padding: 0 0 8px;
}
.time-row {
  display: flex;
  align-items: flex-start;
  height: 32px;
  position: relative;
}
.time-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  color: var(--text-muted);
  width: 32px;
  flex-shrink: 0;
  line-height: 1;
}
.time-line {
  flex: 1;
  border-top: 1px solid rgba(0,0,0,0.07);
  height: 100%;
  position: relative;
}

/* Event variants */
.variant-orange {
  --v-bg-from: #ffe5d9;
  --v-bg-to:   #ffd0bd;
  --v-border:  rgba(232,115,74,0.3);
  --v-color:   var(--accent);
  --v-text:    var(--orange-text);
}
.variant-indigo {
  --v-bg-from: #e0e2ff;
  --v-bg-to:   #c7caff;
  --v-border:  rgba(99,102,241,0.3);
  --v-color:   var(--indigo);
  --v-text:    var(--indigo-text);
  --v-grad-from: #818cff;
  --v-grad-to:   #6366f1;
}
.variant-green {
  --v-bg-from: #d4f4e3;
  --v-bg-to:   #b8eccd;
  --v-border:  rgba(16,185,129,0.3);
  --v-color:   var(--success);
  --v-text:    var(--green-text);
}

.event-card {
  position: absolute;
  left: 3px;
  right: 3px;
  border-radius: 7px;
  padding: 4px 7px;
  overflow: hidden;
  z-index: 5;
  background: linear-gradient(135deg, var(--v-bg-from), var(--v-bg-to));
  border: 1px solid var(--v-border);
}
.event-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2.5px;
  border-radius: 2.5px 0 0 2.5px;
  background: var(--v-color);
}
.event-title {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1px;
  line-height: 1.15;
}
.event-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  color: var(--text-secondary);
  line-height: 1.15;
}

.free-slot-row .time-line::after {
  content: '';
  position: absolute;
  inset: 2px 3px;
  border-radius: 7px;
  border: 2px solid transparent;
  pointer-events: none;
  animation: tr-slot-highlight 8s ease-in-out infinite;
}
@keyframes tr-slot-highlight {
  0%, 12%    { border-color: transparent; background: transparent; }
  16%, 22%   { border-color: var(--accent); background: rgba(232,115,74,0.10); }
  26%, 34%   { border-color: transparent; background: transparent; }
  38%, 44%   { border-color: var(--accent); background: rgba(232,115,74,0.10); }
  48%, 56%   { border-color: transparent; background: transparent; }
  60%, 66%   { border-color: var(--accent); background: rgba(232,115,74,0.10); }
  70%, 100%  { border-color: transparent; background: transparent; }
}

/* Bottom sheet */
.cal-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 48px;
  background: #fff;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.12), 0 -2px 8px rgba(0,0,0,0.06);
  border-top: 1px solid rgba(0,0,0,0.06);
  padding: 0 0 10px;
  z-index: 30;
  transform: translateY(100%);
  animation: tr-sheet 8s ease-in-out infinite;
}
@keyframes tr-sheet {
  0%         { transform: translateY(100%); }
  12.5%, 100% { transform: translateY(0); }
}
.sheet-handle-area {
  padding: 6px 0 4px;
  display: flex;
  justify-content: center;
}
.sheet-handle {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0,0,0,0.18);
}
.cal-sheet-body {
  padding: 4px 12px 0;
}
.sheet-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.booking-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.bkp-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bkp-card-avatar {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--v-grad-from), var(--v-grad-to));
  flex-shrink: 0;
}
.bkp-card-who {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.bkp-card-name {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bkp-card-when {
  font-size: 9px;
  font-weight: 500;
  color: var(--text-muted);
}
.bkp-card-subject {
  font-size: 8.5px;
  font-weight: 600;
  color: var(--v-text);
  background: var(--v-bg-from);
  border: 1px solid var(--v-border);
  border-radius: 6px;
  padding: 2px 6px;
  flex-shrink: 0;
}
.bkp-card-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
  border-top: 1px solid rgba(0,0,0,0.05);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.bkp-detail-row {
  display: flex;
  align-items: center;
  gap: 7px;
}
.bkp-detail-row svg {
  width: 11px;
  height: 11px;
  color: var(--text-muted);
  flex-shrink: 0;
}
.bkp-detail-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-primary);
}
.bkp-detail-place {
  font-size: 10px;
  color: var(--text-secondary);
}
.bkp-card-amount {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.bkp-amount-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}
.bkp-amount-template {
  font-size: 9px;
  color: var(--text-muted);
  text-align: right;
}
.bkp-card-actions {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}
.bkp-btn-reject {
  flex: 0 0 auto;
  padding: 0 10px;
  height: 28px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  border-radius: 7px;
  font-family: 'Onest', sans-serif;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: default;
}
.bkp-btn-approve {
  flex: 1;
  height: 28px;
  border: none;
  background: var(--accent);
  color: #fff;
  border-radius: 7px;
  font-family: 'Onest', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: default;
  box-shadow: 0 4px 12px rgba(232,115,74,0.22);
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
  .cal-sheet { transform: translateY(0) !important; }
  .free-slot-row .time-line::after {
    border-color: var(--accent) !important;
    background: rgba(232,115,74,0.08) !important;
  }
  .day-cell.today .day-number {
    box-shadow: 0 3px 14px rgba(232,115,74,0.55), 0 0 0 3px rgba(232,115,74,0.18) !important;
  }
}
</style>
