# NOTO — Productivity Workspace & Customer App

> Aplikasi web produktivitas terpadu **NOTO — Get Things Done**.
> Menggabungkan Today Dashboard, Task Management Engine, Calendar & Scheduling, Deep Work Focus Mode, Reference Hub, Productivity Insights, AI Coach, dan Commercial QRIS Store.

Proyek ini dibangun murni menggunakan **HTML5 semantik, CSS3 responsif, dan Vanilla JavaScript (ES6+)** tanpa framework, bundler, atau dependensi eksternal.

---

## 📁 Struktur Direktori

```
apps/
├── index.html        # Entrypoint aplikasi utama (Autentikasi & Workspace Shell)
├── app.js            # Controller logika aplikasi, state management & local storage
├── styles.css        # Sistem desain terpadu aplikasi, modal, dan sidebar
├── admin.html        # Portal Staff Admin Operations (PIN Gate: noto2026 / admin123)
├── admin.js          # Controller operasional staf admin
├── manifest.json     # PWA Manifest untuk instalasi aplikasi di HP/Desktop
├── service-worker.js # Cache offline & PWA background engine
├── assets/
│   ├── icons/        # Ikon aplikasi PWA (192x192, 512x512, apple-touch-icon)
│   ├── images/       # Barcode QRIS Merchant dan branding
│   └── js/           # Library qrcode.min.js
└── README.md         # Dokumentasi proyek aplikasi
```

---

## 🔗 Hubungan dengan Website Publik (Web)

Pada file `app.js`, terdapat konfigurasi alamat website publik:

```javascript
const CONFIG = {
  // Ganti URL ini dengan URL GitHub Pages atau domain website publik Anda jika di-publish terpisah
  // Contoh: 'https://username.github.io/noto-web/'
  WEB_URL: '../web/index.html'
};
```

Tombol "Kembali ke Website Utama" pada layar login, register, dan tombol `🌐 Web` di sidebar akan mengarahkan pengguna ke alamat `CONFIG.WEB_URL`.

---

## 🚀 Cara Menjalankan Secara Lokal

Buka file `index.html` langsung di browser favorit Anda, atau jalankan static server:

```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan npx serve
npx serve .
```

Kunjungi `http://localhost:8000` di browser.

### Akses Portal Staff Admin
Buka `admin.html` di browser dan masukkan PIN demo staf: `noto2026` atau `admin123`.

---

## 📤 Cara Publish ke GitHub Pages

1. Buat repositori baru di GitHub (misal: `noto-apps` atau `noto-app`).
2. Masuk ke folder `apps` di komputer Anda:
   ```bash
   cd apps
   git init
   git add .
   git commit -m "feat: initial commit for NOTO workspace app"
   git branch -M main
   git remote add origin https://github.com/<username>/noto-apps.git
   git push -u origin main
   ```
3. Buka repositori di GitHub > Masuk ke **Settings** > **Pages**.
4. Pada bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
5. Aplikasi Anda akan aktif dalam beberapa saat di `https://<username>.github.io/noto-apps/`.
6. Pengguna yang mengunjungi URL tersebut di HP atau laptop dapat langsung mengklik tombol **"Install App"** untuk memasangnya sebagai Progressive Web App (PWA).
