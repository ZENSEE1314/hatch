<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">📷 Scan QR</div>
        <div style="width:36px"></div>
      </div>
      <div class="tab-row">
        <div class="tab2" :class="{ active: tab === 'scan' }"   @click="tab='scan'">Camera Scan</div>
        <div class="tab2" :class="{ active: tab === 'manual' }" @click="tab='manual'">Browse Merchants</div>
      </div>
    </div>

    <!-- CAMERA TAB -->
    <div v-if="tab === 'scan'" class="scan-body">
      <div class="viewfinder" @click="handleViewfinderTap">
        <video ref="videoEl" class="cam-feed" autoplay playsinline muted></video>
        <div class="vf-overlay">
          <div class="corner tl"></div><div class="corner tr"></div>
          <div class="corner bl"></div><div class="corner br"></div>
          <div v-if="scanning" class="scan-line"></div>
          <div v-if="!camActive && !scanning" class="cam-placeholder">
            <div style="font-size:48px">📷</div>
            <div style="color:rgba(255,255,255,.6);font-size:12px;font-weight:800;margin-top:8px">Tap to open camera</div>
          </div>
        </div>
      </div>
      <div class="scan-desc">Point camera at a merchant's HATCHME QR code.</div>
      <button v-if="!camActive" class="btn btn-primary" style="width:100%" @click="startCamera">Open Camera</button>
      <button v-else class="btn btn-green" style="width:100%" @click="onQRDetected">I see the QR! →</button>
      <button v-if="camActive" class="btn btn-gray" style="width:100%;margin-top:8px" @click="stopCamera">Stop Camera</button>
      <div style="text-align:center;margin-top:12px;font-size:12px;font-weight:700;color:var(--text2)">
        — or —<br>
        <span style="color:var(--purple);cursor:pointer;font-weight:800" @click="tab='manual'">Browse merchant list →</span>
      </div>
    </div>

    <!-- MERCHANT LIST TAB -->
    <div v-if="tab === 'manual' && !selectedMerchant" class="manual-body">
      <div class="list-header">
        <div style="font-family:'Fredoka One',cursive;font-size:17px;color:var(--text)">Choose a Merchant</div>
        <div style="font-size:12px;font-weight:700;color:var(--text2);margin-top:2px">{{ approvedMerchants.length }} approved merchants</div>
      </div>

      <div v-if="approvedMerchants.length === 0" style="text-align:center;padding:48px 20px;color:var(--text2)">
        <div style="font-size:48px;margin-bottom:12px">🏪</div>
        <div style="font-weight:800;font-size:14px">No approved merchants yet</div>
        <div style="font-size:12px;margin-top:4px">Ask your merchant to apply and get approved by admin.</div>
      </div>

      <div class="merchant-list">
        <div v-for="m in approvedMerchants" :key="m.email" class="merchant-item" @click="selectMerchant(m)">
          <div class="m-logo">
            <img v-if="m.logo" :src="m.logo" style="width:100%;height:100%;object-fit:cover;border-radius:12px" />
            <span v-else style="font-size:30px">🏪</span>
          </div>
          <div class="m-info">
            <div class="m-name-row">
              <span class="m-name">{{ m.name }}</span>
              <span class="verified-badge">✓ Approved</span>
            </div>
            <div class="m-cat-row">
              <span class="m-country">{{ countryFlag(m.country) }} {{ m.country }}</span>
              <span style="font-size:10px;font-weight:700;color:var(--text3)">· {{ m.currency }}</span>
            </div>
            <div v-if="m.description" class="m-desc">{{ m.description }}</div>
            <div class="m-meta-row">
              <span class="egg-tier-badge" :class="'egg-' + m.eggTier.toLowerCase()">🥚 {{ m.eggTier }} Egg</span>
              <span style="font-size:10px;font-weight:700;color:var(--text3)">{{ m.credits }} credits</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AMOUNT ENTRY -->
    <div v-if="selectedMerchant && !showRating && !showSuccess" class="amount-body">
      <button class="btn btn-gray btn-sm" style="margin-bottom:16px" @click="selectedMerchant=null;tab='manual'">← Back</button>

      <div class="merchant-header-card">
        <div class="mh-logo">
          <img v-if="selectedMerchant.logo" :src="selectedMerchant.logo"
            style="width:52px;height:52px;object-fit:cover;border-radius:12px" />
          <span v-else style="font-size:32px">🏪</span>
        </div>
        <div style="flex:1;min-width:0">
          <div class="mh-name">{{ selectedMerchant.name }}</div>
          <div class="mh-meta">{{ countryFlag(selectedMerchant.country) }} {{ selectedMerchant.country }} · {{ selectedMerchant.currency }}</div>
          <div class="mh-meta" v-if="selectedMerchant.description">{{ selectedMerchant.description }}</div>
        </div>
        <div class="mh-tier" :class="'egg-' + selectedMerchant.eggTier.toLowerCase()">{{ selectedMerchant.eggTier }}</div>
      </div>

      <!-- Not enough credits warning -->
      <div v-if="selectedMerchant.credits < 1" class="warn-bar">
        ⚠️ This merchant has low credits. Egg reward may not be processed.
      </div>

      <div class="field" style="margin-top:18px">
        <label class="field-label">Amount Paid ({{ selectedMerchant.currency }})</label>
        <input class="input" type="number" min="0.01" step="0.01"
          :placeholder="'e.g. 50.00 ' + selectedMerchant.currency"
          v-model="amountPaid" style="font-size:22px;text-align:center;font-weight:800" />
      </div>

      <!-- Calculation preview -->
      <div v-if="preview" class="calc-card">
        <div class="calc-title">💰 Egg Credit Calculation</div>
        <div class="calc-row">
          <span>You paid</span>
          <span>{{ selectedMerchant.currency }} {{ Number(amountPaid).toFixed(2) }}</span>
        </div>
        <div class="calc-row" v-if="selectedMerchant.currency !== 'SGD'">
          <span>In SGD (×{{ fxRate(selectedMerchant.currency).toFixed(4) }})</span>
          <span>≈ S${{ preview.purchaseSGD.toFixed(2) }}</span>
        </div>
        <div class="calc-row">
          <span>🥚 {{ selectedMerchant.eggTier }} tier ({{ (preview.pct*100).toFixed(0) }}%)</span>
          <span>S${{ preview.gross.toFixed(2) }}</span>
        </div>
        <div class="calc-row" v-if="selectedMerchant.taxEnabled">
          <span>− Tax saved ({{ (preview.taxRate*100).toFixed(1) }}%)</span>
          <span style="color:#2e7d32">− S${{ preview.taxAmt.toFixed(2) }}</span>
        </div>
        <div class="calc-row" style="font-weight:800;color:var(--text)">
          <span>Credits deducted from merchant</span>
          <span style="color:var(--purple)">{{ preview.credits.toFixed(2) }}</span>
        </div>
        <div class="calc-total">
          <span>🥚 You receive</span>
          <span class="total-val">{{ selectedMerchant.eggTier }} Egg</span>
        </div>
        <div class="calc-hint" v-if="selectedMerchant.credits < preview.credits" style="color:#c62828">
          ⚠️ Merchant has insufficient credits ({{ selectedMerchant.credits.toFixed(2) }}). Contact merchant to top up.
        </div>
      </div>

      <div v-if="amountError" class="error-msg">{{ amountError }}</div>

      <button class="btn btn-primary btn-full" style="margin-top:16px;padding:14px;font-size:15px"
        :disabled="!preview || (preview && selectedMerchant.credits < preview.credits)"
        @click="confirmPayment">
        Confirm &amp; Get Egg 🥚
      </button>
    </div>

    <!-- RATING MODAL -->
    <div v-if="showRating" class="rating-overlay">
      <div class="rating-box">
        <div style="font-size:32px;margin-bottom:8px">⭐ Rate Your Experience</div>
        <div style="font-size:13px;font-weight:700;color:var(--text2);margin-bottom:16px">How was {{ selectedMerchant?.name }}?</div>
        <div class="star-row">
          <div v-for="i in 5" :key="i" class="star-btn" :class="{ active: ratingVal >= i }" @click="ratingVal = i">★</div>
        </div>
        <textarea class="rating-comment" placeholder="Optional comment..." v-model="ratingComment" rows="3"></textarea>
        <button class="btn btn-primary btn-full" style="margin-top:14px;padding:12px" @click="submitRating">
          Submit Rating →
        </button>
        <button class="btn btn-gray btn-full" style="margin-top:8px;padding:10px" @click="submitRating">
          Skip →
        </button>
      </div>
    </div>

    <!-- SUCCESS OVERLAY -->
    <div v-if="showSuccess" class="success-overlay" @click="showSuccess=false">
      <div class="success-box">
        <div style="font-size:60px;animation:egg-bob 1s ease-in-out infinite">🥚</div>
        <div style="font-family:'Fredoka One',cursive;font-size:24px;color:var(--text);margin-top:12px">Purchase Submitted!</div>
        <div style="font-size:13px;font-weight:700;color:var(--text2);margin-top:8px;line-height:1.7">
          <strong style="color:var(--purple)">{{ lastEggTier }}</strong> egg from <strong>{{ lastMerchantName }}</strong>
        </div>
        <div style="background:#fff8e1;border:2px solid #ffe082;border-radius:14px;padding:12px 14px;margin-top:14px;font-size:12px;font-weight:700;color:#e65100;text-align:left;line-height:1.7">
          ⏳ <strong>Pending merchant approval</strong><br>
          The merchant will review your purchase. You'll receive your egg once they approve it!
        </div>
        <button class="btn btn-primary" style="margin-top:20px;width:100%;padding:13px" @click="$router.push('/player/home')">
          Go Home 🏠
        </button>
      </div>
    </div>

  </div>
  <BottomNav active="scan" />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import { useAutoRefresh } from '@/composables/useAutoRefresh.js'

