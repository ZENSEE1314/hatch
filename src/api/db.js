// HATCHME Database API client
// Replaces localStorage for accounts — game state still uses localStorage as cache

const BASE = import.meta.env.PROD
  ? ''                    // same origin in production (Express serves both)
  : 'http://localhost:3000' // dev: point to local server

async function post(path, body) {
  const r = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return r.json()
}
async function get(path) {
  const r = await fetch(BASE + path)
  return r.json()
}
async function put(path, body) {
  const r = await fetch(BASE + path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return r.json()
}
async function del(path) {
  const r = await fetch(BASE + path, { method: 'DELETE' })
  return r.json()
}

// ── PLAYERS ─────────────────────────────────────────────────────────────────
export const PlayerDB = {
  register: (data) => post('/api/player/register', data),
  login:    (data) => post('/api/player/login',    data),
  get:      (email) => get(`/api/player/${encodeURIComponent(email)}`),
  saveData: (email, data) => put(`/api/player/${encodeURIComponent(email)}/data`, { data }),
  list:     () => get('/api/players'),
}

// ── MERCHANTS ────────────────────────────────────────────────────────────────
export const MerchantDB = {
  register: (data) => post('/api/merchant/register', data),
  login:    (data) => post('/api/merchant/login',    data),
  get:      (email) => get(`/api/merchant/${encodeURIComponent(email)}`),
  saveData: (email, data, status) => put(`/api/merchant/${encodeURIComponent(email)}/data`, { data, status }),
  list:     () => get('/api/merchants'),
}

// ── EGG HUNTERS ──────────────────────────────────────────────────────────────
export const HunterDB = {
  create: (data) => post('/api/egghunter', data),
  login:  (data) => post('/api/egghunter/login', data),
  list:   () => get('/api/egghunters'),
  delete: (email) => del(`/api/egghunter/${encodeURIComponent(email)}`),
}
