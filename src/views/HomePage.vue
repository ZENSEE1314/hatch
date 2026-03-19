<template>
  <div class="world">

    <!-- FLOATING PARTICLES -->
    <div class="particles">
      <div v-for="p in particles" :key="p.id" class="particle" :style="p.style">{{ p.icon }}</div>
    </div>

    <!-- ══════════ HERO ══════════ -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="stars"></div>

      <div class="hero-content">
        <div class="crown-badge">👑 Real Life RPG</div>
        <div class="hero-logo">
          <span class="logo-h">H</span><span class="logo-a">A</span><span class="logo-t">T</span><span class="logo-c">C</span><span class="logo-h2">H</span><span class="logo-me">ME</span>
        </div>
        <div class="hero-tagline">Collect Eggs. Hatch Monsters.<br>Earn Real Money.</div>
        <div class="hero-sub">The world's first gamified loyalty app where your pets earn you withdrawable cash.</div>

        <div class="hero-eggs">
          <div class="egg-float" style="animation-delay:0s">🥚</div>
          <div class="egg-float" style="animation-delay:0.3s;font-size:48px">🥚</div>
          <div class="egg-float" style="animation-delay:0.6s">🥚</div>
          <div class="egg-float gold" style="animation-delay:0.9s;font-size:52px">🥚</div>
          <div class="egg-float" style="animation-delay:1.2s">🥚</div>
        </div>

        <div class="hero-btns">
          <button class="btn-adventure" @click="$router.push('/player/login')">
            ⚔️ Begin Adventure
          </button>
          <button class="btn-portal" @click="showPortals = !showPortals">
            🚪 Other Portals
          </button>
        </div>

        <div v-if="showPortals" class="portal-grid">
          <div class="portal-card" @click="$router.push('/merchant/login')">
            <div class="portal-icon">🏪</div>
            <div class="portal-name">Merchant Portal</div>
          </div>
          <div class="portal-card" @click="$router.push('/egghunter/login')">
            <div class="portal-icon">🥚</div>
            <div class="portal-name">Sales Team</div>
          </div>
          <div class="portal-card" @click="$router.push('/admin/login')">
            <div class="portal-icon">🛡</div>
            <div class="portal-name">Admin Portal</div>
          </div>
        </div>

        <div class="scroll-hint">
          <div class="scroll-arrow">▼</div>
          <div>Discover the World</div>
        </div>
      </div>
    </section>

    <!-- ══════════ HOW IT WORKS ══════════ -->
    <section class="section quest-section">
      <div class="section-header">
        <div class="section-badge">📜 The Quest</div>
        <div class="section-title">How HATCHME Works</div>
        <div class="section-sub">Four epic steps to real earnings</div>
      </div>

      <div class="quest-steps">
        <div class="quest-step" v-for="(step, i) in steps" :key="i">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-icon">{{ step.icon }}</div>
          <div class="step-name">{{ step.name }}</div>
          <div class="step-desc">{{ step.desc }}</div>
          <div v-if="i < steps.length - 1" class="step-arrow">→</div>
        </div>
      </div>
    </section>

    <!-- ══════════ EGG WORLD ══════════ -->
    <section class="section egg-section">
      <div class="egg-world-bg"></div>
      <div class="section-header light">
        <div class="section-badge">🥚 The Egg World</div>
        <div class="section-title white">Collect Eggs from Merchants</div>
        <div class="section-sub light">Scan QR codes at partner stores to collect eggs</div>
      </div>

      <div class="egg-tiers">
        <div v-for="tier in eggTiers" :key="tier.name" class="egg-tier-card" :style="{ borderColor: tier.color, background: tier.bg }">
          <div class="tier-glow" :style="{ boxShadow: '0 0 30px ' + tier.color + '60' }"></div>
          <div class="tier-egg">{{ tier.emoji }}</div>
          <div class="tier-name" :style="{ color: tier.color }">{{ tier.name }}</div>
          <div class="tier-value">S${{ tier.value }}</div>
          <div class="tier-label">Egg Value</div>
          <div class="tier-perks">
            <div v-for="p in tier.perks" :key="p" class="tier-perk">✦ {{ p }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ MONSTER WORLD ══════════ -->
    <section class="section monster-section">
      <div class="section-header">
        <div class="section-badge">🐾 Monster Kingdom</div>
        <div class="section-title">Hatch & Raise Monsters</div>
        <div class="section-sub">150 unique monsters across 3 kingdoms and 5 elements</div>
      </div>

      <div class="kingdoms">
        <div v-for="k in kingdoms" :key="k.name" class="kingdom-card" :style="{ background: k.bg, borderColor: k.color }">
          <div class="kingdom-icon">{{ k.icon }}</div>
          <div class="kingdom-name">{{ k.name }}</div>
          <div class="kingdom-count">{{ k.count }} species</div>
          <div class="kingdom-desc">{{ k.desc }}</div>
        </div>
      </div>

      <div class="elements-row">
        <div v-for="el in elements" :key="el.name" class="element-chip" :style="{ background: el.bg, color: el.color, borderColor: el.color }">
          {{ el.icon }} {{ el.name }}
        </div>
      </div>

      <div class="monster-feature-grid">
        <div v-for="f in monsterFeatures" :key="f.title" class="monster-feat">
          <div class="mf-icon">{{ f.icon }}</div>
          <div class="mf-title">{{ f.title }}</div>
          <div class="mf-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ══════════ EARN SYSTEM ══════════ -->
    <section class="section earn-section">
      <div class="earn-bg"></div>
      <div class="section-header light">
        <div class="section-badge">💰 The Treasury</div>
        <div class="section-title white">Real Money Earnings</div>
        <div class="section-sub light">Your monsters generate real withdrawable cash</div>
      </div>

      <div class="earn-flow">
        <div class="earn-step">
          <div class="es-icon">📺</div>
          <div class="es-title">Watch Ads</div>
          <div class="es-desc">Watch a short ad to feed your monster</div>
        </div>
        <div class="earn-arrow">→</div>
        <div class="earn-step highlight">
          <div class="es-icon">🍖</div>
          <div class="es-title">Feed Monster</div>
          <div class="es-desc">3× daily per monster, every 3 hours</div>
        </div>
        <div class="earn-arrow">→</div>
        <div class="earn-step">
          <div class="es-icon">💸</div>
          <div class="es-title">Earn Cash</div>
          <div class="es-desc">% of egg value deposited instantly</div>
        </div>
      </div>

      <div class="streak-showcase">
        <div class="ss-title">🏆 Streak Rewards</div>
        <div class="ss-sub">Feed consistently to unlock higher rates</div>
        <div class="streak-tiers">
          <div v-for="st in streakTiers" :key="st.name" class="streak-tier" :style="{ borderColor: st.color }">
            <div class="st-icon">{{ st.icon }}</div>
            <div class="st-info">
              <div class="st-name" :style="{ color: st.color }">{{ st.name }}</div>
              <div class="st-feeds">{{ st.feeds }}</div>
            </div>
            <div class="st-rate" :style="{ color: st.color }">{{ st.rate }}</div>
          </div>
        </div>
      </div>

      <div class="earn-example">
        <div class="ee-title">💡 Example Earnings</div>
        <div class="ee-cards">
          <div class="ee-card">
            <div class="ee-egg">🥉 Bronze Egg</div>
            <div class="ee-val">S$5</div>
            <div class="ee-calc">S$5 × 0.035% × 3 feeds = <strong>S$0.00525/day</strong></div>
          </div>
          <div class="ee-card gold">
            <div class="ee-egg">💎 Diamond Egg</div>
            <div class="ee-val">S$100</div>
            <div class="ee-calc">S$100 × 0.035% × 3 feeds = <strong>S$0.105/day</strong></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ FEATURES ══════════ -->
    <section class="section features-section">
      <div class="section-header">
        <div class="section-badge">⚔️ Adventure Features</div>
        <div class="section-title">Everything in Your World</div>
      </div>

      <div class="features-grid">
        <div v-for="f in features" :key="f.title" class="feat-card" :style="{ borderColor: f.color, '--feat-color': f.color }">
          <div class="feat-icon" :style="{ background: f.bg }">{{ f.icon }}</div>
          <div class="feat-title">{{ f.title }}</div>
          <div class="feat-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ══════════ WHO IS IT FOR ══════════ -->
    <section class="section roles-section">
      <div class="roles-bg"></div>
      <div class="section-header light">
        <div class="section-badge">🌍 The World</div>
        <div class="section-title white">Choose Your Role</div>
      </div>

      <div class="roles-grid">
        <div v-for="r in roles" :key="r.name" class="role-card">
          <div class="role-icon">{{ r.icon }}</div>
          <div class="role-name">{{ r.name }}</div>
          <div class="role-desc">{{ r.desc }}</div>
          <ul class="role-perks">
            <li v-for="p in r.perks" :key="p">{{ p }}</li>
          </ul>
          <button class="role-btn" :style="{ background: r.color }" @click="$router.push(r.route)">
            {{ r.cta }}
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════ FOOTER CTA ══════════ -->
    <section class="footer-cta">
      <div class="fc-stars"></div>
      <div class="fc-content">
        <div class="fc-title">Ready to Start Your Adventure?</div>
        <div class="fc-sub">Join thousands of adventurers collecting eggs and earning real money</div>
        <button class="btn-adventure large" @click="$router.push('/player/login')">
          ⚔️ Start Free — Begin Adventure
        </button>
        <div class="fc-note">No investment needed · Free to play · Real withdrawable earnings</div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showPortals = ref(false)

const particles = ref([])
onMounted(() => {
  const icons = ['🥚','⭐','🐾','💰','🔥','✨','🌟','💎']
  particles.value = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    icon: icons[i % icons.length],
    style: {
      left:             Math.random() * 100 + 'vw',
      top:              Math.random() * 100 + 'vh',
      fontSize:         (Math.random() * 16 + 10) + 'px',
      animationDuration:(Math.random() * 10 + 8) + 's',
      animationDelay:   (Math.random() * 5) + 's',
      opacity:          Math.random() * 0.3 + 0.05,
    }
  }))
})

