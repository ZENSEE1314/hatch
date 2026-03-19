<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="page-title">💵 Withdraw</div>
        <div style="width:36px"></div>
      </div>
    </div>

    <div class="withdraw-body">
      <!-- Balance -->
      <div class="balance-card">
        <div style="font-size:11px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.5px">Withdrawable Balance</div>
        <div class="balance-amount">S${{ Number(playerStore.user.withdrawableCash || 0).toFixed(6) }}</div>
        <div style="font-size:10px;font-weight:700;color:var(--text3)">Earned from watching ads · Min. S$50.00 · Fee: 2%</div>
        <div style="margin-top:10px;padding-top:10px;border-top:1.5px solid #e0f2f1;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:11px;font-weight:800;color:#888">🔒 Locked Cash</span>
          <span style="font-size:13px;font-weight:800;color:#aaa">S${{ Number(playerStore.user.cash || 0).toFixed(2) }}</span>
        </div>
        <div style="font-size:9px;color:#bbb;font-weight:700;text-align:right;margin-top:2px">Feed monsters to unlock</div>
      </div>

      <!-- Presets -->
      <div style="font-family:'Fredoka One',cursive;font-size:14px;color:var(--text);margin-bottom:10px">Quick Amount</div>
      <div class="preset-grid">
        <div class="preset" v-for="p in presets" :key="p"
             :class="{ selected: selected === p }"
             @click="selected = p">
          S${{ p }}
        </div>
      </div>

      <!-- Custom input -->
      <div style="font-family:'Fredoka One',cursive;font-size:14px;color:var(--text);margin:16px 0 8px">Or enter amount</div>
      <input class="input" type="number" placeholder="e.g. 150" v-model="custom" @focus="selected = null" />

      <!-- Summary -->
      <div class="summary" v-if="amount > 0">
        <div class="summary-row"><span>Withdraw</span><span>S${{ amount.toFixed(2) }}</span></div>
        <div class="summary-row"><span>Fee (2%)</span><span>- S${{ fee.toFixed(2) }}</span></div>
        <div class="summary-row total"><span>You receive</span><span>S${{ receive.toFixed(2) }}</span></div>
      </div>

      <button class="btn btn-teal" style="width:100%;margin-top:16px"
        :disabled="amount < 50 || amount > (playerStore.user.withdrawableCash || 0)">
        {{ amount < 50 ? 'Minimum S$50' : amount > (playerStore.user.withdrawableCash || 0) ? 'Insufficient balance' : 'Withdraw S$' + receive.toFixed(2) }}
      </button>
    </div>

  </div>
    <BottomNav active="profile" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { WITHDRAW_PRESETS } from '@/data/gameData.js'
import { playerStore } from '@/store/playerStore.js'

const presets = WITHDRAW_PRESETS
const selected = ref(null)
const custom = ref('')

const amount = computed(() => selected.value || Number(custom.value) || 0)
const fee = computed(() => amount.value * 0.02)
const receive = computed(() => amount.value - fee.value)
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 20px; }
.status-bar { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.withdraw-body { padding:20px 16px 100px; }
.balance-card { background:#fff; border-radius:16px; border:3px solid #c8f7e4; padding:16px; text-align:center; margin-bottom:20px; box-shadow:0 3px 0 #b2dfdb; }
.balance-amount { font-family:'Fredoka One',cursive; font-size:32px; color:#00695c; margin:6px 0; }
.preset-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:4px; }
.preset { background:#fff; border:2px solid #e0d7ff; border-radius:12px; padding:12px; text-align:center; font-family:'Fredoka One',cursive; font-size:14px; color:var(--text); cursor:pointer; box-shadow:0 2px 0 #d4c8ff; }
.preset.selected { background:#7c4dff; border-color:#7c4dff; color:#fff; box-shadow:0 2px 0 #5e35b1; }
.summary { background:#fff; border-radius:14px; border:2px solid #e0d7ff; padding:12px 16px; margin-top:8px; }
.summary-row { display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:var(--text2); padding:5px 0; border-bottom:1px solid #f0eeff; }
.summary-row:last-child { border-bottom:none; }
.summary-row.total { color:var(--text); font-size:14px; }
.summary-row.total span:last-child { color:#00695c; }
</style>
