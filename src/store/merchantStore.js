import { reactive } from 'vue'

const CURRENCY_MAP = {
  SG:'SGD', MY:'MYR', ID:'IDR', TH:'THB', PH:'PHP',
  AU:'AUD', US:'USD', GB:'GBP', EU:'EUR', CN:'CNY',
  JP:'JPY', HK:'HKD', IN:'INR', KR:'KRW', VN:'VND',
}

function genMerchantCode(storeName) {
  const prefix = (storeName || 'MER').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4).padEnd(3, 'X')
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6)
  return prefix + '-' + rand
}

function seedMerchantPreset() {
  const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
  if (!accounts['merchant@hatchme.com']) {
    accounts['merchant@hatchme.com'] = {
      info: {
        name: 'HATCHME Demo Store',
        country: 'SG',
        currency: 'SGD',
        phone: '+6591234567',
        tier: 'Silver',
        logo: '',
        description: 'Your friendly neighbourhood demo store.',
        eggTier: 'Bronze',
        merchantCode: 'HATC-DEMO',
      },
      referralCode:       '',
      assignedEggHunter:  '',
      credits:            500,
      scans:              [],
      topupHistory:       [],
      ads:                [],
      status:             'approved',
      passwordHash:       'merchant123',
    }
    localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
  }
}

export const merchantStore = reactive({
  info:               null,
  credits:            0,
  scans:              [],
  topupHistory:       [],
  ads:                [],
  status:             'pending',
  referralCode:       '',
  assignedEggHunter:  '',

  register(storeName, country, phone, email, password, referralCode = '') {
    const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
    const key = email.toLowerCase().trim()

    let assignedEggHunter = ''
    if (referralCode.trim()) {
      const players = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
      const match = Object.entries(players).find(([, d]) =>
        (d.referCode || '').toUpperCase() === referralCode.trim().toUpperCase()
      )
      if (match) assignedEggHunter = match[0]
    }

    const currency = CURRENCY_MAP[country] || 'SGD'
    const account = {
      info: {
        name: storeName,
        country,
        currency,
        phone,
        tier: 'Bronze',
        logo: '',
        description: '',
        eggTier: 'Bronze',
        merchantCode: genMerchantCode(storeName),
      },
      referralCode:      referralCode.trim().toUpperCase(),
      assignedEggHunter,
      credits:           0,
      scans:             [],
      topupHistory:      [],
      ads:               [],
      status:            'pending',
      passwordHash:      password,
    }
    accounts[key] = account
    localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
    localStorage.setItem('merchantAuth', key)
    this._apply(account)
  },

  login(email, password) {
    const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
    const key = email.toLowerCase().trim()
    if (!accounts[key]) return { error: 'No merchant account found with that email.' }
    if (accounts[key].passwordHash !== password) return { error: 'Incorrect password.' }
    localStorage.setItem('merchantAuth', key)
    this._apply(accounts[key])
    return { ok: true }
  },

  load() {
    const key = localStorage.getItem('merchantAuth')
    if (!key) return
    const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
    const d = accounts[key]
    if (d) this._apply(d)
  },

  save() {
    const key = localStorage.getItem('merchantAuth')
    if (!key) return
    const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
    accounts[key] = {
      info:              this.info,
      referralCode:      this.referralCode,
      assignedEggHunter: this.assignedEggHunter,
      credits:           this.credits,
      scans:             this.scans,
      topupHistory:      this.topupHistory,
      ads:               this.ads,
      status:            this.status,
      passwordHash:      (accounts[key] || {}).passwordHash || '',
    }
    localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
  },

  topup(credits, amountSGD) {
    this.credits += credits
    this.topupHistory.unshift({
      id:       Date.now(),
      credits,
      amountSGD,
      date:     new Date().toLocaleString(),
    })
    this.save()
  },

  _apply(d) {
    this.info              = { logo:'', description:'', eggTier:'Bronze', merchantCode:'', ...d.info }
    this.credits           = d.credits  || 0
    this.scans             = d.scans    || []
    this.topupHistory      = d.topupHistory || []
    this.ads               = d.ads      || []
    this.status            = d.status   || 'pending'
    this.referralCode      = d.referralCode      || ''
    this.assignedEggHunter = d.assignedEggHunter || ''
  },
})

seedMerchantPreset()
