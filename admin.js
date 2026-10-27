/**
 * NOTO Admin Operations Hub - Standalone Admin Portal Controller
 * Manages QRIS transactions, payment proof verification, user tiers, and system configurations.
 */

// ============================================================================
// 1. DATA STORAGE & SHARED LOCALSTORAGE MANAGER
// ============================================================================
const DataStorage = {
  KEYS: {
    PAYMENTS: 'noto_payments',
    USER: 'noto_user',
    ADMIN_LOGS: 'noto_admin_logs',
    MERCHANT_CONFIG: 'noto_merchant_config',
    PRICING_CONFIG: 'noto_pricing_config',
    AI_QUOTA: 'noto_ai_quota',
    THEME: 'noto_theme'
  },

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error loading key: ${key}`, e);
      return defaultValue;
    }
  },

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving key: ${key}`, e);
      return false;
    }
  },

  initDefaults() {
    // 1. Seed Payments if not exists
    if (!localStorage.getItem(this.KEYS.PAYMENTS)) {
      const defaultPayments = [
        {
          id: 'NOTO-INV-20261013-8812',
          title: 'Yearly Plan (1 Tahun Pro)',
          priceStr: 'Rp160.000',
          priceNum: 160000,
          userName: 'Alex Pratama',
          type: 'subscription',
          date: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
          dateFormatted: '10 Okt 2026, 14:32 WIB',
          merchant: 'NOTO, DIGITAL & KREATIF',
          nmid: 'ID1026615042680',
          status: 'Lunas (Verified)',
          hasProof: true,
          proofData: 'assets/images/qris-noto.png'
        },
        {
          id: 'NOTO-INV-20261013-4102',
          title: 'AI Career Planner (Addon)',
          priceStr: 'Rp25.000',
          priceNum: 25000,
          userName: 'Alex Pratama',
          type: 'addon',
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          dateFormatted: '13 Okt 2026, 11:15 WIB',
          merchant: 'NOTO, DIGITAL & KREATIF',
          nmid: 'ID1026615042680',
          status: 'Menunggu Verifikasi (Pending)',
          hasProof: true,
          proofData: 'assets/images/qris-noto.png'
        }
      ];
      this.save(this.KEYS.PAYMENTS, defaultPayments);
    }

    // 2. Seed User if not exists
    if (!localStorage.getItem(this.KEYS.USER)) {
      const defaultUser = {
        name: 'Alex Pratama',
        email: 'alex@example.com',
        isPremium: true,
        plan: 'Yearly Plan (Pro)',
        premiumExpiry: new Date(Date.now() + 365 * 24 * 3600000).toISOString()
      };
      this.save(this.KEYS.USER, defaultUser);
    }

    // 3. Seed Merchant Config if not exists
    if (!localStorage.getItem(this.KEYS.MERCHANT_CONFIG)) {
      const defaultMerchant = {
        name: 'NOTO, DIGITAL & KREATIF',
        nmid: 'ID1026615042680',
        printed: '93600914',
        provider: 'GoPay Merchant (GPN)'
      };
      this.save(this.KEYS.MERCHANT_CONFIG, defaultMerchant);
    }

    // 4. Seed or update Pricing Config
    const currentPricing = this.get(this.KEYS.PRICING_CONFIG);
    if (!currentPricing || currentPricing.monthly === 39000 || currentPricing.yearly === 229000) {
      const defaultPricing = {
        monthly: 20000,
        sixMonth: 100000,
        yearly: 160000
      };
      this.save(this.KEYS.PRICING_CONFIG, defaultPricing);
    }

    // 5. Seed Admin Logs if not exists
    if (!localStorage.getItem(this.KEYS.ADMIN_LOGS)) {
      const defaultLogs = [
        {
          time: '14:32:10',
          text: 'Sistem memverifikasi pembayaran NOTO-INV-20261013-8812 (Yearly Plan - Rp160.000).'
        },
        {
          time: '11:15:44',
          text: 'Transaksi baru NOTO-INV-20261013-4102 diunggah dengan bukti transfer [Pending].'
        }
      ];
      this.save(this.KEYS.ADMIN_LOGS, defaultLogs);
    }
  }
};

