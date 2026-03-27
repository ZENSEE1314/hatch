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
        <div class="tab" :class="{ active: mode === 'login' }" @click="mode='login'">Sign In</div>
        <div class="tab" :class="{ active: mode === 'register' }" @click="mode='register'">Register</div>
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
          <div class="pw-wrap">
            <input class="input" :type="showRegPw ? 'text' : 'password'" placeholder="••••••••" v-model="form.password" />
            <button class="pw-eye" type="button" @click="showRegPw = !showRegPw">{{ showRegPw ? '🙈' : '👁️' }}</button>
          </div>
        </div>
        <div class="field">
          <label>Referral Code <span class="optional">(optional)</span></label>
          <input class="input" type="text" placeholder="e.g. REF-ARYA1234" v-model="form.referralCode"
            style="text-transform:uppercase" @input="form.referralCode = form.referralCode.toUpperCase()" />
          <div class="field-hint">Enter a friend's referral code to get bonus gems!</div>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-primary btn-full submit-btn" @click="submit" :disabled="loading">{{ loading ? 'Creating...' : 'Create Account →' }}</button>

        <div class="divider"><span>— or sign up with —</span></div>
        <div class="social-row">
          <button class="btn-social" @click="googleLogin">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Google
          </button>
          <button class="btn-social" @click="facebookLogin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
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
          <div class="pw-wrap">
            <input class="input" :type="showLoginPw ? 'text' : 'password'" placeholder="••••••••" v-model="form.password" @keyup.enter="submit" />
            <button class="pw-eye" type="button" @click="showLoginPw = !showLoginPw">{{ showLoginPw ? '🙈' : '👁️' }}</button>
          </div>
        </div>

        <div class="remember-row">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" class="remember-check" />
            <span>Remember me</span>
          </label>
          <span class="forgot-link" @click="showForgot = true">Forgot password?</span>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-primary btn-full submit-btn" @click="submit" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign In →' }}</button>

        <div class="divider"><span>— or sign in with —</span></div>
        <div class="social-row">
          <button class="btn-social" @click="googleLogin">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Google
          </button>
          <button class="btn-social" @click="facebookLogin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>
      </div>
    </div>

    <!-- ── FORGOT PASSWORD MODAL ── -->
    <div v-if="showForgot" class="modal-overlay" @click.self="showForgot=false;forgotStep=1;forgotEmail='';forgotError='';forgotResult=''">
      <div class="modal-box">
        <div class="modal-title">🔑 Forgot Password</div>
        <div v-if="forgotStep === 1">
          <p class="modal-desc">Enter your registered email address and we'll recover your account.</p>
          <input class="input" type="email" placeholder="you@email.com" v-model="forgotEmail" style="margin-bottom:10px" />
          <div v-if="forgotError" class="error-msg">{{ forgotError }}</div>
          <button class="btn btn-primary btn-full" style="margin-top:8px" @click="doForgot">Recover Account →</button>
        </div>
        <div v-if="forgotStep === 2">
          <div class="forgot-result">{{ forgotResult }}</div>
          <button class="btn btn-primary btn-full" style="margin-top:14px" @click="showForgot=false;forgotStep=1;mode='login'">Sign In Now →</button>
        </div>
        <div class="modal-close" @click="showForgot=false;forgotStep=1">✕</div>
      </div>
    </div>

    <!-- ── SOCIAL REFERRAL MODAL ── -->
    <div v-if="showSocialRef" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-title">🎉 Welcome, {{ socialUser.name }}!</div>
        <p class="modal-desc">Do you have a referral code? (optional — skip to continue)</p>
        <input class="input" type="text" placeholder="e.g. REF-FRIEND123" v-model="socialRefCode"
          style="text-transform:uppercase;margin-bottom:10px" @input="socialRefCode = socialRefCode.toUpperCase()" />
        <button class="btn btn-primary btn-full" @click="completeSocialLogin">Continue →</button>
        <button class="btn-ghost" @click="socialRefCode='';completeSocialLogin()">Skip</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { playerStore } from '@/store/playerStore.js'
