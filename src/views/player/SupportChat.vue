<template>
  <div class="phone-shell" style="background:var(--bg-player)">

    <!-- HEADER -->
    <div class="chat-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div>
          <div class="page-title">💬 HATCHME Support</div>
          <div class="page-sub">AI-powered · Usually instant</div>
        </div>
        <div style="width:36px"></div>
      </div>
    </div>

    <!-- USER INFO BAR -->
    <div class="user-bar">
      <span style="font-size:18px">{{ playerStore.user.avatar || '👤' }}</span>
      <div>
        <div style="font-size:12px;font-weight:800;color:#1a1f3c">{{ playerStore.user.name || 'Player' }}</div>
        <div style="font-size:10px;font-weight:700;color:#90a4ae">{{ playerStore.user.email || '' }} · Lv {{ playerStore.user.level || 1 }}</div>
      </div>
      <button class="clear-btn" @click="clearChat">🗑 Clear</button>
    </div>

    <!-- MESSAGES -->
    <div class="messages-area" ref="messagesEl">
      <div v-if="messages.length === 0" class="welcome-bubble">
        <div class="support-avatar">🛡</div>
        <div class="msg-content">
          <div class="msg-name">HATCHME Support</div>
          <div class="msg-text">Hi {{ playerStore.user.name || 'there' }}! 👋 I'm your HATCHME support assistant. Ask me anything about eggs, merchants, monsters, quests, or your account!</div>
          <div class="msg-time">{{ nowTime }}</div>
        </div>
      </div>

      <div v-for="msg in messages" :key="msg.id"
        class="msg-row" :class="msg.role === 'user' ? 'msg-user' : 'msg-support'">
        <div v-if="msg.role === 'support'" class="support-avatar">🛡</div>
        <div class="msg-content">
          <div v-if="msg.role !== 'user'" class="msg-name">HATCHME Support</div>
          <div class="msg-text" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-support'">{{ msg.text }}</div>
          <div class="msg-time" :class="msg.role === 'user' ? 'time-right' : ''">{{ msg.time }}</div>
        </div>
        <div v-if="msg.role === 'user'" class="user-avatar-sm">{{ playerStore.user.avatar || '👤' }}</div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="msg-row msg-support">
        <div class="support-avatar">🛡</div>
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>

    <!-- QUICK QUESTIONS -->
    <div v-if="messages.length === 0" class="quick-bar">
      <button v-for="q in QUICK_QUESTIONS" :key="q" class="quick-btn" @click="sendQuick(q)">{{ q }}</button>
    </div>

    <!-- INPUT -->
    <div class="input-row">
      <input class="chat-input" v-model="inputText" placeholder="Ask a question…"
        @keyup.enter="sendMessage" :disabled="isTyping" />
      <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim() || isTyping">▶</button>
    </div>

    <BottomNav active="chat" />
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { playerStore } from '@/store/playerStore.js'

playerStore.load()

const messagesEl = ref(null)
const inputText  = ref('')
const isTyping   = ref(false)
const messages   = ref([])
const nowTime    = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })

const STORAGE_KEY  = `supportChat_${localStorage.getItem('playerAuth') || 'guest'}`

const QUICK_QUESTIONS = [
  '🥚 How do eggs work?',
  '🏪 How to earn at merchants?',
  '⏳ My egg is still pending',
  '💳 How do credits work?',
  '🐾 How to feed monsters?',
  '🔗 My referral code',
]

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  messages.value = saved
  scrollToBottom()
})

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  // Index for admin view
  const allChats = JSON.parse(localStorage.getItem('allSupportChats') || '{}')
  const key = localStorage.getItem('playerAuth') || 'guest'
  const last = messages.value[messages.value.length - 1]
  allChats[key] = {
    userName:    playerStore.user.name  || 'Player',
    userEmail:   playerStore.user.email || key,
    userAvatar:  playerStore.user.avatar || '👤',
    lastMessage: last?.text?.slice(0, 60) || '',
    lastTime:    last?.time || '',
    messages:    messages.value,
  }
  localStorage.setItem('allSupportChats', JSON.stringify(allChats))
}

function clearChat() {
  messages.value = []
  saveMessages()
}

