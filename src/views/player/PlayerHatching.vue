<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">🥚 Hatching</div>
        <div style="width:36px"></div>
      </div>
    </div>

    <!-- NO EGGS -->
    <div v-if="eggs.length === 0" class="empty-body">
      <div style="font-size:56px">🥚</div>
      <div style="font-family:'Fredoka One',cursive;font-size:18px;color:var(--text2);margin-top:16px">No eggs incubating</div>
      <div style="font-size:12px;font-weight:700;color:var(--text3);margin-top:6px">Scan a merchant QR to get your first egg!</div>
      <button class="btn btn-primary" style="margin-top:20px" @click="$router.push('/player/scan')">Scan QR →</button>
    </div>

    <!-- EGG LIST -->
    <div v-else style="padding:16px">
      <div v-for="egg in eggs" :key="egg.id" class="egg-detail-card">

        <!-- Progress ring -->
        <div class="egg-preview">
          <div class="egg-big animate-float">🥚</div>
          <svg class="ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e0e0e0" stroke-width="6"/>
            <circle cx="60" cy="60" r="52" fill="none" :stroke="egg.tierColor" stroke-width="6"
              :stroke-dasharray="326.7"
              :stroke-dashoffset="326.7 * (1 - eggTimer(egg).progress)"
              stroke-linecap="round" transform="rotate(-90 60 60)"
              style="transition:stroke-dashoffset 0.5s"/>
          </svg>
        </div>

        <div class="badge" :style="{ background: egg.tierBg, color: egg.tierColor, fontSize:'13px', padding:'5px 14px', borderRadius:'20px', fontWeight:'800', marginTop:'4px' }">
          {{ egg.tier }} Egg
        </div>

        <div class="hatch-value">S${{ Number(egg.value * 0.5).toFixed(2) }} reward</div>

        <!-- Live countdown -->
        <div v-if="!eggTimer(egg).ready" class="hatch-timer">
          ⏳ {{ eggTimer(egg).h }}h {{ String(eggTimer(egg).m).padStart(2,'0') }}m {{ String(eggTimer(egg).s).padStart(2,'0') }}s left
        </div>
        <div v-else class="hatch-timer ready-pulse">✅ Ready to hatch!</div>

        <div class="hatch-info">
          <div class="info-row"><span>Egg Tier</span><span>{{ egg.tier }}</span></div>
          <div class="info-row"><span>From</span><span>{{ egg.merchantName }}</span></div>
          <div class="info-row"><span>Hatches</span><span>1 random monster</span></div>
          <div class="info-row"><span>Reward</span><span>S${{ Number(egg.value * 0.5).toFixed(2) }} (50% after tax)</span></div>
        </div>

        <button class="btn btn-primary" style="width:100%;margin-top:16px;justify-content:center"
          @click="hatchEgg(egg)">
          <span v-if="eggTimer(egg).ready">🎉 Hatch Now!</span>
          <span v-else>Hatch Early (500 💎)</span>
        </button>
        <div style="font-size:11px;color:var(--text2);font-weight:700;margin-top:8px;text-align:center">
          {{ eggTimer(egg).ready ? 'Your egg is ready!' : 'Or wait for it to hatch naturally' }}
        </div>
      </div>
    </div>

    <!-- HATCHING ANIMATION OVERLAY -->
    <div v-if="hatching" class="hatch-overlay">
      <div class="hatch-box">
        <div style="font-size:72px;animation:egg-bob 0.5s ease-in-out infinite">🥚</div>
        <div style="font-family:'Fredoka One',cursive;font-size:20px;color:var(--text);margin-top:16px">Hatching...</div>
      </div>
    </div>

    <!-- SUCCESS OVERLAY -->
    <div v-if="hatched" class="hatch-overlay" @click="hatched = null">
      <div class="hatch-box">
        <div style="width:96px;height:96px;margin:0 auto" v-html="getMonsterImage(hatched.monster)"></div>
        <div style="font-family:'Fredoka One',cursive;font-size:22px;color:var(--text);margin-top:12px">{{ hatched.monster.name }}</div>
        <div class="badge" :class="'badge-' + hatched.monster.element.toLowerCase()" style="margin-top:8px;font-size:12px;padding:5px 12px">{{ hatched.monster.element }}</div>
        <div class="badge" :class="'badge-' + hatched.monster.tier.toLowerCase()" style="margin-top:4px;font-size:12px;padding:5px 12px">{{ hatched.monster.tier }}</div>
        <div style="margin-top:14px;background:#f0fff4;border-radius:14px;padding:12px 20px;text-align:center">
          <div style="font-size:13px;font-weight:800;color:#2e7d32">💰 Reward Received</div>
          <div style="font-family:'Fredoka One',cursive;font-size:22px;color:#2e7d32">S${{ hatched.reward }}</div>
          <div style="font-size:11px;color:#555;margin-top:2px">50% of egg value after tax</div>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text2);margin-top:16px">Tap to continue</div>
      </div>
    </div>

  </div>
  <BottomNav active="home" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import { rollMonster } from '@/data/monsterDex.js'
