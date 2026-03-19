<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">✏️ Edit Profile</div>
        <div style="width:36px"></div>
      </div>
    </div>

    <div style="padding:20px 16px 80px">

      <!-- Avatar picker -->
      <div class="avatar-section">
        <div class="avatar-display" @click="showEmojiPicker = !showEmojiPicker">
          <span class="avatar-emoji">{{ playerStore.user.avatar || '🐣' }}</span>
          <div class="avatar-edit-badge">✏️</div>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text2);margin-top:8px">Tap to change avatar</div>

        <!-- Emoji grid -->
        <div v-if="showEmojiPicker" class="emoji-picker">
          <div class="emoji-section-label">Animals</div>
          <div class="emoji-grid">
            <div v-for="e in emojiAnimals" :key="e" class="emoji-opt"
              :class="{ selected: playerStore.user.avatar === e }"
              @click="selectEmoji(e)">{{ e }}</div>
          </div>
          <div class="emoji-section-label">Faces & Nature</div>
          <div class="emoji-grid">
            <div v-for="e in emojiFaces" :key="e" class="emoji-opt"
              :class="{ selected: playerStore.user.avatar === e }"
              @click="selectEmoji(e)">{{ e }}</div>
          </div>
          <div class="emoji-section-label">Objects & Elements</div>
          <div class="emoji-grid">
            <div v-for="e in emojiObjects" :key="e" class="emoji-opt"
              :class="{ selected: playerStore.user.avatar === e }"
              @click="selectEmoji(e)">{{ e }}</div>
          </div>
        </div>
      </div>

      <!-- Form fields -->
      <div class="form-card">
        <div class="field">
          <label class="field-label">Nickname</label>
          <input class="input" type="text" placeholder="Your display name" v-model="playerStore.user.name" />
        </div>
        <div class="field">
          <label class="field-label">Email Address</label>
          <input class="input" type="email" placeholder="you@email.com" v-model="playerStore.user.email" />
        </div>
        <div class="field">
          <label class="field-label">Phone Number</label>
          <input class="input" type="tel" placeholder="+65 9123 4567" v-model="playerStore.user.phone" />
        </div>
        <div class="field">
          <label class="field-label">Date of Birth</label>
          <input class="input" type="date" v-model="playerStore.user.dob" />
        </div>
      </div>

      <!-- Referral code display -->
      <div class="refer-card">
        <div style="font-size:11px;font-weight:800;color:var(--text2);margin-bottom:4px">Your Referral Code</div>
        <div class="refer-code">{{ playerStore.referCode }}</div>
        <div style="font-size:10px;font-weight:700;color:var(--text3);margin-top:4px">Share this code with friends to earn rewards</div>
      </div>

      <button class="btn btn-primary btn-full" style="padding:14px;font-size:15px;margin-top:20px" @click="save">
        Save Profile ✓
      </button>

      <!-- Toast -->
      <div v-if="toast" class="toast">✅ Profile updated!</div>
    </div>
  </div>
  <BottomNav active="profile" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'

const showEmojiPicker = ref(false)
const toast = ref(false)

const emojiAnimals  = ['🐣','🐱','🐶','🦊','🐼','🐸','🦄','🐲','🐯','🦁','🐺','🐨','🐙','🦈','🦅','🐬']
const emojiFaces    = ['🌸','🌟','🌈','🌺','🍀','🌙','☀️','⭐','🌻','🦋','🐝','🌴']
const emojiObjects  = ['⚡','🔥','💧','🌿','💨','💎','🎯','🏆','🎲','🎮','🚀','🌍']

function selectEmoji(e) {
  playerStore.user.avatar = e
  showEmojiPicker.value = false
}

function save() {
  playerStore.save()
  toast.value = true
  setTimeout(() => { toast.value = false }, 2500)
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 20px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }

.avatar-section { display:flex; flex-direction:column; align-items:center; margin-bottom:20px; }
.avatar-display { position:relative; cursor:pointer; }
.avatar-emoji { font-size:72px; display:block; line-height:1; }
.avatar-edit-badge { position:absolute; bottom:0; right:-4px; background:var(--purple); color:#fff; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; border:2px solid #fff; }

.emoji-picker { background:#fff; border-radius:18px; border:2px solid #e0d7ff; padding:14px; margin-top:12px; width:100%; box-shadow:0 4px 16px rgba(124,77,255,.12); }
.emoji-section-label { font-size:10px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; margin-top:10px; }
.emoji-section-label:first-child { margin-top:0; }
.emoji-grid { display:flex; flex-wrap:wrap; gap:6px; }
.emoji-opt { font-size:26px; cursor:pointer; padding:4px; border-radius:10px; border:2px solid transparent; transition:all .15s; }
.emoji-opt:hover { background:#f0eeff; border-color:#d4c8ff; }
.emoji-opt.selected { background:#ede7ff; border-color:var(--purple); }

.form-card { background:#fff; border-radius:18px; border:2px solid #e0d7ff; padding:16px; box-shadow:0 2px 0 #d4c8ff; }
.field { margin-bottom:12px; }
.field:last-child { margin-bottom:0; }
.field-label { display:block; font-size:11px; font-weight:800; color:var(--text2); margin-bottom:5px; }

.refer-card { background:#f0eeff; border-radius:16px; border:2px solid #d4c8ff; padding:14px 16px; margin-top:16px; text-align:center; }
.refer-code { font-family:'Fredoka One',cursive; font-size:20px; color:var(--purple); letter-spacing:1px; }

.toast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:#1b5e20; color:#fff; padding:10px 22px; border-radius:20px; font-size:13px; font-weight:800; box-shadow:0 4px 16px rgba(0,0,0,.2); z-index:999; white-space:nowrap; }
</style>