function getAIReply(text) {
  const t = text.toLowerCase()

  if (t.match(/hello|hi |hey|hai|helo|good (morning|afternoon|evening)/)) {
    return `Hello, ${playerStore.user.name || 'there'}! 👋 Great to hear from you! How can I help today? You can ask about eggs, merchants, monsters, quests, or your account!`
  }
  if (t.match(/thank|thanks|great|awesome|good job|well done|perfect/)) {
    return `You're welcome! 😊 Anything else I can help with? I'm here 24/7 for any HATCHME questions!`
  }
  if (t.match(/egg|hatch|bronze|silver|gold|diamond|mystic/)) {
    return `🥚 Egg Tiers & Hatch Times:\n\n• Bronze — 72 hours\n• Silver — 48 hours\n• Gold — 24 hours\n• Diamond — 12 hours\n• Mystic — 6 hours (fastest!)\n\nEggs are earned by purchasing at approved merchant stores. Higher tier eggs hatch faster and give rarer monsters!`
  }
  if (t.match(/pending|waiting|approv|not receiv|not got/)) {
    return `⏳ Pending Egg Approval:\n\nAfter you scan a merchant's QR and enter your purchase amount, the egg goes into "Pending" state. The merchant reviews and approves purchases.\n\n• Usually approved within a few hours\n• You'll get a notification when approved\n• Credits are reserved from the merchant until then\n\nIf it's been over 24 hours, the merchant may have missed it — try contacting them directly!`
  }
  if (t.match(/merchant|store|shop|purchase|scan|qr|buy/)) {
    return `🏪 How to earn at merchants:\n\n1. Go to Scan → Browse Merchants tab\n2. Select an approved merchant\n3. Enter the amount you actually paid\n4. Confirm and rate your experience\n5. Wait for the merchant to approve\n6. Your egg starts hatching! 🥚\n\nEgg tiers are set by the merchant:\n• Bronze = 20% of purchase value as credits\n• Silver = 25%  Gold = 30%\n• Diamond = 35%  Mystic = 40%`
  }
  if (t.match(/credit|top.?up|balance|pay/)) {
    return `💳 Credits System:\n\nMerchants buy credits to fund your egg rewards:\n• S$100 → 100 credits\n• S$500 → 500 credits\n• S$1,000 → 1,000 credits\n• S$5,000 → 5,000 credits\n\n1 credit = S$1 value in egg rewards.\nCredits are also used for merchant video ads (0.01/view).`
  }
  if (t.match(/quest|mission|task|challenge/)) {
    return `📋 Quests:\n\nFind them in Profile → My Quests:\n\n• Feed quests — Feed monsters 25/100/500 times\n• Spend quests — Purchase S$100/500/2000 at merchants\n• Recruit quests — Invite 3/10/25 friends\n• Collect quests — Get Animal, Plant, Insect monsters\n\nEach quest rewards cash (S$) + bonus egg + unlocks the next quest!`
  }
  if (t.match(/monster|feed|hp|streak|hungry/)) {
    return `🐾 Monster Care:\n\nGo to Monsters → select any monster → Feed!\n\n• Feed daily to maintain HP\n• HP drops if unfed — monsters get "hungry"!\n• Build feeding streaks for XP bonuses\n• Monsters level up as you feed them\n• Higher levels = more power + name prefixes\n\nDon't neglect your monsters! 🐾`
  }
  if (t.match(/refer|referral|invite|friend|code/)) {
    return `🔗 Your Referral Code:\n\n${playerStore.referCode || '(See Profile → Refer a Friend)'}\n\nShare this with friends! Each friend who signs up:\n• They get a welcome bonus\n• You earn referral rewards\n\nAlso: if a merchant gave you their code during signup, you're linked to their store for exclusive egg rewards!`
  }
  if (t.match(/withdraw|cash|money|payout|earn/)) {
    return `💵 Cash & Withdrawals:\n\nEarn cash by:\n• Completing quests (S$5–S$500)\n• Level-up bonuses\n• Trading monsters\n\nWithdraw from Profile → Withdraw.\nMinimum: S$10 · Processing: 3–5 business days\n\nYour current balance: S$${(playerStore.user.cash || 0).toFixed(2)}`
  }
  if (t.match(/dispute|wrong|mistake|incorrect|fraud|scam/)) {
    return `⚠️ Transaction Disputes:\n\nIf there's a dispute on a transaction:\n• The merchant can flag it to admin\n• Admin reviews within 48 hours\n• You'll be notified of the outcome\n\nIf you believe your purchase was wrongly rejected:\n• Keep your receipt as proof\n• Email us: support@hatchme.com with transaction details`
  }
  if (t.match(/account|login|password|forgot|sign in|sign up/)) {
    return `🔐 Account Help:\n\nFor account recovery or login issues:\n• Email: support@hatchme.com\n• Include your registered email address\n• We'll verify your identity and help\n\nTip: Save your login email and password securely!`
  }
  if (t.match(/level|xp|exp|rank/)) {
    return `⭐ Level System:\n\nGain XP by:\n• Feeding monsters\n• Completing quests\n• Spending at merchants\n\nYou're currently Level ${playerStore.user.level || 1} with ${playerStore.user.xp || 0} XP.\n\nLevel up to earn bonus cash, gems, and special eggs!`
  }
  if (t.match(/gem|diamond|currency|shop/)) {
    return `💎 Gems:\n\nYou have ${(playerStore.user.gems || 0).toLocaleString()} gems.\n\nGems are earned from:\n• Level-up bonuses\n• Quest completions\n• Special events\n\nGems can be used in the in-game shop for special items and power-ups!`
  }
  if (t.match(/what is|hatchme|how does|how do i|how to/)) {
    return `🎮 What is HATCHME?\n\nHATCHME is a Real Life RPG loyalty app!\n\n1. 🏪 Shop at partner merchants in real life\n2. 📱 Scan their QR code to record your purchase\n3. 🥚 Earn egg rewards based on your spend\n4. ⏳ Wait for merchant approval\n5. 🐾 Hatch eggs to get unique monsters\n6. 🍖 Feed and level up your monsters\n7. 📋 Complete quests for more rewards!\n\nIt's like a Pokémon game that rewards real-world spending! 🎮`
  }

  return `Thanks for reaching out! 🙏 I'm not sure about that specific question.\n\nHere are topics I can help with:\n• 🥚 Egg tiers and hatching\n• 🏪 Scanning at merchants\n• ⏳ Pending approvals\n• 🐾 Monster feeding and care\n• 📋 Quests and rewards\n• 💳 Credits and payments\n• ⚠️ Disputes\n• 🔗 Referral codes\n• 💵 Cash and withdrawals\n\nFor urgent issues: support@hatchme.com`
}

