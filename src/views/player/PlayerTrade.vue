<template>
  <div class="phone-shell" style="background:var(--bg-player)">
  <div class="scroll-content">

    <!-- HEADER -->
    <div class="page-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <div class="page-title">💬 Social Hub</div>
        <button class="support-link" @click="$router.push('/player/support')">🛡 Support</button>
      </div>
      <div class="tab-row">
        <div class="tab2" :class="{ active: tab==='inbox' }"   @click="tab='inbox'">
          Inbox <span v-if="totalUnread" class="tab-badge">{{ totalUnread }}</span>
        </div>
        <div class="tab2" :class="{ active: tab==='players' }" @click="tab='players'">Players</div>
        <div class="tab2" :class="{ active: tab==='trade' }"   @click="tab='trade'">
          Trade <span v-if="othersOffers.length" class="tab-badge">{{ othersOffers.length }}</span>
        </div>
        <div class="tab2" :class="{ active: tab==='market' }"  @click="tab='market'">Market</div>
      </div>
    </div>

    <!-- ═══ INBOX ═══ -->
    <div v-if="tab==='inbox'">

      <!-- Conversation list -->
      <div v-if="!activeChat">
        <div class="search-bar">
          <input class="s-input" placeholder="🔍 Search conversations…" v-model="inboxSearch" />
          <button class="compose-btn" @click="tab='players'" title="Find players to chat">✏️</button>
        </div>
        <div v-if="filteredConvos.length === 0" class="empty-state">
          <div style="font-size:48px">💬</div>
          <div style="font-weight:800;font-size:14px;color:var(--text2);margin-top:10px">No messages yet</div>
          <div style="font-size:12px;color:var(--text3);margin-top:4px">Go to Players tab to find someone to chat with!</div>
          <button class="btn btn-primary" style="margin-top:14px" @click="tab='players'">Find Players →</button>
        </div>
        <div v-for="c in filteredConvos" :key="c.key" class="chat-item" @click="openChat(c.otherEmail, c.name, c.avatar)">
          <div class="chat-avatar">{{ c.avatar }}</div>
          <div class="chat-info">
            <div class="chat-name">{{ c.name }}</div>
            <div class="chat-preview">{{ c.lastMsg || 'No messages yet' }}</div>
          </div>
          <div class="chat-meta">
            <div class="chat-time">{{ c.lastTime }}</div>
            <div v-if="c.unread" class="chat-badge">{{ c.unread }}</div>
          </div>
        </div>
      </div>

      <!-- Chat window -->
      <div v-else class="chat-window">
        <div class="cw-header">
          <button class="back-btn" @click="activeChat=null">←</button>
          <div class="chat-avatar sm">{{ activeChat.avatar }}</div>
          <div style="flex:1">
            <div class="chat-name">{{ activeChat.name }}</div>
            <div style="font-size:10px;font-weight:700;color:var(--text3)">{{ activeChat.otherEmail }}</div>
          </div>
          <button class="trade-btn" @click="proposeTrade(activeChat)">🔄 Trade</button>
        </div>
        <div class="messages" ref="msgBox">
          <div v-for="m in activeChatMsgs" :key="m.id" class="message" :class="{ mine: m.from === myEmail }">
            <div class="bubble">{{ m.text }}</div>
            <div class="msg-time">{{ m.time }}</div>
          </div>
          <div v-if="activeChatMsgs.length === 0" style="text-align:center;color:var(--text3);font-size:12px;font-weight:700;padding:30px">
            Say hi to {{ activeChat.name }}! 👋
          </div>
        </div>
        <div class="cw-input">
          <input class="input" placeholder="Type a message…" v-model="newMsg"
            style="flex:1;border-radius:20px;padding:10px 14px" @keyup.enter="sendMsg" />
          <button class="send-btn" @click="sendMsg">→</button>
        </div>
      </div>
    </div>

    <!-- ═══ PLAYERS ═══ -->
    <div v-if="tab==='players'" style="padding:0 0 80px">
      <div class="search-bar" style="padding:14px 16px">
        <input class="s-input" placeholder="🔍 Search players by name…" v-model="playerSearch" style="flex:1" />
      </div>
      <div v-if="filteredPlayers.length === 0" class="empty-state">
        <div style="font-size:36px">👥</div>
        <div style="font-size:13px;font-weight:700;color:var(--text2);margin-top:8px">
          {{ playerSearch ? 'No players found' : 'No other players yet' }}
        </div>
      </div>
      <div v-for="p in filteredPlayers" :key="p.email" class="player-row">
        <div class="p-avatar">{{ p.avatar }}</div>
        <div class="p-info">
          <div class="p-name">{{ p.name }}</div>
          <div class="p-meta">Lv {{ p.level }} · 🐾 {{ p.monsters }} monsters · 💎 {{ p.gems }}</div>
        </div>
        <div class="p-actions">
          <button class="p-btn msg" @click="openChat(p.email, p.name, p.avatar); tab='inbox'">💬</button>
          <button class="p-btn trade" @click="proposeTradeToPlayer(p)">🔄</button>
        </div>
      </div>
    </div>

    <!-- ═══ TRADE ═══ -->
    <div v-if="tab==='trade'" style="padding:16px 16px 80px">

      <!-- My offers -->
      <div class="trade-section-title">My Offers <span class="count-chip">{{ myOffers.length }}</span></div>
      <div v-if="myOffers.length === 0" class="mini-empty">No active offers. Create one below!</div>
      <div v-for="t in myOffers" :key="t.id" class="trade-card mine">
        <div class="tc-monster">
          <div style="font-size:28px">{{ t.fromMonster.emoji }}</div>
          <div class="tc-name">{{ t.fromMonster.name }}</div>
          <div class="badge" :class="'badge-' + t.fromMonster.tier.toLowerCase()">{{ t.fromMonster.tier }}</div>
        </div>
        <div class="tc-arrow">⇄</div>
        <div class="tc-want">
          <div style="font-size:11px;font-weight:700;color:var(--text2)">Wants:</div>
          <div style="font-size:12px;font-weight:800;color:var(--text)">{{ t.wantTier === 'Any' ? 'Any tier' : t.wantTier }}</div>
          <div style="font-size:11px;font-weight:700;color:var(--text3)">{{ t.wantSet === 'Any' ? 'Any set' : t.wantSet + ' set' }}</div>
          <div style="font-size:10px;font-weight:700;color:var(--text3);margin-top:2px">{{ t.createdAt }}</div>
        </div>
        <button class="cancel-btn" @click="cancelOffer(t.id)">✕</button>
      </div>

      <!-- Others' offers -->
      <div class="trade-section-title" style="margin-top:16px">
        Available Trades <span class="count-chip">{{ othersOffers.length }}</span>
      </div>
      <div v-if="othersOffers.length === 0" class="mini-empty">No trade offers yet. Be the first!</div>
      <div v-for="t in othersOffers" :key="t.id" class="trade-card">
        <div class="tc-owner">{{ t.fromAvatar }} {{ t.fromName }}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
          <div class="tc-monster">
            <div style="font-size:28px">{{ t.fromMonster.emoji }}</div>
            <div class="tc-name">{{ t.fromMonster.name }}</div>
            <div class="badge" :class="'badge-' + t.fromMonster.tier.toLowerCase()">{{ t.fromMonster.tier }}</div>
          </div>
          <div class="tc-arrow">⇄</div>
          <div class="tc-want">
            <div style="font-size:11px;font-weight:700;color:var(--text2)">Wants:</div>
            <div style="font-size:12px;font-weight:800;color:var(--text)">{{ t.wantTier === 'Any' ? 'Any tier' : t.wantTier }}</div>
            <div style="font-size:11px;font-weight:700;color:var(--text3)">{{ t.wantSet === 'Any' ? 'Any set' : t.wantSet + ' set' }}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="accept-btn" @click="openAcceptTrade(t)" :disabled="playerStore.monsters.length === 0">
            🔄 Accept Trade
          </button>
          <button class="msg-small-btn" @click="openChat(t.fromEmail, t.fromName, t.fromAvatar); tab='inbox'">
            💬 Message
          </button>
        </div>
      </div>

      <!-- Create offer button -->
      <button class="create-offer-btn" @click="showCreateTrade=true" :disabled="playerStore.monsters.length===0">
        + Create Trade Offer
      </button>
      <div v-if="playerStore.monsters.length===0" class="mini-empty" style="margin-top:6px">
        ⚠️ You need monsters to trade. Hatch some eggs first!
      </div>
    </div>

    <!-- ═══ MARKET ═══ -->
    <div v-if="tab==='market'" style="padding:16px 16px 80px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-family:'Fredoka One',cursive;font-size:16px;color:var(--text)">Monster Market</div>
        <button class="list-btn" @click="showListModal=true" :disabled="playerStore.monsters.length===0">
          + List Monster
        </button>
      </div>

      <input class="s-input" placeholder="🔍 Search monsters…" v-model="marketSearch"
        style="margin-bottom:10px;width:100%;box-sizing:border-box" />

      <div style="display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none">
        <div v-for="f in ['All','Bronze','Silver','Gold','Diamond','Mystic']" :key="f"
          class="filter-chip" :class="{active:mFilter===f}" @click="mFilter=f">{{ f }}</div>
      </div>

      <!-- My active listings -->
      <div v-if="myListings.length > 0">
        <div class="trade-section-title">My Listings</div>
        <div v-for="l in myListings" :key="l.id" class="market-card" style="flex-direction:row;gap:12px;align-items:center">
          <div style="font-size:32px">{{ l.monster.emoji }}</div>
          <div style="flex:1">
            <div style="font-family:'Fredoka One',cursive;font-size:14px;color:var(--text)">{{ l.monster.name }}</div>
            <div class="badge" :class="'badge-' + l.monster.tier.toLowerCase()" style="display:inline-block;margin-top:3px">{{ l.monster.tier }}</div>
            <div style="font-size:11px;font-weight:700;color:var(--green);margin-top:4px">{{ l.price }} 💎</div>
          </div>
          <button class="cancel-btn" @click="delistMonster(l)">✕ Delist</button>
        </div>
        <div style="height:1px;background:#f0eeff;margin:12px 0"></div>
      </div>

      <!-- All listings -->
      <div v-if="filteredMarket.length === 0" class="empty-state">
        <div style="font-size:36px">🏪</div>
        <div style="font-size:13px;font-weight:700;color:var(--text2);margin-top:8px">No listings found</div>
      </div>
      <div class="market-grid">
        <div v-for="l in filteredMarket" :key="l.id" class="market-card">
          <div class="mc-seller">{{ l.sellerAvatar }} {{ l.sellerName }}</div>
          <div style="font-size:34px;margin:8px 0 4px">{{ l.monster.emoji }}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:13px;color:var(--text);text-align:center">{{ l.monster.name }}</div>
          <div class="badge" :class="'badge-' + l.monster.tier.toLowerCase()" style="margin-top:4px">{{ l.monster.tier }}</div>
          <div style="font-size:11px;font-weight:700;color:var(--text3);margin-top:2px">{{ l.monster.element }} · {{ l.monster.set }}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:16px;color:var(--green);margin-top:6px">{{ l.price }} 💎</div>
          <button class="buy-btn" @click="buyListing(l)" :disabled="l.sellerEmail === myEmail">
            {{ l.sellerEmail === myEmail ? 'Your listing' : 'Buy' }}
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- ═══ MODALS ═══ -->

  <!-- Create Trade Offer Modal -->
  <div v-if="showCreateTrade" class="modal-overlay" @click.self="showCreateTrade=false">
    <div class="modal-box">
      <div class="modal-title">🔄 New Trade Offer <span class="modal-close" @click="showCreateTrade=false">✕</span></div>
      <div class="mfield">
        <label>Monster I'm offering</label>
        <div class="monster-pick-grid">
          <div v-for="(m,i) in playerStore.monsters" :key="m.id"
            class="monster-pick" :class="{selected: tradeForm.monsterIdx === i}"
            @click="tradeForm.monsterIdx = i">
            <div style="font-size:24px">{{ m.emoji }}</div>
            <div style="font-size:10px;font-weight:800;color:var(--text)">{{ m.name }}</div>
            <div class="badge" :class="'badge-'+m.tier.toLowerCase()" style="font-size:8px;padding:1px 5px">{{ m.tier }}</div>
          </div>
        </div>
      </div>
      <div class="form-row-2">
        <div class="mfield">
          <label>Want Tier</label>
          <select class="minput" v-model="tradeForm.wantTier">
            <option value="Any">Any Tier</option>
            <option v-for="t in ['Bronze','Silver','Gold','Diamond','Mystic']" :key="t">{{ t }}</option>
          </select>
        </div>
        <div class="mfield">
          <label>Want Set</label>
          <select class="minput" v-model="tradeForm.wantSet">
            <option value="Any">Any Set</option>
            <option value="Animal">Animal</option>
            <option value="Plant">Plant</option>
            <option value="Insect">Insect</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-gray" @click="showCreateTrade=false">Cancel</button>
        <button class="btn-primary" @click="createTradeOffer">Post Offer →</button>
      </div>
    </div>
  </div>

  <!-- Accept Trade Modal -->
  <div v-if="showAcceptTrade" class="modal-overlay" @click.self="showAcceptTrade=false">
    <div class="modal-box">
      <div class="modal-title">🔄 Accept Trade <span class="modal-close" @click="showAcceptTrade=false">✕</span></div>
      <div v-if="acceptTarget" style="background:#f5f0ff;border-radius:12px;padding:12px;margin-bottom:14px;font-size:12px;font-weight:700;color:#5e35b1">
        {{ acceptTarget.fromName }} offers <strong>{{ acceptTarget.fromMonster.name }}</strong> ({{ acceptTarget.fromMonster.tier }}) and wants a
        <strong>{{ acceptTarget.wantTier === 'Any' ? 'any' : acceptTarget.wantTier }}</strong> /
        <strong>{{ acceptTarget.wantSet === 'Any' ? 'any set' : acceptTarget.wantSet }}</strong> monster.
      </div>
      <div class="mfield">
        <label>Pick the monster you'll give</label>
        <div class="monster-pick-grid">
          <div v-for="(m,i) in playerStore.monsters" :key="m.id"
            class="monster-pick" :class="{selected: acceptMonsterIdx === i}"
            @click="acceptMonsterIdx = i">
            <div style="font-size:24px">{{ m.emoji }}</div>
            <div style="font-size:10px;font-weight:800;color:var(--text)">{{ m.name }}</div>
            <div class="badge" :class="'badge-'+m.tier.toLowerCase()" style="font-size:8px;padding:1px 5px">{{ m.tier }}</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-gray" @click="showAcceptTrade=false">Cancel</button>
        <button class="btn-primary" @click="confirmAcceptTrade" :disabled="acceptMonsterIdx === null">Confirm Trade →</button>
      </div>
    </div>
  </div>

  <!-- List Monster Modal -->
  <div v-if="showListModal" class="modal-overlay" @click.self="showListModal=false">
    <div class="modal-box">
      <div class="modal-title">📋 List Monster <span class="modal-close" @click="showListModal=false">✕</span></div>
      <div class="mfield">
        <label>Select Monster to Sell</label>
        <div class="monster-pick-grid">
          <div v-for="(m,i) in playerStore.monsters" :key="m.id"
            class="monster-pick" :class="{selected: listForm.monsterIdx === i}"
            @click="listForm.monsterIdx = i">
            <div style="font-size:24px">{{ m.emoji }}</div>
            <div style="font-size:10px;font-weight:800;color:var(--text)">{{ m.name }}</div>
            <div class="badge" :class="'badge-'+m.tier.toLowerCase()" style="font-size:8px;padding:1px 5px">{{ m.tier }}</div>
          </div>
        </div>
      </div>
      <div class="mfield">
        <label>Price (💎 gems)</label>
        <input class="minput" type="number" v-model.number="listForm.price" min="1" step="10" />
        <div style="font-size:11px;color:var(--text3);margin-top:4px">Gems go to your wallet when sold. Monster will be removed from your collection until sold or delisted.</div>
      </div>
      <div class="modal-footer">
        <button class="btn-gray" @click="showListModal=false">Cancel</button>
        <button class="btn-primary" @click="listMonster">List for {{ listForm.price }} 💎 →</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div v-if="toast" class="toast">{{ toast }}</div>

  <BottomNav active="chat" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'
