<template>
  <div class="phone-shell">

    <!-- HEADER -->
    <div class="chat-header">
      <div class="status-bar"><span>9:41</span><span>87%</span></div>
      <div class="header-row">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="header-center">
          <div class="bot-badge">
            <div class="bot-dot"></div>
            <span>Online</span>
          </div>
          <div class="page-title">🛡️ HATCHME Support</div>
          <div class="page-sub">AI Assistant · Always here for you</div>
        </div>
        <button class="clear-btn-top" @click="clearChat" title="Clear chat">🗑</button>
      </div>
    </div>

    <!-- USER INFO BAR -->
    <div class="user-bar">
      <div class="user-chip">
        <span class="user-ava">{{ playerStore.user.avatar || '👤' }}</span>
        <div>
          <div class="user-name">{{ playerStore.user.name || 'Player' }}</div>
          <div class="user-meta">Lv {{ playerStore.user.level || 1 }} · {{ playerStore.user.email || 'Guest' }}</div>
        </div>
      </div>
      <div class="user-stats">
        <div class="stat-pill">🥚 {{ playerStore.eggs?.length || 0 }} eggs</div>
        <div class="stat-pill">💰 ${{ (playerStore.user.cash || 0).toFixed(2) }}</div>
      </div>
    </div>

    <!-- MESSAGES -->
    <div class="messages-area" ref="messagesEl">

      <!-- Welcome state -->
      <div v-if="messages.length === 0" class="welcome-wrap">
        <div class="welcome-bot">
          <div class="bot-avatar-lg">🛡️</div>
          <div class="glow-ring"></div>
        </div>
        <div class="welcome-title">Hey {{ playerStore.user.name || 'there' }}! 👋</div>
        <div class="welcome-sub">I'm Shellie, your HATCHME assistant.<br>Ask me anything about the game!</div>

        <div class="topic-grid">
          <div v-for="t in TOPICS" :key="t.label" class="topic-card" @click="sendQuick(t.q)">
            <div class="topic-icon">{{ t.icon }}</div>
            <div class="topic-label">{{ t.label }}</div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-for="msg in messages" :key="msg.id"
        class="msg-row" :class="msg.role === 'user' ? 'msg-user' : 'msg-bot'">
        <div v-if="msg.role === 'bot'" class="bot-avatar">🛡️</div>
        <div class="msg-content">
          <div v-if="msg.role === 'bot'" class="msg-sender">Shellie · HATCHME</div>
          <div class="msg-bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-bot'" v-html="formatMsg(msg.text)"></div>
          <div class="msg-time" :class="msg.role === 'user' ? 'time-right' : ''">{{ msg.time }}</div>
        </div>
        <div v-if="msg.role === 'user'" class="user-avatar-sm">{{ playerStore.user.avatar || '👤' }}</div>
      </div>

      <!-- Typing -->
      <div v-if="isTyping" class="msg-row msg-bot">
        <div class="bot-avatar">🛡️</div>
        <div class="typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- QUICK PILLS (shown when chat has messages) -->
    <div v-if="messages.length > 0" class="quick-bar">
      <button v-for="q in QUICK_PILLS" :key="q.label" class="quick-pill" @click="sendQuick(q.q)">
        {{ q.icon }} {{ q.label }}
      </button>
    </div>

    <!-- INPUT -->
    <div class="input-row">
      <div class="input-wrap">
        <input class="chat-input" v-model="inputText"
          placeholder="Ask Shellie anything…"
          @keyup.enter="sendMessage"
          :disabled="isTyping" />
      </div>
      <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim() || isTyping">
        <span class="send-icon">➤</span>
      </button>
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

const STORAGE_KEY = `supportChat_${localStorage.getItem('playerAuth') || 'guest'}`

