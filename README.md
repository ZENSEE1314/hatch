# HATCHME — Vue 3 Starter Project

Real Life RPG App — Player · Merchant · Admin

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## Project Structure

```
hatchme-vue/
├── src/
│   ├── main.js                    # App entry point
│   ├── App.vue                    # Root component
│   ├── router/
│   │   └── index.js               # All routes (player / merchant / admin)
│   ├── assets/
│   │   └── global.css             # Full design system (colours, buttons, forms, badges)
│   ├── data/
│   │   └── gameData.js            # Shared game data, constants & utility functions
│   └── views/
│       ├── player/
│       │   ├── PlayerHome.vue     ✅ Full screen built
│       │   ├── PlayerMonsters.vue  🔧 Stub — ready to build
│       │   ├── PlayerFeeding.vue   🔧 Stub — ready to build
│       │   ├── PlayerQRScan.vue    🔧 Stub — ready to build
│       │   ├── PlayerHatching.vue  🔧 Stub — ready to build
│       │   ├── PlayerTrade.vue     🔧 Stub — ready to build
│       │   ├── PlayerProfile.vue   🔧 Stub — ready to build
│       │   └── PlayerWithdraw.vue  🔧 Stub — ready to build
│       ├── merchant/
│       │   ├── MerchantWelcome.vue   ✅ Full screen built
│       │   ├── MerchantOnboard.vue   🔧 Stub — ready to build
│       │   ├── MerchantPending.vue   🔧 Stub — ready to build
│       │   └── MerchantDashboard.vue 🔧 Stub — ready to build
│       └── admin/
│           └── AdminPortal.vue       🔧 Stub (see admin-portal.html for full version)
```

---

## Routes

| URL | Screen |
|-----|--------|
| `/` | → `/player/home` |
| `/player/home` | Player home dashboard |
| `/player/monsters` | Monster collection |
| `/player/feeding` | Monster feeding + ads |
| `/player/scan` | QR scan & payment |
| `/player/hatching` | Egg hatching |
| `/player/trade` | Trade & chat |
| `/player/profile` | Profile & settings |
| `/player/withdraw` | Withdraw cash |
| `/merchant/welcome` | Merchant landing |
| `/merchant/onboard` | Register store |
| `/merchant/pending` | Under review |
| `/merchant/dashboard` | Merchant dashboard |
| `/admin` | Admin portal |

---

## Design System

All CSS variables, buttons, badges, forms, modals and animations are in:
`src/assets/global.css`

### Key CSS Variables
```css
--purple: #7c4dff       /* Primary brand */
--teal:   #00897b       /* Merchant brand */
--green:  #2e7d32       /* Success */
--orange: #e65100       /* Warning / CTA */
--red:    #c62828       /* Danger */
--blue:   #1565c0       /* Info */
```

### Reusable Classes
- `.btn .btn-primary .btn-teal .btn-green .btn-orange .btn-red .btn-blue .btn-gray`
- `.btn-sm .btn-lg .btn-full`
- `.badge .badge-green .badge-orange .badge-red .badge-blue .badge-purple .badge-teal`
- `.badge-bronze .badge-silver .badge-gold .badge-diamond .badge-mystic`
- `.badge-fire .badge-water .badge-earth .badge-wind .badge-shadow`
- `.card .modal-overlay .modal-box .toggle .grid-2 .grid-3 .grid-4`
- `.phone-shell .bottom-nav .scan-fab`

---

## Game Data & Utilities

`src/data/gameData.js` exports:
- `EGG_TIERS` — Bronze/Silver/Gold/Diamond/Mystic with %, gem fees, colours
- `STREAK_TIERS` — Standard/Bronze/Silver/Gold with earn rates
- `ELEMENTS` — Fire/Water/Earth/Wind/Shadow with icons & badge classes
- `COUNTRIES` — Tax rates, currencies, dial codes auto-set by country
- `SAMPLE_MONSTERS` / `SAMPLE_QUESTS` / `SAMPLE_MERCHANTS` — Dev data
- `HUNTER_CODES` — Valid referral codes for merchant onboarding
- `calcEggValue(amount, tax, tier, fxRate)` — Egg value calculator
- `calcEarnPerFeed(streakDays, eggValue)` — Earn per feeding calculator
- `getStreakTier(days)` — Returns streak tier for a given day count
- `fmtSGD(value)` — Formats to "S$XX.XX"

---

## Tech Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vue Router 4** (HTML5 history mode)
- **Vite 5** (dev server + build)
- **Fonts**: Fredoka One + Nunito (Google Fonts)

---

## Next Steps
1. Replace stub views with full components from the widget prototypes
2. Add **Pinia** for global state (user, monsters, credits, quests)
3. Connect to your backend API (replace `src/data/gameData.js` calls)
4. Add push notifications for merchant scan approvals
5. Integrate Google AdMob for feeding ad rewards
