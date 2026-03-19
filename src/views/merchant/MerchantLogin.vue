<template>
  <div class="login-shell">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="login-box animate-slide-up">
      <div class="login-logo animate-float">🏪</div>
      <div class="login-brand">Merchant Portal</div>
      <div class="login-sub">HATCHME for Business</div>

      <!-- Tabs -->
      <div class="tabs">
        <div class="tab" :class="{ active: mode === 'login' }"    @click="mode = 'login'">Sign In</div>
        <div class="tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">Register</div>
      </div>

      <div class="form-body">

        <!-- ── REGISTER FIELDS ── -->
        <template v-if="mode === 'register'">
          <div class="field">
            <label>Store Name</label>
            <input class="input" type="text" placeholder="e.g. NestMart SG" v-model="form.store" />
          </div>

          <div class="field">
            <label>Country <span class="fixed-badge">Fixed after signup</span></label>
            <select class="input" v-model="form.country">
              <option value="" disabled>— Select Country —</option>
              <option v-for="c in COUNTRIES" :key="c.code" :value="c.code">
                {{ c.flag }} {{ c.name }} ({{ c.currency }})
              </option>
            </select>
            <div v-if="form.country" class="field-hint">
              Tax: {{ taxForCountry(form.country) }} · Currency: {{ currencyForCountry(form.country) }}
            </div>
          </div>

          <div class="field">
            <label>Phone Number (HP) <span class="fixed-badge">Fixed after signup</span></label>
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
            <input class="input" type="password" placeholder="••••••••" v-model="form.password" />
          </div>

          <div class="field">
            <label>Egg Hunter Referral Code <span class="optional-badge">Optional</span></label>
            <input class="input" type="text" placeholder="e.g. EGG-ABCD12" v-model="form.referralCode"
              style="text-transform:uppercase;letter-spacing:2px" />
            <div class="field-hint">Enter the referral code from your Egg Hunter to link your account.</div>
          </div>
        </template>

        <!-- ── LOGIN FIELDS ── -->
        <template v-else>
          <div class="field">
            <label>Email</label>
            <input class="input" type="email" placeholder="merchant@store.com" v-model="form.email" />
          </div>
          <div class="field">
            <label>Password</label>
            <input class="input" type="password" placeholder="••••••••" v-model="form.password" />
          </div>
        </template>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="btn btn-teal btn-full" style="margin-top:16px;padding:14px" @click="submit">
          {{ mode === 'login' ? 'Sign In →' : 'Register Store →' }}
        </button>

        <div v-if="mode === 'login'" style="text-align:center;margin-top:12px;font-size:12px;font-weight:700;color:var(--text2)">
          No account? <span style="color:var(--teal);cursor:pointer" @click="mode='register'">Register here →</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { merchantStore } from '@/store/merchantStore.js'

const router = useRouter()
const mode  = ref('login')
const error = ref('')
const form  = ref({ store: '', country: '', phone: '', email: '', password: '', referralCode: '' })

const COUNTRIES = [
  { code:'SG', name:'Singapore',    flag:'🇸🇬', currency:'SGD', dial:'+65', tax:'GST 9%'  },
  { code:'MY', name:'Malaysia',     flag:'🇲🇾', currency:'MYR', dial:'+60', tax:'SST 6%'  },
  { code:'ID', name:'Indonesia',    flag:'🇮🇩', currency:'IDR', dial:'+62', tax:'VAT 11%' },
  { code:'TH', name:'Thailand',     flag:'🇹🇭', currency:'THB', dial:'+66', tax:'VAT 7%'  },
  { code:'PH', name:'Philippines',  flag:'🇵🇭', currency:'PHP', dial:'+63', tax:'VAT 12%' },
  { code:'AU', name:'Australia',    flag:'🇦🇺', currency:'AUD', dial:'+61', tax:'GST 10%' },
  { code:'US', name:'United States',flag:'🇺🇸', currency:'USD', dial:'+1',  tax:'N/A'     },
  { code:'GB', name:'United Kingdom',flag:'🇬🇧',currency:'GBP', dial:'+44', tax:'VAT 20%' },
  { code:'CN', name:'China',        flag:'🇨🇳', currency:'CNY', dial:'+86', tax:'VAT 13%' },
  { code:'JP', name:'Japan',        flag:'🇯🇵', currency:'JPY', dial:'+81', tax:'CT 10%'  },
  { code:'HK', name:'Hong Kong',    flag:'🇭🇰', currency:'HKD', dial:'+852',tax:'N/A'     },
  { code:'IN', name:'India',        flag:'🇮🇳', currency:'INR', dial:'+91', tax:'GST 18%' },
  { code:'KR', name:'South Korea',  flag:'🇰🇷', currency:'KRW', dial:'+82', tax:'VAT 10%' },
  { code:'VN', name:'Vietnam',      flag:'🇻🇳', currency:'VND', dial:'+84', tax:'VAT 10%' },
]

