/**
 * NOTO — Get Things Done
 * Application Architecture: Modular, Declarative Vanilla JavaScript (ES6+)
 * No external frameworks, completely static & responsive.
 */

const CONFIG = {
  // Ganti URL ini dengan URL Website publik Anda di GitHub Pages jika di-publish terpisah
  // Contoh: 'https://username.github.io/noto-web/'
  WEB_URL: '../web/index.html'
};

// ============================================================================
// 1. DATA STORAGE & STATE MANAGEMENT LAYER
// ============================================================================
const DataStorage = {
  KEYS: {
    USER: 'noto_user',
    TASKS: 'noto_tasks',
    FOCUS_SESSIONS: 'noto_focus_sessions',
    NOTES: 'noto_notes',
    CAL_EVENTS: 'noto_cal_events',
    MOOD_LOGS: 'noto_mood_logs',
    AI_QUOTA: 'noto_ai_quota',
    THEME: 'noto_theme',
    PAYMENTS: 'noto_payments',
    ADMIN_LOGS: 'noto_admin_logs',
    PRICING_CONFIG: 'noto_pricing_config'
  },

  initDefaults() {
    const currentPricing = this.get('noto_pricing_config');
    if (!currentPricing || currentPricing.monthly === 39000 || currentPricing.yearly === 229000) {
      this.save('noto_pricing_config', {
        monthly: 20000,
        sixMonth: 100000,
        yearly: 160000
      });
    }
    if (!localStorage.getItem(this.KEYS.USER)) {
      const defaultUser = {
        name: 'Alex Pratama',
        email: 'alex@example.com',
        isLoggedIn: true,
        plan: 'Free Plan',
        theme: 'light',
        focusPreset: 25,
        streak: 3
      };
      this.save(this.KEYS.USER, defaultUser);
    }

    if (!localStorage.getItem(this.KEYS.PAYMENTS) || JSON.parse(localStorage.getItem(this.KEYS.PAYMENTS) || '[]').length === 0) {
      const samplePayments = [
        {
          id: 'NOTO-INV-261013-8492',
          title: 'Yearly Plan',
          priceStr: 'Rp160.000',
          priceNum: 160000,
          userName: 'Alex Pratama',
          type: 'subscription',
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          dateFormatted: '13 Okt 2026, 11:40 WIB',
          merchant: 'NOTO, DIGITAL & KREATIF',
          nmid: 'ID1026615042680',
          status: 'Lunas (Verified)',
          hasProof: true,
          proofData: 'assets/images/qris-noto.png'
        },
        {
          id: 'NOTO-INV-261013-3914',
          title: 'Monthly Plan',
          priceStr: 'Rp20.000',
          priceNum: 20000,
          userName: 'Rian Hidayat',
          type: 'subscription',
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          dateFormatted: '13 Okt 2026, 08:30 WIB',
          merchant: 'NOTO, DIGITAL & KREATIF',
          nmid: 'ID1026615042680',
          status: 'Lunas (Verified)',
          hasProof: false
        },
        {
          id: 'NOTO-INV-261013-5521',
          title: 'AI Career Planner',
          priceStr: 'Rp25.000',
          priceNum: 25000,
          userName: 'Siti Sarah',
          type: 'addon',
          date: new Date(Date.now() - 1800000).toISOString(),
          dateFormatted: '13 Okt 2026, 13:15 WIB',
          merchant: 'NOTO, DIGITAL & KREATIF',
          nmid: 'ID1026615042680',
          status: 'Menunggu Verifikasi (Pending)',
          hasProof: true,
          proofData: 'assets/images/qris-noto.png'
        }
      ];
      this.save(this.KEYS.PAYMENTS, samplePayments);
    }

    if (!localStorage.getItem(this.KEYS.ADMIN_LOGS)) {
      this.save(this.KEYS.ADMIN_LOGS, [
        {
          time: '13:40:00',
          text: 'Sistem QRIS GoPay Merchant (NOTO, DIGITAL & KREATIF) siap beroperasi.'
        }
      ]);
    }

    if (!localStorage.getItem(this.KEYS.TASKS)) {
      const defaultTasks = [
        {
          id: 'task-1',
          title: 'Finalize quarterly architecture proposal',
          desc: 'Refine technical specifications and review with lead architect.',
          category: 'Work',
          priority: 'high',
          status: 'pending',
          dueDate: new Date().toISOString().split('T')[0],
          estDuration: 45,
          actualDuration: 0,
          createdAt: Date.now()
        },
        {
          id: 'task-2',
          title: 'Review dissertation literature review notes',
          desc: 'Summarize key references into Reference Hub.',
          category: 'Academic',
          priority: 'medium',
          status: 'pending',
          dueDate: new Date().toISOString().split('T')[0],
          estDuration: 30,
          actualDuration: 0,
          createdAt: Date.now()
        },
        {
          id: 'task-3',
          title: 'Weekly grocery & personal errand planning',
          desc: 'Check household inventory.',
          category: 'Personal',
          priority: 'low',
          status: 'completed',
          dueDate: new Date().toISOString().split('T')[0],
          estDuration: 15,
          actualDuration: 15,
          createdAt: Date.now() - 86400000
        }
      ];
      this.save(this.KEYS.TASKS, defaultTasks);
    }

    if (!localStorage.getItem(this.KEYS.NOTES)) {
      const defaultNotes = [
        {
          id: 'note-1',
          title: 'Focus Strategy & Nata Philosophy',
          body: 'Nata means to arrange, organize, and bring harmony into daily life. Focus on single-tasking without multitasking distractions.',
          updatedAt: Date.now()
        },
        {
          id: 'note-2',
          title: 'Weekly Standup Action Items',
          body: '- Refactor local IndexedDB sync\n- Improve SVG circular timer responsiveness\n- Validate PWA offline shell cache',
          updatedAt: Date.now() - 3600000
        }
      ];
      this.save(this.KEYS.NOTES, defaultNotes);
    }

    if (!localStorage.getItem(this.KEYS.CAL_EVENTS)) {
      const today = new Date().toISOString().split('T')[0];
      const defaultEvents = [
        { id: 'evt-1', title: 'Deep Work Sprint', date: today, time: '09:00' },
        { id: 'evt-2', title: 'Design Review Sync', date: today, time: '14:00' }
      ];
      this.save(this.KEYS.CAL_EVENTS, defaultEvents);
    }

    if (!localStorage.getItem(this.KEYS.FOCUS_SESSIONS)) {
      const defaultSessions = [
        { id: 'ses-1', duration: 25, timestamp: Date.now() - 86400000 },
        { id: 'ses-2', duration: 45, timestamp: Date.now() - 172800000 }
      ];
      this.save(this.KEYS.FOCUS_SESSIONS, defaultSessions);
    }
  },

  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.error('Storage parse error for', key, e);
      return fallback;
    }
  },

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage save error', e);
      Toast.show('Storage quota exceeded or error', 'error');
    }
  },

  exportDataJSON() {
    const backup = {
      user: this.get(this.KEYS.USER),
      tasks: this.get(this.KEYS.TASKS),
      notes: this.get(this.KEYS.NOTES),
      events: this.get(this.KEYS.CAL_EVENTS),
      sessions: this.get(this.KEYS.FOCUS_SESSIONS),
      payments: this.get(this.KEYS.PAYMENTS, []),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noto-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.show('Workspace exported as JSON');
  },

  confirmResetData() {
    if (confirm('Are you sure you want to reset all local tasks, notes, and records? This action cannot be undone.')) {
      localStorage.clear();
      this.initDefaults();
      location.reload();
    }
  }
};

