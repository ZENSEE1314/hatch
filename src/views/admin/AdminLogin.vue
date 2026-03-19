<template>
  <div class="login-shell">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="login-box animate-slide-up">
      <div class="login-logo">🛡</div>
      <div class="login-brand">Admin Portal</div>
      <div class="login-sub">HATCHME Staff Only</div>

      <div class="form-body">
        <div class="field">
          <label>Username</label>
          <input class="input" type="text" placeholder="admin" v-model="form.username" />
        </div>
        <div class="field">
          <label>Password</label>
          <input class="input" type="password" placeholder="••••••••" v-model="form.password"
            @keyup.enter="submit" />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-blue btn-full" style="margin-top:16px;padding:14px;background:#1565c0;color:#fff;border-color:#0d47a1" @click="submit">
          Sign In →
        </button>

        <div style="text-align:center;margin-top:14px;font-size:11px;font-weight:700;color:var(--text3)">
          Restricted access · Staff only
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref('')
const form = ref({ username: '', password: '' })

const ADMIN_ACCOUNTS = {
  'admin':               { password: 'admin123',   role: 'admin' },
  'admin@hatchme.com':   { password: 'admin123',   role: 'admin' },
  'accountant':          { password: 'acc123',     role: 'accountant' },
  'accountant@hatchme.com': { password: 'acc123',  role: 'accountant' },
}

function submit() {
  if (!form.value.username || !form.value.password) {
    error.value = 'Please fill in all fields.'
    return
  }
  const account = ADMIN_ACCOUNTS[form.value.username.toLowerCase().trim()]
  if (!account || account.password !== form.value.password) {
    error.value = 'Invalid username or password.'
    return
  }
  error.value = ''
  localStorage.setItem('adminAuth', account.role)
  router.push('/admin')
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  background: linear-gradient(160deg, #1565c0 0%, #283593 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}
.bg-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,.06); }
.c1 { width: 340px; height: 340px; top: -120px; left: -100px; }
.c2 { width: 260px; height: 260px; bottom: -80px; right: -80px; }
.login-box {
  background: #fff;
  border-radius: 28px;
  padding: 32px 24px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  z-index: 1;
  text-align: center;
}
.login-logo { font-size: 56px; margin-bottom: 8px; }
.login-brand { font-family: 'Fredoka One', cursive; font-size: 26px; color: var(--text); }
.login-sub { font-size: 12px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; margin-bottom: 24px; }
.form-body { text-align: left; }
.field { margin-bottom: 12px; }
.field label { display: block; font-size: 11px; font-weight: 800; color: var(--text2); margin-bottom: 5px; }
.error-msg { font-size: 12px; font-weight: 800; color: var(--red); background: var(--red-light); border-radius: 10px; padding: 8px 12px; margin-top: 8px; }
</style>
