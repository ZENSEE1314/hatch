<template>
  <div class="bottom-nav">
    <div class="nav-item" :class="{ active: active === 'home' }" @click="$router.push('/player/home')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="active === 'home' ? '#7c4dff' : '#9d96c4'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span class="nav-label" :style="active === 'home' ? 'color:var(--purple)' : ''">Home</span>
    </div>
    <div class="nav-item" :class="{ active: active === 'monsters' }" @click="$router.push('/player/monsters')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="active === 'monsters' ? '#7c4dff' : '#9d96c4'" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span class="nav-label" :style="active === 'monsters' ? 'color:var(--purple)' : ''">Monsters</span>
    </div>
    <div class="nav-item" @click="$router.push('/player/scan')">
      <div class="scan-fab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
        </svg>
      </div>
      <span class="nav-label" :style="active === 'scan' ? 'color:var(--purple)' : ''">Scan</span>
    </div>
    <div class="nav-item" :class="{ active: active === 'chat' }" @click="$router.push('/player/trade')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="active === 'chat' ? '#7c4dff' : '#9d96c4'" stroke-width="2" stroke-linecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="nav-label" :style="active === 'chat' ? 'color:var(--purple)' : ''">Chat</span>
    </div>
    <div class="nav-item" :class="{ active: active === 'profile' }" @click="$router.push('/player/profile')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="active === 'profile' ? '#7c4dff' : '#9d96c4'" stroke-width="2" stroke-linecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      <span class="nav-label" :style="active === 'profile' ? 'color:var(--purple)' : ''">Profile</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ active: { type: String, default: 'home' } })
</script>