const steps = [
  { icon: '🏪', name: 'Visit Merchant', desc: 'Shop at a HATCHME partner store and scan the QR code' },
  { icon: '🥚', name: 'Collect Egg',    desc: 'Receive a real egg NFT worth S$5 to S$200' },
  { icon: '🐣', name: 'Hatch Monster',  desc: 'Wait for your egg to hatch into a unique monster companion' },
  { icon: '💰', name: 'Earn Cash',      desc: 'Feed your monster 3× daily to earn real withdrawable money' },
]

const eggTiers = [
  { name:'Bronze',  emoji:'🥚', value:'5',   color:'#bf6830', bg:'#fff8f0',
    perks:['Common drops','Standard monsters','Entry level earning'] },
  { name:'Silver',  emoji:'🥚', value:'20',  color:'#607d8b', bg:'#f0f4f7',
    perks:['Uncommon drops','Rare element chance','2× earning potential'] },
  { name:'Gold',    emoji:'🥚', value:'50',  color:'#f9a825', bg:'#fffde7',
    perks:['Rare drops','Higher monster stats','4× earning potential'] },
  { name:'Diamond', emoji:'💎', value:'100', color:'#0097a7', bg:'#e0f7fa',
    perks:['Epic drops','Legendary monsters','8× earning potential'] },
  { name:'Mystic',  emoji:'🌟', value:'200', color:'#7b1fa2', bg:'#f3e5f5',
    perks:['Mythic drops','Exclusive monsters','Max earning potential'] },
]

