<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'full' | 'light'
}>(), {
  variant: 'full',
})
</script>

<template>
  <header class="deck-header">
    <img class="deck-header__brand" src="/logo-tr.png" alt="Твой репетитор">
    <div class="deck-header__right">
      <img class="deck-header__grant" src="/logos/sozdaj-nashe.png" alt="Создай НАШЕ 2026">
      <template v-if="variant === 'full'">
        <span class="deck-header__divider" aria-hidden="true"></span>
        <div class="deck-header__partners">
          <img src="/logos/asi.png" alt="Агентство стратегических инициатив">
          <img src="/logos/delovaya-rossiya.png" alt="Деловая Россия">
          <img src="/logos/msp.png" alt="Корпорация МСП">
        </div>
      </template>
    </div>
  </header>
</template>

<style scoped>
.deck-header {
  position: absolute;
  top: 56px;
  left: var(--slide-pad-x);
  right: var(--slide-pad-x);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.deck-header__brand {
  height: 64px;
  width: auto;
  max-width: 240px;
  object-fit: contain;
}

.deck-header__grant {
  height: 64px;
  width: auto;
  object-fit: contain;
  opacity: 0.95;
}

.deck-header__right {
  display: flex;
  align-items: center;
  gap: 28px;
}

.deck-header__divider {
  width: 1px;
  height: 36px;
  background: var(--border);
}

.deck-header__partners {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #1a1a1f;
  border-radius: 10px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.deck-header__partners img {
  height: 36px;
  width: auto;
  object-fit: contain;
  opacity: 0.95;
}

@media print {
  .deck-header__partners img { opacity: 1; }
}
</style>