import { getMonsterImage } from '@/data/monsterImages.js'

const TIER_HOURS = { Bronze:72, Silver:48, Gold:24, Diamond:12, Mystic:6 }

// Live clock — ticks every second so countdown animates
const now = ref(Date.now())
let ticker = null
onMounted(() => { ticker = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(ticker))

const eggs = computed(() => playerStore.eggs)

function eggTimer(egg) {
  const ms       = Math.max(0, (egg.hatchAt || 0) - now.value)
  const totalSec = Math.floor(ms / 1000)
  const h        = Math.floor(totalSec / 3600)
  const m        = Math.floor((totalSec % 3600) / 60)
  const s        = totalSec % 60
  const duration = (egg.hatchAt || 0) - (egg.createdAt || 0)
  const elapsed  = now.value - (egg.createdAt || 0)
  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 1
  const ready    = ms === 0
  return { h, m, s, progress, ready }
}

const hatching = ref(null)
const hatched  = ref(null)

function hatchEgg(egg) {
  if (!eggTimer(egg).ready) {
    if (playerStore.user.gems < 500) { alert('Not enough gems! You need 500 💎 to hatch early.'); return }
    playerStore.user.gems -= 500
  }
  hatching.value = egg
  setTimeout(() => {
    hatching.value = null
    const monster = rollMonster(egg.tier)

    // 50% of egg value shown as locked cash (not withdrawable — earned via feeding)
    const reward = +(egg.value * 0.5).toFixed(2)
    playerStore.user.cash = +((playerStore.user.cash || 0) + reward).toFixed(2)

    playerStore.addMonster(monster, egg.value) // pass original egg purchase price for feeding rewards

    // Remove egg
    const idx = playerStore.eggs.findIndex(e => e.id === egg.id)
    if (idx !== -1) playerStore.eggs.splice(idx, 1)
    playerStore.save()

    hatched.value = { monster, reward: reward.toFixed(2) }
  }, 1500)
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 20px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }

.empty-body { display:flex; flex-direction:column; align-items:center; padding:60px 20px; text-align:center; }

.egg-detail-card { background:#fff; border-radius:22px; border:3px solid #e0d7ff; padding:20px; margin-bottom:16px; box-shadow:0 4px 0 #d4c8ff; display:flex; flex-direction:column; align-items:center; }
.egg-preview { position:relative; width:120px; height:120px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
.egg-big { font-size:56px; position:absolute; }
.ring { position:absolute; top:0; left:0; width:120px; height:120px; }
.hatch-value { font-family:'Fredoka One',cursive; font-size:22px; color:var(--green); margin-top:8px; }
.hatch-timer { font-size:13px; font-weight:800; color:var(--text2); margin-top:4px; margin-bottom:20px; }
.ready-pulse { color:#2e7d32; animation:pulse-green 1s ease-in-out infinite; }
@keyframes pulse-green { 0%,100%{ opacity:1 } 50%{ opacity:.5 } }
.hatch-info { width:100%; background:#f9f5ff; border-radius:16px; border:2px solid #e0d7ff; padding:14px 16px; }
.info-row { display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:var(--text); padding:6px 0; border-bottom:1px solid #f0eeff; }
.info-row:last-child { border-bottom:none; }
.info-row span:last-child { color:var(--purple); }

.hatch-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:400; display:flex; align-items:center; justify-content:center; }
.hatch-box { background:#fff; border-radius:28px; padding:40px 32px; display:flex; flex-direction:column; align-items:center; text-align:center; box-shadow:0 16px 48px rgba(0,0,0,.3); }

@keyframes egg-bob { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
.hatch-box :deep(svg) { width:100%; height:100%; display:block; }
</style>