const TOPICS = [
  { icon:'🥚', label:'Eggs',        q:'How do eggs work?' },
  { icon:'🐾', label:'Monsters',    q:'Tell me about monsters' },
  { icon:'🍖', label:'Feeding',     q:'How do I feed my monster?' },
  { icon:'📋', label:'Quests',      q:'How do I do quests?' },
  { icon:'💵', label:'Earnings',    q:'How do I earn and withdraw cash?' },
  { icon:'🔀', label:'Trading',     q:'How does monster trading work?' },
  { icon:'🏪', label:'Merchants',   q:'How do I earn from merchants?' },
  { icon:'🛒', label:'Market',      q:'What is the market?' },
  { icon:'🏆', label:'Collection',  q:'Tell me about the monster collection' },
  { icon:'🏅', label:'Achievements',q:'How do achievements work?' },
  { icon:'👥', label:'Guild & Chat',q:'How do I join a guild?' },
  { icon:'🌍', label:'Our Story',   q:'Tell me about HATCHME' },
]

const QUICK_PILLS = [
  { icon:'🥚', label:'Eggs',     q:'How do eggs work?' },
  { icon:'🐾', label:'Monsters', q:'Tell me about monsters' },
  { icon:'📋', label:'Quests',   q:'How do I do quests?' },
  { icon:'💵', label:'Earn',     q:'How do I earn and withdraw cash?' },
  { icon:'🔀', label:'Trade',    q:'How does monster trading work?' },
  { icon:'🌍', label:'Story',    q:'Tell me about HATCHME' },
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

// Format message text with simple markdown-like styling
function formatMsg(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n/g,'<br>')
}

