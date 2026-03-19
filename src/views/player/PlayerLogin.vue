<template>
  <div class="login-shell">
    <div class="login-bg">
      <div class="bg-circle c1"></div>
      <div class="bg-circle c2"></div>
      <div class="bg-circle c3"></div>
    </div>

    <div class="login-box animate-slide-up">
      <!-- Logo -->
      <div class="login-logo animate-float">🐾</div>
      <div class="login-brand">HATCHME</div>
      <div class="login-sub">Real Life RPG</div>

      <!-- Tabs -->
      <div class="tabs">
        <div class="tab" :class="{ active: mode === 'login' }" @click="mode = 'login'">Sign In</div>
        <div class="tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">Register</div>
      </div>

      <!-- REGISTER FORM -->
      <div v-if="mode === 'register'" class="form-body">
        <div class="field">
          <label>Your Name</label>
          <input class="input" type="text" placeholder="e.g. Arya Kovacs" v-model="form.name" />
        </div>
        <div class="field">
          <label>Email Address</label>
          <input class="input" type="email" placeholder="you@email.com" v-model="form.email" />
        </div>
        <div class="field">
          <label>Phone Number</label>
          <div class="phone-row">
            <select class="input dial-select" v-model="form.dialCode">
              <option v-for="(c, k) in COUNTRIES" :key="k" :value="c.dial">{{ c.flag }} {{ c.dial }}</option>
            </select>
            <input class="input phone-num" type="tel" placeholder="9123 4567" v-model="form.phone" />
          </div>
        </div>
        <div class="field">
          <label>Date of Birth</label>
          <input class="input" type="date" v-model="form.dob" />
        </div>
        <div class="field">
          <label>Password</label>
          <input class="input" type="password" placeholder="••••••••" v-model="form.password" />
        </div>
        <div class="field">
          <label>Referral Code <span class="optional">(optional)</span></label>
          <input class="input" type="text" placeholder="e.g. REF-ARYA1234" v-model="form.referralCode"
            style="text-transform:uppercase" @input="form.referralCode = form.referralCode.toUpperCase()" />
          <div class="field-hint">Enter a friend's referral code to get bonus gems!</div>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-primary btn-full submit-btn" @click="submit">
          Create Account →
        </button>

        <div class="divider"><span>— or sign up with —</span></div>
        <div class="social-row">
          <button class="btn-social" @click="socialLogin('Google')">
            <span class="social-icon google-icon">G</span> Google
          </button>
          <button class="btn-social" @click="socialLogin('Facebook')">
            <span class="social-icon fb-icon">f</span> Facebook
          </button>
        </div>
      </div>

      <!-- LOGIN FORM -->
      <div v-if="mode === 'login'" class="form-body">
        <div class="field">
          <label>Email or Phone</label>
          <input class="input" type="text" placeholder="you@email.com or 9123 4567" v-model="form.identifier" />
        </div>
        <div class="field">
          <label>Password</label>
          <input class="input" type="password" placeholder="••••••••" v-model="form.password" />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-primary btn-full submit-btn" @click="submit">
          Sign In →
        </button>

        <div class="divider"><span>— or sign in with —</span></div>
        <div class="social-row">
          <button class="btn-social" @click="socialLogin('Google')">
            <span class="social-icon google-icon">G</span> Google
          </button>
          <button class="btn-social" @click="socialLogin('Facebook')">
            <span class="social-icon fb-icon">f</span> Facebook
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { playerStore } from '@/store/playerStore.js'
import { COUNTRIES } from '@/data/gameData.js'

const router = useRouter()
const mode = ref('login')
const error = ref('')
const form = ref({
  name: '',
  email: '',
  phone: '',
  dialCode: '+65',
  dob: '',
  password: '',
  referralCode: '',
  identifier: '',
})

