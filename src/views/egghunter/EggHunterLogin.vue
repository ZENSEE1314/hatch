<template>
  <div class="login-shell">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="login-box animate-slide-up">
      <div class="login-logo">🥚</div>
      <div class="login-brand">Egg Hunter Portal</div>
      <div class="login-sub">Sales Team Access</div>

      <div class="form-body">
        <div class="field">
          <label>Email</label>
          <input class="input" type="email" placeholder="egghunter@hatchme.com" v-model="form.email" />
        </div>
        <div class="field">
          <label>Password</label>
          <div class="pw-wrap">
            <input class="input" :type="showPw ? 'text' : 'password'" placeholder="••••••••"
              v-model="form.password" @keyup.enter="submit" />
            <button class="pw-eye" type="button" @click="showPw = !showPw">{{ showPw ? '🙈' : '👁️' }}</button>
          </div>
        </div>

        <div class="remember-row">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" class="remember-check" />
            <span>Remember me</span>
          </label>
          <span class="forgot-link" @click="showForgot = true">Forgot password?</span>
        </div>

        <div v-if="success" class="success-msg">{{ success }}</div>
        <div v-if="error"   class="error-msg">{{ error }}</div>

        <button class="btn-submit" style="margin-top:12px" @click="submit">Sign In →</button>

        <div style="text-align:center;margin-top:14px;font-size:11px;font-weight:700;color:var(--text3)">
          Sales team access only · Contact admin for account
        </div>
      </div>
    </div>

    <!-- ── FORGOT PASSWORD MODAL ── -->
    <div v-if="showForgot" class="modal-overlay" @click.self="closeForgot">
      <div class="modal-box">
        <div class="modal-title">🔑 Forgot Password</div>
        <div v-if="forgotStep === 1">
          <p class="modal-desc">Enter your Egg Hunter email to recover your account.</p>
          <input class="input" type="email" placeholder="egghunter@hatchme.com" v-model="forgotEmail" style="margin-bottom:10px" />
          <div v-if="forgotError" class="error-msg">{{ forgotError }}</div>
          <button class="btn-submit" style="margin-top:8px;display:block;width:100%" @click="doForgot">Recover Account →</button>
        </div>
        <div v-if="forgotStep === 2">
          <div class="forgot-result">{{ forgotResult }}</div>
          <button class="btn-submit" style="margin-top:14px;display:block;width:100%" @click="closeForgot">Sign In Now →</button>
        </div>
        <div class="modal-close" @click="closeForgot">✕</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HunterDB } from '@/api/db.js'

const router     = useRouter()
const route      = useRoute()
const error      = ref('')
const success    = ref('')
const showPw     = ref(false)
const rememberMe = ref(false)
const form = ref({ email:'', password:'' })

onMounted(() => {
  // Remember me
  const saved = localStorage.getItem('eggHunterRemember')
  if (saved) { form.value.email = saved; rememberMe.value = true }

  // Handle setup link: ?setup=BASE64
  const token = route.query.setup
  if (token) {
    try {
      const data = JSON.parse(atob(token))
      if (data.email && data.password) {
        const accounts = JSON.parse(localStorage.getItem('eggHunterAccounts') || '{}')
        const key = data.email.toLowerCase().trim()
        accounts[key] = { name: data.name || key, code: data.code || '', password: data.password }
        localStorage.setItem('eggHunterAccounts', JSON.stringify(accounts))
        form.value.email = data.email
        success.value = '✅ Account activated! Enter your password to sign in.'
      }
    } catch { error.value = 'Invalid setup link.' }
    router.replace('/egghunter/login')
  }
})

const loading = ref(false)

async function submit() {
  if (!form.value.email || !form.value.password) { error.value = 'Please fill in all fields.'; return }
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const res = await HunterDB.login({ email: form.value.email, password: form.value.password })
    if (res.error) { error.value = res.error; return }
    const key = form.value.email.toLowerCase().trim()
    // Also sync to localStorage so dashboard can read it
    const accounts = JSON.parse(localStorage.getItem('eggHunterAccounts') || '{}')
    accounts[key] = { name: res.hunter.name, code: res.hunter.code, password: form.value.password }
    localStorage.setItem('eggHunterAccounts', JSON.stringify(accounts))
    if (rememberMe.value) localStorage.setItem('eggHunterRemember', form.value.email)
    else localStorage.removeItem('eggHunterRemember')
    localStorage.setItem('eggHunterAuth', key)
    router.push('/egghunter/dashboard')
  } catch {
    error.value = 'Connection error. Please check your internet.'
  } finally {
    loading.value = false
  }
}

