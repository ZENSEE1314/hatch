<template>
  <div class="login-shell">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="login-box animate-slide-up">
      <div class="login-logo animate-float">🏪</div>
      <div class="login-brand">Merchant Portal</div>
      <div class="login-sub">HATCHME for Business</div>

      <div class="tabs">
        <div class="tab" :class="{ active: mode === 'login' }"    @click="mode='login'">Sign In</div>
        <div class="tab" :class="{ active: mode === 'register' }" @click="mode='register'">Register</div>
      </div>

      <div class="form-body">

        <!-- ── REGISTER ── -->
        <template v-if="mode === 'register'">
          <div class="field">
            <label>Store Name</label>
            <input class="input" type="text" placeholder="e.g. NestMart SG" v-model="form.store" />
          </div>
          <div class="field">
            <label>Country <span class="fixed-badge">Fixed after signup</span></label>
            <select class="input" v-model="form.country">
              <option value="" disabled>— Select Country —</option>
              <option v-for="c in COUNTRIES" :key="c.code" :value="c.code">{{ c.flag }} {{ c.name }} ({{ c.currency }})</option>
            </select>
            <div v-if="form.country" class="field-hint">Tax: {{ taxForCountry(form.country) }} · Currency: {{ currencyForCountry(form.country) }}</div>
          </div>
          <div class="field">
            <label>Phone Number <span class="fixed-badge">Fixed after signup</span></label>
            <div class="phone-row">
              <span class="phone-prefix">{{ dialCode(form.country) }}</span>
              <input class="input phone-input" type="tel" placeholder="91234567" v-model="form.phone" />
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input class="input" type="email" placeholder="merchant@store.com" v-model="form.email" />
          </div>
          <div class="field">
            <label>Password</label>
            <div class="pw-wrap">
              <input class="input" :type="showRegPw ? 'text' : 'password'" placeholder="••••••••" v-model="form.password" />
              <button class="pw-eye" type="button" @click="showRegPw = !showRegPw">{{ showRegPw ? '🙈' : '👁️' }}</button>
            </div>
          </div>
          <div class="field">
            <label>Egg Hunter Referral Code <span class="optional-badge">Optional</span></label>
            <input class="input" type="text" placeholder="e.g. EGG-ABCD12" v-model="form.referralCode"
              style="text-transform:uppercase;letter-spacing:2px" />
            <div class="field-hint">Enter the referral code from your Egg Hunter to link your account.</div>
          </div>
        </template>

        <!-- ── LOGIN ── -->
        <template v-else>
          <div class="field">
            <label>Email</label>
            <input class="input" type="email" placeholder="merchant@store.com" v-model="form.email" />
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
        </template>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-teal btn-full" style="margin-top:16px;padding:14px" @click="submit" :disabled="loading">
          {{ loading ? 'Please wait...' : (mode === 'login' ? 'Sign In →' : 'Register Store →') }}
        </button>

        <div v-if="mode === 'login'" style="text-align:center;margin-top:12px;font-size:12px;font-weight:700;color:var(--text2)">
          No account? <span style="color:var(--teal);cursor:pointer" @click="mode='register'">Register here →</span>
        </div>
      </div>
    </div>

    <!-- ── FORGOT PASSWORD MODAL ── -->
    <div v-if="showForgot" class="modal-overlay" @click.self="closeForgot">
      <div class="modal-box">
        <div class="modal-title">🔑 Forgot Password</div>
        <div v-if="forgotStep === 1">
          <p class="modal-desc">Enter your registered merchant email.</p>
          <input class="input" type="email" placeholder="merchant@store.com" v-model="forgotEmail" style="margin-bottom:10px" />
          <div v-if="forgotError" class="error-msg">{{ forgotError }}</div>
          <button class="btn btn-teal btn-full" style="margin-top:8px" @click="doForgot">Recover Account →</button>
        </div>
        <div v-if="forgotStep === 2">
          <div class="forgot-result">{{ forgotResult }}</div>
          <button class="btn btn-teal btn-full" style="margin-top:14px" @click="closeForgot();mode='login'">Sign In Now →</button>
        </div>
        <div class="modal-close" @click="closeForgot">✕</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { merchantStore } from '@/store/merchantStore.js'
import { MerchantDB } from '@/api/db.js'

const router      = useRouter()
const mode        = ref('login')
const error       = ref('')
const showLoginPw = ref(false)
const showRegPw   = ref(false)
const rememberMe  = ref(false)
const form = ref({ store:'', country:'', phone:'', email:'', password:'', referralCode:'' })