// ============================================================================
// 2. TOAST NOTIFICATIONS
// ============================================================================
const Toast = {
  show(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    el.innerHTML = `<span>${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }
};

// ============================================================================
// 2B. PWA INSTALLATION MANAGER
// ============================================================================
const PWAInstaller = {
  deferredPrompt: null,

  init() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButtons(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.showInstallButtons(false);
      Toast.show('NOTO berhasil di-install! Akses langsung dari layar utama.');
    });

    // Detect if already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      this.showInstallButtons(false);
    }
  },

  showInstallButtons(visible) {
    const btnMarketing = document.getElementById('btn-install-marketing');
    const btnApp = document.getElementById('btn-install-app');
    const displayStyle = visible ? 'inline-flex' : 'none';
    if (btnMarketing) btnMarketing.style.display = displayStyle;
    if (btnApp) btnApp.style.display = displayStyle;
  },

  promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        } else {
          console.log('User dismissed the PWA install prompt');
        }
        this.deferredPrompt = null;
        this.showInstallButtons(false);
      });
    } else {
      // If iOS or browser doesn't support beforeinstallprompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert("Untuk menginstall di iPhone/iPad:\n1. Tekan tombol Bagikan (Share) di Safari [ ⎋ / ↥ ]\n2. Pilih 'Tambah ke Layar Utama' (Add to Home Screen)");
      } else {
        Toast.show("Aplikasi bisa di-install lewat menu peramban: klik titik tiga di pojok kanan atas -> 'Install NOTO' atau 'Add to Home screen'.");
      }
    }
  }
};

// ============================================================================
// 3. APPLICATION ROUTING & NAVIGATION CONTROLLER
// ============================================================================
const App = {
  currentView: 'marketing',

  init() {
    DataStorage.initDefaults();
    this.applyThemeFromStorage();
    this.updateUserProfileUI();
    AICoach.updateQuotaUI();
    PremiumStore.render();
    PremiumStore.preloadFlyer();
    PWAInstaller.init();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('NOTO Service Worker Active'))
        .catch(err => console.log('SW registration error:', err));
    }

    // Check URL query parameters (e.g. ?plan=Yearly%20Plan from marketing website)
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');

    // Determine initial route based on hash or auth
    window.addEventListener('hashchange', () => this.handleHashRoute());
    if (window.location.hash) {
      this.handleHashRoute();
    } else {
      const user = DataStorage.get(DataStorage.KEYS.USER);
      if (user && user.isLoggedIn) {
        if (planParam) {
          this.navigateTo('app-premium');
          setTimeout(() => {
            const pricing = DataStorage.get('noto_pricing_config') || { monthly: 20000, sixMonth: 100000, yearly: 160000 };
            let priceStr = 'Rp20.000';
            if (planParam.toLowerCase().includes('year')) priceStr = `Rp${(pricing.yearly || 160000).toLocaleString('id-ID')}`;
            else if (planParam.toLowerCase().includes('6') || planParam.toLowerCase().includes('six')) priceStr = `Rp${(pricing.sixMonth || 100000).toLocaleString('id-ID')}`;
            else priceStr = `Rp${(pricing.monthly || 20000).toLocaleString('id-ID')}`;
            PremiumStore.openCheckout(planParam, priceStr, 'subscription');
          }, 350);
        } else {
          this.navigateTo('app-today');
        }
      } else {
        if (planParam) {
          Toast.show(`Silakan daftar atau masuk untuk memilih ${planParam}.`);
          this.navigateTo('auth-register');
        } else {
          this.navigateTo('auth-login');
        }
      }
    }

    // Register visibilitychange for focus timer robustness
    document.addEventListener('visibilitychange', () => {
      if (FocusMode.isRunning) {
        FocusMode.syncWithTimestamp();
      }
    });
  },

  handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.navigateTo(hash, false);
    }
  },

  navigateTo(viewId, updateHash = true) {
    if (viewId === 'marketing') {
      window.location.href = CONFIG.WEB_URL;
      return;
    }

    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => sec.classList.remove('active'));

    const isAppSection = viewId.startsWith('app-');
    const shell = document.getElementById('main-app-shell');

    if (isAppSection) {
      if (shell) shell.style.display = 'block';
      if (marketing) marketing.classList.remove('active');

      const target = document.getElementById(`view-${viewId}`);
      if (target) target.classList.add('active');

      // Update sidebar & mobile active states
      document.querySelectorAll('.sidebar-nav-item, .mobile-nav-item').forEach(item => {
        if (item.getAttribute('data-view') === viewId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // View-specific refreshes
      if (viewId === 'app-today') TodayDashboard.render();
      if (viewId === 'app-tasks') Tasks.render();
      if (viewId === 'app-calendar') CalendarView.render();
      if (viewId === 'app-notes') Notes.render();
      if (viewId === 'app-insights') Insights.render();
      if (viewId === 'app-focus') FocusMode.updateUI();
      if (viewId === 'app-premium') PremiumStore.render();
      if (viewId === 'app-ai') AICoach.updateQuotaUI();
    } else {
      if (shell) shell.style.display = 'none';
      const target = document.getElementById(`view-${viewId}`);
      if (target) target.classList.add('active');
    }

    this.currentView = viewId;
    if (updateHash) {
      window.location.hash = viewId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    DataStorage.save(DataStorage.KEYS.THEME, theme);
    const sel = document.getElementById('settings-theme');
    if (sel) sel.value = theme;
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  },

  applyThemeFromStorage() {
    const saved = DataStorage.get(DataStorage.KEYS.THEME, 'light');
    this.setTheme(saved);
  },

  updateUserProfileUI() {
    const user = DataStorage.get(DataStorage.KEYS.USER, { name: 'Alex Pratama', plan: 'Free Plan' });
    const nameEl = document.getElementById('user-display-name');
    const avatarEl = document.getElementById('user-avatar-initial');
    const planEl = document.getElementById('user-plan-badge');

    if (nameEl) nameEl.textContent = user.name;
    if (avatarEl) avatarEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'N';
    if (planEl) {
      if (user.isPremium) {
        planEl.innerHTML = `<span style="color: #F59E0B; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">💎 ${user.plan || 'Pro Member'}</span>`;
      } else {
        planEl.textContent = user.plan || 'Free Plan';
      }
    }
  },

  handleGlobalSearch(query) {
    if (!query.trim()) return;
    if (this.currentView !== 'app-tasks' && this.currentView !== 'app-notes') {
      this.navigateTo('app-tasks');
    }
    Tasks.filterBySearch(query.toLowerCase());
  }
};

// ============================================================================
// 4. AUTHENTICATION & ONBOARDING CONTROLLER
// ============================================================================
const Auth = {
  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pwd = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (pwd !== confirm) {
      Toast.show('Passwords do not match.', 'error');
      return;
    }

    const user = {
      name,
      email,
      isLoggedIn: true,
      plan: 'Free Plan',
      streak: 1
    };
    DataStorage.save(DataStorage.KEYS.USER, user);
    App.navigateTo('auth-verify');
  },

  handleCodeInput(input, index) {
    if (input.value && index < 5) {
      const next = document.querySelectorAll('.code-cell')[index + 1];
      if (next) next.focus();
    }
  },

  confirmVerification() {
    Toast.show('Email verified successfully! Welcome to NOTO.');
    App.navigateTo('auth-onboarding');
  },

  completeOnboarding(e) {
    if (e && e.preventDefault) e.preventDefault();
    const user = DataStorage.get(DataStorage.KEYS.USER);
    const focusDuration = parseInt(document.getElementById('onb-focus')?.value || '25', 10);
    user.focusPreset = focusDuration;
    DataStorage.save(DataStorage.KEYS.USER, user);
    App.updateUserProfileUI();
    Toast.show('Welcome to your calm workspace.');
    App.navigateTo('app-today');
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const user = DataStorage.get(DataStorage.KEYS.USER, { name: 'Alex Pratama' });
    user.email = email;
    user.isLoggedIn = true;
    DataStorage.save(DataStorage.KEYS.USER, user);
    App.updateUserProfileUI();
    Toast.show('Signed in successfully.');
    App.navigateTo('app-today');
  },

  logout() {
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    user.isLoggedIn = false;
    DataStorage.save(DataStorage.KEYS.USER, user);
    Toast.show('Signed out.');
    App.navigateTo('auth-login');
  },

  showPasswordReset() {
    const email = prompt('Enter your registered email address for reset simulation:');
    if (email) {
      Toast.show(`Demo password reset link simulated for ${email}. Check inbox.`);
    }
  }
};

// ============================================================================
// 5. TODAY DASHBOARD
// ============================================================================
const TodayDashboard = {
  render() {
    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const sessions = DataStorage.get(DataStorage.KEYS.FOCUS_SESSIONS, []);
    const user = DataStorage.get(DataStorage.KEYS.USER, { streak: 1 });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.dueDate === todayStr || !t.dueDate);
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const remainingTasks = tasks.filter(t => t.status !== 'completed');

    // Calculate today's focus minutes
    const todaySessions = sessions.filter(s => {
      const sDate = new Date(s.timestamp).toISOString().split('T')[0];
      return sDate === todayStr;
    });
    const totalFocusMinutes = todaySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    // Update banner & stats
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const bannerDate = document.getElementById('today-banner-date');
    if (bannerDate) bannerDate.textContent = new Date().toLocaleDateString('en-US', dateOptions).toUpperCase();

    const statCompleted = document.getElementById('stat-completed-count');
    const statRemaining = document.getElementById('stat-remaining-count');
    const statFocus = document.getElementById('stat-focus-time');
    const statStreak = document.getElementById('stat-streak-days');
    const statRate = document.getElementById('stat-completion-rate');

    if (statCompleted) statCompleted.textContent = completedTasks.length;
    if (statRemaining) statRemaining.textContent = remainingTasks.length;
    if (statFocus) statFocus.textContent = `${totalFocusMinutes}m`;
    if (statStreak) statStreak.textContent = `${user.streak || 1} day${(user.streak || 1) > 1 ? 's' : ''}`;

    const totalCount = tasks.length;
    const rate = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;
    if (statRate) statRate.textContent = `${rate}%`;

    // Sidebar Counters
    const sbToday = document.getElementById('sb-today-count');
    const sbTasks = document.getElementById('sb-tasks-count');
    if (sbToday) sbToday.textContent = todayTasks.filter(t => t.status !== 'completed').length;
    if (sbTasks) sbTasks.textContent = remainingTasks.length;

    // Priority Spotlight
    const priorityTask = remainingTasks.find(t => t.priority === 'high') || remainingTasks[0];
    const spotTitle = document.getElementById('spotlight-title');
    const spotMeta = document.getElementById('spotlight-meta');
    const spotBox = document.getElementById('priority-spotlight-box');

    if (priorityTask) {
      if (spotTitle) spotTitle.textContent = priorityTask.title;
      if (spotMeta) spotMeta.innerHTML = `<span>Est: ${priorityTask.estDuration || 25}m</span> • <span>Category: ${priorityTask.category || 'General'}</span>`;
      if (spotBox) spotBox.style.display = 'flex';
      FocusMode.selectedTask = priorityTask;
    } else {
      if (spotTitle) spotTitle.textContent = 'All tasks completed for today!';
      if (spotMeta) spotMeta.textContent = 'Enjoy your free time or add a new goal.';
    }

    // Render Today Tasks List
    const container = document.getElementById('today-tasks-container');
    const countLabel = document.getElementById('today-tasks-count-label');
    if (countLabel) countLabel.textContent = `${todayTasks.length} task${todayTasks.length === 1 ? '' : 's'}`;

    if (!container) return;
    if (todayTasks.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.9rem;">
        No tasks scheduled for today. Type above to add your first task.
      </div>`;
      return;
    }

    container.innerHTML = todayTasks.map(t => {
      const isDone = t.status === 'completed';
      const catClass = t.category ? t.category.toLowerCase() : 'work';
      return `
        <div class="task-card-modern ${isDone ? 'completed' : ''}" data-id="${t.id}">
          <div class="task-checkbox-round ${isDone ? 'checked' : ''}" onclick="Tasks.toggleStatus('${t.id}')">
            ${isDone ? '✓' : ''}
          </div>
          <div class="task-content-main">
            <div class="task-title-line">
              <span class="task-text">${escapeHTML(t.title)}</span>
              ${t.priority === 'high' ? '<span class="task-priority-tag urgent">⚡ Urgent</span>' : ''}
            </div>
            <div class="task-tags-row">
              <span class="task-cat-pill cat-${catClass}">${t.category || 'General'}</span>
              <span class="task-meta-pill">⏱ ${t.estDuration || 25} min</span>
              ${t.dueDate ? `<span class="task-meta-pill">📅 ${t.dueDate}</span>` : ''}
            </div>
          </div>
          <div class="task-actions-hover">
            <button class="btn btn-secondary btn-sm" onclick="FocusMode.startWithTask('${t.id}')">Start Focus</button>
            <button class="btn-icon-soft" onclick="Tasks.deleteTask('${t.id}')" title="Delete Task">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
  }
};

// ============================================================================
// 6. TASK ENGINE
// ============================================================================
const Tasks = {
  currentFilter: 'all',
  searchQuery: '',

  render() {
    let tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const container = document.getElementById('full-task-list');
    if (!container) return;

    // Apply Filter
    if (this.currentFilter === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      tasks = tasks.filter(t => t.dueDate === todayStr);
    } else if (this.currentFilter === 'high') {
      tasks = tasks.filter(t => t.priority === 'high');
    } else if (['work', 'personal', 'academic'].includes(this.currentFilter)) {
      tasks = tasks.filter(t => t.category && t.category.toLowerCase() === this.currentFilter);
    } else if (this.currentFilter === 'completed') {
      tasks = tasks.filter(t => t.status === 'completed');
    }

    // Apply Search
    if (this.searchQuery) {
      tasks = tasks.filter(t => t.title.toLowerCase().includes(this.searchQuery) || (t.desc && t.desc.toLowerCase().includes(this.searchQuery)));
    }

    if (tasks.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
        No tasks found in this view. Use '+ New Task' to create one.
      </div>`;
      return;
    }

    container.innerHTML = tasks.map(t => {
      const isDone = t.status === 'completed';
      const catClass = t.category ? t.category.toLowerCase() : 'work';
      return `
        <div class="task-card-modern ${isDone ? 'completed' : ''}" data-id="${t.id}">
          <div class="task-checkbox-round ${isDone ? 'checked' : ''}" onclick="Tasks.toggleStatus('${t.id}')">
            ${isDone ? '✓' : ''}
          </div>
          <div class="task-content-main">
            <div class="task-title-line">
              <span class="task-text">${escapeHTML(t.title)}</span>
              ${t.priority === 'high' ? '<span class="task-priority-tag urgent">⚡ Urgent</span>' : ''}
            </div>
            ${t.desc ? `<div class="task-desc-preview">${escapeHTML(t.desc)}</div>` : ''}
            <div class="task-tags-row">
              <span class="task-cat-pill cat-${catClass}">${t.category || 'General'}</span>
              <span class="task-meta-pill">⏱ ${t.estDuration || 25} min</span>
              ${t.dueDate ? `<span class="task-meta-pill">📅 Due ${t.dueDate}</span>` : ''}
            </div>
          </div>
          <div class="task-actions-hover">
            <button class="btn btn-secondary btn-sm" onclick="FocusMode.startWithTask('${t.id}')">Focus</button>
            <button class="btn-icon-soft" onclick="Tasks.editTask('${t.id}')" title="Edit Task">✏️</button>
            <button class="btn-icon-soft" onclick="Tasks.deleteTask('${t.id}')" title="Delete Task">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
  },

  applyFilter(filter, btn) {
    this.currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.render();
  },

  filterBySearch(query) {
    this.searchQuery = query;
    this.render();
  },

  addInlineToday() {
    const input = document.getElementById('inline-task-title');
    if (!input || !input.value.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: input.value.trim(),
      desc: '',
      category: 'Work',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      estDuration: 25,
      actualDuration: 0,
      createdAt: Date.now()
    };

    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    tasks.unshift(newTask);
    DataStorage.save(DataStorage.KEYS.TASKS, tasks);

    input.value = '';
    TodayDashboard.render();
    Toast.show('Task added to Today');
  },

  toggleStatus(id) {
    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    DataStorage.save(DataStorage.KEYS.TASKS, tasks);

    TodayDashboard.render();
    Tasks.render();
    Insights.render();
    Toast.show(task.status === 'completed' ? 'Task marked complete! Well done.' : 'Task reopened.');
  },

  deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    let tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    tasks = tasks.filter(t => t.id !== id);
    DataStorage.save(DataStorage.KEYS.TASKS, tasks);

    TodayDashboard.render();
    Tasks.render();
    Toast.show('Task deleted.');
  },

  editTask(id) {
    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('task-form-id').value = task.id;
    document.getElementById('task-form-title').value = task.title;
    document.getElementById('task-form-desc').value = task.desc || '';
    document.getElementById('task-form-category').value = task.category || 'Work';
    document.getElementById('task-form-priority').value = task.priority || 'medium';
    document.getElementById('task-form-date').value = task.dueDate || '';
    document.getElementById('task-form-duration').value = task.estDuration || 25;
    document.getElementById('modal-task-title').textContent = 'Edit Task';

    Modals.open('modal-task');
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('task-form-id').value;
    const title = document.getElementById('task-form-title').value.trim();
    const desc = document.getElementById('task-form-desc').value.trim();
    const category = document.getElementById('task-form-category').value;
    const priority = document.getElementById('task-form-priority').value;
    const dueDate = document.getElementById('task-form-date').value;
    const estDuration = parseInt(document.getElementById('task-form-duration').value || '25', 10);

    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);

    if (id) {
      // Edit
      const t = tasks.find(item => item.id === id);
      if (t) {
        t.title = title;
        t.desc = desc;
        t.category = category;
        t.priority = priority;
        t.dueDate = dueDate;
        t.estDuration = estDuration;
      }
    } else {
      // Create
      tasks.unshift({
        id: `task-${Date.now()}`,
        title,
        desc,
        category,
        priority,
        status: 'pending',
        dueDate,
        estDuration,
        actualDuration: 0,
        createdAt: Date.now()
      });
    }

    DataStorage.save(DataStorage.KEYS.TASKS, tasks);
    Modals.close('modal-task');
    TodayDashboard.render();
    Tasks.render();
    Toast.show('Task saved successfully.');
  }
};

// ============================================================================
// 7. FOCUS MODE (DEEP WORK & ACCURATE TIMER)
// ============================================================================
const FocusMode = {
  totalSeconds: 25 * 60,
  secondsRemaining: 25 * 60,
  timerInterval: null,
  isRunning: false,
  startTimestamp: null,
  selectedTask: null,
  isFullscreen: false,

  quotes: [
    "Focus is a muscle. Train it with intentional presence.",
    "The less you need to see, the more you can focus on what matters.",
    "Progress over perfection. One session at a time.",
    "Do what is in front of you with calm diligence."
  ],

  updateUI() {
    const titleEl = document.getElementById('focus-current-title');
    const pillEl = document.getElementById('focus-task-pill');
    const quoteEl = document.getElementById('focus-quote-text');

    if (this.selectedTask) {
      if (titleEl) titleEl.textContent = this.selectedTask.title;
      if (pillEl) pillEl.textContent = `🎯 ${this.selectedTask.category || 'Deep Work'}`;
    } else {
      if (titleEl) titleEl.textContent = "General Focus Session";
      if (pillEl) pillEl.textContent = "🎯 Deep Work";
    }

    if (quoteEl && !this.isRunning) {
      const q = this.quotes[Math.floor(Math.random() * this.quotes.length)];
      quoteEl.textContent = `“${q}”`;
    }

    this.renderDigits();
  },

  startWithTask(taskId) {
    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      this.selectedTask = task;
      const duration = task.estDuration || 25;
      this.setPreset(duration);
    }
    App.navigateTo('app-focus');
  },

  startWithCurrentSpotlight() {
    App.navigateTo('app-focus');
  },

  setPreset(minutes, btn) {
    if (this.isRunning) {
      if (!confirm('A focus session is active. Reset timer to change duration?')) return;
      this.cancelTimer();
    }
    this.totalSeconds = minutes * 60;
    this.secondsRemaining = this.totalSeconds;
    this.renderDigits();

    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  },

  startTimer() {
    this.isRunning = true;
    this.startTimestamp = Date.now() - ((this.totalSeconds - this.secondsRemaining) * 1000);

    const btn = document.getElementById('btn-timer-toggle');
    if (btn) {
      btn.textContent = 'Pause Session';
      btn.classList.replace('btn-primary', 'btn-secondary');
    }

    this.timerInterval = setInterval(() => {
      this.syncWithTimestamp();
    }, 1000);

    Toast.show('Deep Work started. Protect your focus.');
  },

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);

    const btn = document.getElementById('btn-timer-toggle');
    if (btn) {
      btn.textContent = 'Resume Session';
      btn.classList.replace('btn-secondary', 'btn-primary');
    }
    Toast.show('Focus session paused.');
  },

  syncWithTimestamp() {
    if (!this.isRunning) return;
    const elapsedSeconds = Math.floor((Date.now() - this.startTimestamp) / 1000);
    this.secondsRemaining = Math.max(0, this.totalSeconds - elapsedSeconds);
    this.renderDigits();

    if (this.secondsRemaining <= 0) {
      this.onTimerComplete();
    }
  },

  renderDigits() {
    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    const digitEl = document.getElementById('timer-countdown');
    if (digitEl) {
      digitEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // SVG Ring Progress (Circumference 282.7)
    const ring = document.getElementById('timer-progress-ring');
    if (ring && this.totalSeconds > 0) {
      const fraction = (this.totalSeconds - this.secondsRemaining) / this.totalSeconds;
      const offset = 282.7 * (1 - fraction);
      ring.style.strokeDashoffset = offset;
    }
  },

  cancelTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.secondsRemaining = this.totalSeconds;
    this.renderDigits();

    const btn = document.getElementById('btn-timer-toggle');
    if (btn) {
      btn.textContent = 'Start Session';
      btn.classList.replace('btn-secondary', 'btn-primary');
    }
  },

  onTimerComplete() {
    this.isRunning = false;
    clearInterval(this.timerInterval);

    // Record completed session
    const sessions = DataStorage.get(DataStorage.KEYS.FOCUS_SESSIONS, []);
    const focusMins = Math.round(this.totalSeconds / 60);
    sessions.push({
      id: `ses-${Date.now()}`,
      duration: focusMins,
      timestamp: Date.now(),
      taskId: this.selectedTask ? this.selectedTask.id : null
    });
    DataStorage.save(DataStorage.KEYS.FOCUS_SESSIONS, sessions);

    // Update actual duration on task if linked
    if (this.selectedTask) {
      const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
      const t = tasks.find(item => item.id === this.selectedTask.id);
      if (t) {
        t.actualDuration = (t.actualDuration || 0) + focusMins;
        DataStorage.save(DataStorage.KEYS.TASKS, tasks);
      }
    }

    Modals.open('modal-session-complete');
    TodayDashboard.render();
  },

  completeSessionAndTask() {
    if (this.selectedTask) {
      Tasks.toggleStatus(this.selectedTask.id);
    }
    Modals.close('modal-session-complete');
    this.cancelTimer();
    App.navigateTo('app-today');
  },

  continueWorkingSession() {
    Modals.close('modal-session-complete');
    this.cancelTimer();
    this.startTimer();
  },

  toggleFullscreen() {
    const el = document.getElementById('focus-workspace');
    const btn = document.getElementById('btn-fullscreen-toggle');
    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      el.classList.add('fullscreen-active');
      if (btn) btn.textContent = '✕ Exit Fullscreen';
    } else {
      el.classList.remove('fullscreen-active');
      if (btn) btn.textContent = '⛶ Fullscreen';
    }
  },

  handleSoundChange(val) {
    if (val !== 'none') {
      Toast.show(`Simulated ${val} ambient focus sound playing.`);
    }
  }
};

// ============================================================================
// 8. CALENDAR & SCHEDULING CONTROLLER
// ============================================================================
const CalendarView = {
  currentDate: new Date(),

  render() {
    const titleEl = document.getElementById('calendar-month-title');
    const grid = document.getElementById('calendar-grid-container');
    if (!grid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;

    grid.innerHTML = '';

    // Day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => {
      const header = document.createElement('div');
      header.className = 'cal-weekday';
      header.textContent = d;
      grid.appendChild(header);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const events = DataStorage.get(DataStorage.KEYS.CAL_EVENTS, []);
    const todayStr = new Date().toISOString().split('T')[0];

    // Previous month cells
    for (let i = firstDay - 1; i >= 0; i--) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell other-month';
      cell.innerHTML = `<div class="cal-cell-header">${prevMonthDays - i}</div>`;
      grid.appendChild(cell);
    }

    // Current month cells
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateStr === todayStr) {
        cell.classList.add('today-cell');
      }

      cell.innerHTML = `<div class="cal-cell-header">${day}</div>`;

      // Render tasks on this date
      const dateTasks = tasks.filter(t => t.dueDate === dateStr);
      dateTasks.forEach(t => {
        const p = document.createElement('div');
        p.className = 'cal-event-pill task-event';
        p.textContent = `✓ ${t.title}`;
        p.title = t.title;
        cell.appendChild(p);
      });

      // Render events on this date
      const dateEvents = events.filter(e => e.date === dateStr);
      dateEvents.forEach(e => {
        const p = document.createElement('div');
        p.className = 'cal-event-pill';
        p.textContent = `⏱ ${e.time || ''} ${e.title}`;
        cell.appendChild(p);
      });

      grid.appendChild(cell);
    }
  },

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  },

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  },

  goToToday() {
    this.currentDate = new Date();
    this.render();
  },

  openAddEventModal() {
    document.getElementById('event-form-date').value = new Date().toISOString().split('T')[0];
    Modals.open('modal-event');
  },

  handleEventSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('event-form-title').value.trim();
    const date = document.getElementById('event-form-date').value;
    const time = document.getElementById('event-form-time').value;

    const events = DataStorage.get(DataStorage.KEYS.CAL_EVENTS, []);
    events.push({ id: `evt-${Date.now()}`, title, date, time });
    DataStorage.save(DataStorage.KEYS.CAL_EVENTS, events);

    Modals.close('modal-event');
    this.render();
    Toast.show('Calendar event created.');
  },

  connectGoogleCalendar() {
    Toast.show('Connecting Google OAuth 2.0... (Demo Mode Simulated)');
  }
};

// ============================================================================
// 9. REFERENCE HUB (MICRO NOTES)
// ============================================================================
const Notes = {
  activeNoteId: null,
  saveTimeout: null,

  render() {
    const notes = DataStorage.get(DataStorage.KEYS.NOTES, []);
    const listEl = document.getElementById('notes-item-list');
    if (!listEl) return;

    if (notes.length === 0) {
      listEl.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">No notes yet. Create one!</div>`;
      return;
    }

    if (!this.activeNoteId && notes.length > 0) {
      this.activeNoteId = notes[0].id;
    }

    listEl.innerHTML = notes.map(n => `
      <div class="note-item ${n.id === this.activeNoteId ? 'active' : ''}" onclick="Notes.selectNote('${n.id}')">
        <div class="note-item-title">${escapeHTML(n.title || 'Untitled Note')}</div>
        <div class="note-item-preview">${escapeHTML(n.body ? n.body.substring(0, 40) + '...' : 'Empty note')}</div>
      </div>
    `).join('');

    const currentNote = notes.find(n => n.id === this.activeNoteId);
    if (currentNote) {
      const titleInput = document.getElementById('note-title-input');
      const bodyInput = document.getElementById('note-body-input');
      if (titleInput) titleInput.value = currentNote.title || '';
      if (bodyInput) bodyInput.value = currentNote.body || '';
    }
  },

  selectNote(id) {
    this.activeNoteId = id;
    this.render();
  },

  createNewNote() {
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      body: '',
      updatedAt: Date.now()
    };
    const notes = DataStorage.get(DataStorage.KEYS.NOTES, []);
    notes.unshift(newNote);
    DataStorage.save(DataStorage.KEYS.NOTES, notes);
    this.activeNoteId = newNote.id;
    this.render();
    Toast.show('New note created.');
  },

  handleTitleInput(val) {
    this.queueAutosave(val, null);
  },

  handleBodyInput(val) {
    this.queueAutosave(null, val);
  },

  queueAutosave(newTitle, newBody) {
    const statusEl = document.getElementById('note-save-status');
    if (statusEl) statusEl.textContent = 'Saving...';

    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      const notes = DataStorage.get(DataStorage.KEYS.NOTES, []);
      const note = notes.find(n => n.id === this.activeNoteId);
      if (note) {
        if (newTitle !== null) note.title = newTitle;
        if (newBody !== null) note.body = newBody;
        note.updatedAt = Date.now();
        DataStorage.save(DataStorage.KEYS.NOTES, notes);
      }
      if (statusEl) statusEl.textContent = 'Saved locally';
      this.render();
    }, 400);
  },

  copyCurrentNote() {
    const body = document.getElementById('note-body-input')?.value || '';
    navigator.clipboard.writeText(body).then(() => {
      Toast.show('Note copied to clipboard!');
    }).catch(() => {
      Toast.show('Copy failed, please copy manually.', 'error');
    });
  },

  deleteCurrentNote() {
    if (!this.activeNoteId) return;
    if (!confirm('Delete this note?')) return;

    let notes = DataStorage.get(DataStorage.KEYS.NOTES, []);
    notes = notes.filter(n => n.id !== this.activeNoteId);
    DataStorage.save(DataStorage.KEYS.NOTES, notes);
    this.activeNoteId = notes.length > 0 ? notes[0].id : null;
    this.render();
    Toast.show('Note deleted.');
  },

  searchNotes(query) {
    const notes = DataStorage.get(DataStorage.KEYS.NOTES, []);
    const filtered = notes.filter(n => (n.title && n.title.toLowerCase().includes(query.toLowerCase())) || (n.body && n.body.toLowerCase().includes(query.toLowerCase())));
    const listEl = document.getElementById('notes-item-list');
    if (!listEl) return;

    listEl.innerHTML = filtered.map(n => `
      <div class="note-item ${n.id === this.activeNoteId ? 'active' : ''}" onclick="Notes.selectNote('${n.id}')">
        <div class="note-item-title">${escapeHTML(n.title || 'Untitled Note')}</div>
        <div class="note-item-preview">${escapeHTML(n.body ? n.body.substring(0, 40) + '...' : 'Empty note')}</div>
      </div>
    `).join('');
  }
};

