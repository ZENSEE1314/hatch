<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <div class="page-title">🐾 Monster Dex</div>
        <div class="count-badge">{{ ownedIds.size }} / 150</div>
      </div>
      <div class="tab-row">
        <div class="tab2" :class="{ active: view==='owned' }" @click="view='owned'">🐾 My Monsters ({{ ownedMonsters.length }})</div>
        <div class="tab2" :class="{ active: view==='dex' }"   @click="view='dex'">📖 Full Dex (150)</div>
      </div>
      <div class="filter-row">
        <div class="filter-chip" :class="{active:setFilter==='All'}"    @click="setFilter='All'">All</div>
        <div class="filter-chip" :class="{active:setFilter==='Animal'}" @click="setFilter='Animal'">🐾 Animal</div>
        <div class="filter-chip" :class="{active:setFilter==='Plant'}"  @click="setFilter='Plant'">🌿 Plant</div>
        <div class="filter-chip" :class="{active:setFilter==='Insect'}" @click="setFilter='Insect'">🦋 Insect</div>
      </div>
    </div>

    <!-- MY MONSTERS TAB -->
    <div v-if="view==='owned'">

      <div v-if="filteredOwned.length === 0" class="empty-state">
        <div style="font-size:56px">🥚</div>
        <div style="font-family:'Fredoka One',cursive;font-size:17px;color:var(--text2);margin-top:14px">
          {{ ownedMonsters.length === 0 ? 'No monsters yet!' : 'No matches in this set.' }}
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text3);margin-top:6px">
          {{ ownedMonsters.length === 0 ? 'Scan a merchant QR to get your first egg.' : 'Try a different filter.' }}
        </div>
        <button v-if="ownedMonsters.length === 0" class="btn btn-primary" style="margin-top:16px" @click="$router.push('/player/scan')">
          Scan QR to get egg →
        </button>
      </div>

      <div v-else class="owned-grid">
        <div v-for="m in filteredOwned" :key="m.id"
          class="monster-card"
          :class="{ starving: liveHp(m) === 0, hungry: liveHp(m) > 0 && liveHp(m) < 30 }"
          :style="{ background: elementGradient(m.element) }"
          @click="openDetail(m)">
          <div class="tier-badge-tr" :class="'badge-' + m.tier.toLowerCase()">{{ m.tier }}</div>
          <div class="dex-num-sm">#{{ m.dex }}</div>

          <!-- Status badge -->
          <div v-if="liveHp(m) === 100"   class="status-badge" style="background:#4caf50">✅ Full</div>
          <div v-else-if="liveHp(m) >= 60" class="status-badge" style="background:#66bb6a">😊 Good</div>
          <div v-else-if="liveHp(m) >= 30" class="status-badge" style="background:#ff9800">😤 Hungry</div>
          <div v-else-if="liveHp(m) > 0"   class="status-badge" style="background:#f44336">😰 Hungry!</div>
          <div v-else                        class="status-badge" style="background:#e53935">😵 Starving!</div>

          <div class="monster-face" v-html="getMonsterImage(m)"></div>
          <div class="monster-name">{{ m.name }}</div>
          <div class="badge" :class="'badge-' + m.element.toLowerCase()" style="margin-top:4px">
            {{ ELEM_ICONS[m.element] }} {{ m.element }}
          </div>
          <div class="streak-row">🔥 {{ m.streak || 0 }}d streak</div>

          <!-- Live Satiety bar (drips 100→0 over 3h) -->
          <div class="hp-wrap">
            <div class="hp-label">Satiety {{ liveHp(m) }}%</div>
            <div class="hp-bar"><div class="hp-fill" :style="{ width: liveHp(m)+'%', background: hpColor(liveHp(m)) }"></div></div>
          </div>

        </div>
      </div>
    </div>

    <!-- FULL DEX TAB -->
    <div v-if="view==='dex'">
      <div class="dex-count-bar">
        <div class="dex-progress-track">
          <div class="dex-progress-fill" :style="{ width: (ownedIds.size / 150 * 100) + '%' }"></div>
        </div>
        <span class="dex-count-text">{{ ownedIds.size }} / 150 collected</span>
      </div>
      <div class="dex-grid">
        <div v-for="m in filteredDex" :key="m.id"
          class="dex-card"
          :class="{ owned: isOwned(m.dex), locked: !isOwned(m.dex) }"
          :style="isOwned(m.dex) ? { background: elementGradient(m.element) } : {}"
          @click="openDexDetail(m)">
          <div v-if="isOwned(m.dex)" class="dex-tier-badge" :class="'badge-' + m.tier.toLowerCase()">{{ m.tier[0] }}</div>
          <div v-if="!isOwned(m.dex)" class="dex-lock">🔒</div>
          <!-- Owned count badge -->
          <div v-if="ownedCount(m.dex) > 1" class="dex-count-chip">×{{ ownedCount(m.dex) }}</div>
          <div class="dex-num">{{ m.dex }}</div>
          <div class="dex-face" v-html="isOwned(m.dex) ? getMonsterImage(m) : '<svg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'><text x=\'50\' y=\'62\' text-anchor=\'middle\' font-size=\'44\'>❓</text></svg>'"></div>
          <div class="dex-name">{{ isOwned(m.dex) ? m.name : '???' }}</div>
          <div v-if="isOwned(m.dex)" class="dex-set">{{ m.set }}</div>
          <div v-else class="dex-set" style="color:#ccc">— — —</div>
        </div>
      </div>
    </div>

  </div>
  <BottomNav active="monsters" />

  <!-- ══ MY MONSTER DETAIL MODAL ══ -->
  <div v-if="detail" class="modal-overlay" @click.self="closeDetail">
    <div class="detail-box">
      <div class="detail-header" :style="{ background: elementGradient(detail.element) }">
        <button class="close-btn" @click="closeDetail">✕</button>
        <div class="detail-dex">{{ detail.dex }}</div>
        <div class="detail-emoji" v-html="getMonsterImage(detail)"></div>
        <div class="detail-name">{{ detail.name }}</div>
        <div style="display:flex;gap:6px;justify-content:center;margin-top:6px;flex-wrap:wrap">
          <div class="badge" :class="'badge-' + detail.tier.toLowerCase()">{{ detail.tier }}</div>
          <div class="badge" :class="'badge-' + detail.element.toLowerCase()">{{ ELEM_ICONS[detail.element] }} {{ detail.element }}</div>
          <div class="badge" style="background:#f3e5f5;color:#7b1fa2">{{ detail.set }}</div>
        </div>
      </div>

      <div class="detail-stats">
        <div class="stat-row" style="flex-direction:column;align-items:flex-start;gap:6px">
          <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
            <span class="stat-label">Satiety</span>
            <span class="stat-num" :class="{ 'red-text': liveHp(detail)===0, 'orange-text': liveHp(detail)<30 && liveHp(detail)>0 }">
              {{ liveHp(detail) === 0 ? '😵 Starving!' : liveHp(detail) === 100 ? '✅ Full' : liveHp(detail) >= 60 ? `😊 ${liveHp(detail)}% good` : liveHp(detail) >= 30 ? `😤 ${liveHp(detail)}% hungry` : `😰 ${liveHp(detail)}% very hungry` }}
            </span>
          </div>
          <!-- Live dripping hunger bar -->
          <div style="width:100%;height:12px;background:#f0eeff;border-radius:6px;overflow:hidden;border:1.5px solid #e0d7ff">
            <div :style="{ width: liveHp(detail)+'%', height:'100%', borderRadius:'5px', background: hpColor(liveHp(detail)), transition:'width 1s linear' }"></div>
          </div>
          <div style="font-size:10px;font-weight:800;color:var(--text3);width:100%;text-align:right">
            <span v-if="liveHp(detail) > 0">starves in {{ hungerTimeLeft(detail) }}</span>
            <span v-else style="color:#e53935">feed now!</span>
          </div>
        </div>
        <div class="stat-row">
          <span class="stat-label">Streak</span>
          <span class="stat-val orange">🔥 {{ detail.streak || 0 }} times</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Egg Value</span>
          <span class="stat-val">S${{ Number(getEggValue(detail)).toFixed(2) }}<span v-if="!detail.eggValue" style="font-size:9px;color:#999"> (est.)</span></span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Per Feed</span>
          <span class="stat-val green">+S${{ (getEggValue(detail) * monsterRate(detail) / 3).toFixed(6) }}</span>
        </div>
      </div>

      <!-- Feeding section -->
      <div class="feed-section">
        <!-- Daily Sessions header -->
        <div class="daily-sessions-header">
          <span class="ds-title">📅 Daily Sessions</span>
          <span class="ds-limit">3× per day</span>
        </div>
        <div class="feed-progress-row" style="margin-bottom:12px">
          <div v-for="i in 3" :key="i" class="mini-dot" :class="{ done: i <= fd.todayFeedings }">{{ i <= fd.todayFeedings ? '✅' : '○' }}</div>
          <span class="feed-prog-label">{{ fd.todayFeedings }}/3 sessions used today</span>
        </div>

        <div v-if="liveHp(detail) === 100 && fd.todayFeedings >= 3" class="feed-done-msg">✅ Fed & all 3 sessions done. Come back tomorrow!</div>
        <div v-else-if="liveHp(detail) === 100" class="feed-done-msg">
          ✅ Already fed!
          <div v-if="cooldownActive" class="cd-next-row">⏳ Next session in <span class="cool-mini-timer">{{ cooldownDisplay }}</span></div>
          <div v-else class="cd-next-row" style="color:#2e7d32">✅ Ready for next session now</div>
        </div>
        <div v-else-if="fd.todayFeedings >= 3" class="feed-done-msg">📅 All 3 sessions used. Come back tomorrow!</div>
        <div v-else-if="cooldownActive" class="cooldown-mini">
          <span>⏳ Next feeding available in</span>
          <span class="cool-mini-timer">{{ cooldownDisplay }}</span>
        </div>
        <button v-else class="btn-feed-now" @click="startFeed">
          🍖 Feed Now! (Watch 15–30s Ad)
          <span class="feed-left-badge">{{ 3 - fd.todayFeedings }} left today</span>
        </button>
      </div>

      <!-- Per-monster streak rewards table -->
      <div class="streak-table">
        <div class="streak-table-title">🏆 {{ detail.name }}'s Streak Rewards</div>
        <div class="streak-table-sub">Feed 3× daily to grow this monster's streak</div>
        <div v-for="t in STREAK_TIERS" :key="t.name"
             class="st-row"
             :class="{ 'st-active': monsterTier(detail).name === t.name }">
          <div class="st-icon">{{ t.icon }}</div>
          <div class="st-info">
            <div class="st-name" :style="monsterTier(detail).name === t.name ? { color: t.color } : {}">{{ t.name }}</div>
            <div class="st-label">{{ t.label }}</div>
          </div>
          <div class="st-rate" :style="monsterTier(detail).name === t.name ? { color: t.color } : {}">{{ t.rateStr }}/feed</div>
          <div v-if="monsterTier(detail).name === t.name" class="st-now-chip" :style="{ background: t.color }">NOW</div>
        </div>
        <div class="st-earn-summary">
          💰 This monster earns <strong>S${{ (getEggValue(detail) * monsterRate(detail) / 3).toFixed(6) }}</strong> per feeding session
        </div>
      </div>
    </div>
  </div>

  <!-- ══ DEX DETAIL MODAL ══ -->
  <div v-if="dexDetail" class="modal-overlay" @click.self="dexDetail = null">
    <div class="detail-box">
      <div class="detail-header" :style="{ background: isOwned(dexDetail.dex) ? elementGradient(dexDetail.element) : 'linear-gradient(160deg,#eceff1,#cfd8dc)' }">
        <button class="close-btn" @click="dexDetail = null">✕</button>
        <div class="detail-dex">{{ dexDetail.dex }}</div>
        <div class="detail-emoji" :style="isOwned(dexDetail.dex) ? '' : 'filter:grayscale(1);opacity:.4'" v-html="getMonsterImage(dexDetail)"></div>
        <div class="detail-name">{{ isOwned(dexDetail.dex) ? dexDetail.name : '???' }}</div>
        <div v-if="isOwned(dexDetail.dex)" style="display:flex;gap:6px;justify-content:center;margin-top:6px;flex-wrap:wrap">
          <div class="badge" :class="'badge-' + dexDetail.tier.toLowerCase()">{{ dexDetail.tier }}</div>
          <div class="badge" :class="'badge-' + dexDetail.element.toLowerCase()">{{ ELEM_ICONS[dexDetail.element] }} {{ dexDetail.element }}</div>
          <div class="badge" style="background:#f3e5f5;color:#7b1fa2">{{ dexDetail.set }}</div>
        </div>
        <div v-else style="margin-top:8px;font-size:12px;color:#999;font-weight:700">Not yet discovered</div>
      </div>

      <div style="padding:16px 20px">
        <!-- Description -->
        <div class="dex-desc">{{ monsterDesc(dexDetail) }}</div>

        <!-- Stats row -->
        <div class="dex-stat-row">
          <div class="dex-stat-block">
            <div class="dex-stat-label">Element</div>
            <div class="dex-stat-val">{{ ELEM_ICONS[dexDetail.element] }} {{ dexDetail.element }}</div>
          </div>
          <div class="dex-stat-block">
            <div class="dex-stat-label">Set</div>
            <div class="dex-stat-val">{{ dexDetail.set }}</div>
          </div>
          <div class="dex-stat-block">
            <div class="dex-stat-label">Tier</div>
            <div class="dex-stat-val">{{ dexDetail.tier }}</div>
          </div>
        </div>

        <!-- Owned count -->
        <div class="dex-owned-row">
          <div class="dex-owned-icon">{{ isOwned(dexDetail.dex) ? '✅' : '🔒' }}</div>
          <div>
            <div class="dex-owned-label">You own</div>
            <div class="dex-owned-count">{{ ownedCount(dexDetail.dex) }} × {{ dexDetail.name || '???' }}</div>
          </div>
          <div v-if="ownedCount(dexDetail.dex) > 1" class="extra-chip">+{{ ownedCount(dexDetail.dex) - 1 }} extra</div>
        </div>

        <!-- Trade extra -->
        <button v-if="ownedCount(dexDetail.dex) > 1" class="btn-trade-extra" @click="tradeExtra(dexDetail)">
          🔄 Trade Extra {{ dexDetail.name }} on Market
        </button>
        <div v-else-if="!isOwned(dexDetail.dex)" class="not-owned-tip">
          Hatch eggs to discover this monster!
        </div>
      </div>
    </div>
  </div>

  <!-- ══ AD MODAL ══ -->
  <div v-if="adModal" class="ad-overlay">
    <div class="ad-box">
      <div class="ad-title">📺 Advertisement</div>
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import MONSTER_DEX from '@/data/monsterDex.js'
import { getMonsterImage } from '@/data/monsterImages.js'

