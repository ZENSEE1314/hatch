<template>
  <div class="merchant-welcome">
    <div class="welcome-bg">
      <div class="welcome-content">
        <div class="welcome-logo animate-float">🏪</div>
        <h1>Become a<br>HATCHME Merchant!</h1>
        <p>Gamify your store, attract more customers,<br>and reward them with monster eggs! 🥚</p>

        <div class="feature-list">
          <div class="feature-item" v-for="f in features" :key="f.icon">
            <span class="feature-icon">{{ f.icon }}</span>
            <div>
              <div class="feature-title">{{ f.title }}</div>
              <div class="feature-sub">{{ f.sub }}</div>
            </div>
          </div>
        </div>

        <button class="btn-white" @click="$router.push('/merchant/login')">
          Get Started ↗
        </button>
        <div class="signin-link" @click="$router.push('/merchant/login')">
          Already registered? Sign in →
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: '🔍', title: 'Customers scan & pay you', sub: 'You approve every transaction' },
  { icon: '💳', title: 'Credits deducted per egg', sub: 'Bronze 20% · Silver 25% · Gold 30%+' },
  { icon: '📈', title: 'Track analytics in dashboard', sub: 'Scans, revenue, credit usage' },
]
</script>

<style scoped>
.merchant-welcome { min-height: 100vh; }
.welcome-bg {
  min-height: 100vh;
  background: linear-gradient(160deg, #00897b 0%, #00acc1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}
.welcome-bg::before {
  content: '';
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,.07);
  top: -80px; left: -80px;
}
.welcome-bg::after {
  content: '';
  position: absolute;
  width: 260px; height: 260px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  bottom: -60px; right: -60px;
}
.welcome-content { z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0; max-width: 440px; width: 100%; }
.welcome-logo { font-size: 64px; margin-bottom: 16px; }
h1 { font-family: 'Fredoka One', cursive; font-size: 32px; color: #fff; line-height: 1.2; margin-bottom: 10px; }
p { font-size: 14px; font-weight: 700; color: rgba(255,255,255,.8); line-height: 1.7; margin-bottom: 22px; }
.feature-list { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 26px; }
.feature-item { display: flex; align-items: flex-start; gap: 12px; background: rgba(255,255,255,.15); border-radius: 14px; border: 2px solid rgba(255,255,255,.25); padding: 12px 14px; text-align: left; }
.feature-icon { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
.feature-title { font-family: 'Fredoka One', cursive; font-size: 14px; color: #fff; }
.feature-sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.7); margin-top: 2px; }
.btn-white { width: 100%; padding: 16px; border-radius: 16px; font-family: 'Fredoka One', cursive; font-size: 18px; background: #fff; color: #00897b; border: 3px solid rgba(255,255,255,.6); box-shadow: 0 4px 0 rgba(0,0,0,.15); cursor: pointer; }
.btn-white:hover { filter: brightness(1.05); transform: translateY(-1px); }
.signin-link { margin-top: 14px; font-size: 13px; font-weight: 800; color: rgba(255,255,255,.7); cursor: pointer; }
.signin-link:hover { color: #fff; }
</style>
