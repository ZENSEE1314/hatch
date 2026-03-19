// ══ HATCHME SHARED GAME DATA ══
// Use this as your central data source.
// In production, replace with Pinia store + API calls.

// ── EGG TIERS ──
export const EGG_TIERS = {
  Bronze:  { pct: 20, gemFee: 50,    color: '#bf360c', bg: '#fff3e0' },
  Silver:  { pct: 25, gemFee: 100,   color: '#546e7a', bg: '#eceff1' },
  Gold:    { pct: 30, gemFee: 200,   color: '#f57f17', bg: '#fff8e1' },
  Diamond: { pct: 35, gemFee: 500,   color: '#0288d1', bg: '#e3f2fd' },
  Mystic:  { pct: 40, gemFee: 1000,  color: '#7b1fa2', bg: '#f3e5f5' },
}

// ── STREAK TIERS ──
export const STREAK_TIERS = [
  { name: 'Standard', min: 0,  max: 7,  rate: 0.01, color: '#b39dff' },
  { name: 'Bronze',   min: 8,  max: 14, rate: 0.02, color: '#bf360c' },
  { name: 'Silver',   min: 15, max: 21, rate: 0.03, color: '#546e7a' },
  { name: 'Gold',     min: 22, max: 999,rate: 0.035,color: '#f57f17' },
]

// ── ELEMENTS ──
export const ELEMENTS = {
  Fire:   { icon: '🔥', class: 'badge-fire' },
  Water:  { icon: '💧', class: 'badge-water' },
  Earth:  { icon: '🌿', class: 'badge-earth' },
  Wind:   { icon: '💨', class: 'badge-wind' },
  Shadow: { icon: '🌑', class: 'badge-shadow' },
}

// ── MONSTER SETS ──
export const MONSTER_SETS = ['Animal', 'Plant', 'Insect']

// ── COUNTRIES WITH AUTO TAX + CURRENCY ──
export const COUNTRIES = {
  SG: { name: 'Singapore',   flag: '🇸🇬', tax: 9,  taxName: 'GST',          currency: 'SGD', symbol: 'S$',  dial: '+65', fx: 1.00 },
  MY: { name: 'Malaysia',    flag: '🇲🇾', tax: 6,  taxName: 'SST',          currency: 'MYR', symbol: 'RM',  dial: '+60', fx: 0.295 },
  JP: { name: 'Japan',       flag: '🇯🇵', tax: 10, taxName: 'Consumption',  currency: 'JPY', symbol: '¥',   dial: '+81', fx: 0.0089 },
  ID: { name: 'Indonesia',   flag: '🇮🇩', tax: 11, taxName: 'PPN',          currency: 'IDR', symbol: 'Rp',  dial: '+62', fx: 0.000085 },
  TH: { name: 'Thailand',    flag: '🇹🇭', tax: 7,  taxName: 'VAT',          currency: 'THB', symbol: '฿',   dial: '+66', fx: 0.037 },
  PH: { name: 'Philippines', flag: '🇵🇭', tax: 12, taxName: 'VAT',          currency: 'PHP', symbol: '₱',   dial: '+63', fx: 0.023 },
  US: { name: 'USA',         flag: '🇺🇸', tax: 8,  taxName: 'Sales Tax',    currency: 'USD', symbol: '$',   dial: '+1',  fx: 1.34 },
  GB: { name: 'UK',          flag: '🇬🇧', tax: 20, taxName: 'VAT',          currency: 'GBP', symbol: '£',   dial: '+44', fx: 1.69 },
  AU: { name: 'Australia',   flag: '🇦🇺', tax: 10, taxName: 'GST',          currency: 'AUD', symbol: 'A$',  dial: '+61', fx: 0.87 },
}

// ── SAMPLE MONSTERS ──
export const SAMPLE_MONSTERS = [
  { id: 1,  dex: '#001', name: 'Flamox',   set: 'Animal', tier: 'Bronze',  element: 'Fire',   streak: 9,  hp: 90, status: 'fed' },
  { id: 2,  dex: '#002', name: 'Crystalix',set: 'Insect', tier: 'Silver',  element: 'Water',  streak: 16, hp: 28, status: 'hungry' },
  { id: 3,  dex: '#003', name: 'Aurathorn',set: 'Animal', tier: 'Gold',    element: 'Wind',   streak: 0,  hp: 100,status: 'new' },
  { id: 4,  dex: '#004', name: 'Duskwing', set: 'Insect', tier: 'Silver',  element: 'Shadow', streak: 22, hp: 80, status: 'fed' },
  { id: 5,  dex: '#005', name: 'Thornveil',set: 'Plant',  tier: 'Bronze',  element: 'Earth',  streak: 8,  hp: 88, status: 'fed' },
  { id: 6,  dex: '#006', name: 'Nebulite', set: 'Insect', tier: 'Bronze',  element: 'Wind',   streak: 3,  hp: 65, status: 'fed' },
]

