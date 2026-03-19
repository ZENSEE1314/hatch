<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">👥 Refer a Friend</div>
        <div style="width:36px"></div>
      </div>
    </div>

    <div style="padding:20px 16px">
      <div class="refer-hero">
        <div style="font-size:56px">🎁</div>
        <div style="font-family:'Fredoka One',cursive;font-size:22px;color:var(--text);margin-top:12px">Refer & Earn!</div>
        <div style="font-size:13px;font-weight:700;color:var(--text2);margin-top:6px;line-height:1.7">
          Invite friends to HATCHME.<br>
          You both get a <strong style="color:var(--purple)">free Bronze Egg</strong> when they register!
        </div>
      </div>

      <!-- Referral code -->
      <div class="code-card">
        <div style="font-size:11px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Your Referral Code</div>
        <div class="refer-code">{{ playerStore.referCode || 'REF-LOADING' }}</div>
        <button class="btn btn-primary btn-full" style="margin-top:12px" @click="copyCode">
          {{ copied ? '✓ Copied!' : '📋 Copy Code' }}
        </button>
      </div>

      <!-- How it works -->
      <div style="font-family:'Fredoka One',cursive;font-size:16px;color:var(--text);margin:20px 0 10px">How it works</div>
      <div class="steps">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">Share your code with a friend</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">They register with your code</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">You both get a free Bronze Egg!</div>
        </div>
      </div>

      <!-- Stats -->
      <div class="refer-stats">
        <div class="stat"><div class="stat-val">{{ referralCount }}</div><div class="stat-label">Friends Referred</div></div>
        <div class="stat"><div class="stat-val">{{ referralCount }}</div><div class="stat-label">Eggs Earned</div></div>
      </div>

      <!-- Quest progress -->
      <div class="quest-link" @click="$router.push('/player/quests')">
        <span>📋 Recruit quest: {{ recruitQuest?.progress || 0 }} / {{ recruitQuest?.target || 3 }} friends</span>
        <span>›</span>
      </div>

      <!-- Share buttons -->
      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-full" style="flex:1;background:#25D366;color:#fff;border-color:#1ea952" @click="shareWhatsapp">
          WhatsApp
        </button>
        <button class="btn btn-full" style="flex:1;background:#1DA1F2;color:#fff;border-color:#1a8fd1" @click="shareTelegram">
          Telegram
        </button>
      </div>
    </div>

  </div>
  <BottomNav active="profile" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'

const copied = ref(false)
const referralCount = computed(() => playerStore.quests.find(q => q.id === 3)?.progress || 0)
const recruitQuest  = computed(() => playerStore.quests.find(q => q.id === 3))

function copyCode() {
  navigator.clipboard?.writeText(playerStore.referCode).catch(() => {})
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const shareMsg = computed(() => `Join me on HATCHME — the Real Life RPG! Use my code ${playerStore.referCode} to get a free egg 🥚 Download: hatchme.app`)

function shareWhatsapp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg.value)}`, '_blank')
}
function shareTelegram() {
  window.open(`https://t.me/share/url?text=${encodeURIComponent(shareMsg.value)}`, '_blank')
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 20px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.refer-hero { text-align:center; padding:20px 0 16px; }
.code-card { background:#fff; border-radius:18px; border:3px solid #e0d7ff; padding:18px; text-align:center; box-shadow:0 3px 0 #d4c8ff; }
.refer-code { font-family:'Fredoka One',cursive; font-size:24px; color:var(--purple); letter-spacing:3px; background:var(--purple-light); padding:12px 20px; border-radius:12px; border:2px dashed var(--purple); }
.steps { display:flex; flex-direction:column; gap:10px; }
.step-item { display:flex; align-items:center; gap:12px; background:#fff; border-radius:14px; border:2px solid #e0d7ff; padding:12px 14px; box-shadow:0 2px 0 #d4c8ff; }
.step-num { width:32px; height:32px; border-radius:50%; background:var(--purple); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Fredoka One',cursive; font-size:16px; flex-shrink:0; }
.step-text { font-size:13px; font-weight:800; color:var(--text); }
.refer-stats { display:flex; gap:10px; margin-top:16px; }
.stat { flex:1; background:#fff; border-radius:14px; border:2px solid #e0d7ff; padding:14px; text-align:center; }
.stat-val { font-family:'Fredoka One',cursive; font-size:22px; color:var(--purple); }
.stat-label { font-size:10px; font-weight:800; color:var(--text2); text-transform:uppercase; margin-top:2px; }
.quest-link { background:#f9f5ff; border-radius:12px; border:2px solid #e0d7ff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:800; color:var(--purple); cursor:pointer; margin-top:12px; }
</style>
