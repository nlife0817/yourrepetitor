<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'mobile' | 'desktop'
  label?: string
}>(), {
  variant: 'mobile',
  label: '',
})
</script>

<template>
  <div class="device" :class="`device--${variant}`">
    <div v-if="variant === 'mobile'" class="device__island" aria-hidden="true"></div>
    <div v-if="variant === 'desktop'" class="device__chrome" aria-hidden="true">
      <span class="device__dot"></span>
      <span class="device__dot"></span>
      <span class="device__dot"></span>
    </div>
    <div class="device__body">
      <slot>
        <div class="device__placeholder">
          <span class="device__placeholder-label">{{ label || 'Mockup placeholder' }}</span>
          <span class="device__placeholder-note">Решение по растеризации — в .claude/HANDOFF.md</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.device {
  position: relative;
  background: var(--surface);
  box-shadow: var(--shadow-mockup);
  overflow: hidden;
}
.device--mobile {
  width: 360px;
  height: 760px;
  border-radius: 44px;
  border: 8px solid #1a1a1f;
}
.device--mobile .device__island {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 30px;
  background: #1a1a1f;
  border-radius: 999px;
  z-index: 2;
}
.device--desktop {
  width: 720px;
  height: 480px;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.device--desktop .device__chrome {
  height: 32px;
  background: var(--surface-sheet);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
}
.device--desktop .device__dot {
  width: 12px; height: 12px;
  border-radius: 999px;
  background: var(--text-muted);
  opacity: 0.45;
}
.device--desktop .device__dot:nth-child(1) { background: #ff5f57; opacity: 0.85; }
.device--desktop .device__dot:nth-child(2) { background: #febc2e; opacity: 0.85; }
.device--desktop .device__dot:nth-child(3) { background: #28c840; opacity: 0.85; }
.device__body {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.device--mobile .device__body { padding-top: 50px; }
.device--desktop .device__body { padding-top: 32px; }
.device__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}
.device__placeholder-label {
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.device__placeholder-note {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  max-width: 240px;
}
</style>