function addMsg(role, text) {
  const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
  messages.value.push({ id: Date.now() + Math.random(), role, text, time })
  saveMessages()
  scrollToBottom()
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isTyping.value) return
  inputText.value = ''
  addMsg('user', text)
  isTyping.value = true
  scrollToBottom()
  await new Promise(r => setTimeout(r, 600 + Math.random() * 900))
  isTyping.value = false
  addMsg('support', getAIReply(text))
}

function sendQuick(q) {
  inputText.value = q
  sendMessage()
}
</script>

<style scoped>
.phone-shell  { display:flex; flex-direction:column; height:100vh; background:var(--bg-player); font-family:'Nunito',sans-serif; overflow:hidden; }
.chat-header  { background:linear-gradient(135deg,#7c4dff,#2196f3); padding:0 20px 12px; flex-shrink:0; }
.status-bar   { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.9); font-weight:800; }
.header-row   { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.back-btn     { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.page-title   { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.page-sub     { font-size:10px; font-weight:800; color:rgba(255,255,255,.7); margin-top:1px; }

.user-bar     { display:flex; align-items:center; gap:10px; background:#fff; border-bottom:2px solid #e0d7ff; padding:10px 16px; flex-shrink:0; }
.clear-btn    { margin-left:auto; font-size:11px; font-weight:800; background:#f4f6ff; color:#5a6080; border:1.5px solid #e8eaf0; border-radius:8px; padding:5px 10px; cursor:pointer; font-family:'Nunito',sans-serif; }

.messages-area { flex:1; overflow-y:auto; padding:14px 16px; display:flex; flex-direction:column; gap:12px; }

.welcome-bubble { display:flex; gap:8px; align-items:flex-end; }
.msg-row        { display:flex; gap:8px; align-items:flex-end; }
.msg-row.msg-user { flex-direction:row-reverse; }

.support-avatar { width:32px; height:32px; border-radius:10px; background:#ede7ff; border:2px solid #d4c8ff; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
.user-avatar-sm { width:32px; height:32px; border-radius:10px; background:#e0f7fa; border:2px solid #b2ebf2; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }

.msg-content  { max-width:75%; }
.msg-name     { font-size:10px; font-weight:800; color:#7c4dff; margin-bottom:3px; }
.msg-text     { padding:10px 13px; font-size:13px; font-weight:700; color:#1a1f3c; line-height:1.6; white-space:pre-wrap; word-break:break-word; }
.bubble-support { background:#fff; border:2px solid #e0d7ff; border-radius:14px 14px 14px 4px; }
.bubble-user    { background:#7c4dff; color:#fff; border:none; border-radius:14px 14px 4px 14px; }
.msg-time       { font-size:10px; font-weight:700; color:#ccc; margin-top:3px; }
.time-right     { text-align:right; }

/* Typing */
.typing-dots { display:flex; gap:4px; padding:12px 16px; background:#fff; border:2px solid #e0d7ff; border-radius:14px 14px 14px 4px; }
.typing-dots span { width:6px; height:6px; background:#b39ddb; border-radius:50%; animation:dotBob 1.2s ease-in-out infinite; }
.typing-dots span:nth-child(2) { animation-delay:.2s; }
.typing-dots span:nth-child(3) { animation-delay:.4s; }
@keyframes dotBob { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }

/* Quick questions */
.quick-bar  { display:flex; gap:8px; overflow-x:auto; padding:0 16px 10px; scrollbar-width:none; flex-shrink:0; }
.quick-bar::-webkit-scrollbar { display:none; }
.quick-btn  { background:#fff; border:2px solid #d4c8ff; border-radius:20px; padding:7px 14px; font-size:11px; font-weight:800; color:#5e35b1; white-space:nowrap; cursor:pointer; font-family:'Nunito',sans-serif; flex-shrink:0; }
.quick-btn:hover { background:#ede7ff; }

/* Input */
.input-row   { display:flex; gap:8px; padding:10px 16px; background:#fff; border-top:2px solid #e0d7ff; flex-shrink:0; }
.chat-input  { flex:1; padding:10px 14px; border-radius:20px; border:2px solid #e0d7ff; background:#f8f7ff; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; }
.chat-input:focus { border-color:#7c4dff; }
.send-btn    { width:40px; height:40px; border-radius:12px; background:#7c4dff; border:none; color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.send-btn:disabled { opacity:.5; cursor:not-allowed; }
</style>
