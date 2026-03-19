import { createRouter, createWebHistory } from 'vue-router'

// ── PLAYER VIEWS ──
import PlayerLogin        from '@/views/player/PlayerLogin.vue'
import PlayerHome         from '@/views/player/PlayerHome.vue'
import PlayerMonsters     from '@/views/player/PlayerMonsters.vue'
import PlayerFeeding      from '@/views/player/PlayerFeeding.vue'
import PlayerQRScan       from '@/views/player/PlayerQRScan.vue'
import PlayerHatching     from '@/views/player/PlayerHatching.vue'
import PlayerTrade        from '@/views/player/PlayerTrade.vue'
import SupportChat        from '@/views/player/SupportChat.vue'
import PlayerProfile      from '@/views/player/PlayerProfile.vue'
import PlayerWithdraw     from '@/views/player/PlayerWithdraw.vue'
import PlayerQuests       from '@/views/player/PlayerQuests.vue'
import PlayerAchievements from '@/views/player/PlayerAchievements.vue'
import PlayerSettings     from '@/views/player/PlayerSettings.vue'
import PlayerRefer        from '@/views/player/PlayerRefer.vue'
import PlayerEditProfile  from '@/views/player/PlayerEditProfile.vue'

// ── MERCHANT VIEWS ──
import MerchantLogin    from '@/views/merchant/MerchantLogin.vue'
import MerchantWelcome  from '@/views/merchant/MerchantWelcome.vue'
import MerchantOnboard  from '@/views/merchant/MerchantOnboard.vue'
import MerchantPending  from '@/views/merchant/MerchantPending.vue'
import MerchantDashboard from '@/views/merchant/MerchantDashboard.vue'

// ── ADMIN VIEWS ──
import AdminLogin  from '@/views/admin/AdminLogin.vue'
import AdminPortal from '@/views/admin/AdminPortal.vue'

// ── EGG HUNTER VIEWS ──
import EggHunterLogin     from '@/views/egghunter/EggHunterLogin.vue'
import EggHunterDashboard from '@/views/egghunter/EggHunterDashboard.vue'

const routes = [
  // ── Root ──
  { path: '/', redirect: '/player/login' },

  // ── PLAYER ──
  { path: '/player/login', component: PlayerLogin, meta: { title: 'Sign In', public: true } },
  {
    path: '/player',
    redirect: '/player/home',
    children: [
      { path: 'home',     component: PlayerHome,     meta: { title: 'Home',     nav: 'home',    auth: 'player' } },
      { path: 'monsters', component: PlayerMonsters, meta: { title: 'Monsters', nav: 'monsters',auth: 'player' } },
      { path: 'feeding',  component: PlayerFeeding,  meta: { title: 'Feed',     nav: 'monsters',auth: 'player' } },
      { path: 'scan',     component: PlayerQRScan,   meta: { title: 'Scan',     nav: 'scan',    auth: 'player' } },
      { path: 'hatching', component: PlayerHatching, meta: { title: 'Hatching', nav: 'home',    auth: 'player' } },
      { path: 'trade',    component: PlayerTrade,    meta: { title: 'Trade',    nav: 'chat',    auth: 'player' } },
      { path: 'support',  component: SupportChat,    meta: { title: 'Support',  nav: 'chat',    auth: 'player' } },
      { path: 'profile',      component: PlayerProfile,      meta: { title: 'Profile',      nav: 'profile', auth: 'player' } },
      { path: 'withdraw',     component: PlayerWithdraw,     meta: { title: 'Withdraw',     nav: 'profile', auth: 'player' } },
      { path: 'quests',       component: PlayerQuests,       meta: { title: 'My Quests',    nav: 'profile', auth: 'player' } },
      { path: 'achievements', component: PlayerAchievements, meta: { title: 'Achievements', nav: 'profile', auth: 'player' } },
      { path: 'settings',     component: PlayerSettings,     meta: { title: 'Settings',     nav: 'profile', auth: 'player' } },
      { path: 'refer',        component: PlayerRefer,        meta: { title: 'Refer a Friend',nav:'profile', auth: 'player' } },
      { path: 'edit-profile', component: PlayerEditProfile,  meta: { title: 'Edit Profile',  nav:'profile', auth: 'player' } },
    ]
  },

  // ── MERCHANT ──
  { path: '/merchant/login',   component: MerchantLogin,   meta: { title: 'Merchant Sign In', public: true } },
  { path: '/merchant/welcome', component: MerchantWelcome, meta: { title: 'HATCHME Merchant', public: true } },
  {
    path: '/merchant',
    redirect: '/merchant/login',
    children: [
      { path: 'onboard',   component: MerchantOnboard,   meta: { title: 'Register Store',    auth: 'merchant' } },
      { path: 'pending',   component: MerchantPending,   meta: { title: 'Under Review',      auth: 'merchant' } },
      { path: 'dashboard', component: MerchantDashboard, meta: { title: 'Merchant Dashboard',auth: 'merchant' } },
    ]
  },

  // ── ADMIN ──
  { path: '/admin/login', component: AdminLogin,  meta: { title: 'Admin Sign In', public: true } },
  { path: '/admin',       component: AdminPortal, meta: { title: 'Admin Portal',  auth: 'admin' } },

  // ── EGG HUNTER ──
  { path: '/egghunter/login',     component: EggHunterLogin,     meta: { title: 'Egg Hunter Sign In', public: true } },
  { path: '/egghunter/dashboard', component: EggHunterDashboard, meta: { title: 'Egg Hunter Portal',  auth: 'egghunter' } },

  // ── 404 ──
  { path: '/:pathMatch(.*)*', redirect: '/player/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

// ── AUTH GUARD ──
router.beforeEach((to, _from, next) => {
  const auth = to.meta.auth
  if (auth === 'player'   && !localStorage.getItem('playerAuth'))   return next('/player/login')
  if (auth === 'merchant' && !localStorage.getItem('merchantAuth')) return next('/merchant/login')
  if (auth === 'admin'      && !localStorage.getItem('adminAuth'))      return next('/admin/login')
  if (auth === 'egghunter'  && !localStorage.getItem('eggHunterAuth')) return next('/egghunter/login')
  next()
})

// Update page title
router.afterEach(to => {
  document.title = (to.meta.title || 'HATCHME') + ' | HATCHME'
})

export default router
