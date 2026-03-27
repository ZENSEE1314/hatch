<template>
  <div class="admin-shell">

    <!-- TOPBAR -->
    <div class="admin-topbar">
      <div class="topbar-left">
        <div class="topbar-logo">🛡 HATCHME</div>
        <div class="topbar-role" :class="role === 'accountant' ? 'role-acc' : 'role-admin'">
          {{ role === 'accountant' ? '📊 Accountant' : '⚙️ Admin' }}
        </div>
        <div class="live-dot" title="Live data — auto-refreshing every 2s">
          <span class="live-pulse"></span> LIVE
        </div>
        <span v-if="disputedEggs.length" class="dispute-alert" @click="section='disputes'">
          ⚠️ {{ disputedEggs.length }} dispute{{ disputedEggs.length > 1 ? 's' : '' }}
        </span>
      </div>
      <div v-if="role === 'admin'" class="admin-nav">
        <div v-for="s in navSections" :key="s.id"
          class="nav-tab" :class="{ active: section === s.id }"
          @click="section = s.id">
          {{ s.icon }} {{ s.label }}
        </div>
      </div>
      <button class="btn-logout" @click="logout">Sign Out</button>
    </div>

    <!-- ════════ ACCOUNTANT VIEW ════════ -->
    <div v-if="role === 'accountant'" class="main-content">
      <div class="summary-grid">
        <div class="sum-card" v-for="c in accSummary" :key="c.label" :style="{ borderColor: c.border }">
          <div class="sum-icon" :style="{ background: c.bg }">{{ c.icon }}</div>
          <div class="sum-val">{{ c.val }}</div>
          <div class="sum-label">{{ c.label }}</div>
        </div>
      </div>
      <div class="section-title-row">
        <div class="section-title">👥 All Player Accounts</div>
        <input class="search-input" type="text" placeholder="Search name or email…" v-model="search" />
      </div>
      <div class="table-wrap">
        <table class="acc-table">
          <thead><tr><th>#</th><th>Player</th><th>Email</th><th>Level</th><th>Cash (S$)</th><th>Gems</th><th>Monsters</th><th>Eggs</th></tr></thead>
          <tbody>
            <tr v-for="(p,i) in filteredPlayers" :key="p.email" class="acc-row" @click="viewPlayer(p)">
              <td class="td-num">{{ i+1 }}</td>
              <td><div class="player-cell"><span class="p-avatar">{{ p.user.avatar||'🐣' }}</span><span class="p-name">{{ p.user.name }}</span></div></td>
              <td class="td-email">{{ p.email }}</td>
              <td><span class="level-badge">Lv {{ p.user.level }}</span></td>
              <td class="td-cash">S${{ Number(p.user.cash).toFixed(2) }}</td>
              <td class="td-gems">{{ Number(p.user.gems).toLocaleString() }} 💎</td>
              <td class="td-center">{{ p.monsters.length }}</td>
              <td class="td-center">{{ p.eggs.length }}</td>
            </tr>
            <tr v-if="filteredPlayers.length===0"><td colspan="8" class="empty-cell">No accounts found.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="section-title-row" style="margin-top:28px">
        <div class="section-title">🏪 All Merchant Accounts</div>
      </div>
      <div class="table-wrap">
        <table class="acc-table">
          <thead><tr><th>#</th><th>Store</th><th>Email</th><th>Credits</th><th>Scans</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="(m,i) in allMerchants" :key="m.email">
              <td class="td-num">{{ i+1 }}</td>
              <td><strong>🏪 {{ m.info?.name||'—' }}</strong></td>
              <td class="td-email">{{ m.email }}</td>
              <td class="td-cash">{{ m.credits }}</td>
              <td class="td-center">{{ m.scans?.length||0 }}</td>
              <td><span class="st-chip" :class="m.status==='approved'?'st-ok':'st-pend'">{{ m.status }}</span></td>
            </tr>
            <tr v-if="allMerchants.length===0"><td colspan="6" class="empty-cell">No merchants.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ════════ ADMIN VIEW ════════ -->
    <div v-else class="main-content">

      <!-- ── DASHBOARD ── -->
      <div v-if="section==='dashboard'">
        <div class="summary-grid">
          <div class="sum-card" v-for="c in accSummary" :key="c.label" :style="{ borderColor: c.border }">
            <div class="sum-icon" :style="{ background: c.bg }">{{ c.icon }}</div>
            <div class="sum-val">{{ c.val }}</div>
            <div class="sum-label">{{ c.label }}</div>
          </div>
        </div>
        <div class="dashboard-tiles">
          <div v-for="s in navSections.filter(x=>x.id!=='dashboard')" :key="s.id"
            class="dash-tile" @click="section=s.id" :style="{ borderColor: s.color, background: s.bg }">
            <div class="tile-icon">{{ s.icon }}</div>
            <div class="tile-label">{{ s.label }}</div>
          </div>
        </div>
        <div class="login-help">
          <div class="help-title">Portal Login URLs</div>
          <div class="url-row"><span class="url-tag player-tag">Player</span><code>/player/login</code></div>
          <div class="url-row"><span class="url-tag merchant-tag">Merchant</span><code>/merchant/login</code></div>
          <div class="url-row"><span class="url-tag admin-tag">Admin / Accountant</span><code>/admin/login</code></div>
          <div class="url-row"><span class="url-tag" style="background:#fff8e1;color:#e65100">🥚 Sales Team</span><code>/egghunter/login</code></div>
        </div>
      </div>

      <!-- ── PLAYERS ── -->
      <div v-if="section==='players'">
        <div class="section-title-row">
          <div class="section-title">👥 Players ({{ allPlayers.length }})</div>
          <input class="search-input" placeholder="Search name or email…" v-model="search" />
        </div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>#</th><th>Player</th><th>Email</th><th>Level</th><th>Cash</th><th>Gems</th><th>Monsters</th><th>Eggs</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(p,i) in filteredPlayers" :key="p.email">
                <td class="td-num">{{ i+1 }}</td>
                <td><div class="player-cell"><span class="p-avatar">{{ p.user.avatar||'🐣' }}</span><span class="p-name">{{ p.user.name }}</span></div></td>
                <td class="td-email">{{ p.email }}</td>
                <td><span class="level-badge">Lv {{ p.user.level }}</span></td>
                <td class="td-cash">S${{ Number(p.user.cash).toFixed(2) }}</td>
                <td class="td-gems">{{ Number(p.user.gems).toLocaleString() }} 💎</td>
                <td class="td-center">{{ p.monsters.length }}</td>
                <td class="td-center">{{ p.eggs.length }}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="act-btn edit-btn" @click="openEditPlayer(p)">✏️ Edit</button>
                    <button class="act-btn del-btn" @click="deletePlayer(p)">🗑</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPlayers.length===0"><td colspan="9" class="empty-cell">No players found.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── MERCHANTS ── -->
      <div v-if="section==='merchants'">
        <div class="section-title-row">
          <div class="section-title">🏪 Merchants ({{ allMerchants.length }})</div>
          <span v-if="pendingMerchants.length" class="pending-badge">{{ pendingMerchants.length }} pending</span>
        </div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>#</th><th>Store</th><th>Email</th><th>Phone</th><th>Country</th><th>Currency</th><th>Credits</th><th>Egg Hunter</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(m,i) in allMerchants" :key="m.email" :class="{ 'row-pending': m.status==='pending' }">
                <td class="td-num">{{ i+1 }}</td>
                <td><strong>{{ m.info?.name||'—' }}</strong></td>
                <td class="td-email">{{ m.email }}</td>
                <td class="td-email">{{ m.info?.phone||'—' }}</td>
                <td class="td-center">{{ m.info?.country||'—' }}</td>
                <td class="td-center">{{ m.info?.currency||'—' }}</td>
                <td class="td-cash">{{ m.credits }}</td>
                <td>
                  <span v-if="m.assignedEggHunter" class="egg-hunter-chip">🥚 {{ m.assignedEggHunter.split('@')[0] }}</span>
                  <span v-else class="td-dim">—</span>
                </td>
                <td><span class="st-chip" :class="m.status==='approved'?'st-ok':m.status==='rejected'?'st-rej':'st-pend'">{{ m.status }}</span></td>
                <td>
                  <div style="display:flex;gap:4px;flex-wrap:wrap">
                    <button v-if="m.status==='pending'" class="act-btn ok-btn" @click="approveMerchant(m)">✅ Approve</button>
                    <button v-if="m.status==='pending'" class="act-btn del-btn" @click="rejectMerchant(m)">❌ Reject</button>
                    <button class="act-btn edit-btn" @click="openEditMerchant(m)">✏️ Edit</button>
                  </div>
                </td>
              </tr>
              <tr v-if="allMerchants.length===0"><td colspan="11" class="empty-cell">No merchants.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── SALES TEAM (EGG HUNTERS) ── -->
      <div v-if="section==='egghunters'">
        <div class="section-title-row">
          <div class="section-title">🥚 Sales Team ({{ allHunters.length }})</div>
          <button class="act-btn ok-btn" @click="openAddHunter">+ Add Sales Rep</button>
        </div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Code</th><th>Merchants</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(h, i) in allHunters" :key="h.email" class="acc-row">
                <td class="td-num">{{ i + 1 }}</td>
                <td><strong>{{ h.name }}</strong></td>
                <td class="td-email">{{ h.email }}</td>
                <td><span class="level-badge">{{ h.code || '—' }}</span></td>
                <td>{{ hunterMerchantCount(h.email) }} merchants</td>
                <td>
                  <button class="act-btn ok-btn" style="padding:4px 10px;font-size:11px" @click="openEditHunter(h)">Edit</button>
                  <button class="act-btn rej-btn" style="padding:4px 10px;font-size:11px;margin-left:6px" @click="deleteHunter(h)">Delete</button>
                  <button class="act-btn" style="padding:4px 10px;font-size:11px;margin-left:6px;background:#e3f2fd;color:#1565c0;border:none;border-radius:8px;cursor:pointer;font-weight:800" @click="copySetupLink(h)">🔗 Setup Link</button>
                </td>
              </tr>
              <tr v-if="allHunters.length === 0"><td colspan="6" class="empty-cell">No sales reps yet. Click "+ Add Sales Rep" to create one.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── MONSTERS ── -->
      <div v-if="section==='monsters'">
        <div class="section-title-row">
          <div class="section-title">🐾 Monster Dex ({{ allMonsters.length }})</div>
          <button class="act-btn ok-btn" @click="openAddMonster">+ Add Monster</button>
        </div>
        <div class="filter-bar">
          <select class="mini-select" v-model="monsterFilter.element">
            <option value="">All Elements</option>
            <option v-for="e in ELEMENTS" :key="e">{{ e }}</option>
          </select>
          <select class="mini-select" v-model="monsterFilter.set">
            <option value="">All Sets</option>
            <option value="Animal">Animal</option>
            <option value="Plant">Plant</option>
            <option value="Insect">Insect</option>
          </select>
          <select class="mini-select" v-model="monsterFilter.tier">
            <option value="">All Tiers</option>
            <option v-for="t in TIERS" :key="t">{{ t }}</option>
          </select>
          <input class="search-input" style="width:160px" placeholder="Search name…" v-model="monsterSearch" />
        </div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>Dex</th><th>Image</th><th>Name</th><th>Set</th><th>Element</th><th>Tier</th><th>Custom</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="m in filteredMonsters" :key="m.id||m.dex">
                <td class="td-num">{{ m.dex }}</td>
                <td>
                  <img v-if="m.image" :src="m.image" style="width:40px;height:40px;object-fit:contain;border-radius:6px" />
                  <div v-else style="width:40px;height:40px" v-html="getMonsterImage(m)"></div>
                </td>
                <td><strong>{{ m.name }}</strong></td>
                <td>{{ m.set }}</td>
                <td><span class="elem-badge" :class="'elem-'+m.element.toLowerCase()">{{ ELEM_ICONS[m.element] }} {{ m.element }}</span></td>
                <td><span class="tier-chip" :class="'tier-'+m.tier.toLowerCase()">{{ m.tier }}</span></td>
                <td class="td-center">{{ m._custom ? '✅' : '—' }}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="act-btn edit-btn" @click="openEditMonster(m)">✏️ Edit</button>
                    <button v-if="m._custom" class="act-btn del-btn" @click="deleteMonster(m)">🗑</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredMonsters.length===0"><td colspan="8" class="empty-cell">No monsters match filter.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── QUESTS ── -->
      <div v-if="section==='quests'">
        <div class="section-title-row">
          <div class="section-title">📋 Quest Templates ({{ questTemplates.length }})</div>
          <button class="act-btn ok-btn" @click="openAddQuest">+ Add Quest</button>
        </div>
        <div class="hint-text">These are the quests new players receive on registration.</div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>#</th><th>Title</th><th>Category</th><th>Set</th><th>Description</th><th>Target</th><th>Egg</th><th>Cash</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(q,i) in questTemplates" :key="q.id">
                <td class="td-num">{{ i+1 }}</td>
                <td><strong>{{ q.title }}</strong></td>
                <td><span class="cat-chip">{{ q.category }}</span></td>
                <td><span v-if="q.collectSet" class="set-chip">{{ q.collectSet }}</span><span v-else class="td-dim">—</span></td>
                <td class="td-email">{{ q.desc }}</td>
                <td class="td-center">{{ q.target }}</td>
                <td><span class="tier-chip" :class="'tier-'+q.egg.toLowerCase()">{{ q.egg }}</span></td>
                <td class="td-cash">S${{ q.cash }}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="act-btn edit-btn" @click="openEditQuest(q)">✏️ Edit</button>
                    <button class="act-btn del-btn" @click="deleteQuest(q)">🗑</button>
                  </div>
                </td>
              </tr>
              <tr v-if="questTemplates.length===0"><td colspan="9" class="empty-cell">No quests.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── TAXES ── -->
      <div v-if="section==='taxes'">
        <div class="section-title-row">
          <div class="section-title">🧾 Tax Rates</div>
          <button class="act-btn ok-btn" @click="addTaxRow">+ Add Country</button>
        </div>
        <div class="hint-text">Configure GST/VAT rates per country. Applies to merchant transactions.</div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>Code</th><th>Country Name</th><th>Tax Name</th><th>Rate (%)</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(t,i) in taxRates" :key="i">
                <td><input class="inline-input" v-model="t.code" style="width:55px" /></td>
                <td><input class="inline-input" v-model="t.country" /></td>
                <td><input class="inline-input" v-model="t.name" placeholder="GST" /></td>
                <td><input class="inline-input" type="number" v-model.number="t.rate" style="width:70px" min="0" max="100" step="0.1" /></td>
                <td><button class="act-btn del-btn" @click="deleteTaxRow(i)">🗑</button></td>
              </tr>
              <tr v-if="taxRates.length===0"><td colspan="5" class="empty-cell">No tax rates configured.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="save-row">
          <button class="save-btn" @click="saveTaxRates">💾 Save Tax Rates</button>
        </div>
      </div>

      <!-- ── CURRENCY ── -->
      <div v-if="section==='currency'">
        <div class="section-title-row">
          <div class="section-title">💱 Currency / FX Rates</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <div class="fx-fee-row">
              <label>Conversion Fee</label>
              <div style="display:flex;align-items:center;gap:4px">
                <input class="inline-input" type="number" v-model.number="conversionFee" style="width:60px" min="0" max="100" step="0.5" />
                <span style="font-size:12px;font-weight:800;color:#5a6080">%</span>
              </div>
            </div>
            <button class="act-btn ok-btn" :class="{ 'btn-loading': fxLoading }" @click="fetchLiveRates" :disabled="fxLoading">
              {{ fxLoading ? '⏳ Fetching…' : '🌐 Fetch Live Rates' }}
            </button>
            <button class="act-btn edit-btn" @click="addFxRow">+ Add</button>
          </div>
        </div>
        <div v-if="fxError" class="hint-text" style="color:#c62828">{{ fxError }}</div>
        <div v-if="fxLastUpdate" class="hint-text">Last updated: {{ fxLastUpdate }} · Base: SGD · Fee: {{ conversionFee }}% applied</div>
        <div class="hint-text" v-else>Rates are stored locally. Click "Fetch Live Rates" to pull from open.er-api.com. A {{ conversionFee }}% platform fee is added on top.</div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>Code</th><th>Currency Name</th><th>Symbol</th><th>Live Rate (→ SGD)</th><th>With {{ conversionFee }}% Fee</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(f,i) in fxRates" :key="i">
                <td><input class="inline-input" v-model="f.code" style="width:65px" placeholder="USD" /></td>
                <td><input class="inline-input" v-model="f.name" placeholder="US Dollar" /></td>
                <td><input class="inline-input" v-model="f.symbol" style="width:45px" placeholder="$" /></td>
                <td><input class="inline-input" type="number" v-model.number="f.toSGD" style="width:100px" step="0.0001" min="0" /></td>
                <td class="td-cash">{{ f.code === 'SGD' ? '1.0000' : (f.toSGD * (1 + conversionFee/100)).toFixed(4) }}</td>
                <td><button class="act-btn del-btn" @click="deleteFxRow(i)">🗑</button></td>
              </tr>
              <tr v-if="fxRates.length===0"><td colspan="6" class="empty-cell">No currencies configured.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="save-row">
          <button class="save-btn" @click="saveFxRates">💾 Save FX Rates</button>
        </div>
      </div>

      <!-- ── LEVELS ── -->
      <div v-if="section==='levels'">
        <div class="section-title-row">
          <div class="section-title">⭐ Level System</div>
        </div>
        <!-- Sub-tabs -->
        <div class="sub-tabs">
          <div class="sub-tab" :class="{ active: levelTab==='player' }"   @click="levelTab='player'">👤 Player</div>
          <div class="sub-tab" :class="{ active: levelTab==='merchant' }" @click="levelTab='merchant'">🏪 Merchant</div>
          <div class="sub-tab" :class="{ active: levelTab==='monster' }"  @click="levelTab='monster'">🐾 Monster</div>
        </div>

        <!-- Player Levels -->
        <div v-if="levelTab==='player'">
          <div class="hint-text" style="margin-bottom:10px">XP earned from feeding, spending, recruiting. Rewards given on level-up.</div>
          <button class="act-btn ok-btn" style="margin-bottom:10px" @click="addPlayerLevel">+ Add Level</button>
          <div class="table-wrap">
            <table class="acc-table">
              <thead><tr><th>Level</th><th>XP Required</th><th>Bonus Cash (S$)</th><th>Bonus Gems</th><th>Egg Reward</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-for="(lv,i) in playerLevels" :key="i">
                  <td><span class="level-badge">Lv {{ lv.level }}</span></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.xp" style="width:90px" min="0" /></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.bonusCash" style="width:90px" step="0.01" min="0" /></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.bonusGems" style="width:80px" min="0" /></td>
                  <td>
                    <select class="mini-select" v-model="lv.egg" style="padding:4px 8px">
                      <option value="">None</option>
                      <option v-for="t in TIERS" :key="t">{{ t }}</option>
                    </select>
                  </td>
                  <td><button class="act-btn del-btn" @click="playerLevels.splice(i,1)">🗑</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="save-row"><button class="save-btn" @click="savePlayerLevels">💾 Save Player Levels</button></div>
        </div>

        <!-- Merchant Levels -->
        <div v-if="levelTab==='merchant'">
          <div class="hint-text" style="margin-bottom:10px">Merchants earn XP from customer scans. Higher tiers unlock more features and lower transaction fees.</div>
          <button class="act-btn ok-btn" style="margin-bottom:10px" @click="addMerchantLevel">+ Add Level</button>
          <div class="table-wrap">
            <table class="acc-table">
              <thead><tr><th>Level</th><th>XP (Scans)</th><th>Tier Unlock</th><th>Bonus Credits</th><th>Fee Discount (%)</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-for="(lv,i) in merchantLevels" :key="i">
                  <td><span class="level-badge">Lv {{ lv.level }}</span></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.xp" style="width:90px" min="0" /></td>
                  <td>
                    <select class="mini-select" v-model="lv.tierUnlock" style="padding:4px 8px">
                      <option value="">None</option>
                      <option v-for="t in TIERS" :key="t">{{ t }}</option>
                    </select>
                  </td>
                  <td><input class="inline-input" type="number" v-model.number="lv.bonusCredits" style="width:90px" min="0" /></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.feeDiscount" style="width:80px" min="0" max="100" step="0.5" /></td>
                  <td><button class="act-btn del-btn" @click="merchantLevels.splice(i,1)">🗑</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="save-row"><button class="save-btn" @click="saveMerchantLevels">💾 Save Merchant Levels</button></div>
        </div>

        <!-- Monster Levels -->
        <div v-if="levelTab==='monster'">
          <div class="hint-text" style="margin-bottom:10px">Monsters gain XP each time they are fed. Higher levels increase HP, power, and unlock name prefixes.</div>
          <button class="act-btn ok-btn" style="margin-bottom:10px" @click="addMonsterLevel">+ Add Level</button>
          <div class="table-wrap">
            <table class="acc-table">
              <thead><tr><th>Level</th><th>XP Required</th><th>Max HP</th><th>Power Boost (%)</th><th>Name Prefix</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-for="(lv,i) in monsterLevels" :key="i">
                  <td><span class="level-badge">Lv {{ lv.level }}</span></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.xp" style="width:90px" min="0" /></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.maxHp" style="width:80px" min="1" /></td>
                  <td><input class="inline-input" type="number" v-model.number="lv.powerBoost" style="width:80px" min="0" step="5" /></td>
                  <td><input class="inline-input" v-model="lv.prefix" placeholder="e.g. Super" style="width:100px" /></td>
                  <td><button class="act-btn del-btn" @click="monsterLevels.splice(i,1)">🗑</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="save-row"><button class="save-btn" @click="saveMonsterLevels">💾 Save Monster Levels</button></div>
        </div>
      </div>

      <!-- ── ADS ── -->
      <div v-if="section==='ads'">
        <div class="section-title-row">
          <div class="section-title">📢 Ads / Banners</div>
          <button class="act-btn ok-btn" @click="openAddAd">+ Add Ad</button>
        </div>
        <div class="hint-text">Custom ads run while credits remain. When an ad's credits hit 0, Google AdMob fills the slot. Set your AdMob Unit ID in Branding settings.</div>

        <!-- ── Merchant Ad Approval Queue ── -->
        <div v-if="pendingMerchantAds.length" style="margin-bottom:24px">
          <div class="section-title" style="font-size:14px;color:#e65100;margin-bottom:10px">
            🕐 Merchant Ads Pending Review ({{ pendingMerchantAds.length }})
          </div>
          <div v-for="ma in pendingMerchantAds" :key="ma._adId" class="merchant-ad-review-card">
            <div class="mar-preview">
              <video v-if="ma.video" :src="ma.video" class="mar-video" muted loop autoplay playsinline />
              <div v-else class="mar-no-video">🎬</div>
            </div>
            <div class="mar-info">
              <div class="mar-store">🏪 {{ ma.merchantName || ma.merchantEmail }}</div>
              <div class="mar-title">{{ ma.title }}</div>
              <div class="mar-meta">Budget: {{ ma.budget?.toLocaleString() }} credits</div>
            </div>
            <div class="mar-actions">
              <button class="act-btn ok-btn" @click="approveMerchantAd(ma)">✅ Approve</button>
              <button class="act-btn del-btn" @click="rejectMerchantAd(ma)">❌ Reject</button>
            </div>
          </div>
        </div>

        <div class="ads-grid">
          <div v-for="(ad,i) in ads" :key="i" class="ad-card" :class="{ 'ad-inactive': !ad.active }">
            <!-- Preview -->
            <div class="ad-preview">
              <video v-if="ad.video" :src="ad.video" class="ad-media" muted loop autoplay playsinline />
              <img v-else-if="ad.image" :src="ad.image" class="ad-media" />
              <div v-else class="ad-placeholder">{{ ad.emoji || '📢' }}</div>
            </div>
            <div class="ad-info">
              <div class="ad-title">{{ ad.title || 'Untitled Ad' }}</div>
              <div class="ad-sub">{{ ad.subtitle }}</div>
              <div class="ad-meta">
                <span class="ad-type-chip" :class="ad.video ? 'chip-video' : 'chip-image'">
                  {{ ad.video ? '🎬 Video' : '🖼 Image' }}
                </span>
                <span class="ad-credits-chip" :class="ad.credits <= 0 ? 'chip-empty' : 'chip-ok'">
                  {{ ad.credits <= 0 ? '🔴 No Credits → AdMob' : `💳 ${ad.credits} credits` }}
                </span>
              </div>
              <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
                <button class="act-btn" :class="ad.active ? 'del-btn' : 'ok-btn'" @click="toggleAd(i)">
                  {{ ad.active ? '⏸ Pause' : '▶ Activate' }}
                </button>
                <button class="act-btn edit-btn" @click="openEditAd(i)">✏️ Edit</button>
                <button class="act-btn del-btn" @click="deleteAd(i)">🗑</button>
              </div>
            </div>
          </div>
          <div v-if="ads.length===0" style="color:#aab0cc;font-weight:700;padding:40px;text-align:center;width:100%">No ads configured.</div>
        </div>
      </div>

      <!-- ── DISPUTES ── -->
      <div v-if="section==='disputes'">
        <div class="section-title-row">
          <div class="section-title">⚠️ Disputes ({{ disputedEggs.length }})</div>
          <span v-if="disputedEggs.length" class="pending-badge">{{ disputedEggs.length }} open</span>
        </div>
        <div class="hint-text">Merchants have flagged these transactions. Review and approve (refund merchant + remove egg) or reject (keep as-is).</div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>#</th><th>Player</th><th>Merchant</th><th>Amount</th><th>Credits</th><th>Egg</th><th>Dispute Reason</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="(e,i) in disputedEggs" :key="e.id">
                <td class="td-num">{{ i+1 }}</td>
                <td><div class="player-cell"><span class="p-avatar">{{ e.playerAvatar||'👤' }}</span><span class="p-name">{{ e.playerName }}</span></div></td>
                <td><strong>{{ e.merchantName }}</strong></td>
                <td class="td-cash">{{ e.currency }} {{ e.amount?.toFixed(2) }}</td>
                <td class="td-cash">{{ e.credits }}</td>
                <td><span class="tier-chip" :class="'tier-'+(e.eggTier||'bronze').toLowerCase()">{{ e.eggTier }}</span></td>
                <td style="max-width:200px;white-space:normal;font-size:11px;color:#5a6080">{{ e.disputeReason }}</td>
                <td class="td-email">{{ e.disputedAt }}</td>
                <td>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button class="act-btn ok-btn" @click="approveDispute(e)">✅ Approve<br><span style="font-size:9px;font-weight:700">Refund + Remove egg</span></button>
                    <button class="act-btn del-btn" @click="rejectDispute(e)">❌ Reject<br><span style="font-size:9px;font-weight:700">Keep egg with player</span></button>
                  </div>
                </td>
              </tr>
              <tr v-if="disputedEggs.length===0"><td colspan="9" class="empty-cell">No open disputes.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Resolved disputes -->
        <div class="section-title-row" style="margin-top:24px">
          <div class="section-title">📁 Resolved Disputes</div>
        </div>
        <div class="table-wrap">
          <table class="acc-table">
            <thead><tr><th>#</th><th>Player</th><th>Merchant</th><th>Egg</th><th>Outcome</th><th>Resolved</th></tr></thead>
            <tbody>
              <tr v-for="(e,i) in resolvedDisputes" :key="e.id">
                <td class="td-num">{{ i+1 }}</td>
                <td>{{ e.playerName }}</td>
                <td>{{ e.merchantName }}</td>
                <td><span class="tier-chip" :class="'tier-'+(e.eggTier||'bronze').toLowerCase()">{{ e.eggTier }}</span></td>
                <td>
                  <span class="st-chip" :class="e.status==='dispute_approved'?'st-ok':'st-rej'">
                    {{ e.status === 'dispute_approved' ? '✅ Approved (refunded)' : '❌ Rejected (kept)' }}
                  </span>
                </td>
                <td class="td-email">{{ e.resolvedAt }}</td>
              </tr>
              <tr v-if="resolvedDisputes.length===0"><td colspan="6" class="empty-cell">No resolved disputes yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── SUPPORT ── -->
      <div v-if="section==='support'">
        <div class="section-title-row">
          <div class="section-title">💬 Support Chats ({{ supportThreads.length }})</div>
        </div>
        <div class="hint-text">AI-handled support chats from players. Click a thread to read the conversation.</div>

        <div v-if="supportThreads.length === 0" style="text-align:center;padding:60px;color:#aab0cc;font-weight:700">
          No support conversations yet.
        </div>

        <div v-else style="display:grid;grid-template-columns:280px 1fr;gap:16px;min-height:500px">
          <!-- Thread list -->
          <div style="background:#fff;border-radius:16px;border:2px solid #e8eaf0;overflow:hidden">
            <div v-for="t in supportThreads" :key="t.key"
              class="support-thread-row" :class="{ 'thread-active': selectedThread?.key === t.key }"
              @click="selectedThread = t">
              <div style="font-size:22px">{{ t.userAvatar || '👤' }}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:800;color:#1a1f3c;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ t.userName }}</div>
                <div style="font-size:11px;font-weight:700;color:#90a4ae;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ t.lastMessage }}</div>
              </div>
              <div style="font-size:10px;font-weight:700;color:#ccc;flex-shrink:0">{{ t.lastTime }}</div>
            </div>
          </div>

          <!-- Chat view -->
          <div style="background:#fff;border-radius:16px;border:2px solid #e8eaf0;padding:16px;overflow-y:auto;max-height:600px">
            <div v-if="!selectedThread" style="display:flex;align-items:center;justify-content:center;height:100%;color:#aab0cc;font-weight:700">
              Select a conversation →
            </div>
            <div v-else>
              <div style="font-size:15px;font-weight:800;color:#1a1f3c;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f0eeff">
                {{ selectedThread.userAvatar }} {{ selectedThread.userName }} · {{ selectedThread.userEmail }}
              </div>
              <div v-for="msg in selectedThread.messages" :key="msg.id"
                style="margin-bottom:12px;display:flex;gap:8px;align-items:flex-start"
                :style="msg.role==='user' ? 'flex-direction:row-reverse' : ''">
                <div style="width:28px;height:28px;border-radius:8px;background:#ede7ff;border:2px solid #d4c8ff;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">
                  {{ msg.role === 'user' ? (selectedThread.userAvatar||'👤') : '🛡' }}
                </div>
                <div style="max-width:70%">
                  <div :style="msg.role==='user' ? 'background:#7c4dff;color:#fff;border-radius:14px 14px 4px 14px' : 'background:#f4f6ff;color:#1a1f3c;border-radius:14px 14px 14px 4px'"
                    style="padding:8px 12px;font-size:12px;font-weight:700;line-height:1.5;white-space:pre-wrap">
                    {{ msg.text }}
                  </div>
                  <div style="font-size:10px;font-weight:700;color:#ccc;margin-top:3px" :style="msg.role==='user'?'text-align:right':''">{{ msg.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BRANDING ── -->
      <div v-if="section==='branding'">
        <div class="section-title-row">
          <div class="section-title">🎨 Branding</div>
        </div>
        <div class="branding-grid">

          <!-- App Name -->
          <div class="brand-card">
            <div class="brand-label">App Name</div>
            <input class="form-input" v-model="branding.appName" placeholder="HATCHME" />
          </div>

          <!-- Tagline -->
          <div class="brand-card">
            <div class="brand-label">Tagline</div>
            <input class="form-input" v-model="branding.tagline" placeholder="Real Life RPG" />
          </div>

          <!-- Primary Colour -->
          <div class="brand-card">
            <div class="brand-label">Primary Colour</div>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" v-model="branding.primaryColor" style="width:44px;height:36px;border-radius:8px;border:2px solid #e8eaf0;cursor:pointer" />
              <input class="form-input" v-model="branding.primaryColor" style="flex:1" />
            </div>
          </div>

          <!-- Support Email -->
          <div class="brand-card">
            <div class="brand-label">Support Email</div>
            <input class="form-input" v-model="branding.supportEmail" placeholder="support@hatchme.com" />
          </div>

          <!-- AdMob Unit ID -->
          <div class="brand-card">
            <div class="brand-label">Google AdMob Unit ID <span style="font-size:10px;color:#e65100;font-weight:700">(fallback when ad credits = 0)</span></div>
            <input class="form-input" v-model="branding.adMobUnitId" placeholder="ca-app-pub-XXXXXXXX/XXXXXXXX" />
            <div style="font-size:10px;color:#aaa;margin-top:4px">AdMob fills the slot when a custom ad has no credits left.</div>
          </div>

          <!-- App Logo -->
          <div class="brand-card">
            <div class="brand-label">App Logo</div>
            <div style="display:flex;gap:10px;align-items:center">
              <img v-if="branding.logo" :src="branding.logo" style="width:52px;height:52px;object-fit:contain;border-radius:10px;border:2px solid #e8eaf0" />
              <div v-else class="brand-img-placeholder">🥚</div>
              <label class="upload-btn">
                📁 Upload Logo
                <input type="file" accept="image/*" style="display:none" @change="uploadFile($event,'logo')" />
              </label>
              <button v-if="branding.logo" class="act-btn del-btn" @click="branding.logo=''">Remove</button>
            </div>
          </div>

          <!-- Favicon -->
          <div class="brand-card">
            <div class="brand-label">Favicon</div>
            <div style="display:flex;gap:10px;align-items:center">
              <img v-if="branding.favicon" :src="branding.favicon" style="width:32px;height:32px;object-fit:contain;border-radius:6px;border:2px solid #e8eaf0" />
              <div v-else class="brand-img-placeholder" style="width:32px;height:32px;font-size:16px">🔖</div>
              <label class="upload-btn">
                📁 Upload Favicon
                <input type="file" accept="image/*" style="display:none" @change="uploadFile($event,'favicon')" />
              </label>
              <button v-if="branding.favicon" class="act-btn del-btn" @click="branding.favicon=''">Remove</button>
            </div>
            <div style="font-size:10px;color:#aaa;margin-top:6px">Recommended: 32×32 or 64×64 PNG/ICO</div>
          </div>

          <!-- Intro Video -->
          <div class="brand-card" style="grid-column: span 2">
            <div class="brand-label">Intro / Splash Video <span style="font-size:10px;color:#888">(plays when app opens)</span></div>
            <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
              <video v-if="branding.introVideo" :src="branding.introVideo"
                style="height:100px;max-width:200px;border-radius:10px;border:2px solid #e8eaf0;object-fit:cover"
                controls muted />
              <div v-else class="brand-img-placeholder" style="width:100px;height:64px;font-size:24px">🎬</div>
              <div>
                <label class="upload-btn" style="display:inline-flex;margin-bottom:8px">
                  🎬 Upload Intro Video
                  <input type="file" accept="video/*" style="display:none" @change="uploadFile($event,'introVideo')" />
                </label>
                <div style="font-size:10px;color:#aaa">Max 500 MB. MP4 recommended.</div>
                <button v-if="branding.introVideo" class="act-btn del-btn" style="margin-top:6px" @click="branding.introVideo=''">Remove Video</button>
              </div>
            </div>
          </div>

        </div>

        <!-- SEO / Meta Tags -->
        <div style="margin-top:24px">
          <div style="font-weight:700;font-size:13px;color:#7c4dff;margin-bottom:12px;display:flex;align-items:center;gap:6px">🔍 SEO &amp; Meta Tags</div>
          <div class="brand-grid">
            <div class="brand-card">
              <div class="brand-label">Page Title <span style="font-size:10px;color:#888">(browser tab &amp; Google)</span></div>
              <input class="form-input" v-model="branding.seoTitle" placeholder="HATCHME – Real Life RPG" />
            </div>
            <div class="brand-card">
              <div class="brand-label">Meta Keywords <span style="font-size:10px;color:#888">(comma-separated)</span></div>
              <input class="form-input" v-model="branding.seoKeywords" placeholder="hatchme, rpg, egg hunt" />
            </div>
            <div class="brand-card" style="grid-column: span 2">
              <div class="brand-label">Meta Description <span style="font-size:10px;color:#888">(shown in Google search results)</span></div>
              <textarea class="form-input" v-model="branding.seoDescription" rows="2" placeholder="Short description of your app..." style="resize:vertical" />
            </div>
            <div class="brand-card">
              <div class="brand-label">OG Title <span style="font-size:10px;color:#888">(social share title)</span></div>
              <input class="form-input" v-model="branding.ogTitle" placeholder="Same as page title if blank" />
            </div>
            <div class="brand-card">
              <div class="brand-label">OG Image URL <span style="font-size:10px;color:#888">(social share thumbnail)</span></div>
              <input class="form-input" v-model="branding.ogImage" placeholder="https://..." />
            </div>
            <div class="brand-card" style="grid-column: span 2">
              <div class="brand-label">OG Description <span style="font-size:10px;color:#888">(social share description)</span></div>
              <textarea class="form-input" v-model="branding.ogDescription" rows="2" placeholder="Same as meta description if blank" style="resize:vertical" />
            </div>
          </div>
        </div>

        <div class="save-row" style="margin-top:20px">
          <button class="save-btn" @click="saveBranding">💾 Save Branding</button>
        </div>
      </div>

    </div><!-- end main-content -->

    <!-- ════ MODALS ════ -->

    <!-- Edit Player Modal -->
    <div v-if="editPlayer" class="modal-overlay" @click.self="editPlayer=null">
      <div class="modal-box">
        <div class="modal-title">✏️ Edit Player <span class="modal-close" @click="editPlayer=null">✕</span></div>
        <div class="player-cell" style="margin-bottom:16px">
          <span style="font-size:32px">{{ editPlayer.user.avatar }}</span>
          <div><div style="font-weight:800">{{ editPlayer.user.name }}</div><div style="font-size:11px;color:#888">{{ editPlayer.email }}</div></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Name</label><input class="form-input" v-model="editPlayer.user.name" /></div>
          <div class="form-group"><label>Level</label><input class="form-input" type="number" v-model.number="editPlayer.user.level" min="1" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>XP</label><input class="form-input" type="number" v-model.number="editPlayer.user.xp" /></div>
          <div class="form-group"><label>Cash (S$)</label><input class="form-input" type="number" v-model.number="editPlayer.user.cash" step="0.01" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Gems</label><input class="form-input" type="number" v-model.number="editPlayer.user.gems" /></div>
          <div class="form-group"><label>Avatar Emoji</label><input class="form-input" v-model="editPlayer.user.avatar" /></div>
        </div>
        <div class="modal-footer">
          <button class="btn-gray" @click="editPlayer=null">Cancel</button>
          <button class="btn-primary" @click="savePlayer">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Edit Merchant Modal -->
    <div v-if="editMerchant" class="modal-overlay" @click.self="editMerchant=null">
      <div class="modal-box">
        <div class="modal-title">✏️ Edit Merchant <span class="modal-close" @click="editMerchant=null">✕</span></div>

        <!-- Locked info banner -->
        <div class="locked-banner">
          🔒 <strong>Fixed at signup:</strong> &nbsp;
          Country: <strong>{{ editMerchant.info.country }}</strong> &nbsp;·&nbsp;
          Currency: <strong>{{ editMerchant.info.currency }}</strong> &nbsp;·&nbsp;
          Phone: <strong>{{ editMerchant.info.phone }}</strong>
        </div>

        <div class="form-row">
          <div class="form-group"><label>Store Name</label><input class="form-input" v-model="editMerchant.info.name" /></div>
          <div class="form-group"><label>Credits</label><input class="form-input" type="number" v-model.number="editMerchant.credits" /></div>
          <div class="form-group">
            <label>Status</label>
            <select class="form-input" v-model="editMerchant.status">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <!-- Egg Hunter assignment -->
        <div class="form-group" style="margin-bottom:12px">
          <label>🥚 Assigned Egg Hunter</label>
          <select class="form-input" v-model="editMerchant.assignedEggHunter">
            <option value="">— None —</option>
            <option v-for="h in allHunters" :key="h.email" :value="h.email">
              {{ h.name }} ({{ h.email }})
            </option>
          </select>
          <div v-if="editMerchant.assignedAt" style="font-size:11px;color:#2e7d32;margin-top:4px">
            📅 Assigned on: <strong>{{ new Date(editMerchant.assignedAt).toLocaleDateString('en-SG',{day:'2-digit',month:'short',year:'numeric'}) }}</strong>
          </div>
          <div v-if="editMerchant.referralCode" style="font-size:11px;color:#888;margin-top:4px">
            Signup referral code: <strong>{{ editMerchant.referralCode }}</strong>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-gray" @click="editMerchant=null">Cancel</button>
          <button class="btn-primary" @click="saveMerchant">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Egg Hunter Modal -->
    <div v-if="editHunter" class="modal-overlay" @click.self="editHunter=null">
      <div class="modal-box">
        <div class="modal-title">{{ editHunter._isNew ? '➕ Add Sales Rep' : '✏️ Edit Sales Rep' }} <span class="modal-close" @click="editHunter=null">✕</span></div>
        <div class="form-row">
          <div class="form-group"><label>Full Name</label><input class="form-input" v-model="editHunter.name" placeholder="John Doe" /></div>
          <div class="form-group"><label>Sales Code</label><input class="form-input" v-model="editHunter.code" placeholder="EH001" /></div>
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label>Email</label>
          <input class="form-input" v-model="editHunter.email" :disabled="!editHunter._isNew" placeholder="sales@company.com" type="email" />
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label>Password</label>
          <input class="form-input" v-model="editHunter.password" :placeholder="editHunter._isNew ? 'Set password' : 'Leave blank to keep current'" type="password" />
        </div>
        <div class="modal-footer">
          <button class="btn-gray" @click="editHunter=null">Cancel</button>
          <button class="btn-primary" @click="saveHunter">{{ editHunter._isNew ? 'Create Account' : 'Save Changes' }}</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Monster Modal -->
    <div v-if="editMonster" class="modal-overlay" @click.self="editMonster=null">
      <div class="modal-box">
        <div class="modal-title">{{ editMonster._isNew ? '➕ Add Monster' : '✏️ Edit Monster' }} <span class="modal-close" @click="editMonster=null">✕</span></div>
        <div class="form-row">
          <div class="form-group"><label>Name</label><input class="form-input" v-model="editMonster.name" /></div>
          <div class="form-group"><label>Emoji (fallback)</label><input class="form-input" v-model="editMonster.emoji" style="font-size:18px" /></div>
        </div>
        <div class="form-group" style="margin-bottom:14px">
          <label>Monster Image (optional)</label>
          <div style="display:flex;gap:10px;align-items:center;margin-top:6px">
            <img v-if="editMonster.image" :src="editMonster.image" style="width:54px;height:54px;object-fit:contain;border-radius:10px;border:2px solid #e8eaf0" />
            <div v-else style="width:54px;height:54px" v-html="getMonsterImage(editMonster)"></div>
            <label class="upload-btn">
              📁 Upload Image
              <input type="file" accept="image/*" style="display:none" @change="uploadMonsterImage" />
            </label>
            <button v-if="editMonster.image" class="act-btn del-btn" @click="editMonster.image=''">Remove</button>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Element</label>
            <select class="form-input" v-model="editMonster.element">
              <option v-for="e in ELEMENTS" :key="e">{{ e }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Set</label>
            <select class="form-input" v-model="editMonster.set">
              <option value="Animal">Animal</option>
              <option value="Plant">Plant</option>
              <option value="Insect">Insect</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tier</label>
            <select class="form-input" v-model="editMonster.tier">
              <option v-for="t in TIERS" :key="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group" v-if="editMonster._isNew">
            <label>Dex ID (e.g. #151)</label>
            <input class="form-input" v-model="editMonster.dex" />
          </div>
        </div>
        <div class="hint-text" v-if="!editMonster._isNew">Note: edits to built-in monsters are saved as overrides.</div>
        <div class="modal-footer">
          <button class="btn-gray" @click="editMonster=null">Cancel</button>
          <button class="btn-primary" @click="saveMonster">{{ editMonster._isNew ? 'Add Monster' : 'Save Changes' }}</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Quest Modal -->
    <div v-if="editQuest" class="modal-overlay" @click.self="editQuest=null">
      <div class="modal-box">
        <div class="modal-title">{{ editQuest._isNew ? '➕ Add Quest' : '✏️ Edit Quest' }} <span class="modal-close" @click="editQuest=null">✕</span></div>
        <div class="form-row">
          <div class="form-group"><label>Title</label><input class="form-input" v-model="editQuest.title" /></div>
          <div class="form-group">
            <label>Category</label>
            <select class="form-input" v-model="editQuest.category">
              <option value="Feed">Feed</option>
              <option value="Recruit">Recruit</option>
              <option value="Spend">Spend</option>
              <option value="Collect">Collect</option>
            </select>
          </div>
        </div>
        <div class="form-row" v-if="editQuest.category === 'Collect'">
          <div class="form-group">
            <label>Collection Set</label>
            <select class="form-input" v-model="editQuest.collectSet">
              <option value="Animal">Animal</option>
              <option value="Plant">Plant</option>
              <option value="Insect">Insect</option>
              <option value="All">All Monsters</option>
              <option value="Dex">Full Dex</option>
            </select>
          </div>
          <div class="form-group" style="align-self:flex-end">
            <div class="hint-text">Set determines which monsters count toward this quest.</div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:12px"><label>Description</label><input class="form-input" v-model="editQuest.desc" /></div>
        <div class="form-row">
          <div class="form-group"><label>Target</label><input class="form-input" type="number" v-model.number="editQuest.target" /></div>
          <div class="form-group"><label>Cash Reward (S$)</label><input class="form-input" type="number" v-model.number="editQuest.cash" /></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Egg Reward</label>
            <select class="form-input" v-model="editQuest.egg">
              <option v-for="t in TIERS" :key="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Enabled</label>
            <select class="form-input" v-model="editQuest.enabled">
              <option :value="true">Yes (unlocked)</option>
              <option :value="false">No (locked)</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-gray" @click="editQuest=null">Cancel</button>
          <button class="btn-primary" @click="saveQuest">{{ editQuest._isNew ? 'Add Quest' : 'Save Changes' }}</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Ad Modal -->
    <div v-if="editAd !== null" class="modal-overlay" @click.self="editAd=null">
      <div class="modal-box">
        <div class="modal-title">{{ editAd._isNew ? '➕ Add Ad' : '✏️ Edit Ad' }} <span class="modal-close" @click="editAd=null">✕</span></div>
        <div class="form-row">
          <div class="form-group"><label>Title</label><input class="form-input" v-model="editAd.title" /></div>
          <div class="form-group"><label>Subtitle / CTA</label><input class="form-input" v-model="editAd.subtitle" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Emoji (fallback icon)</label><input class="form-input" v-model="editAd.emoji" style="font-size:18px" /></div>
          <div class="form-group"><label>Credits (impressions)</label><input class="form-input" type="number" v-model.number="editAd.credits" min="0" /></div>
        </div>
        <div class="form-group" style="margin-bottom:14px"><label>Click URL (optional)</label><input class="form-input" v-model="editAd.url" placeholder="https://…" /></div>

        <!-- Image -->
        <div class="form-group" style="margin-bottom:14px">
          <label>Banner Image (optional, replaces emoji)</label>
          <div style="display:flex;gap:10px;align-items:center;margin-top:6px;flex-wrap:wrap">
            <img v-if="editAd.image" :src="editAd.image" style="height:56px;max-width:140px;object-fit:cover;border-radius:8px;border:2px solid #e8eaf0" />
            <label class="upload-btn">
              🖼 Upload Image
              <input type="file" accept="image/*" style="display:none" @change="uploadAdMedia($event,'image')" />
            </label>
            <button v-if="editAd.image" class="act-btn del-btn" @click="editAd.image=''">Remove</button>
          </div>
        </div>

        <!-- Video -->
        <div class="form-group" style="margin-bottom:14px">
          <label>Ad Video <span style="font-size:10px;color:#e65100">(overrides image if set)</span></label>
          <div style="display:flex;gap:10px;align-items:center;margin-top:6px;flex-wrap:wrap">
            <video v-if="editAd.video" :src="editAd.video"
              style="height:70px;max-width:160px;border-radius:8px;border:2px solid #e8eaf0;object-fit:cover"
              muted loop autoplay playsinline />
            <label class="upload-btn">
              🎬 Upload Video
              <input type="file" accept="video/*" style="display:none" @change="uploadAdMedia($event,'video')" />
            </label>
            <button v-if="editAd.video" class="act-btn del-btn" @click="editAd.video=''">Remove</button>
          </div>
          <div class="hint-text" style="margin-top:4px">Max 500 MB. MP4 recommended.</div>
        </div>

        <div class="modal-footer">
          <button class="btn-gray" @click="editAd=null">Cancel</button>
          <button class="btn-primary" @click="saveAd">{{ editAd._isNew ? 'Add Ad' : 'Save Changes' }}</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="admin-toast">{{ toast }}</div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MONSTER_DEX from '@/data/monsterDex.js'
import { getMonsterImage } from '@/data/monsterImages.js'
import { PlayerDB, MerchantDB, HunterDB, SettingsDB } from '@/api/db.js'

const router  = useRouter()
const role    = localStorage.getItem('adminAuth') || 'admin'
const section = ref('dashboard')
const search  = ref('')
const toast   = ref('')

// Map DB player row → UI format
function mapPlayer(row) {
  const d = row.data || {}
  return {
    email: row.email,
    user: {
      name:   d.user?.name   || row.name  || row.email,
      avatar: d.user?.avatar || '',
      level:  d.user?.level  || 1,
      xp:     d.user?.xp     || 0,
      cash:   d.user?.cash   || 0,
      gems:   d.user?.gems   || 0,
    },
    eggs:     d.eggs     || [],
    monsters: d.monsters || [],
    quests:   d.quests   || [],
    phone:    row.phone,
    dob:      row.dob,
    createdAt: row.created_at,
  }
}

// Map DB merchant row → UI format
function mapMerchant(row) {
  const d = row.data || {}
  return {
    email:             row.email,
    status:            row.status || 'pending',
    info: d.info || {
      name:     row.store   || row.email,
      phone:    row.phone   || '',
      country:  row.country || '',
      currency: '',
      tier:     'Bronze',
    },
    credits:           d.credits           || 0,
    scans:             d.scans             || [],
    topupHistory:      d.topupHistory      || [],
    ads:               d.ads               || [],
    assignedEggHunter: d.assignedEggHunter || '',
    assignedAt:        d.assignedAt        || null,
    referralCode:      d.referralCode      || '',
    _store:            row.store,
    _country:          row.country,
    _phone:            row.phone,
  }
}

const ELEMENTS = ['Fire','Water','Earth','Wind','Shadow']
const TIERS    = ['Bronze','Silver','Gold','Diamond','Mystic']
const ELEM_ICONS = { Fire:'🔥', Water:'💧', Earth:'🌿', Wind:'💨', Shadow:'🌑' }

const DEFAULT_QUESTS = [
  { id:1,  category:'Feed',    collectSet:null,     title:'Feed Masters I',      desc:'Feed your monsters 25 times',     target:25,  progress:0, enabled:true,  egg:'Bronze', cash:10,  claimable:false },
  { id:2,  category:'Feed',    collectSet:null,     title:'Feed Masters II',     desc:'Feed your monsters 100 times',    target:100, progress:0, enabled:false, egg:'Silver', cash:25,  claimable:false },
  { id:3,  category:'Feed',    collectSet:null,     title:'Feed Masters III',    desc:'Feed your monsters 500 times',    target:500, progress:0, enabled:false, egg:'Gold',   cash:50,  claimable:false },
  { id:4,  category:'Recruit', collectSet:null,     title:'Recruit Friends I',   desc:'Invite 3 friends to HATCHME',     target:3,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:5,  category:'Recruit', collectSet:null,     title:'Recruit Friends II',  desc:'Invite 10 friends',               target:10,  progress:0, enabled:false, egg:'Silver', cash:15,  claimable:false },
  { id:6,  category:'Recruit', collectSet:null,     title:'Recruit Friends III', desc:'Invite 25 friends',               target:25,  progress:0, enabled:false, egg:'Gold',   cash:50,  claimable:false },
  { id:7,  category:'Spend',   collectSet:null,     title:'Big Spender I',       desc:'Spend S$100 at merchants',        target:100, progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:8,  category:'Spend',   collectSet:null,     title:'Big Spender II',      desc:'Spend S$500 at merchants',        target:500, progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  { id:9,  category:'Spend',   collectSet:null,     title:'Big Spender III',     desc:'Spend S$2000 at merchants',       target:2000,progress:0, enabled:false, egg:'Gold',   cash:100, claimable:false },
  { id:10, category:'Collect', collectSet:'Animal', title:'Animal Collector I',  desc:'Collect 5 Animal monsters',       target:5,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:11, category:'Collect', collectSet:'Animal', title:'Animal Collector II', desc:'Collect 20 Animal monsters',      target:20,  progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  { id:12, category:'Collect', collectSet:'Plant',  title:'Plant Collector I',   desc:'Collect 5 Plant monsters',        target:5,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:13, category:'Collect', collectSet:'Plant',  title:'Plant Collector II',  desc:'Collect 20 Plant monsters',       target:20,  progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  { id:14, category:'Collect', collectSet:'Insect', title:'Insect Collector I',  desc:'Collect 5 Insect monsters',       target:5,   progress:0, enabled:true,  egg:'Bronze', cash:5,   claimable:false },
  { id:15, category:'Collect', collectSet:'Insect', title:'Insect Collector II', desc:'Collect 20 Insect monsters',      target:20,  progress:0, enabled:false, egg:'Silver', cash:20,  claimable:false },
  { id:16, category:'Collect', collectSet:'All',    title:'Monster Hoarder I',   desc:'Collect 30 monsters total',       target:30,  progress:0, enabled:true,  egg:'Silver', cash:25,  claimable:false },
  { id:17, category:'Collect', collectSet:'All',    title:'Monster Hoarder II',  desc:'Collect 75 monsters total',       target:75,  progress:0, enabled:false, egg:'Gold',   cash:75,  claimable:false },
  { id:18, category:'Collect', collectSet:'Dex',    title:'Full Dex',            desc:'Collect all 150 unique monsters', target:150, progress:0, enabled:true,  egg:'Mystic', cash:500, claimable:false },
]

function showToast(msg) { toast.value = msg; setTimeout(() => { toast.value = '' }, 2500) }
function logout() { localStorage.removeItem('adminAuth'); router.push('/admin/login') }

// ── DATA HELPERS (non-player/merchant still use localStorage) ──
function getMonsterOverrides()   { return JSON.parse(localStorage.getItem('adminMonsterOverrides') || '{}') }
function saveMonsterOverrides(o) { localStorage.setItem('adminMonsterOverrides', JSON.stringify(o)) }
function getCustomMonsters()     { return JSON.parse(localStorage.getItem('adminCustomMonsters') || '[]') }
function saveCustomMonsters(a)   { localStorage.setItem('adminCustomMonsters', JSON.stringify(a)) }
function getQuestTemplates() {
  const raw = localStorage.getItem('adminQuestTemplates')
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_QUESTS))
}
function saveQuestTemplates(a) { localStorage.setItem('adminQuestTemplates', JSON.stringify(a)) }

// ── FILE READER HELPER ──
function readFile(file) {
  return new Promise(resolve => {
    const r = new FileReader()
    r.onload = e => resolve(e.target.result)
    r.readAsDataURL(file)
  })
}

// ── PLAYERS ──
const allPlayers = ref([])
async function loadPlayers() {
  try {
    const rows = await PlayerDB.list()
    allPlayers.value = Array.isArray(rows) ? rows.map(mapPlayer) : []
  } catch { showToast('⚠️ Could not load players') }
}
const filteredPlayers = computed(() => {
  if (!search.value.trim()) return allPlayers.value
  const q = search.value.toLowerCase()
  return allPlayers.value.filter(p => p.user.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
})
const editPlayer = ref(null)
function viewPlayer(p)     { if (role === 'accountant') openEditPlayer(p) }
function openEditPlayer(p) { editPlayer.value = JSON.parse(JSON.stringify(p)) }
async function savePlayer() {
  const p = editPlayer.value
  await PlayerDB.saveData(p.email, { user: p.user, eggs: p.eggs, monsters: p.monsters, quests: p.quests })
  editPlayer.value = null
  await loadPlayers()
  showToast('✅ Player saved!')
}
async function deletePlayer(p) {
  if (!confirm(`Delete account for ${p.user.name} (${p.email})? This cannot be undone.`)) return
  await PlayerDB.delete(p.email)
  await loadPlayers()
  showToast('🗑 Player deleted.')
}

// ── MERCHANTS ──
const allMerchants = ref([])
async function loadMerchants() {
  try {
    const rows = await MerchantDB.list()
    allMerchants.value = Array.isArray(rows) ? rows.map(mapMerchant) : []
  } catch { showToast('⚠️ Could not load merchants') }
}
const pendingMerchants = computed(() => allMerchants.value.filter(m => m.status === 'pending'))
const editMerchant = ref(null)
function openEditMerchant(m) { editMerchant.value = JSON.parse(JSON.stringify(m)) }
async function approveMerchant(m) {
  const data = { info: m.info, credits: m.credits, assignedEggHunter: m.assignedEggHunter, assignedAt: m.assignedAt }
  await MerchantDB.saveData(m.email, data, 'approved')
  await loadMerchants()
  showToast('✅ Merchant approved!')
}
async function rejectMerchant(m) {
  if (!confirm(`Reject merchant ${m.info?.name}?`)) return
  const data = { info: m.info, credits: m.credits, assignedEggHunter: m.assignedEggHunter, assignedAt: m.assignedAt }
  await MerchantDB.saveData(m.email, data, 'rejected')
  await loadMerchants()
  showToast('❌ Merchant rejected.')
}
async function saveMerchant() {
  const m = editMerchant.value
  const prevHunter = allMerchants.value.find(x => x.email === m.email)?.assignedEggHunter || ''
  const nextHunter = m.assignedEggHunter || ''
  const assignedAt = nextHunter && nextHunter !== prevHunter ? Date.now() : (nextHunter ? m.assignedAt : null)
  const data = { info: m.info, credits: m.credits, assignedEggHunter: nextHunter, assignedAt }
  await MerchantDB.saveData(m.email, data, m.status)
  editMerchant.value = null
  await loadMerchants()
  showToast('✅ Merchant saved!')
}
async function deleteMerchant(m) {
  if (!confirm(`Delete merchant ${m.info?.name}?`)) return
  await MerchantDB.delete(m.email)
  await loadMerchants()
  showToast('🗑 Merchant deleted.')
}

// ── EGG HUNTERS (SALES TEAM) ──
const editHunter = ref(null)
const allHunters = ref([])
async function loadHunters() {
  try {
    const rows = await HunterDB.list()
    allHunters.value = Array.isArray(rows) ? rows.map(h => ({ email: h.email, name: h.name, code: h.code || '', password: h.password || '' })) : []
  } catch { showToast('⚠️ Could not load sales team') }
}
function hunterMerchantCount(email) {
  return allMerchants.value.filter(m => m.assignedEggHunter === email).length
}
function openAddHunter() {
  editHunter.value = { _isNew: true, name: '', email: '', password: '', code: '' }
}
function openEditHunter(h) {
  editHunter.value = { ...h }
}
async function saveHunter() {
  const h = editHunter.value
  if (!h.name || !h.email) { showToast('⚠️ Name and email are required.'); return }
  if (h._isNew && !h.password) { showToast('⚠️ Password is required.'); return }
  await HunterDB.create({ email: h.email.toLowerCase().trim(), name: h.name, code: h.code || '', password: h.password })
  editHunter.value = null
  await loadHunters()
  showToast('✅ Sales rep saved! Use 🔗 Setup Link to activate on their browser.')
}
async function deleteHunter(h) {
  if (!confirm(`Delete sales rep ${h.name}? This cannot be undone.`)) return
  await HunterDB.delete(h.email)
  await loadHunters()
  showToast('🗑 Sales rep deleted.')
}

onMounted(() => {
  loadPlayers()
  loadMerchants()
  loadHunters()
})
function copySetupLink(h) {
  const payload = btoa(JSON.stringify({ email: h.email, name: h.name, code: h.code || '', password: h.password }))
  const url = `${window.location.origin}/egghunter/login?setup=${payload}`
  navigator.clipboard.writeText(url).then(() => {
    showToast('🔗 Setup link copied! Send it to ' + h.name)
  }).catch(() => {
    prompt('Copy this setup link and send to ' + h.name + ':', url)
  })
}

// ── MONSTERS ──
const monsterSearch = ref('')
const monsterFilter = reactive({ element: '', set: '', tier: '' })
const allMonsters = computed(() => {
  const overrides = getMonsterOverrides()
  const customs   = getCustomMonsters()
  const base = MONSTER_DEX.map(m => {
    const ov = overrides[m.dex]
    return ov ? { ...m, ...ov } : { ...m }
  })
  return [...base, ...customs.map(m => ({ ...m, _custom: true }))]
})
const filteredMonsters = computed(() => {
  let list = allMonsters.value
  if (monsterFilter.element) list = list.filter(m => m.element === monsterFilter.element)
  if (monsterFilter.set)     list = list.filter(m => m.set === monsterFilter.set)
  if (monsterFilter.tier)    list = list.filter(m => m.tier === monsterFilter.tier)
  if (monsterSearch.value)   list = list.filter(m => m.name.toLowerCase().includes(monsterSearch.value.toLowerCase()))
  return list
})
const editMonster = ref(null)
function openEditMonster(m) { editMonster.value = { ...JSON.parse(JSON.stringify(m)), _isNew: false } }
function openAddMonster() {
  const customs = getCustomMonsters()
  const newId = 151 + customs.length
  editMonster.value = { id: newId, dex: '#' + String(newId).padStart(3,'0'), name: '', emoji: '🐾', image: '', element: 'Fire', set: 'Animal', tier: 'Bronze', _custom: true, _isNew: true }
}
async function uploadMonsterImage(e) {
  const file = e.target.files[0]
  if (!file) return
  editMonster.value.image = await readFile(file)
}
function saveMonster() {
  const m = editMonster.value
  if (!m.name.trim()) { alert('Please enter a name.'); return }
  const data = { id: m.id, dex: m.dex, name: m.name, emoji: m.emoji, image: m.image || '', element: m.element, set: m.set, tier: m.tier }
  if (m._isNew) {
    const customs = getCustomMonsters()
    customs.push({ ...data, _custom: true })
    saveCustomMonsters(customs)
  } else if (m._custom) {
    const customs = getCustomMonsters()
    const idx = customs.findIndex(c => c.dex === m.dex)
    if (idx !== -1) { customs[idx] = { ...data, _custom: true }; saveCustomMonsters(customs) }
  } else {
    const overrides = getMonsterOverrides()
    overrides[m.dex] = { name: m.name, emoji: m.emoji, image: m.image || '', element: m.element, set: m.set, tier: m.tier }
    saveMonsterOverrides(overrides)
  }
  editMonster.value = null
  showToast('✅ Monster saved!')
}
function deleteMonster(m) {
  if (!confirm(`Delete custom monster ${m.name}?`)) return
  saveCustomMonsters(getCustomMonsters().filter(c => c.dex !== m.dex))
  showToast('🗑 Monster deleted.')
}

// ── QUESTS ──
const questTemplates = ref(getQuestTemplates())
const editQuest = ref(null)
function openEditQuest(q) { editQuest.value = { ...JSON.parse(JSON.stringify(q)), _isNew: false } }
function openAddQuest() {
  const maxId = Math.max(0, ...questTemplates.value.map(q => q.id))
  editQuest.value = { id: maxId+1, title:'', category:'Feed', collectSet:null, desc:'', target:10, enabled:true, egg:'Bronze', cash:5, claimable:false, progress:0, _isNew:true }
}
function saveQuest() {
  const q = editQuest.value
  if (!q.title.trim()) { alert('Please enter a title.'); return }
  const collectSet = q.category === 'Collect' ? (q.collectSet || 'All') : null
  if (q._isNew) {
    questTemplates.value.push({ id: q.id, title: q.title, category: q.category, collectSet, desc: q.desc, target: q.target, enabled: q.enabled, egg: q.egg, cash: q.cash, claimable: false, progress: 0 })
  } else {
    const idx = questTemplates.value.findIndex(x => x.id === q.id)
    if (idx !== -1) questTemplates.value[idx] = { ...questTemplates.value[idx], title: q.title, category: q.category, collectSet, desc: q.desc, target: q.target, enabled: q.enabled, egg: q.egg, cash: q.cash }
  }
  saveQuestTemplates(questTemplates.value)
  editQuest.value = null
  showToast('✅ Quest saved!')
}
function deleteQuest(q) {
  if (!confirm(`Delete quest "${q.title}"?`)) return
  questTemplates.value = questTemplates.value.filter(x => x.id !== q.id)
  saveQuestTemplates(questTemplates.value)
  showToast('🗑 Quest deleted.')
}

// ── TAX RATES ──
const DEFAULT_TAX = [
  { code:'SG', country:'Singapore',   name:'GST', rate:9  },
  { code:'MY', country:'Malaysia',    name:'SST', rate:6  },
  { code:'ID', country:'Indonesia',   name:'VAT', rate:11 },
  { code:'TH', country:'Thailand',    name:'VAT', rate:7  },
  { code:'PH', country:'Philippines', name:'VAT', rate:12 },
  { code:'AU', country:'Australia',   name:'GST', rate:10 },
]
const taxRates = ref(JSON.parse(localStorage.getItem('adminTaxRates') || 'null') || JSON.parse(JSON.stringify(DEFAULT_TAX)))
function addTaxRow()     { taxRates.value.push({ code:'', country:'', name:'GST', rate:0 }) }
function deleteTaxRow(i) { taxRates.value.splice(i,1) }
function saveTaxRates()  { localStorage.setItem('adminTaxRates', JSON.stringify(taxRates.value)); showToast('✅ Tax rates saved!') }

// ── FX RATES ──
const DEFAULT_FX = [
  { code:'SGD', name:'Singapore Dollar', symbol:'S$', toSGD:1      },
  { code:'USD', name:'US Dollar',        symbol:'$',  toSGD:1.35   },
  { code:'MYR', name:'Malaysian Ringgit',symbol:'RM', toSGD:0.30   },
  { code:'IDR', name:'Indonesian Rupiah',symbol:'Rp', toSGD:0.000085 },
  { code:'THB', name:'Thai Baht',        symbol:'฿',  toSGD:0.038  },
  { code:'PHP', name:'Philippine Peso',  symbol:'₱',  toSGD:0.024  },
  { code:'AUD', name:'Australian Dollar',symbol:'A$', toSGD:0.88   },
  { code:'EUR', name:'Euro',             symbol:'€',  toSGD:1.46   },
  { code:'GBP', name:'British Pound',    symbol:'£',  toSGD:1.72   },
  { code:'CNY', name:'Chinese Yuan',     symbol:'¥',  toSGD:0.186  },
  { code:'JPY', name:'Japanese Yen',     symbol:'¥',  toSGD:0.0088 },
  { code:'HKD', name:'Hong Kong Dollar', symbol:'HK$',toSGD:0.174  },
]
const fxRates    = ref(JSON.parse(localStorage.getItem('adminFxRates') || 'null') || JSON.parse(JSON.stringify(DEFAULT_FX)))
const conversionFee = ref(JSON.parse(localStorage.getItem('adminFxFee') || '12'))
const fxLoading  = ref(false)
const fxError    = ref('')
const fxLastUpdate = ref(localStorage.getItem('adminFxLastUpdate') || '')

async function fetchLiveRates() {
  fxLoading.value = true
  fxError.value   = ''
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/SGD')
    const json = await res.json()
    if (json.result !== 'success') throw new Error(json['error-type'] || 'API error')
    const rates = json.rates  // e.g. { USD: 0.74, MYR: 3.32, ... } — these are units per 1 SGD
    // Convert: 1 unit of currency X = (1 / rates[X]) SGD
    fxRates.value = fxRates.value.map(f => {
      if (f.code === 'SGD') return { ...f, toSGD: 1 }
      const r = rates[f.code]
      return r ? { ...f, toSGD: parseFloat((1 / r).toFixed(6)) } : f
    })
    // Add any currencies from API that we don't have yet? No — only update existing rows
    fxLastUpdate.value = new Date().toLocaleString()
    localStorage.setItem('adminFxLastUpdate', fxLastUpdate.value)
    showToast('🌐 Live rates updated!')
  } catch (e) {
    fxError.value = `Failed to fetch rates: ${e.message}. Check network / CORS.`
  } finally {
    fxLoading.value = false
  }
}
function addFxRow()      { fxRates.value.push({ code:'', name:'', symbol:'', toSGD:1 }) }
function deleteFxRow(i)  { fxRates.value.splice(i,1) }
function saveFxRates()   {
  localStorage.setItem('adminFxRates', JSON.stringify(fxRates.value))
  localStorage.setItem('adminFxFee',   JSON.stringify(conversionFee.value))
  showToast('✅ FX rates saved!')
}

// ── LEVELS ──
const levelTab = ref('player')

// Player Levels
const DEFAULT_PLAYER_LEVELS = [
  { level:1,  xp:0,    bonusCash:0,   bonusGems:100,  egg:''        },
  { level:2,  xp:100,  bonusCash:5,   bonusGems:200,  egg:'Bronze'  },
  { level:3,  xp:250,  bonusCash:10,  bonusGems:300,  egg:'Bronze'  },
  { level:4,  xp:500,  bonusCash:15,  bonusGems:400,  egg:'Silver'  },
  { level:5,  xp:900,  bonusCash:25,  bonusGems:500,  egg:'Silver'  },
  { level:6,  xp:1500, bonusCash:40,  bonusGems:600,  egg:'Gold'    },
  { level:7,  xp:2300, bonusCash:60,  bonusGems:800,  egg:'Gold'    },
  { level:8,  xp:3500, bonusCash:100, bonusGems:1000, egg:'Diamond' },
  { level:9,  xp:5000, bonusCash:150, bonusGems:1500, egg:'Diamond' },
  { level:10, xp:7500, bonusCash:250, bonusGems:2000, egg:'Mystic'  },
]
const playerLevels = ref(JSON.parse(localStorage.getItem('adminLevels') || 'null') || JSON.parse(JSON.stringify(DEFAULT_PLAYER_LEVELS)))
function addPlayerLevel() {
  const last = playerLevels.value[playerLevels.value.length-1]
  playerLevels.value.push({ level: last ? last.level+1 : 1, xp:0, bonusCash:0, bonusGems:0, egg:'' })
}
function savePlayerLevels() { localStorage.setItem('adminLevels', JSON.stringify(playerLevels.value)); showToast('✅ Player levels saved!') }

// Merchant Levels
const DEFAULT_MERCHANT_LEVELS = [
  { level:1, xp:0,    tierUnlock:'Bronze',  bonusCredits:0,   feeDiscount:0   },
  { level:2, xp:50,   tierUnlock:'Bronze',  bonusCredits:100, feeDiscount:1   },
  { level:3, xp:150,  tierUnlock:'Silver',  bonusCredits:250, feeDiscount:2   },
  { level:4, xp:350,  tierUnlock:'Silver',  bonusCredits:500, feeDiscount:3   },
  { level:5, xp:700,  tierUnlock:'Gold',    bonusCredits:1000,feeDiscount:5   },
  { level:6, xp:1200, tierUnlock:'Gold',    bonusCredits:1500,feeDiscount:7   },
  { level:7, xp:2000, tierUnlock:'Diamond', bonusCredits:2500,feeDiscount:10  },
  { level:8, xp:3500, tierUnlock:'Mystic',  bonusCredits:5000,feeDiscount:15  },
]
const merchantLevels = ref(JSON.parse(localStorage.getItem('adminMerchantLevels') || 'null') || JSON.parse(JSON.stringify(DEFAULT_MERCHANT_LEVELS)))
function addMerchantLevel() {
  const last = merchantLevels.value[merchantLevels.value.length-1]
  merchantLevels.value.push({ level: last ? last.level+1 : 1, xp:0, tierUnlock:'', bonusCredits:0, feeDiscount:0 })
}
function saveMerchantLevels() { localStorage.setItem('adminMerchantLevels', JSON.stringify(merchantLevels.value)); showToast('✅ Merchant levels saved!') }

// Monster Levels
const DEFAULT_MONSTER_LEVELS = [
  { level:1, xp:0,   maxHp:100, powerBoost:0,   prefix:''         },
  { level:2, xp:10,  maxHp:120, powerBoost:5,   prefix:''         },
  { level:3, xp:25,  maxHp:150, powerBoost:10,  prefix:''         },
  { level:4, xp:50,  maxHp:180, powerBoost:15,  prefix:'Young'    },
  { level:5, xp:100, maxHp:220, powerBoost:25,  prefix:'Young'    },
  { level:6, xp:180, maxHp:270, powerBoost:35,  prefix:'Fierce'   },
  { level:7, xp:300, maxHp:330, powerBoost:50,  prefix:'Fierce'   },
  { level:8, xp:500, maxHp:400, powerBoost:70,  prefix:'Ancient'  },
  { level:9, xp:800, maxHp:480, powerBoost:90,  prefix:'Ancient'  },
  { level:10,xp:1200,maxHp:600, powerBoost:120, prefix:'Mythic'   },
]
const monsterLevels = ref(JSON.parse(localStorage.getItem('adminMonsterLevels') || 'null') || JSON.parse(JSON.stringify(DEFAULT_MONSTER_LEVELS)))
function addMonsterLevel() {
  const last = monsterLevels.value[monsterLevels.value.length-1]
  monsterLevels.value.push({ level: last ? last.level+1 : 1, xp:0, maxHp:100, powerBoost:0, prefix:'' })
}
function saveMonsterLevels() { localStorage.setItem('adminMonsterLevels', JSON.stringify(monsterLevels.value)); showToast('✅ Monster levels saved!') }

// ── ADS ──
const ads = ref(JSON.parse(localStorage.getItem('adminAds') || '[]'))
async function saveAdsStore() {
  localStorage.setItem('adminAds', JSON.stringify(ads.value))
  // Sync approved ads to DB so players can fetch them
  await SettingsDB.save('approved_ads', ads.value.filter(a => a.active)).catch(() => {})
}

// ── Merchant Ad Approval ──
const pendingMerchantAds = computed(() => {
  const result = []
  allMerchants.value.forEach(m => {
    (m.ads || []).forEach(a => {
      if (a.adStatus === 'pending_review') {
        result.push({ ...a, _adId: `${m.email}_${a.id}`, merchantEmail: m.email, merchantName: m.info?.name || m.email })
      }
    })
  })
  return result
})

async function approveMerchantAd(ma) {
  // Mark approved in merchant's data
  const merchant = allMerchants.value.find(m => m.email === ma.merchantEmail)
  if (!merchant) return
  const adIdx = merchant.ads.findIndex(a => a.id === ma.id)
  if (adIdx < 0) return
  merchant.ads[adIdx].adStatus = 'approved'
  merchant.ads[adIdx].active   = true
  await MerchantDB.saveData(ma.merchantEmail, {
    info: merchant.info, credits: merchant.credits, scans: merchant.scans,
    topupHistory: merchant.topupHistory, ads: merchant.ads.map(({ video: _v, ...rest }) => rest),
    referralCode: merchant.referralCode, assignedEggHunter: merchant.assignedEggHunter,
  })
  // Add to global approved ads list (minus video — players will get video from merchant's data)
  const { video, ...adMeta } = ma
  ads.value.push({ ...adMeta, active: true, credits: ma.budget || 0, _source: 'merchant' })
  await saveAdsStore()
  await loadMerchants()
  showToast('✅ Merchant ad approved and added to player feed!')
}

async function rejectMerchantAd(ma) {
  const merchant = allMerchants.value.find(m => m.email === ma.merchantEmail)
  if (!merchant) return
  const adIdx = merchant.ads.findIndex(a => a.id === ma.id)
  if (adIdx < 0) return
  merchant.ads[adIdx].adStatus = 'rejected'
  merchant.ads[adIdx].active   = false
  await MerchantDB.saveData(ma.merchantEmail, {
    info: merchant.info, credits: merchant.credits, scans: merchant.scans,
    topupHistory: merchant.topupHistory, ads: merchant.ads.map(({ video: _v, ...rest }) => rest),
    referralCode: merchant.referralCode, assignedEggHunter: merchant.assignedEggHunter,
  })
  await loadMerchants()
  showToast('❌ Merchant ad rejected.')
}
function toggleAd(i)  { ads.value[i].active = !ads.value[i].active; saveAdsStore(); showToast(ads.value[i].active ? '▶ Ad activated' : '⏸ Ad paused') }
function deleteAd(i)  { if (!confirm('Delete this ad?')) return; ads.value.splice(i,1); saveAdsStore(); showToast('🗑 Ad deleted.') }

const editAd = ref(null)
function openAddAd() { editAd.value = { title:'', subtitle:'', emoji:'📢', image:'', video:'', url:'', credits:1000, active:true, _isNew:true } }
function openEditAd(i) { editAd.value = { ...JSON.parse(JSON.stringify(ads.value[i])), _idx: i, _isNew: false } }
async function uploadAdMedia(e, type) {
  const file = e.target.files[0]
  if (!file) return
  if (type === 'video' && file.size > 500 * 1024 * 1024) { alert('Video must be under 500 MB.'); return }
  editAd.value[type] = await readFile(file)
}
function saveAd() {
  const a = editAd.value
  if (!a.title.trim()) { alert('Please enter a title.'); return }
  const data = { title: a.title, subtitle: a.subtitle, emoji: a.emoji, image: a.image||'', video: a.video||'', url: a.url||'', credits: a.credits||0, active: a.active }
  if (a._isNew) {
    ads.value.push(data)
  } else {
    ads.value[a._idx] = data
  }
  saveAdsStore()
  editAd.value = null
  showToast('✅ Ad saved!')
}

// ── BRANDING ──
const DEFAULT_BRANDING = {
  appName:'HATCHME', tagline:'Real Life RPG', primaryColor:'#7c4dff',
  logo:'', favicon:'', introVideo:'', supportEmail:'support@hatchme.com', adMobUnitId:'',
  seoTitle:'HATCHME – Real Life RPG', seoDescription:'Hatch monsters, scan eggs, and earn real rewards in the HATCHME Real Life RPG.',
  seoKeywords:'hatchme, real life rpg, egg hunt, monsters, rewards',
  ogTitle:'HATCHME – Real Life RPG', ogDescription:'', ogImage:'',
}
const _savedBranding = JSON.parse(localStorage.getItem('adminBranding') || 'null') || {}
const branding = ref({ ...DEFAULT_BRANDING, ..._savedBranding, introVideo: localStorage.getItem('adminBrandingVideo') || _savedBranding.introVideo || '' })

async function uploadFile(e, field) {
  const file = e.target.files[0]
  if (!file) return
  if (field === 'introVideo' && file.size > 500 * 1024 * 1024) { alert('Video must be under 500 MB.'); return }
  branding.value[field] = await readFile(file)
}

function applyMetaTags(b) {
  document.title = b.seoTitle || b.appName || 'HATCHME'
  const setMeta = (name, content, prop) => {
    const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`
    let el = document.querySelector(sel)
    if (!el) { el = document.createElement('meta'); prop ? el.setAttribute('property', name) : el.setAttribute('name', name); document.head.appendChild(el) }
    el.setAttribute('content', content)
  }
  setMeta('description', b.seoDescription)
  setMeta('keywords', b.seoKeywords)
  setMeta('og:title', b.ogTitle || b.seoTitle, true)
  setMeta('og:description', b.ogDescription || b.seoDescription, true)
  setMeta('og:image', b.ogImage, true)
}

function saveBranding() {
  try {
    const { introVideo, ...rest } = branding.value
    localStorage.setItem('adminBranding', JSON.stringify(rest))
    if (introVideo) {
      try { localStorage.setItem('adminBrandingVideo', introVideo) }
      catch { showToast('⚠️ Video too large for storage — other settings saved.'); return }
    } else {
      localStorage.removeItem('adminBrandingVideo')
    }
    applyMetaTags(branding.value)
    showToast('✅ Branding saved!')
  } catch(e) {
    showToast('⚠️ Save failed — storage full. Try removing the intro video.')
  }
}

// ── SUMMARY ──
const totalCash     = computed(() => allPlayers.value.reduce((s,p) => s + Number(p.user.cash||0), 0).toFixed(2))
const totalGems     = computed(() => allPlayers.value.reduce((s,p) => s + Number(p.user.gems||0), 0))
const totalEggs     = computed(() => allPlayers.value.reduce((s,p) => s + (p.eggs||[]).length, 0))
const totalMonsters = computed(() => allPlayers.value.reduce((s,p) => s + (p.monsters||[]).length, 0))
const accSummary = computed(() => [
  { icon:'👥', label:'Players',    val: allPlayers.value.length,          border:'#c8f7e4', bg:'#e8fff5' },
  { icon:'💵', label:'Total Cash', val: 'S$'+totalCash.value,             border:'#bbdefb', bg:'#e3f2fd' },
  { icon:'💎', label:'Total Gems', val: totalGems.value.toLocaleString(),  border:'#d1c4e9', bg:'#ede7ff' },
  { icon:'🥚', label:'Active Eggs',val: totalEggs.value,                   border:'#ffcc80', bg:'#fff8e1' },
  { icon:'🐾', label:'Monsters',   val: totalMonsters.value,               border:'#a5d6a7', bg:'#e8f5e9' },
  { icon:'🏪', label:'Merchants',  val: allMerchants.value.length,         border:'#80cbc4', bg:'#e0f2f1' },
])

// ── DISPUTES ──
function getAllPendingEggs() { return JSON.parse(localStorage.getItem('pendingEggs') || '[]') }
function saveAllPendingEggs(a) { localStorage.setItem('pendingEggs', JSON.stringify(a)) }

const disputedEggs     = computed(() => getAllPendingEggs().filter(e => e.status === 'disputed'))
const resolvedDisputes = computed(() => getAllPendingEggs().filter(e => e.status === 'dispute_approved' || e.status === 'dispute_rejected').slice().reverse())

async function approveDispute(egg) {
  if (!confirm(`Approve dispute for ${egg.playerName}? This will remove their egg from the record.`)) return
  // Update egg in player DB data
  const player = allPlayers.value.find(p => p.email === egg.playerEmail)
  if (player && egg.addedEggId) {
    const updatedEggs = (player.eggs || []).filter(e => e.id !== egg.addedEggId)
    const notifs = [...(player.notifications || [])]
    notifs.push({ id: Date.now(), icon: '⚠️', title: 'Egg Removed (Dispute)',
      body: `Admin reviewed a dispute from ${egg.merchantName} and approved it. Your ${egg.eggTier} egg has been removed.`,
      time: new Date().toLocaleString(), read: false })
    await PlayerDB.saveData(player.email, { ...player, eggs: updatedEggs, notifications: notifs })
    await loadPlayers()
  }
  // Update merchant credits in DB
  const merchant = allMerchants.value.find(m => m.email === egg.merchantEmail)
  if (merchant) {
    const data = { info: merchant.info, credits: (merchant.credits || 0) + (egg.credits || 0), assignedEggHunter: merchant.assignedEggHunter, assignedAt: merchant.assignedAt }
    await MerchantDB.saveData(merchant.email, data, merchant.status)
    await loadMerchants()
  }
  // Update status in localStorage
  const all = getAllPendingEggs()
  const idx = all.findIndex(e => e.id === egg.id)
  if (idx >= 0) { all[idx].status = 'dispute_approved'; all[idx].resolvedAt = new Date().toLocaleString() }
  saveAllPendingEggs(all)
  showToast('✅ Dispute approved — egg removed.')
}

function rejectDispute(egg) {
  if (!confirm(`Reject dispute? The player keeps their ${egg.eggTier} egg and no credits are refunded.`)) return
  const all = getAllPendingEggs()
  const idx = all.findIndex(e => e.id === egg.id)
  if (idx >= 0) { all[idx].status = 'dispute_rejected'; all[idx].resolvedAt = new Date().toLocaleString() }
  saveAllPendingEggs(all)
  showToast('❌ Dispute rejected — egg stays with player.')
}

// ── SUPPORT CHATS ──
const selectedThread = ref(null)
const supportThreads = computed(() => {
  const all = JSON.parse(localStorage.getItem('allSupportChats') || '{}')
  return Object.entries(all).map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => (b.lastTime || '').localeCompare(a.lastTime || ''))
})

// ── NAV ──
const navSections = [
  { id:'dashboard', icon:'📊', label:'Dashboard', color:'#90caf9', bg:'#e3f2fd' },
  { id:'players',   icon:'👥', label:'Players',   color:'#ce93d8', bg:'#f3e5f5' },
  { id:'merchants', icon:'🏪', label:'Merchants', color:'#80cbc4', bg:'#e0f2f1' },
  { id:'egghunters',icon:'🥚', label:'Sales Team', color:'#ffcc80', bg:'#fff8e1' },
  { id:'monsters',  icon:'🐾', label:'Monsters',  color:'#a5d6a7', bg:'#e8f5e9' },
  { id:'quests',    icon:'📋', label:'Quests',    color:'#b39ddb', bg:'#ede7ff' },
  { id:'taxes',     icon:'🧾', label:'Taxes',     color:'#ffcc80', bg:'#fff8e1' },
  { id:'currency',  icon:'💱', label:'Currency',  color:'#80deea', bg:'#e0f7fa' },
  { id:'levels',    icon:'⭐', label:'Levels',    color:'#f48fb1', bg:'#fce4ec' },
  { id:'ads',       icon:'📢', label:'Ads',       color:'#ef9a9a', bg:'#ffebee' },
  { id:'branding',  icon:'🎨', label:'Branding',  color:'#a5d6a7', bg:'#f1f8e9' },
  { id:'disputes',  icon:'⚠️', label:'Disputes',  color:'#ffe082', bg:'#fff8e1' },
  { id:'support',   icon:'💬', label:'Support',   color:'#80cbc4', bg:'#e0f2f1' },
]
</script>

<style scoped>
.admin-shell { min-height:100vh; background:#f4f6ff; font-family:'Nunito',sans-serif; }

/* TOPBAR */
.admin-topbar { background:#fff; border-bottom:2px solid #e8eaf0; padding:0 16px; height:54px; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:200; }
.topbar-left  { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.topbar-logo  { font-family:'Fredoka One',cursive; font-size:17px; color:#1a1f3c; }
.topbar-role  { font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; }
.role-admin   { background:#e3f2fd; color:#1565c0; }
.role-acc     { background:#e8f5e9; color:#2e7d32; }
.admin-nav    { display:flex; gap:4px; flex:1; overflow-x:auto; scrollbar-width:none; }
.admin-nav::-webkit-scrollbar { display:none; }
.nav-tab      { padding:6px 12px; border-radius:8px; font-size:12px; font-weight:800; color:#5a6080; cursor:pointer; white-space:nowrap; transition:all .15s; }
.nav-tab:hover  { background:#f4f6ff; }
.nav-tab.active { background:#7c4dff; color:#fff; }
.btn-logout   { padding:6px 14px; border-radius:10px; background:#ffebee; color:#c62828; font-size:12px; font-weight:800; border:1.5px solid #ef9a9a; cursor:pointer; flex-shrink:0; font-family:'Nunito',sans-serif; }

/* MAIN */
.main-content { padding:20px 24px 60px; max-width:1200px; margin:0 auto; }

/* SUMMARY */
.summary-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:24px; }
@media(min-width:600px){ .summary-grid { grid-template-columns:repeat(6,1fr); } }
.sum-card  { background:#fff; border-radius:14px; border:2px solid; padding:14px 10px; text-align:center; }
.sum-icon  { width:34px; height:34px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; font-size:17px; margin-bottom:7px; }
.sum-val   { font-family:'Fredoka One',cursive; font-size:16px; color:#1a1f3c; }
.sum-label { font-size:9px; font-weight:800; color:#aab0cc; text-transform:uppercase; letter-spacing:.4px; margin-top:2px; }

/* DASHBOARD TILES */
.dashboard-tiles { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
@media(min-width:600px){ .dashboard-tiles { grid-template-columns:repeat(5,1fr); } }
.dash-tile { border-radius:16px; border:2px solid; padding:18px 10px; text-align:center; cursor:pointer; transition:all .15s; }
.dash-tile:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,.1); }
.tile-icon  { font-size:26px; margin-bottom:7px; }
.tile-label { font-size:12px; font-weight:800; color:#1a1f3c; }

/* LOGIN HELP */
.login-help  { background:#fff; border-radius:16px; border:2px solid #e8eaf0; padding:16px 20px; max-width:420px; }
.help-title  { font-size:10px; font-weight:800; color:#aab0cc; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; }
.url-row     { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid #f5f5f5; }
.url-row:last-child { border-bottom:none; }
.url-row code { color:#5a6080; background:#f4f6ff; padding:3px 9px; border-radius:7px; font-size:11px; }
.url-tag      { font-size:10px; font-weight:800; padding:3px 8px; border-radius:8px; white-space:nowrap; }
.player-tag   { background:#ede7ff; color:#5e35b1; }
.merchant-tag { background:#e0f2f1; color:#00695c; }
.admin-tag    { background:#e3f2fd; color:#1565c0; }

/* SECTION */
.section-title-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; gap:12px; flex-wrap:wrap; }
.section-title { font-family:'Fredoka One',cursive; font-size:17px; color:#1a1f3c; }
.hint-text  { font-size:11px; font-weight:700; color:#aab0cc; margin-bottom:8px; }
.search-input { padding:7px 13px; border-radius:10px; border:2px solid #e8eaf0; background:#f8f9ff; font-size:12px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; }
.search-input:focus { border-color:#7c4dff; }
.pending-badge { background:#fff3e0; color:#e65100; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; }
.save-row   { display:flex; justify-content:flex-end; margin-top:14px; }
.save-btn   { padding:9px 22px; border-radius:12px; background:#7c4dff; color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.save-btn:hover { background:#6a3de8; }

/* SUB-TABS */
.sub-tabs { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
.sub-tab  { padding:7px 18px; border-radius:10px; font-size:13px; font-weight:800; color:#5a6080; border:2px solid #e8eaf0; cursor:pointer; background:#fff; transition:all .15s; }
.sub-tab.active { background:#7c4dff; color:#fff; border-color:#7c4dff; }

/* FX */
.fx-fee-row { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:800; color:#5a6080; }

/* FILTER BAR */
.filter-bar { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.mini-select { padding:6px 10px; border-radius:9px; border:2px solid #e8eaf0; background:#f8f9ff; font-size:12px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; cursor:pointer; }

/* TABLE */
.table-wrap { background:#fff; border-radius:16px; border:2px solid #e8eaf0; overflow-x:auto; box-shadow:0 2px 8px rgba(0,0,0,.04); }
.acc-table  { width:100%; border-collapse:collapse; font-size:12px; font-weight:700; white-space:nowrap; }
.acc-table thead tr { background:#f8f9ff; }
.acc-table th { padding:10px 14px; text-align:left; font-size:10px; font-weight:800; color:#aab0cc; text-transform:uppercase; letter-spacing:.4px; border-bottom:2px solid #f0eeff; }
.acc-table td { padding:10px 14px; border-bottom:1px solid #f5f0ff; color:#1a1f3c; }
.acc-table tr:last-child td { border-bottom:none; }
.acc-row    { cursor:pointer; transition:background .15s; }
.acc-row:hover { background:#faf8ff; }
.row-pending   { background:#fffde7; }
.empty-cell    { text-align:center; padding:40px; color:#aab0cc; font-weight:700; }
.td-dim        { color:#ccc; }
.td-num   { color:#aab0cc; font-size:11px; width:36px; }
.td-email { color:#5a6080; font-size:11px; max-width:160px; overflow:hidden; text-overflow:ellipsis; }
.td-cash  { color:#00695c; font-weight:800; }
.td-gems  { color:#5e35b1; }
.td-center { text-align:center; }

.player-cell { display:flex; align-items:center; gap:8px; }
.p-avatar { font-size:20px; }
.p-name   { font-weight:800; }
.level-badge { background:#ede7ff; color:#5e35b1; font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; }

.tier-chip    { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; }
.tier-bronze  { background:#fff3e0; color:#bf360c; }
.tier-silver  { background:#eceff1; color:#546e7a; }
.tier-gold    { background:#fff8e1; color:#f57f17; }
.tier-diamond { background:#e3f2fd; color:#0288d1; }
.tier-mystic  { background:#f3e5f5; color:#7b1fa2; }

.st-chip { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; text-transform:capitalize; }
.st-ok   { background:#e8f5e9; color:#2e7d32; }
.st-pend { background:#fff3e0; color:#e65100; }
.st-rej  { background:#ffebee; color:#c62828; }

.elem-badge  { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; }
.elem-fire   { background:#fff3e0; color:#bf360c; }
.elem-water  { background:#e3f2fd; color:#0d47a1; }
.elem-earth  { background:#e8f5e9; color:#1b5e20; }
.elem-wind   { background:#f3e5f5; color:#4a148c; }
.elem-shadow { background:#eceff1; color:#263238; }

.cat-chip { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; background:#ede7ff; color:#5e35b1; }
.set-chip { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; background:#e0f7fa; color:#006064; }

/* INLINE EDIT */
.inline-input { padding:5px 8px; border-radius:8px; border:1.5px solid #e8eaf0; background:#f8f9ff; font-size:12px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; width:120px; }
.inline-input:focus { border-color:#7c4dff; }

/* ADS */
.ads-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
.ad-card  { background:#fff; border-radius:16px; border:2px solid #e8eaf0; padding:14px; display:flex; gap:12px; align-items:flex-start; box-shadow:0 2px 8px rgba(0,0,0,.04); transition:opacity .2s; }
.ad-card.ad-inactive { opacity:.5; }
.ad-preview     { width:72px; height:72px; flex-shrink:0; border-radius:10px; overflow:hidden; background:#f4f6ff; display:flex; align-items:center; justify-content:center; }
.ad-media       { width:100%; height:100%; object-fit:cover; }
.ad-placeholder { font-size:30px; }
.ad-info        { flex:1; min-width:0; }
.ad-title       { font-size:13px; font-weight:800; color:#1a1f3c; }
.ad-sub         { font-size:11px; color:#888; margin-top:2px; }
.ad-meta        { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
.ad-type-chip   { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; }
.chip-video     { background:#e3f2fd; color:#1565c0; }
.chip-image     { background:#f3e5f5; color:#7b1fa2; }
.ad-credits-chip { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; }
.chip-ok        { background:#e8f5e9; color:#2e7d32; }
.chip-empty     { background:#ffebee; color:#c62828; }

/* BRANDING */
.branding-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
.brand-card    { background:#fff; border-radius:16px; border:2px solid #e8eaf0; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,.04); }
.brand-label   { font-size:11px; font-weight:800; color:#5a6080; margin-bottom:8px; }
.brand-img-placeholder { width:52px; height:52px; background:#f4f6ff; border-radius:10px; border:2px solid #e8eaf0; display:flex; align-items:center; justify-content:center; font-size:26px; }
.upload-btn    { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px; background:#f5f0ff; color:#5e35b1; font-size:12px; font-weight:800; border:1.5px solid #d4c8ff; cursor:pointer; font-family:'Nunito',sans-serif; }
.upload-btn:hover { background:#ede7ff; }

/* ACTION BUTTONS */
.act-btn  { font-size:11px; font-weight:800; padding:5px 12px; border-radius:8px; border:1.5px solid; cursor:pointer; transition:all .12s; font-family:'Nunito',sans-serif; }
.edit-btn { background:#f5f0ff; color:#5e35b1; border-color:#d4c8ff; }
.edit-btn:hover { background:#ede7ff; }
.ok-btn   { background:#e8f5e9; color:#2e7d32; border-color:#a5d6a7; }
.ok-btn:hover { background:#c8e6c9; }
.del-btn  { background:#ffebee; color:#c62828; border-color:#ef9a9a; }
.del-btn:hover { background:#ffcdd2; }
.btn-loading { opacity:.6; cursor:not-allowed; }

/* MODAL */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:500; display:flex; align-items:center; justify-content:center; padding:16px; }
.modal-box     { background:#fff; border-radius:20px; border:2px solid #e8eaf0; padding:22px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,.2); }
.modal-title   { font-family:'Fredoka One',cursive; font-size:18px; color:#1a1f3c; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; }
.modal-close   { width:28px; height:28px; border-radius:8px; background:#f4f6ff; border:2px solid #e8eaf0; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; }
.modal-footer  { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; padding-top:14px; border-top:2px solid #f0eeff; }
.form-row      { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
.form-group    { display:flex; flex-direction:column; gap:5px; }
.form-group label { font-size:11px; font-weight:800; color:#5a6080; }
.form-input    { padding:9px 12px; border-radius:10px; border:2px solid #e8eaf0; background:#f8f9ff; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; }
.form-input:focus { border-color:#7c4dff; }
.btn-primary   { padding:9px 20px; border-radius:12px; background:#7c4dff; color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.btn-gray      { padding:9px 20px; border-radius:12px; background:#f4f6ff; color:#5a6080; font-size:13px; font-weight:800; border:2px solid #e8eaf0; cursor:pointer; font-family:'Nunito',sans-serif; }

/* EGG HUNTER */
.egg-hunter-chip { font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px; background:#fff8e1; color:#f57f17; }

/* LOCKED BANNER */
.locked-banner { background:#f3f4f8; border-radius:10px; padding:9px 13px; font-size:11px; font-weight:700; color:#5a6080; margin-bottom:14px; display:flex; align-items:center; gap:4px; flex-wrap:wrap; }

/* TOAST */
.admin-toast { position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#1a1f3c; color:#fff; border-radius:20px; padding:10px 22px; font-size:13px; font-weight:800; z-index:600; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,.3); }

/* LIVE INDICATOR */
.live-dot { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:800; color:#2e7d32; background:#e8f5e9; border:1.5px solid #a5d6a7; border-radius:20px; padding:3px 10px; }
.live-pulse { width:7px; height:7px; background:#43a047; border-radius:50%; animation:livePulse 1.5s ease-in-out infinite; }
@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }
.dispute-alert { font-size:11px; font-weight:800; background:#fff3e0; color:#e65100; border:1.5px solid #ffcc80; border-radius:20px; padding:4px 12px; cursor:pointer; }
.dispute-alert:hover { background:#ffe0b2; }

/* SUPPORT */
.support-thread-row { display:flex; align-items:center; gap:10px; padding:12px 14px; cursor:pointer; border-bottom:1px solid #f5f0ff; transition:background .15s; }
.support-thread-row:hover { background:#f8f7ff; }
.thread-active { background:#ede7ff !important; }
td :deep(svg), .form-group :deep(svg) { width:100%; height:100%; display:block; }
.merchant-ad-review-card { display:flex; align-items:center; gap:12px; background:#fff; border:2px solid #ffe0b2; border-radius:14px; padding:12px 14px; margin-bottom:10px; }
.mar-preview { width:80px; height:56px; flex-shrink:0; border-radius:8px; overflow:hidden; background:#f4f6ff; display:flex; align-items:center; justify-content:center; }
.mar-video   { width:100%; height:100%; object-fit:cover; }
.mar-no-video{ font-size:24px; }
.mar-info    { flex:1; min-width:0; }
.mar-store   { font-size:10px; font-weight:800; color:#e65100; margin-bottom:2px; }
.mar-title   { font-size:13px; font-weight:800; color:#1a1f3c; }
.mar-meta    { font-size:11px; color:#888; font-weight:700; margin-top:2px; }
.mar-actions { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
</style>