const tick = useAutoRefresh(2000)

const TIER_HOURS = { Bronze:72, Silver:48, Gold:24, Diamond:12, Mystic:6 }
const TIER_COLORS = { Bronze:'#bf360c', Silver:'#546e7a', Gold:'#f57f17', Diamond:'#0288d1', Mystic:'#7b1fa2' }
const TIER_BGS    = { Bronze:'#fff3e0', Silver:'#eceff1', Gold:'#fff8e1', Diamond:'#e3f2fd', Mystic:'#f3e5f5' }
const EGG_TIER_PCT = { Bronze:0.20, Silver:0.25, Gold:0.30, Diamond:0.35, Mystic:0.40 }

const COUNTRY_FLAGS = { SG:'🇸🇬', MY:'🇲🇾', ID:'🇮🇩', TH:'🇹🇭', PH:'🇵🇭', AU:'🇦🇺', US:'🇺🇸', GB:'🇬🇧', CN:'🇨🇳', JP:'🇯🇵', HK:'🇭🇰', IN:'🇮🇳', KR:'🇰🇷', VN:'🇻🇳' }
function countryFlag(code) { return COUNTRY_FLAGS[code] || '🌍' }

// ── LOAD REAL MERCHANTS ──
function getMerchantAccounts() {
  return JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
}

