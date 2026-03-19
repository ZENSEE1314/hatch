import { reactive } from 'vue'

const FRESH_QUESTS = [
  // Feed — sequential (unlock one by one)
  { id:1,  category:'Feed',    collectSet:null,   title:'Feed Masters I',      desc:'Feed your monsters 25 times',     target:25,  progress:0, enabled:true,  egg:'Bronze', cash:10,  claimable:false },
  { id:2,  category:'Feed',    collectSet:null,   title:'Feed Masters II',     desc:'Feed your monsters 100 times',    target:100, progress:0, enabled:false, egg:'Silver', cash:25,  claimable:false },
  { id:3,  category:'Feed',    collectSet:null,   title:'Feed Masters III',    desc:'Feed your monsters 500 times',    target:500, progress:0, enabled:false, egg:'Gold',   cash:50,  claimable:false },
  // Recruit — sequential
  { id:4,  category:'Recruit', collectSet:null,   title:'Recruit Friends I',   desc:'Invite 3 friends to HATCHME',     target:3,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:5,  category:'Recruit', collectSet:null,   title:'Recruit Friends II',  desc:'Invite 10 friends',               target:10,  progress:0, enabled:false, egg:'Silver', cash:15,  claimable:false },
  { id:6,  category:'Recruit', collectSet:null,   title:'Recruit Friends III', desc:'Invite 25 friends',               target:25,  progress:0, enabled:false, egg:'Gold',   cash:50,  claimable:false },
  // Spend — sequential
  { id:7,  category:'Spend',   collectSet:null,   title:'Big Spender I',       desc:'Spend S$100 at merchants',        target:100, progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:8,  category:'Spend',   collectSet:null,   title:'Big Spender II',      desc:'Spend S$500 at merchants',        target:500, progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  { id:9,  category:'Spend',   collectSet:null,   title:'Big Spender III',     desc:'Spend S$2000 at merchants',       target:2000,progress:0, enabled:false, egg:'Gold',   cash:100, claimable:false },
  // Collect Animal — sequential
  { id:10, category:'Collect', collectSet:'Animal', title:'Animal Collector I',  desc:'Collect 5 Animal monsters',    target:5,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:11, category:'Collect', collectSet:'Animal', title:'Animal Collector II', desc:'Collect 20 Animal monsters',   target:20,  progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  // Collect Plant — sequential
  { id:12, category:'Collect', collectSet:'Plant',  title:'Plant Collector I',   desc:'Collect 5 Plant monsters',     target:5,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:13, category:'Collect', collectSet:'Plant',  title:'Plant Collector II',  desc:'Collect 20 Plant monsters',    target:20,  progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  // Collect Insect — sequential
  { id:14, category:'Collect', collectSet:'Insect', title:'Insect Collector I',  desc:'Collect 5 Insect monsters',    target:5,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:15, category:'Collect', collectSet:'Insect', title:'Insect Collector II', desc:'Collect 20 Insect monsters',   target:20,  progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  // Collect All — sequential
  { id:16, category:'Collect', collectSet:'All',    title:'Monster Hoarder I',   desc:'Collect 30 monsters total',    target:30,  progress:0, enabled:true,  egg:'Silver', cash:25,  claimable:false },
  { id:17, category:'Collect', collectSet:'All',    title:'Monster Hoarder II',  desc:'Collect 75 monsters total',    target:75,  progress:0, enabled:false, egg:'Gold',   cash:75,  claimable:false },
  // Full Dex
  { id:18, category:'Collect', collectSet:'Dex',    title:'Full Dex',            desc:'Collect all 150 unique monsters', target:150, progress:0, enabled:true, egg:'Mystic', cash:500, claimable:false },
]

const FRESH_ACHIEVEMENTS = [
  { id:1, title:'First Hatch',     desc:'Hatch your first monster',          icon:'🥚', target:1,  progress:0, done:false },
  { id:2, title:'Monster Tamer',   desc:'Own 10 monsters',                   icon:'🐾', target:10, progress:0, done:false },
  { id:3, title:'Dex Hunter',      desc:'Discover 50 monsters in the dex',   icon:'📖', target:50, progress:0, done:false },
  { id:4, title:'Streak Keeper',   desc:'Reach a 7-day feeding streak',      icon:'🔥', target:7,  progress:0, done:false },
  { id:5, title:'Gold Rush',       desc:'Own a Gold-tier monster',           icon:'🥇', target:1,  progress:0, done:false },
  { id:6, title:'Rich Player',     desc:'Accumulate S$100 cash',             icon:'💵', target:100,progress:0, done:false },
  { id:7, title:'Gem Collector',   desc:'Collect 5000 gems',                 icon:'💎', target:5000,progress:0,done:false },
  { id:8, title:'Social Butterfly',desc:'Refer 5 friends',                   icon:'👥', target:5,  progress:0, done:false },
  { id:9, title:'Diamond Owner',   desc:'Own a Diamond-tier monster',        icon:'💠', target:1,  progress:0, done:false },
  { id:10,title:'Mystic Master',   desc:'Own a Mystic-tier monster',         icon:'✨', target:1,  progress:0, done:false },
]

function makeWelcomeEgg() {
  const now = Date.now()
  return {
    id: 1,
    tier: 'Bronze',
    tierColor: '#bf360c',
    tierBg: '#fff3e0',
    value: 5.00,
    progress: 0,
    merchantName: '🎁 Welcome Gift',
    createdAt: now,
    hatchAt: now + 72 * 60 * 60 * 1000,
  }
}

const FRESH_NOTIFICATIONS = [
  { id:1, icon:'🥚', title:'Welcome to HATCHME!', body:'You got a free Bronze Egg. Hatch it!', time:'Just now', read:false },
  { id:2, icon:'📋', title:'Quest unlocked', body:'Complete Feed Masters I to earn S$10', time:'Just now', read:false },
]

function getQuestTemplates() {
  const raw = localStorage.getItem('adminQuestTemplates')
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(FRESH_QUESTS))
}

function makeAccount(name, email, password, referralCode) {
  const code = 'REF-' + name.toUpperCase().replace(/\s/g,'').slice(0,4) + Math.floor(1000 + Math.random()*9000)
  return {
    user: { name, level:1, xp:0, cash:0.00, withdrawableCash:0.00, gems:100, avatar:'🐣', dob:'', phone:'', email, passwordHash: password, referralCode: referralCode || '' },
    monsters: [],
    eggs: [makeWelcomeEgg()],
    quests: getQuestTemplates(),
    achievements: JSON.parse(JSON.stringify(FRESH_ACHIEVEMENTS)),
    referCode: code,
    settings: { notifications: true, soundFx: true, darkMode: false, language: 'en', country: 'SG' },
    notifications: JSON.parse(JSON.stringify(FRESH_NOTIFICATIONS)),
    feedingData: { streak: 0, todayFeedings: 0, lastFeedingAt: 0, dateStr: '' },
  }
}

// Seed default demo accounts
function seedPresets() {
  const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  let changed = false
  if (!accounts['egghunter@hatchme.com']) {
    accounts['egghunter@hatchme.com'] = makeAccount('Egg Hunter', 'egghunter@hatchme.com', 'egg123', null)
    changed = true
  }
  if (changed) localStorage.setItem('playerAccounts', JSON.stringify(accounts))
}

export const playerStore = reactive({
  user:         { name:'', level:1, xp:0, cash:0.00, withdrawableCash:0.00, gems:0, avatar:'🐣', dob:'', phone:'', email:'', passwordHash:'', referralCode:'' },
  monsters:     [],
  eggs:         [],
  quests:       [],
  achievements: [],
  referCode:    '',
  notifications: [],
  settings:     { notifications: true, soundFx: true, darkMode: false, language: 'en', country: 'SG' },
  feedingData:  { streak: 0, todayFeedings: 0, lastFeedingAt: 0, dateStr: '' },

  register(name, email, password, referralCode) {
    const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
    const key = email.toLowerCase()
    const account = makeAccount(name, key, password, referralCode)
    accounts[key] = account
    localStorage.setItem('playerAccounts', JSON.stringify(accounts))
    localStorage.setItem('playerAuth', key)
    this._apply(account)
  },

  login(identifier, password) {
    const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
    const id = identifier.toLowerCase().trim()
    // Match by email
    let key = Object.keys(accounts).find(k => k === id)
    // Match by phone if not found
    if (!key) {
      key = Object.keys(accounts).find(k => {
        const ph = (accounts[k].user.phone || '').replace(/\s/g,'')
        return ph && ph.includes(id.replace(/\s/g,''))
      })
    }
    if (!key) return { error: 'No account found with that email or phone.' }
    const account = accounts[key]
    if (account.user.passwordHash !== password) return { error: 'Incorrect password.' }
    localStorage.setItem('playerAuth', key)
    this._apply(account)
    return { ok: true }
  },

  _apply(d) {
    this.user         = { avatar:'🐣', dob:'', phone:'', email:'', passwordHash:'', referralCode:'', withdrawableCash:0.00, ...(d.user || {}) }
    const rawMonsters = d.monsters || []
    // Migration: monsters without lastFedAt start fresh at 100% HP now
    const now = Date.now()
    rawMonsters.forEach(m => { if (!m.lastFedAt) m.lastFedAt = now })
    this.monsters     = rawMonsters
    this.eggs         = d.eggs         || []
    this.quests       = d.quests       || JSON.parse(JSON.stringify(FRESH_QUESTS))
    this.achievements = d.achievements || JSON.parse(JSON.stringify(FRESH_ACHIEVEMENTS))
    this.referCode    = d.referCode    || ''
    this.settings     = d.settings     || { notifications: true, soundFx: true, darkMode: false, language: 'en', country: 'SG' }
    this.notifications = d.notifications || JSON.parse(JSON.stringify(FRESH_NOTIFICATIONS))
    this.feedingData  = d.feedingData  || { streak: 0, todayFeedings: 0, lastFeedingAt: 0, dateStr: '' }
  },

  load() {
    const key = localStorage.getItem('playerAuth')
    if (!key) return
    const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
    const d = accounts[key]
    if (d) this._apply(d)
  },

  save() {
    const key = localStorage.getItem('playerAuth')
    if (!key) return
    const accounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
    accounts[key] = {
      user:          this.user,
      monsters:      this.monsters,
      eggs:          this.eggs,
      quests:        this.quests,
      achievements:  this.achievements,
      referCode:     this.referCode,
      settings:      this.settings,
      notifications: this.notifications,
      feedingData:   this.feedingData,
    }
    localStorage.setItem('playerAccounts', JSON.stringify(accounts))
  },

  markNotifRead(id) {
    const n = this.notifications.find(n => n.id === id)
    if (n) { n.read = true; this.save() }
  },

  markAllNotifsRead() {
    this.notifications.forEach(n => n.read = true)
    this.save()
  },

  addNotification(notif) {
    const newId = (this.notifications.length ? Math.max(...this.notifications.map(n => n.id)) : 0) + 1
    this.notifications.push({ ...notif, id: newId, read: false })
    this.save()
  },

  addEgg(egg) {
    const newId = (this.eggs.length ? Math.max(...this.eggs.map(e => e.id)) : 0) + 1
    this.eggs.push({ ...egg, id: newId })
    this.save()
  },

  addMonster(monsterDef, eggValue = 0) {
    const newId = (this.monsters.length ? Math.max(...this.monsters.map(m => m.id)) : 0) + 1
    this.monsters.push({
      id:         newId,
      dex:        monsterDef.dex,
      name:       monsterDef.name,
      set:        monsterDef.set,
      element:    monsterDef.element,
      tier:       monsterDef.tier,
      emoji:      monsterDef.emoji,
      eggValue:   +eggValue || 0,
      streak:     0,
      hp:         100,
      status:     'new',
      lastFedAt:  Date.now(), // hunger timer starts immediately on hatch
    })
    this.achievements.forEach(a => {
      if (a.id === 1) a.progress = Math.min(a.target, this.monsters.length)
      if (a.id === 2) a.progress = Math.min(a.target, this.monsters.length)
      if (a.id === 3) a.progress = Math.min(a.target, new Set(this.monsters.map(m => m.dex)).size)
      if (a.id === 5 && monsterDef.tier === 'Gold')    a.progress = 1
      if (a.id === 9 && monsterDef.tier === 'Diamond') a.progress = 1
      if (a.id === 10 && monsterDef.tier === 'Mystic') a.progress = 1
      if (a.progress >= a.target) a.done = true
    })
    const animalCount  = this.monsters.filter(m => m.set === 'Animal').length
    const plantCount   = this.monsters.filter(m => m.set === 'Plant').length
    const insectCount  = this.monsters.filter(m => m.set === 'Insect').length
    const totalCount   = this.monsters.length
    const uniqueDexCnt = new Set(this.monsters.map(m => m.dex)).size
    this.quests.forEach(q => {
      if (q.category === 'Collect' && q.enabled && !q.done) {
        if      (q.collectSet === 'Animal') q.progress = animalCount
        else if (q.collectSet === 'Plant')  q.progress = plantCount
        else if (q.collectSet === 'Insect') q.progress = insectCount
        else if (q.collectSet === 'Dex')    q.progress = uniqueDexCnt
        else                                q.progress = totalCount
        q.claimable = q.progress >= q.target
      }
    })
    this.save()
  },

  addGems(amount) {
    this.user.gems += amount
    const gemA = this.achievements.find(a => a.id === 7)
    if (gemA) { gemA.progress = Math.min(gemA.target, this.user.gems); if (gemA.progress >= gemA.target) gemA.done = true }
    this.save()
  },

  // ── Feeding system ──────────────────────────────────────────────
  checkDayRollover() {
    const sgDate = getSGDate()
    const fd = this.feedingData
    if (!fd.dateStr) { fd.dateStr = sgDate; this.save(); return }
    if (fd.dateStr === sgDate) return
    // New day in GMT+8 — process streak change
    if (fd.todayFeedings >= 3)      fd.streak = fd.streak + 1
    else if (fd.todayFeedings === 0) fd.streak = Math.max(0, fd.streak - 1)
    // 1-2 feedings: streak unchanged
    fd.todayFeedings = 0
    fd.dateStr = sgDate
    this.save()
  },

  recordFeeding(reward) {
    const fd = this.feedingData
    fd.todayFeedings = Math.min(3, (fd.todayFeedings || 0) + 1)
    fd.lastFeedingAt = Date.now()
    this.user.withdrawableCash = +((this.user.withdrawableCash || 0) + reward).toFixed(8) // keep full precision
    // Feed quest progress (+1 per feeding session counts as 1 feed per monster for quests)
    const monCount = this.monsters.length
    if (monCount > 0) {
      this.quests.forEach(q => {
        if (q.category === 'Feed' && q.enabled && !q.done) {
          q.progress = Math.min(q.target, (q.progress || 0) + monCount)
          q.claimable = q.progress >= q.target
        }
      })
    }
    // Streak achievement
    const sa = this.achievements.find(a => a.id === 4)
    if (sa) { sa.progress = Math.max(sa.progress, fd.streak); if (sa.progress >= sa.target) sa.done = true }
    this.save()
  },
})

// Returns today's date string in GMT+8 (Singapore time), e.g. '2025-03-18'
function getSGDate() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const sg  = new Date(utc + 8 * 3600000)
  return sg.toISOString().slice(0, 10)
}

// Seed preset demo accounts on startup
seedPresets()