function getCountry(code) { return COUNTRIES.find(c => c.code === code) }
function taxForCountry(code)      { return getCountry(code)?.tax      || '—' }
function currencyForCountry(code) { return getCountry(code)?.currency || '—' }
function dialCode(code)           { return getCountry(code)?.dial     || '+??' }

function submit() {
  error.value = ''
  if (!form.value.email || !form.value.password) { error.value = 'Please fill in all fields.'; return }

  if (mode.value === 'register') {
    if (!form.value.store.trim())   { error.value = 'Please enter your store name.'; return }
    if (!form.value.country)        { error.value = 'Please select your country.'; return }
    if (!form.value.phone.trim())   { error.value = 'Please enter your phone number.'; return }

    const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
    if (accounts[form.value.email.toLowerCase()]) { error.value = 'Email already registered. Please sign in.'; return }

    const fullPhone = dialCode(form.value.country) + form.value.phone.trim().replace(/^0/, '')
    merchantStore.register(
      form.value.store.trim(),
      form.value.country,
      fullPhone,
      form.value.email.trim(),
      form.value.password,
      form.value.referralCode.trim()
    )
    router.push('/merchant/pending')
  } else {
    const result = merchantStore.login(form.value.email, form.value.password)
    if (result.error) { error.value = result.error; return }
    router.push('/merchant/dashboard')
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  background: linear-gradient(160deg, #00897b 0%, #00acc1 100%);
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
.login-box {
  background: #fff;
  border-radius: 28px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  z-index: 1;
  text-align: center;
  max-height: 92vh;
  overflow-y: auto;
}
.login-logo  { font-size: 52px; margin-bottom: 8px; display: block; }
.login-brand { font-family: 'Fredoka One', cursive; font-size: 26px; color: var(--text); }
.login-sub   { font-size: 12px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; margin-bottom: 20px; }
.tabs   { display: flex; background: #e0f2f1; border-radius: 14px; padding: 4px; margin-bottom: 20px; }
.tab    { flex: 1; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 800; color: var(--text2); cursor: pointer; transition: all 0.2s; }
.tab.active { background: var(--teal); color: #fff; box-shadow: 0 2px 8px rgba(0,137,123,.3); }
.form-body { text-align: left; }
.field  { margin-bottom: 12px; }
.field label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; color: var(--text2); margin-bottom: 5px; flex-wrap: wrap; }
.field-hint  { font-size: 11px; font-weight: 700; color: #00897b; margin-top: 4px; }
.fixed-badge    { font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 8px; background: #fff3e0; color: #e65100; }
.optional-badge { font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 8px; background: #e0f7fa; color: #00695c; }
.phone-row   { display: flex; gap: 6px; align-items: center; }
.phone-prefix { background: #e0f2f1; color: #00695c; font-size: 13px; font-weight: 800; padding: 11px 10px; border-radius: 12px; white-space: nowrap; flex-shrink: 0; }
.phone-input  { flex: 1; }
.error-msg { font-size: 12px; font-weight: 800; color: var(--red); background: var(--red-light); border-radius: 10px; padding: 8px 12px; margin-top: 8px; }
</style>
