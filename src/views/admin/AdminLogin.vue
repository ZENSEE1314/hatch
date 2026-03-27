<template>
  <div class="login-shell">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="login-box animate-slide-up">
      <div class="login-logo">🛡️</div>
      <div class="login-brand">Admin Portal</div>
      <div class="login-sub">HATCHME Staff Only</div>

      <div class="form-body">
        <div class="field">
          <label>Username</label>
          <input class="input" type="text" placeholder="admin" v-model="form.username" />
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

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn-admin btn-full" style="margin-top:8px" @click="submit">Sign In →</button>

        <div style="text-align:center;margin-top:14px;font-size:11px;font-weight:700;color:var(--text3)">
          Restricted access · Staff only
        </div>
      </div>
    </div>

    <!-- ── FORGOT PASSWORD MODAL ── -->
    <div v-if="showForgot" class="modal-overlay" @click.self="showForgot=false">
      <div class="modal-box">
        <div class="modal-title">🔑 Forgot Password</div>
        <p class="modal-desc">Admin credentials are managed by the system owner.</p>
        <div class="forgot-info">
          <div class="info-row">👤 <b>admin</b> / admin123</div>
          <div class="info-row">💼 <b>accountant</b> / acc123</div>
        </div>
        <p style="font-size:11px;color:var(--text3);margin-top:10px">Contact your system administrator to change these credentials.</p>
        <button class="btn-admin btn-full" style="margin-top:14px" @click="showForgot=false">Got It</button>
        <div class="modal-close" @click="showForgot=false">✕</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router     = useRouter()
const error      = ref('')
const showPw     = ref(false)
const rememberMe = ref(false)
const showForgot = ref(false)
const form = ref({ username:'', password:'' })

const ADMIN_ACCOUNTS = {
  'admin':                  { password:'admin123', role:'admin' },
  'admin@hatchme.com':      { password:'admin123', role:'admin' },
  'accountant':             { password:'acc123',   role:'accountant' },
  'accountant@hatchme.com': { password:'acc123',   role:'accountant' },
}

onMounted(() => {
  const saved = localStorage.getItem('adminRemember')
  if (saved) {
    try { const s = JSON.parse(saved); form.value.username = s.username || saved; form.value.password = s.password || ''; rememberMe.value = true }
    catch { form.value.username = saved; rememberMe.value = true }
  }
})

function submit() {
  if (!form.value.username || !form.value.password) { error.value = 'Please fill in all fields.'; return }
  const account = ADMIN_ACCOUNTS[form.value.username.toLowerCase().trim()]
  if (!account || account.password !== form.value.password) { error.value = 'Invalid username or password.'; return }
  error.value = ''
  if (rememberMe.value) localStorage.setItem('adminRemember', JSON.stringify({ username: form.value.username, password: form.value.password }))
  else localStorage.removeItem('adminRemember')
  localStorage.setItem('adminAuth', account.role)
  router.push('/admin')
}
</script>

<style scoped>
.login-shell { min-height:100vh; background:linear-gradient(160deg,#1565c0 0%,#283593 100%); display:flex; align-items:center; justify-content:center; padding:24px 16px; position:relative; overflow:hidden; }
.bg-circle { position:absolute; border-radius:50%; background:rgba(255,255,255,.06); }
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
.remember-check { width:15px; height:15px; accent-color:#1565c0; cursor:pointer; }
.forgot-link { font-size:12px; font-weight:800; color:#1565c0; cursor:pointer; }
.forgot-link:hover { text-decoration:underline; }
.error-msg { font-size:12px; font-weight:800; color:var(--red); background:var(--red-light); border-radius:10px; padding:8px 12px; margin-top:8px; }
.btn-admin { display:block; width:100%; padding:14px; background:#1565c0; color:#fff; border:none; border-radius:14px; font-family:'Fredoka One',cursive; font-size:16px; cursor:pointer; transition:background .2s; }
.btn-admin:hover { background:#0d47a1; }
.btn-full { width:100%; }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:999; padding:20px; }
.modal-box { background:#fff; border-radius:24px; padding:28px 24px; width:100%; max-width:360px; position:relative; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.modal-title { font-family:'Fredoka One',cursive; font-size:22px; color:var(--text); margin-bottom:8px; }
.modal-desc { font-size:13px; color:var(--text2); margin-bottom:12px; }
.modal-close { position:absolute; top:14px; right:16px; font-size:16px; cursor:pointer; color:var(--text3); font-weight:800; }
.forgot-info { background:#e3f2fd; border-radius:12px; padding:12px; text-align:left; }
.info-row { font-size:13px; color:#1565c0; padding:4px 0; font-family:monospace; }
</style>
