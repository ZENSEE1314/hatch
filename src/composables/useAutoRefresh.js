import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Returns a reactive tick that increments every `ms` milliseconds.
 * Also bumps on cross-tab localStorage changes (storage event).
 * Use `tick.value` inside any computed() to make it auto-refresh.
 */
export function useAutoRefresh(ms = 1500) {
  const tick = ref(0)
  let timer = null

  function bump() { tick.value++ }

  onMounted(() => {
    timer = setInterval(bump, ms)
    window.addEventListener('storage', bump)
  })

  onUnmounted(() => {
    clearInterval(timer)
    window.removeEventListener('storage', bump)
  })

  return tick
}