import { COUNTRIES } from '@/data/gameData.js'
import { PlayerDB } from '@/api/db.js'

// ── Replace with your real credentials ─────────────────────────────────────
const GOOGLE_CLIENT_ID   = 'YOUR_GOOGLE_CLIENT_ID'   // console.cloud.google.com → APIs & Services → Credentials
const FACEBOOK_APP_ID    = 'YOUR_FACEBOOK_APP_ID'    // developers.facebook.com → My Apps

const router       = useRouter()
const mode         = ref('login')
const error        = ref('')
const showLoginPw  = ref(false)
const showRegPw    = ref(false)
const rememberMe   = ref(false)

const form = ref({ name:'', email:'', phone:'', dialCode:'+65', dob:'', password:'', referralCode:'', identifier:'' })

// ── Remember Me ─────────────────────────────────────────────────────────────
onMounted(() => {
  const saved = localStorage.getItem('playerRemember')
  if (saved) {
    try { const s = JSON.parse(saved); form.value.identifier = s.identifier || saved; form.value.password = s.password || ''; rememberMe.value = true }
    catch { form.value.identifier = saved; rememberMe.value = true }
  }

  // Load Google GIS
  if (!document.getElementById('gsi-script')) {
    const s = document.createElement('script')
    s.id = 'gsi-script'
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    document.head.appendChild(s)
  }
  // Load Facebook SDK
  if (!document.getElementById('fb-sdk')) {
    const s = document.createElement('script')
    s.id = 'fb-sdk'
    s.src = 'https://connect.facebook.net/en_US/sdk.js'
    s.async = true
    s.onload = () => {
      window.FB && window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: 'v18.0' })
    }
    document.head.appendChild(s)
  }
})

// ── Submit (email/password) ─────────────────────────────────────────────────
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'register') {
      if (!form.value.name.trim())  { error.value = 'Please enter your name.'; return }
      if (!form.value.email.trim()) { error.value = 'Please enter your email.'; return }
      if (!form.value.password)     { error.value = 'Please set a password.'; return }
      // Register in DB (source of truth)
      const res = await PlayerDB.register({
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
        phone: form.value.dialCode + ' ' + form.value.phone.trim(),
        dob: form.value.dob,
        referralCode: form.value.referralCode.trim() || '',
      })
      if (res.error) { error.value = res.error; return }
      // Init local game state
      playerStore.register(form.value.name.trim(), form.value.email.trim(), form.value.password, form.value.referralCode.trim() || null)
      playerStore.user.phone = form.value.dialCode + ' ' + form.value.phone.trim()
      playerStore.user.dob   = form.value.dob
      playerStore.save()
      // Save initial game state to DB so it's available on any device
      await PlayerDB.saveData(form.value.email.trim().toLowerCase(), {
        user: playerStore.user, monsters: playerStore.monsters, eggs: playerStore.eggs,
        quests: playerStore.quests, achievements: playerStore.achievements,
        referCode: playerStore.referCode, settings: playerStore.settings,
        notifications: playerStore.notifications, feedingData: playerStore.feedingData,
      })
    } else {
      if (!form.value.identifier) { error.value = 'Please enter your email or phone.'; return }
      if (!form.value.password)   { error.value = 'Please enter your password.'; return }
      // Login via DB
      const res = await PlayerDB.login({ identifier: form.value.identifier, password: form.value.password })
      if (res.error) { error.value = res.error; return }
      const email = res.player.email
      if (res.player.data) {
        // Restore full game state from DB (preserves egg timers, monsters, etc.)
        const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
        accounts[email] = res.player.data
        localStorage.setItem('playerAccounts', JSON.stringify(accounts))
        localStorage.setItem('playerAuth', email)
        playerStore._apply(res.player.data)
      } else {
        // No game data saved in DB yet — try local, else create fresh and save to DB
        const localResult = playerStore.login(form.value.identifier, form.value.password)
        if (localResult.error) {
          playerStore.register(res.player.name, email, form.value.password, null)
        }
        // Save initial game state up to DB so next login restores correctly
        await PlayerDB.saveData(email, {
          user: playerStore.user, monsters: playerStore.monsters, eggs: playerStore.eggs,
          quests: playerStore.quests, achievements: playerStore.achievements,
          referCode: playerStore.referCode, settings: playerStore.settings,
          notifications: playerStore.notifications, feedingData: playerStore.feedingData,
        })
      }
      if (rememberMe.value) localStorage.setItem('playerRemember', JSON.stringify({ identifier: form.value.identifier, password: form.value.password }))
      else localStorage.removeItem('playerRemember')
    }
    router.push('/player/home')
  } catch (e) {
    error.value = 'Connection error. Please check your internet.'
  } finally {
    loading.value = false
  }
}