import { useAutoRefresh } from '@/composables/useAutoRefresh.js'

playerStore.load()
const myEmail = localStorage.getItem('playerAuth') || ''
const tick    = useAutoRefresh(2000)
const tab     = ref('inbox')
const toast   = ref('')

function showToast(msg) { toast.value = msg; setTimeout(() => { toast.value = '' }, 2500) }

// ── DATA HELPERS ──
function threadKey(a, b) { return [a, b].sort().join('__') }
function getThreads()     { return JSON.parse(localStorage.getItem('chatThreads')    || '{}') }
function saveThreads(c)   { localStorage.setItem('chatThreads', JSON.stringify(c)) }
function getTradeOffers() { return JSON.parse(localStorage.getItem('tradeOffers')    || '[]') }
function saveTradeOffers(a){ localStorage.setItem('tradeOffers', JSON.stringify(a)) }
function getMarketAll()   { return JSON.parse(localStorage.getItem('marketListings') || '[]') }
function saveMarketAll(a)  { localStorage.setItem('marketListings', JSON.stringify(a)) }

// ── ALL REAL PLAYERS ──
const allPlayers = computed(() => {
  tick.value
  const raw = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  return Object.entries(raw)
    .filter(([email]) => email !== myEmail)
    .map(([email, d]) => ({
      email,
      name:     d.user?.name    || 'Player',
      avatar:   d.user?.avatar  || '👤',
      level:    d.user?.level   || 1,
      gems:     d.user?.gems    || 0,
      monsters: d.monsters?.length || 0,
    }))
})

