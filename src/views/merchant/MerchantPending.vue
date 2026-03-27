<template>
  <div class="merchant-page">
    <div class="m-header">
      <button class="back-btn" @click="$router.push('/merchant/welcome')">←</button>
      <div class="m-title">⏳ Under Review</div>
      <div style="width:36px"></div>
    </div>

    <div class="m-body">
      <div class="pending-card">
        <div style="font-size:56px;margin-bottom:12px">⏳</div>
        <div style="font-family:'Fredoka One',cursive;font-size:22px;color:var(--text);margin-bottom:8px">Application Submitted!</div>
        <div style="font-size:13px;font-weight:700;color:var(--text2);line-height:1.8">
          Your store is currently under review.<br>
          We'll notify you within <strong>1–2 business days.</strong>
        </div>
      </div>

      <div class="steps">
        <div class="step done"><div class="step-circle">✓</div><div class="step-text">Application submitted</div></div>
        <div class="step active"><div class="step-circle">2</div><div class="step-text">Admin review</div></div>
        <div class="step"><div class="step-circle">3</div><div class="step-text">Approved &amp; credits assigned</div></div>
        <div class="step"><div class="step-circle">4</div><div class="step-text">Start scanning customers!</div></div>
      </div>

      <button class="btn btn-teal" style="width:100%;margin-top:24px"
        @click="$router.push('/merchant/dashboard')">
        Go to Dashboard →
      </button>
      <button class="btn" style="width:100%;margin-top:10px;background:#fff;border:2px solid #b2dfdb;color:#00695c"
        @click="$router.push('/merchant/welcome')">
        ← Back to Welcome
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { MerchantDB } from '@/api/db.js'
import { merchantStore } from '@/store/merchantStore.js'

const router = useRouter()
const merchantEmail = localStorage.getItem('merchantAuth') || ''

let pollTimer = null

async function checkApproval() {
  if (!merchantEmail) return
  try {
    const res = await MerchantDB.get(merchantEmail)
    if (res?.status === 'approved') {
      merchantStore.status = 'approved'
      const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
      if (accounts[merchantEmail]) {
        accounts[merchantEmail].status = 'approved'
        localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
      }
      router.push('/merchant/dashboard')
    }
  } catch { /* offline */ }
}

onMounted(() => {
  checkApproval()
  pollTimer = setInterval(checkApproval, 15000) // check every 15s
})
onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.merchant-page { min-height:100vh; background:linear-gradient(180deg,#e0f7f4 0%,#f5fffe 100%); }
.m-header { background:linear-gradient(135deg,#00897b,#00acc1); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.m-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.m-body { padding:24px 20px; max-width:480px; margin:0 auto; }
.pending-card { background:#fff; border-radius:20px; border:3px solid #b2dfdb; padding:28px 20px; text-align:center; box-shadow:0 4px 0 #80cbc4; margin-bottom:24px; }
.steps { display:flex; flex-direction:column; gap:0; }
.step { display:flex; align-items:center; gap:12px; padding:12px 0; position:relative; }
.step:not(:last-child)::after { content:''; position:absolute; left:17px; top:44px; width:2px; height:12px; background:#e0d7ff; }
.step-circle { width:36px; height:36px; border-radius:50%; background:#f0eeff; border:2px solid #d4c8ff; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:var(--text2); flex-shrink:0; }
.step.done .step-circle { background:#c8f7e4; border-color:#80cbc4; color:#00695c; }
.step.active .step-circle { background:var(--teal); border-color:var(--teal); color:#fff; }
.step-text { font-size:13px; font-weight:800; color:var(--text2); }
.step.done .step-text { color:#00695c; }
.step.active .step-text { color:var(--text); }
</style>
