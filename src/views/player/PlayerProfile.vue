<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row-center">
        <div class="page-title">👤 Profile</div>
      </div>
      <div class="profile-top">
        <div class="profile-avatar">{{ user.avatar || (user.name ? user.name[0].toUpperCase() : '🐣') }}</div>
        <div class="profile-name">{{ user.name }}</div>
        <div class="profile-level">⭐ Level {{ user.level }} · {{ user.xp.toLocaleString() }} XP</div>
        <div class="xp-bar"><div class="xp-fill" :style="{ width: xpPct + '%' }"></div></div>
        <div style="font-size:10px;color:rgba(255,255,255,.6);font-weight:700;margin-top:4px">{{ user.xp }} / {{ xpNext }} XP to Level {{ user.level + 1 }}</div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat"><div class="stat-val">{{ monsters.length }}</div><div class="stat-label">Monsters</div></div>
      <div class="stat"><div class="stat-val">S${{ user.cash.toFixed(2) }}</div><div class="stat-label">Cash</div></div>
      <div class="stat"><div class="stat-val">{{ user.gems.toLocaleString() }}</div><div class="stat-label">Gems</div></div>
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="$router.push('/player/withdraw')">
        <span class="menu-icon">💵</span><span class="menu-label">Withdraw Cash</span><span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="showGemModal=true">
        <span class="menu-icon">💎</span><span class="menu-label">Top Up Gems</span>
        <span style="font-size:11px;font-weight:800;color:var(--purple);margin-right:4px">{{ user.gems.toLocaleString() }} 💎</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/player/quests')">
        <span class="menu-icon">📋</span><span class="menu-label">My Quests</span>
        <span v-if="claimableCount" class="notif-count">{{ claimableCount }}</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/player/achievements')">
        <span class="menu-icon">🏆</span><span class="menu-label">Achievements</span>
        <span style="font-size:11px;font-weight:700;color:var(--text3);margin-right:4px">{{ achieveDone }}/{{ achieveTotal }}</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/player/refer')">
        <span class="menu-icon">👥</span><span class="menu-label">Refer a Friend</span><span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="$router.push('/player/settings')">
        <span class="menu-icon">⚙️</span><span class="menu-label">Settings</span><span class="menu-arrow">›</span>
      </div>
    </div>

    <div style="padding:0 16px 16px">
      <button class="btn btn-red btn-full" @click="logout">Sign Out</button>
    </div>
  </div>

  <BottomNav active="profile" />

  <!-- GEM TOP-UP MODAL -->
  <div v-if="showGemModal" class="modal-overlay" @click.self="showGemModal=false">
    <div class="modal-box">
      <div class="modal-title">💎 Top Up Gems <span class="modal-close" @click="showGemModal=false">✕</span></div>
      <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:14px">Current: {{ user.gems.toLocaleString() }} 💎</div>
      <div class="gem-grid">
        <div v-for="p in GEM_PACKS" :key="p.gems" class="gem-pack" @click="buyGems(p)">
          <div style="font-size:28px">💎</div>
          <div style="font-family:'Fredoka One',cursive;font-size:16px;color:var(--purple)">{{ p.gems.toLocaleString() }}</div>
          <div style="font-size:10px;font-weight:800;color:var(--text2)">Gems</div>
          <div class="gem-price">S${{ p.price }}</div>
          <div v-if="p.bonus" class="gem-bonus">+{{ p.bonus }}% bonus</div>
        </div>
      </div>
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-align:center;margin-top:12px">
        Demo mode — gems are added instantly
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'

const router = useRouter()
const user     = playerStore.user
const monsters = computed(() => playerStore.monsters)
const xpNext   = computed(() => user.level * 1000 + 1000)
const xpPct    = computed(() => Math.min(100, (user.xp / xpNext.value) * 100))

const claimableCount = computed(() => playerStore.quests.filter(q => q.claimable && !q.done).length)
const achieveDone    = computed(() => playerStore.achievements.filter(a => a.done).length)
const achieveTotal   = computed(() => playerStore.achievements.length)

// Gem top-up
const showGemModal = ref(false)
const GEM_PACKS = [
  { gems:100,  price:'0.99',  bonus: 0  },
  { gems:550,  price:'4.99',  bonus: 10 },
  { gems:1200, price:'9.99',  bonus: 20 },
  { gems:2600, price:'19.99', bonus: 30 },
  { gems:7000, price:'49.99', bonus: 40 },
  { gems:15000,price:'99.99', bonus: 50 },
]
function buyGems(p) {
  playerStore.addGems(p.gems)
  showGemModal.value = false
}

function logout() {
  localStorage.removeItem('playerAuth')
  router.push('/player/login')
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 24px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row-center { display:flex; align-items:center; justify-content:center; margin-top:12px; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.profile-top { display:flex; flex-direction:column; align-items:center; margin-top:16px; }
.profile-avatar { width:64px; height:64px; border-radius:50%; background:#ffe066; border:4px solid #fff; display:flex; align-items:center; justify-content:center; font-family:'Fredoka One',cursive; font-size:26px; color:#c98a00; }
.profile-name { font-family:'Fredoka One',cursive; font-size:20px; color:#fff; margin-top:8px; }
.profile-level { font-size:12px; font-weight:800; color:rgba(255,255,255,.8); margin-top:2px; }
.xp-bar { width:160px; height:6px; background:rgba(255,255,255,.25); border-radius:3px; margin-top:8px; overflow:hidden; }
.xp-fill { height:100%; background:#ffe066; border-radius:3px; }
.stats-row { display:flex; background:#fff; border-bottom:2px solid #f0eeff; }
.stat { flex:1; display:flex; flex-direction:column; align-items:center; padding:14px 0; border-right:1px solid #f0eeff; }
.stat:last-child { border-right:none; }
.stat-val { font-family:'Fredoka One',cursive; font-size:16px; color:var(--text); }
.stat-label { font-size:10px; font-weight:800; color:var(--text2); text-transform:uppercase; letter-spacing:.3px; margin-top:2px; }
.menu-list { padding:8px 16px; }
.menu-item { display:flex; align-items:center; gap:12px; padding:14px 0; border-bottom:1px solid #f5f0ff; cursor:pointer; }
.menu-icon { font-size:20px; width:28px; text-align:center; flex-shrink:0; }
.menu-label { flex:1; font-size:13px; font-weight:800; color:var(--text); }
.menu-arrow { font-size:20px; color:var(--text3); }
.notif-count { background:var(--purple); color:#fff; border-radius:10px; padding:2px 7px; font-size:10px; font-weight:800; }
.gem-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.gem-pack { background:#f9f5ff; border-radius:14px; border:2px solid #e0d7ff; padding:12px 6px; text-align:center; cursor:pointer; position:relative; transition:all .15s; }
.gem-pack:hover { border-color:var(--purple); background:var(--purple-light); transform:translateY(-2px); }
.gem-price { font-family:'Fredoka One',cursive; font-size:13px; color:var(--teal); margin-top:4px; }
.gem-bonus { position:absolute; top:-8px; right:-4px; background:var(--orange); color:#fff; font-size:8px; font-weight:800; padding:2px 5px; border-radius:6px; border:2px solid #fff; }
</style>