// ── SAMPLE QUESTS ──
export const SAMPLE_QUESTS = {
  Feed: [
    { id: 1, title: 'Feed Masters I',   desc: 'Feed 25 times',    target: 25,  progress: 25, rank: 1, enabled: true,  egg: 'Bronze',  cash: 10, claimable: true },
    { id: 2, title: 'Feed Masters II',  desc: 'Feed 100 times',   target: 100, progress: 72, rank: 2, enabled: true,  egg: 'Silver',  cash: 25, claimable: false },
    { id: 3, title: 'Feed Masters III', desc: 'Feed 500 times',   target: 500, progress: 72, rank: 3, enabled: false, egg: 'Gold',    cash: 50, claimable: false },
  ],
  Recruit: [
    { id: 4, title: 'Recruit Friends I',  desc: 'Invite 3 friends', target: 3, progress: 3, rank: 1, enabled: true, egg: 'Bronze', cash: 5,  claimable: true },
    { id: 5, title: 'Recruit Friends II', desc: 'Invite 5 friends', target: 5, progress: 3, rank: 2, enabled: true, egg: 'Bronze', cash: 10, claimable: false },
  ],
  Spend: [
    { id: 6, title: 'Big Spender I',  desc: 'Spend $100 SGD', target: 100, progress: 100, rank: 1, enabled: true, egg: 'Bronze', cash: 5,  claimable: false },
    { id: 7, title: 'Big Spender II', desc: 'Spend $500 SGD', target: 500, progress: 240, rank: 2, enabled: true, egg: 'Silver', cash: 20, claimable: false },
  ],
  Collect: [
    { id: 8, title: 'Animal Collector I', desc: 'Collect 10 Animals', target: 10, progress: 5,  rank: 1, enabled: true, egg: 'Bronze', cash: 10, mset: 'Animal', claimable: false },
    { id: 9, title: 'All Collector I',    desc: 'Collect 30 monsters', target: 30, progress: 13, rank: 2, enabled: true, egg: 'Silver', cash: 25, mset: 'All',    claimable: false },
  ],
}

// ── SAMPLE MERCHANTS ──
export const SAMPLE_MERCHANTS = [
  { id: 1, name: 'NestMart SG',   country: 'SG', tier: 'Bronze',  tax: 9,  currency: 'SGD', credits: 850,  status: 'active',  scans: 47 },
  { id: 2, name: 'Sakura Cafe',   country: 'JP', tier: 'Silver',  tax: 10, currency: 'JPY', credits: 320,  status: 'active',  scans: 22 },
  { id: 3, name: 'FoodHaven MY',  country: 'MY', tier: 'Gold',    tax: 6,  currency: 'MYR', credits: 1240, status: 'active',  scans: 89 },
  { id: 4, name: 'DragonBooks SG',country: 'SG', tier: 'Bronze',  tax: 9,  currency: 'SGD', credits: 0,    status: 'pending', scans: 0  },
  { id: 5, name: 'TechZone US',   country: 'US', tier: 'Diamond', tax: 8,  currency: 'USD', credits: 500,  status: 'pending', scans: 0  },
]

// ── HUNTER CODES (for onboarding validation) ──
export const HUNTER_CODES = {
  'HUNTER_ABC123': { name: 'DragonHunter_SG', level: 12, merchants: 8 },
  'HUNTER_XYZ456': { name: 'EggMaster_MY',    level: 9,  merchants: 5 },
  'DEMO123':        { name: 'TestHunter',      level: 3,  merchants: 2 },
}

// ── WITHDRAW PRESETS ──
export const WITHDRAW_PRESETS = [50, 100, 200, 500, 1000]
export const WITHDRAW_FEE_PCT = 2
export const WITHDRAW_MIN     = 50

// ── UTILITY FUNCTIONS ──

/**
 * Calculate earn per feeding
 * @param {number} streakDays
 * @param {number} eggValue  original SGD value
 * @returns {number} SGD earned per feeding
 */
export function calcEarnPerFeed(streakDays, eggValue) {
  const tier = STREAK_TIERS.findLast(t => streakDays >= t.min) || STREAK_TIERS[0]
  return +(tier.rate / 100 * eggValue / 3).toFixed(4)
}

/**
 * Get streak tier info for a given day count
 */
export function getStreakTier(days) {
  return STREAK_TIERS.findLast(t => days >= t.min) || STREAK_TIERS[0]
}

/**
 * Calculate egg value from a scan
 * @param {number} amountPaid  in local currency
 * @param {number} taxPct
 * @param {string} eggTier
 * @param {number} fxRate  local → SGD
 */
export function calcEggValue(amountPaid, taxPct, eggTier, fxRate = 1) {
  const taxAmount  = amountPaid * (taxPct / 100)
  const netLocal   = amountPaid - taxAmount
  const netSGD     = netLocal * fxRate
  const eggValue   = netSGD * (EGG_TIERS[eggTier]?.pct / 100 || 0.2)
  return { taxAmount, netLocal, netSGD: +netSGD.toFixed(2), eggValue: +eggValue.toFixed(2) }
}

/**
 * Format SGD amount
 */
export function fmtSGD(val) {
  return 'S$' + Number(val).toFixed(2)
}