// ── Forgot Password ─────────────────────────────────────────────────────────
const showForgot  = ref(false)
const forgotStep  = ref(1)
const forgotEmail = ref('')
const forgotError = ref('')
const forgotResult= ref('')

function doForgot() {
  forgotError.value = ''
  const email = forgotEmail.value.trim().toLowerCase()
  if (!email) { forgotError.value = 'Please enter your email.'; return }
  const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  if (!accounts[email]) { forgotError.value = 'No account found with this email.'; return }
  forgotResult.value = `Your password is: ${accounts[email].password}`
  forgotStep.value = 2
}

// ── Social Login ────────────────────────────────────────────────────────────
const showSocialRef = ref(false)
const socialRefCode = ref('')
const socialUser    = ref({ name:'', email:'', photo:'' })

function googleLogin() {
  if (!window.google?.accounts?.id) {
    // GIS not loaded yet — init and prompt
    const check = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(check)
        initGSI()
      }
    }, 200)
    return
  }
  initGSI()
}

function initGSI() {
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback:  handleGoogleCred
  })
  window.google.accounts.id.prompt()
}

function handleGoogleCred(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]))
  socialUser.value = { name: payload.name, email: payload.email, photo: payload.picture || '' }
  const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  if (accounts[payload.email.toLowerCase()]) {
    // Existing account — log in
    playerStore.login(payload.email, accounts[payload.email.toLowerCase()].password)
    router.push('/player/home')
  } else {
    // New account — ask for referral code
    showSocialRef.value = true
  }
}

function facebookLogin() {
  if (!window.FB) { error.value = 'Facebook SDK not loaded. Please try again in a moment.'; return }
  window.FB.login(response => {
    if (response.authResponse) {
      window.FB.api('/me', { fields: 'name,email,picture' }, userInfo => {
        const email = userInfo.email || `fb_${userInfo.id}@facebook.com`
        socialUser.value = { name: userInfo.name, email, photo: userInfo.picture?.data?.url || '' }
        const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
        if (accounts[email.toLowerCase()]) {
          playerStore.login(email, accounts[email.toLowerCase()].password)
          router.push('/player/home')
        } else {
          showSocialRef.value = true
        }
      })
    }
  }, { scope: 'public_profile,email' })
}

function completeSocialLogin() {
  showSocialRef.value = false
  const pw = 'social-' + Date.now()
  playerStore.register(socialUser.value.name, socialUser.value.email, pw, socialRefCode.value.trim() || null)
  if (socialUser.value.photo) { playerStore.user.avatar = socialUser.value.photo; playerStore.save() }
  router.push('/player/home')
}
</script>

