<template>
  <div class="merchant-page">
    <div class="m-header">
      <button class="back-btn" @click="$router.push('/merchant/welcome')">←</button>
      <div class="m-title">🏪 Register Store</div>
      <div style="width:36px"></div>
    </div>

    <div class="m-body">
      <div class="step-label">Step 1 of 3 — Store Info</div>

      <div class="field">
        <label>Store Name</label>
        <input class="input" type="text" placeholder="e.g. NestMart SG" v-model="form.name" />
      </div>
      <div class="field">
        <label>Country</label>
        <select class="input" v-model="form.country">
          <option v-for="(c, k) in countries" :key="k" :value="k">{{ c.flag }} {{ c.name }} ({{ c.currency }})</option>
        </select>
      </div>
      <div class="field">
        <label>Phone Number</label>
        <div style="display:flex;gap:8px">
          <div class="dial-badge">{{ selectedCountry.dial }}</div>
          <input class="input" style="flex:1" type="tel" placeholder="9123 4567" v-model="form.phone" />
        </div>
      </div>
      <div class="field">
        <label>Egg Hunter Code <span style="color:var(--text3)">(optional)</span></label>
        <input class="input" type="text" placeholder="HUNTER_ABC123" v-model="form.hunterCode" />
      </div>

      <div class="tax-info" v-if="selectedCountry">
        <span>🌍 {{ selectedCountry.name }}</span>
        <span>{{ selectedCountry.taxName }}: {{ selectedCountry.tax }}%</span>
        <span>FX: 1 {{ selectedCountry.currency }} = S${{ selectedCountry.fx }}</span>
      </div>

      <button class="btn btn-teal" style="width:100%;margin-top:20px" @click="submit">
        Submit for Review →
      </button>

      <div style="text-align:center;margin-top:14px">
        <span style="font-size:12px;font-weight:700;color:var(--text2);cursor:pointer" @click="$router.push('/merchant/dashboard')">
          Already approved? Go to dashboard →
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { COUNTRIES } from '@/data/gameData.js'
import { merchantStore } from '@/store/merchantStore.js'

const router = useRouter()
const countries = COUNTRIES
const form = ref({ name: '', country: 'SG', phone: '', hunterCode: '' })
const selectedCountry = computed(() => COUNTRIES[form.value.country])

function submit() {
  if (!form.value.name.trim()) return
  merchantStore.info = { name: form.value.name.trim(), country: form.value.country, tier: 'Bronze' }
  merchantStore.status = 'pending'
  merchantStore.save()
  router.push('/merchant/pending')
}
</script>

<style scoped>
.merchant-page { min-height:100vh; background:linear-gradient(180deg,#e0f7f4 0%,#f5fffe 100%); }
.m-header { background:linear-gradient(135deg,#00897b,#00acc1); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.m-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.m-body { padding:24px 20px; max-width:480px; margin:0 auto; }
.step-label { font-size:11px; font-weight:800; color:var(--teal); text-transform:uppercase; letter-spacing:.5px; margin-bottom:20px; }
.field { margin-bottom:14px; }
.field label { display:block; font-size:12px; font-weight:800; color:var(--text); margin-bottom:6px; }
.dial-badge { height:44px; padding:0 12px; background:#e0f7f4; border:2px solid #b2dfdb; border-radius:12px; display:flex; align-items:center; font-size:13px; font-weight:800; color:#00695c; white-space:nowrap; }
.tax-info { background:#fff; border-radius:14px; border:2px solid #b2dfdb; padding:12px 16px; display:flex; justify-content:space-between; font-size:11px; font-weight:800; color:#00695c; flex-wrap:wrap; gap:4px; margin-top:4px; }
</style>