const kingdoms = [
  { icon:'🦊', name:'Animal Kingdom', count:50, color:'#e65100', bg:'linear-gradient(135deg,#fff3e0,#ffe0b2)', desc:'Mighty beasts of the wild — Fox, Dragon, Tiger, Bear and more' },
  { icon:'🌿', name:'Plant Kingdom',  count:50, color:'#2e7d32', bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', desc:'Ancient flora spirits — Sunflower, Mushroom, Rose, Cactus and more' },
  { icon:'🦋', name:'Insect Kingdom', count:50, color:'#6a1b9a', bg:'linear-gradient(135deg,#f3e5f5,#e1bee7)', desc:'Mystical tiny warriors — Butterfly, Beetle, Firefly, Dragon and more' },
]

const elements = [
  { icon:'🔥', name:'Fire',   color:'#e53935', bg:'#ffebee' },
  { icon:'💧', name:'Water',  color:'#1e88e5', bg:'#e3f2fd' },
  { icon:'🌱', name:'Earth',  color:'#43a047', bg:'#e8f5e9' },
  { icon:'💨', name:'Wind',   color:'#00acc1', bg:'#e0f7fa' },
  { icon:'🌑', name:'Shadow', color:'#5e35b1', bg:'#ede7f6' },
]

const monsterFeatures = [
  { icon:'😤', title:'Hunger System',  desc:'Monsters get hungry every 3 hours — keep them fed to maximize earnings' },
  { icon:'🔥', title:'Streak Bonus',   desc:'Feed consistently to build streaks and unlock higher earning rates' },
  { icon:'📊', title:'Dex Collection', desc:'Discover and collect all 150 unique monsters in your Pokédex-style dex' },
  { icon:'🎯', title:'Quests & Goals', desc:'Complete daily quests to earn bonus rewards and level up faster' },
]

const streakTiers = [
  { icon:'⭐', name:'Standard', feeds:'1–7 feedings',   rate:'0.01%/feed', color:'#9e9e9e' },
  { icon:'🥉', name:'Bronze',   feeds:'8–14 feedings',  rate:'0.02%/feed', color:'#bf6830' },
  { icon:'🥈', name:'Silver',   feeds:'15–21 feedings', rate:'0.03%/feed', color:'#607d8b' },
  { icon:'🥇', name:'Gold',     feeds:'22+ feedings',   rate:'0.035%/feed',color:'#f9a825' },
]

const features = [
  { icon:'🗺',  title:'World Map',       desc:'Explore the HATCHME universe and discover merchant locations near you', color:'#e65100', bg:'#fff3e0' },
  { icon:'🤝',  title:'Trading Post',    desc:'Trade monsters and eggs with other adventurers in the marketplace', color:'#1565c0', bg:'#e3f2fd' },
  { icon:'📋',  title:'Quest Board',     desc:'Daily and weekly quests with bonus cash and gem rewards', color:'#6a1b9a', bg:'#f3e5f5' },
  { icon:'🏆',  title:'Achievements',    desc:'Unlock titles and badges as you grow your monster collection', color:'#f57f17', bg:'#fff8e1' },
  { icon:'💱',  title:'Withdraw Cash',   desc:'Convert your earned cash to real money via supported payment methods', color:'#2e7d32', bg:'#e8f5e9' },
  { icon:'👥',  title:'Referral System', desc:'Invite friends and earn bonus rewards when they join your guild', color:'#c2185b', bg:'#fce4ec' },
  { icon:'🛒',  title:'Merchant Store',  desc:'Merchants sell eggs directly to players — all tracked in real time', color:'#00838f', bg:'#e0f7fa' },
  { icon:'💬',  title:'AI Support',      desc:'24/7 AI-powered support chat to help you on your adventure', color:'#4527a0', bg:'#ede7f6' },
]

const roles = [
  {
    icon:'🧝', name:'Player / Adventurer', color:'linear-gradient(135deg,#7c4dff,#2196f3)',
    desc:'Collect eggs, hatch monsters, and earn real money from your daily adventures.',
    perks:['Free to join','Collect & hatch eggs','Feed monsters 3× daily','Withdraw real earnings','Complete quests & achievements'],
    cta:'▶ Play Now', route:'/player/login',
  },
  {
    icon:'🏪', name:'Merchant Partner', color:'linear-gradient(135deg,#00897b,#00acc1)',
    desc:'Partner with HATCHME to drive footfall, reward loyal customers, and grow your business.',
    perks:['Issue eggs to customers','Track sales & scans','Top up credits easily','Build customer loyalty','Real-time dashboard'],
    cta:'🏪 Join as Merchant', route:'/merchant/login',
  },
  {
    icon:'🥚', name:'Sales Team (Egg Hunter)', color:'linear-gradient(135deg,#e65100,#ff9800)',
    desc:'Onboard merchants and earn commission on every merchant you bring to the platform.',
    perks:['Manage merchant portfolio','Track merchant sales','Commission from sign-up date','Real-time sales data','Appointment-based earnings'],
    cta:'🥚 Sales Portal', route:'/egghunter/login',
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
.world { font-family: 'Nunito', sans-serif; overflow-x: hidden; background: #0d0b1e; }

/* ── PARTICLES ── */
.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.particle { position: absolute; animation: float-particle linear infinite; }
@keyframes float-particle { 0%{ transform:translateY(0) rotate(0deg); } 100%{ transform:translateY(-100vh) rotate(360deg); } }

/* ── HERO ── */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: linear-gradient(160deg, #0d0b1e 0%, #1a0533 40%, #0a1a3e 100%); }
.hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 40%, rgba(124,77,255,0.3) 0%, transparent 70%); }
.stars { position: absolute; inset: 0; background-image: radial-gradient(2px 2px at 20% 30%, #fff 0%, transparent 100%), radial-gradient(2px 2px at 60% 20%, #fff 0%, transparent 100%), radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(2px 2px at 10% 80%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.6) 0%, transparent 100%); }

.hero-content { position: relative; z-index: 1; text-align: center; padding: 40px 24px 60px; max-width: 600px; }

.crown-badge { display: inline-block; background: rgba(255,215,0,0.15); border: 1.5px solid rgba(255,215,0,0.4); color: #ffd700; font-size: 12px; font-weight: 800; padding: 5px 14px; border-radius: 20px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }

.hero-logo { font-family: 'Fredoka One', cursive; font-size: clamp(52px, 15vw, 88px); line-height: 1; margin-bottom: 8px; }
.logo-h  { color: #ff6b6b; text-shadow: 0 0 30px #ff6b6b80; }
.logo-a  { color: #ffa06b; text-shadow: 0 0 30px #ffa06b80; }
.logo-t  { color: #ffd700; text-shadow: 0 0 30px #ffd70080; }
.logo-c  { color: #6bffb8; text-shadow: 0 0 30px #6bffb880; }
.logo-h2 { color: #6bb5ff; text-shadow: 0 0 30px #6bb5ff80; }
.logo-me { color: #c06bff; text-shadow: 0 0 30px #c06bff80; }

.hero-tagline { font-family: 'Fredoka One', cursive; font-size: clamp(20px, 5vw, 28px); color: #fff; margin-bottom: 10px; line-height: 1.3; }
.hero-sub { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.6); margin-bottom: 28px; line-height: 1.6; max-width: 380px; margin-left: auto; margin-right: auto; }

.hero-eggs { display: flex; justify-content: center; align-items: flex-end; gap: 6px; margin-bottom: 28px; }
.egg-float { font-size: 36px; animation: egg-bob 2s ease-in-out infinite; filter: drop-shadow(0 0 12px rgba(255,215,0,0.4)); }
.egg-float.gold { filter: drop-shadow(0 0 20px rgba(255,215,0,0.8)); }
@keyframes egg-bob { 0%,100%{ transform: translateY(0) rotate(-5deg); } 50%{ transform: translateY(-12px) rotate(5deg); } }

.hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
.btn-adventure { background: linear-gradient(135deg, #7c4dff, #e040fb); border: none; color: #fff; font-family: 'Fredoka One', cursive; font-size: 17px; padding: 14px 28px; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 32px rgba(124,77,255,0.5); transition: transform .15s, box-shadow .15s; }
.btn-adventure:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(124,77,255,0.7); }
.btn-adventure.large { font-size: 20px; padding: 18px 36px; }
.btn-portal { background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.25); color: #fff; font-family: 'Fredoka One', cursive; font-size: 15px; padding: 13px 24px; border-radius: 50px; cursor: pointer; transition: background .15s; }
.btn-portal:hover { background: rgba(255,255,255,0.18); }

.portal-grid { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
.portal-card { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 14px 18px; cursor: pointer; transition: background .15s, transform .12s; text-align: center; }
.portal-card:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
.portal-icon { font-size: 26px; margin-bottom: 4px; }
.portal-name { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.8); }

.scroll-hint { margin-top: 32px; font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 2px; }
.scroll-arrow { font-size: 18px; animation: bounce-down 1.5s ease-in-out infinite; margin-bottom: 4px; }
@keyframes bounce-down { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(6px); } }

/* ── SECTIONS ── */
.section { position: relative; padding: 64px 20px; }
.section-header { text-align: center; margin-bottom: 40px; }
.section-badge { display: inline-block; background: rgba(124,77,255,0.12); border: 1.5px solid rgba(124,77,255,0.3); color: #7c4dff; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }
.section-title { font-family: 'Fredoka One', cursive; font-size: clamp(26px, 6vw, 36px); color: #1a1f3c; margin-bottom: 8px; }
.section-sub { font-size: 13px; font-weight: 700; color: #90a4ae; }
.section-header.light .section-badge { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.8); }
.section-title.white { color: #fff; }
.section-sub.light { color: rgba(255,255,255,0.6); }

/* ── QUEST STEPS ── */
.quest-section { background: #f8f6ff; }
.quest-steps { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; max-width: 900px; margin: 0 auto; }
.quest-step { position: relative; background: #fff; border-radius: 22px; border: 2.5px solid #e0d7ff; padding: 24px 20px; text-align: center; flex: 1; min-width: 140px; max-width: 190px; box-shadow: 0 6px 0 #e0d7ff; }
.step-num { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#7c4dff,#e040fb); color: #fff; font-family: 'Fredoka One', cursive; font-size: 14px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.step-icon { font-size: 36px; margin-bottom: 8px; }
.step-name { font-family: 'Fredoka One', cursive; font-size: 15px; color: #1a1f3c; margin-bottom: 6px; }
.step-desc { font-size: 11px; font-weight: 700; color: #90a4ae; line-height: 1.5; }
.step-arrow { position: absolute; right: -18px; top: 50%; transform: translateY(-50%); color: #c5b8ff; font-size: 20px; font-weight: 900; z-index: 1; display: none; }

/* ── EGG SECTION ── */
.egg-section { background: linear-gradient(160deg, #1a0533 0%, #0a1a3e 100%); overflow: hidden; }
.egg-world-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(124,77,255,0.15) 0%, transparent 70%); pointer-events: none; }
.egg-tiers { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 900px; margin: 0 auto; }
.egg-tier-card { position: relative; border-radius: 22px; border: 2.5px solid; padding: 20px 16px; text-align: center; flex: 1; min-width: 130px; max-width: 160px; overflow: hidden; }
.tier-glow { position: absolute; inset: 0; pointer-events: none; }
.tier-egg { font-size: 40px; margin-bottom: 6px; }
.tier-name { font-family: 'Fredoka One', cursive; font-size: 15px; font-weight: 900; margin-bottom: 4px; }
.tier-value { font-family: 'Fredoka One', cursive; font-size: 24px; color: #1a1f3c; }
.tier-label { font-size: 9px; font-weight: 800; color: #90a4ae; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
.tier-perk { font-size: 10px; font-weight: 700; color: #546e7a; margin-bottom: 3px; text-align: left; }

/* ── MONSTER SECTION ── */
.monster-section { background: #fff; }
.kingdoms { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-bottom: 28px; }
.kingdom-card { border-radius: 22px; border: 2.5px solid; padding: 22px 18px; flex: 1; min-width: 200px; max-width: 260px; text-align: center; }
.kingdom-icon { font-size: 40px; margin-bottom: 8px; }
.kingdom-name { font-family: 'Fredoka One', cursive; font-size: 18px; color: #1a1f3c; margin-bottom: 4px; }
.kingdom-count { font-size: 11px; font-weight: 800; color: #90a4ae; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.kingdom-desc { font-size: 12px; font-weight: 700; color: #546e7a; line-height: 1.5; }
.elements-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 32px; }
.element-chip { border: 2px solid; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 800; }
.monster-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; max-width: 860px; margin: 0 auto; }
.monster-feat { background: #f8f6ff; border-radius: 18px; border: 2px solid #e0d7ff; padding: 18px 16px; }
.mf-icon { font-size: 28px; margin-bottom: 8px; }
.mf-title { font-family: 'Fredoka One', cursive; font-size: 15px; color: #1a1f3c; margin-bottom: 4px; }
.mf-desc { font-size: 12px; font-weight: 700; color: #90a4ae; line-height: 1.5; }

/* ── EARN SECTION ── */
.earn-section { background: linear-gradient(160deg, #0d2137 0%, #1a0533 100%); overflow: hidden; }
.earn-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(0,200,83,0.08) 0%, transparent 60%); pointer-events: none; }
.earn-flow { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 40px; }
.earn-step { background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px 16px; text-align: center; min-width: 130px; max-width: 160px; }
.earn-step.highlight { background: rgba(0,200,83,0.12); border-color: rgba(0,200,83,0.4); }
.es-icon { font-size: 32px; margin-bottom: 8px; }
.es-title { font-family: 'Fredoka One', cursive; font-size: 15px; color: #fff; margin-bottom: 4px; }
.es-desc { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); line-height: 1.4; }
.earn-arrow { font-size: 22px; color: rgba(255,255,255,0.3); font-weight: 900; }

.streak-showcase { background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 22px; padding: 22px; max-width: 500px; margin: 0 auto 32px; }
.ss-title { font-family: 'Fredoka One', cursive; font-size: 17px; color: #ffd700; margin-bottom: 4px; text-align: center; }
.ss-sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 16px; }
.streak-tiers { display: flex; flex-direction: column; gap: 8px; }
.streak-tier { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1.5px solid; border-radius: 12px; padding: 10px 14px; }
.st-icon { font-size: 22px; }
.st-info { flex: 1; }
.st-name { font-size: 13px; font-weight: 800; }
.st-feeds { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); }
.st-rate { font-family: 'Fredoka One', cursive; font-size: 15px; }

.earn-example { max-width: 500px; margin: 0 auto; }
.ee-title { font-family: 'Fredoka One', cursive; font-size: 16px; color: #fff; text-align: center; margin-bottom: 12px; }
.ee-cards { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.ee-card { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 16px; flex: 1; min-width: 180px; text-align: center; }
.ee-card.gold { border-color: rgba(255,215,0,0.4); background: rgba(255,215,0,0.06); }
.ee-egg { font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
.ee-val { font-family: 'Fredoka One', cursive; font-size: 28px; color: #fff; margin-bottom: 6px; }
.ee-calc { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); line-height: 1.5; }
.ee-calc strong { color: #4caf50; }

/* ── FEATURES ── */
.features-section { background: #f8f6ff; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; max-width: 900px; margin: 0 auto; }
.feat-card { background: #fff; border-radius: 20px; border: 2.5px solid; padding: 20px 16px; transition: transform .15s; }
.feat-card:hover { transform: translateY(-3px); }
.feat-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 12px; }
.feat-title { font-family: 'Fredoka One', cursive; font-size: 15px; color: #1a1f3c; margin-bottom: 6px; }
.feat-desc { font-size: 12px; font-weight: 700; color: #90a4ae; line-height: 1.5; }

/* ── ROLES ── */
.roles-section { background: linear-gradient(160deg, #0d0b1e 0%, #1a1040 100%); overflow: hidden; }
.roles-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(124,77,255,0.1) 0%, transparent 70%); pointer-events: none; }
.roles-grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; max-width: 960px; margin: 0 auto; }
.role-card { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 28px 22px; flex: 1; min-width: 240px; max-width: 300px; text-align: center; }
.role-icon { font-size: 48px; margin-bottom: 10px; }
.role-name { font-family: 'Fredoka One', cursive; font-size: 18px; color: #fff; margin-bottom: 8px; }
.role-desc { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 14px; }
.role-perks { list-style: none; text-align: left; margin-bottom: 20px; }
.role-perks li { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); padding: 3px 0; }
.role-perks li::before { content: '✦ '; color: #ffd700; }
.role-btn { border: none; color: #fff; font-family: 'Fredoka One', cursive; font-size: 14px; padding: 11px 24px; border-radius: 30px; cursor: pointer; width: 100%; transition: opacity .15s, transform .12s; }
.role-btn:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── FOOTER CTA ── */
.footer-cta { position: relative; background: linear-gradient(160deg, #1a0533, #0a1a3e); padding: 80px 24px; text-align: center; overflow: hidden; }
.fc-stars { position: absolute; inset: 0; background-image: radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 75% 25%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(2px 2px at 50% 60%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,0.4) 0%, transparent 100%); pointer-events: none; }
.fc-content { position: relative; z-index: 1; }
.fc-title { font-family: 'Fredoka One', cursive; font-size: clamp(24px, 6vw, 36px); color: #fff; margin-bottom: 12px; }
.fc-sub { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 28px; }
.fc-note { margin-top: 16px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); }
</style>