// ── Forgot Password ──
const showForgot  = ref(false)
const forgotStep  = ref(1)
const forgotEmail = ref('')
const forgotError = ref('')
const forgotResult= ref('')

function closeForgot() { showForgot.value = false; forgotStep.value = 1; forgotEmail.value = ''; forgotError.value = ''; forgotResult.value = '' }

function doForgot() {
  forgotError.value = ''
  const email = forgotEmail.value.trim().toLowerCase()
  if (!email) { forgotError.value = 'Please enter your email.'; return }
  const accounts = JSON.parse(localStorage.getItem('eggHunterAccounts') || '{}')
  if (!accounts[email]) { forgotError.value = 'No account found. Contact your admin for a new setup link.'; return }
  forgotResult.value = `Your password is: ${accounts[email].password}`
  forgotStep.value = 2
}
</script>

<style scoped>
.login-shell { min-height:100vh; background:linear-gradient(160deg,#e65100 0%,#7c4dff 100%); display:flex; align-items:center; justify-content:center; padding:24px 16px; position:relative; overflow:hidden; }
.bg-circle { position:absolute; border-radius:50%; background:rgba(255,255,255,.07); }
.c1 { width:340px; height:340px; top:-120px; left:-100px; }
.c2 { width:260px; height:260px; bottom:-80px; right:-80px; }
.login-box { background:#fff; border-radius:28px; padding:32px 24px; width:100%; max-width:380px; box-shadow:0 16px 48px rgba(0,0,0,.3); z-index:1; text-align:center; }
.login-logo  { font-size:56px; margin-bottom:8px; }
.login-brand { font-family:'Fredoka One',cursive; font-size:26px; color:var(--text); }
.login-sub   { font-size:12px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:1px; margin-top:4px; margin-bottom:24px; }
.form-body { text-align:left; }
.field { margin-bottom:12px; }
.field label { display:block; font-size:11px; font-weight:800; color:var(--text2); margin-bottom:5px; }
.pw-wrap { position:relative; display:flex; }
.pw-wrap .input { flex:1; padding-right:38px; }
.pw-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; padding:0; color:var(--text2); }
.remember-row { display:flex; align-items:center; justify-content:space-between; margin:6px 0 10px; }
.remember-label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:var(--text2); cursor:pointer; }
.remember-check { width:15px; height:15px; accent-color:#e65100; cursor:pointer; }
.forgot-link { font-size:12px; font-weight:800; color:#e65100; cursor:pointer; }
.forgot-link:hover { text-decoration:underline; }
.success-msg { font-size:12px; font-weight:800; color:#2e7d32; background:#e8f5e9; border-radius:10px; padding:8px 12px; margin-top:8px; }
.error-msg   { font-size:12px; font-weight:800; color:#c62828; background:#ffebee; border-radius:10px; padding:8px 12px; margin-top:8px; }
.btn-submit { width:100%; background:linear-gradient(135deg,#e65100,#7c4dff); border:none; color:#fff; padding:14px; border-radius:14px; font-family:'Fredoka One',cursive; font-size:16px; cursor:pointer; }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:999; padding:20px; }
.modal-box { background:#fff; border-radius:24px; padding:28px 24px; width:100%; max-width:360px; position:relative; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.modal-title { font-family:'Fredoka One',cursive; font-size:22px; color:var(--text); margin-bottom:8px; }
.modal-desc { font-size:13px; color:var(--text2); margin-bottom:14px; }
.modal-close { position:absolute; top:14px; right:16px; font-size:16px; cursor:pointer; color:var(--text3); font-weight:800; }
.forgot-result { background:#e8f5e9; color:#2e7d32; font-size:14px; font-weight:800; border-radius:12px; padding:14px; word-break:break-all; }
</style>