// ============================================================================
// 10. EMOTIONAL PRODUCTIVITY LOGGER
// ============================================================================
const MoodLogger = {
  log(score, label) {
    const logs = DataStorage.get(DataStorage.KEYS.MOOD_LOGS, []);
    logs.push({
      id: `mood-${Date.now()}`,
      score,
      label,
      timestamp: Date.now()
    });
    DataStorage.save(DataStorage.KEYS.MOOD_LOGS, logs);

    const statusEl = document.getElementById('last-mood-logged');
    if (statusEl) statusEl.textContent = `Logged: ${label} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    Toast.show(`Recorded energy state: ${label}`);
  }
};

// ============================================================================
// 11. AI COACH SERVICE (EXPLAINABLE LOCAL REASONING ENGINE)
// ============================================================================
const AICoach = {
  quota: 15,

  sendMessage() {
    const input = document.getElementById('ai-user-prompt');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    this.appendMessage('user', userText);
    input.value = '';

    setTimeout(() => {
      const response = this.generateLocalResponse(userText);
      this.appendMessage('assistant', response);
      this.decrementQuota();
    }, 450);
  },

  runPrompt(promptText) {
    this.appendMessage('user', promptText);
    setTimeout(() => {
      const response = this.generateLocalResponse(promptText);
      this.appendMessage('assistant', response);
      this.decrementQuota();
    }, 450);
  },

  appendMessage(role, text) {
    const chatContainer = document.getElementById('ai-chat-messages');
    if (!chatContainer) return;

    const msg = document.createElement('div');
    msg.className = `ai-msg ${role}`;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  generateLocalResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('break down') || p.includes('proposal') || p.includes('thesis')) {
      return `Here is a clear 3-step actionable breakdown for your objective:
1. Clarify Deliverable: Outline the core objective and table of contents (15m).
2. Draft Primary Section: Write the introduction or core thesis point without editing (25m Deep Work).
3. Review & Format: Check citations and prepare executive summary (20m).

Would you like to start a 25-minute Focus Session on Step 1 now?`;
    }
    if (p.includes('procrastination') || p.includes('stuck') || p.includes('tired')) {
      return `To break through resistance:
• Lower the activation energy: commit to working for just 5 minutes.
• Remove external friction: silence notifications and close unrelated tabs.
• Pick the smallest subtask on your list and click 'Start Focus'. Momentum will follow.`;
    }
    if (p.includes('review')) {
      const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
      const completed = tasks.filter(t => t.status === 'completed').length;
      return `Daily Performance Review:
You have completed ${completed} task(s). Your consistency is solid. Focus on maintaining a regular morning deep work window tomorrow.`;
    }
    return `Based on your work patterns: prioritize single-tasking over rapid context switching. Choose your highest priority item in the Today dashboard and begin a 25m Focus Session.`;
  },

  updateQuotaUI() {
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    const badge = document.getElementById('ai-quota-badge');
    if (!badge) return;

    if (user.isPremium) {
      badge.className = 'receipt-status-badge';
      badge.style.marginBottom = '0';
      badge.innerHTML = '👑 Pro Member: Kuota AI Tanpa Batas';
    } else {
      badge.className = 'badge badge-amber';
      badge.textContent = `Demo Mode: ${this.quota}/15 Requests Remaining`;
    }
  },

  decrementQuota() {
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    if (user.isPremium) {
      this.updateQuotaUI();
      return;
    }
    this.quota = Math.max(0, this.quota - 1);
    this.updateQuotaUI();
  }
};

// ============================================================================
// 12. INSIGHTS & ANALYTICS (NATIVE SVG CHARTS)
// ============================================================================
const Insights = {
  period: 'week',

  setPeriod(period, btn) {
    this.period = period;
    document.querySelectorAll('#view-app-insights .btn-secondary').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.render();
  },

  render() {
    this.renderFocusChart();
    this.renderTasksChart();
    this.renderCategoryBreakdown();
  },

  renderFocusChart() {
    const container = document.getElementById('chart-focus-minutes');
    if (!container) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Representative aggregated minutes
    const data = [45, 60, 25, 90, 50, 20, 35];
    const maxVal = Math.max(...data, 100);

    const svgBars = data.map((val, idx) => {
      const height = (val / maxVal) * 120;
      const x = idx * 60 + 20;
      const y = 140 - height;
      return `
        <rect x="${x}" y="${y}" width="34" height="${height}" rx="6" fill="#2563EB" />
        <text x="${x + 17}" y="156" font-size="10" text-anchor="middle" fill="#64748B">${days[idx]}</text>
        <text x="${x + 17}" y="${y - 6}" font-size="9" text-anchor="middle" font-weight="700" fill="#0F172A">${val}m</text>
      `;
    }).join('');

    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 460 170">
        <line x1="10" y1="140" x2="450" y2="140" stroke="#E2E8F0" stroke-width="1"/>
        ${svgBars}
      </svg>
    `;
  },

  renderTasksChart() {
    const container = document.getElementById('chart-tasks-completed');
    if (!container) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [3, 5, 2, 6, 4, 1, 2];
    const maxVal = Math.max(...data, 8);

    const svgBars = data.map((val, idx) => {
      const height = (val / maxVal) * 120;
      const x = idx * 60 + 20;
      const y = 140 - height;
      return `
        <rect x="${x}" y="${y}" width="34" height="${height}" rx="6" fill="#38BDF8" />
        <text x="${x + 17}" y="156" font-size="10" text-anchor="middle" fill="#64748B">${days[idx]}</text>
        <text x="${x + 17}" y="${y - 6}" font-size="9" text-anchor="middle" font-weight="700" fill="#0F172A">${val}</text>
      `;
    }).join('');

    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 460 170">
        <line x1="10" y1="140" x2="450" y2="140" stroke="#E2E8F0" stroke-width="1"/>
        ${svgBars}
      </svg>
    `;
  },

  renderCategoryBreakdown() {
    const listEl = document.getElementById('category-distribution-list');
    if (!listEl) return;

    const tasks = DataStorage.get(DataStorage.KEYS.TASKS, []);
    const counts = {};
    tasks.forEach(t => {
      const cat = t.category || 'Work';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = tasks.length || 1;
    listEl.innerHTML = Object.entries(counts).map(([cat, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
            <span>${cat}</span>
            <strong>${count} tasks (${pct}%)</strong>
          </div>
          <div style="height: 6px; background-color: var(--border-subtle); border-radius: 3px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background-color: var(--accent-forest);"></div>
          </div>
        </div>
      `;
    }).join('');
  }
};