<style scoped>
.login-shell { min-height:100vh; background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); display:flex; align-items:center; justify-content:center; padding:24px 16px; position:relative; overflow:hidden; }
.bg-circle { position:absolute; border-radius:50%; background:rgba(255,255,255,.08); }
.c1 { width:340px; height:340px; top:-120px; left:-100px; }
.c2 { width:260px; height:260px; bottom:-80px; right:-80px; }
.c3 { width:180px; height:180px; top:40%; left:60%; }
.login-box { background:#fff; border-radius:28px; padding:32px 24px; width:100%; max-width:400px; box-shadow:0 16px 48px rgba(0,0,0,.2); z-index:1; text-align:center; max-height:92vh; overflow-y:auto; }
.login-logo { font-size:52px; margin-bottom:6px; display:block; }
.login-brand { font-family:'Fredoka One',cursive; font-size:28px; color:var(--text); line-height:1; }
.login-sub { font-size:12px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:1px; margin-top:4px; margin-bottom:18px; }
.tabs { display:flex; background:#f5f0ff; border-radius:14px; padding:4px; margin-bottom:20px; }
.tab { flex:1; padding:10px; border-radius:10px; font-size:13px; font-weight:800; color:var(--text2); cursor:pointer; transition:all .2s; }
.tab.active { background:var(--purple); color:#fff; box-shadow:0 2px 8px rgba(124,77,255,.3); }
.form-body { text-align:left; }
.field { margin-bottom:11px; }
.field label { display:block; font-size:11px; font-weight:800; color:var(--text2); margin-bottom:5px; }
.optional { font-weight:600; color:var(--text3); font-style:italic; }
.field-hint { font-size:10px; font-weight:700; color:var(--text3); margin-top:4px; }
.phone-row { display:flex; gap:6px; }
.dial-select { width:90px; flex-shrink:0; padding:10px 6px; font-size:12px; }
.phone-num { flex:1; }
/* Password toggle */
.pw-wrap { position:relative; display:flex; }
.pw-wrap .input { flex:1; padding-right:38px; }
.pw-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; padding:0; line-height:1; color:var(--text2); }
/* Remember me */
.remember-row { display:flex; align-items:center; justify-content:space-between; margin:6px 0 10px; }
.remember-label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:var(--text2); cursor:pointer; }
.remember-check { width:15px; height:15px; accent-color:var(--purple); cursor:pointer; }
.forgot-link { font-size:12px; font-weight:800; color:var(--purple); cursor:pointer; }
.forgot-link:hover { text-decoration:underline; }
.error-msg { font-size:12px; font-weight:800; color:var(--red); background:var(--red-light); border-radius:10px; padding:8px 12px; margin-top:8px; }
.submit-btn { margin-top:16px; padding:14px; font-size:15px; }
.divider { text-align:center; margin:16px 0 12px; position:relative; }
.divider::before { content:''; position:absolute; top:50%; left:0; right:0; height:1px; background:#e8eaf0; }
.divider span { background:#fff; padding:0 10px; font-size:11px; font-weight:700; color:var(--text3); position:relative; }
.social-row { display:flex; gap:10px; }
.btn-social { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:11px; border-radius:12px; border:2px solid var(--border); background:#fff; font-size:13px; font-weight:800; color:var(--text); cursor:pointer; transition:all .15s; }
.btn-social:hover { background:#f5f0ff; border-color:var(--purple); }
/* Forgot / Social modals */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:999; padding:20px; }
.modal-box { background:#fff; border-radius:24px; padding:28px 24px; width:100%; max-width:360px; position:relative; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.modal-title { font-family:'Fredoka One',cursive; font-size:22px; color:var(--text); margin-bottom:8px; }
.modal-desc { font-size:13px; color:var(--text2); margin-bottom:14px; }
.modal-close { position:absolute; top:14px; right:16px; font-size:16px; cursor:pointer; color:var(--text3); font-weight:800; }
.forgot-result { background:#e8f5e9; color:#2e7d32; font-size:14px; font-weight:800; border-radius:12px; padding:14px; word-break:break-all; }
.btn-ghost { width:100%; background:none; border:none; color:var(--text3); font-size:13px; font-weight:700; padding:10px; cursor:pointer; margin-top:6px; }
</style>
