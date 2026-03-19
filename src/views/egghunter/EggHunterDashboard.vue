<template>
  <div class="eh-shell">

    <!-- HEADER -->
    <div class="eh-header">
      <div class="eh-header-top">
        <div>
          <div class="eh-title">🥚 Egg Hunter</div>
          <div class="eh-name">{{ hunterName }}</div>
        </div>
        <div style="text-align:right">
          <div class="ref-chip">My Code: {{ referCode }}</div>
          <button class="logout-btn" @click="logout">Sign Out</button>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="summary-row">
        <div class="sum-card">
          <div class="sum-icon">🏪</div>
          <div class="sum-val">{{ merchants.length }}</div>
          <div class="sum-label">Merchants</div>
        </div>
        <div class="sum-card">
          <div class="sum-icon">✅</div>
          <div class="sum-val">{{ approvedCount }}</div>
          <div class="sum-label">Active</div>
        </div>
        <div class="sum-card">
          <div class="sum-icon">🥚</div>
          <div class="sum-val">{{ totalEggsSold }}</div>
          <div class="sum-label">Eggs Sold</div>
        </div>
        <div class="sum-card">
          <div class="sum-icon">💰</div>
          <div class="sum-val">S${{ totalRevenue }}</div>
          <div class="sum-label">Total Revenue</div>
        </div>
      </div>
    </div>

    <!-- MERCHANT LIST -->
    <div class="list-body">
      <div class="list-title">🏪 My Appointed Merchants</div>

      <div v-if="merchants.length === 0" class="empty-state">
        <div style="font-size:48px">🔍</div>
        <div style="font-family:'Fredoka One',cursive;font-size:17px;color:var(--text2);margin-top:12px">No merchants yet</div>
        <div style="font-size:12px;font-weight:700;color:var(--text3);margin-top:6px">
          Share your referral code <strong>{{ referCode }}</strong> with merchants to onboard them.
        </div>
      </div>

      <div v-for="m in merchants" :key="m.email" class="merchant-card" @click="openDetail(m)">
        <!-- Left: logo + name -->
        <div class="mc-left">
          <div class="mc-logo">
            <img v-if="m.info.logo" :src="m.info.logo" class="mc-logo-img" />
            <span v-else class="mc-logo-placeholder">🏪</span>
          </div>
          <div>
            <div class="mc-name">{{ m.info.name }}</div>
            <div class="mc-meta">{{ m.info.country }} · {{ m.info.currency }} · {{ m.info.eggTier }} Eggs</div>
            <div class="mc-code">{{ m.info.merchantCode }}</div>
          </div>
        </div>

        <!-- Right: status + stats -->
        <div class="mc-right">
          <div class="status-chip" :class="'s-' + m.status">{{ m.status }}</div>
          <div class="mc-stat">🥚 {{ myScans(m).length }} my sales</div>
          <div class="mc-stat">💳 {{ m.credits }} credits</div>
        </div>
      </div>
    </div>

    <!-- MERCHANT DETAIL DRAWER -->
    <div v-if="detail" class="drawer-overlay" @click.self="detail = null">
      <div class="drawer-box">
        <button class="close-btn" @click="detail = null">✕</button>

        <!-- Profile -->
        <div class="dr-header">
          <div class="dr-logo">
            <img v-if="detail.info.logo" :src="detail.info.logo" class="dr-logo-img" />
            <span v-else style="font-size:40px">🏪</span>
          </div>
          <div class="dr-name">{{ detail.info.name }}</div>
          <div class="dr-meta">{{ detail.info.country }} · {{ detail.info.currency }}</div>
          <div class="status-chip" :class="'s-' + detail.status" style="margin-top:6px">{{ detail.status }}</div>
        </div>

        <!-- Info rows -->
        <div class="dr-section">
          <div class="dr-section-title">📋 Merchant Profile</div>
          <div class="dr-row"><span>Store Name</span><span>{{ detail.info.name }}</span></div>
          <div class="dr-row"><span>Merchant Code</span><span>{{ detail.info.merchantCode }}</span></div>
          <div class="dr-row"><span>Country</span><span>{{ detail.info.country }}</span></div>
          <div class="dr-row"><span>Phone</span><span>{{ detail.info.phone || '—' }}</span></div>
          <div class="dr-row"><span>Email</span><span>{{ detail.email }}</span></div>
          <div class="dr-row"><span>Tier</span><span>{{ detail.info.tier }}</span></div>
          <div class="dr-row"><span>Egg Tier</span><span>{{ detail.info.eggTier }}</span></div>
          <div class="dr-row assigned-row">
            <span>📅 Assigned to You</span>
            <span>{{ detail.assignedAt ? formatDate(detail.assignedAt) : 'Before tracking' }}</span>
          </div>
        </div>

        <!-- Sales stats (MY period only) -->
        <div class="dr-section">
          <div class="dr-section-title">📊 My Sales <span v-if="detail.assignedAt" class="since-label">since {{ formatDate(detail.assignedAt) }}</span></div>
          <div class="dr-stat-grid">
            <div class="dr-stat-box">
              <div class="dr-stat-val">{{ myScans(detail).length }}</div>
              <div class="dr-stat-label">My Eggs Sold</div>
            </div>
            <div class="dr-stat-box">
              <div class="dr-stat-val">{{ detail.credits }}</div>
              <div class="dr-stat-label">Credits Left</div>
            </div>
            <div class="dr-stat-box">
              <div class="dr-stat-val">S${{ merchantRevenue(detail) }}</div>
              <div class="dr-stat-label">My Revenue</div>
            </div>
            <div class="dr-stat-box" style="border-color:#ffcc80;background:#fff8e1">
              <div class="dr-stat-val" style="color:#e65100">S${{ prevRevenue(detail) }}</div>
              <div class="dr-stat-label">Prev. Revenue</div>
            </div>
          </div>
        </div>

        <!-- My egg sales -->
        <div class="dr-section">
          <div class="dr-section-title">🥚 My Egg Sales</div>
          <div v-if="myScans(detail).length === 0" style="font-size:12px;font-weight:700;color:var(--text3);padding:8px 0">No sales since you were assigned.</div>
          <div v-for="(s, i) in myScans(detail).slice().reverse().slice(0, 10)" :key="i" class="scan-row">
            <span class="scan-egg">{{ s.eggTier || detail.info.eggTier }} Egg</span>
            <span class="scan-user">{{ s.playerEmail || s.playerId || 'Player' }}</span>
            <span class="scan-date">{{ formatDate(s.scannedAt || s.date) }}</span>
          </div>
        </div>

        <!-- Previous sales (before assignment) -->
        <div class="dr-section" v-if="prevScans(detail).length">
          <div class="dr-section-title prev-title">📦 Previous Sales <span class="prev-label">(before your assignment)</span></div>
          <div v-for="(s, i) in prevScans(detail).slice().reverse().slice(0, 5)" :key="i" class="scan-row prev-scan">
            <span class="scan-egg">{{ s.eggTier || detail.info.eggTier }} Egg</span>
            <span class="scan-user">{{ s.playerEmail || s.playerId || 'Player' }}</span>
            <span class="scan-date">{{ formatDate(s.scannedAt || s.date) }}</span>
          </div>
        </div>

        <!-- Topup history -->
        <div class="dr-section" v-if="detail.topupHistory.length">
          <div class="dr-section-title">💳 Topup History</div>
          <div v-for="(t, i) in detail.topupHistory.slice(0, 10)" :key="i" class="topup-row" :class="{ 'prev-topup': !isMyTopup(t, detail) }">
            <span class="topup-credits">+{{ t.credits }} credits</span>
            <span class="topup-amt">S${{ t.amountSGD }}</span>
            <span v-if="!isMyTopup(t, detail)" class="prev-chip">prev</span>
            <span class="topup-date">{{ t.date }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hunterEmail = ref('')
const hunterName  = ref('')
const referCode   = ref('')
const merchants   = ref([])
const detail      = ref(null)

onMounted(() => {
  const email = localStorage.getItem('eggHunterAuth')
  if (!email) { router.push('/egghunter/login'); return }

  const accounts = JSON.parse(localStorage.getItem('eggHunterAccounts') || '{}')
  const acct = accounts[email]
  if (!acct) { router.push('/egghunter/login'); return }

  hunterEmail.value = email
  hunterName.value  = acct.name || email
  referCode.value   = acct.code || ''

  loadMerchants(email)
})

function loadMerchants(email) {
  const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
  merchants.value = Object.entries(accounts)
    .filter(([, d]) => d.assignedEggHunter === email)
    .map(([key, d]) => ({
      email:        key,
      info:         d.info         || {},
      status:       d.status       || 'pending',
      credits:      d.credits      || 0,
      scans:        d.scans        || [],
      topupHistory: d.topupHistory || [],
      assignedAt:   d.assignedAt   || null,
    }))
    .sort((a, b) => {
      if (a.status === 'approved' && b.status !== 'approved') return -1
      if (b.status === 'approved' && a.status !== 'approved') return 1
      return (a.info.name || '').localeCompare(b.info.name || '')
    })
}

// Returns only scans that happened AFTER this hunter was assigned
function myScans(m) {
  if (!m.assignedAt) return m.scans
  return m.scans.filter(s => {
    const t = s.scannedAt || (s.date ? new Date(s.date).getTime() : 0)
    return t >= m.assignedAt
  })
}
function prevScans(m) {
  if (!m.assignedAt) return []
  return m.scans.filter(s => {
    const t = s.scannedAt || (s.date ? new Date(s.date).getTime() : 0)
    return t < m.assignedAt
  })
}

const approvedCount = computed(() => merchants.value.filter(m => m.status === 'approved').length)
const totalEggsSold = computed(() => merchants.value.reduce((s, m) => s + myScans(m).length, 0))
// Use t.id (Date.now() timestamp) for reliable date comparison
function topupTimestamp(t) { return t.id || 0 }
function isMyTopup(t, m)   { return !m.assignedAt || topupTimestamp(t) >= m.assignedAt }

const totalRevenue = computed(() => {
  const total = merchants.value.reduce((s, m) =>
    s + m.topupHistory.filter(t => isMyTopup(t, m)).reduce((ts, t) => ts + (+t.amountSGD || 0), 0), 0)
  return total.toFixed(2)
})

function merchantRevenue(m) {
  return m.topupHistory
    .filter(t => isMyTopup(t, m))
    .reduce((s, t) => s + (+t.amountSGD || 0), 0)
    .toFixed(2)
}

function prevRevenue(m) {
  if (!m.assignedAt) return '0.00'
  return m.topupHistory
    .filter(t => topupTimestamp(t) < m.assignedAt)
    .reduce((s, t) => s + (+t.amountSGD || 0), 0)
    .toFixed(2)
}

function openDetail(m) {
  // Reload fresh data before opening
  const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
  const fresh = accounts[m.email]
  if (fresh) {
    detail.value = {
      email:        m.email,
      info:         fresh.info         || {},
      status:       fresh.status       || 'pending',
      credits:      fresh.credits      || 0,
      scans:        fresh.scans        || [],
      topupHistory: fresh.topupHistory || [],
      assignedAt:   fresh.assignedAt   || m.assignedAt || null,
    }
  } else {
    detail.value = m
  }
}

function formatDate(val) {
  if (!val) return '—'
  const d = typeof val === 'number' ? new Date(val) : new Date(val)
  return d.toLocaleDateString('en-SG', { day:'2-digit', month:'short', year:'numeric' })
}

function logout() {
  localStorage.removeItem('eggHunterAuth')
  router.push('/egghunter/login')
}
</script>

<style scoped>
.eh-shell { min-height: 100vh; background: var(--bg-player, #f5f0ff); }

/* Header */
.eh-header { background: linear-gradient(160deg, #e65100 0%, #7c4dff 100%); padding: 20px 20px 24px; }
.eh-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.eh-title { font-family: 'Fredoka One', cursive; font-size: 22px; color: #fff; }
.eh-name { font-size: 13px; font-weight: 800; color: rgba(255,255,255,.8); margin-top: 2px; }
.ref-chip { background: rgba(255,255,255,.2); border: 1.5px solid rgba(255,255,255,.4); color: #fff; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; margin-bottom: 6px; }
.logout-btn { background: rgba(255,255,255,.15); border: 1.5px solid rgba(255,255,255,.35); color: #fff; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 10px; cursor: pointer; }

/* Summary row */
.summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.sum-card { background: rgba(255,255,255,.18); border-radius: 14px; border: 1.5px solid rgba(255,255,255,.3); padding: 10px 8px; text-align: center; }
.sum-icon { font-size: 18px; margin-bottom: 4px; }
.sum-val { font-family: 'Fredoka One', cursive; font-size: 16px; color: #fff; line-height: 1.1; }
.sum-label { font-size: 9px; font-weight: 800; color: rgba(255,255,255,.75); text-transform: uppercase; margin-top: 2px; }

/* List */
.list-body { padding: 16px 14px 80px; }
.list-title { font-family: 'Fredoka One', cursive; font-size: 16px; color: var(--text); margin-bottom: 12px; }

/* Merchant cards */
.merchant-card { background: #fff; border-radius: 18px; border: 2px solid #e0d7ff; padding: 14px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 3px 0 #e0d7ff; transition: transform .12s; }
.merchant-card:active { transform: scale(.98); }
.mc-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.mc-logo { width: 44px; height: 44px; border-radius: 12px; background: #f0eeff; border: 2px solid #e0d7ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.mc-logo-img { width: 100%; height: 100%; object-fit: cover; }
.mc-logo-placeholder { font-size: 22px; }
.mc-name { font-family: 'Fredoka One', cursive; font-size: 14px; color: var(--text); }
.mc-meta { font-size: 10px; font-weight: 700; color: var(--text3); margin-top: 1px; }
.mc-code { font-size: 9px; font-weight: 800; color: var(--purple); margin-top: 2px; }
.mc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.mc-stat { font-size: 10px; font-weight: 800; color: var(--text2); }

/* Status chips */
.status-chip { font-size: 9px; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; }
.s-approved { background: #e8f5e9; color: #2e7d32; }
.s-pending  { background: #fff8e1; color: #f57f17; }
.s-rejected { background: #ffebee; color: #c62828; }

/* Empty */
.empty-state { text-align: center; padding: 60px 20px; }

/* Drawer */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 400; display: flex; align-items: flex-end; justify-content: center; }
.drawer-box { background: #fff; border-radius: 28px 28px 0 0; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; padding-bottom: 32px; position: relative; }
.close-btn { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%; background: #f0eeff; border: none; font-size: 14px; cursor: pointer; color: var(--text); font-weight: 800; z-index: 1; }

/* Drawer header */
.dr-header { padding: 24px 20px 16px; text-align: center; background: linear-gradient(160deg, #fff3e0, #f3e5f5); border-radius: 28px 28px 0 0; }
.dr-logo { width: 72px; height: 72px; border-radius: 18px; background: #fff; border: 2px solid #e0d7ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; overflow: hidden; }
.dr-logo-img { width: 100%; height: 100%; object-fit: cover; }
.dr-name { font-family: 'Fredoka One', cursive; font-size: 20px; color: var(--text); }
.dr-meta { font-size: 11px; font-weight: 700; color: var(--text3); margin-top: 3px; }

/* Sections */
.dr-section { padding: 12px 20px 0; }
.dr-section-title { font-family: 'Fredoka One', cursive; font-size: 13px; color: var(--text); border-bottom: 2px solid #f0eeff; padding-bottom: 6px; margin-bottom: 8px; }
.dr-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: var(--text); padding: 6px 0; border-bottom: 1px solid #f9f5ff; }
.dr-row span:first-child { color: var(--text3); }
.dr-row span:last-child { color: var(--text); text-align: right; max-width: 55%; word-break: break-word; }

/* Stat grid */
.dr-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 4px; }
.dr-stat-box { background: #f9f5ff; border-radius: 14px; border: 2px solid #e0d7ff; padding: 12px 10px; text-align: center; }
.dr-stat-val { font-family: 'Fredoka One', cursive; font-size: 18px; color: var(--purple); }
.dr-stat-label { font-size: 10px; font-weight: 800; color: var(--text3); margin-top: 2px; }

.assigned-row span:last-child { color: #2e7d32 !important; }
.since-label { font-size: 10px; font-weight: 700; color: #2e7d32; margin-left: 6px; }
.prev-title { color: #888 !important; }
.prev-label { font-size: 10px; font-weight: 700; color: #aaa; }

/* Scan rows */
.scan-row { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 800; padding: 6px 0; border-bottom: 1px solid #f0eeff; gap: 6px; }
.prev-scan { opacity: 0.55; }
.scan-egg { background: #fff8e1; color: #f57f17; padding: 2px 8px; border-radius: 8px; font-size: 10px; flex-shrink: 0; }
.scan-user { color: var(--text2); flex: 1; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.scan-date { color: var(--text3); font-size: 10px; flex-shrink: 0; }

/* Topup rows */
.topup-row { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 800; padding: 6px 0; border-bottom: 1px solid #f0eeff; gap: 6px; }
.prev-topup { opacity: 0.5; }
.prev-chip { background: #fff8e1; color: #e65100; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 6px; flex-shrink: 0; }
.topup-credits { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 8px; font-size: 10px; flex-shrink: 0; }
.topup-amt { font-family: 'Fredoka One', cursive; font-size: 13px; color: var(--purple); }
.topup-date { color: var(--text3); font-size: 10px; flex-shrink: 0; }
</style>