const COUNTRIES = [
  { code:'SG', name:'Singapore',    flag:'🇸🇬', currency:'SGD', dial:'+65',  tax:'GST 9%'  },
  { code:'MY', name:'Malaysia',     flag:'🇲🇾', currency:'MYR', dial:'+60',  tax:'SST 6%'  },
  { code:'ID', name:'Indonesia',    flag:'🇮🇩', currency:'IDR', dial:'+62',  tax:'VAT 11%' },
  { code:'TH', name:'Thailand',     flag:'🇹🇭', currency:'THB', dial:'+66',  tax:'VAT 7%'  },
  { code:'PH', name:'Philippines',  flag:'🇵🇭', currency:'PHP', dial:'+63',  tax:'VAT 12%' },
  { code:'AU', name:'Australia',    flag:'🇦🇺', currency:'AUD', dial:'+61',  tax:'GST 10%' },
  { code:'US', name:'United States',flag:'🇺🇸', currency:'USD', dial:'+1',   tax:'N/A'     },
  { code:'GB', name:'United Kingdom',flag:'🇬🇧',currency:'GBP', dial:'+44',  tax:'VAT 20%' },
  { code:'CN', name:'China',        flag:'🇨🇳', currency:'CNY', dial:'+86',  tax:'VAT 13%' },
  { code:'JP', name:'Japan',        flag:'🇯🇵', currency:'JPY', dial:'+81',  tax:'CT 10%'  },
  { code:'HK', name:'Hong Kong',    flag:'🇭🇰', currency:'HKD', dial:'+852', tax:'N/A'     },
  { code:'IN', name:'India',        flag:'🇮🇳', currency:'INR', dial:'+91',  tax:'GST 18%' },
  { code:'KR', name:'South Korea',  flag:'🇰🇷', currency:'KRW', dial:'+82',  tax:'VAT 10%' },
  { code:'VN', name:'Vietnam',      flag:'🇻🇳', currency:'VND', dial:'+84',  tax:'VAT 10%' },
]

function getCountry(code)         { return COUNTRIES.find(c => c.code === code) }
function taxForCountry(code)      { return getCountry(code)?.tax      || '—' }
function currencyForCountry(code) { return getCountry(code)?.currency || '—' }
function dialCode(code)           { return getCountry(code)?.dial     || '+??' }

onMounted(() => {
  const saved = localStorage.getItem('merchantRemember')
  if (saved) { form.value.email = saved; rememberMe.value = true }
})

const loading = ref(false)