const approvedMerchants = computed(() => {
  tick.value // live dependency — refreshes every 2s
  const raw = getMerchantAccounts()
  return Object.entries(raw)
    .filter(([, d]) => d.status === 'approved')
    .map(([email, d]) => ({
      email,
      name:        d.info?.name        || 'Unknown Store',
      country:     d.info?.country     || 'SG',
      currency:    d.info?.currency    || 'SGD',
      phone:       d.info?.phone       || '',
      logo:        d.info?.logo        || '',
      description: d.info?.description || '',
      eggTier:     d.info?.eggTier     || 'Bronze',
      taxEnabled:  d.info?.taxEnabled  ?? true,
      merchantCode:d.info?.merchantCode || '',
      credits:     d.credits           || 0,
    }))
})

// ── FX RATE ──
function fxRate(currencyCode) {
  if (currencyCode === 'SGD') return 1
  const rates = JSON.parse(localStorage.getItem('adminFxRates') || '[]')
  const found = rates.find(r => r.code === currencyCode)
  if (found && found.toSGD) return Number(found.toSGD)
  // Fallback defaults
  const DEFAULTS = { USD:1.35, MYR:0.30, IDR:0.000085, THB:0.038, PHP:0.024, AUD:0.88, EUR:1.46, GBP:1.72, CNY:0.186, JPY:0.0088, HKD:0.174, INR:0.016, KRW:0.001, VND:0.000054 }
  return DEFAULTS[currencyCode] || 1
}

