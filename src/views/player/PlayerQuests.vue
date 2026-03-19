<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">📋 My Quests</div>
        <div style="width:36px"></div>
      </div>
      <div class="filter-row">
        <div class="filter-chip" :class="{ active: cat === 'All' }"     @click="cat='All'">All</div>
        <div class="filter-chip" :class="{ active: cat === 'Feed' }"    @click="cat='Feed'">🍖 Feed</div>
        <div class="filter-chip" :class="{ active: cat === 'Recruit' }" @click="cat='Recruit'">👥 Recruit</div>
        <div class="filter-chip" :class="{ active: cat === 'Spend' }"   @click="cat='Spend'">💳 Spend</div>
        <div class="filter-chip" :class="{ active: cat === 'Collect' }" @click="cat='Collect'">🐾 Collect</div>
      </div>
    </div>

    <div style="padding:16px 16px 80px">

      <!-- One group per track -->
      <div v-for="track in displayTracks" :key="track.key">
        <!-- Track header (only in All view with Collect sub-tracks) -->
        <div v-if="cat === 'All' && track.label" class="track-header">{{ track.label }}</div>

        <!-- ACTIVE QUEST -->
        <div v-if="track.active" class="quest-card" :class="{ claimable: track.active.claimable }">
          <div class="quest-top">
            <div class="quest-icon">{{ CAT_ICONS[track.active.category] }}</div>
            <div style="flex:1">
              <div class="quest-cat-label">{{ track.active.category }}</div>
              <div class="quest-title">{{ track.active.title }}</div>
              <div class="quest-desc">{{ track.active.desc }}</div>
            </div>
            <div v-if="track.active.claimable" class="claim-pulse"></div>
          </div>

          <div class="quest-progress-row">
            <div class="quest-bar">
              <div class="quest-fill" :style="{ width: Math.min(100, track.active.progress / track.active.target * 100) + '%' }"></div>
            </div>
            <span class="quest-nums">{{ track.active.progress }} / {{ track.active.target }}</span>
          </div>

          <div class="quest-rewards">
            <span class="reward-chip egg-chip">🥚 {{ track.active.egg }} Egg</span>
            <span class="reward-chip cash-chip">💵 S${{ track.active.cash }}</span>
            <span v-if="track.remaining > 0" class="reward-chip more-chip">+{{ track.remaining }} more</span>
          </div>

          <button v-if="track.active.claimable" class="btn btn-teal btn-full claim-btn" @click="claim(track.active)">
            🎉 Claim Reward!
          </button>
        </div>

        <!-- NO ACTIVE — all done in track -->
        <div v-else-if="track.allDone" class="quest-card done-track">
          <div class="quest-top">
            <div class="quest-icon">{{ CAT_ICONS[track.category] }}</div>
            <div style="flex:1">
              <div class="quest-cat-label">{{ track.category }}{{ track.label ? ' · '+track.collectSet : '' }}</div>
              <div class="quest-title" style="color:#4caf50">All quests complete! 🎉</div>
            </div>
            <div class="done-badge">✓ All Done</div>
          </div>
        </div>

        <!-- COMPLETED quests below active (collapsed) -->
        <div v-if="track.done.length > 0">
          <div class="done-toggle" @click="track._showDone = !track._showDone">
            {{ track._showDone ? '▲' : '▼' }} {{ track.done.length }} completed quest{{ track.done.length > 1 ? 's' : '' }}
          </div>
          <div v-if="track._showDone">
            <div v-for="q in track.done" :key="q.id" class="quest-card done-card">
              <div class="quest-top">
                <div class="quest-icon" style="font-size:16px">✅</div>
                <div style="flex:1">
                  <div class="quest-title" style="font-size:12px;color:var(--text2)">{{ q.title }}</div>
                  <div class="quest-desc" style="font-size:10px">{{ q.desc }}</div>
                </div>
                <div class="done-badge">✓ Done</div>
              </div>
              <div class="quest-rewards" style="margin-top:4px">
                <span class="reward-chip" style="font-size:9px;padding:2px 7px">🥚 {{ q.egg }}</span>
                <span class="reward-chip" style="font-size:9px;padding:2px 7px">💵 S${{ q.cash }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="displayTracks.length === 0" class="empty-state">
        <div style="font-size:48px">📋</div>
        <div style="font-family:'Fredoka One',cursive;font-size:16px;margin-top:10px;color:var(--text2)">No quests here</div>
      </div>
    </div>

    <!-- Claim toast -->
    <div v-if="toast" class="toast">🎉 {{ toast }}</div>

  </div>
  <BottomNav active="home" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'

const CAT_ICONS = { Feed:'🍖', Recruit:'👥', Spend:'💳', Collect:'🐾' }
const cat  = ref('All')
const toast = ref('')

const TIER_COLORS = { Bronze:'#bf360c', Silver:'#546e7a', Gold:'#f57f17', Diamond:'#0288d1', Mystic:'#7b1fa2' }
const TIER_BGS    = { Bronze:'#fff3e0', Silver:'#eceff1', Gold:'#fff8e1', Diamond:'#e3f2fd', Mystic:'#f3e5f5' }

// Build tracks — one per sequential chain
// For non-Collect categories: one track per category
// For Collect: one track per collectSet (Animal, Plant, Insect, All, Dex)
function buildTracks(category) {
  const quests = playerStore.quests
  const result = []

  function makeTrack(key, cat, collectSet, label) {
    let pool = quests.filter(q => q.category === cat)
    if (collectSet !== undefined) pool = pool.filter(q => q.collectSet === collectSet)
    const done   = pool.filter(q => q.done)
    const active = pool.find(q => q.enabled && !q.done) || null
    const remaining = pool.filter(q => !q.done && !q.enabled).length
    const allDone = pool.length > 0 && pool.every(q => q.done)
    return reactive({ key, category: cat, collectSet, label, active, done, remaining, allDone, _showDone: false })
  }

  if (category === 'All') {
    result.push(makeTrack('feed',    'Feed',    undefined, null))
    result.push(makeTrack('recruit', 'Recruit', undefined, null))
    result.push(makeTrack('spend',   'Spend',   undefined, null))
    result.push(makeTrack('animal',  'Collect', 'Animal',  '🐾 Animal Quests'))
    result.push(makeTrack('plant',   'Collect', 'Plant',   '🌿 Plant Quests'))
    result.push(makeTrack('insect',  'Collect', 'Insect',  '🦋 Insect Quests'))
    result.push(makeTrack('all',     'Collect', 'All',     '📦 All Monsters'))
    result.push(makeTrack('dex',     'Collect', 'Dex',     '📖 Full Dex'))
  } else if (category === 'Collect') {
    result.push(makeTrack('animal',  'Collect', 'Animal',  '🐾 Animal'))
    result.push(makeTrack('plant',   'Collect', 'Plant',   '🌿 Plant'))
    result.push(makeTrack('insect',  'Collect', 'Insect',  '🦋 Insect'))
    result.push(makeTrack('all',     'Collect', 'All',     '📦 All'))
    result.push(makeTrack('dex',     'Collect', 'Dex',     '📖 Dex'))
  } else {
    result.push(makeTrack(category.toLowerCase(), category, undefined, null))
  }
  return result
}

const displayTracks = computed(() => buildTracks(cat.value))

function claim(q) {
  playerStore.user.cash = +(playerStore.user.cash + q.cash).toFixed(2)
  const now = Date.now()
  playerStore.addEgg({
    tier: q.egg, tierColor: TIER_COLORS[q.egg], tierBg: TIER_BGS[q.egg],
    value: q.cash, merchantName: '🏆 Quest Reward', createdAt: now, hatchAt: now, // quest eggs hatch instantly
  })
  q.done = true
  q.claimable = false
  // Unlock next in same track (same category + same collectSet)
  const same = playerStore.quests.filter(x => x.category === q.category && x.collectSet === q.collectSet)
  const next = same.find(x => !x.enabled && !x.done)
  if (next) next.enabled = true
  playerStore.save()
  toast.value = `Claimed S$${q.cash} + ${q.egg} Egg!`
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 16px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.filter-row { display:flex; gap:6px; margin-top:12px; overflow-x:auto; scrollbar-width:none; }
.filter-row::-webkit-scrollbar { display:none; }
.filter-chip { flex-shrink:0; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:800; background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.3); color:rgba(255,255,255,.8); cursor:pointer; }
.filter-chip.active { background:#fff; color:var(--purple); }

.track-header { font-family:'Fredoka One',cursive; font-size:14px; color:var(--text); margin:16px 0 8px; }
.track-header:first-child { margin-top:0; }

.quest-card { background:#fff; border-radius:18px; border:3px solid #e0d7ff; padding:14px 16px; margin-bottom:10px; box-shadow:0 3px 0 #d4c8ff; }
.quest-card.claimable { border-color:#00bcd4; box-shadow:0 4px 0 #00acc1; }
.quest-card.done-track { opacity:.55; border-color:#c8e6c9; box-shadow:none; }
.done-card { opacity:.55; border-color:#e8e8e8; box-shadow:none; margin-bottom:8px; }

.quest-cat-label { font-size:9px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; margin-bottom:2px; }
.quest-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
.quest-icon { font-size:22px; flex-shrink:0; margin-top:1px; }
.quest-title { font-size:14px; font-weight:800; color:var(--text); }
.quest-desc { font-size:11px; font-weight:700; color:var(--text2); margin-top:2px; }
.done-badge { font-size:10px; font-weight:800; color:#4caf50; background:#e8f5e9; border-radius:8px; padding:3px 8px; flex-shrink:0; }
.claim-pulse { width:12px; height:12px; border-radius:50%; background:#00bcd4; flex-shrink:0; margin-top:4px; animation:pulse-dot 1s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }

.quest-progress-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.quest-bar { flex:1; height:8px; background:#f0eeff; border-radius:4px; overflow:hidden; }
.quest-fill { height:100%; border-radius:4px; background:var(--purple); transition:width .4s; }
.quest-nums { font-size:10px; font-weight:800; color:var(--text2); flex-shrink:0; white-space:nowrap; }

.quest-rewards { display:flex; gap:6px; flex-wrap:wrap; }
.reward-chip { border-radius:8px; padding:4px 10px; font-size:11px; font-weight:800; }
.egg-chip  { background:#f5f0ff; color:var(--purple); }
.cash-chip { background:#e8fff5; color:#00695c; }
.more-chip { background:#f5f5f5; color:#888; }

.claim-btn { margin-top:10px; padding:12px; font-size:14px; }

.done-toggle { font-size:11px; font-weight:800; color:var(--text3); padding:6px 4px; cursor:pointer; margin-bottom:4px; }
.done-toggle:hover { color:var(--purple); }

.empty-state { text-align:center; padding:60px 0; }
.toast { position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:#1a1f3c; color:#fff; border-radius:20px; padding:10px 20px; font-size:13px; font-weight:800; z-index:300; white-space:nowrap; animation:slide-up .3s ease; }
</style>
