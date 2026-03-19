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
          <input class="input" type="password" placeholder="••••••••" v-model="form.password"
            @keyup.enter="submit" />
        </div>

        <div v-if="success" class="success-msg">{{ success }}</div>
        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn-submit" style="margin-top:16px" @click="submit">
          Sign In →
        </button>

        <div style="text-align:center;margin-top:14px;font-size:11px;font-weight:700;color:var(--text3)">
          Sales team access only
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()
const error   = ref('')
const success = ref('')
const form    = ref({ email: '', password: '' })

onMounted(() => {
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
    } catch {
      error.value = 'Invalid setup link.'
    }
    // Clean URL
    router.replace('/egghunter/login')
  }
})

function submit() {
  if (!form.value.email || !form.value.password) {
    error.value = 'Please fill in all fields.'
    return
  }
  const accounts = JSON.parse(localStorage.getItem('eggHunterAccounts') || '{}')
  const key = form.value.email.toLowerCase().trim()

  if (!accounts[key]) { error.value = 'Account not found. Ask admin for your setup link.'; return }
  if (accounts[key].password !== form.value.password) { error.value = 'Incorrect password.'; return }

  error.value = ''
  success.value = ''
  localStorage.setItem('eggHunterAuth', key)
  router.push('/egghunter/dashboard')
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  background: linear-gradient(160deg, #e65100 0%, #7c4dff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}
.bg-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,.07); }
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
.success-msg { font-size: 12px; font-weight: 800; color: #2e7d32; background: #e8f5e9; border-radius: 10px; padding: 8px 12px; margin-top: 8px; }
.error-msg { font-size: 12px; font-weight: 800; color: #c62828; background: #ffebee; border-radius: 10px; padding: 8px 12px; margin-top: 8px; }
.btn-submit { width: 100%; background: linear-gradient(135deg, #e65100, #7c4dff); border: none; color: #fff; padding: 14px; border-radius: 14px; font-family: 'Fredoka One', cursive; font-size: 16px; cursor: pointer; }
</style>
