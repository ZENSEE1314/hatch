<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">⚙️ Settings</div>
        <div style="width:36px"></div>
      </div>
    </div>

    <div style="padding:16px">

      <div class="section-label">Preferences</div>
      <div class="setting-card">
        <div class="setting-row" @click="toggle('notifications')">
          <div class="setting-icon">🔔</div>
          <div class="setting-info"><div class="setting-title">Notifications</div><div class="setting-sub">Eggs, quests, streaks</div></div>
          <div class="toggle" :class="s.notifications ? 'on' : 'off'"><div class="toggle-knob"></div></div>
        </div>
        <div class="setting-row" @click="toggle('soundFx')">
          <div class="setting-icon">🔊</div>
          <div class="setting-info"><div class="setting-title">Sound Effects</div><div class="setting-sub">Hatch, feed, claim sounds</div></div>
          <div class="toggle" :class="s.soundFx ? 'on' : 'off'"><div class="toggle-knob"></div></div>
        </div>
        <div class="setting-row" @click="toggleDark">
          <div class="setting-icon">🌙</div>
          <div class="setting-info"><div class="setting-title">Dark Mode</div><div class="setting-sub">Switch to dark theme</div></div>
          <div class="toggle" :class="s.darkMode ? 'on' : 'off'"><div class="toggle-knob"></div></div>
        </div>
      </div>

      <div class="section-label">Region</div>
      <div class="setting-card">
        <div class="setting-row">
          <div class="setting-icon">🌍</div>
          <div class="setting-info"><div class="setting-title">Country</div></div>
          <select class="input" style="width:auto;font-size:12px;padding:6px 10px" v-model="s.country" @change="save">
            <option v-for="(c,k) in COUNTRIES" :key="k" :value="k">{{ c.flag }} {{ c.name }}</option>
          </select>
        </div>
        <div class="setting-row">
          <div class="setting-icon">🗣</div>
          <div class="setting-info"><div class="setting-title">Language</div></div>
          <select class="input" style="width:auto;font-size:12px;padding:6px 10px" v-model="s.language" @change="save">
            <option value="en">English</option>
            <option value="ms">Bahasa Melayu</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>

      <div class="section-label">Account</div>
      <div class="setting-card">
        <div class="setting-row" @click="$router.push('/player/edit-profile')">
          <div class="setting-icon">👤</div>
          <div class="setting-info"><div class="setting-title">Edit Profile</div></div>
          <span class="arrow">›</span>
        </div>
        <div class="setting-row" @click="showPwModal = true">
          <div class="setting-icon">🔒</div>
          <div class="setting-info"><div class="setting-title">Change Password</div></div>
          <span class="arrow">›</span>
        </div>
        <div class="setting-row" @click="deleteData">
          <div class="setting-icon">🗑</div>
          <div class="setting-info"><div class="setting-title" style="color:var(--red)">Reset All Data</div><div class="setting-sub">Delete your progress</div></div>
          <span class="arrow" style="color:var(--red)">›</span>
        </div>
      </div>

      <div class="section-label">About</div>
      <div class="setting-card">
        <div class="setting-row">
          <div class="setting-icon">📱</div>
          <div class="setting-info"><div class="setting-title">App Version</div></div>
          <span style="font-size:12px;font-weight:800;color:var(--text3)">v1.0.0</span>
        </div>
        <div class="setting-row">
          <div class="setting-icon">📄</div>
          <div class="setting-info"><div class="setting-title">Terms of Service</div></div>
          <span class="arrow">›</span>
        </div>
        <div class="setting-row">
          <div class="setting-icon">🔐</div>
          <div class="setting-info"><div class="setting-title">Privacy Policy</div></div>
          <span class="arrow">›</span>
        </div>
      </div>

    </div>
  </div>
  <BottomNav active="profile" />

  <!-- Change Password Modal -->
  <div v-if="showPwModal" class="modal-overlay" @click.self="closePwModal">
    <div class="modal-box">
      <div class="modal-title">
        🔒 Change Password
        <div class="modal-close" @click="closePwModal">✕</div>
      </div>
      <div class="field">
        <label class="form-label">Current Password</label>
        <input class="form-input" type="password" placeholder="••••••••" v-model="pw.current" />
      </div>
      <div class="field">
        <label class="form-label">New Password</label>
        <input class="form-input" type="password" placeholder="••••••••" v-model="pw.newPw" />
      </div>
      <div class="field">
        <label class="form-label">Confirm New Password</label>
        <input class="form-input" type="password" placeholder="••••••••" v-model="pw.confirm" />
      </div>
      <div v-if="pwError" class="error-msg">{{ pwError }}</div>
      <div v-if="pwSuccess" class="success-msg">{{ pwSuccess }}</div>
      <div class="modal-footer">
        <button class="btn btn-gray" @click="closePwModal">Cancel</button>
        <button class="btn btn-primary" @click="changePassword">Save Password</button>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import { COUNTRIES } from '@/data/gameData.js'

