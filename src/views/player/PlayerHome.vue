<template>
  <div class="phone-shell" style="background: var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="player-header">
      <svg class="header-clouds" viewBox="0 0 390 130" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="60" cy="40" rx="55" ry="28" fill="#fff" opacity=".1"/>
        <ellipse cx="200" cy="20" rx="70" ry="30" fill="#fff" opacity=".1"/>
        <ellipse cx="340" cy="50" rx="50" ry="22" fill="#fff" opacity=".1"/>
      </svg>
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar animate-float">{{ user.avatar || user.name[0] || '🐣' }}</div>
          <div>
            <div class="user-name">{{ user.name }}</div>
            <div class="user-level">⭐ Level {{ user.level }} · {{ user.xp }} XP</div>
          </div>
        </div>
        <div class="notif-btn" @click="showNotifPanel = true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div v-if="unreadCount > 0" class="notif-dot">{{ unreadCount > 9 ? '9+' : unreadCount }}</div>
        </div>
      </div>
    </div>

    <!-- WALLET -->
    <div class="wallet-card">
      <div class="wallet-half" style="background:#e8fff5">
        <div class="wallet-icon" style="background:#c8f7e4">💰</div>
        <div style="flex:1">
          <div class="wallet-amount" style="color:#00695c">{{ fmtSGD(user.withdrawableCash || 0) }}</div>
          <div class="wallet-label" style="color:#00897b">Withdrawable (SGD)</div>
          <div style="font-size:9px;color:#888;font-weight:700;margin-top:1px">Earned from watching ads</div>
          <button class="wallet-btn" style="color:#00897b;border-color:#00897b;margin-top:5px"
            @click="$router.push('/player/withdraw')">Withdraw</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;background:#f3eeff;border-radius:16px;padding:14px 12px">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="wallet-icon" style="background:#ede7ff;width:32px;height:32px">🔒</div>
          <div>
            <div style="font-family:'Fredoka One',cursive;font-size:16px;color:#5e35b1">{{ fmtSGD(user.cash) }}</div>
            <div style="font-size:9px;color:#9e9e9e;font-weight:700">Locked (feed to unlock)</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="wallet-icon" style="background:#ede7ff;width:32px;height:32px">💎</div>
          <div>
            <div style="font-family:'Fredoka One',cursive;font-size:16px;color:#5e35b1">{{ user.gems.toLocaleString() }}</div>
            <div style="font-size:9px;color:#7c4dff;font-weight:700">Gems</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FEED ALERT -->
    <div v-if="hungryCount > 0" class="feed-alert" @click="$router.push('/player/feeding')">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="feed-icon">❤️</div>
        <div>
          <div class="feed-title">{{ hungryCount }} monster{{ hungryCount > 1 ? 's are' : ' is' }} hungry!</div>
          <div class="feed-sub">Feed now to keep your streak going 🔥</div>
        </div>
      </div>
      <button class="btn btn-orange">Feed!</button>
    </div>

    <!-- INCUBATING EGGS -->
    <div class="section-header">
      <span class="section-title">🥚 Incubating Eggs</span>
      <span class="section-link" @click="$router.push('/player/scan')">+ New egg</span>
    </div>
    <div class="eggs-scroll">
      <div v-if="incubatingEggs.length === 0" class="egg-empty">
        <div style="font-size:28px">🥚</div>
        <div style="font-family:'Fredoka One',cursive;font-size:11px;color:var(--text2);margin-top:4px;text-align:center">No eggs yet.<br>Scan a merchant!</div>
      </div>
      <div v-for="egg in incubatingEggs" :key="egg.id" class="egg-card"
           :style="{ borderColor: egg.tierColor }"
           @click="$router.push('/player/hatching')">
        <div class="egg-ring-wrap">
          <div class="egg-body" :class="{ 'egg-ready': eggTimer(egg).done }">🥚</div>
          <svg class="egg-ring" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#e0e0e0" stroke-width="3"/>
            <circle cx="28" cy="28" r="24" fill="none" :stroke="egg.tierColor" stroke-width="3"
              :stroke-dasharray="150.8" :stroke-dashoffset="150.8 * (1 - eggTimer(egg).progress)"
              stroke-linecap="round" transform="rotate(-90 28 28)"/>
          </svg>
        </div>
        <div class="badge" :style="{ background: egg.tierBg, color: egg.tierColor }">{{ egg.tier }}</div>
        <div v-if="eggTimer(egg).done" class="egg-timer" style="color:#2e7d32">Ready!</div>
        <div v-else class="egg-timer">
          {{ String(eggTimer(egg).h).padStart(2,'0') }}:{{ String(eggTimer(egg).m).padStart(2,'0') }}:{{ String(eggTimer(egg).s).padStart(2,'0') }}
        </div>
        <div class="egg-timer-label">{{ eggTimer(egg).done ? 'tap to hatch' : 'remaining' }}</div>
        <div class="egg-value">{{ fmtSGD(egg.value) }}</div>
      </div>
      <!-- Add egg tile -->
      <div class="egg-add" @click="$router.push('/player/scan')">
        <div class="egg-add-icon">➕</div>
        <div class="egg-add-label">Scan QR to get new egg</div>
      </div>
    </div>

    <!-- MONSTERS -->
    <div class="section-header">
      <span class="section-title">🐾 My Monsters ({{ monsters.length }})</span>
      <span class="section-link" @click="$router.push('/player/monsters')">See all</span>
    </div>
    <div v-if="monsters.length === 0" class="no-monsters">
      <div style="font-size:32px">🥚</div>
      <div style="font-family:'Fredoka One',cursive;font-size:13px;color:var(--text2);margin-top:8px">Hatch an egg to get your first monster!</div>
      <button class="btn btn-primary btn-sm" style="margin-top:10px" @click="$router.push('/player/scan')">Scan QR →</button>
    </div>
    <div v-else class="monsters-grid">
      <div v-for="m in monsters.slice(0, 5)" :key="m.id"
           class="monster-card"
           :class="m.status"
           @click="$router.push('/player/monsters')">
        <div v-if="m.status === 'new'"    class="monster-badge" style="background:linear-gradient(135deg,#f9a825,#ff6f00)">New!</div>
        <div v-if="m.status === 'fed'"    class="monster-badge" style="background:#4caf50">Fed!</div>
        <div v-if="m.status === 'hungry'" class="monster-badge" style="background:#ff9800">Hungry!</div>
        <div class="monster-face" v-html="getMonsterImage(m)"></div>
        <div class="monster-name">{{ m.name }}</div>
        <div class="monster-meta">{{ m.set }} · {{ m.tier }}</div>
        <div class="monster-streak">
          🔥 <span>{{ m.streak }}d</span>
        </div>
        <div class="monster-hp">
          <div class="monster-hp-fill" :style="{ width: m.hp + '%', background: hpColor(m.hp) }"></div>
        </div>
      </div>
      <!-- View all tile -->
      <div class="monster-card more-tile" @click="$router.push('/player/monsters')">
        <div style="font-size:24px;color:#b39dff">+</div>
        <div style="font-family:'Fredoka One',cursive;font-size:10px;color:#b39dff">{{ monsters.length - 5 > 0 ? monsters.length - 5 + ' more' : 'View all' }}</div>
      </div>
    </div>

    <!-- QUESTS -->
    <div class="section-header" style="margin-top:14px">
      <span class="section-title">📋 Active Quests</span>
      <button style="font-size:11px;font-weight:800;color:#fff;background:var(--orange);border-radius:12px;padding:4px 12px;cursor:pointer;border:2px solid #e64a19;box-shadow:0 2px 0 #bf360c" @click="$router.push('/player/quests')">View all ↗</button>
    </div>
    <div class="quest-strip">
      <div v-for="q in activeQuests" :key="q.id"
           class="quest-chip" :class="{ claimable: q.claimable }">
        <div v-if="q.claimable" class="quest-dot"></div>
        <div class="quest-icon">🎯</div>
        <div style="flex:1;min-width:0">
          <div class="quest-name">{{ q.title }}</div>
          <div v-if="q.claimable" class="quest-progress" style="color:#00bcd4;font-weight:800">🎉 Claim now!</div>
          <div v-else class="quest-progress">{{ q.progress }} / {{ q.target }}</div>
          <div class="quest-bar">
            <div class="quest-fill" :style="{ width: Math.min(100, q.progress / q.target * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

  </div><!-- end scroll-content -->

    <!-- BOTTOM NAV -->
    <BottomNav active="home" />

  <!-- NOTIFICATION PANEL -->
  <transition name="slide-down">
    <div v-if="showNotifPanel" class="notif-panel-overlay" @click.self="showNotifPanel = false">
      <div class="notif-panel">
        <div class="notif-panel-header">
          <div style="font-family:'Fredoka One',cursive;font-size:17px;color:var(--text)">🔔 Notifications</div>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn btn-gray btn-sm" @click="markAll">Mark all read</button>
            <button class="notif-close" @click="showNotifPanel = false">✕</button>
          </div>
        </div>
        <div v-if="notifications.length === 0" style="padding:30px;text-align:center;color:var(--text3);font-weight:700">
          No notifications yet.
        </div>
        <div v-for="n in notifications" :key="n.id" class="notif-item" :class="{ unread: !n.read }" @click="readNotif(n.id)">
          <div class="notif-icon">{{ n.icon }}</div>
          <div class="notif-body">
            <div class="notif-title">{{ n.title }}</div>
            <div class="notif-text">{{ n.body }}</div>
            <div class="notif-time">{{ n.time }}</div>
          </div>
          <div v-if="!n.read" class="notif-unread-dot"></div>
        </div>
      </div>
    </div>
  </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import { getMonsterImage } from '@/data/monsterImages.js'

