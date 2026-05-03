<script setup lang="ts">
defineProps<{
  page: number
  total: number
}>()

const fmt = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <footer class="deck-footer">
    <span class="deck-footer__page">{{ fmt(page) }}&nbsp;/&nbsp;{{ fmt(total) }}</span>
  </footer>
</template>

<style scoped>
.deck-footer {
  position: absolute;
  bottom: 44px;
  left: var(--slide-pad-x);
  right: var(--slide-pad-x);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.deck-footer__page {
  font-family: var(--font-mono);
  font-feature-settings: 'tnum';
  font-weight: 500;
  font-size: 17px;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}
</style>
