# 🏛️ IKM ITERA Web Portal

Web Portal Resmi untuk **Ikatan Keluarga Minangkabau - Institut Teknologi Sumatera (IKM ITERA)**. Aplikasi ini dirancang sebagai pusat informasi paguyuban, pelestarian budaya Minangkabau, serta publikasi berita dan prestasi mahasiswa Minang di lingkungan kampus ITERA.

Proyek ini dibangun menggunakan arsitektur **Monorepo** dengan pemisahan penuh antara backend dan frontend (Decoupled System).

---

## 📁 Struktur Repositori

```text
Web-IKM/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── controllers/   # Logika penanganan request API
│   │   ├── data/          # Database tiruan (Mock Database)
│   │   ├── routes/        # Definisi rute Express
│   │   └── server.js      # Titik masuk utama backend (Port: 5000)
│   └── package.json
│
├── frontend/              # React + Vite (Tailwind CSS v4)
│   ├── src/
│   │   ├── components/    # Komponen global (Layout, Header, Footer)
│   │   ├── data/          # Konstanta & data lokal frontend
│   │   ├── pages/         # Halaman SPA (Home, Tentang, Portal, Pengurus)
│   │   ├── services/      # Layanan API (Axios/Fetch)
│   │   └── main.jsx
│   └── package.json
```

---

## 🛠️ Arsitektur & Teknologi

### **Backend**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Module System**: ES6 Modules (`"type": "module"`)
* **Dependencies**: `cors`, `dotenv`

### **Frontend**
* **Framework**: React 19 (Vite)
* **Styling**: Tailwind CSS v4 + Custom Minangkabau Theme Styles (seperti `.bg-minang` & `.marawa-gradient`)
* **Routing**: React Router DOM v7
* **API Client**: Fetch API (atau Axios untuk pemanggilan asinkron)

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

### **1. Jalankan Backend (API)**
Buka terminal baru di direktori root proyek:
```bash
cd backend
npm install
npm run dev
```
Backend akan berjalan di: **`http://localhost:5000`**

### **2. Jalankan Frontend (React)**
Buka terminal baru lagi dari direktori root proyek:
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di: **`http://localhost:5173`** (atau port default Vite lainnya)

---

## 📌 Rute API Utama (Backend)
Semua endpoint API diawali dengan `/api`:
* **`GET /api/pengurus`** - Mengembalikan struktur kepengurusan lengkap (Dosen Pembina, BPH, Departemen).
* **`GET /api/berita`** - Mengembalikan daftar berita terkini mengenai kegiatan IKM ITERA.
* **`GET /api/prestasi`** - Mengembalikan daftar prestasi kebudayaan/akademis anggota.

---

## 🎨 Palet Warna & Desain Budaya
Aplikasi menggunakan identitas budaya Minangkabau lewat kombinasi warna **Marawa** (Hitam, Merah, Kuning):
* **Merah Minang (`#8B0000` - `#D22B2B`)**: Melambangkan keberanian dan kehangatan kekeluargaan.
* **Marawa Gradient**: Digunakan pada elemen sorotan untuk memperkuat identitas organisasi.