// ── TAX RATE ──
function taxRate(countryCode) {
  const rates = JSON.parse(localStorage.getItem('adminTaxRates') || '[]')
  const found = rates.find(r => r.code === countryCode)
  if (found) return found.rate / 100
  const DEFAULTS = { SG:0.09, MY:0.06, ID:0.11, TH:0.07, PH:0.12, AU:0.10, GB:0.20 }
  return DEFAULTS[countryCode] ?? 0.09
}

// ── CREDIT DEDUCTION CALC ──
function calcDeduction(m, amt) {
  const fx          = fxRate(m.currency)
  const purchaseSGD = amt * fx
  const pct         = EGG_TIER_PCT[m.eggTier] || 0.20
  const gross       = purchaseSGD * pct
  const tr          = taxRate(m.country)
  const taxAmt      = m.taxEnabled ? gross * tr : 0
  const net         = gross - taxAmt
  return { purchaseSGD, pct, gross, taxRate: tr, taxAmt, credits: net }
}

// ── TABS / CAMERA ──
const tab      = ref('scan')
const videoEl  = ref(null)
const camActive = ref(false)
const scanning  = ref(false)
let stream = null

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoEl.value) videoEl.value.srcObject = stream
    camActive.value = true
    scanning.value  = true
  } catch {
    alert('Camera not available. Use Browse Merchants instead.')
    tab.value = 'manual'
  }
}
function stopCamera() {
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null }
  camActive.value = false; scanning.value = false
  if (videoEl.value) videoEl.value.srcObject = null
}
function handleViewfinderTap() { if (!camActive.value) startCamera() }
function onQRDetected() { stopCamera(); tab.value = 'manual' }
onUnmounted(stopCamera)

// ── MERCHANT SELECTION ──
const selectedMerchant = ref(null)
const amountPaid  = ref('')
const amountError = ref('')

function selectMerchant(m) {
  selectedMerchant.value = m
  amountPaid.value  = ''
  amountError.value = ''
  tab.value = 'manual'
}

const preview = computed(() => {
  if (!selectedMerchant.value || !amountPaid.value || Number(amountPaid.value) <= 0) return null
  return calcDeduction(selectedMerchant.value, Number(amountPaid.value))
})

// ── PAYMENT ──
const showRating    = ref(false)
const ratingVal     = ref(0)
const ratingComment = ref('')

function confirmPayment() {
  amountError.value = ''
  if (!amountPaid.value || Number(amountPaid.value) <= 0) {
    amountError.value = 'Please enter the amount you paid.'
    return
  }
  if (!preview.value) return
  if (selectedMerchant.value.credits < preview.value.credits) {
    amountError.value = 'Merchant has insufficient credits for this reward.'
    return
  }
  showRating.value = true
}

const showSuccess     = ref(false)
const lastEggTier     = ref('Bronze')
const lastMerchantName = ref('')

function submitRating() {
  showRating.value = false
  processPayment()
}