function submit() {
  error.value = ''
  if (mode.value === 'register') {
    if (!form.value.name.trim()) { error.value = 'Please enter your name.'; return }
    if (!form.value.email.trim()) { error.value = 'Please enter your email.'; return }
    if (!form.value.password) { error.value = 'Please set a password.'; return }
    const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
    if (accounts[form.value.email.toLowerCase()]) { error.value = 'Email already registered. Please sign in.'; return }
    playerStore.register(form.value.name.trim(), form.value.email.trim(), form.value.password, form.value.referralCode.trim() || null)
    playerStore.user.phone = form.value.dialCode + ' ' + form.value.phone.trim()
    playerStore.user.dob = form.value.dob
    playerStore.save()
  } else {
    if (!form.value.identifier) { error.value = 'Please enter your email or phone.'; return }
    if (!form.value.password) { error.value = 'Please enter your password.'; return }
    const result = playerStore.login(form.value.identifier, form.value.password)
    if (result.error) { error.value = result.error; return }
  }
  router.push('/player/home')
}

function socialLogin(provider) {
  const name = provider + 'User' + Math.floor(1000 + Math.random() * 9000)
  const email = name.toLowerCase() + '@demo.com'
  if (mode.value === 'register') {
    const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
    if (!accounts[email]) {
      playerStore.register(name, email, 'social-' + Date.now(), null)
      playerStore.save()
    }
  } else {
    // Social login: find any social account or create new
    playerStore.register(name, email, 'social-' + Date.now(), null)
    playerStore.save()
  }
  router.push('/player/home')
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  background: linear-gradient(160deg, #7c4dff 0%, #2196f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}
.bg-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,.08); }
.c1 { width: 340px; height: 340px; top: -120px; left: -100px; }
.c2 { width: 260px; height: 260px; bottom: -80px; right: -80px; }
.c3 { width: 180px; height: 180px; top: 40%; left: 60%; }
.login-box {
  background: #fff;
  border-radius: 28px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  z-index: 1;
  text-align: center;
}
.login-logo { font-size: 52px; margin-bottom: 6px; display: block; }
.login-brand { font-family: 'Fredoka One', cursive; font-size: 28px; color: var(--text); line-height: 1; }
.login-sub { font-size: 12px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; margin-bottom: 18px; }
.tabs { display: flex; background: #f5f0ff; border-radius: 14px; padding: 4px; margin-bottom: 20px; }
.tab { flex: 1; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 800; color: var(--text2); cursor: pointer; transition: all 0.2s; }
.tab.active { background: var(--purple); color: #fff; box-shadow: 0 2px 8px rgba(124,77,255,.3); }
.form-body { text-align: left; }
.field { margin-bottom: 11px; }
.field label { display: block; font-size: 11px; font-weight: 800; color: var(--text2); margin-bottom: 5px; }
.optional { font-weight: 600; color: var(--text3); font-style: italic; }
.field-hint { font-size: 10px; font-weight: 700; color: var(--text3); margin-top: 4px; }
.phone-row { display: flex; gap: 6px; }
.dial-select { width: 90px; flex-shrink: 0; padding: 10px 6px; font-size: 12px; }
.phone-num { flex: 1; }
.error-msg { font-size: 12px; font-weight: 800; color: var(--red); background: var(--red-light); border-radius: 10px; padding: 8px 12px; margin-top: 8px; }
.submit-btn { margin-top: 16px; padding: 14px; font-size: 15px; }
.divider { text-align: center; margin: 16px 0 12px; position: relative; }
.divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e8eaf0; }
.divider span { background: #fff; padding: 0 10px; font-size: 11px; font-weight: 700; color: var(--text3); position: relative; }
.social-row { display: flex; gap: 10px; }
.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-social:hover { background: #f5f0ff; border-color: var(--purple); }
.social-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}
.google-icon { background: #fff; color: #DB4437; border: 1.5px solid #e0e0e0; }
.fb-icon { background: #1877F2; color: #fff; }
</style>