// ============================================================================
// 12.8 DYNAMIC QRIS ENGINE (EMVCo ASPI / BANK INDONESIA COMPLIANT)
// ============================================================================
const QRISDynamic = {
  // Official static QRIS payload registered for NOTO, DIGITAL & KREATIF (GoPay / ASPI)
  BASE_STATIC: '00020101021126610014COM.GO-JEK.WWW01189360091432195525970210G2195525970303UMI51440014ID.CO.QRIS.WWW0215ID10266150426800303UMI5204899953033605802ID5923noto, Digital & Kreatif6004SOLO61055712662070703A0163042EBC',

  // Compute CRC-16 / CCITT-FALSE (Polynomial 0x1021, Initial 0xFFFF)
  computeCRC16(str) {
    let crc = 0xFFFF;
    const poly = 0x1021;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      for (let b = 0; b < 8; b++) {
        const bit = ((code >> (7 - b)) & 1) === 1;
        const c15 = ((crc >> 15) & 1) === 1;
        crc = (crc << 1) & 0xFFFF;
        if (c15 ^ bit) {
          crc = (crc ^ poly) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  },

  // Generate dynamic QRIS string with pre-plotted transaction amount (Tag 54)
  generatePayload(amountInt) {
    const amount = parseInt(amountInt, 10);
    if (!amount || isNaN(amount) || amount <= 0) return this.BASE_STATIC;

    // 1. Convert Initiation Method from static 010211 to dynamic 010212 and strip old CRC
    let payload = this.BASE_STATIC.slice(0, -4).replace('000201010211', '000201010212');

    // 2. Format Tag 54 (Transaction Amount): 54 + 2-digit length + amount
    const amountStr = amount.toString();
    const lenStr = String(amountStr.length).padStart(2, '0');
    const tag54 = `54${lenStr}${amountStr}`;

    // 3. Insert Tag 54 immediately before Tag 58 (Country Code '5802ID')
    const splitIdx = payload.indexOf('5802ID');
    if (splitIdx !== -1) {
      payload = payload.slice(0, splitIdx) + tag54 + payload.slice(splitIdx);
    } else {
      payload += tag54;
    }

    // 4. Calculate new CRC16
    const crc = this.computeCRC16(payload);
    return payload + crc;
  },

  // Synthesize dynamic flyer on canvas with official GoPay / QRIS layout
  async generateDynamicFlyerDataUrl(baseFlyerImg, amountInt) {
    const payload = this.generatePayload(amountInt);

    // 1. Generate QR matrix offscreen using QRCode library
    const tempDiv = document.createElement('div');
    if (typeof QRCode !== 'undefined') {
      new QRCode(tempDiv, {
        text: payload,
        width: 375,
        height: 375,
        correctLevel: QRCode.CorrectLevel.M
      });
    }

    // Small delay to ensure QRCode renders to canvas
    await new Promise(r => setTimeout(r, 60));
    const qrCanvas = tempDiv.querySelector('canvas');
    const qrImg = tempDiv.querySelector('img');

    // 2. Create composite canvas matching flyer dimensions
    const canvas = document.createElement('canvas');
    const w = baseFlyerImg.naturalWidth || baseFlyerImg.width || 722;
    const h = baseFlyerImg.naturalHeight || baseFlyerImg.height || 1024;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 3. Draw base flyer
    ctx.drawImage(baseFlyerImg, 0, 0, w, h);

    // 4. Clear old QR area with pure white quiet zone
    // Coordinates: x: 145, y: 365, w: 430, h: 425
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(145, 365, 430, 425);

    // 5. Draw the new dynamic QR centered in this white box
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, 172, 390, 375, 375);
    } else if (qrImg) {
      ctx.drawImage(qrImg, 172, 390, 375, 375);
    }

    return {
      payload: payload,
      dataUrl: canvas.toDataURL('image/png')
    };
  }
};
window.QRISDynamic = QRISDynamic;

