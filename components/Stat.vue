<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  delta?: string
  trend?: 'up' | 'down' | 'flat'
}>()
</script>

<template>
  <div class="stat">
    <div class="stat__label">{{ label }}</div>
    <div class="stat__value is-mono">{{ value }}</div>
    <div v-if="delta" class="stat__delta" :class="trend ? `stat__delta--${trend}` : ''">{{ delta }}</div>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat__label {
  font-size: 18px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.stat__value {
  font-size: 96px;
  font-weight: 500;
  line-height: 1;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  font-feature-settings: 'tnum' 1, 'ss01' 1;
}
.stat__delta {
  font-size: 18px;
  color: var(--text-secondary);
}
.stat__delta--up { color: var(--green-text); }
.stat__delta--down { color: var(--danger); }
.stat__delta--flat { color: var(--text-muted); }
</style>