// ============================================================================
// 2. TOAST NOTIFICATION SERVICE
// ============================================================================
const Toast = {
  show(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 700;">${icon}</span>
        <span>${escapeHTML(message)}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// ============================================================================
// 3. MODAL CONTROLLER
// ============================================================================
const Modals = {
  open(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  },

  close(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }
};

// ============================================================================
// 4. ADMIN OPERATIONS HUB CONTROLLER
// ============================================================================
const AdminPanel = {
  isAuthenticated: false,
  currentTab: 'transactions',
  statusFilter: 'all',
  activeProofTrxId: null,

  init() {
    // 1. Synchronize theme
    const savedTheme = localStorage.getItem(DataStorage.KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggleIcon(savedTheme);

    // 2. Initialize default shared storage
    DataStorage.initDefaults();

    // 3. Populate config form inputs
    const merchantCfg = DataStorage.get(DataStorage.KEYS.MERCHANT_CONFIG);
    if (merchantCfg) {
      const nameEl = document.getElementById('cfg-merchant-name');
      const nmidEl = document.getElementById('cfg-merchant-nmid');
      const printedEl = document.getElementById('cfg-merchant-printed');
      const kpiMerchantEl = document.getElementById('admin-kpi-merchant-name');

      if (nameEl && merchantCfg.name) nameEl.value = merchantCfg.name;
      if (nmidEl && merchantCfg.nmid) nmidEl.value = merchantCfg.nmid;
      if (printedEl && merchantCfg.printed) printedEl.value = merchantCfg.printed;
      if (kpiMerchantEl && merchantCfg.name) kpiMerchantEl.textContent = merchantCfg.name;
    }

    const pricingCfg = DataStorage.get(DataStorage.KEYS.PRICING_CONFIG);
    if (pricingCfg) {
      const mEl = document.getElementById('cfg-price-monthly');
      const sEl = document.getElementById('cfg-price-6month');
      const yEl = document.getElementById('cfg-price-yearly');

      if (mEl && pricingCfg.monthly) mEl.value = pricingCfg.monthly;
      if (sEl && pricingCfg.sixMonth) sEl.value = pricingCfg.sixMonth;
      if (yEl && pricingCfg.yearly) yEl.value = pricingCfg.yearly;
    }

    // 4. Check session authentication
    this.isAuthenticated = sessionStorage.getItem('noto_admin_auth') === 'true';

    const authScreen = document.getElementById('admin-auth-screen');
    const mainApp = document.getElementById('admin-main-app');

    if (this.isAuthenticated) {
      if (authScreen) authScreen.style.display = 'none';
      if (mainApp) mainApp.style.display = 'flex';
      this.render();
    } else {
      if (authScreen) authScreen.style.display = 'flex';
      if (mainApp) mainApp.style.display = 'none';
      const pinInput = document.getElementById('admin-pin-input');
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 100);
      }
    }
  },

  togglePinVisibility() {
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) {
      pinInput.type = pinInput.type === 'password' ? 'text' : 'password';
    }
  },

  handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const pinInput = document.getElementById('admin-pin-input');
    const pin = pinInput ? pinInput.value.trim() : '';

    if (pin === 'noto2026' || pin === 'admin123') {
      this.isAuthenticated = true;
      sessionStorage.setItem('noto_admin_auth', 'true');
      
      const authScreen = document.getElementById('admin-auth-screen');
      const mainApp = document.getElementById('admin-main-app');
      if (authScreen) authScreen.style.display = 'none';
      if (mainApp) mainApp.style.display = 'flex';

      this.addLog('Staff berhasil masuk ke Admin Operations Hub.');
      this.render();
      Toast.show('Autentikasi staf berhasil! Selamat datang di Admin Operations NOTO.', 'success');
    } else {
      Toast.show('PIN Administrator salah. Silakan coba lagi (Demo: noto2026).', 'error');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  },

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('noto_admin_auth');
    
    const authScreen = document.getElementById('admin-auth-screen');
    const mainApp = document.getElementById('admin-main-app');
    if (mainApp) mainApp.style.display = 'none';
    if (authScreen) authScreen.style.display = 'flex';

    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    Toast.show('Keluar dari sesi Administrator.');
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(DataStorage.KEYS.THEME, newTheme);
    this.updateThemeToggleIcon(newTheme);
  },

  updateThemeToggleIcon(theme) {
    const btn = document.getElementById('admin-theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    const tabs = ['transactions', 'users', 'config', 'logs'];
    tabs.forEach(t => {
      const pane = document.getElementById(`admin-tab-content-${t}`);
      if (pane) pane.style.display = t === tabName ? 'block' : 'none';
    });

    if (tabName === 'transactions') this.renderTransactionsTable();
    if (tabName === 'users') this.renderUsersTable();
    if (tabName === 'logs') this.renderLogs();
  },

  filterTrx(status) {
    this.statusFilter = status;
    const filterBtns = ['all', 'verified', 'pending', 'rejected'];
    filterBtns.forEach(f => {
      const btn = document.getElementById(`filter-trx-${f}`);
      if (btn) btn.classList.toggle('active', f === status);
    });
    this.renderTransactionsTable();
  },

  render() {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    const merchantCfg = DataStorage.get(DataStorage.KEYS.MERCHANT_CONFIG, {});

    // Calculate gross revenue from verified transactions
    const verifiedTrxs = payments.filter(p => p.status && p.status.includes('Lunas'));
    const totalRev = verifiedTrxs.reduce((sum, p) => sum + (p.priceNum || 0), 0);
    const pendingTrxs = payments.filter(p => p.status && p.status.includes('Pending'));

    // Update KPI Elements
    const revEl = document.getElementById('admin-kpi-revenue');
    const revSubEl = document.getElementById('admin-kpi-revenue-sub');
    const trxCountEl = document.getElementById('admin-kpi-trx-count');
    const pendingBadgeEl = document.getElementById('admin-kpi-pending-badge');
    const proUsersEl = document.getElementById('admin-kpi-pro-users');
    const merchantNameEl = document.getElementById('admin-kpi-merchant-name');
    const countTrxTab = document.getElementById('admin-tab-count-trx');

    if (revEl) revEl.textContent = 'Rp' + totalRev.toLocaleString('id-ID');
    if (revSubEl) revSubEl.textContent = `${verifiedTrxs.length} transaksi lunas terverifikasi`;
    if (trxCountEl) trxCountEl.textContent = payments.length;
    if (pendingBadgeEl) pendingBadgeEl.textContent = `${pendingTrxs.length} perlu dicek`;
    if (proUsersEl) proUsersEl.textContent = user.isPremium ? '1 Member' : '0 Member';
    if (merchantNameEl && merchantCfg.name) merchantNameEl.textContent = merchantCfg.name;
    if (countTrxTab) countTrxTab.textContent = payments.length;

    this.renderTransactionsTable();
    this.renderUsersTable();
    this.renderLogs();
  },

  renderTransactionsTable() {
    const container = document.getElementById('admin-transactions-table-container');
    if (!container) return;

    let payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const searchVal = (document.getElementById('admin-trx-search')?.value || '').toLowerCase().trim();

    // Filter by status
    if (this.statusFilter === 'verified') {
      payments = payments.filter(p => p.status && p.status.includes('Lunas'));
    } else if (this.statusFilter === 'pending') {
      payments = payments.filter(p => p.status && p.status.includes('Pending'));
    } else if (this.statusFilter === 'rejected') {
      payments = payments.filter(p => p.status && p.status.includes('Ditolak'));
    }

    // Filter by search query
    if (searchVal) {
      payments = payments.filter(p => 
        (p.id && p.id.toLowerCase().includes(searchVal)) ||
        (p.title && p.title.toLowerCase().includes(searchVal)) ||
        (p.userName && p.userName.toLowerCase().includes(searchVal))
      );
    }

    if (payments.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 16px; color: var(--text-muted); font-size: 0.9rem;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <div>Tidak ada transaksi yang cocok dengan kriteria filter saat ini.</div>
        </div>
      `;
      return;
    }

    let rowsHtml = payments.map(p => {
      const isLunas = p.status && p.status.includes('Lunas');
      const isPending = p.status && p.status.includes('Pending');
      const statusBadge = isLunas 
        ? `<span class="badge-status-approved">Lunas (Verified)</span>`
        : (isPending ? `<span class="badge-status-pending">Menunggu Verifikasi</span>` : `<span class="badge-status-rejected">Ditolak / Batal</span>`);

      const proofBtn = (p.hasProof || p.proofData) 
        ? `<button class="btn btn-secondary btn-sm" onclick="AdminPanel.openProofViewer('${p.id}')" style="padding: 3px 9px; font-size: 0.74rem;">📷 Lihat Struk</button>`
        : `<span style="font-size: 0.74rem; color: var(--text-muted);">Tanpa Upload</span>`;

      let actionButtons = '';
      if (isPending) {
        actionButtons = `
          <button class="btn btn-primary btn-sm" onclick="AdminPanel.quickApprove('${p.id}')" style="padding: 3px 8px; font-size: 0.75rem;" title="Setujui Pembayaran">✓ Approve</button>
          <button class="btn btn-secondary btn-sm" onclick="AdminPanel.quickReject('${p.id}')" style="padding: 3px 8px; font-size: 0.75rem; color: var(--accent-coral);" title="Tolak Transaksi">✕ Tolak</button>
        `;
      } else if (isLunas) {
        actionButtons = `
          <button class="btn btn-secondary btn-sm" onclick="AdminPanel.viewInvoice('${p.id}')" style="padding: 3px 8px; font-size: 0.75rem;">Struk</button>
          <button class="btn btn-ghost btn-sm" onclick="AdminPanel.markPending('${p.id}')" style="padding: 3px 8px; font-size: 0.75rem; color: var(--text-muted);" title="Batalkan status lunas">Batal</button>
        `;
      } else {
        actionButtons = `
          <button class="btn btn-secondary btn-sm" onclick="AdminPanel.quickApprove('${p.id}')" style="padding: 3px 8px; font-size: 0.75rem;">Pulihkan</button>
        `;
      }

      actionButtons += `
        <button class="btn btn-ghost btn-sm" onclick="AdminPanel.deleteTransaction('${p.id}')" style="padding: 3px 6px; font-size: 0.75rem; color: var(--accent-coral);" title="Hapus catatan">🗑️</button>
      `;

      return `
        <tr>
          <td><strong style="font-family: var(--font-mono); font-size: 0.82rem;">${escapeHTML(p.id)}</strong></td>
          <td><span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHTML(p.dateFormatted || new Date(p.date).toLocaleDateString('id-ID'))}</span></td>
          <td><strong>${escapeHTML(p.userName || 'Alex Pratama')}</strong></td>
          <td>${escapeHTML(p.title)}</td>
          <td><strong style="font-family: var(--font-mono);">${escapeHTML(p.priceStr)}</strong></td>
          <td>${proofBtn}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center;">
              ${actionButtons}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <table class="transactions-table">
        <thead>
          <tr>
            <th>No. Invoice</th>
            <th>Waktu</th>
            <th>Pengguna</th>
            <th>Paket / Item</th>
            <th>Nominal</th>
            <th>Bukti Bayar</th>
            <th>Status</th>
            <th>Aksi Admin</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  },

  openProofViewer(trxId) {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const trx = payments.find(p => p.id === trxId);
    if (!trx) return;

    this.activeProofTrxId = trxId;
    const invEl = document.getElementById('proof-viewer-inv');
    const userEl = document.getElementById('proof-viewer-user');
    const itemEl = document.getElementById('proof-viewer-item');
    const amountEl = document.getElementById('proof-viewer-amount');
    const timeEl = document.getElementById('proof-viewer-time');
    const statusEl = document.getElementById('proof-viewer-status-badge');
    const imgEl = document.getElementById('proof-viewer-img');
    const openLink = document.getElementById('proof-viewer-open-link');
    const dlLink = document.getElementById('proof-viewer-dl-link');

    if (invEl) invEl.textContent = trx.id;
    if (userEl) userEl.textContent = trx.userName || 'Alex Pratama';
    if (itemEl) itemEl.textContent = trx.title;
    if (amountEl) amountEl.textContent = trx.priceStr;
    if (timeEl) timeEl.textContent = trx.dateFormatted || new Date(trx.date).toLocaleString('id-ID');

    if (statusEl) {
      const isLunas = trx.status && trx.status.includes('Lunas');
      const isPending = trx.status && trx.status.includes('Pending');
      statusEl.className = isLunas ? 'badge-status-approved' : (isPending ? 'badge-status-pending' : 'badge-status-rejected');
      statusEl.textContent = trx.status || 'Menunggu Verifikasi';
    }

    const imgSrc = trx.proofData || 'assets/images/qris-noto.png';
    if (imgEl) imgEl.src = imgSrc;
    if (openLink) openLink.href = imgSrc;
    if (dlLink) {
      dlLink.href = imgSrc;
      dlLink.download = `Bukti-${trx.id}.png`;
    }

    Modals.open('modal-admin-proof-viewer');
  },

  approveCurrentTrx() {
    if (!this.activeProofTrxId) return;
    this.quickApprove(this.activeProofTrxId);
    Modals.close('modal-admin-proof-viewer');
  },

  rejectCurrentTrx() {
    if (!this.activeProofTrxId) return;
    this.quickReject(this.activeProofTrxId);
    Modals.close('modal-admin-proof-viewer');
  },

  quickApprove(trxId) {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const trx = payments.find(p => p.id === trxId);
    if (!trx) return;

    trx.status = 'Lunas (Verified)';
    DataStorage.save(DataStorage.KEYS.PAYMENTS, payments);

    // Provision user membership in shared localStorage
    const user = DataStorage.get(DataStorage.KEYS.USER, { name: 'Alex Pratama', email: 'alex@example.com' });
    user.isPremium = true;
    user.plan = `${trx.title} (Pro)`;
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    user.premiumExpiry = expiry.toISOString();
    DataStorage.save(DataStorage.KEYS.USER, user);

    this.addLog(`Admin menyetujui transaksi ${trx.id} (${trx.title} - ${trx.priceStr}) dan mengaktifkan Pro membership.`);
    this.render();
    Toast.show(`Transaksi ${trx.id} disetujui! Membership pengguna telah diaktifkan.`, 'success');
  },

  quickReject(trxId) {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const trx = payments.find(p => p.id === trxId);
    if (!trx) return;

    trx.status = 'Ditolak (Rejected)';
    DataStorage.save(DataStorage.KEYS.PAYMENTS, payments);

    this.addLog(`Admin menolak transaksi ${trx.id}.`);
    this.render();
    Toast.show(`Transaksi ${trx.id} ditolak.`, 'warning');
  },

  markPending(trxId) {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const trx = payments.find(p => p.id === trxId);
    if (!trx) return;

    trx.status = 'Menunggu Verifikasi (Pending)';
    DataStorage.save(DataStorage.KEYS.PAYMENTS, payments);

    this.addLog(`Status transaksi ${trx.id} diubah menjadi Pending.`);
    this.render();
    Toast.show(`Status transaksi ${trx.id} dikembalikan ke Pending.`);
  },

  deleteTransaction(trxId) {
    if (!confirm(`Hapus data transaksi ${trxId} secara permanen dari basis data?`)) return;

    let payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    payments = payments.filter(p => p.id !== trxId);
    DataStorage.save(DataStorage.KEYS.PAYMENTS, payments);

    this.addLog(`Admin menghapus catatan transaksi ${trxId}.`);
    this.render();
    Toast.show(`Transaksi ${trxId} berhasil dihapus.`);
  },

  viewInvoice(trxId) {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const trx = payments.find(p => p.id === trxId);
    if (!trx) return;

    const receiptInv = document.getElementById('admin-receipt-invoice-no');
    const receiptDate = document.getElementById('admin-receipt-date-time');
    const receiptCustomer = document.getElementById('admin-receipt-customer-name');
    const receiptMerchant = document.getElementById('admin-receipt-merchant');
    const receiptItem = document.getElementById('admin-receipt-item-name');
    const receiptPrice = document.getElementById('admin-receipt-item-price');
    const receiptTotal = document.getElementById('admin-receipt-total-paid');
    const receiptBadge = document.getElementById('admin-receipt-inv-badge');
    const statusBadge = document.getElementById('admin-receipt-status-badge');

    if (receiptInv) receiptInv.textContent = trx.id;
    if (receiptDate) receiptDate.textContent = trx.dateFormatted || new Date(trx.date).toLocaleString('id-ID');
    if (receiptCustomer) receiptCustomer.textContent = trx.userName || 'Alex Pratama';
    if (receiptMerchant) receiptMerchant.textContent = trx.merchant || 'NOTO, DIGITAL & KREATIF';
    if (receiptItem) receiptItem.textContent = trx.title;
    if (receiptPrice) receiptPrice.textContent = trx.priceStr;
    if (receiptTotal) receiptTotal.textContent = trx.priceStr;
    if (receiptBadge) receiptBadge.textContent = trx.id;
    if (statusBadge) {
      statusBadge.textContent = trx.status.includes('Lunas') ? 'LUNAS' : (trx.status.includes('Pending') ? 'PENDING' : 'BATAL');
    }

    Modals.open('modal-receipt');
  },

  renderUsersTable() {
    const container = document.getElementById('admin-users-table-container');
    if (!container) return;

    const user = DataStorage.get(DataStorage.KEYS.USER, { name: 'Alex Pratama', email: 'alex@example.com', plan: 'Free Plan' });
    const isPro = !!user.isPremium;
    const expiryStr = user.premiumExpiry ? new Date(user.premiumExpiry).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) : (isPro ? 'Aktif' : 'N/A');

    const statusBadge = isPro 
      ? `<span class="badge-status-approved">👑 Pro Member</span>`
      : `<span class="badge badge-neutral">Free Tier</span>`;

    container.innerHTML = `
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Pengguna</th>
            <th>Email</th>
            <th>Paket Berlangganan</th>
            <th>Status Kuota AI</th>
            <th>Masa Berlaku</th>
            <th>Aksi Manajemen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${escapeHTML(user.name)}</strong></td>
            <td><code style="font-family: var(--font-mono); font-size: 0.8rem;">${escapeHTML(user.email || 'alex@example.com')}</code></td>
            <td><strong>${escapeHTML(user.plan || 'Free Plan')}</strong></td>
            <td><span class="badge badge-success">${isPro ? 'Unlimited' : '15/15 Requests'}</span></td>
            <td>${expiryStr}</td>
            <td>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${isPro ? `
                  <button class="btn btn-secondary btn-sm" onclick="AdminPanel.revokeUserPro()" style="color: var(--accent-coral); font-size: 0.74rem;">Revoke Pro</button>
                  <button class="btn btn-secondary btn-sm" onclick="AdminPanel.extendUserPro()" style="font-size: 0.74rem;">+30 Hari</button>
                ` : `
                  <button class="btn btn-primary btn-sm" onclick="AdminPanel.grantUserPro()" style="font-size: 0.74rem;">Grant Pro Yearly</button>
                `}
                <button class="btn btn-ghost btn-sm" onclick="AdminPanel.resetUserQuota()" style="font-size: 0.74rem;">Reset AI</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Rian Hidayat</strong></td>
            <td><code style="font-family: var(--font-mono); font-size: 0.8rem;">rian@example.com</code></td>
            <td><strong>Monthly Plan (Pro)</strong></td>
            <td><span class="badge badge-success">Unlimited</span></td>
            <td>13 Nov 2026</td>
            <td>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Demo User (Secondary)</span>
            </td>
          </tr>
          <tr>
            <td><strong>Siti Sarah</strong></td>
            <td><code style="font-family: var(--font-mono); font-size: 0.8rem;">sarah@example.com</code></td>
            <td><strong>Free Plan (+AI Career Addon)</strong></td>
            <td><span class="badge badge-amber">12/15 Requests</span></td>
            <td>N/A</td>
            <td>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Demo User (Secondary)</span>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  },

  grantUserPro() {
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    user.isPremium = true;
    user.plan = 'Yearly Plan (Pro)';
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    user.premiumExpiry = expiry.toISOString();
    DataStorage.save(DataStorage.KEYS.USER, user);

    this.addLog(`Admin memberikan akses Pro Yearly kepada ${user.name}.`);
    this.render();
    Toast.show(`Akses Pro berhasil diberikan kepada ${user.name}!`, 'success');
  },

  revokeUserPro() {
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    user.isPremium = false;
    user.plan = 'Free Plan';
    delete user.premiumExpiry;
    DataStorage.save(DataStorage.KEYS.USER, user);

    this.addLog(`Admin mencabut akses Pro dari ${user.name}.`);
    this.render();
    Toast.show(`Akses Pro telah dinonaktifkan untuk ${user.name}.`, 'warning');
  },

  extendUserPro() {
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    let base = user.premiumExpiry ? new Date(user.premiumExpiry) : new Date();
    base.setDate(base.getDate() + 30);
    user.premiumExpiry = base.toISOString();
    DataStorage.save(DataStorage.KEYS.USER, user);

    this.addLog(`Admin memperpanjang masa aktif Pro ${user.name} selama 30 hari.`);
    this.render();
    Toast.show('Masa aktif berhasil diperpanjang +30 hari.', 'success');
  },

  resetUserQuota() {
    localStorage.setItem(DataStorage.KEYS.AI_QUOTA, '15');
    this.addLog('Admin mereset kuota AI Coach pengguna.');
    Toast.show('Kuota AI Coach berhasil direset ke 15.');
  },

  openManualTrxModal() {
    Modals.open('modal-admin-manual-trx');
  },

  onManualItemChange(val) {
    const parts = val.split('|');
    const amountInput = document.getElementById('manual-amount-input');
    if (amountInput && parts[2]) {
      amountInput.value = parts[2];
    }
  },

  handleManualTrxSubmit(e) {
    if (e) e.preventDefault();
    const customer = document.getElementById('manual-customer-name')?.value.trim() || 'Pelanggan';
    const itemVal = document.getElementById('manual-item-select')?.value || '';
    const [title, priceStr, priceNum, type] = itemVal.split('|');
    const amount = parseInt(document.getElementById('manual-amount-input')?.value || priceNum, 10);
    const method = document.getElementById('manual-method-select')?.value || 'QRIS';
    const status = document.getElementById('manual-status-select')?.value || 'Lunas (Verified)';

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const invoiceId = `NOTO-INV-${dateCode}-${orderNum}`;
    const now = new Date();

    const merchantCfg = DataStorage.get(DataStorage.KEYS.MERCHANT_CONFIG, {});

    const newTrx = {
      id: invoiceId,
      title: title,
      priceStr: 'Rp' + amount.toLocaleString('id-ID'),
      priceNum: amount,
      userName: customer,
      type: type || 'subscription',
      date: now.toISOString(),
      dateFormatted: now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB',
      merchant: merchantCfg.name || 'NOTO, DIGITAL & KREATIF',
      nmid: merchantCfg.nmid || 'ID1026615042680',
      status: status,
      hasProof: false,
      method: method
    };

    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    payments.unshift(newTrx);
    DataStorage.save(DataStorage.KEYS.PAYMENTS, payments);

    if (status.includes('Lunas')) {
      const user = DataStorage.get(DataStorage.KEYS.USER, {});
      user.isPremium = true;
      user.plan = `${title} (Pro)`;
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      user.premiumExpiry = expiry.toISOString();
      DataStorage.save(DataStorage.KEYS.USER, user);
    }

    this.addLog(`Admin mencatat transaksi manual ${newTrx.id} (${customer} - ${newTrx.priceStr}) [${status}].`);
    Modals.close('modal-admin-manual-trx');
    this.render();
    Toast.show(`Transaksi manual ${newTrx.id} berhasil dicatat!`, 'success');
  },

  saveMerchantConfig(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('cfg-merchant-name')?.value.trim();
    const nmid = document.getElementById('cfg-merchant-nmid')?.value.trim();
    const printed = document.getElementById('cfg-merchant-printed')?.value.trim();

    const merchantConfig = {
      name: name || 'NOTO, DIGITAL & KREATIF',
      nmid: nmid || 'ID1026615042680',
      printed: printed || '93600914',
      provider: 'GoPay Merchant (GPN)'
    };

    DataStorage.save(DataStorage.KEYS.MERCHANT_CONFIG, merchantConfig);

    const kpiMerchantEl = document.getElementById('admin-kpi-merchant-name');
    if (kpiMerchantEl) kpiMerchantEl.textContent = merchantConfig.name;

    this.addLog(`Admin memperbarui data QRIS Merchant: ${name} (${nmid}).`);
    Toast.show('Konfigurasi QRIS Merchant berhasil disimpan ke shared storage.', 'success');
  },

  savePricingConfig(e) {
    if (e) e.preventDefault();
    const monthly = parseInt(document.getElementById('cfg-price-monthly')?.value || 20000, 10);
    const sixMonth = parseInt(document.getElementById('cfg-price-6month')?.value || 100000, 10);
    const yearly = parseInt(document.getElementById('cfg-price-yearly')?.value || 160000, 10);

    const pricingConfig = {
      monthly,
      sixMonth,
      yearly
    };

    DataStorage.save(DataStorage.KEYS.PRICING_CONFIG, pricingConfig);
    this.addLog(`Admin memperbarui harga paket: Monthly Rp${monthly.toLocaleString('id-ID')}, 6-Mo Rp${sixMonth.toLocaleString('id-ID')}, Yearly Rp${yearly.toLocaleString('id-ID')}.`);
    Toast.show('Pengaturan harga paket berhasil diperbarui.', 'success');
  },

  exportTransactionsCSV() {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    if (payments.length === 0) {
      Toast.show('Belum ada transaksi untuk diekspor.', 'warning');
      return;
    }

    let csvContent = 'Invoice,Tanggal,Pelanggan,Paket,Nominal_IDR,Status,Merchant,NMID\n';
    payments.forEach(p => {
      const line = `"${p.id}","${p.dateFormatted || p.date}","${p.userName || 'Alex Pratama'}","${p.title}","${p.priceNum || 0}","${p.status}","${p.merchant || 'NOTO, DIGITAL & KREATIF'}","${p.nmid || 'ID1026615042680'}"\n`;
      csvContent += line;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NOTO-Laporan-Transaksi-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    Toast.show('Laporan CSV transaksi berhasil diunduh.', 'success');
  },

  addLog(text) {
    const logs = DataStorage.get(DataStorage.KEYS.ADMIN_LOGS, []);
    logs.unshift({
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: text
    });
    if (logs.length > 50) logs.pop();
    DataStorage.save(DataStorage.KEYS.ADMIN_LOGS, logs);
    this.renderLogs();
  },

  renderLogs() {
    const container = document.getElementById('admin-logs-container');
    if (!container) return;

    const logs = DataStorage.get(DataStorage.KEYS.ADMIN_LOGS, []);
    if (logs.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 16px 0; text-align: center;">Belum ada catatan aktivitas audit log.</div>`;
      return;
    }

    container.innerHTML = logs.map(l => `
      <div class="admin-log-item">
        <span class="admin-log-time">${escapeHTML(l.time)}</span>
        <span style="color: var(--text-primary);">${escapeHTML(l.text)}</span>
      </div>
    `).join('');
  },

  clearLogs() {
    DataStorage.save(DataStorage.KEYS.ADMIN_LOGS, []);
    this.renderLogs();
    Toast.show('Log audit admin berhasil dibersihkan.');
  }
};

// ============================================================================
// 5. HELPER UTILITIES
// ============================================================================
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  AdminPanel.init();
});
