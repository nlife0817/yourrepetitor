<template>
  <div class="slidev-layout deck-layout deck-layout--cover">
    <DeckHeader />
    <div class="cover-body">
      <slot />
    </div>
    <DeckFooter :page="$slidev.nav.currentPage" :total="$slidev.nav.total" />
  </div>
</template>

<style>
.deck-layout--cover .cover-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  padding: 184px var(--slide-pad-x) 96px;
  align-items: center;
}
</style>