function getAIReply(text) {
  const t = text.toLowerCase()

  // Greetings
  if (t.match(/^(hello|hi|hey|hai|helo|hii|yo |good (morning|afternoon|evening))/)) {
    return `Hey ${playerStore.user.name || 'there'}! 👋 Welcome back!\n\nI'm **Shellie**, your HATCHME support assistant. What can I help you with today?\n\nAsk me about **eggs, monsters, quests, earnings, trading**, or anything else! 🎮`
  }

  // Thanks
  if (t.match(/thank|thanks|tysm|ty |great|awesome|good job|well done|perfect|helpful/)) {
    return `You're welcome! 😊 It's my pleasure to help!\n\nIs there anything else you'd like to know? I'm here **24/7** for any HATCHME questions! 🛡️`
  }

  // Our Story / Brand / About / Where
  if (t.match(/story|brand|about|where|who are|hatchme|what is hatchme|how does hatchme/)) {
    return `🌍 **The HATCHME Story**\n\nWe believe your everyday spending should feel like an adventure.\n\n**HATCHME** was born from a simple idea — what if every time you bought something in real life, you got a magical reward? Not just points, but a **living, breathing monster** that grows with you.\n\nWe built a Real Life RPG where:\n🏪 Shopping at local merchants becomes **quests**\n🥚 Every purchase hatches into a **unique monster**\n🐾 Caring for your monster **unlocks real cash rewards**\n🌟 Your loyalty builds a **community and guild**\n\nWe're on a mission to turn the **real world into a game** — where every receipt, every store visit, and every friend you bring along is part of your adventure.\n\n**HATCHME. Your life, your quest.** 🎮`
  }

  // Eggs
  if (t.match(/egg|hatch|bronze|silver|gold|diamond|mystic|tier|rarity|rare/)) {
    return `🥚 **Egg Tiers & Rarity**\n\nDifferent egg tiers unlock **different rarities of monsters**:\n\n🟤 **Bronze** — Common monsters\n⚪ **Silver** — Uncommon monsters\n🟡 **Gold** — Rare monsters\n💎 **Diamond** — Epic monsters\n🌟 **Mystic** — Legendary monsters!\n\n**How to get eggs:**\n• Spend at partner merchants 🏪\n• Complete quests 📋\n• Attend special events 🎉\n\nHigher tier eggs hatch rarer and more powerful monsters. Collect them all! 🐾`
  }

  // Pending egg
  if (t.match(/pending|waiting|not approv|not receiv|not got|egg stuck|still pending/)) {
    return `⏳ **Pending Egg Approval**\n\nAfter you scan a merchant's QR code and submit your purchase, your egg enters **Pending** status.\n\nWhy pending? We keep eggs in review to ensure there are **no disputes** between you and the merchant on the purchase — this protects everyone!\n\n• Usually approved within a few hours\n• You'll be notified once approved\n• If it's been over **24 hours**, try contacting the merchant directly\n\nFor unresolved issues, email us at: **support@hatchme.com** with your transaction details 📧`
  }

  // Merchants / scan / purchase
  if (t.match(/merchant|store|shop|scan|qr|purchase|buy|spend at/)) {
    return `🏪 **Earning from Merchants**\n\n1. Go to **Scan** → Browse Merchants\n2. Select an approved merchant near you\n3. Enter the amount you actually paid\n4. Confirm and rate your experience\n5. Wait for merchant approval 🥚\n6. Your egg hatches into a monster!\n\n**What you earn:**\nYou receive **50% of your purchase value** (after tax deduction) — this is unlocked gradually as you **feed your monster** daily.\n\nThe more you spend, the better the egg tier, and the rarer the monster you'll hatch! 🌟`
  }

  // Feed / hunger / monster care
  if (t.match(/feed|hunger|hungry|care|nurture|food|feeding/)) {
    return `🍖 **Feeding Your Monster**\n\nGo to **Monsters** → tap any monster → hit **Feed!**\n\n• Feeding your monster increases its **Hunger** stat\n• Feed each monster **3 times per day** for best results\n• Your daily feeding unlocks your **cash rewards** from the safebox\n• Build feeding **streaks** to earn XP bonuses\n• Monsters level up over time as you care for them\n\n💡 **Tip:** The more consistently you feed, the faster your rewards unlock — don't skip a day! 🐾`
  }

  // Quests
  if (t.match(/quest|mission|task|challenge|how to quest|complete quest/)) {
    return `📋 **Quests**\n\nTap the **Quests** tab from your bottom navigation to see all active quests.\n\nTap any quest to see **exactly what to do** and track your progress.\n\n**What you get from completing quests:**\n🥚 Bonus egg rewards\n💰 Cash rewards\n💎 Gems\n⭐ XP to level up\n\n**Pro tip:** Completing spending quests at merchants gives you **extra egg rewards** on top of your normal egg — stack them up! 🏆`
  }

  // Referral code
  if (t.match(/refer|referral|invite|intro|friend|code|my code/)) {
    return `🔗 **Your Referral Code**\n\n${playerStore.referCode ? `**${playerStore.referCode}**` : '*(Find it in Profile → Refer a Friend)*'}\n\nShare this code with friends!\n\n**When a friend signs up with your code:**\n• They complete the **intro quest** and get **extra egg rewards**\n• You earn referral rewards too!\n\nThe more friends you bring into the adventure, the more eggs for everyone! 🥚`
  }

  // Trading
  if (t.match(/trade|trading|swap|exchange|transfer monster/)) {
    return `🔀 **Monster Trading**\n\nYou can **trade monsters** with other players!\n\n**Rules:**\n• You can only trade with players who have a monster of the **same tier**\n• Trading is fair — both players agree to the swap\n• **Cash rewards stay with the original owner** — rewards don't transfer with the monster\n• Find traders in the **community chat** or search for players\n\nTrading lets you complete your **collection** faster — if you get a duplicate monster, trade it for one you're missing! 🌟`
  }

  // Chat / guild / community / add friends
  if (t.match(/chat|guild|community|friends|add user|search player|social/)) {
    return `👥 **Chat, Guilds & Community**\n\nIn the **Chat** section you can:\n\n🔍 **Search for players** by username and add them as friends\n💬 **Message friends** directly\n🏰 **Create or join a Guild** — team up with friends and build your community together\n🎉 Guild members can share tips, trade monsters, and complete **guild events** together\n\nGo to the **Chat** tab from your bottom navigation to get started!\n\nThe more active your guild, the bigger the adventure! 🌍`
  }

  // Market / crafting / shop
  if (t.match(/market|craft|crafting|shop|item|enhance|upgrade item|gem shop/)) {
    return `🛒 **The Market**\n\nIn the **Market** tab you can buy **crafting items** to enhance your monsters!\n\n**How it works:**\n• Browse crafting materials in the Market\n• Purchase items using **gems** or your **cash rewards**\n• Combine items to **craft enhancements** for your monsters\n• Enhance your monsters to boost their power and rarity\n\nCrafting adds a whole new layer to your adventure — strategise which monsters to enhance for the best rewards! ⚔️`
  }

  // Collection
  if (t.match(/collect|collection|dex|pokedex|all monster|how many monster|150/)) {
    return `🏆 **Monster Collection**\n\nThere are **150 unique monsters** to collect in HATCHME!\n\nMonsters come in **5 elements** × **3 sets** (Animal, Plant, Insect) × **5 rarities**.\n\n• You might sometimes hatch **duplicate monsters** — that's okay!\n• Trade duplicates with other players for ones you're missing\n• **Complete your Pokédex-style collection** to unlock special quest rewards\n• Completing collection quests earns you extra **egg rewards** 🥚\n\nGo to the **Collection** tab to see all 150 monsters and track your progress! 📖`
  }

  // Spending / safebox / cash lock
  if (t.match(/safebox|safe box|lock|cash lock|spending|why is my cash|unlock cash/)) {
    return `💰 **Spending & The Safebox**\n\nWhen you spend at a merchant and your egg hatches, your **cash reward goes into your Safebox** 🔒\n\n**Why is it locked?**\nIt's our way of encouraging daily monster care! Your cash unlocks **gradually every day** as you:\n\n🍖 Feed each monster **3 times per day**\n\nThe more monsters you care for, the faster your safebox unlocks.\n\n**Also earn by:**\n• Completing quests 📋\n• Spending at merchants 🏪\n\n**Minimum withdrawal: $50** — go to **Profile → Withdraw** when ready! 💵`
  }

  // Earnings / cash / withdraw / payout
  if (t.match(/earn|cash|money|payout|withdraw|withdrawal|how much|reward/)) {
    return `💵 **Earnings & Withdrawals**\n\n**How you earn:**\n🏪 Spend at merchants → **50% of purchase value** (after tax) unlocks through feeding\n📋 Complete quests → cash + gem rewards\n🍖 Feed monsters daily → unlock your safebox rewards\n🎉 Attend special events → bonus eggs + cash\n\n**Withdrawing:**\n• Minimum withdrawal: **$50**\n• Go to **Profile → Withdraw**\n• Processing: 3–5 business days\n\n**Your balance:** $${ (playerStore.user.cash || 0).toFixed(2) }\n\nKeep feeding and completing quests to grow your rewards! 🚀`
  }

  // Payment / do I need to pay
  if (t.match(/pay to play|do i pay|cost|free|subscription|pay to use|how much does it cost/)) {
    return `🎮 **HATCHME is FREE to play!**\n\nYou don't need to pay anything to use HATCHME.\n\n• No subscription fees\n• No pay-to-win\n• **We pay YOU** — earn real cash rewards just by living your life!\n\n**How?** When you shop at our partner merchants, **they fund your egg rewards**. You just scan, hatch, and collect! 🥚\n\nSpend at merchants → get eggs → hatch monsters → earn real cash. That's it! 💰`
  }

  // Achievements
  if (t.match(/achievement|badge|milestone|trophy|award/)) {
    return `🏅 **Achievements**\n\nComplete milestones to earn **exclusive badges** that show on your profile!\n\n**Examples:**\n🥚 Hatch your first egg\n🐾 Feed 100 times\n🏆 Complete your first quest\n👥 Join a guild\n💯 Collect 10 unique monsters\n\nAchievements are a record of your HATCHME journey — the more badges you collect, the more legendary your profile looks! ✨\n\nCheck your achievements in **Profile → Achievements**!`
  }

  // How to add / get more eggs
  if (t.match(/add egg|get egg|more egg|how.+egg|earn egg/)) {
    return `🥚 **How to Get More Eggs**\n\nThere are **3 ways** to earn eggs:\n\n🏪 **Shop at Merchants**\nScan their QR code after purchase — each approved spend gives you an egg!\n\n📋 **Complete Quests**\nMany quests reward bonus eggs on completion. Tap **Quests** to browse!\n\n🎉 **Attend Events**\nSpecial in-app and real-world events drop exclusive eggs — watch your notifications!\n\nHigher-tier eggs = rarer monsters, so aim to spend more at merchants for better hatches! 🌟`
  }

  // Monsters general
  if (t.match(/monster|creature|beast|animal|plant|insect|element|fire|water|earth|wind|shadow/)) {
    return `🐾 **Monsters**\n\nHATCHME has **150 unique monsters** across:\n• **3 Sets:** Animal, Plant, Insect\n• **5 Elements:** Fire, Water, Earth, Wind, Shadow\n• **5 Rarities:** Common → Legendary\n\n**Rarity is determined by the egg tier you hatch:**\n🟤 Bronze → Common · ⚪ Silver → Uncommon\n🟡 Gold → Rare · 💎 Diamond → Epic · 🌟 Mystic → Legendary\n\n**Care for your monsters by feeding them daily** to grow them, unlock rewards, and power them up!\n\nTap **Monsters** in the bottom nav to see your collection. 🐉`
  }

  // Dispute / wrong / fraud / incorrect
  if (t.match(/dispute|wrong|mistake|incorrect|fraud|scam|rejected/)) {
    return `⚠️ **Transaction Disputes**\n\nIf you believe a transaction was wrongly rejected:\n\n• **Keep your receipt** as proof of purchase\n• Email us at: **support@hatchme.com**\n• Include your **registered email** and **transaction details**\n• Our team reviews within **48 hours**\n\nWe're committed to fair outcomes for every player. Your trust matters to us! 🛡️`
  }

  // Account / login / password
  if (t.match(/account|login|password|forgot|sign in|sign up|register/)) {
    return `🔐 **Account Help**\n\nFor login or account recovery:\n\n• On the login page, tap **"Forgot password?"**\n• Or email us: **support@hatchme.com**\n• Include your registered email address\n\n**Tip:** Use the **Remember Me** checkbox on login to stay signed in, and enable the **Show/Hide password** toggle if you forget what you typed!\n\nWe'll verify your identity and get you back in quickly. 🔑`
  }

  // Level / XP
  if (t.match(/level|xp|exp|rank|level up/)) {
    return `⭐ **Levels & XP**\n\nGain XP by:\n• 🍖 Feeding your monsters daily\n• 📋 Completing quests\n• 🏪 Spending at merchants\n\n**You're currently:** Level **${playerStore.user.level || 1}** with **${playerStore.user.xp || 0} XP**\n\nLevel up to unlock bonus **cash rewards**, **gems**, and **special eggs**! Keep growing! 🚀`
  }

  // Gems
  if (t.match(/gem|crystal|diamond currency/)) {
    return `💎 **Gems**\n\n**You have:** ${(playerStore.user.gems || 0).toLocaleString()} gems\n\nEarn gems from:\n• ⭐ Levelling up\n• 📋 Completing quests\n• 🎉 Special events\n\nUse gems in the **Market** to buy crafting items and **enhance your monsters**! They're your premium in-game currency. 💫`
  }

  // Default fallback
  return `Hmm, I'm not quite sure about that one! 🤔 Let me point you in the right direction:\n\n🥚 **Eggs & hatching**\n🐾 **Monster feeding & care**\n📋 **Quests & rewards**\n💵 **Earnings & withdrawals**\n🔀 **Monster trading**\n🏰 **Guilds & community**\n🛒 **Market & crafting**\n🏆 **Collection & achievements**\n🌍 **Our story**\n\nFor anything else, reach us at:\n📧 **support@hatchme.com**\n\nWhat else can I help with? 😊`
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
  const delay = 700 + Math.random() * 800
  await new Promise(r => setTimeout(r, delay))
  isTyping.value = false
  addMsg('bot', getAIReply(text))
}