function processPayment() {
  const m   = selectedMerchant.value
  const p   = preview.value
  if (!m || !p) return

  const tier = m.eggTier
  const now  = Date.now()
  const hrs  = TIER_HOURS[tier]

  // ── Reserve credits from merchant (deduct upfront) ──
  const accounts = getMerchantAccounts()
  if (accounts[m.email]) {
    accounts[m.email].credits = Math.max(0, (accounts[m.email].credits || 0) - p.credits)
    localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
  }

  // ── Create pending egg (awaiting merchant approval) ──
  const pendingEgg = {
    id:            now,
    playerEmail:   playerStore.user?.email || '',
    playerName:    playerStore.user?.name  || 'Player',
    playerAvatar:  playerStore.user?.avatar || '👤',
    merchantEmail: m.email,
    merchantName:  m.name,
    amount:        Number(amountPaid.value),
    currency:      m.currency,
    amountSGD:     +p.purchaseSGD.toFixed(2),
    credits:       +p.credits.toFixed(2),
    eggTier:       tier,
    eggData: {
      tier,
      tierColor:    TIER_COLORS[tier],
      tierBg:       TIER_BGS[tier],
      value:        +p.purchaseSGD.toFixed(2),
      progress:     0,
      merchantName: m.name,
      createdAt:    now,
      hatchAt:      now + hrs * 3600 * 1000,
    },
    rating:        ratingVal.value,
    ratingComment: ratingComment.value,
    status:        'pending',
    createdAt:     new Date().toLocaleString(),
    approvedAt:    null,
    disputeReason: null,
    disputedAt:    null,
    resolvedAt:    null,
    adminNote:     null,
    addedEggId:    null,
  }
  const allPending = JSON.parse(localStorage.getItem('pendingEggs') || '[]')
  allPending.push(pendingEgg)
  localStorage.setItem('pendingEggs', JSON.stringify(allPending))

  // ── Update player spend quest ──
  playerStore.quests.forEach(q => {
    if (q.category === 'Spend' && q.enabled && !q.done) {
      q.progress = (q.progress || 0) + p.purchaseSGD
      q.claimable = q.progress >= q.target
    }
  })
  playerStore.save()

  lastEggTier.value      = tier
  lastMerchantName.value = m.name
  showSuccess.value      = true
  amountPaid.value       = ''
  ratingVal.value        = 0
  ratingComment.value    = ''
  selectedMerchant.value = null
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 0; }
.status-bar  { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row  { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn    { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title  { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.tab-row     { display:flex; margin-top:12px; }
.tab2        { flex:1; text-align:center; padding:10px 0; font-size:12px; font-weight:800; color:rgba(255,255,255,.6); cursor:pointer; border-bottom:3px solid transparent; }
.tab2.active { color:#fff; border-bottom:3px solid #fff; }

/* Camera */
.scan-body   { padding:20px 16px; display:flex; flex-direction:column; align-items:center; gap:14px; }
.viewfinder  { width:240px; height:240px; background:#111; border-radius:20px; position:relative; overflow:hidden; cursor:pointer; }
.cam-feed    { width:100%; height:100%; object-fit:cover; }
.vf-overlay  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; }
.corner      { position:absolute; width:26px; height:26px; border-color:#7c4dff; border-style:solid; }
.tl { top:10px;    left:10px;  border-width:3px 0 0 3px; border-radius:4px 0 0 0; }
.tr { top:10px;    right:10px; border-width:3px 3px 0 0; border-radius:0 4px 0 0; }
.bl { bottom:10px; left:10px;  border-width:0 0 3px 3px; border-radius:0 0 0 4px; }
.br { bottom:10px; right:10px; border-width:0 3px 3px 0; border-radius:0 0 4px 0; }
.cam-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; }
.scan-line   { position:absolute; left:10px; right:10px; height:2px; background:#7c4dff; animation:scanMove 1.5s linear infinite; }
@keyframes scanMove { 0%{top:20px} 100%{top:calc(100% - 20px)} }
.scan-desc   { font-size:13px; font-weight:700; color:var(--text2); text-align:center; }

/* Merchant list */
.manual-body  { padding:16px; }
.list-header  { margin-bottom:14px; }
.merchant-list{ display:flex; flex-direction:column; gap:10px; padding-bottom:90px; }
.merchant-item{ background:#fff; border-radius:18px; border:2px solid #e0d7ff; padding:14px; display:flex; gap:12px; cursor:pointer; box-shadow:0 2px 0 #d4c8ff; transition:all .15s; }
.merchant-item:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(124,77,255,.12); }
.m-logo       { font-size:36px; flex-shrink:0; width:52px; height:52px; background:#f5f0ff; border-radius:14px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.m-info       { flex:1; min-width:0; }
.m-name-row   { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px; }
.m-name       { font-family:'Fredoka One',cursive; font-size:15px; color:var(--text); }
.verified-badge { font-size:9px; font-weight:800; color:#2e7d32; background:#e8f5e9; border-radius:6px; padding:2px 6px; }
.m-cat-row    { display:flex; align-items:center; gap:6px; margin-bottom:5px; }
.m-country    { font-size:10px; font-weight:700; color:var(--text3); }
.m-desc       { font-size:11px; font-weight:700; color:var(--text2); line-height:1.5; margin-bottom:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.m-meta-row   { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.egg-tier-badge { font-size:9px; font-weight:800; padding:2px 8px; border-radius:6px; }
.egg-bronze   { background:#fff3e0; color:#bf360c; }
.egg-silver   { background:#eceff1; color:#546e7a; }
.egg-gold     { background:#fff8e1; color:#f57f17; }
.egg-diamond  { background:#e3f2fd; color:#0288d1; }
.egg-mystic   { background:#f3e5f5; color:#7b1fa2; }

/* Amount entry */
.amount-body  { padding:16px; padding-bottom:90px; }
.warn-bar     { background:#fff3e0; border-radius:10px; padding:8px 12px; font-size:12px; font-weight:800; color:#e65100; margin-top:10px; }
.merchant-header-card { background:#f5f0ff; border-radius:16px; border:2px solid #d4c8ff; padding:14px 16px; display:flex; align-items:center; gap:12px; }
.mh-name { font-family:'Fredoka One',cursive; font-size:16px; color:var(--text); }
.mh-meta { font-size:11px; font-weight:700; color:var(--text2); margin-top:2px; }
.mh-tier { margin-left:auto; font-size:10px; font-weight:800; padding:4px 10px; border-radius:8px; flex-shrink:0; }
.field       { margin-bottom:14px; }
.field-label { display:block; font-size:11px; font-weight:800; color:var(--text2); margin-bottom:6px; }
.calc-card   { background:#e8fff5; border-radius:14px; border:2px solid #a5d6a7; padding:14px; margin-top:10px; }
.calc-title  { font-size:11px; font-weight:800; color:#1b5e20; margin-bottom:8px; }
.calc-row    { display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:var(--text2); padding:4px 0; border-bottom:1px solid #c8f7e4; }
.calc-total  { display:flex; justify-content:space-between; align-items:center; padding-top:8px; margin-top:4px; }
.calc-total span:first-child { font-size:12px; font-weight:800; color:var(--text); }
.total-val   { font-family:'Fredoka One',cursive; font-size:20px; color:var(--purple); }
.calc-hint   { font-size:10px; font-weight:700; color:#2e7d32; margin-top:6px; }
.error-msg   { background:var(--red-light); border-radius:10px; padding:8px 12px; font-size:12px; font-weight:800; color:var(--red); margin-top:6px; }

/* Rating */
.rating-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:300; display:flex; align-items:center; justify-content:center; padding:20px; }
.rating-box     { background:#fff; border-radius:24px; padding:28px 22px; text-align:center; max-width:320px; width:100%; box-shadow:0 16px 48px rgba(0,0,0,.2); }
.star-row       { display:flex; justify-content:center; gap:8px; margin-bottom:14px; }
.star-btn       { font-size:36px; cursor:pointer; color:#e0e0e0; transition:color .15s; }
.star-btn.active{ color:#fdd835; }
.rating-comment { width:100%; border:2px solid #e0d7ff; border-radius:12px; padding:10px 12px; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; resize:vertical; outline:none; box-sizing:border-box; }

/* Success */
.success-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
.success-box     { background:#fff; border-radius:24px; padding:32px 24px; text-align:center; max-width:320px; width:100%; box-shadow:0 16px 48px rgba(0,0,0,.2); }
@keyframes egg-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
</style>
