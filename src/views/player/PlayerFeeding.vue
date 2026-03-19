<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">❤️ Feed Monsters</div>
        <div style="width:36px"></div>
      </div>
    </div>

    <!-- WALLET BOXES -->
    <div class="wallet-row">
      <div class="wallet-box">
        <div class="wb-icon">🔒</div>
        <div class="wb-label">Locked Cash</div>
        <div class="wb-val">${{ Number(playerStore.user.cash).toFixed(2) }}</div>
        <div class="wb-sub">From hatching</div>
      </div>
      <div class="wallet-box green-box">
        <div class="wb-icon">💰</div>
        <div class="wb-label">Ads Earned</div>
        <div class="wb-val green">${{ Number(playerStore.user.withdrawableCash || 0).toFixed(6) }}</div>
        <div class="wb-sub">Withdrawable</div>
      </div>
      <div class="wallet-box purple-box">
        <div class="wb-icon">🥚</div>
        <div class="wb-label">Egg Portfolio</div>
        <div class="wb-val purple">${{ totalEggValue.toFixed(2) }}</div>
        <div class="wb-sub">Total egg value</div>
      </div>
    </div>

    <!-- NO MONSTERS -->
    <div v-if="monsters.length === 0" class="empty-body">
      <div style="font-size:56px">🐾</div>
      <div style="font-family:'Fredoka One',cursive;font-size:18px;color:var(--text2);margin-top:16px">No monsters yet!</div>
      <div style="font-size:12px;font-weight:700;color:var(--text3);margin-top:6px">Hatch an egg to get your first monster.</div>
      <button class="btn btn-primary" style="margin-top:20px" @click="$router.push('/player/hatching')">Go to Hatching →</button>
    </div>

    <!-- INDIVIDUAL MONSTER FEED LIST -->
    <div v-else style="padding:0 14px 100px">
      <div class="monsters-title">🐾 Your Monsters — Feed Individually</div>

      <div v-for="m in monsters" :key="m.id" class="monster-feed-card" :class="{ starving: liveHp(m) === 0, hungry: liveHp(m) > 0 && liveHp(m) < 100, full: liveHp(m) === 100 }">
        <!-- Left: emoji + name -->
        <div class="mfc-left">
          <div class="mfc-emoji" v-html="getMonsterImage(m)"></div>
          <div class="mfc-streak">🔥 {{ m.streak || 0 }}×</div>
        </div>

        <!-- Middle: info + hunger bar -->
        <div class="mfc-mid">
          <div class="mfc-name">{{ m.name }}</div>
          <div class="mfc-tier">{{ m.tier }} · {{ m.set }}</div>

          <!-- Hunger / HP bar (drips over 3h) -->
          <div class="hunger-label-row">
            <span class="hunger-label" :class="{ red: liveHp(m) === 0, orange: liveHp(m) > 0 && liveHp(m) < 50 }">
              {{ liveHp(m) === 0 ? '😵 Starving!' : liveHp(m) === 100 ? '✅ Full' : `😤 ${liveHp(m)}% hungry` }}
            </span>
            <span class="hunger-timer" :class="{ red: liveHp(m) === 0 }">
              {{ liveHp(m) === 0 ? 'Feed now!' : liveHp(m) === 100 ? `full for ${hungerTimeLeft(m)}` : `starves in ${hungerTimeLeft(m)}` }}
            </span>
          </div>
          <div class="hunger-bar-wrap">
            <div class="hunger-bar-fill" :style="{ width: liveHp(m) + '%', background: hpGradient(liveHp(m)) }"></div>
          </div>

          <!-- Earn per feed -->
          <div class="earn-label">+S${{ (getEggValue(m) * monsterRate(m) / 3).toFixed(6) }} per feed</div>
        </div>

        <!-- Right: feed button -->
        <div class="mfc-right">
          <button
            class="feed-btn"
            :class="{ disabled: !canFeed(m) }"
            :disabled="!canFeed(m)"
            @click="startFeed(m)">
            <span v-if="liveHp(m) === 100">🍖 Re-feed</span>
            <span v-else>🍖 Feed!</span>
          </button>
          <div v-if="!canFeed(m)" class="feed-reason">
            <span v-if="fd.todayFeedings >= 3">No sessions left</span>
            <span v-else-if="cooldownActive">{{ shortCooldown }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- AD MODAL -->
    <div v-if="adModal" class="ad-overlay">
      <div class="ad-box">
        <div class="ad-title">📺 Watching Ad for {{ adTarget?.name }}</div>
        <div class="ad-screen">
          <div style="font-size:48px;animation:ad-bounce 0.8s ease-in-out infinite">🎮</div>
          <div style="font-family:'Fredoka One',cursive;font-size:16px;color:#fff;margin-top:12px">HATCHME Premium</div>
          <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px">Get more eggs, earn more!</div>
        </div>
        <div class="ad-progress-wrap">
          <div class="ad-progress-bar" :style="{ width: ((adDuration - adLeft) / adDuration * 100) + '%' }"></div>
        </div>
        <div class="ad-countdown">{{ adLeft }}s remaining</div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-pop">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>

  </div>
  <BottomNav active="monsters" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import { getMonsterImage } from '@/data/monsterImages.js'

// ── Per-monster streak rates ─────────────────────────────────────
const STREAK_RATES = [
  { min:22, rate:0.00035 }, { min:15, rate:0.0003 },
  { min:8,  rate:0.0002  }, { min:0,  rate:0.0001 },
]
function monsterRate(m) {
  const s = m?.streak || 0
  return (STREAK_RATES.find(t => s >= t.min) || STREAK_RATES[3]).rate
}

// ── Tier fallback egg value ──────────────────────────────────────
const TIER_DEFAULT_VALUE = { Bronze:5, Silver:20, Gold:50, Diamond:100, Mystic:200 }
function getEggValue(m) {
  return (m.eggValue && m.eggValue > 0) ? m.eggValue : (TIER_DEFAULT_VALUE[m.tier] || 5)
}

// ── Live clock ──────────────────────────────────────────────────
const now = ref(Date.now())
let ticker = null
onMounted(() => {
  playerStore.checkDayRollover()
  ticker = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => { clearInterval(ticker); clearInterval(adTimer) })

// ── Per-monster HP — drips 100→0 over 3 hours ───────────────────
const HUNGER_MS = 3 * 60 * 60 * 1000
function liveHp(m) {
  if (!m.lastFedAt) return m.hp ?? 0  // legacy: never fed = starving
  const elapsed = now.value - m.lastFedAt
  return Math.max(0, Math.round(100 - (elapsed / HUNGER_MS) * 100))
}
function hungerTimeLeft(m) {
  if (!m.lastFedAt) return '--'
  const elapsed = now.value - m.lastFedAt
  if (elapsed >= HUNGER_MS) return 'starving now'
  const ms = HUNGER_MS - elapsed
  const h  = Math.floor(ms / 3600000)
  const mn = Math.floor((ms % 3600000) / 60000)
  const s  = Math.floor((ms % 60000) / 1000)
  return `${h}h ${String(mn).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
}
function hpGradient(hp) {
  if (hp > 60) return 'linear-gradient(90deg,#66bb6a,#2e7d32)'
  if (hp > 30) return 'linear-gradient(90deg,#ffa726,#f57c00)'
  return 'linear-gradient(90deg,#ef5350,#c62828)'
}

// ── Global session cooldown (3h between sessions) ───────────────
const COOLDOWN_MS = 3 * 60 * 60 * 1000
const fd = computed(() => playerStore.feedingData)
const cooldownActive = computed(() => {
  if (!fd.value.lastFeedingAt) return false
  return (now.value - fd.value.lastFeedingAt) < COOLDOWN_MS
})
const shortCooldown = computed(() => {
  if (!cooldownActive.value) return ''
  const ms = COOLDOWN_MS - (now.value - fd.value.lastFeedingAt)
  const h  = Math.floor(ms / 3600000)
  const m  = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
})

function canFeed(m) {
  return fd.value.todayFeedings < 3 && !cooldownActive.value
}

// ── Totals ──────────────────────────────────────────────────────
const monsters     = computed(() => playerStore.monsters)
const totalEggValue = computed(() => monsters.value.reduce((s, m) => s + getEggValue(m), 0))

// ── Ad simulation ───────────────────────────────────────────────
const adModal    = ref(false)
const adLeft     = ref(0)
const adDuration = ref(15)
const adTarget   = ref(null)
const toast      = ref('')
let adTimer = null

function startFeed(m) {
  if (!canFeed(m)) return
  adTarget.value   = m
  const duration   = Math.floor(Math.random() * 16) + 15
  adDuration.value = duration
  adLeft.value     = duration
  adModal.value    = true
  adTimer = setInterval(() => {
    adLeft.value--
    if (adLeft.value <= 0) { clearInterval(adTimer); adModal.value = false; completeFeed() }
  }, 1000)
}

function completeFeed() {
  const m = adTarget.value
  if (!m) return

  // Reset THIS monster's hunger timer
  m.lastFedAt = Date.now()
  m.streak    = (m.streak || 0) + 1
  m.status    = 'fed'
  m.hp        = 100

  // Reward based on this monster's egg value only
  const reward = getEggValue(m) * monsterRate(m) / 3

  // Quest progress: +1 for this feed
  playerStore.quests.forEach(q => {
    if (q.category === 'Feed' && q.enabled && !q.done) {
      q.progress = Math.min(q.target, (q.progress || 0) + 1)
      q.claimable = q.progress >= q.target
    }
  })
  playerStore.recordFeeding(reward)

  toast.value = `🍖 ${m.name} fed! +S$${reward.toFixed(6)} withdrawable`
  setTimeout(() => { toast.value = '' }, 3500)
  adTarget.value = null
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 16px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }

/* Wallet boxes */
.wallet-row { display:flex; gap:8px; margin:14px 14px 0; }
.wallet-box { flex:1; background:#fff; border-radius:18px; border:3px solid #e0d7ff; padding:12px 6px; text-align:center; box-shadow:0 4px 0 #d4c8ff; }
.wallet-box.green-box { border-color:#a5d6a7; box-shadow:0 4px 0 #c8e6c9; }
.wallet-box.purple-box { border-color:#ce93d8; box-shadow:0 4px 0 #e1bee7; }
.wb-icon { font-size:18px; margin-bottom:3px; }
.wb-label { font-size:9px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:.3px; }
.wb-val { font-family:'Fredoka One',cursive; font-size:13px; color:var(--text); margin:3px 0 2px; word-break:break-all; }
.wb-val.green { color:#2e7d32; }
.wb-val.purple { color:#7b1fa2; }
.wb-sub { font-size:9px; color:var(--text3); font-weight:700; }

/* Monster feed cards */
.monsters-title { font-family:'Fredoka One',cursive; font-size:15px; color:var(--text); margin:14px 0 10px; }
.monster-feed-card { display:flex; align-items:center; gap:10px; background:#fff; border-radius:20px; border:3px solid #e0d7ff; padding:14px 12px; margin-bottom:10px; box-shadow:0 3px 0 #d4c8ff; }
.monster-feed-card.starving { border-color:#e53935; box-shadow:0 3px 0 #ef9a9a; animation:starve-pulse 1.5s ease-in-out infinite; }
.monster-feed-card.hungry { border-color:#ff9800; box-shadow:0 3px 0 #ffcc80; }
.monster-feed-card.full { border-color:#a5d6a7; box-shadow:0 3px 0 #c8e6c9; }
@keyframes starve-pulse { 0%,100%{border-color:#e53935} 50%{border-color:#ff5722} }

.mfc-left { display:flex; flex-direction:column; align-items:center; gap:4px; flex-shrink:0; }
.mfc-emoji { width:52px; height:52px; flex-shrink:0; }
.mfc-streak { font-size:9px; font-weight:800; color:var(--orange); }
.mfc-mid { flex:1; min-width:0; }
.mfc-name { font-family:'Fredoka One',cursive; font-size:14px; color:var(--text); }
.mfc-tier { font-size:9px; font-weight:800; color:var(--text3); text-transform:uppercase; margin-bottom:5px; }
.hunger-label-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:3px; }
.hunger-label { font-size:10px; font-weight:800; color:var(--text2); }
.hunger-label.orange { color:#e65100; }
.hunger-label.red { color:#e53935; }
.hunger-timer { font-size:9px; font-weight:800; color:var(--text3); }
.hunger-timer.red { color:#e53935; }
.hunger-bar-wrap { width:100%; height:8px; background:#f0eeff; border-radius:4px; overflow:hidden; border:1px solid #e0d7ff; }
.hunger-bar-fill { height:100%; border-radius:3px; transition:width 1s linear; }
.earn-label { font-size:9px; font-weight:800; color:#2e7d32; margin-top:4px; }
.mfc-right { flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:4px; }
.feed-btn { background:linear-gradient(135deg,#ff9800,#f57c00); border:none; color:#fff; padding:8px 12px; border-radius:12px; font-family:'Fredoka One',cursive; font-size:13px; cursor:pointer; white-space:nowrap; }
.feed-btn.disabled { background:#e0e0e0; color:#9e9e9e; cursor:not-allowed; }
.feed-reason { font-size:9px; font-weight:800; color:#e65100; text-align:center; max-width:60px; }

/* Tier card */

/* Empty */
.empty-body { display:flex; flex-direction:column; align-items:center; padding:60px 20px; text-align:center; }

/* AD modal */
.ad-overlay { position:fixed; inset:0; background:rgba(0,0,0,.85); z-index:500; display:flex; align-items:center; justify-content:center; }
.ad-box { background:#fff; border-radius:24px; padding:24px 20px; width:300px; display:flex; flex-direction:column; align-items:center; }
.ad-title { font-family:'Fredoka One',cursive; font-size:15px; color:var(--text); margin-bottom:12px; text-align:center; }
.ad-screen { background:linear-gradient(135deg,#1a1f3c,#7c4dff); border-radius:16px; width:100%; padding:30px 20px; display:flex; flex-direction:column; align-items:center; margin-bottom:14px; }
.ad-progress-wrap { width:100%; height:8px; background:#f0eeff; border-radius:4px; overflow:hidden; margin-bottom:8px; }
.ad-progress-bar { height:100%; background:linear-gradient(90deg,var(--purple),#2196f3); border-radius:4px; transition:width 1s linear; }
.ad-countdown { font-family:'Fredoka One',cursive; font-size:20px; color:var(--text); }

/* Toast */
.toast { position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:#1a1f3c; color:#fff; border-radius:20px; padding:10px 20px; font-size:13px; font-weight:800; z-index:600; white-space:nowrap; }
.toast-pop-enter-active,.toast-pop-leave-active { transition:all .3s ease; }
.toast-pop-enter-from,.toast-pop-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
@keyframes ad-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.mfc-emoji :deep(svg) { width:100%; height:100%; display:block; }
</style>
