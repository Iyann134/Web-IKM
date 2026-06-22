# 💻 IKM ITERA Frontend (React SPA)

Direktori ini berisi kode sumber antarmuka pengguna (Frontend) untuk **Web Portal IKM ITERA**. Menggunakan React dengan Vite untuk proses build yang cepat, serta Tailwind CSS v4 sebagai kerangka kerja styling.

## 🛠️ Tech Stack & Library
- **React 19**
- **Vite** (Build Tool & Dev Server)
- **Tailwind CSS v4** (Utility-first styling)
- **React Router DOM v7** (Routing)
- **FontAwesome** (Ikonografi)

---

## 📂 Struktur Direktori
* `/src/components`: Komponen yang dapat digunakan kembali seperti `Layout.jsx` (Header, Footer, Navbar).
* `/src/pages`:
  - `Home.jsx` (Halaman utama dengan teks berjalan/running ticker pengumuman & kartu fitur).
  - `Tentang.jsx` (Visi misi, makna logo, dan sejarah singkat).
  - `Portal.jsx` (Menampilkan data dinamis prestasi dan berita yang diambil dari API).
  - `Pengurus.jsx` (Bagan organisasi pengurus terstruktur).
* `/src/services/api.js`: Konfigurasi klien API untuk mengambil data dari backend.
* `/src/data/mockData.js`: Data statis untuk pengumuman dan fitur beranda.

---

## 🚀 Memulai Pengoperasian Lokal

1. **Instal Dependensi:**
   ```bash
   npm install
   ```
2. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Aplikasi akan dapat diakses secara lokal pada URL yang ditunjukkan di terminal (biasanya `http://localhost:5173`).

3. **Build untuk Produksi:**
   ```bash
   npm run build
   ```

---

## ⚙️ Variabel Lingkungan (Environment Variables)
Secara default, aplikasi frontend mengarah ke server backend lokal di `http://localhost:5000/api`. Jika ingin mengubahnya (misalnya untuk kebutuhan deployment), buat berkas `.env` di direktori ini dan tambahkan variabel berikut:

```env
VITE_API_BASE_URL=https://nama-api-backend-anda.com/api
```
