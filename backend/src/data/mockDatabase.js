const pengurus = [
  {
    id: 1,
    role: 'Dosen Pembina',
    name: 'Dr. Rizal Ramadhan, M.Eng.',
    description: 'Pembina IKM ITERA yang memberikan arahan dan dukungan akademis.'
  },
  {
    id: 2,
    role: 'Ketua Umum',
    name: 'Hanafi Putra',
    description: 'Memimpin organisasi dan mewakili IKM ITERA di kegiatan kampus.'
  },
  {
    id: 3,
    role: 'Wakil Ketua',
    name: 'Maya Salsabila',
    description: 'Mendukung penyelenggaraan kegiatan serta operasional BPH.'
  },
  {
    id: 4,
    role: 'Sekretaris',
    name: 'Rizky Firmansyah',
    description: 'Mengelola administrasi organisasi dan dokumentasi acara.'
  },
  {
    id: 5,
    role: 'Bendahara',
    name: 'Nadia Pratiwi',
    description: 'Bertanggung jawab atas keuangan dan pelaporan anggaran.'
  },
  {
    id: 6,
    role: 'Departemen',
    name: 'Departemen Seni & Budaya',
    description: 'Membina kegiatan seni dan pelestarian budaya Minangkabau di kampus.'
  },
  {
    id: 7,
    role: 'Departemen',
    name: 'Departemen Pengembangan SDM',
    description: 'Mengelola pelatihan, mentoring, dan pengembangan kompetensi anggota.'
  },
  {
    id: 8,
    role: 'Departemen',
    name: 'Departemen Komunikasi & Publikasi',
    description: 'Mengelola laporan berita, publikasi, dan komunikasi organisasi.'
  }
]

const berita = [
  {
    id: 1,
    title: 'Peluncuran Website Resmi IKM ITERA',
    date: '2026-06-12',
    content: 'Situs baru ini menjadi pusat informasi resmi bagi seluruh anggota dan calon peserta kegiatan.' ,
    image: 'https://via.placeholder.com/640x360?text=Website+Resmi'
  },
  {
    id: 2,
    title: 'Workshop Tata Rias Minangkabau',
    date: '2026-05-26',
    content: 'Kegiatan pelatihan rias tradisional diadakan sebagai dukungan untuk acara adat kampus.',
    image: 'https://via.placeholder.com/640x360?text=Workshop+Rias'
  },
  {
    id: 3,
    title: 'Rapat Besar Pengurus Baru',
    date: '2026-04-05',
    content: 'Pembentukan tim BPH dan departemen untuk periode kepengurusan terbaru berlangsung sukses.',
    image: 'https://via.placeholder.com/640x360?text=Rapat+Pengurus'
  }
]

const prestasi = [
  {
    id: 1,
    title: 'Juara 1 Lomba Tari Tradisional',
    year: 2025,
    description: 'Tim IKM ITERA berhasil meraih juara pertama dalam festival seni kampus.'
  },
  {
    id: 2,
    title: 'Penghargaan Kampus Peduli Budaya',
    year: 2024,
    description: 'Kontribusi aktif IKM ITERA dalam pelestarian seni dan kebudayaan lokal.'
  },
  {
    id: 3,
    title: 'Program Mentoring Sukses',
    year: 2025,
    description: 'Inisiatif mentoring untuk calon mahasiswa baru dan generasi penerus.'
  }
]

module.exports = {
  pengurus,
  berita,
  prestasi
}
