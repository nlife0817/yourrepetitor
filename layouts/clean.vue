<template>
  <div class="slidev-layout deck-layout deck-layout--clean">
    <div class="deck-body">
      <slot />
    </div>
    <DeckFooter :page="$slidev.nav.currentPage" :total="$slidev.nav.total" />
  </div>
</template>

<style>
.deck-layout--clean {
  position: relative;
  width: var(--slide-w);
  height: var(--slide-h);
  background: var(--bg);
  color: var(--text-primary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.deck-layout--clean .deck-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