function fmtSGD(v) { return 'S$' + Number(v).toFixed(2) }

const user = playerStore.user
const monsters = computed(() => playerStore.monsters)
const incubatingEggs = computed(() => playerStore.eggs)
const HUNGER_MS = 3 * 60 * 60 * 1000
function liveHp(m) {
  if (!m.lastFedAt) return 0
  return Math.max(0, Math.round(100 - ((now.value - m.lastFedAt) / HUNGER_MS) * 100))
}
const hungryCount = computed(() => playerStore.monsters.filter(m => liveHp(m) < 100).length)
const activeQuests = computed(() => playerStore.quests.filter(q => q.enabled).slice(0, 4))
const notifications = computed(() => playerStore.notifications)
const unreadCount = computed(() => playerStore.notifications.filter(n => !n.read).length)

const showNotifPanel = ref(false)

function readNotif(id) { playerStore.markNotifRead(id) }
function markAll() { playerStore.markAllNotifsRead() }

function hpColor(hp) {
  if (hp > 60) return 'linear-gradient(90deg,#66bb6a,#2e7d32)'
  if (hp > 30) return 'linear-gradient(90deg,#ffa726,#f57c00)'
  return 'linear-gradient(90deg,#ef5350,#c62828)'
}

// ── Real-time egg timer ──
const now = ref(Date.now())
let timerInterval = null
onMounted(() => { timerInterval = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(timerInterval))

function eggTimer(egg) {
  const ms = Math.max(0, (egg.hatchAt || 0) - now.value)
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const duration = (egg.hatchAt || 0) - (egg.createdAt || 0)
  const elapsed  = now.value - (egg.createdAt || 0)
  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 1
  return { h, m, s, progress, done: ms === 0 }
}
</script>

<style scoped>
.player-header {
  background: linear-gradient(160deg, #7c4dff 0%, #2196f3 100%);
  padding: 0 20px 30px;
  position: relative;
  overflow: hidden;
}
.header-clouds { position: absolute; inset: 0; pointer-events: none; }
.status-bar { display: flex; justify-content: space-between; padding: 10px 0 0; font-size: 11px; color: rgba(255,255,255,.9); font-weight: 800; }
.header-row { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
.avatar { width: 44px; height: 44px; border-radius: 50%; background: #ffe066; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; font-family: 'Fredoka One', cursive; font-size: 20px; color: #c98a00; flex-shrink: 0; }
.user-name { font-family: 'Fredoka One', cursive; font-size: 17px; color: #fff; }
.user-level { font-size: 11px; color: rgba(255,255,255,.8); font-weight: 700; margin-top: 1px; }
.notif-btn { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,.2); border: 2px solid rgba(255,255,255,.35); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
.notif-dot { position: absolute; top: -4px; right: -4px; min-width: 16px; height: 16px; background: #ff4d6d; border-radius: 8px; border: 2px solid rgba(124,77,255,0.8); font-size: 8px; font-weight: 800; color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 3px; }

/* WALLET */
.wallet-card { margin: -16px 16px 0; background: #fff; border-radius: 22px; border: 3px solid #e8e0ff; padding: 14px 16px; display: flex; gap: 10px; box-shadow: 0 4px 0 #d4c8ff; }
.wallet-half { flex: 1; border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; }
.wallet-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.wallet-amount { font-family: 'Fredoka One', cursive; font-size: 17px; line-height: 1; }
.wallet-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; margin-top: 1px; }
.wallet-btn { font-size: 9px; padding: 2px 7px; border-radius: 6px; border: 1.5px solid; font-weight: 700; cursor: pointer; margin-top: 4px; background: transparent; font-family: 'Nunito', sans-serif; }

/* FEED ALERT */
.feed-alert { margin: 12px 16px 0; background: #fff3e0; border-radius: 16px; border: 3px solid #ff9800; padding: 11px 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 3px 0 #f57c00; cursor: pointer; }
.feed-icon { width: 36px; height: 36px; background: #ffe0cc; border-radius: 11px; border: 2px solid #ff9800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
.feed-title { font-size: 13px; font-weight: 800; color: var(--text); }
.feed-sub { font-size: 10px; color: #e65100; font-weight: 700; margin-top: 1px; }

/* SECTIONS */
.section-header { display: flex; justify-content: space-between; align-items: center; padding: 0 16px; margin: 14px 0 8px; }
.section-title { font-family: 'Fredoka One', cursive; font-size: 16px; color: var(--text); }
.section-link { font-size: 12px; color: var(--purple); font-weight: 800; cursor: pointer; }

/* EGGS */
.eggs-scroll { display: flex; gap: 10px; padding: 0 16px 4px; overflow-x: auto; scrollbar-width: none; }
.eggs-scroll::-webkit-scrollbar { display: none; }
.egg-card { flex-shrink: 0; width: 98px; background: #fff; border-radius: 16px; border: 3px solid #e0d7ff; padding: 10px 8px 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; box-shadow: 0 3px 0 #d4c8ff; }
.egg-ring-wrap { position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; }
.egg-body { font-size: 32px; animation: egg-bob 4s ease-in-out infinite; }
.egg-ring { position: absolute; top: 0; left: 0; width: 56px; height: 56px; }
.egg-timer { font-family: 'Fredoka One', cursive; font-size: 14px; color: var(--text); line-height: 1; margin-top: 2px; }
.egg-timer-label { font-size: 8px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: .3px; }
.egg-value { font-size: 10px; font-weight: 800; color: var(--green); }
.egg-empty { flex-shrink: 0; width: 98px; background: #fafaff; border-radius: 16px; border: 3px dashed #d4c8ff; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 130px; }
.no-monsters { padding: 20px 16px; text-align: center; }
.egg-add { flex-shrink: 0; width: 98px; background: #f9f5ff; border-radius: 16px; border: 3px dashed #d4c8ff; padding: 10px 8px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; cursor: pointer; min-height: 130px; }
.egg-add-icon { font-size: 24px; }
.egg-add-label { font-family: 'Fredoka One', cursive; font-size: 10px; color: var(--purple); text-align: center; line-height: 1.3; }

/* MONSTERS */
.monsters-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 16px; }
.monster-card { background: #fff; border-radius: 16px; border: 3px solid #e0e7ff; padding: 10px 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; box-shadow: 0 3px 0 #c5cae9; position: relative; }
.monster-card.hungry { border-color: #ff9800; animation: hungry-pulse 2s ease-in-out infinite; }
.monster-card.fed { border-color: #a5d6a7; }
.monster-card.new { border-color: #ffd740; }
.monster-badge { position: absolute; top: -7px; right: -7px; border-radius: 8px; padding: 2px 6px; font-size: 8px; font-weight: 800; color: #fff; border: 2px solid #fff; }
.monster-face { width:56px; height:56px; margin:0 auto; }
.monster-name { font-family: 'Fredoka One', cursive; font-size: 10px; color: var(--text); text-align: center; line-height: 1.2; }
.monster-meta { font-size: 8px; color: var(--text2); font-weight: 700; text-transform: uppercase; letter-spacing: .3px; }
.monster-streak { display: flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 800; color: var(--orange); margin-top: 2px; }
.monster-hp { width: 100%; height: 5px; background: #e8e8ff; border-radius: 3px; margin-top: 2px; overflow: hidden; border: 1px solid #d0d0ff; }
.monster-hp-fill { height: 100%; border-radius: 2px; }
.more-tile { border-style: dashed; border-color: #d4c8ff; box-shadow: none; background: #fafaff; justify-content: center; }

/* QUESTS */
.quest-strip { display: flex; gap: 8px; padding: 0 16px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; }
.quest-strip::-webkit-scrollbar { display: none; }
.quest-chip { flex-shrink: 0; background: #fff; border: 3px solid #e0d7ff; border-radius: 16px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; min-width: 148px; box-shadow: 0 3px 0 #d4c8ff; position: relative; }
.quest-chip.claimable { border-color: #00bcd4; }
.quest-dot { position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; border-radius: 50%; background: #00bcd4; border: 2px solid #fff; }
.quest-icon { font-size: 18px; }
.quest-name { font-size: 11px; font-weight: 800; color: var(--text); line-height: 1.2; }
.quest-progress { font-size: 9px; color: var(--text2); font-weight: 700; margin-top: 1px; }
.quest-bar { height: 4px; background: #f0eeff; border-radius: 2px; margin-top: 5px; }
.quest-fill { height: 100%; border-radius: 2px; background: var(--purple); }

/* NOTIFICATION PANEL */
.notif-panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 400; display: flex; flex-direction: column; justify-content: flex-start; }
.notif-panel { background: #fff; border-radius: 0 0 24px 24px; max-height: 75vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,.2); animation: slide-down-in .25s ease; }
.notif-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 12px; border-bottom: 2px solid #f0eeff; position: sticky; top: 0; background: #fff; z-index: 1; }
.notif-close { width: 28px; height: 28px; border-radius: 8px; background: #f5f0ff; border: 1.5px solid #d4c8ff; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f5f0ff; cursor: pointer; transition: background .15s; position: relative; }
.notif-item:hover { background: #faf8ff; }
.notif-item.unread { background: #f5f0ff; }
.notif-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
.notif-body { flex: 1; }
.notif-title { font-size: 13px; font-weight: 800; color: var(--text); }
.notif-text { font-size: 11px; font-weight: 700; color: var(--text2); margin-top: 2px; line-height: 1.4; }
.notif-time { font-size: 10px; font-weight: 700; color: var(--text3); margin-top: 4px; }
.notif-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--purple); flex-shrink: 0; margin-top: 6px; }

.egg-ready { animation: egg-shake 0.4s ease-in-out infinite !important; }
@keyframes egg-shake { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
@keyframes slide-down-in { 0%{transform:translateY(-30px);opacity:0} 100%{transform:translateY(0);opacity:1} }
.slide-down-enter-active, .slide-down-leave-active { transition: opacity .2s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; }
.monster-face :deep(svg) { width:100%; height:100%; display:block; }
</style>