const router = useRouter()

const ELEM_ICONS = { Fire:'🔥', Water:'💧', Earth:'🌿', Wind:'💨', Shadow:'🌑' }
const ELEM_COLORS = {
  Fire:   'linear-gradient(160deg,#fff3e0,#ffe0b2)',
  Water:  'linear-gradient(160deg,#e3f2fd,#bbdefb)',
  Earth:  'linear-gradient(160deg,#e8f5e9,#c8e6c9)',
  Wind:   'linear-gradient(160deg,#f3e5f5,#e1bee7)',
  Shadow: 'linear-gradient(160deg,#eceff1,#cfd8dc)',
}

// Monster descriptions by element+set
const ELEM_DESC = {
  'Fire:Animal':  'A fierce fire-breathing beast of the wild. Its body radiates heat intense enough to melt stone. Loyal but dangerous.',
  'Fire:Plant':   'A volcanic botanical lifeform thriving in extreme heat. Its petals ignite when threatened, scattering embers.',
  'Fire:Insect':  'A scorching insectoid that leaves trails of flame wherever it crawls. Its chitin is impervious to heat.',
  'Water:Animal': 'A graceful aquatic creature with shimmering scales. Masters of the deep, they ride ocean currents with ease.',
  'Water:Plant':  'An aquatic flora that blooms only underwater. Its luminescent petals calm even the fiercest storms.',
  'Water:Insect': 'An amphibious insect that skates across water surfaces. Its wings repel moisture entirely.',
  'Earth:Animal': 'A sturdy earth-bound beast covered in thick bark-like hide. Slow but immovable, a guardian of forests.',
  'Earth:Plant':  'An ancient plant monster intertwined with roots of the earth. Can command vines and plant life around it.',
  'Earth:Insect': 'An armored insect that tunnels through bedrock. Its mandibles can crush the hardest minerals.',
  'Wind:Animal':  'A swift aerial creature that rides storm currents. Its movements are too fast for the naked eye to track.',
  'Wind:Plant':   'A floating botanical lifeform carried by the breeze. Releases spores that ride wind across continents.',
  'Wind:Insect':  'A translucent winged insect that becomes invisible at high speed. Only a blur marks its passing.',
  'Shadow:Animal':'A creature born from darkness, lurking at the edge of perception. It thrives where light cannot reach.',
  'Shadow:Plant': 'A sinister plant that only blooms at midnight. Its pollen induces vivid hallucinations.',
  'Shadow:Insect':'An insect cloaked in shadow energy. It can phase through solid matter when it enters stealth mode.',
}