const router = useRouter()
const s = playerStore.settings

const showPwModal = ref(false)
const pw = ref({ current: '', newPw: '', confirm: '' })
const pwError = ref('')
const pwSuccess = ref('')

function toggle(key) { s[key] = !s[key]; playerStore.save() }

function toggleDark() {
  s.darkMode = !s.darkMode
  document.body.classList.toggle('dark', s.darkMode)
  playerStore.save()
}

function save() { playerStore.save() }

function closePwModal() {
  showPwModal.value = false
  pw.value = { current: '', newPw: '', confirm: '' }
  pwError.value = ''
  pwSuccess.value = ''
}

function changePassword() {
  pwError.value = ''
  pwSuccess.value = ''
  if (!pw.value.current) { pwError.value = 'Please enter your current password.'; return }
  if (pw.value.current !== playerStore.user.passwordHash) {
    pwError.value = 'Current password is incorrect.'
    return
  }
  if (!pw.value.newPw) { pwError.value = 'Please enter a new password.'; return }
  if (pw.value.newPw.length < 6) { pwError.value = 'New password must be at least 6 characters.'; return }
  if (pw.value.newPw !== pw.value.confirm) { pwError.value = 'Passwords do not match.'; return }
  playerStore.user.passwordHash = pw.value.newPw
  playerStore.save()
  pwSuccess.value = 'Password updated successfully!'
  pw.value = { current: '', newPw: '', confirm: '' }
  setTimeout(() => closePwModal(), 1500)
}

function deleteData() {
  if (confirm('Reset ALL your progress? This cannot be undone.')) {
    localStorage.removeItem('playerData')
    localStorage.removeItem('playerAuth')
    router.push('/player/login')
  }
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 20px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.section-label { font-size:10px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:.8px; margin:16px 0 6px; }
.setting-card { background:#fff; border-radius:16px; border:2px solid #e0d7ff; overflow:hidden; box-shadow:0 2px 0 #d4c8ff; }
.setting-row { display:flex; align-items:center; gap:12px; padding:13px 16px; border-bottom:1px solid #f5f0ff; cursor:pointer; }
.setting-row:last-child { border-bottom:none; }
.setting-icon { font-size:20px; width:28px; text-align:center; flex-shrink:0; }
.setting-info { flex:1; }
.setting-title { font-size:13px; font-weight:800; color:var(--text); }
.setting-sub { font-size:11px; font-weight:700; color:var(--text3); margin-top:1px; }
.arrow { font-size:20px; color:var(--text3); }
.field { margin-bottom:12px; }
.error-msg { background:var(--red-light); border-radius:10px; padding:8px 12px; font-size:12px; font-weight:800; color:var(--red); margin-top:6px; }
.success-msg { background:var(--green-light); border-radius:10px; padding:8px 12px; font-size:12px; font-weight:800; color:var(--green); margin-top:6px; }
</style>