// ── INBOX ──
const inboxSearch  = ref('')
const activeChat   = ref(null)
const newMsg       = ref('')
const msgBox       = ref(null)

const conversations = computed(() => {
  tick.value
  const threads = getThreads()
  const result  = []
  for (const [key, msgs] of Object.entries(threads)) {
    const parts = key.split('__')
    if (!parts.includes(myEmail)) continue
    const otherEmail  = parts.find(e => e !== myEmail)
    const otherPlayer = allPlayers.value.find(p => p.email === otherEmail) || { name: otherEmail, avatar: '👤' }
    const lastMsg     = msgs[msgs.length - 1]
    const unread      = msgs.filter(m => m.from !== myEmail && !m.read).length
    result.push({ key, otherEmail, name: otherPlayer.name, avatar: otherPlayer.avatar,
      lastMsg: lastMsg?.text || '', lastTime: lastMsg?.time || '', unread })
  }
  return result.sort((a, b) => b.lastTime.localeCompare(a.lastTime))
})

const filteredConvos = computed(() => {
  if (!inboxSearch.value.trim()) return conversations.value
  const q = inboxSearch.value.toLowerCase()
  return conversations.value.filter(c => c.name.toLowerCase().includes(q))
})

const totalUnread = computed(() => conversations.value.reduce((s, c) => s + c.unread, 0))

