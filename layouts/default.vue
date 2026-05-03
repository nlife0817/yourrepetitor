<template>
  <div class="slidev-layout deck-layout deck-layout--default">
    <DeckHeader />
    <div class="deck-body">
      <slot />
    </div>
    <DeckFooter :page="$slidev.nav.currentPage" :total="$slidev.nav.total" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --slide-w: 1920px;
  --slide-h: 1080px;
  --slide-pad-x: 120px;
  --slide-pad-y: 80px;

  --bg: #f6f5f1;
  --surface: #ffffff;
  --surface-sheet: #fafaf8;

  --border: rgba(0, 0, 0, 0.07);
  --border-divider: rgba(0, 0, 0, 0.05);

  --text-primary: #1a1a1f;
  --text-secondary: #6b6d7b;
  --text-muted: #a0a2b1;

  --accent: #e8734a;
  --accent-hover: #d4663f;
  --accent-soft: rgba(232, 115, 74, 0.1);
  --accent-glow: rgba(232, 115, 74, 0.22);

  --indigo: #6366f1;
  --indigo-soft: rgba(99, 102, 241, 0.12);
  --indigo-text: #4f46e5;
  --orange-text: #c2603a;
  --green-text: #0d9668;
  --success: #10b981;
  --warning: #f59e0b;
  --warning-text: #d97706;
  --danger: #dc2626;
  --dark: #1a1a1f;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-lg: 0 24px 80px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05);
  --shadow-mockup: 0 30px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08);

  --font-sans: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  --slidev-slide-container-background: var(--bg);
}

html, body, #app {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-feature-settings: 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.slidev-layout {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 0;
  --slidev-code-padding: 0;
}

.slidev-layout h1,
.slidev-layout h2,
.slidev-layout h3,
.slidev-layout h4,
.slidev-layout p {
  margin: 0;
  color: inherit;
}

.deck-layout {
  position: relative;
  width: var(--slide-w);
  height: var(--slide-h);
  background: var(--bg);
  color: var(--text-primary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.deck-layout--default .deck-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

@media print {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
</style>
