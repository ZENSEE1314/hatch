<template>
  <div class="phone-shell">

    <!-- HEADER -->
    <div class="m-header">
      <div style="display:flex;align-items:center;gap:10px">
        <img v-if="merchantStore.info?.logo" :src="merchantStore.info.logo" class="header-logo" />
        <div v-else class="header-logo-placeholder">🏪</div>
        <div>
          <div class="header-store">{{ merchantStore.info?.name || 'My Store' }}</div>
          <div class="header-sub">{{ merchantStore.info?.country }} · {{ merchantStore.info?.currency }}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="credits-pill">💳 {{ merchantStore.credits.toLocaleString() }} credits</div>
      </div>
    </div>

    <!-- LIVE TOAST -->
    <transition name="toast-slide">
      <div v-if="liveToast" class="live-toast">{{ liveToast }}</div>
    </transition>

    <!-- PENDING BANNER -->
    <div v-if="merchantStore.status === 'pending'" class="pending-bar">
      ⏳ Application under review — features limited until approved by admin.
    </div>

    <!-- ════ SCROLL CONTENT ════ -->
    <div class="scroll-content">

      <!-- ── HOME ── -->
      <div v-if="tab === 'home'" class="tab-body">

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat" style="border-color:#c8f7e4">
            <div class="stat-val" style="color:#00695c">{{ merchantStore.credits.toLocaleString() }}</div>
            <div class="stat-label">Credits</div>
          </div>
          <div class="stat" style="border-color:#fff3e0">
            <div class="stat-val" style="color:#e65100">{{ merchantStore.scans.length }}</div>
            <div class="stat-label">Total Scans</div>
          </div>
          <div class="stat" style="border-color:#e3f2fd">
            <div class="stat-val" style="color:#0277bd">S${{ totalRevenue }}</div>
            <div class="stat-label">Revenue</div>
          </div>
          <div class="stat" style="border-color:#ede7ff">
            <div class="stat-val" style="color:#5e35b1">{{ totalAdViews }}</div>
            <div class="stat-label">Ad Views</div>
          </div>
        </div>

        <!-- QR Code for Purchase -->
        <div class="card" style="margin:14px 16px 0">
          <div class="card-title">📱 Purchase QR Code</div>
          <div class="card-sub">Customers scan this QR to make a purchase at your store</div>
          <div class="qr-wrap">
            <img :src="purchaseQrUrl" class="qr-img" alt="Purchase QR" />
          </div>
          <div class="qr-label">{{ merchantEmail }}</div>
          <div class="egg-reward-chip">
            🥚 Customers earn a <strong>{{ merchantStore.info?.eggTier || 'Bronze' }}</strong> egg per purchase
          </div>
        </div>

        <!-- Merchant Referral Code -->
        <div class="card" style="margin:14px 16px 0">
          <div class="card-title">🔗 Merchant Referral Code</div>
          <div class="card-sub">Share this code with customers — each new player signup earns you <strong>500 credits (S$5)</strong></div>
          <div class="ref-code-box" @click="copyCode(merchantStore.info?.merchantCode)">
            <span class="ref-code">{{ merchantStore.info?.merchantCode || '—' }}</span>
            <span class="copy-hint">{{ copied ? '✅ Copied!' : '📋 Tap to copy' }}</span>
          </div>
        </div>

        <!-- Pending Approvals -->
        <div class="section-head" v-if="pendingEggsList.length > 0">
          ⏳ Pending Approvals <span class="pending-count-badge">{{ pendingEggsList.length }}</span>
        </div>
        <div v-if="pendingEggsList.length > 0" style="padding:0 16px 10px">
          <div class="pending-egg-item" v-for="egg in pendingEggsList" :key="egg.id">
            <div class="pei-avatar">{{ egg.playerAvatar || '👤' }}</div>
            <div class="pei-info">
              <div class="pei-name">{{ egg.playerName }}</div>
              <div class="pei-meta">{{ egg.currency }} {{ egg.amount.toFixed(2) }} · {{ egg.eggTier }} egg · {{ egg.createdAt }}</div>
              <div class="pei-credits">-{{ egg.credits }} credits reserved</div>
            </div>
            <div class="pei-actions">
              <button class="pei-btn approve" @click="approveEgg(egg)">✅ Approve</button>
              <button class="pei-btn reject" @click="rejectEgg(egg)">❌ Reject</button>
            </div>
          </div>
        </div>

        <!-- Recent Scans -->
        <div class="section-head">📋 Recent Scans</div>
        <div style="padding:0 16px 16px">
          <div v-if="merchantStore.scans.length === 0" class="empty-state">
            <div style="font-size:36px;margin-bottom:8px">📭</div>
            No scans yet. Share your QR code with customers!
          </div>
          <div class="scan-item" v-for="s in merchantStore.scans.slice().reverse().slice(0,10)" :key="s.id">
            <div class="scan-avatar">{{ s.avatar || '👤' }}</div>
            <div class="scan-info">
              <div class="scan-name">{{ s.player }}</div>
              <div class="scan-meta">{{ s.tier }} egg · {{ s.time }}</div>
              <span v-if="getEggStatus(s.id) === 'disputed'" class="dispute-badge">🚨 Under Dispute</span>
              <span v-if="getEggStatus(s.id) === 'dispute_approved'" class="dispute-badge resolved">✅ Dispute Resolved</span>
              <span v-if="getEggStatus(s.id) === 'dispute_rejected'" class="dispute-badge rejected">❌ Dispute Denied</span>
            </div>
            <div class="scan-amount">
              <div style="font-family:'Fredoka One',cursive;font-size:14px;color:#00695c">{{ s.amount }}</div>
              <div style="font-size:10px;font-weight:700;color:var(--text3)">-{{ s.credits }} credits</div>
              <button v-if="getEggStatus(s.id) === 'approved'" class="dispute-link" @click="openDispute(s)">⚠ Dispute</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── SALES ── -->
      <div v-if="tab === 'sales'" class="tab-body">
        <div class="sub-tabs">
          <div class="sub-tab" :class="{active:salesTab==='scans'}"  @click="salesTab='scans'">🛍 Sales</div>
          <div class="sub-tab" :class="{active:salesTab==='topups'}" @click="salesTab='topups'">💳 Top-Ups</div>
          <div class="sub-tab" :class="{active:salesTab==='ads'}"    @click="salesTab='ads'">📢 Ad Spend</div>
        </div>

        <!-- Sales history -->
        <div v-if="salesTab==='scans'" style="padding:0 16px 16px">
          <div class="hist-summary">
            Total Revenue: <strong>S${{ totalRevenue }}</strong> · {{ merchantStore.scans.length }} scans
          </div>
          <div v-if="merchantStore.scans.length===0" class="empty-state">
            <div style="font-size:32px;margin-bottom:8px">🛍</div>No sales yet.
          </div>
          <div class="hist-item" v-for="s in merchantStore.scans.slice().reverse()" :key="s.id">
            <div class="hist-icon">🛍</div>
            <div class="hist-info">
              <div class="hist-name">{{ s.player }}</div>
              <div class="hist-meta">{{ s.time }} · {{ s.tier }} egg reward</div>
            </div>
            <div class="hist-right">
              <div class="hist-amount">{{ s.amount }}</div>
              <div class="hist-credits">-{{ s.credits }} credits</div>
            </div>
          </div>
        </div>

        <!-- Top-up history -->
        <div v-if="salesTab==='topups'" style="padding:0 16px 16px">
          <div class="hist-summary">
            Total Topped Up: <strong>S${{ totalTopupSpend }}</strong> · {{ merchantStore.topupHistory.length }} transactions
          </div>
          <div v-if="merchantStore.topupHistory.length===0" class="empty-state">
            <div style="font-size:32px;margin-bottom:8px">💳</div>No top-ups yet.
          </div>
          <div class="hist-item" v-for="t in merchantStore.topupHistory" :key="t.id">
            <div class="hist-icon">💳</div>
            <div class="hist-info">
              <div class="hist-name">Credit Top-Up</div>
              <div class="hist-meta">{{ t.date }}</div>
            </div>
            <div class="hist-right">
              <div class="hist-amount" style="color:#00695c">+{{ t.credits.toLocaleString() }} credits</div>
              <div class="hist-credits" style="color:#0277bd">S${{ t.amountSGD }}</div>
            </div>
          </div>
        </div>

        <!-- Ad spend history -->
        <div v-if="salesTab==='ads'" style="padding:0 16px 16px">
          <div class="hist-summary">
            Total Ad Spend: <strong>{{ totalAdViews }} views</strong> · {{ totalAdViews }} credits used
          </div>
          <div v-if="merchantStore.ads.length===0" class="empty-state">
            <div style="font-size:32px;margin-bottom:8px">📢</div>No ad campaigns yet.
          </div>
          <div class="hist-item" v-for="a in merchantStore.ads" :key="a.id">
            <div class="hist-icon">📢</div>
            <div class="hist-info">
              <div class="hist-name">{{ a.title }}</div>
              <div class="hist-meta">Budget: {{ a.budget }} credits · Used: {{ a.used || 0 }}</div>
            </div>
            <div class="hist-right">
              <div class="hist-amount" style="color:#5e35b1">{{ a.used || 0 }} views</div>
              <div class="hist-credits">{{ a.active ? '🟢 Active' : '⏸ Paused' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TOP UP ── -->
      <div v-if="tab === 'topup'" class="tab-body">
        <div class="topup-hero">
          <div class="topup-bal-label">Current Balance</div>
          <div class="topup-bal">{{ merchantStore.credits.toLocaleString() }} <span style="font-size:14px">credits</span></div>
          <div class="topup-rate">1 credit = S$1 · Fixed price · No discounts</div>
        </div>

        <div style="padding:0 16px">
          <!-- Pack selection -->
          <div class="pack-grid">
            <div v-for="p in CREDIT_PACKS" :key="p.credits"
              class="pack-card" :class="{ selected: selectedPack?.credits === p.credits }"
              @click="selectedPack = p">
              <div v-if="p.popular" class="popular-tag">🔥 Popular</div>
              <div class="pack-credits">{{ p.credits.toLocaleString() }}</div>
              <div class="pack-credits-label">Credits</div>
              <div class="pack-price">S${{ Number(p.price).toLocaleString() }}</div>
              <div class="pack-rate">S$1 / credit</div>
            </div>
          </div>

          <div v-if="selectedPack" class="topup-summary">
            <div class="topup-sum-row"><span>{{ selectedPack.credits.toLocaleString() }} credits</span><strong>S${{ Number(selectedPack.price).toLocaleString() }}</strong></div>
            <div class="topup-sum-row" style="opacity:.6;font-size:11px"><span>Rate</span><span>S$1 per credit · No discount</span></div>
          </div>

          <!-- Payment method buttons -->
          <div v-if="selectedPack" class="payment-method-row">
            <div class="pay-label">Choose Payment Method</div>
            <button class="pay-method-btn bank-btn" @click="openBankTransfer">
              🏦 Bank Transfer
              <span class="pay-method-sub">Upload receipt</span>
            </button>
            <button class="pay-method-btn stripe-btn" @click="openStripe">
              💳 Credit / Debit Card
              <span class="pay-method-sub">Pay securely online</span>
            </button>
          </div>

          <div v-if="topupSuccess" class="topup-success">✅ {{ topupSuccess }}</div>

          <!-- Top-up history -->
          <div v-if="merchantStore.topupHistory.length" style="margin-top:16px">
            <div style="font-size:12px;font-weight:800;color:#5a6080;margin-bottom:8px">Recent Top-Ups</div>
            <div class="hist-item" v-for="t in merchantStore.topupHistory.slice(0,5)" :key="t.id">
              <div>
                <div class="hist-title">{{ t.credits.toLocaleString() }} credits</div>
                <div class="hist-meta">{{ t.date }} · {{ t.method || 'Bank Transfer' }}</div>
              </div>
              <div>
                <div class="hist-amount" style="color:#00695c">+{{ t.credits.toLocaleString() }}</div>
                <div class="hist-credits" style="color:#0277bd">S${{ t.amountSGD }}</div>
              </div>
            </div>
          </div>

          <!-- How credits are used -->
          <div class="credit-usage-card">
            <div class="cu-title">💡 How credits are used</div>
            <div class="cu-row"><span>📢 Ad view</span><span><strong>0.01 credit</strong> per view</span></div>
            <div class="cu-row" style="opacity:.5;font-size:10px;padding:2px 0;border:none"><span>→ 100 credits = 10,000 views</span></div>
            <div class="cu-row" style="border-top:1px solid #f0eeff;margin-top:4px;padding-top:8px">
              <span>🥚 Bronze egg (customer buys S$100)</span><span><strong>20 credits</strong></span></div>
            <div class="cu-row"><span>🥚 Silver egg (customer buys S$100)</span><span><strong>25 credits</strong></span></div>
            <div class="cu-row"><span>🥚 Gold egg (customer buys S$100)</span><span><strong>30 credits</strong></span></div>
            <div class="cu-row"><span>🥚 Diamond egg (customer buys S$100)</span><span><strong>35 credits</strong></span></div>
            <div class="cu-row"><span>🥚 Mystic egg (customer buys S$100)</span><span><strong>40 credits</strong></span></div>
          </div>
        </div>
      </div>

      <!-- ── ADS ── -->
      <div v-if="tab === 'ads'" class="tab-body">
        <div class="ads-info-bar">
          📢 Video ads play while players feed their monsters. Cost: <strong>0.01 credit per view</strong> — 100 credits = 10,000 views
        </div>

        <div style="padding:0 16px">
          <button class="add-ad-btn" @click="openAddAd">+ Create Ad Campaign</button>

          <div v-if="merchantStore.ads.length===0" class="empty-state" style="margin-top:16px">
            <div style="font-size:36px;margin-bottom:8px">🎬</div>
            No ad campaigns yet. Create one to reach players!
          </div>

          <div class="ad-card" v-for="(a,i) in merchantStore.ads" :key="a.id">
            <div class="ad-preview">
              <video v-if="a.video" :src="a.video" class="ad-video" muted loop autoplay playsinline />
              <div v-else class="ad-nope">🎬</div>
            </div>
            <div class="ad-body">
              <div class="ad-title">{{ a.title }}</div>
              <!-- Approval status badge -->
              <div class="ad-approval-badge"
                :class="a.adStatus==='approved' ? 'approval-ok' : a.adStatus==='rejected' ? 'approval-rej' : 'approval-pend'">
                {{ a.adStatus==='approved' ? '✅ Approved — Live' : a.adStatus==='rejected' ? '❌ Rejected by admin' : '⏳ Pending admin review' }}
              </div>
              <div class="ad-stats-row">
                <span class="ad-stat-chip blue">Budget: {{ a.budget.toLocaleString() }} credits</span>
                <span class="ad-stat-chip green">Used: {{ a.used || 0 }}</span>
              </div>
              <!-- Budget bar -->
              <div class="budget-bar-wrap">
                <div class="budget-bar-fill"
                  :style="{ width: Math.min(100, ((a.used||0)/Math.max(1,a.budget))*100) + '%',
                            background: (a.used||0)>=a.budget ? '#ef5350' : '#7c4dff' }">
                </div>
              </div>
              <div class="ad-sub">{{ a.used||0 }} / {{ a.budget }} credits used</div>
              <div style="display:flex;gap:8px;margin-top:8px">
                <button class="ad-btn ad-btn-edit" @click="openEditAd(i)">✏️ Edit</button>
                <button class="ad-btn ad-btn-del" @click="deleteAd(i)">🗑</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── SETTINGS ── -->
      <div v-if="tab === 'settings'" class="tab-body">
        <div style="padding:0 16px 16px">

          <!-- Logo -->
          <div class="settings-card">
            <div class="set-label">Store Logo</div>
            <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
              <img v-if="settings.logo" :src="settings.logo" class="logo-preview" />
              <div v-else class="logo-placeholder">🏪</div>
              <label class="upload-btn">
                📁 Upload Logo
                <input type="file" accept="image/*" style="display:none" @change="uploadLogo" />
              </label>
              <button v-if="settings.logo" class="btn-remove" @click="settings.logo=''">Remove</button>
            </div>
          </div>

          <!-- Store Name (read-only info, editable display name) -->
          <div class="settings-card">
            <div class="set-label">Store Display Name</div>
            <input class="set-input" v-model="settings.name" placeholder="Your Store Name" />
          </div>

          <!-- Description -->
          <div class="settings-card">
            <div class="set-label">Store Description</div>
            <textarea class="set-input" v-model="settings.description" rows="3"
              placeholder="Tell customers about your store…" style="resize:none" />
          </div>

          <!-- Tax Toggle -->
          <div class="settings-card">
            <div class="set-label">🧾 Transaction Tax</div>
            <div class="tax-toggle-row">
              <div>
                <div style="font-size:13px;font-weight:800;color:#1a1f3c">Charge tax on platform fee</div>
                <div style="font-size:11px;color:#90a4ae;margin-top:2px">
                  Country tax rate: <strong>{{ (getCountryTaxRate()*100).toFixed(1) }}%</strong>
                  ({{ merchantStore.info?.country }})
                </div>
              </div>
              <div class="toggle-wrap" :class="{ 'toggle-on': settings.taxEnabled }" @click="settings.taxEnabled=!settings.taxEnabled">
                <div class="toggle-knob"></div>
              </div>
            </div>
            <div class="tax-mode-chip" :class="settings.taxEnabled ? 'tax-on' : 'tax-off'">
              {{ settings.taxEnabled ? '✅ With Tax' : '⭕ Without Tax' }}
            </div>
          </div>

          <!-- Fee Breakdown Preview -->
          <div class="settings-card" style="background:#f5f0ff;border-color:#d4c8ff">
            <div class="set-label" style="color:#5e35b1">💰 Credit Deduction Preview (per S$100 sale)</div>
            <div class="fee-row"><span>Customer pays</span><strong>S$100.00</strong></div>
            <div class="fee-row">
              <span>🥚 Egg reward ({{ (sampleDeduction.pct*100).toFixed(0) }}%)</span>
              <strong>S${{ sampleDeduction.gross.toFixed(2) }}</strong>
            </div>
            <div class="fee-row" v-if="settings.taxEnabled" style="color:#00695c">
              <span>− Tax deducted ({{ (getCountryTaxRate()*100).toFixed(1) }}%)</span>
              <strong>− S${{ sampleDeduction.taxAmt.toFixed(2) }}</strong>
            </div>
            <div class="fee-row" style="font-size:13px;font-weight:800;background:#ede7ff;border-radius:8px;padding:8px 10px;margin-top:6px;border:none">
              <span>Credits deducted from balance</span>
              <strong style="color:#5e35b1">{{ sampleDeduction.net.toFixed(2) }} credits</strong>
            </div>
            <div style="font-size:10px;color:#9e9e9e;margin-top:8px">
              No platform fee. Tax is <em>deducted</em> from your charge when enabled.
            </div>
          </div>

          <!-- Fixed info (read-only) -->
          <div class="settings-card" style="background:#f8f9ff">
            <div class="set-label">🔒 Fixed Store Info</div>
            <div class="fixed-row"><span>Country</span><strong>{{ merchantStore.info?.country }}</strong></div>
            <div class="fixed-row"><span>Currency</span><strong>{{ merchantStore.info?.currency }}</strong></div>
            <div class="fixed-row"><span>Phone</span><strong>{{ merchantStore.info?.phone }}</strong></div>
            <div class="fixed-row"><span>Email</span><strong>{{ merchantEmail }}</strong></div>
            <div class="fixed-row"><span>Merchant Code</span><strong>{{ merchantStore.info?.merchantCode }}</strong></div>
            <div style="font-size:10px;color:#aaa;margin-top:6px">These cannot be changed. Contact admin to update.</div>
          </div>

          <button class="save-btn" @click="saveSettings">💾 Save Settings</button>
          <button class="logout-btn" @click="logout">Sign Out</button>
        </div>
      </div>

    </div><!-- end scroll-content -->

    <!-- BOTTOM NAV -->
    <div class="bottom-nav">
      <div v-for="n in NAV" :key="n.id" class="nav-item" :class="{ active: tab===n.id }" @click="tab=n.id">
        <div class="nav-icon-wrap">
          <div class="nav-icon">{{ n.icon }}</div>
          <span v-if="n.id === 'home' && pendingEggsList.length" class="nav-badge">{{ pendingEggsList.length }}</span>
        </div>
        <div class="nav-label">{{ n.label }}</div>
      </div>
    </div>

    <!-- ═══ DISPUTE MODAL ═══ -->
    <div v-if="disputeModal" class="modal-overlay" @click.self="disputeModal=null">
      <div class="modal-box">
        <div class="modal-title">⚠️ Raise a Dispute <span class="modal-close" @click="disputeModal=null">✕</span></div>
        <div style="font-size:12px;font-weight:700;color:#5a6080;margin-bottom:14px;background:#fff8e1;border-radius:10px;padding:10px 12px">
          📋 <strong>{{ disputeModal.player }}</strong> · {{ disputeModal.amount }} · {{ disputeModal.tier }} egg<br>
          <span style="font-size:11px;color:#90a4ae">Submitted: {{ disputeModal.time }}</span>
        </div>
        <div class="mfield">
          <label>Reason for dispute</label>
          <textarea class="minput" v-model="disputeReason" rows="4"
            placeholder="e.g. Customer did not actually make this purchase, amount entered is incorrect..." style="resize:none" />
        </div>
        <div style="font-size:11px;font-weight:700;color:#e65100;background:#fff3e0;border-radius:10px;padding:10px;margin-top:8px">
          ⚠️ Admin will review your dispute within 48 hours. The player's egg will be placed on hold during review.
        </div>
        <div class="modal-footer">
          <button class="btn-gray" @click="disputeModal=null">Cancel</button>
          <button class="btn-primary" style="background:#e65100" @click="submitDispute">Submit Dispute →</button>
        </div>
      </div>
    </div>

    <!-- ═══ AD MODAL ═══ -->
    <div v-if="adModal" class="modal-overlay" @click.self="adModal=null">
      <div class="modal-box">
        <div class="modal-title">{{ adModal._isNew ? '➕ New Ad Campaign' : '✏️ Edit Campaign' }}
          <span class="modal-close" @click="adModal=null">✕</span>
        </div>

        <div class="mfield">
          <label>Campaign Title</label>
          <input class="minput" v-model="adModal.title" placeholder="e.g. Weekend Sale!" />
        </div>

        <div class="mfield">
          <label>Budget (credits) <span class="mhint">0.01 credit per view</span></label>
          <input class="minput" type="number" v-model.number="adModal.budget" min="1" step="10" />
          <div style="font-size:11px;color:#888;margin-top:4px">
            Estimated reach: ~{{ Math.floor((adModal.budget||0) / AD_CREDIT_PER_VIEW).toLocaleString() }} views · Cost: S${{ (adModal.budget||0).toFixed(2) }}
          </div>
        </div>

        <div class="mfield">
          <label>Video Ad <span style="font-size:10px;color:#e65100">Required · MP4 recommended</span></label>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px">
            <video v-if="adModal.video" :src="adModal.video"
              style="height:80px;max-width:160px;border-radius:10px;border:2px solid #e8eaf0;object-fit:cover"
              muted loop autoplay playsinline />
            <div v-else class="ad-upload-placeholder">🎬</div>
            <label class="upload-btn">
              🎬 Upload Video
              <input type="file" accept="video/*" style="display:none" @change="uploadAdVideo" />
            </label>
            <button v-if="adModal.video" class="btn-remove" @click="adModal.video=''">Remove</button>
          </div>
          <div style="font-size:10px;color:#aaa;margin-top:4px">Max 500 MB. Plays muted during monster feeding.</div>
        </div>

        <div v-if="adError" class="error-msg">{{ adError }}</div>

        <div class="modal-footer">
          <button class="btn-gray" @click="adModal=null">Cancel</button>
          <button class="btn-primary" @click="saveAd">{{ adModal._isNew ? 'Launch Campaign' : 'Save Changes' }}</button>
        </div>
      </div>
    </div>

    <!-- ═══ BANK TRANSFER MODAL ═══ -->
    <div v-if="bankModal" class="modal-overlay" @click.self="bankModal=false">
      <div class="modal-box">
        <div class="modal-title">🏦 Bank Transfer <span class="modal-close" @click="bankModal=false">✕</span></div>
        <div class="topup-sum-row" style="margin-bottom:14px">
          <span>Amount to transfer</span><strong style="color:#00897b">S${{ Number(selectedPack?.price||0).toLocaleString() }}</strong>
        </div>

        <div class="bank-details-card">
          <div class="bd-title">Transfer to this account</div>
          <div class="bd-row"><span>Bank</span><strong>DBS Bank Singapore</strong></div>
          <div class="bd-row"><span>Account Name</span><strong>HATCHME PTE LTD</strong></div>
          <div class="bd-row"><span>Account No.</span><strong>028-902345-6</strong></div>
          <div class="bd-row"><span>Reference</span><strong>{{ merchantEmail }}</strong></div>
          <div style="font-size:10px;color:#e65100;margin-top:8px;font-weight:700">⚠️ Include your email as the payment reference</div>
        </div>

        <div class="mfield" style="margin-top:14px">
          <label>Upload Payment Receipt <span style="color:#e65100;font-size:10px">Required</span></label>
          <div style="margin-top:8px">
            <img v-if="bankReceipt" :src="bankReceipt" style="width:100%;max-height:160px;object-fit:contain;border-radius:10px;border:2px solid #e8f5e9;margin-bottom:8px" />
            <label class="upload-btn" style="display:inline-block">
              📷 {{ bankReceipt ? 'Change Receipt' : 'Upload Screenshot' }}
              <input type="file" accept="image/*" style="display:none" @change="uploadReceipt" />
            </label>
          </div>
        </div>

        <div v-if="bankError" class="error-msg">{{ bankError }}</div>
        <div class="modal-footer">
          <button class="btn-gray" @click="bankModal=false">Cancel</button>
          <button class="btn-primary" style="background:#00897b" @click="submitBankTransfer" :disabled="bankSubmitting">
            {{ bankSubmitting ? 'Submitting...' : '📤 Submit for Review →' }}
          </button>
        </div>
        <div style="font-size:10px;color:#aaa;text-align:center;margin-top:10px">Credits will be added within 1 business day after admin verification.</div>
      </div>
    </div>

    <!-- ═══ STRIPE / CARD MODAL ═══ -->
    <div v-if="stripeModal" class="modal-overlay" @click.self="stripeModal=false">
      <div class="modal-box">
        <div class="modal-title">💳 Card Payment <span class="modal-close" @click="stripeModal=false">✕</span></div>
        <div class="topup-sum-row" style="margin-bottom:16px">
          <span>{{ selectedPack?.credits?.toLocaleString() }} credits</span>
          <strong style="color:#5e35b1">S${{ Number(selectedPack?.price||0).toLocaleString() }}</strong>
        </div>

        <div class="mfield">
          <label>Card Number</label>
          <input class="minput" v-model="card.number" placeholder="1234 5678 9012 3456" maxlength="19"
            @input="card.number = card.number.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="mfield">
            <label>Expiry</label>
            <input class="minput" v-model="card.expiry" placeholder="MM/YY" maxlength="5"
              @input="card.expiry = card.expiry.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'$1/$2')" />
          </div>
          <div class="mfield">
            <label>CVC</label>
            <input class="minput" v-model="card.cvc" placeholder="123" maxlength="4" type="password" />
          </div>
        </div>
        <div class="mfield">
          <label>Name on Card</label>
          <input class="minput" v-model="card.name" placeholder="JOHN DOE" style="text-transform:uppercase" />
        </div>

        <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:#888;margin:8px 0;font-weight:700">
          🔒 Secured by Stripe · 256-bit SSL encryption
        </div>

        <div v-if="stripeError" class="error-msg">{{ stripeError }}</div>
        <div class="modal-footer">
          <button class="btn-gray" @click="stripeModal=false">Cancel</button>
          <button class="btn-primary" style="background:#5e35b1" @click="submitCard" :disabled="cardProcessing">
            {{ cardProcessing ? 'Processing...' : `Pay S$${Number(selectedPack?.price||0).toLocaleString()} →` }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { merchantStore } from '@/store/merchantStore.js'
import { MerchantDB } from '@/api/db.js'
import { useAutoRefresh } from '@/composables/useAutoRefresh.js'

const router = useRouter()
merchantStore.load()

// ── LIVE REFRESH every 30 s — reloads from DB so admin credit changes appear ──
const tick = useAutoRefresh(30000)
const liveToast = ref('')

async function refreshFromDB() {
  try {
    const res = await MerchantDB.get(merchantEmail)
    if (!res || res.error) return
    // Preserve local ad videos and logo — they are NOT stored in DB (too large)
    const localAdVideos = {}
    merchantStore.ads.forEach(a => { if (a.video) localAdVideos[a.id] = a.video })
    const localLogo = localStorage.getItem(`merchantLogo_${merchantEmail}`) || ''
    if (res.data) {
      merchantStore._apply(res.data)
      // Restore videos and logo into the freshly-applied store
      merchantStore.ads.forEach(a => { if (localAdVideos[a.id]) a.video = localAdVideos[a.id] })
      if (localLogo && merchantStore.info) merchantStore.info.logo = localLogo
    }
    // Status is a separate DB column — always override from the authoritative DB value
    if (res.status) merchantStore.status = res.status
    // Sync back to localStorage (include restored logo)
    const accounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
    accounts[merchantEmail] = {
      ...(res.data || {}),
      info: { ...(res.data?.info || {}), logo: localLogo },
      ads: merchantStore.ads,   // include videos for local cache
      status: res.status || merchantStore.status,
      passwordHash: (accounts[merchantEmail] || {}).passwordHash || '',
    }
    localStorage.setItem('merchantAccounts', JSON.stringify(accounts))
    // Allow settings panel to re-sync with restored logo
    settingsSynced = false
  } catch { /* offline — keep local data */ }
}
refreshFromDB() // immediate on mount

// Reload store + check for new pending eggs on every tick
let prevPendingCount = 0
watch(tick, async () => {
  await refreshFromDB()
  const count = pendingEggsList.value.length
  if (count > prevPendingCount && prevPendingCount >= 0) {
    liveToast.value = `🥚 New pending approval! (${count} waiting)`
    setTimeout(() => { liveToast.value = '' }, 4000)
  }
  prevPendingCount = count
}, { immediate: false })

const tab      = ref('home')
const salesTab = ref('scans')
const copied   = ref(false)

const merchantEmail = localStorage.getItem('merchantAuth') || ''

const NAV = [
  { id:'home',     icon:'🏠', label:'Home'    },
  { id:'sales',    icon:'📋', label:'Sales'   },
  { id:'topup',    icon:'💳', label:'Top Up'  },
  { id:'ads',      icon:'📢', label:'Ads'     },
  { id:'settings', icon:'⚙️', label:'Settings'},
]

const TIERS = ['Bronze','Silver','Gold','Diamond','Mystic']

// ── CREDIT PACKS — fixed S$1 per credit, no discounts ──
const CREDIT_PACKS = [
  { credits: 100,  price: '100',  popular: false },
  { credits: 500,  price: '500',  popular: true  },
  { credits: 1000, price: '1000', popular: false },
  { credits: 5000, price: '5000', popular: false },
]

// % of purchase amount deducted as credits based on egg tier
const EGG_TIER_PCT = { Bronze:0.20, Silver:0.25, Gold:0.30, Diamond:0.35, Mystic:0.40 }

// Ads cost 0.01 credit per view
const AD_CREDIT_PER_VIEW = 0.01

// Get merchant's country tax rate
function getCountryTaxRate() {
  const country = merchantStore.info?.country || 'SG'
  const rates = JSON.parse(localStorage.getItem('adminTaxRates') || 'null')
  if (rates) {
    const found = rates.find(r => r.code === country)
    if (found) return found.rate / 100
  }
  const DEFAULTS = { SG:0.09, MY:0.06, ID:0.11, TH:0.07, PH:0.12, AU:0.10, US:0, GB:0.20 }
  return DEFAULTS[country] ?? 0.09
}

// Compute credits deducted for a transaction
// Formula: purchaseAmt × eggPct — then deduct tax portion (if enabled)
// taxEnabled = credits reduced by taxRate (tax is excluded from the charge)
function calcDeduction(purchaseAmt, eggTier, taxEnabled) {
  const pct     = EGG_TIER_PCT[eggTier] || 0.20
  const taxRate = getCountryTaxRate()
  const gross   = purchaseAmt * pct
  const taxAmt  = taxEnabled ? gross * taxRate : 0
  const net     = gross - taxAmt          // tax deducted → merchant pays less
  return { gross, taxAmt, net, pct, taxRate }
}

const selectedPack = ref(null)
const topupSuccess = ref('')

// ── BANK TRANSFER ──
const bankModal     = ref(false)
const bankReceipt   = ref('')
const bankError     = ref('')
const bankSubmitting= ref(false)

function openBankTransfer() { bankModal.value = true; bankReceipt.value = ''; bankError.value = '' }
function uploadReceipt(e) {
  const file = e.target.files[0]; if (!file) return
  const r = new FileReader()
  r.onload = ev => { bankReceipt.value = ev.target.result }
  r.readAsDataURL(file)
}
async function submitBankTransfer() {
  if (!bankReceipt.value) { bankError.value = 'Please upload your payment receipt.'; return }
  bankSubmitting.value = true
  try {
    const req = {
      id: Date.now(), type: 'bank_transfer', credits: selectedPack.value.credits,
      amountSGD: selectedPack.value.price, receipt: bankReceipt.value,
      status: 'pending', submittedAt: new Date().toLocaleString(),
    }
    const existing = merchantStore.info?.pendingTopups || []
    if (!merchantStore.info) merchantStore.info = {}
    merchantStore.info.pendingTopups = [...existing, req]
    await merchantStore.save()
    bankModal.value = false
    selectedPack.value = null
    topupSuccess.value = '✅ Transfer submitted! Credits will be added after admin verification (within 1 business day).'
    setTimeout(() => { topupSuccess.value = '' }, 6000)
  } catch { bankError.value = 'Submission failed. Please try again.' }
  finally { bankSubmitting.value = false }
}

// ── STRIPE / CARD ──
const stripeModal    = ref(false)
const stripeError    = ref('')
const cardProcessing = ref(false)
const card           = reactive({ number:'', expiry:'', cvc:'', name:'' })

function openStripe() { stripeModal.value = true; stripeError.value = ''; Object.assign(card,{number:'',expiry:'',cvc:'',name:''}) }
async function submitCard() {
  stripeError.value = ''
  if (!card.number.replace(/\s/g,'') || card.number.replace(/\s/g,'').length < 16) { stripeError.value = 'Please enter a valid 16-digit card number.'; return }
  if (!card.expiry || card.expiry.length < 5) { stripeError.value = 'Please enter a valid expiry date.'; return }
  if (!card.cvc || card.cvc.length < 3) { stripeError.value = 'Please enter a valid CVC.'; return }
  if (!card.name.trim()) { stripeError.value = 'Please enter the name on your card.'; return }
  cardProcessing.value = true
  const pack = selectedPack.value
  // Simulate payment processing delay
  await new Promise(r => setTimeout(r, 2000))
  try {
    merchantStore.topup(pack.credits, pack.price)
    if (merchantStore.topupHistory[0]) merchantStore.topupHistory[0].method = 'Card'
    merchantStore.save()
    stripeModal.value = false
    selectedPack.value = null
    topupSuccess.value = `✅ Payment successful! ${pack.credits.toLocaleString()} credits added to your account.`
    setTimeout(() => { topupSuccess.value = '' }, 5000)
  } catch { stripeError.value = 'Payment failed. Please try again.' }
  finally { cardProcessing.value = false }
}

const totalRevenue = computed(() =>
  merchantStore.scans.reduce((s, x) => s + (x.amountSGD || 0), 0).toFixed(2)
)
const totalTopupSpend = computed(() =>
  merchantStore.topupHistory.reduce((s, x) => s + Number(x.amountSGD || 0), 0).toFixed(2)
)
const totalAdViews = computed(() =>
  merchantStore.ads.reduce((s, a) => s + (a.used || 0), 0)
)

// QR code for purchase — encodes merchant email
const purchaseQrUrl = computed(() => {
  const data = `HATCHME:PURCHASE:${merchantEmail}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&margin=10`
})

function copyCode(code) {
  if (!code) return
  navigator.clipboard.writeText(code).catch(() => {})
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}


// ── SETTINGS ──
const settings = reactive({
  name:        merchantStore.info?.name        || '',
  logo:        merchantStore.info?.logo        || '',
  description: merchantStore.info?.description || '',
  eggTier:     merchantStore.info?.eggTier     || 'Bronze',
  taxEnabled:  merchantStore.info?.taxEnabled  ?? true,
})

// Keep settings in sync when merchantStore.info first loads (or reloads)
let settingsSynced = false
watch(() => merchantStore.info, (info) => {
  if (!info) return
  // Only auto-sync if user hasn't started editing (first sync) OR if not on settings tab
  if (!settingsSynced) {
    settings.name        = info.name        || ''
    settings.logo        = info.logo        || ''
    settings.description = info.description || ''
    settings.eggTier     = info.eggTier     || 'Bronze'
    settings.taxEnabled  = info.taxEnabled  ?? true
    settingsSynced = true
  }
})

// Live deduction preview for settings (based on S$100 example)
const sampleDeduction = computed(() => calcDeduction(100, settings.eggTier, settings.taxEnabled))

function uploadLogo(e) {
  const file = e.target.files[0]
  if (!file) return
  const r = new FileReader()
  r.onload = ev => { settings.logo = ev.target.result }
  r.readAsDataURL(file)
}

function saveSettings() {
  if (!merchantStore.info) { alert('❌ Not logged in. Please refresh and try again.'); return }
  merchantStore.info.name        = settings.name
  merchantStore.info.logo        = settings.logo
  merchantStore.info.description = settings.description
  merchantStore.info.eggTier     = settings.eggTier
  merchantStore.info.taxEnabled  = settings.taxEnabled
  merchantStore.save()
  // Prevent the next tick from overwriting our just-saved settings
  settingsSynced = true
  alert('✅ Settings saved!')
}

// ── ADS ──
const adModal = ref(null)
const adError = ref('')

function openAddAd() {
  adModal.value = { title:'', video:'', budget:1000, active:true, used:0, id:Date.now(), _isNew:true }
}
function openEditAd(i) {
  adModal.value = { ...JSON.parse(JSON.stringify(merchantStore.ads[i])), _idx: i, _isNew: false }
}
function uploadAdVideo(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 500 * 1024 * 1024) { adError.value = 'Video must be under 500 MB.'; return }
  const r = new FileReader()
  r.onload = ev => { adModal.value.video = ev.target.result }
  r.readAsDataURL(file)
}
function saveAd() {
  adError.value = ''
  const a = adModal.value
  if (!a.title.trim()) { adError.value = 'Please enter a campaign title.'; return }
  if (!a.video)        { adError.value = 'Please upload a video.'; return }
  if (!a.budget || a.budget < 1) { adError.value = 'Minimum budget is 1 credit.'; return }
  if (a.budget > merchantStore.credits) { adError.value = `Insufficient credits. You have ${merchantStore.credits} credits.`; return }

  if (a._isNew) {
    merchantStore.credits -= a.budget  // reserve budget
    merchantStore.ads.push({
      id: a.id||Date.now(), title: a.title, video: a.video,
      budget: a.budget, used: 0, active: false,
      adStatus: 'pending_review',  // requires admin approval before going live
      merchantEmail, merchantName: merchantStore.info?.name || merchantEmail,
    })
  } else {
    const oldBudget = merchantStore.ads[a._idx]?.budget || 0
    const diff = a.budget - oldBudget
    if (diff > merchantStore.credits) { adError.value = 'Insufficient credits for increased budget.'; return }
    merchantStore.credits -= diff
    // Keep existing adStatus when editing; reset to pending_review if video/title changed
    const prev = merchantStore.ads[a._idx]
    const changed = prev.title !== a.title || !prev.video !== !a.video
    merchantStore.ads[a._idx] = {
      ...prev, title: a.title, video: a.video, budget: a.budget,
      adStatus: changed ? 'pending_review' : (prev.adStatus || 'pending_review'),
    }
  }
  merchantStore.save()
  adModal.value = null
}
function toggleAd(i) {
  merchantStore.ads[i].active = !merchantStore.ads[i].active
  merchantStore.save()
}
function deleteAd(i) {
  if (!confirm('Delete this ad campaign? Unused budget will be refunded.')) return
  const ad = merchantStore.ads[i]
  const refund = Math.max(0, ad.budget - (ad.used || 0))
  merchantStore.credits += refund
  merchantStore.ads.splice(i, 1)
  merchantStore.save()
}

// ── PENDING EGG APPROVALS (live) ──
const pendingEggsList = computed(() => {
  tick.value // live dependency
  const all = JSON.parse(localStorage.getItem('pendingEggs') || '[]')
  return all.filter(e => e.merchantEmail === merchantEmail && e.status === 'pending')
})

function getAllPendingEggs() {
  return JSON.parse(localStorage.getItem('pendingEggs') || '[]')
}

function getEggStatus(scanId) {
  const all = getAllPendingEggs()
  const egg = all.find(e => e.id === scanId)
  return egg ? egg.status : null
}

function approveEgg(egg) {
  // Give egg to player account
  const playerAccounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  const playerKey = egg.playerEmail
  let addedEggId = null
  if (playerAccounts[playerKey]) {
    const eggs = playerAccounts[playerKey].eggs || []
    addedEggId = eggs.length ? Math.max(...eggs.map(e => e.id || 0)) + 1 : 1
    eggs.push({ ...egg.eggData, id: addedEggId })
    playerAccounts[playerKey].eggs = eggs
    // Notify player
    const notifs = playerAccounts[playerKey].notifications || []
    const notifId = notifs.length ? Math.max(...notifs.map(n => n.id || 0)) + 1 : 1
    notifs.push({ id: notifId, icon: '🥚', title: `${egg.eggTier} Egg Approved!`,
      body: `Your egg from ${egg.merchantName} has been approved and is now hatching!`,
      time: new Date().toLocaleString(), read: false })
    playerAccounts[playerKey].notifications = notifs
    localStorage.setItem('playerAccounts', JSON.stringify(playerAccounts))
  }

  // Record scan in merchant account
  const mAccounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
  if (mAccounts[merchantEmail]) {
    mAccounts[merchantEmail].scans = mAccounts[merchantEmail].scans || []
    mAccounts[merchantEmail].scans.push({
      id:        egg.id,
      player:    egg.playerName,
      avatar:    egg.playerAvatar,
      tier:      egg.eggTier,
      amount:    `${egg.currency} ${egg.amount.toFixed(2)}`,
      amountSGD: egg.amountSGD,
      credits:   egg.credits,
      time:      egg.createdAt,
    })
    localStorage.setItem('merchantAccounts', JSON.stringify(mAccounts))
    merchantStore.load()
  }

  // Update pendingEgg status
  const all = getAllPendingEggs()
  const idx = all.findIndex(e => e.id === egg.id)
  if (idx >= 0) {
    all[idx].status     = 'approved'
    all[idx].approvedAt = new Date().toLocaleString()
    all[idx].addedEggId = addedEggId
    localStorage.setItem('pendingEggs', JSON.stringify(all))
  }
}

function rejectEgg(egg) {
  // Refund credits to merchant
  const mAccounts = JSON.parse(localStorage.getItem('merchantAccounts') || '{}')
  if (mAccounts[merchantEmail]) {
    mAccounts[merchantEmail].credits = (mAccounts[merchantEmail].credits || 0) + egg.credits
    localStorage.setItem('merchantAccounts', JSON.stringify(mAccounts))
    merchantStore.load()
  }

  // Notify player
  const playerAccounts = JSON.parse(localStorage.getItem('playerAccounts') || '{}')
  if (playerAccounts[egg.playerEmail]) {
    const notifs = playerAccounts[egg.playerEmail].notifications || []
    const notifId = notifs.length ? Math.max(...notifs.map(n => n.id || 0)) + 1 : 1
    notifs.push({ id: notifId, icon: '❌', title: 'Purchase Rejected',
      body: `Your purchase at ${egg.merchantName} was not approved. Credits have been released.`,
      time: new Date().toLocaleString(), read: false })
    playerAccounts[egg.playerEmail].notifications = notifs
    localStorage.setItem('playerAccounts', JSON.stringify(playerAccounts))
  }

  // Update pendingEgg status
  const all = getAllPendingEggs()
  const idx = all.findIndex(e => e.id === egg.id)
  if (idx >= 0) {
    all[idx].status     = 'rejected'
    all[idx].resolvedAt = new Date().toLocaleString()
    localStorage.setItem('pendingEggs', JSON.stringify(all))
  }
}

// ── DISPUTES ──
const disputeModal  = ref(null)
const disputeReason = ref('')

function openDispute(scan) {
  disputeModal.value = scan
  disputeReason.value = ''
}

function submitDispute() {
  if (!disputeReason.value.trim()) { alert('Please enter a reason for the dispute.'); return }
  const all = getAllPendingEggs()
  const idx = all.findIndex(e => e.id === disputeModal.value.id)
  if (idx >= 0) {
    all[idx].status        = 'disputed'
    all[idx].disputeReason = disputeReason.value.trim()
    all[idx].disputedAt    = new Date().toLocaleString()
    localStorage.setItem('pendingEggs', JSON.stringify(all))
  }
  disputeModal.value = null
  alert('✅ Dispute submitted. Admin will review within 48 hours.')
}

function logout() {
  localStorage.removeItem('merchantAuth')
  router.push('/merchant/login')
}
</script>

<style scoped>
.phone-shell   { display:flex; flex-direction:column; height:100vh; background:#f4fffe; font-family:'Nunito',sans-serif; overflow:hidden; }
.scroll-content{ flex:1; overflow-y:auto; }
.tab-body      { padding-bottom:20px; }

/* HEADER */
.m-header { background:linear-gradient(135deg,#00897b,#00acc1); padding:16px 16px 12px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
.header-logo { width:40px; height:40px; border-radius:10px; object-fit:cover; border:2px solid rgba(255,255,255,.4); }
.header-logo-placeholder { width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.35); display:flex; align-items:center; justify-content:center; font-size:20px; }
.header-store { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; }
.header-sub   { font-size:11px; font-weight:800; color:rgba(255,255,255,.7); margin-top:1px; }
.tier-badge   { background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.4); color:#fff; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800; }
.credits-pill { background:rgba(255,255,255,.25); border:2px solid rgba(255,255,255,.45); color:#fff; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:800; }

/* PENDING */
.pending-bar { background:#fff3e0; color:#e65100; font-size:11px; font-weight:800; padding:8px 16px; text-align:center; flex-shrink:0; }

/* STATS */
.stats-row { display:flex; background:#fff; border-bottom:2px solid #e0f7f4; }
.stat      { flex:1; display:flex; flex-direction:column; align-items:center; padding:14px 0; border-right:2px solid #e0f7f4; }
.stat:last-child { border-right:none; }
.stat-val   { font-family:'Fredoka One',cursive; font-size:17px; }
.stat-label { font-size:9px; font-weight:800; color:#90a4ae; text-transform:uppercase; letter-spacing:.3px; margin-top:2px; }

/* CARDS */
.card       { background:#fff; border-radius:18px; border:2px solid #e0f7f4; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,.04); }
.card-title { font-family:'Fredoka One',cursive; font-size:15px; color:#1a1f3c; margin-bottom:3px; }
.card-sub   { font-size:11px; font-weight:700; color:#90a4ae; margin-bottom:12px; }

/* QR */
.qr-wrap  { display:flex; justify-content:center; margin:12px 0 8px; }
.qr-img   { width:160px; height:160px; border-radius:12px; border:3px solid #e0f7f4; }
.qr-label { text-align:center; font-size:11px; font-weight:700; color:#90a4ae; margin-bottom:8px; }
.egg-reward-chip { text-align:center; font-size:12px; font-weight:800; color:#00695c; background:#e0f2f1; border-radius:10px; padding:7px 14px; }

/* REFERRAL */
.ref-code-box { display:flex; align-items:center; justify-content:space-between; background:#f4f0ff; border:2px dashed #b39ddb; border-radius:14px; padding:14px 16px; cursor:pointer; margin-top:10px; }
.ref-code   { font-family:'Fredoka One',cursive; font-size:22px; color:#5e35b1; letter-spacing:2px; }
.copy-hint  { font-size:11px; font-weight:800; color:#9e9e9e; }

/* SCANS */
.section-head { font-family:'Fredoka One',cursive; font-size:15px; color:#1a1f3c; padding:14px 16px 6px; display:flex; align-items:center; gap:8px; }
.scan-item    { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid #e0f7f4; }
.scan-avatar  { width:38px; height:38px; border-radius:10px; background:#e0f7f4; border:2px solid #b2dfdb; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.scan-info    { flex:1; }
.scan-name    { font-size:13px; font-weight:800; color:#1a1f3c; }
.scan-meta    { font-size:11px; font-weight:700; color:#90a4ae; margin-top:2px; }
.scan-amount  { text-align:right; }

/* PENDING COUNT BADGE */
.pending-count-badge { background:#e65100; color:#fff; font-size:10px; font-weight:800; padding:2px 7px; border-radius:10px; }

/* PENDING EGG ITEMS */
.pending-egg-item  { background:#fff8e1; border:2px solid #ffe082; border-radius:14px; padding:12px 14px; margin-bottom:10px; display:flex; align-items:flex-start; gap:10px; }
.pei-avatar        { width:38px; height:38px; border-radius:10px; background:#fff3e0; border:2px solid #ffcc80; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.pei-info          { flex:1; min-width:0; }
.pei-name          { font-size:13px; font-weight:800; color:#1a1f3c; }
.pei-meta          { font-size:11px; font-weight:700; color:#e65100; margin-top:2px; }
.pei-credits       { font-size:10px; font-weight:800; color:#bf360c; margin-top:2px; }
.pei-actions       { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
.pei-btn           { font-size:11px; font-weight:800; padding:6px 12px; border-radius:8px; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.pei-btn.approve   { background:#e8f5e9; color:#2e7d32; border:1.5px solid #a5d6a7; }
.pei-btn.reject    { background:#ffebee; color:#c62828; border:1.5px solid #ef9a9a; }

/* DISPUTE BADGES */
.dispute-badge         { font-size:9px; font-weight:800; padding:2px 7px; border-radius:6px; background:#ffebee; color:#c62828; display:inline-block; margin-top:3px; }
.dispute-badge.resolved{ background:#e8f5e9; color:#2e7d32; }
.dispute-badge.rejected{ background:#eceff1; color:#546e7a; }
.dispute-link          { background:none; border:1.5px solid #ffcc02; color:#e65100; font-size:10px; font-weight:800; border-radius:6px; padding:3px 8px; cursor:pointer; margin-top:4px; display:block; font-family:'Nunito',sans-serif; }

/* SUB TABS */
.sub-tabs { display:flex; gap:6px; padding:14px 16px 10px; }
.sub-tab  { padding:7px 16px; border-radius:10px; font-size:12px; font-weight:800; color:#5a6080; border:2px solid #e8eaf0; background:#fff; cursor:pointer; }
.sub-tab.active { background:#00897b; color:#fff; border-color:#00897b; }

/* HISTORY */
.hist-summary { font-size:11px; font-weight:800; color:#90a4ae; padding:4px 0 12px; }
.hist-item { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid #f0f8f7; }
.hist-icon { width:36px; height:36px; border-radius:10px; background:#f4f6ff; border:2px solid #e8eaf0; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
.hist-info { flex:1; }
.hist-name { font-size:13px; font-weight:800; color:#1a1f3c; }
.hist-meta { font-size:11px; font-weight:700; color:#90a4ae; margin-top:2px; }
.hist-right  { text-align:right; }
.hist-amount { font-size:13px; font-weight:800; color:#1a1f3c; }
.hist-credits{ font-size:11px; font-weight:700; color:#90a4ae; }

/* TOP UP */
.topup-hero { background:linear-gradient(135deg,#00897b,#00acc1); padding:24px 20px; text-align:center; margin-bottom:16px; }
.topup-bal-label { font-size:11px; font-weight:800; color:rgba(255,255,255,.7); text-transform:uppercase; letter-spacing:.5px; }
.topup-bal    { font-family:'Fredoka One',cursive; font-size:36px; color:#fff; margin:4px 0; }
.topup-rate   { font-size:11px; font-weight:800; color:rgba(255,255,255,.8); }
.pack-grid    { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
.pack-card    { border:2px solid #e0d7ff; border-radius:16px; padding:14px 12px; text-align:center; cursor:pointer; position:relative; transition:all .15s; background:#fff; }
.pack-card:hover { border-color:#7c4dff; }
.pack-card.selected { border-color:#7c4dff; background:#f5f0ff; box-shadow:0 0 0 3px rgba(124,77,255,.15); }
.popular-tag  { position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#00897b; color:#fff; font-size:8px; font-weight:800; padding:2px 8px; border-radius:6px; white-space:nowrap; border:2px solid #fff; }
.pack-credits { font-family:'Fredoka One',cursive; font-size:22px; color:#1a1f3c; }
.pack-credits-label { font-size:9px; font-weight:800; color:#90a4ae; text-transform:uppercase; letter-spacing:.4px; }
.pack-price   { font-family:'Fredoka One',cursive; font-size:16px; color:#00897b; margin-top:6px; }
.pack-rate    { font-size:10px; font-weight:700; color:#90a4ae; margin-top:4px; }
.topup-summary { background:#e0f2f1; border-radius:12px; padding:12px 16px; margin-bottom:12px; font-size:13px; font-weight:700; color:#00695c; }
.topup-success { background:#e8f5e9; border-radius:10px; padding:10px 14px; font-size:12px; font-weight:800; color:#2e7d32; text-align:center; margin-bottom:8px; }
.payment-method-row { margin-bottom:16px; }
.pay-label { font-size:12px; font-weight:800; color:#5a6080; margin-bottom:8px; }
.pay-method-btn { width:100%; padding:14px 16px; border-radius:14px; border:2px solid; cursor:pointer; font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; text-align:left; display:flex; flex-direction:column; gap:2px; margin-bottom:8px; transition:all .15s; }
.pay-method-sub { font-size:10px; font-weight:600; opacity:.75; }
.bank-btn { background:#e8f5e9; border-color:#00897b; color:#00695c; }
.bank-btn:hover { background:#c8e6c9; }
.stripe-btn { background:#ede7ff; border-color:#7c4dff; color:#4527a0; }
.stripe-btn:hover { background:#d1c4e9; }
.bank-details-card { background:#f1f8e9; border:2px solid #a5d6a7; border-radius:14px; padding:14px 16px; }
.bd-title { font-size:11px; font-weight:800; color:#2e7d32; margin-bottom:8px; text-transform:uppercase; letter-spacing:.5px; }
.bd-row { display:flex; justify-content:space-between; font-size:12px; font-weight:700; padding:4px 0; border-bottom:1px solid rgba(0,0,0,.06); color:#1a1f3c; }
.bd-row:last-child { border:none; }

/* ADS */
.ads-info-bar { background:#ede7ff; padding:10px 16px; font-size:12px; font-weight:700; color:#5e35b1; }
.add-ad-btn   { width:100%; padding:13px; border-radius:14px; background:#7c4dff; color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; margin:14px 0 4px; }
.ad-card      { background:#fff; border-radius:16px; border:2px solid #e8eaf0; padding:14px; margin-bottom:12px; display:flex; gap:12px; box-shadow:0 2px 6px rgba(0,0,0,.04); }
.ad-preview   { width:72px; height:72px; flex-shrink:0; border-radius:10px; overflow:hidden; background:#f4f6ff; display:flex; align-items:center; justify-content:center; }
.ad-video     { width:100%; height:100%; object-fit:cover; }
.ad-nope      { font-size:28px; }
.ad-body      { flex:1; min-width:0; }
.ad-title     { font-size:13px; font-weight:800; color:#1a1f3c; margin-bottom:4px; }
.ad-approval-badge { font-size:10px; font-weight:800; border-radius:8px; padding:3px 8px; display:inline-block; margin-bottom:6px; }
.approval-ok   { background:#e8f5e9; color:#2e7d32; }
.approval-pend { background:#fff8e1; color:#f57f17; }
.approval-rej  { background:#fce4ec; color:#c62828; }
.ad-stats-row { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:6px; }
.ad-stat-chip { font-size:10px; font-weight:800; padding:2px 8px; border-radius:7px; }
.blue  { background:#e3f2fd; color:#1565c0; }
.green { background:#e8f5e9; color:#2e7d32; }
.purple{ background:#ede7ff; color:#5e35b1; }
.gray  { background:#eceff1; color:#546e7a; }
.budget-bar-wrap { height:5px; background:#f0eeff; border-radius:10px; margin:4px 0; }
.budget-bar-fill { height:100%; border-radius:10px; transition:width .3s; }
.ad-sub  { font-size:10px; font-weight:700; color:#90a4ae; }
.ad-btn  { font-size:11px; font-weight:800; padding:4px 10px; border-radius:7px; border:1.5px solid; cursor:pointer; font-family:'Nunito',sans-serif; }
.ad-btn-play  { background:#e8f5e9; color:#2e7d32; border-color:#a5d6a7; }
.ad-btn-pause { background:#fff3e0; color:#e65100; border-color:#ffcc80; }
.ad-btn-edit  { background:#f5f0ff; color:#5e35b1; border-color:#d4c8ff; }
.ad-btn-del   { background:#ffebee; color:#c62828; border-color:#ef9a9a; }
.ad-upload-placeholder { width:72px; height:72px; background:#f4f6ff; border-radius:10px; border:2px dashed #d4c8ff; display:flex; align-items:center; justify-content:center; font-size:26px; }

/* SETTINGS */
.settings-card { background:#fff; border-radius:16px; border:2px solid #e8eaf0; padding:16px; margin-bottom:12px; box-shadow:0 2px 6px rgba(0,0,0,.04); }
.set-label { font-size:11px; font-weight:800; color:#5a6080; margin-bottom:8px; }
.set-hint  { font-size:10px; font-weight:700; color:#90a4ae; }
.set-input { width:100%; padding:10px 12px; border-radius:10px; border:2px solid #e8eaf0; background:#f8f9ff; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; box-sizing:border-box; }
.set-input:focus { border-color:#00897b; }
.logo-preview     { width:54px; height:54px; border-radius:12px; object-fit:cover; border:2px solid #e8eaf0; }
.logo-placeholder { width:54px; height:54px; border-radius:12px; background:#e0f2f1; border:2px solid #b2dfdb; display:flex; align-items:center; justify-content:center; font-size:26px; }
.tier-picker { display:flex; gap:7px; flex-wrap:wrap; margin-top:4px; }
.tier-pill   { padding:6px 14px; border-radius:20px; font-size:12px; font-weight:800; cursor:pointer; border:2px solid; transition:all .15s; }
.tier-bronze  { border-color:#ffcc80; color:#bf360c; background:#fff8e1; }
.tier-silver  { border-color:#b0bec5; color:#546e7a; background:#eceff1; }
.tier-gold    { border-color:#f9a825; color:#f57f17; background:#fff8e1; }
.tier-diamond { border-color:#4fc3f7; color:#0277bd; background:#e1f5fe; }
.tier-mystic  { border-color:#ce93d8; color:#7b1fa2; background:#f3e5f5; }
.tier-active  { transform:scale(1.08); box-shadow:0 2px 8px rgba(0,0,0,.18); }
.fixed-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #f0eeff; font-size:12px; font-weight:700; color:#5a6080; }
.fixed-row:last-of-type { border-bottom:none; }
.save-btn   { width:100%; padding:14px; border-radius:14px; background:#00897b; color:#fff; font-size:14px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; margin-bottom:10px; }
.logout-btn { width:100%; padding:12px; border-radius:14px; background:#fff; color:#c62828; font-size:13px; font-weight:800; border:2px solid #ef9a9a; cursor:pointer; font-family:'Nunito',sans-serif; }

/* TOP UP EXTRAS */
.topup-sum-row { display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:700; color:#00695c; }
.topup-sum-row + .topup-sum-row { margin-top:4px; }
.credit-usage-card { background:#f8f9ff; border:2px solid #e8eaf0; border-radius:14px; padding:14px; margin-top:14px; margin-bottom:6px; }
.cu-title { font-size:12px; font-weight:800; color:#5a6080; margin-bottom:10px; }
.cu-row   { display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid #f0eeff; font-size:12px; font-weight:700; color:#5a6080; }
.cu-row:last-child { border-bottom:none; }

/* TAX TOGGLE */
.tax-toggle-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.toggle-wrap  { width:46px; height:26px; border-radius:20px; background:#e0e0e0; position:relative; cursor:pointer; transition:background .2s; flex-shrink:0; }
.toggle-wrap.toggle-on { background:#00897b; }
.toggle-knob  { position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,.2); transition:transform .2s; }
.toggle-wrap.toggle-on .toggle-knob { transform:translateX(20px); }
.tax-mode-chip { display:inline-block; font-size:11px; font-weight:800; padding:4px 12px; border-radius:20px; margin-top:2px; }
.tax-on  { background:#e0f2f1; color:#00695c; }
.tax-off { background:#fff3e0; color:#e65100; }

/* FEE BREAKDOWN */
.fee-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid #e8dcff; font-size:12px; font-weight:700; color:#5a6080; }
.fee-row:last-child { border-bottom:none; }

/* MISC */
.empty-state { text-align:center; padding:40px 20px; color:#90a4ae; font-size:13px; font-weight:700; }
.upload-btn  { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px; background:#e0f2f1; color:#00695c; font-size:12px; font-weight:800; border:1.5px solid #b2dfdb; cursor:pointer; font-family:'Nunito',sans-serif; }
.btn-remove  { padding:6px 12px; border-radius:8px; background:#ffebee; color:#c62828; font-size:11px; font-weight:800; border:1.5px solid #ef9a9a; cursor:pointer; font-family:'Nunito',sans-serif; }

/* MODAL */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:500; display:flex; align-items:flex-end; justify-content:center; }
.modal-box     { background:#fff; border-radius:24px 24px 0 0; padding:24px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 -8px 32px rgba(0,0,0,.2); }
.modal-title   { font-family:'Fredoka One',cursive; font-size:18px; color:#1a1f3c; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; }
.modal-close   { width:28px; height:28px; border-radius:8px; background:#f4f6ff; border:2px solid #e8eaf0; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; }
.modal-footer  { display:flex; gap:8px; justify-content:flex-end; margin-top:18px; padding-top:14px; border-top:2px solid #f0eeff; }
.mfield  { margin-bottom:14px; }
.mfield label { display:block; font-size:11px; font-weight:800; color:#5a6080; margin-bottom:6px; }
.mhint   { font-size:10px; font-weight:700; color:#90a4ae; margin-left:4px; }
.minput  { width:100%; padding:10px 12px; border-radius:10px; border:2px solid #e8eaf0; background:#f8f9ff; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; outline:none; box-sizing:border-box; }
.minput:focus { border-color:#7c4dff; }
.btn-primary { padding:10px 22px; border-radius:12px; background:#7c4dff; color:#fff; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
.btn-gray    { padding:10px 22px; border-radius:12px; background:#f4f6ff; color:#5a6080; font-size:13px; font-weight:800; border:2px solid #e8eaf0; cursor:pointer; font-family:'Nunito',sans-serif; }
.error-msg   { font-size:12px; font-weight:800; color:#c62828; background:#ffebee; border-radius:10px; padding:8px 12px; margin-bottom:8px; }

/* LIVE TOAST */
.live-toast { position:fixed; top:70px; left:50%; transform:translateX(-50%); background:#1a1f3c; color:#fff; border-radius:20px; padding:10px 22px; font-size:13px; font-weight:800; z-index:600; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,.3); }
.toast-slide-enter-active, .toast-slide-leave-active { transition:all .3s; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity:0; transform:translateX(-50%) translateY(-16px); }

/* BOTTOM NAV */
.bottom-nav    { display:flex; background:#fff; border-top:2px solid #e0f7f4; flex-shrink:0; padding-bottom:env(safe-area-inset-bottom,0px); }
.nav-item      { flex:1; display:flex; flex-direction:column; align-items:center; padding:10px 0 8px; cursor:pointer; transition:all .15s; }
.nav-icon-wrap { position:relative; }
.nav-icon      { font-size:20px; margin-bottom:2px; }
.nav-badge     { position:absolute; top:-6px; right:-8px; background:#e53935; color:#fff; font-size:9px; font-weight:800; min-width:16px; height:16px; border-radius:8px; display:flex; align-items:center; justify-content:center; padding:0 3px; border:2px solid #fff; }
.nav-label     { font-size:9px; font-weight:800; color:#90a4ae; text-transform:uppercase; letter-spacing:.3px; }
.nav-item.active .nav-label { color:#00897b; }
.nav-item.active .nav-icon  { transform:scale(1.15); }
</style>