async function submit() {
  error.value = ''
  if (!form.value.email || !form.value.password) { error.value = 'Please fill in all fields.'; return }
  loading.value = true
  try {
    if (mode.value === 'register') {
      if (!form.value.store.trim()) { error.value = 'Please enter your store name.'; return }
      if (!form.value.country)      { error.value = 'Please select your country.'; return }
      if (!form.value.phone.trim()) { error.value = 'Please enter your phone number.'; return }
      const fullPhone = dialCode(form.value.country) + form.value.phone.trim().replace(/^0/, '')
      const res = await MerchantDB.register({
        email: form.value.email.trim(), store: form.value.store.trim(),
        password: form.value.password, country: form.value.country,
        phone: fullPhone, referralCode: form.value.referralCode.trim()
      })
      if (res.error) { error.value = res.error; return }
      merchantStore.register(form.value.store.trim(), form.value.country, fullPhone, form.value.email.trim(), form.value.password, form.value.referralCode.trim())
      router.push('/merchant/pending')
    } else {
      const res = await MerchantDB.login({ email: form.value.email, password: form.value.password })
      if (res.error) { error.value = res.error; return }
      const email = res.merchant.email
      if (res.merchant.data) {
        // Restore full store data from DB (includes credits added by admin)
        const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
        accounts[email] = { ...res.merchant.data, passwordHash: form.value.password }
        localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
        localStorage.setItem('merchantAuth', email)
        merchantStore._apply(res.merchant.data)
      } else {
        const localResult = merchantStore.login(form.value.email, form.value.password)
        if (localResult.error) {
          merchantStore.register(res.merchant.store, res.merchant.country, res.merchant.phone, email, form.value.password, res.merchant.referralCode || '')
        }
        // Save current state to DB so future logins restore correctly
        MerchantDB.saveData(email, {
          info: merchantStore.info, credits: merchantStore.credits,
          scans: merchantStore.scans, topupHistory: merchantStore.topupHistory,
          ads: merchantStore.ads, status: merchantStore.status,
          referralCode: merchantStore.referralCode, assignedEggHunter: merchantStore.assignedEggHunter,
        }).catch(() => {})
      }
      if (rememberMe.value) localStorage.setItem('merchantRemember', form.value.email)
      else localStorage.removeItem('merchantRemember')
      router.push(res.merchant.data?.status === 'approved' || merchantStore.status === 'approved' ? '/merchant/dashboard' : '/merchant/pending')
    }
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
  const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
  if (!accounts[email]) { forgotError.value = 'No merchant account found with this email.'; return }
  forgotResult.value = `Your password is: ${accounts[email].password}`
  forgotStep.value = 2
}
</script>

<style scoped>
.login-shell { min-height:100vh; background:linear-gradient(160deg,#00897b 0%,#00acc1 100%); display:flex; align-items:center; justify-content:center; padding:24px 16px; position:relative; overflow:hidden; }
.bg-circle { position:absolute; border-radius:50%; background:rgba(255,255,255,.08); }
.c1 { width:340px; height:340px; top:-120px; left:-100px; }
.c2 { width:260px; height:260px; bottom:-80px; right:-80px; }
.login-box { background:#fff; border-radius:28px; padding:32px 24px; width:100%; max-width:400px; box-shadow:0 16px 48px rgba(0,0,0,.2); z-index:1; text-align:center; max-height:92vh; overflow-y:auto; }
.login-logo  { font-size:52px; margin-bottom:8px; display:block; }
.login-brand { font-family:'Fredoka One',cursive; font-size:26px; color:var(--text); }
.login-sub   { font-size:12px; font-weight:800; color:var(--text3); text-transform:uppercase; letter-spacing:1px; margin-top:4px; margin-bottom:20px; }
.tabs   { display:flex; background:#e0f2f1; border-radius:14px; padding:4px; margin-bottom:20px; }
.tab    { flex:1; padding:10px; border-radius:10px; font-size:13px; font-weight:800; color:var(--text2); cursor:pointer; transition:all .2s; }
.tab.active { background:var(--teal); color:#fff; box-shadow:0 2px 8px rgba(0,137,123,.3); }
.form-body { text-align:left; }
.field { margin-bottom:12px; }
.field label { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:800; color:var(--text2); margin-bottom:5px; flex-wrap:wrap; }
.field-hint  { font-size:11px; font-weight:700; color:#00897b; margin-top:4px; }
.fixed-badge    { font-size:9px; font-weight:800; padding:2px 7px; border-radius:8px; background:#fff3e0; color:#e65100; }
.optional-badge { font-size:9px; font-weight:800; padding:2px 7px; border-radius:8px; background:#e0f7fa; color:#00695c; }
.phone-row   { display:flex; gap:6px; align-items:center; }
.phone-prefix { background:#e0f2f1; color:#00695c; font-size:13px; font-weight:800; padding:11px 10px; border-radius:12px; white-space:nowrap; flex-shrink:0; }
.phone-input  { flex:1; }
.pw-wrap { position:relative; display:flex; }
.pw-wrap .input { flex:1; padding-right:38px; }
.pw-eye { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; padding:0; color:var(--text2); }
.remember-row { display:flex; align-items:center; justify-content:space-between; margin:6px 0 10px; }
.remember-label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:var(--text2); cursor:pointer; }
.remember-check { width:15px; height:15px; accent-color:var(--teal); cursor:pointer; }
.forgot-link { font-size:12px; font-weight:800; color:var(--teal); cursor:pointer; }
.forgot-link:hover { text-decoration:underline; }
.error-msg { font-size:12px; font-weight:800; color:var(--red); background:var(--red-light); border-radius:10px; padding:8px 12px; margin-top:8px; }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:999; padding:20px; }
.modal-box { background:#fff; border-radius:24px; padding:28px 24px; width:100%; max-width:360px; position:relative; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.modal-title { font-family:'Fredoka One',cursive; font-size:22px; color:var(--text); margin-bottom:8px; }
.modal-desc { font-size:13px; color:var(--text2); margin-bottom:14px; }
.modal-close { position:absolute; top:14px; right:16px; font-size:16px; cursor:pointer; color:var(--text3); font-weight:800; }
.forgot-result { background:#e8f5e9; color:#2e7d32; font-size:14px; font-weight:800; border-radius:12px; padding:14px; word-break:break-all; }
</style>