const activeChatMsgs = computed(() => {
  tick.value
  if (!activeChat.value) return []
  return getThreads()[activeChat.value.key] || []
})

watch(activeChatMsgs, () => {
  nextTick(() => { if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight })
})

function openChat(otherEmail, name, avatar) {
  const key = threadKey(myEmail, otherEmail)
  activeChat.value = { key, otherEmail, name, avatar }
  // mark read
  const threads = getThreads()
  if (threads[key]) {
    threads[key] = threads[key].map(m => m.from !== myEmail ? { ...m, read: true } : m)
    saveThreads(threads)
  }
  nextTick(() => { if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight })
}

function sendMsg() {
  if (!newMsg.value.trim() || !activeChat.value) return
  const threads = getThreads()
  const key     = activeChat.value.key
  if (!threads[key]) threads[key] = []
  threads[key].push({
    id:   Date.now(),
    from: myEmail,
    text: newMsg.value.trim(),
    time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    read: false,
  })
  saveThreads(threads)
  newMsg.value = ''
}

// ── PLAYERS TAB ──
const playerSearch = ref('')
const filteredPlayers = computed(() => {
  const q = playerSearch.value.toLowerCase()
  return allPlayers.value.filter(p => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
})

function proposeTradeToPlayer(p) {
  tab.value = 'trade'
  // open chat so they can negotiate
  openChat(p.email, p.name, p.avatar)
}

// ── TRADE ──
const showCreateTrade  = ref(false)
const showAcceptTrade  = ref(false)
const acceptTarget     = ref(null)
const acceptMonsterIdx = ref(null)
const tradeForm        = ref({ monsterIdx: null, wantTier: 'Any', wantSet: 'Any' })

const openTradeOffers = computed(() => {
  tick.value
  return getTradeOffers().filter(t => t.status === 'open')
})
const myOffers     = computed(() => openTradeOffers.value.filter(t => t.fromEmail === myEmail))
const othersOffers = computed(() => openTradeOffers.value.filter(t => t.fromEmail !== myEmail))

function createTradeOffer() {
  const m = playerStore.monsters[tradeForm.value.monsterIdx]
  if (m === undefined) { alert('Please select a monster.'); return }
  const all = getTradeOffers()
  all.push({
    id:          Date.now(),
    fromEmail:   myEmail,
    fromName:    playerStore.user.name || 'Player',
    fromAvatar:  playerStore.user.avatar || '👤',
    fromMonster: { ...m },
    wantTier:    tradeForm.value.wantTier,
    wantSet:     tradeForm.value.wantSet,
    status:      'open',
    createdAt:   new Date().toLocaleString(),
  })
  saveTradeOffers(all)
  showCreateTrade.value = false
  tradeForm.value = { monsterIdx: null, wantTier: 'Any', wantSet: 'Any' }
  showToast('✅ Trade offer posted!')
}

function cancelOffer(id) {
  const all = getTradeOffers()
  const idx = all.findIndex(t => t.id === id)
  if (idx >= 0) { all[idx].status = 'cancelled'; saveTradeOffers(all) }
}

function openAcceptTrade(offer) {
  acceptTarget.value = offer
  acceptMonsterIdx.value = null
  showAcceptTrade.value = true
}

function proposeTrade(chatPartner) {
  tab.value = 'trade'
  activeChat.value = null
}

function confirmAcceptTrade() {
  const myMonster = playerStore.monsters[acceptMonsterIdx.value]
  if (myMonster === undefined) { alert('Please select a monster.'); return }
  const offer = acceptTarget.value

  // Give offer monster to me (replace in my collection)
  const myIdx = acceptMonsterIdx.value
  playerStore.monsters.splice(myIdx, 1, { ...offer.fromMonster, id: myMonster.id })
  playerStore.save()

  // Give my original monster to the other player
  const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  if (accounts[offer.fromEmail]) {
    const theirMonsters = accounts[offer.fromEmail].monsters || []
    const theirIdx = theirMonsters.findIndex(m => m.id === offer.fromMonster.id)
    if (theirIdx >= 0) theirMonsters[theirIdx] = { ...myMonster, id: offer.fromMonster.id }
    else theirMonsters.push({ ...myMonster })
    accounts[offer.fromEmail].monsters = theirMonsters
    // Notify them
    const notifs = accounts[offer.fromEmail].notifications || []
    const nid = notifs.length ? Math.max(...notifs.map(n => n.id || 0)) + 1 : 1
    notifs.push({ id: nid, icon: '🔄', title: 'Trade Accepted!',
      body: `${playerStore.user.name} accepted your trade! You received ${myMonster.name}.`,
      time: new Date().toLocaleString(), read: false })
    accounts[offer.fromEmail].notifications = notifs
    localStorage.setItem('playerAccounts', JSON.stringify(accounts))
  }

  // Mark offer accepted
  const all = getTradeOffers()
  const idx = all.findIndex(t => t.id === offer.id)
  if (idx >= 0) { all[idx].status = 'accepted'; all[idx].acceptedBy = myEmail; saveTradeOffers(all) }

  showAcceptTrade.value = false
  showToast(`✅ Trade complete! Got ${offer.fromMonster.name}!`)
}

// ── MARKET ──
const marketSearch = ref('')
const mFilter      = ref('All')
const showListModal = ref(false)
const listForm      = ref({ monsterIdx: null, price: 100 })

const allListings = computed(() => {
  tick.value
  return getMarketAll().filter(l => l.status === 'active')
})
const myListings = computed(() => allListings.value.filter(l => l.sellerEmail === myEmail))
const filteredMarket = computed(() => {
  let list = allListings.value.filter(l => l.sellerEmail !== myEmail)
  if (mFilter.value !== 'All') list = list.filter(l => l.monster.tier === mFilter.value)
  if (marketSearch.value) list = list.filter(l => l.monster.name.toLowerCase().includes(marketSearch.value.toLowerCase()))
  return list
})

function listMonster() {
  const m = playerStore.monsters[listForm.value.monsterIdx]
  if (m === undefined) { alert('Select a monster.'); return }
  if (!listForm.value.price || listForm.value.price < 1) { alert('Minimum price is 1 gem.'); return }

  // Remove from my collection
  playerStore.monsters.splice(listForm.value.monsterIdx, 1)
  playerStore.save()

  const all = getMarketAll()
  all.push({
    id:           Date.now(),
    sellerEmail:  myEmail,
    sellerName:   playerStore.user.name || 'Player',
    sellerAvatar: playerStore.user.avatar || '👤',
    monster:      { ...m },
    price:        listForm.value.price,
    listedAt:     new Date().toLocaleString(),
    status:       'active',
  })
  saveMarketAll(all)
  showListModal.value = false
  showToast(`📋 ${m.name} listed for ${listForm.value.price} 💎`)
}

function delistMonster(listing) {
  if (!confirm('Remove listing? Monster returns to your collection.')) return
  playerStore.monsters.push({ ...listing.monster })
  playerStore.save()
  const all = getMarketAll()
  const idx = all.findIndex(l => l.id === listing.id)
  if (idx >= 0) { all[idx].status = 'delisted'; saveMarketAll(all) }
}

function buyListing(listing) {
  if (listing.sellerEmail === myEmail) return
  if (playerStore.user.gems < listing.price) {
    showToast(`❌ Need ${listing.price} 💎 (you have ${playerStore.user.gems})`)
    return
  }

  playerStore.user.gems -= listing.price
  const newId = playerStore.monsters.length ? Math.max(...playerStore.monsters.map(m => m.id || 0)) + 1 : 1
  playerStore.monsters.push({ ...listing.monster, id: newId })
  playerStore.save()

  // Pay seller
  const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  if (accounts[listing.sellerEmail]) {
    accounts[listing.sellerEmail].user = accounts[listing.sellerEmail].user || {}
    accounts[listing.sellerEmail].user.gems = (accounts[listing.sellerEmail].user.gems || 0) + listing.price
    const notifs = accounts[listing.sellerEmail].notifications || []
    const nid = notifs.length ? Math.max(...notifs.map(n => n.id || 0)) + 1 : 1
    notifs.push({ id: nid, icon: '💎', title: 'Monster Sold!',
      body: `${playerStore.user.name} bought ${listing.monster.name} for ${listing.price} gems!`,
      time: new Date().toLocaleString(), read: false })
    accounts[listing.sellerEmail].notifications = notifs
    localStorage.setItem('playerAccounts', JSON.stringify(accounts))
  }

  const all = getMarketAll()
  const idx = all.findIndex(l => l.id === listing.id)
  if (idx >= 0) { all[idx].status = 'sold'; saveMarketAll(all) }

  showToast(`✅ Bought ${listing.monster.name} for ${listing.price} 💎!`)
}
</script>

<style scoped>
.page-header { background:linear-gradient(160deg,#7c4dff 0%,#2196f3 100%); padding:0 20px 0; }
.status-bar  { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row  { display:flex; align-items:center; justify-content:space-between; margin-top:12px; padding-bottom:4px; }
.page-title  { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.support-link{ background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:11px; font-weight:800; padding:5px 12px; border-radius:10px; cursor:pointer; }
.tab-row     { display:flex; margin-top:8px; }
.tab2        { flex:1; text-align:center; padding:10px 0; font-size:11px; font-weight:800; color:rgba(255,255,255,.6); cursor:pointer; border-bottom:3px solid transparent; position:relative; }
.tab2.active { color:#fff; border-bottom:3px solid #fff; }
.tab-badge   { display:inline-flex; align-items:center; justify-content:center; background:#ff5252; color:#fff; border-radius:8px; font-size:9px; font-weight:800; min-width:14px; height:14px; padding:0 3px; margin-left:3px; }

/* SEARCH BAR */
.search-bar { display:flex; gap:8px; align-items:center; padding:12px 16px; }
.s-input    { flex:1; padding:9px 14px; border-radius:20px; border:2px solid #e8eaf0; background:#f8f7ff; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; }
.s-input:focus { border-color:#7c4dff; }
.compose-btn{ width:38px; height:38px; border-radius:12px; background:#ede7ff; border:1.5px solid #d4c8ff; color:#5e35b1; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }

/* INBOX */
.chat-item   { display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid #f5f0ff; cursor:pointer; transition:background .1s; }
.chat-item:hover { background:#faf8ff; }
.chat-avatar { width:46px; height:46px; border-radius:14px; background:#f0eeff; border:2px solid #d4c8ff; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.chat-avatar.sm { width:36px; height:36px; border-radius:10px; font-size:18px; background:#f0eeff; border:2px solid #d4c8ff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.chat-info   { flex:1; min-width:0; }
.chat-name   { font-size:13px; font-weight:800; color:var(--text); }
.chat-preview{ font-size:11px; font-weight:700; color:var(--text2); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.chat-meta   { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
.chat-time   { font-size:10px; font-weight:700; color:var(--text3); }
.chat-badge  { background:var(--purple); color:#fff; border-radius:10px; padding:2px 7px; font-size:10px; font-weight:800; }

.chat-window  { display:flex; flex-direction:column; height:calc(100vh - 160px); }
.cw-header    { display:flex; align-items:center; gap:10px; padding:12px 16px; background:#fff; border-bottom:2px solid #f0eeff; flex-shrink:0; }
.back-btn     { width:36px; height:36px; border-radius:10px; background:#f5f0ff; border:2px solid #e0d7ff; color:var(--text); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.trade-btn    { padding:6px 12px; border-radius:10px; background:#ede7ff; border:2px solid #d4c8ff; color:#5e35b1; font-size:11px; font-weight:800; cursor:pointer; flex-shrink:0; }
.messages     { flex:1; overflow-y:auto; padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
.message      { display:flex; flex-direction:column; }
.message.mine { align-items:flex-end; }
.bubble       { max-width:78%; padding:10px 14px; border-radius:18px 18px 18px 4px; font-size:13px; font-weight:700; background:#f0eeff; color:var(--text); }
.message.mine .bubble { background:var(--purple); color:#fff; border-radius:18px 18px 4px 18px; }
.msg-time     { font-size:9px; color:var(--text3); font-weight:700; margin-top:3px; }
.cw-input     { display:flex; align-items:center; gap:8px; padding:10px 16px; background:#fff; border-top:2px solid #f0eeff; flex-shrink:0; }
.send-btn     { width:40px; height:40px; border-radius:12px; background:var(--purple); border:none; color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* PLAYERS */
.player-row  { display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid #f5f0ff; }
.p-avatar    { width:44px; height:44px; border-radius:14px; background:#f0eeff; border:2px solid #d4c8ff; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.p-info      { flex:1; }
.p-name      { font-size:13px; font-weight:800; color:var(--text); }
.p-meta      { font-size:11px; font-weight:700; color:var(--text3); margin-top:2px; }
.p-actions   { display:flex; gap:6px; }
.p-btn       { width:34px; height:34px; border-radius:10px; border:2px solid; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.p-btn.msg   { background:#e3f2fd; border-color:#90caf9; }
.p-btn.trade { background:#ede7ff; border-color:#d4c8ff; }

/* TRADE */
.trade-section-title { font-family:'Fredoka One',cursive; font-size:15px; color:var(--text); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.count-chip   { background:#ede7ff; color:#5e35b1; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px; }
.mini-empty   { font-size:12px; font-weight:700; color:var(--text3); padding:8px 0 4px; }
.trade-card   { background:#fff; border-radius:16px; border:2px solid #e0d7ff; padding:14px; margin-bottom:10px; box-shadow:0 2px 0 #d4c8ff; position:relative; }
.trade-card.mine { border-color:#b2dfdb; box-shadow:0 2px 0 #b2dfdb; }
.tc-owner     { font-size:12px; font-weight:800; color:var(--text2); margin-bottom:6px; }
.tc-monster   { display:flex; flex-direction:column; align-items:center; gap:4px; min-width:70px; }
.tc-name      { font-size:11px; font-weight:800; color:var(--text); text-align:center; }
.tc-arrow     { font-size:22px; color:var(--text3); flex-shrink:0; }
.tc-want      { flex:1; padding-left:8px; }
.cancel-btn   { position:absolute; top:10px; right:10px; background:#ffebee; color:#c62828; border:1.5px solid #ef9a9a; border-radius:8px; font-size:11px; font-weight:800; padding:4px 10px; cursor:pointer; font-family:'Nunito',sans-serif; }
.accept-btn   { flex:1; padding:9px; border-radius:10px; background:#ede7ff; color:#5e35b1; border:1.5px solid #d4c8ff; font-size:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; }
.accept-btn:disabled { opacity:.4; cursor:not-allowed; }
.msg-small-btn{ padding:9px 14px; border-radius:10px; background:#e0f2f1; color:#00695c; border:1.5px solid #b2dfdb; font-size:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; }
.create-offer-btn { width:100%; padding:13px; border-radius:14px; background:#7c4dff; color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; margin-top:16px; }
.create-offer-btn:disabled { opacity:.5; cursor:not-allowed; }

/* MARKET */
.list-btn   { padding:8px 16px; border-radius:10px; background:#00897b; color:#fff; font-size:12px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.list-btn:disabled { opacity:.4; cursor:not-allowed; }
.market-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.market-card{ background:#fff; border-radius:16px; border:2px solid #e0d7ff; padding:12px; display:flex; flex-direction:column; align-items:center; box-shadow:0 2px 0 #d4c8ff; margin-bottom:10px; }
.mc-seller  { font-size:10px; font-weight:800; color:var(--text3); align-self:flex-start; }
.buy-btn    { width:100%; margin-top:8px; padding:8px; border-radius:10px; background:#7c4dff; color:#fff; font-size:12px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.buy-btn:disabled { background:#e0e0e0; color:#999; cursor:default; }
.filter-chip{ flex-shrink:0; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:800; background:#fff; border:2px solid #e0d7ff; color:var(--text2); cursor:pointer; white-space:nowrap; }
.filter-chip.active { background:var(--purple); border-color:var(--purple); color:#fff; }

/* BADGE */
.badge         { font-size:9px; font-weight:800; padding:2px 7px; border-radius:6px; }
.badge-bronze  { background:#fff3e0; color:#bf360c; }
.badge-silver  { background:#eceff1; color:#546e7a; }
.badge-gold    { background:#fff8e1; color:#f57f17; }
.badge-diamond { background:#e3f2fd; color:#0288d1; }
.badge-mystic  { background:#f3e5f5; color:#7b1fa2; }

/* MODAL */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:400; display:flex; align-items:flex-end; justify-content:center; }
.modal-box     { background:#fff; border-radius:24px 24px 0 0; padding:22px; width:100%; max-height:88vh; overflow-y:auto; box-shadow:0 -8px 32px rgba(0,0,0,.2); }
.modal-title   { font-family:'Fredoka One',cursive; font-size:17px; color:var(--text); margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; }
.modal-close   { width:28px; height:28px; border-radius:8px; background:#f4f6ff; border:2px solid #e8eaf0; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; }
.modal-footer  { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; padding-top:14px; border-top:2px solid #f0eeff; }
.mfield        { margin-bottom:14px; }
.mfield label  { display:block; font-size:11px; font-weight:800; color:#5a6080; margin-bottom:6px; }
.minput        { width:100%; padding:10px 12px; border-radius:10px; border:2px solid #e8eaf0; background:#f8f9ff; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; box-sizing:border-box; }
.minput:focus  { border-color:#7c4dff; }
.form-row-2    { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.btn-primary   { padding:10px 22px; border-radius:12px; background:#7c4dff; color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.btn-gray      { padding:10px 22px; border-radius:12px; background:#f4f6ff; color:#5a6080; font-size:13px; font-weight:800; border:2px solid #e8eaf0; cursor:pointer; font-family:'Nunito',sans-serif; }

/* Monster Picker */
.monster-pick-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; max-height:180px; overflow-y:auto; }
.monster-pick      { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 4px; border-radius:12px; border:2px solid #e8eaf0; cursor:pointer; transition:all .15s; background:#f8f9ff; }
.monster-pick.selected { border-color:#7c4dff; background:#f0eaff; }

/* EMPTY */
.empty-state { text-align:center; padding:48px 20px; }

/* TOAST */
.toast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:#1a1f3c; color:#fff; border-radius:20px; padding:10px 22px; font-size:13px; font-weight:800; z-index:500; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,.3); }
</style>