function sendQuick(q) {
  inputText.value = q
  sendMessage()
}
</script>

<style scoped>
/* ── Shell ── */
.phone-shell { display:flex; flex-direction:column; height:100vh; background:#f0f4ff; font-family:'Nunito',sans-serif; overflow:hidden; }

/* ── Header ── */
.chat-header { background:linear-gradient(135deg,#5b21b6,#2563eb); padding:0 18px 14px; flex-shrink:0; }
.status-bar  { display:flex; justify-content:space-between; padding:10px 0 0; font-size:11px; color:rgba(255,255,255,.85); font-weight:800; }
.header-row  { display:flex; align-items:center; justify-content:space-between; margin-top:10px; }
.back-btn    { width:36px; height:36px; border-radius:12px; background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.3); color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.header-center { text-align:center; flex:1; }
.bot-badge   { display:inline-flex; align-items:center; gap:5px; background:rgba(255,255,255,.15); border-radius:20px; padding:3px 10px; margin-bottom:4px; }
.bot-dot     { width:7px; height:7px; background:#4ade80; border-radius:50%; animation:pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.bot-badge span { font-size:10px; font-weight:800; color:rgba(255,255,255,.9); }
.page-title  { font-family:'Fredoka One',cursive; font-size:17px; color:#fff; line-height:1.2; }
.page-sub    { font-size:10px; font-weight:700; color:rgba(255,255,255,.65); margin-top:1px; }
.clear-btn-top { width:36px; height:36px; border-radius:12px; background:rgba(255,255,255,.15); border:none; color:#fff; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* ── User bar ── */
.user-bar   { display:flex; align-items:center; justify-content:space-between; background:#fff; border-bottom:1.5px solid #e8e0ff; padding:9px 16px; flex-shrink:0; }
.user-chip  { display:flex; align-items:center; gap:9px; }
.user-ava   { font-size:22px; }
.user-name  { font-size:12px; font-weight:800; color:#1a1f3c; }
.user-meta  { font-size:10px; font-weight:700; color:#94a3b8; }
.user-stats { display:flex; gap:6px; }
.stat-pill  { background:#f0f4ff; border:1.5px solid #ddd6fe; border-radius:20px; padding:4px 10px; font-size:10px; font-weight:800; color:#5b21b6; }

/* ── Messages ── */
.messages-area { flex:1; overflow-y:auto; padding:16px 14px 10px; display:flex; flex-direction:column; gap:14px; }

/* Welcome */
.welcome-wrap   { display:flex; flex-direction:column; align-items:center; text-align:center; padding:10px 0 6px; }
.welcome-bot    { position:relative; margin-bottom:14px; }
.bot-avatar-lg  { width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg,#7c3aed,#2563eb); display:flex; align-items:center; justify-content:center; font-size:30px; box-shadow:0 6px 24px rgba(92,33,182,.4); }
.glow-ring      { position:absolute; inset:-6px; border-radius:26px; border:2px solid rgba(124,58,237,.3); animation:ringPulse 2.5s ease-in-out infinite; }
@keyframes ringPulse { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:.2;transform:scale(1.05)} }
.welcome-title  { font-family:'Fredoka One',cursive; font-size:20px; color:#1a1f3c; }
.welcome-sub    { font-size:12px; font-weight:700; color:#64748b; margin-top:4px; margin-bottom:16px; line-height:1.6; }

.topic-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:100%; }
.topic-card  { background:#fff; border:1.5px solid #e0d7ff; border-radius:14px; padding:11px 6px; cursor:pointer; transition:all .2s; display:flex; flex-direction:column; align-items:center; gap:5px; }
.topic-card:hover { background:#ede9ff; border-color:#7c3aed; transform:scale(1.03); }
.topic-icon  { font-size:20px; }
.topic-label { font-size:10px; font-weight:800; color:#4c1d95; text-align:center; }

/* Messages */
.msg-row     { display:flex; gap:8px; align-items:flex-end; }
.msg-bot     { flex-direction:row; }
.msg-user    { flex-direction:row-reverse; }
.bot-avatar  { width:32px; height:32px; border-radius:10px; background:linear-gradient(135deg,#7c3aed,#2563eb); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; box-shadow:0 2px 8px rgba(92,33,182,.3); }
.user-avatar-sm { width:32px; height:32px; border-radius:10px; background:#e0f2fe; border:1.5px solid #bae6fd; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }

.msg-content { max-width:78%; }
.msg-sender  { font-size:10px; font-weight:800; color:#7c3aed; margin-bottom:4px; }
.msg-bubble  { padding:10px 13px; font-size:13px; font-weight:700; color:#1a1f3c; line-height:1.65; word-break:break-word; }
.bubble-bot  { background:#fff; border:1.5px solid #e0d7ff; border-radius:14px 14px 14px 4px; box-shadow:0 2px 8px rgba(0,0,0,.06); }
.bubble-user { background:linear-gradient(135deg,#5b21b6,#2563eb); color:#fff; border:none; border-radius:14px 14px 4px 14px; box-shadow:0 4px 12px rgba(92,33,182,.35); }
.bubble-user :deep(strong) { color:#fff; }
.msg-time    { font-size:10px; font-weight:700; color:#bbb; margin-top:3px; }
.time-right  { text-align:right; }

/* Typing */
.typing-bubble { display:flex; gap:5px; padding:13px 16px; background:#fff; border:1.5px solid #e0d7ff; border-radius:14px 14px 14px 4px; box-shadow:0 2px 8px rgba(0,0,0,.06); }
.typing-bubble span { width:7px; height:7px; background:#a78bfa; border-radius:50%; animation:dotBob 1.2s ease-in-out infinite; }
.typing-bubble span:nth-child(2) { animation-delay:.18s; }
.typing-bubble span:nth-child(3) { animation-delay:.36s; }
@keyframes dotBob { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }

/* Quick pills */
.quick-bar  { display:flex; gap:7px; overflow-x:auto; padding:8px 14px; background:#fff; border-top:1.5px solid #e8e0ff; scrollbar-width:none; flex-shrink:0; }
.quick-bar::-webkit-scrollbar { display:none; }
.quick-pill { background:#f5f3ff; border:1.5px solid #ddd6fe; border-radius:20px; padding:6px 13px; font-size:11px; font-weight:800; color:#5b21b6; white-space:nowrap; cursor:pointer; font-family:'Nunito',sans-serif; flex-shrink:0; transition:all .15s; }
.quick-pill:hover { background:#ede9ff; border-color:#7c3aed; }

/* Input */
.input-row   { display:flex; gap:8px; padding:10px 14px 12px; background:#fff; border-top:1.5px solid #e8e0ff; flex-shrink:0; align-items:center; }
.input-wrap  { flex:1; background:#f5f3ff; border:1.5px solid #ddd6fe; border-radius:22px; overflow:hidden; transition:border-color .2s; }
.input-wrap:focus-within { border-color:#7c3aed; }
.chat-input  { width:100%; padding:11px 16px; background:transparent; border:none; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; color:#1a1f3c; }
.chat-input::placeholder { color:#a0aec0; }
.send-btn    { width:42px; height:42px; border-radius:14px; background:linear-gradient(135deg,#5b21b6,#2563eb); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 12px rgba(92,33,182,.4); transition:transform .15s; }
.send-btn:hover:not(:disabled) { transform:scale(1.07); }
.send-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }
.send-icon   { font-size:14px; }
</style>