const TIER_DESC = {
  Bronze:  'Common and widespread, Bronze-tier monsters are a great starting point for any collector.',
  Silver:  'Uncommon Silver-tier monsters show enhanced abilities and are prized for their trading value.',
  Gold:    'Rare Gold-tier monsters are highly sought after. Only dedicated trainers encounter them.',
  Diamond: 'Ultra-rare Diamond-tier monsters are legendary in the HATCHME world.',
  Mystic:  'One-of-a-kind Mystic-tier monsters are the pinnacle of collection. Extremely valuable.',
}

function monsterDesc(m) {
  const base = ELEM_DESC[`${m.element}:${m.set}`] || 'A mysterious monster from the HATCHME world.'
  const tier = TIER_DESC[m.tier] || ''
  return base + ' ' + tier
}

// Tier fallback egg value for monsters without eggValue
const TIER_DEFAULT_VALUE = { Bronze:5, Silver:20, Gold:50, Diamond:100, Mystic:200 }
function getEggValue(m) {
  return (m.eggValue && m.eggValue > 0) ? m.eggValue : (TIER_DEFAULT_VALUE[m.tier] || 5)
}

// Per-monster streak tiers
const STREAK_TIERS = [
  { name:'Standard', label:'1–7 feedings',   min:0,  rate:0.0001,  rateStr:'0.01%', icon:'⭐', color:'#9e9e9e' },
  { name:'Bronze',   label:'8–14 feedings',  min:8,  rate:0.0002,  rateStr:'0.02%', icon:'🥉', color:'#bf360c' },
  { name:'Silver',   label:'15–21 feedings', min:15, rate:0.0003,  rateStr:'0.03%', icon:'🥈', color:'#546e7a' },
  { name:'Gold',     label:'22+ feedings',   min:22, rate:0.00035, rateStr:'0.035%',icon:'🥇', color:'#f9a825' },
]
function monsterTier(m) {
  const s = m?.streak || 0
  return [...STREAK_TIERS].reverse().find(t => s >= t.min) || STREAK_TIERS[0]
}
// streakRate is per-monster — pass monster to get rate
function monsterRate(m) { return monsterTier(m).rate }
// backwards compat for template uses that pass detail directly
const streakRate = computed(() => monsterRate(detail.value))

