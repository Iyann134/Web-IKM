import { motion } from 'framer-motion'
import logoIkm from '../assets/logo-ikm.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faBullseye, faCalendarAlt, faAward, faUsers, faCrown, faHandshake } from '@fortawesome/free-solid-svg-icons'

const MinangPatternBg = () => (
  <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="minang-motif-about" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 30,0 L 60,60 L 0,60 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 30,20 L 50,60 L 10,60 Z" fill="currentColor" />
          <circle cx="30" cy="10" r="3" fill="currentColor" />
          <path d="M 0,30 H 60" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#minang-motif-about)" />
    </svg>
  </div>
)

export default function Tentang() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <section className="bg-[#fff9f5] py-12 px-4 md:px-8 text-[#1f1414] overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl space-y-20"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-[#8B0000] via-[#a61c1c] to-[#600000] p-8 md:p-14 text-white shadow-[0_30px_70px_-30px_rgba(139,0,0,0.4)] overflow-hidden"
        >
          <MinangPatternBg />
          <div className="relative z-10 max-w-4xl space-y-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
              Profil Resmi Organisasi
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Ikatan Keluarga Minangkabau ITERA
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-white/95 font-medium">
              Ikatan Keluarga Minangkabau (IKM) ITERA adalah unit kegiatan mahasiswa sekaligus paguyuban kekeluargaan bagi mahasiswa berdarah Minangkabau di lingkungan Institut Teknologi Sumatera. Dibentuk sebagai wadah pemersatu, sarana pengembangan minat bakat, serta benteng pelestarian adat kebudayaan Ranah Minang di tanah rantau.
            </p>
          </div>
        </motion.div>

        {/* Visi & Misi Grid */}
        <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-2">
          {/* Visi Card */}
          <motion.div
            whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(139, 0, 0, 0.12)' }}
            className="rounded-[2.5rem] border border-[#8b0000]/10 bg-gradient-to-br from-[#fff7f5] to-white p-8 md:p-10 shadow-sm transition-all"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b0000]/10 text-[#8b0000] mb-6">
              <FontAwesomeIcon icon={faEye} className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#8b0000] tracking-wide">Visi</h3>
            <p className="mt-4 text-base font-bold leading-relaxed text-[#4e1008]">
              "Menjadikan UKM Ikatan Keluarga Minangkabau sebagai tempat paguyuban, pengembangan budaya, dan sebagai sarana penampung kreativitas, inspirasi, dan aspirasi mahasiswa Minangkabau."
            </p>
          </motion.div>

          {/* Misi Card */}
          <motion.div
            whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(139, 0, 0, 0.12)' }}
            className="rounded-[2.5rem] border border-[#8b0000]/10 bg-white p-8 md:p-10 shadow-sm transition-all"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffb700]/10 text-[#c88d00] mb-6">
              <FontAwesomeIcon icon={faBullseye} className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#8b0000] tracking-wide">Misi</h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
              {[
                'Mengaktifkan dan memajukan kebudayaan yang ada di dalam UKM Ikatan Keluarga Minangkabau.',
                'Menjalin hubungan yang harmonis dengan semua anggota atau keluarga yang ada di dalam UKM Ikatan Keluarga Minangkabau.',
                'Melaksanakan program-program yang telah ada dan meningkatkan program yang telah tersusun sesuai rencana.',
                'Meningkatkan kemajuan UKM Ikatan Keluarga Minangkabau menjadi yang lebih baik.',
                'Mengadakan kegiatan-kegiatan di bidang kebudayaan, pendidikan, dan keagamaan.'
              ].map((misi, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-[#8b0000]" />
                  <span>{misi}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Timeline Sejarah Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#8b0000]">Sejarah Perjalanan IKM</h2>
            <p className="text-sm text-slate-500">Menyusuri rintisan perjuangan dari awal terbentuk hingga era kejayaan dan kolaborasi.</p>
          </div>

          <div className="relative border-l-2 border-[#8b0000]/15 pl-6 ml-4 md:ml-8 space-y-12 py-2">
            {/* 2015 */}
            <div className="relative">
              <div className="absolute -left-[35px] top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#8b0000] text-white text-[10px] shadow-md ring-4 ring-[#fff9f5]">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="space-y-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#fff2ef] border border-[#8b0000]/15 px-3 py-0.5 text-xs font-bold text-[#8b0000]">
                    Tahun 2015
                  </span>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">Awal Pembentukan &amp; Peresmian Rektor</h4>
                </div>
                
                {/* Narrative text block */}
                <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-[#3c302a] max-w-4xl bg-gradient-to-br from-[#fffdfc] via-white to-[#fffbf9] border border-[#8b0000]/10 p-7 md:p-8 rounded-[2rem] shadow-[0_15px_40px_-20px_rgba(139,0,0,0.06)] relative overflow-hidden">
                  <div className="h-[3px] w-24 bg-gradient-to-r from-[#000000] via-[#8b0000] to-[#ffb700] rounded-full mb-5 opacity-80" />
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#8b0000] first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:font-serif">
                    IKM ITERA resmi dibentuk pada tahun <strong className="text-[#8b0000] font-bold">2015</strong> bersamaan dengan momen bersejarah <strong className="text-[#8b0000] font-bold">Dies Natalis ITERA</strong>, dan diresmikan langsung oleh Rektor pertama ITERA saat itu, yaitu <strong className="text-[#8b0000] font-bold">Bapak Prof. Ofyar Z. Tamin, M.Sc., Ph.D.</strong> Pembentukan organisasi ini bertujuan sebagai wadah perkumpulan mahasiswa Minang di ITERA yang berbasis pada pelestarian kebudayaan Minangkabau di tanah rantau.
                  </p>
                  <p>
                    Pada masa awal, jumlah mahasiswa asal Minangkabau di ITERA masih sangat sedikit sehingga tantangan utamanya adalah keterbatasan massa. Meskipun begitu, semangat kekeluargaan untuk membentuk komunitas sudah sangat kuat. Saat itu, <strong className="text-[#8b0000] font-bold">Da Fiki (Geofisika 2012)</strong> ditunjuk sebagai datuak pertama (informal) di tengah jumlah anggota yang masih minim. Beberapa UKM (Unit Kegiatan Mahasiswa) lain juga sudah ada, namun IKM menjadi wadah awal bagi mahasiswa Minang untuk berkumpul dan melestarikan budaya mereka.
                  </p>
                </div>
              </div>
            </div>

            {/* Kepemimpinan Awal & Aktifnya Keanggotaan */}
            <div className="relative">
              <div className="absolute -left-[35px] top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ffb700] text-white text-[10px] shadow-md ring-4 ring-[#fff9f5]">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="space-y-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#fffce6] border border-[#ffb700]/30 px-3 py-0.5 text-xs font-bold text-[#b88200]">
                    Fase Rintisan
                  </span>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">Pondasi Sistem &amp; Sosialisasi</h4>
                </div>

                {/* Narrative text block */}
                <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-[#3c302a] max-w-4xl bg-gradient-to-br from-[#fffdfc] via-white to-[#fffbf9] border border-[#ffb700]/25 p-7 md:p-8 rounded-[2rem] shadow-[0_15px_40px_-20px_rgba(255,183,0,0.06)] relative overflow-hidden">
                  <div className="h-[3px] w-24 bg-gradient-to-r from-[#000000] via-[#8b0000] to-[#ffb700] rounded-full mb-5 opacity-80" />
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#b88200] first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:font-serif">
                    Setelah era Da Fiki, estafet kepemimpinan kemudian berlanjut ke <strong className="text-[#b88200] font-bold">Da Beta (Geofisika 2015)</strong> dan diteruskan oleh <strong className="text-[#b88200] font-bold">Da Wahyu Afandi Agusa (Fisika 2016)</strong>. Pada masa itu, IKM ITERA masih sederhana dan belum memiliki struktur kepengurusan yang formal maupun bagan organisasi yang jelas.
                  </p>
                  <p>
                    Meskipun demikian, sistem keanggotaan mulai aktif dihidupkan dengan dilakukannya program sosialisasi terarah serta program <strong className="text-[#b88200] font-bold">penjemputan anggota baru</strong> di masa kepemimpinan Da Beta. Koordinasi antar anggota berjalan sangat erat melalui komunikasi tatap muka secara langsung, tanpa adanya koordinasi grup media sosial digital berukuran besar seperti sekarang.
                  </p>
                </div>
              </div>
            </div>

            {/* Era Batagak Gala & Reformasi */}
            <div className="relative">
              <div className="absolute -left-[35px] top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white text-[10px] shadow-md ring-4 ring-[#fff9f5]">
                <FontAwesomeIcon icon={faCrown} />
              </div>
              <div className="space-y-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#e8f3ff] border border-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-700">
                    Era Reformasi (2017)
                  </span>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">Peristiwa Besar Batagak Gala</h4>
                </div>

                {/* Narrative text block */}
                <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-[#3c302a] max-w-4xl bg-gradient-to-br from-[#fffdfc] via-white to-[#fffbf9] border border-blue-500/20 p-7 md:p-8 rounded-[2rem] shadow-[0_15px_40px_-20px_rgba(59,130,246,0.06)] relative overflow-hidden">
                  <div className="h-[3px] w-24 bg-gradient-to-r from-[#000000] via-[#8b0000] to-[#ffb700] rounded-full mb-5 opacity-80" />
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-blue-700 first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:font-serif">
                    Ketika <strong className="text-blue-700 font-bold">Da Alhadi (Elektro 2017)</strong> masuk, terjadi perubahan besar di dalam tubuh organisasi. Masa transisi kepemimpinan ini ditandai secara adat melalui penyelenggaraan acara besar <strong className="text-blue-700 font-bold">Batagak Gala (Malewa Gala)</strong>, sebuah upacara adat sakral penobatan datuak yang dihadiri oleh seluruh massa IKM ITERA yang telah berkembang pesat.
                  </p>
                  <p>
                    Di bawah kepemimpinan Da Alhadi, reformasi struktur kepengurusan formal (Ketua, Wakil, dan Kepala Divisi) mulai terbentuk secara sistematis. Pembinaan organisasi berjalan mantap di bawah bimbingan dosen pembina pertama yaitu <strong className="text-blue-700 font-bold">Pak Dean Corio, ST., MT.</strong>, disusul oleh <strong className="text-blue-700 font-bold">Pak Arid</strong>, lalu <strong className="text-blue-700 font-bold">Pak Ferzet</strong>. Estafet kepemimpinan terus berjalan konsisten dari Da Alhadi ke <strong className="text-blue-700 font-bold">Hafis (Geologi 2018)</strong>, <strong className="text-blue-700 font-bold">Rozi (Geomatika 2019)</strong>, <strong className="text-blue-700 font-bold">Da Isaik (Elektro 2020)</strong>, <strong className="text-blue-700 font-bold">Fadli (Elektro 2021)</strong>, <strong className="text-blue-700 font-bold">Roland (MT 2022)</strong>, hingga <strong className="text-blue-700 font-bold">Adib (Tambang 2023)</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Era Kolaborasi Tokoh & Puncak Kejayaan */}
            <div className="relative">
              <div className="absolute -left-[35px] top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] shadow-md ring-4 ring-[#fff9f5]">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <div className="space-y-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#edf6f1] border border-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-700">
                    Era Kejayaan &amp; Kemitraan
                  </span>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">Kolaborasi Eksternal &amp; Eksistensi Budaya</h4>
                </div>

                {/* Narrative text block */}
                <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-[#3c302a] max-w-4xl bg-gradient-to-br from-[#fffdfc] via-white to-[#fffbf9] border border-emerald-500/20 p-7 md:p-8 rounded-[2rem] shadow-[0_15px_40px_-20px_rgba(16,185,129,0.06)] relative overflow-hidden">
                  <div className="h-[3px] w-24 bg-gradient-to-r from-[#000000] via-[#8b0000] to-[#ffb700] rounded-full mb-5 opacity-80" />
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-emerald-700 first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:font-serif">
                    Seiring berjalannya waktu, IKM ITERA mulai memperluas sayap eksternalnya dengan menjalin kemitraan erat bersama organisasi dan tokoh-tokoh Minang di Provinsi Lampung, seperti <strong className="text-emerald-700 font-bold">KBSB (Keluarga Besar Sumatera Barat)</strong>, <strong className="text-emerald-700 font-bold">Gebu Minang (Gerakan Ekonomi Budaya Minang)</strong> diperkenalkan oleh Opa Nursal dan Bundo Susi, <strong className="text-emerald-700 font-bold">PKDP (Persatuan Keluarga Daerah Piaman)</strong> melalui Pak Herman Nusain, serta <strong className="text-emerald-700 font-bold">IKTD (Ikatan Keluarga Tanah Datar)</strong>.
                  </p>
                  <p>
                    Berkat bimbingan alumni seperti <strong className="text-emerald-700 font-bold">Da Hendra</strong> serta dukungan penuh sesepuh Minang Lampung seperti <strong className="text-emerald-700 font-bold">Bundo Alfi</strong> dan <strong className="text-emerald-700 font-bold">Pak Jekfi</strong>, IKM ITERA berhasil melaksanakan berbagai program kemitraan sosial bernilai tinggi, salah satunya kolaborasi penyuluhan pertanian bersama BPTP Lampung.
                  </p>
                  <p>
                    Puncak kejayaan IKM ITERA juga ditandai dengan penyempurnaan lambang organisasi melalui tiga kali evolusi logo hingga menjadi bentuk bulat marawa saat ini. Selain itu, eksistensi organisasi semakin meluas ke kancah nasional lewat partisipasi kompetisi debat di <strong className="text-emerald-700 font-bold">Universitas Padjadjaran (Unpad)</strong> serta pertunjukan seni musik dan tari tradisional berkolaborasi bersama komunitas seni legendaris <strong className="text-emerald-700 font-bold">Darak Badarak</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Makna Logo Section */}
        <motion.div
          variants={itemVariants}
          className="rounded-[2.5rem] bg-white border border-[#8b0000]/10 p-8 md:p-12 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.1)] space-y-10"
        >
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-[#8b0000]">Makna Filosofis Lambang</h2>
            <p className="text-sm text-slate-500">Menguak nilai adat dan keteguhan luhur di balik identitas visual IKM ITERA.</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-center">
            {/* Left: Floating Logo */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="flex justify-center"
            >
              <div className="relative p-3 rounded-full bg-gradient-to-br from-[#fff7f5] via-[#fffce6] to-[#e8f3ff] shadow-xl border border-slate-100">
                <img
                  src={logoIkm}
                  alt="Logo Resmi IKM ITERA"
                  className="h-56 w-56 md:h-64 md:w-64 object-contain rounded-full shadow-inner"
                />
              </div>
            </motion.div>

            {/* Right: Grid cards of Makna Logo */}
            <div className="grid gap-4 sm:grid-cols-1">
              {[
                {
                  title: 'Rumah Gadang',
                  desc: 'Melambangkan bahwasanya kita berasal dari daerah Minangkabau.',
                  bg: 'bg-[#fff2ef]/70 border-[#8b0000]/10 hover:bg-[#fff2ef]',
                  accent: 'text-[#8b0000]'
                },
                {
                  title: 'Warna Hitam (Tahan Tapo/Api)',
                  desc: 'Melambangkan kesabaran dan ketabahan yang mempunyai akal dan budi.',
                  bg: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
                  accent: 'text-slate-800'
                },
                {
                  title: 'Warna Merah',
                  desc: 'Melambangkan keberanian (Barani Bakato Bana, Takuik Karano Salah) dan raso pareso (tenggang rasa) yang tinggi.',
                  bg: 'bg-red-50/50 border-red-200/50 hover:bg-red-50',
                  accent: 'text-red-700'
                },
                {
                  title: 'Warna Kuning',
                  desc: 'Melambangkan keagungan serta mempunyai undang-undang dan hukum (Mahukum Adia Bakato Bana).',
                  bg: 'bg-[#fffce6]/70 border-[#ffb700]/20 hover:bg-[#fffce6]',
                  accent: 'text-[#b88200]'
                },
                {
                  title: 'Bendera Marawa Berdiri Kokoh Menjulang Tinggi',
                  desc: 'Melambangkan berwibawa dan kharismatik di tengah-tengah kaum dan masyarakat luas.',
                  bg: 'bg-gradient-to-r from-slate-50 via-red-50/30 to-[#fffce6]/30 border-slate-200 hover:shadow-sm',
                  accent: 'text-slate-700'
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6 }}
                  className={`rounded-2xl border p-5 flex flex-col md:flex-row gap-3 items-start transition-all duration-300 ${item.bg}`}
                >
                  <div className={`text-base font-bold uppercase tracking-wider md:w-1/3 shrink-0 ${item.accent}`}>
                    {item.title}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-600 md:w-2/3 border-l-0 md:border-l border-slate-200 pl-0 md:pl-4">
                    {item.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