// ============================================================================
// 13. COMMERCIAL PREMIUM STORE & QRIS PAYMENT GATEWAY
// ============================================================================
const PremiumStore = {
  activeCountdownInterval: null,
  currentOrder: null,
  baseFlyerImg: null,

  preloadFlyer() {
    const img = new Image();
    img.onload = () => {
      this.baseFlyerImg = img;
    };
    img.src = 'assets/images/qris-noto.png';
  },

  async getBaseFlyerImg() {
    if (this.baseFlyerImg && this.baseFlyerImg.complete && this.baseFlyerImg.naturalWidth > 0) {
      return this.baseFlyerImg;
    }
    const domImg = document.getElementById('checkout-qris-img');
    if (domImg && domImg.complete && domImg.naturalWidth > 0 && domImg.src.includes('qris-noto.png')) {
      this.baseFlyerImg = domImg;
      return domImg;
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.baseFlyerImg = img;
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = 'assets/images/qris-noto.png';
    });
  },

  async updateDynamicQR(amountInt, itemTitle, invoiceId) {
    const lockedPill = document.getElementById('checkout-locked-nominal-val');
    const zoomLockedPill = document.getElementById('zoom-locked-nominal-val');
    const formatted = 'Rp' + amountInt.toLocaleString('id-ID');
    if (lockedPill) lockedPill.textContent = formatted;
    if (zoomLockedPill) zoomLockedPill.textContent = formatted;

    try {
      const baseImg = await this.getBaseFlyerImg();
      if (!baseImg) return;

      const result = await QRISDynamic.generateDynamicFlyerDataUrl(baseImg, amountInt);
      if (!result || !result.dataUrl) return;

      const checkoutImg = document.getElementById('checkout-qris-img');
      const zoomImg = document.getElementById('zoom-qris-img');
      const downloadBtn = document.getElementById('checkout-qr-download-btn');
      const zoomDownloadBtn = document.getElementById('zoom-qr-download-btn');

      if (checkoutImg) checkoutImg.src = result.dataUrl;
      if (zoomImg) zoomImg.src = result.dataUrl;

      const safeTitle = (itemTitle || 'NOTO-Plan').replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `QRIS-NOTO-${safeTitle}-Rp${amountInt}.png`;

      if (downloadBtn) {
        downloadBtn.href = result.dataUrl;
        downloadBtn.download = filename;
      }
      if (zoomDownloadBtn) {
        zoomDownloadBtn.href = result.dataUrl;
        zoomDownloadBtn.download = filename;
      }
    } catch (err) {
      console.warn('Gagal men-generate QRIS Dinamis:', err);
    }
  },

  // Helper for pricing selection from marketing landing page
  handleMarketingSelect(itemTitle, priceStr) {
    const user = DataStorage.get(DataStorage.KEYS.USER);
    if (user && user.isLoggedIn) {
      App.navigateTo('app-premium');
      setTimeout(() => {
        this.openCheckout(itemTitle, priceStr, 'subscription');
      }, 150);
    } else {
      Toast.show('Silakan login atau daftar akun untuk melanjutkan upgrade.');
      App.navigateTo('auth-register');
    }
  },

  // Open checkout modal with fresh order parameters
  openCheckout(itemTitle, priceStr, type = 'subscription') {
    const user = DataStorage.get(DataStorage.KEYS.USER, { name: 'Pengguna' });
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const invoiceId = `NOTO-INV-${dateCode}-${orderNum}`;

    const merchantCfg = DataStorage.get('noto_merchant_config') || {};
    const merchantName = merchantCfg.name || 'NOTO, DIGITAL & KREATIF';
    const merchantNmid = merchantCfg.nmid || 'ID1026615042680';

    this.currentOrder = {
      id: invoiceId,
      itemTitle: itemTitle,
      priceStr: priceStr,
      priceNum: parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0,
      type: type,
      userName: user.name || 'Pengguna NOTO',
      merchant: merchantName,
      nmid: merchantNmid,
      proofData: null,
      createdAt: Date.now()
    };

    // Populate Checkout Modal Elements
    const orderIdEl = document.getElementById('checkout-order-id');
    const titleEl = document.getElementById('checkout-item-title');
    const subtotalEl = document.getElementById('checkout-item-price-subtotal');
    const totalEl = document.getElementById('checkout-item-price-total');
    const nmidVal = document.getElementById('checkout-nmid-val');
    const proofPlaceholder = document.getElementById('checkout-proof-placeholder');
    const proofPreview = document.getElementById('checkout-proof-preview-zone');
    const proofInput = document.getElementById('checkout-proof-input');

    if (orderIdEl) orderIdEl.textContent = invoiceId;
    if (titleEl) titleEl.textContent = itemTitle;
    if (subtotalEl) subtotalEl.textContent = priceStr;
    if (totalEl) totalEl.textContent = priceStr;
    if (nmidVal) nmidVal.textContent = merchantNmid;

    if (proofInput) proofInput.value = '';
    if (proofPlaceholder) proofPlaceholder.style.display = 'block';
    if (proofPreview) {
      proofPreview.style.display = 'none';
      proofPreview.innerHTML = '';
    }

    // Generate Dynamic QRIS with locked amount
    this.updateDynamicQR(this.currentOrder.priceNum, itemTitle, invoiceId);

    // Start 15-minute countdown (900 seconds)
    this.startCountdown(15 * 60);

    // Open Modal
    Modals.open('modal-payment-checkout');
  },

  closeCheckout() {
    if (this.activeCountdownInterval) {
      clearInterval(this.activeCountdownInterval);
      this.activeCountdownInterval = null;
    }
    Modals.close('modal-payment-checkout');
  },

  startCountdown(seconds) {
    if (this.activeCountdownInterval) {
      clearInterval(this.activeCountdownInterval);
    }

    let remaining = seconds;
    const displayEl = document.getElementById('checkout-countdown-display');

    const updateDisplay = () => {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      if (displayEl) {
        displayEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (remaining <= 60) {
          displayEl.style.color = 'var(--accent-coral)';
        } else {
          displayEl.style.color = '';
        }
      }
    };

    updateDisplay();

    this.activeCountdownInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(this.activeCountdownInterval);
        this.activeCountdownInterval = null;
        if (displayEl) displayEl.textContent = '00:00 (Kadaluarsa)';
        Toast.show('Batas waktu pembayaran telah habis. Silakan buat pesanan baru.', 'error');
      } else {
        updateDisplay();
      }
    }, 1000);
  },

  copyNominal() {
    if (!this.currentOrder) return;
    const numOnly = this.currentOrder.priceNum;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(numOnly.toString()).then(() => {
        Toast.show(`Nominal ${this.currentOrder.priceStr} (${numOnly}) disalin ke clipboard!`);
      }).catch(() => {
        Toast.show(`Nominal: ${this.currentOrder.priceStr}`);
      });
    } else {
      Toast.show(`Nominal: ${this.currentOrder.priceStr}`);
    }
  },

  copyNMID() {
    const nmid = 'ID1026615042680';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(nmid).then(() => {
        Toast.show('NMID ID1026615042680 disalin ke clipboard!');
      });
    } else {
      Toast.show(`NMID: ${nmid}`);
    }
  },

  zoomQR() {
    Modals.open('modal-qr-zoom');
  },

  closeZoomQR() {
    Modals.close('modal-qr-zoom');
  },

  handleProofFile(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (this.currentOrder) {
        this.currentOrder.proofData = dataUrl;
      }
      const placeholder = document.getElementById('checkout-proof-placeholder');
      const previewZone = document.getElementById('checkout-proof-preview-zone');

      if (placeholder) placeholder.style.display = 'none';
      if (previewZone) {
        previewZone.style.display = 'block';
        previewZone.innerHTML = `
          <div class="proof-preview-wrapper">
            <img src="${dataUrl}" alt="Bukti Transfer" class="proof-thumbnail">
            <div style="flex: 1; text-align: left;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">${file.name}</div>
              <div style="font-size: 0.72rem; color: #16A34A; font-weight: 600;">✓ Bukti siap dilampirkan</div>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); PremiumStore.removeProofFile();" style="color: var(--accent-coral);">✕</button>
          </div>
        `;
      }
      Toast.show('Bukti pembayaran berhasil diunggah.');
    };

    reader.readAsDataURL(file);
  },

  removeProofFile() {
    if (this.currentOrder) this.currentOrder.proofData = null;
    const input = document.getElementById('checkout-proof-input');
    const placeholder = document.getElementById('checkout-proof-placeholder');
    const previewZone = document.getElementById('checkout-proof-preview-zone');

    if (input) input.value = '';
    if (placeholder) placeholder.style.display = 'block';
    if (previewZone) {
      previewZone.style.display = 'none';
      previewZone.innerHTML = '';
    }
  },

  // Confirm payment & simulate verification
  confirmPayment() {
    if (!this.currentOrder) return;

    // Close checkout modal & stop timer
    this.closeCheckout();

    // Show verification spinner modal
    Modals.open('modal-payment-verifying');

    // Simulate verification delay (1.6s)
    setTimeout(() => {
      Modals.close('modal-payment-verifying');
      this.finalizeSuccessPayment();
    }, 1600);
  },

  finalizeSuccessPayment() {
    const order = this.currentOrder;
    if (!order) return;

    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    const now = new Date();

    // Calculate subscription validity
    let expiryDate = new Date();
    if (order.itemTitle.includes('Yearly')) {
      expiryDate.setFullYear(now.getFullYear() + 1);
    } else if (order.itemTitle.includes('6-Month') || order.itemTitle.includes('6 Months')) {
      expiryDate.setMonth(now.getMonth() + 6);
    } else if (order.itemTitle.includes('Monthly')) {
      expiryDate.setMonth(now.getMonth() + 1);
    } else {
      // Add-on lifetime
      expiryDate.setFullYear(now.getFullYear() + 10);
    }

    // Update user profile
    if (order.type === 'subscription' || !user.isPremium) {
      user.isPremium = true;
      user.plan = `${order.itemTitle} (Pro)`;
      user.premiumExpiry = expiryDate.toISOString();
    }
    if (!user.unlockedAddons) user.unlockedAddons = [];
    if (order.type === 'addon' && !user.unlockedAddons.includes(order.itemTitle)) {
      user.unlockedAddons.push(order.itemTitle);
    }
    DataStorage.save(DataStorage.KEYS.USER, user);

    // Save transaction record to payments history
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const transactionRecord = {
      id: order.id,
      title: order.itemTitle,
      priceStr: order.priceStr,
      priceNum: order.priceNum,
      type: order.type,
      date: now.toISOString(),
      dateFormatted: now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB',
      merchant: order.merchant || 'NOTO, DIGITAL & KREATIF',
      nmid: order.nmid || 'ID1026615042680',
      status: 'Lunas (Verified)',
      hasProof: !!order.proofData,
      proofData: order.proofData || null
    };
    payments.unshift(transactionRecord);
    DataStorage.save(DataStorage.KEYS.PAYMENTS, payments);

    // Record audit trail in shared admin logs
    const adminLogs = DataStorage.get(DataStorage.KEYS.ADMIN_LOGS, []);
    adminLogs.unshift({
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: `Transaksi pembayaran baru: ${transactionRecord.id} (${order.itemTitle} - ${order.priceStr}) [Lunas].`
    });
    if (adminLogs.length > 50) adminLogs.pop();
    DataStorage.save(DataStorage.KEYS.ADMIN_LOGS, adminLogs);

    // Populate Receipt Modal
    const receiptInv = document.getElementById('receipt-invoice-no');
    const receiptDate = document.getElementById('receipt-date-time');
    const receiptItem = document.getElementById('receipt-item-name');
    const receiptTotal = document.getElementById('receipt-total-paid');

    if (receiptInv) receiptInv.textContent = transactionRecord.id;
    if (receiptDate) receiptDate.textContent = transactionRecord.dateFormatted;
    if (receiptItem) receiptItem.textContent = transactionRecord.title;
    if (receiptTotal) receiptTotal.textContent = transactionRecord.priceStr;

    // Refresh application states
    App.updateUserProfileUI();
    AICoach.updateQuotaUI();
    this.render();

    // Open Success Receipt Modal
    Modals.open('modal-payment-success');
    Toast.show(`Pembayaran Berhasil! Selamat menikmati ${order.itemTitle}.`);
  },

  finishSuccess() {
    Modals.close('modal-payment-success');
    App.navigateTo('app-premium');
  },

  printReceipt() {
    window.print();
  },

  viewInvoice(invoiceId) {
    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);
    const invoice = payments.find(p => p.id === invoiceId);
    if (!invoice) return;

    const receiptInv = document.getElementById('receipt-invoice-no');
    const receiptDate = document.getElementById('receipt-date-time');
    const receiptItem = document.getElementById('receipt-item-name');
    const receiptTotal = document.getElementById('receipt-total-paid');

    if (receiptInv) receiptInv.textContent = invoice.id;
    if (receiptDate) receiptDate.textContent = invoice.dateFormatted || new Date(invoice.date).toLocaleDateString('id-ID');
    if (receiptItem) receiptItem.textContent = invoice.title;
    if (receiptTotal) receiptTotal.textContent = invoice.priceStr;

    Modals.open('modal-payment-success');
  },

  // Render Premium view elements (active banner, buttons, and transactions list)
  render() {
    const user = DataStorage.get(DataStorage.KEYS.USER, { plan: 'Free Plan' });
    const bannerSlot = document.getElementById('premium-membership-banner-slot');

    // Load dynamic pricing from shared configuration
    const pricingCfg = DataStorage.get('noto_pricing_config') || { monthly: 20000, sixMonth: 100000, yearly: 160000 };
    const monthlyPriceStr = 'Rp' + (pricingCfg.monthly || 20000).toLocaleString('id-ID');
    const sixMonthPriceStr = 'Rp' + (pricingCfg.sixMonth || 100000).toLocaleString('id-ID');
    const yearlyPriceStr = 'Rp' + (pricingCfg.yearly || 160000).toLocaleString('id-ID');

    if (bannerSlot) {
      if (user.isPremium) {
        const expiryDate = user.premiumExpiry ? new Date(user.premiumExpiry).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'Aktif Selamanya';

        bannerSlot.innerHTML = `
          <div class="membership-banner">
            <div>
              <div class="membership-badge-pill">
                <span>👑</span> PRO MEMBER AKTIF
              </div>
              <div class="membership-plan-name">${user.plan || 'NOTO Pro Subscription'}</div>
              <div class="membership-expiry-text">
                Masa aktif berlaku hingga: <strong>${expiryDate}</strong> &bull; Pembayaran via QRIS Resmi
              </div>
              <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                <span class="badge badge-success" style="background: rgba(255,255,255,0.25); color: #FFF;">✓ Unlimited AI Coach</span>
                <span class="badge badge-success" style="background: rgba(255,255,255,0.25); color: #FFF;">✓ Auto Backups Aktif</span>
                <span class="badge badge-success" style="background: rgba(255,255,255,0.25); color: #FFF;">✓ Deep Analytics Unlocked</span>
              </div>
            </div>
            <button class="btn btn-secondary" style="background: rgba(255, 255, 255, 0.9); color: var(--accent-forest); font-weight: 700;" onclick="PremiumStore.openCheckout('Yearly Plan', '${yearlyPriceStr}', 'subscription')">
              Perpanjang Langganan
            </button>
          </div>
        `;
      } else {
        bannerSlot.innerHTML = `
          <div style="background: var(--bg-surface-soft); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 18px 24px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Status Akun Saat Ini</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">Free Tier (Akses Terbatas)</div>
              <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 2px;">Tingkatkan akun Anda ke Premium untuk kuota AI tak terbatas dan alur kerja pro.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="PremiumStore.openCheckout('Yearly Plan', '${yearlyPriceStr}', 'subscription')">
              ⚡ Upgrade ke Pro
            </button>
          </div>
        `;
      }
    }

    // Update Plan card tags and buttons with dynamic pricing
    const cardMonthly = document.getElementById('pricing-card-monthly');
    const cardYearly = document.getElementById('pricing-card-yearly');
    const card6Month = document.getElementById('pricing-card-6month');

    if (cardMonthly) {
      const tag = cardMonthly.querySelector('.price-tag');
      if (tag) tag.innerHTML = `${monthlyPriceStr}<span> / bln</span>`;
    }
    if (cardYearly) {
      const tag = cardYearly.querySelector('.price-tag');
      if (tag) tag.innerHTML = `${yearlyPriceStr}<span> / thn</span>`;
    }
    if (card6Month) {
      const tag = card6Month.querySelector('.price-tag');
      if (tag) tag.innerHTML = `${sixMonthPriceStr}<span> / 6 bln</span>`;
    }

    const btnMonthly = document.getElementById('btn-plan-monthly');
    const btnYearly = document.getElementById('btn-plan-yearly');
    const btn6Month = document.getElementById('btn-plan-6month');

    if (btnMonthly) {
      if (user.plan && user.plan.includes('Monthly')) {
        btnMonthly.textContent = 'Paket Anda Saat Ini ✓';
        btnMonthly.className = 'btn btn-secondary';
        btnMonthly.style.opacity = '0.75';
      } else {
        btnMonthly.textContent = 'Upgrade Bulanan';
        btnMonthly.className = 'btn btn-secondary';
        btnMonthly.style.opacity = '1';
        btnMonthly.setAttribute('onclick', `PremiumStore.openCheckout('Monthly Plan', '${monthlyPriceStr}', 'subscription')`);
      }
    }
    if (btnYearly) {
      if (user.plan && user.plan.includes('Yearly')) {
        btnYearly.textContent = 'Paket Anda Saat Ini ✓';
        btnYearly.className = 'btn btn-secondary';
        btnYearly.style.opacity = '0.75';
      } else {
        btnYearly.textContent = 'Upgrade 1 Tahun';
        btnYearly.className = 'btn btn-primary';
        btnYearly.style.opacity = '1';
        btnYearly.setAttribute('onclick', `PremiumStore.openCheckout('Yearly Plan', '${yearlyPriceStr}', 'subscription')`);
      }
    }
    if (btn6Month) {
      if (user.plan && (user.plan.includes('6-Month') || user.plan.includes('6 Months'))) {
        btn6Month.textContent = 'Paket Anda Saat Ini ✓';
        btn6Month.className = 'btn btn-secondary';
        btn6Month.style.opacity = '0.75';
      } else {
        btn6Month.textContent = 'Upgrade 6 Bulan';
        btn6Month.className = 'btn btn-secondary';
        btn6Month.style.opacity = '1';
        btn6Month.setAttribute('onclick', `PremiumStore.openCheckout('6-Month Plan', '${sixMonthPriceStr}', 'subscription')`);
      }
    }

    // Update Addon buttons
    const unlockedAddons = user.unlockedAddons || [];
    const btnCareer = document.getElementById('btn-addon-career');
    const btnMeeting = document.getElementById('btn-addon-meeting');
    const btnStudy = document.getElementById('btn-addon-study');

    if (btnCareer) {
      if (unlockedAddons.includes('AI Career Planner') || (user.plan && user.plan.includes('Yearly'))) {
        btnCareer.textContent = 'Sudah Dimiliki ✓';
        btnCareer.className = 'btn btn-ghost btn-sm';
        btnCareer.disabled = true;
      } else {
        btnCareer.textContent = 'Beli Add-On';
        btnCareer.className = 'btn btn-secondary btn-sm';
        btnCareer.disabled = false;
      }
    }
    if (btnMeeting) {
      if (unlockedAddons.includes('Meeting Minutes Auto-Generator') || (user.plan && user.plan.includes('Yearly'))) {
        btnMeeting.textContent = 'Sudah Dimiliki ✓';
        btnMeeting.className = 'btn btn-ghost btn-sm';
        btnMeeting.disabled = true;
      } else {
        btnMeeting.textContent = 'Beli Add-On';
        btnMeeting.className = 'btn btn-secondary btn-sm';
        btnMeeting.disabled = false;
      }
    }
    if (btnStudy) {
      if (unlockedAddons.includes('AI Study Plan Generator') || (user.plan && user.plan.includes('Yearly'))) {
        btnStudy.textContent = 'Sudah Dimiliki ✓';
        btnStudy.className = 'btn btn-ghost btn-sm';
        btnStudy.disabled = true;
      } else {
        btnStudy.textContent = 'Beli Add-On';
        btnStudy.className = 'btn btn-secondary btn-sm';
        btnStudy.disabled = false;
      }
    }

    this.renderTransactions();
  },

  renderTransactions() {
    const container = document.getElementById('premium-transactions-tbody');
    if (!container) return;

    const payments = DataStorage.get(DataStorage.KEYS.PAYMENTS, []);

    if (payments.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px 16px; color: var(--text-muted); font-size: 0.88rem;">
          <div style="font-size: 2rem; margin-bottom: 6px;">🧾</div>
          Belum ada riwayat transaksi pembayaran.<br>
          Pilih salah satu paket premium atau add-on di atas untuk memulai transaksi via QRIS.
        </div>
      `;
      return;
    }

    let rowsHtml = payments.map(p => {
      return `
        <tr>
          <td><strong style="font-family: var(--font-mono); font-size: 0.82rem;">${p.id}</strong></td>
          <td>${p.dateFormatted || new Date(p.date).toLocaleDateString('id-ID')}</td>
          <td><strong>${p.title}</strong></td>
          <td style="font-family: var(--font-mono); font-weight: 600;">${p.priceStr}</td>
          <td><span style="font-size: 0.76rem; background: var(--accent-blue-subtle); color: var(--accent-forest); padding: 2px 8px; border-radius: 4px; font-weight: 600;">QRIS Gopay</span></td>
          <td><span class="receipt-status-badge" style="font-size: 0.72rem; padding: 2px 8px; margin: 0;">Lunas ✓</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="PremiumStore.viewInvoice('${p.id}')" style="padding: 4px 10px; font-size: 0.78rem;">
              Lihat Struk
            </button>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <table class="transactions-table">
        <thead>
          <tr>
            <th>No. Invoice</th>
            <th>Tanggal</th>
            <th>Paket / Item</th>
            <th>Nominal</th>
            <th>Metode</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  },

  // Backward compatibility alias for simulateCheckout
  simulateCheckout(itemTitle, price) {
    this.openCheckout(itemTitle, price, 'subscription');
  }
};
window.PremiumStore = PremiumStore;

// ============================================================================
// 14. SETTINGS CONTROLLER
// ============================================================================
const Settings = {
  updateName(newName) {
    if (!newName.trim()) return;
    const user = DataStorage.get(DataStorage.KEYS.USER, {});
    user.name = newName.trim();
    DataStorage.save(DataStorage.KEYS.USER, user);
    App.updateUserProfileUI();
    Toast.show('Display name updated.');
  }
};

// ============================================================================
// 15. MODAL MANAGEMENT
// ============================================================================
const Modals = {
  open(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  },

  close(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  },

  openQuickTask() {
    document.getElementById('task-form-id').value = '';
    document.getElementById('task-form-title').value = '';
    document.getElementById('task-form-desc').value = '';
    document.getElementById('task-form-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-task-title').textContent = 'Add New Task';
    this.open('modal-task');
  }
};

// ============================================================================
// 16. UTILITY FUNCTIONS
// ============================================================================
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function toggleFaq(el) {
  const item = el.parentElement;
  item.classList.toggle('active');
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
