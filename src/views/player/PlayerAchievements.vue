<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">🏆 Achievements</div>
        <div class="count-badge">{{ done }} / {{ total }}</div>
      </div>
    </div>

    <div style="padding:16px">
      <div v-for="a in achievements" :key="a.id" class="ach-card" :class="{ done: a.done }">
        <div class="ach-icon" :class="{ glow: a.done }">{{ a.icon }}</div>
        <div class="ach-info">
          <div class="ach-title">{{ a.title }}</div>
          <div class="ach-desc">{{ a.desc }}</div>
          <div class="ach-bar" v-if="!a.done">
            <div class="ach-fill" :style="{ width: Math.min(100, a.progress / a.target * 100) + '%' }"></div>
          </div>
          <div class="ach-progress" v-if="!a.done">{{ a.progress }} / {{ a.target }}</div>
        </div>
        <div v-if="a.done" class="ach-done">✓</div>
        <div v-else class="ach-pct">{{ Math.floor(a.progress / a.target * 100) }}%</div>
      </div>
    </div>

  </div>
  <BottomNav active="profile" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'

const achievements = computed(() => playerStore.achievements)
const done  = computed(() => achievements.value.filter(a => a.done).length)
const total = computed(() => achievements.value.length)
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 20px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.count-badge { background:rgba(255,255,255,.25); border:2px solid rgba(255,255,255,.4); color:#fff; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:800; }

.ach-card { background:#fff; border-radius:16px; border:3px solid #e0d7ff; padding:14px; margin-bottom:10px; display:flex; align-items:center; gap:12px; box-shadow:0 3px 0 #d4c8ff; }
.ach-card.done { border-color:#ffd740; box-shadow:0 3px 0 #ffca28; background:#fffde7; }
.ach-icon { width:48px; height:48px; border-radius:14px; background:#f5f0ff; border:2px solid #e0d7ff; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.ach-icon.glow { background:#fff9c4; border-color:#ffd740; }
.ach-info { flex:1; min-width:0; }
.ach-title { font-size:13px; font-weight:800; color:var(--text); }
.ach-desc { font-size:11px; font-weight:700; color:var(--text2); margin-top:2px; margin-bottom:6px; }
.ach-bar { height:6px; background:#f0eeff; border-radius:3px; overflow:hidden; }
.ach-fill { height:100%; background:var(--purple); border-radius:3px; }
.ach-progress { font-size:10px; font-weight:800; color:var(--text3); margin-top:3px; }
.ach-done { width:28px; height:28px; border-radius:50%; background:#ffd740; border:2px solid #ffca28; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#e65100; flex-shrink:0; }
.ach-pct { font-size:11px; font-weight:800; color:var(--text3); flex-shrink:0; }
</style>
