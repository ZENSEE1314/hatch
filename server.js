// HATCHME API Server
// Serves Vue app (dist/) + REST API backed by Neon PostgreSQL

import express from 'express'
import { neon } from '@neondatabase/serverless'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 3000

const sql  = neon(process.env.DATABASE_URL)

app.use(express.json({ limit: '10mb' }))  // 10 MB — handles base64 images; videos stripped before DB sync

// ── CORS (allow Render preview + localhost) ──────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// ════════════════════════════════════════════════════════════════
//  PLAYER API
// ════════════════════════════════════════════════════════════════

// Register player
app.post('/api/player/register', async (req, res) => {
  try {
    const { email, name, password, phone, dob, referralCode } = req.body
    if (!email || !name || !password) return res.status(400).json({ error: 'Missing required fields' })
    const e = email.toLowerCase().trim()
    const existing = await sql`SELECT email FROM players WHERE email = ${e}`
    if (existing.length) return res.status(409).json({ error: 'Email already registered. Please sign in.' })
    await sql`INSERT INTO players (email, name, password, phone, dob, referral_code) VALUES (${e}, ${name.trim()}, ${password}, ${phone||''}, ${dob||''}, ${referralCode||''})`
    res.json({ ok: true, email: e, name: name.trim() })
  } catch (err) {
    console.error('register error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Login player
app.post('/api/player/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' })
    const id = identifier.toLowerCase().trim()
    const rows = await sql`SELECT * FROM players WHERE email = ${id} OR phone ILIKE ${'%' + id + '%'}`
    if (!rows.length) return res.status(401).json({ error: 'No account found. Please register first.' })
    const player = rows[0]
    if (player.password !== password) return res.status(401).json({ error: 'Incorrect password.' })
    res.json({ ok: true, player: { email: player.email, name: player.name, phone: player.phone, dob: player.dob, referralCode: player.referral_code, data: player.data } })
  } catch (err) {
    console.error('login error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get player data
app.get('/api/player/:email', async (req, res) => {
  try {
    const e = req.params.email.toLowerCase()
    const rows = await sql`SELECT * FROM players WHERE email = ${e}`
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    const p = rows[0]
    res.json({ email: p.email, name: p.name, phone: p.phone, dob: p.dob, referralCode: p.referral_code, data: p.data, createdAt: p.created_at })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Save player game data (monsters, eggs, credits, etc.)
app.put('/api/player/:email/data', async (req, res) => {
  try {
    const e = req.params.email.toLowerCase()
    const { data } = req.body
    await sql`UPDATE players SET data = ${JSON.stringify(data)} WHERE email = ${e}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// List all players (admin)
app.get('/api/players', async (req, res) => {
  try {
    const rows = await sql`SELECT email, name, phone, dob, referral_code, data, created_at FROM players ORDER BY created_at DESC`
    res.json(rows)
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// ════════════════════════════════════════════════════════════════
//  MERCHANT API
// ════════════════════════════════════════════════════════════════

// Register merchant
app.post('/api/merchant/register', async (req, res) => {
  try {
    const { email, store, password, country, phone, referralCode } = req.body
    if (!email || !store || !password) return res.status(400).json({ error: 'Missing required fields' })
    const e = email.toLowerCase().trim()
    const existing = await sql`SELECT email FROM merchants WHERE email = ${e}`
    if (existing.length) return res.status(409).json({ error: 'Email already registered. Please sign in.' })
    await sql`INSERT INTO merchants (email, store, password, country, phone, referral_code) VALUES (${e}, ${store.trim()}, ${password}, ${country||''}, ${phone||''}, ${referralCode||''})`
    res.json({ ok: true, email: e })
  } catch (err) {
    console.error('merchant register error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Login merchant
app.post('/api/merchant/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const e = email.toLowerCase().trim()
    const rows = await sql`SELECT * FROM merchants WHERE email = ${e}`
    if (!rows.length) return res.status(401).json({ error: 'No merchant account found. Please register first.' })
    const m = rows[0]
    if (m.password !== password) return res.status(401).json({ error: 'Incorrect password.' })
    res.json({ ok: true, merchant: { email: m.email, store: m.store, country: m.country, phone: m.phone, referralCode: m.referral_code, status: m.status, data: m.data } })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Get merchant
app.get('/api/merchant/:email', async (req, res) => {
  try {
    const e = req.params.email.toLowerCase()
    const rows = await sql`SELECT * FROM merchants WHERE email = ${e}`
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    const m = rows[0]
    res.json({ email: m.email, store: m.store, country: m.country, phone: m.phone, referralCode: m.referral_code, status: m.status, data: m.data })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Save merchant data
app.put('/api/merchant/:email/data', async (req, res) => {
  try {
    const e = req.params.email.toLowerCase()
    const { data, status } = req.body
    if (status) await sql`UPDATE merchants SET status = ${status}, data = ${JSON.stringify(data||{})} WHERE email = ${e}`
    else await sql`UPDATE merchants SET data = ${JSON.stringify(data)} WHERE email = ${e}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// List all merchants (admin/egg hunter)
app.get('/api/merchants', async (req, res) => {
  try {
    const rows = await sql`SELECT email, store, country, phone, referral_code, status, data, created_at FROM merchants ORDER BY created_at DESC`
    res.json(rows)
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// ════════════════════════════════════════════════════════════════
//  EGG HUNTER API
// ════════════════════════════════════════════════════════════════

// Create egg hunter (admin only)
app.post('/api/egghunter', async (req, res) => {
  try {
    const { email, name, password, code } = req.body
    if (!email || !name || !password) return res.status(400).json({ error: 'Missing fields' })
    const e = email.toLowerCase().trim()
    await sql`INSERT INTO egg_hunters (email, name, password, code) VALUES (${e}, ${name}, ${password}, ${code||''}) ON CONFLICT (email) DO UPDATE SET name = ${name}, password = ${password}, code = ${code||''}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Login egg hunter
app.post('/api/egghunter/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const e = email.toLowerCase().trim()
    const rows = await sql`SELECT * FROM egg_hunters WHERE email = ${e}`
    if (!rows.length) return res.status(401).json({ error: 'Account not found. Ask admin for your setup link.' })
    const h = rows[0]
    if (h.password !== password) return res.status(401).json({ error: 'Incorrect password.' })
    res.json({ ok: true, hunter: { email: h.email, name: h.name, code: h.code, data: h.data } })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// List all egg hunters with password (admin — needed for setup link generation)
app.get('/api/egghunters', async (req, res) => {
  try {
    const rows = await sql`SELECT email, name, password, code, data, created_at FROM egg_hunters ORDER BY created_at DESC`
    res.json(rows)
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Delete egg hunter
app.delete('/api/egghunter/:email', async (req, res) => {
  try {
    await sql`DELETE FROM egg_hunters WHERE email = ${req.params.email.toLowerCase()}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Delete player (admin)
app.delete('/api/player/:email', async (req, res) => {
  try {
    await sql`DELETE FROM players WHERE email = ${req.params.email.toLowerCase()}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// Delete merchant (admin)
app.delete('/api/merchant/:email', async (req, res) => {
  try {
    await sql`DELETE FROM merchants WHERE email = ${req.params.email.toLowerCase()}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: 'Server error' }) }
})

// ════════════════════════════════════════════════════════════════
//  GLOBAL SETTINGS (approved ads, branding meta)
// ════════════════════════════════════════════════════════════════

// Ensure settings table exists
;(async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value JSONB NOT NULL DEFAULT '{}'::jsonb)`
  } catch (e) { console.error('settings table init error', e.message) }
})()

// Get a settings key
app.get('/api/settings/:key', async (req, res) => {
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = ${req.params.key}`
    res.json(rows.length ? rows[0].value : {})
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Save a settings key
app.put('/api/settings/:key', async (req, res) => {
  try {
    const { data } = req.body
    await sql`INSERT INTO settings (key, value) VALUES (${req.params.key}, ${JSON.stringify(data)})
              ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(data)}`
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── Serve Vue app (production) ───────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`HATCHME server running on port ${PORT}`))