// ── Live clock ───────────────────────────────────────────────────
const now = ref(Date.now())
let ticker = null
onMounted(() => {
  playerStore.checkDayRollover()
  ticker = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => { clearInterval(ticker); clearInterval(adTimer) })

// ── HP computed from lastFedAt — drips from 100→0 over 3 hours ──
const HUNGER_MS = 3 * 60 * 60 * 1000
function liveHp(m) {
  if (!m.lastFedAt) return 0  // never fed = starving
  const elapsed = now.value - m.lastFedAt
  return Math.max(0, Math.round(100 - (elapsed / HUNGER_MS) * 100))
}
function hungerTimeLeft(m) {
  // If currently full (liveHp=100): time until it starts getting hungry (= time until hp drops to <100, i.e. 0 extra ms, it's already dripping)
  // Actually: time left until hp=0 from lastFedAt is HUNGER_MS - elapsed
  if (!m.lastFedAt) return '--'
  const elapsed = now.value - m.lastFedAt
  if (elapsed >= HUNGER_MS) return 'now'
  const ms = HUNGER_MS - elapsed
  const h  = Math.floor(ms / 3600000)
  const mn = Math.floor((ms % 3600000) / 60000)
  const s  = Math.floor((ms % 60000) / 1000)
  return `${h}h ${String(mn).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
}

// ── Cooldown (3h between feeding sessions) ───────────────────────
const COOLDOWN_MS = 3 * 60 * 60 * 1000
const fd = computed(() => playerStore.feedingData)
const cooldownActive = computed(() => {
  if (!fd.value.lastFeedingAt) return false
  return (now.value - fd.value.lastFeedingAt) < COOLDOWN_MS
})
const cooldownDisplay = computed(() => {
  if (!cooldownActive.value) return ''
  const ms = COOLDOWN_MS - (now.value - fd.value.lastFeedingAt)
  const h  = Math.floor(ms / 3600000)
  const m  = Math.floor((ms % 3600000) / 60000)
  const s  = Math.floor((ms % 60000) / 1000)
  return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
})

// ── Data ─────────────────────────────────────────────────────────
const view      = ref('owned')
const setFilter = ref('All')

const ownedMonsters = computed(() => playerStore.monsters)
const ownedIds      = computed(() => new Set(ownedMonsters.value.map(m => m.dex)))

function isOwned(dex)      { return ownedIds.value.has(dex) }
function ownedCount(dex)   { return ownedMonsters.value.filter(m => m.dex === dex).length }
function elementGradient(el) { return ELEM_COLORS[el] || '#fff' }
function hpColor(hp) {
  if (hp > 60) return 'linear-gradient(90deg,#66bb6a,#2e7d32)'
  if (hp > 30) return 'linear-gradient(90deg,#ffa726,#f57c00)'
  return 'linear-gradient(90deg,#ef5350,#c62828)'
}

const filteredOwned = computed(() => {
  if (setFilter.value === 'All') return ownedMonsters.value
  return ownedMonsters.value.filter(m => m.set === setFilter.value)
})
const filteredDex = computed(() => {
  if (setFilter.value === 'All') return MONSTER_DEX
  return MONSTER_DEX.filter(m => m.set === setFilter.value)
})

// ── Owned monster detail ──────────────────────────────────────────
const detail  = ref(null)
function openDetail(m) { detail.value = m }
function closeDetail()  { detail.value = null }

// ── Dex detail ────────────────────────────────────────────────────
const dexDetail = ref(null)
function openDexDetail(m) { dexDetail.value = m }
function tradeExtra(dexEntry) {
  dexDetail.value = null
  router.push('/player/trade')
}

// ── Ad simulation ─────────────────────────────────────────────────
const adModal    = ref(false)
const adLeft     = ref(0)
const adDuration = ref(15)
const toast      = ref('')
let adTimer      = null
let feedingMon   = null

function startFeed() {
  feedingMon = detail.value
  const duration = Math.floor(Math.random() * 16) + 15
  adDuration.value = duration
  adLeft.value     = duration
  adModal.value    = true
  adTimer = setInterval(() => {
    adLeft.value--
    if (adLeft.value <= 0) { clearInterval(adTimer); adModal.value = false; completeFeed() }
  }, 1000)
}

function completeFeed() {
  const m = feedingMon
  if (!m) return
  m.lastFedAt = Date.now() // sets HP to 100 dynamically
  m.streak    = (m.streak || 0) + 1
  m.status    = 'fed'      // legacy field
  m.hp        = 100        // legacy field

  const rate   = monsterRate(m)   // use THIS monster's own streak
  const reward = getEggValue(m) * rate / 3

  playerStore.recordFeeding(reward)

  toast.value = `🍖 ${m.name} fed! +S$${reward.toFixed(6)} withdrawable`
  setTimeout(() => { toast.value = '' }, 3500)
  feedingMon = null
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 12px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.page-title { font-family:'Fredoka One',cursive; font-size:20px; color:#fff; }
.count-badge { background:rgba(255,255,255,.25); border:2px solid rgba(255,255,255,.4); color:#fff; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:800; }
.tab-row { display:flex; margin-top:10px; }
.tab2 { flex:1; text-align:center; padding:8px 0; font-size:11px; font-weight:800; color:rgba(255,255,255,.6); cursor:pointer; border-bottom:3px solid transparent; }
.tab2.active { color:#fff; border-bottom-color:#fff; }
.filter-row { display:flex; gap:6px; margin-top:10px; overflow-x:auto; scrollbar-width:none; padding-bottom:4px; }
.filter-row::-webkit-scrollbar { display:none; }
.filter-chip { flex-shrink:0; padding:5px 12px; border-radius:20px; font-size:10px; font-weight:800; background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.3); color:rgba(255,255,255,.8); cursor:pointer; }
.filter-chip.active { background:#fff; color:var(--purple); }

/* Feed timer bar */
.feed-timer-bar { background:#fff8e1; border-bottom:2px solid #ffe082; padding:8px 16px; font-size:12px; font-weight:800; color:#f57f17; text-align:center; }
.feed-timer-bar.ready { background:#e8f5e9; border-bottom-color:#a5d6a7; color:#2e7d32; }
.feed-link { color:var(--purple); cursor:pointer; margin-left:6px; }

/* OWNED GRID */
.owned-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:14px; }
.monster-card { border-radius:20px; border:3px solid rgba(255,255,255,.7); padding:14px 12px 10px; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.08); position:relative; transition:transform .15s; }
.monster-card:active { transform:scale(.97); }
.monster-card.starving { border-color:#e53935; box-shadow:0 4px 0 #ef9a9a; animation:starve-pulse 1.5s ease-in-out infinite; }
.monster-card.hungry { border-color:#ff9800; }
@keyframes starve-pulse { 0%,100%{border-color:#e53935} 50%{border-color:#ff5722} }
.tier-badge-tr { position:absolute; top:10px; right:10px; font-size:8px; font-weight:800; padding:3px 8px; border-radius:8px; }
.dex-num-sm { font-size:9px; font-weight:800; color:var(--text3); align-self:flex-start; }
.status-badge { position:absolute; top:-8px; left:50%; transform:translateX(-50%); border-radius:10px; padding:3px 10px; font-size:9px; font-weight:800; color:#fff; border:2px solid #fff; white-space:nowrap; }
.monster-face { width:72px; height:72px; margin:6px auto 2px; }
.monster-name { font-family:'Fredoka One',cursive; font-size:14px; color:var(--text); text-align:center; }
.streak-row { font-size:10px; font-weight:800; color:var(--orange); }
.hp-wrap { width:100%; margin-top:4px; }
.hp-label { font-size:9px; font-weight:800; color:var(--text2); margin-bottom:3px; }
.hp-bar { width:100%; height:7px; background:rgba(255,255,255,.6); border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,.9); }
.hp-fill { height:100%; border-radius:3px; transition:width 1s linear; }
.hunger-cd { font-size:9px; font-weight:800; color:#e65100; }
.fed-cd { color:#2e7d32; }
.empty-state { display:flex; flex-direction:column; align-items:center; padding:60px 20px; text-align:center; }

/* DEX */
.dex-count-bar { padding:12px 14px 6px; }
.dex-progress-track { height:8px; background:#f0eeff; border-radius:4px; overflow:hidden; margin-bottom:6px; }
.dex-progress-fill { height:100%; background:linear-gradient(90deg,var(--purple),#2196f3); border-radius:4px; }
.dex-count-text { font-size:11px; font-weight:800; color:var(--text2); }
.dex-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; padding:6px 12px 80px; }
.dex-card { border-radius:16px; border:2.5px solid #e0d7ff; padding:12px 8px 10px; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; position:relative; transition:transform .15s; }
.dex-card:active { transform:scale(.96); }
.dex-card.owned { border-color:rgba(124,77,255,.3); box-shadow:0 3px 0 rgba(124,77,255,.15); }
.dex-card.locked { background:#f8f8f8; border-color:#e8e8e8; opacity:.6; filter:grayscale(0.8); }
.dex-tier-badge { position:absolute; top:7px; right:7px; font-size:8px; font-weight:800; padding:2px 5px; border-radius:6px; }
.dex-lock { position:absolute; top:7px; right:7px; font-size:10px; opacity:.5; }
.dex-count-chip { position:absolute; top:5px; left:5px; background:var(--purple); color:#fff; border-radius:8px; padding:1px 6px; font-size:8px; font-weight:800; }
.dex-num { font-size:9px; font-weight:800; color:var(--text3); align-self:flex-start; }
.dex-face { width:52px; height:52px; margin:4px auto 2px; }
.dex-name { font-size:10px; font-weight:800; color:var(--text); text-align:center; line-height:1.3; }
.dex-set { font-size:9px; font-weight:700; color:var(--text3); text-transform:uppercase; }

/* DETAIL MODAL (owned monster) */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:400; display:flex; align-items:flex-end; justify-content:center; }
.detail-box { background:#fff; border-radius:28px 28px 0 0; width:100%; max-width:420px; max-height:88vh; overflow-y:auto; padding-bottom:24px; }
.detail-header { padding:20px 20px 16px; border-radius:28px 28px 0 0; text-align:center; position:relative; }
.close-btn { position:absolute; top:14px; right:14px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,.15); border:none; font-size:14px; cursor:pointer; color:#fff; font-weight:800; }
.detail-dex { font-size:11px; font-weight:800; color:rgba(0,0,0,.4); }
.detail-emoji { width:96px; height:96px; margin:0 auto; }
.detail-name { font-family:'Fredoka One',cursive; font-size:22px; color:var(--text); margin-top:6px; }

.detail-stats { padding:14px 20px 0; }
.stat-row { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1.5px solid #f0eeff; }
.stat-row:last-child { border-bottom:none; }
.stat-label { font-size:12px; font-weight:800; color:var(--text3); width:80px; }
.stat-bar-wrap { flex:1; display:flex; align-items:center; gap:8px; }
.stat-bar { flex:1; height:8px; background:#f0eeff; border-radius:4px; overflow:hidden; }
.stat-fill { height:100%; border-radius:4px; transition:width 1s linear; }
.stat-num { font-size:12px; font-weight:800; color:var(--text); width:36px; text-align:right; }
.stat-val { font-size:13px; font-weight:800; color:var(--text); }
.stat-val.orange { color:var(--orange); }
.stat-val.green { color:#2e7d32; }
.stat-val.red { color:#e53935; }
.red-text { color:#e53935 !important; }
.orange-text { color:#e65100 !important; }

.feed-section { margin:14px 20px 0; background:#f9f5ff; border-radius:18px; border:2px solid #e0d7ff; padding:14px; }
.daily-sessions-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.ds-title { font-family:'Fredoka One',cursive; font-size:13px; color:var(--text); }
.ds-limit { background:var(--purple); color:#fff; font-size:10px; font-weight:800; padding:3px 10px; border-radius:20px; }
.feed-done-msg { text-align:center; font-size:12px; font-weight:800; color:#2e7d32; }
.cd-next-row { margin-top:6px; font-size:11px; font-weight:700; color:#f57f17; }
.cooldown-mini { display:flex; flex-direction:column; align-items:center; gap:4px; }
.cooldown-mini span:first-child { font-size:12px; font-weight:800; color:#f57f17; }
.cool-mini-timer { font-family:'Fredoka One',cursive; font-size:20px; color:#e65100; }
.btn-feed-now { width:100%; background:linear-gradient(135deg,#ff9800,#f57c00); border:none; color:#fff; padding:13px 16px; border-radius:14px; font-family:'Fredoka One',cursive; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; }
.feed-left-badge { background:rgba(255,255,255,.3); border-radius:20px; padding:2px 10px; font-size:11px; }
.feed-progress-row { display:flex; align-items:center; gap:6px; margin-top:12px; justify-content:center; }
.mini-dot { font-size:14px; color:var(--text3); }
.mini-dot.done { color:#2e7d32; }
.feed-prog-label { font-size:11px; font-weight:800; color:var(--text2); }

/* DEX DETAIL */
.dex-desc { font-size:13px; color:var(--text2); font-weight:700; line-height:1.6; margin-bottom:14px; }
.dex-stat-row { display:flex; gap:8px; margin-bottom:14px; }
.dex-stat-block { flex:1; background:#f9f5ff; border-radius:12px; border:2px solid #e0d7ff; padding:10px 8px; text-align:center; }
.dex-stat-label { font-size:9px; font-weight:800; color:var(--text3); text-transform:uppercase; }
.dex-stat-val { font-size:13px; font-weight:800; color:var(--text); margin-top:3px; }
.dex-owned-row { display:flex; align-items:center; gap:12px; background:#f9f5ff; border-radius:14px; border:2px solid #e0d7ff; padding:12px 14px; margin-bottom:12px; }
.dex-owned-icon { font-size:24px; }
.dex-owned-label { font-size:10px; font-weight:800; color:var(--text3); }
.dex-owned-count { font-family:'Fredoka One',cursive; font-size:16px; color:var(--text); }
.extra-chip { margin-left:auto; background:var(--purple); color:#fff; border-radius:10px; padding:3px 10px; font-size:10px; font-weight:800; }
.btn-trade-extra { width:100%; background:linear-gradient(135deg,var(--purple),#2196f3); border:none; color:#fff; padding:13px; border-radius:14px; font-family:'Fredoka One',cursive; font-size:15px; cursor:pointer; }
.not-owned-tip { text-align:center; font-size:12px; font-weight:800; color:var(--text3); }

/* AD modal */
.ad-overlay { position:fixed; inset:0; background:rgba(0,0,0,.85); z-index:600; display:flex; align-items:center; justify-content:center; }
.ad-box { background:#fff; border-radius:24px; padding:24px 20px; width:300px; display:flex; flex-direction:column; align-items:center; }
.ad-title { font-family:'Fredoka One',cursive; font-size:16px; color:var(--text); margin-bottom:12px; }
.ad-screen { background:linear-gradient(135deg,#1a1f3c,#7c4dff); border-radius:16px; width:100%; padding:30px 20px; display:flex; flex-direction:column; align-items:center; margin-bottom:14px; }
.ad-progress-wrap { width:100%; height:8px; background:#f0eeff; border-radius:4px; overflow:hidden; margin-bottom:8px; }
.ad-progress-bar { height:100%; background:linear-gradient(90deg,var(--purple),#2196f3); border-radius:4px; transition:width 1s linear; }
.ad-countdown { font-family:'Fredoka One',cursive; font-size:20px; color:var(--text); }

.toast { position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:#1a1f3c; color:#fff; border-radius:20px; padding:10px 20px; font-size:13px; font-weight:800; z-index:700; white-space:nowrap; }
.toast-pop-enter-active,.toast-pop-leave-active { transition:all .3s ease; }
.toast-pop-enter-from,.toast-pop-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
@keyframes ad-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.monster-face :deep(svg), .dex-face :deep(svg), .detail-emoji :deep(svg) { width:100%; height:100%; display:block; }
/* Streak table inside detail modal */
.streak-table { margin:14px 20px 20px; background:#fffdf5; border-radius:18px; border:2px solid #ffe082; padding:14px 16px; }
.streak-table-title { font-family:'Fredoka One',cursive; font-size:14px; color:#1a1a1a; margin-bottom:2px; }
.streak-table-sub { font-size:10px; font-weight:700; color:#555; margin-bottom:12px; }
.st-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1.5px solid #fff8e1; transition:background .2s; }
.st-row:last-of-type { border-bottom:none; }
.st-row.st-active { background:#fff8e1; margin:0 -8px; padding:8px 8px; border-radius:10px; border-bottom:none; }
.st-icon { font-size:20px; }
.st-info { flex:1; }
.st-name { font-size:12px; font-weight:800; color:#1a1a1a; }
.st-label { font-size:10px; font-weight:700; color:#444; }
.st-rate { font-family:'Fredoka One',cursive; font-size:13px; color:#1a1a1a; }
.st-now-chip { color:#fff; font-size:9px; font-weight:800; padding:3px 8px; border-radius:10px; }
.st-earn-summary { margin-top:12px; padding-top:10px; border-top:1.5px solid #ffe082; font-size:11px; font-weight:700; color:#333; text-align:center; }
.st-earn-summary strong { color:#2e7d32; }
</style>
