import { motion } from 'framer-motion'
import assetVisiMis from '../assets/asset-visimis.png'

// =========================================================================
// VISI & MISI COMPONENT
// =========================================================================

export default function VisiMisi() {
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
    <section className="bg-orange-50 py-12 px-4 md:px-8 text-[#1f1414] overflow-hidden min-h-[calc(100vh-6rem)] flex items-center justify-center relative">
      {/* Background Decorative Patterns */}
      <img
        className="absolute top-10 left-10 w-28 md:w-44 h-auto pointer-events-none select-none z-0"
        src={assetVisiMis}
        alt="Batik Kiri"
      />
      <img
        className="absolute bottom-10 right-10 w-28 md:w-44 h-auto pointer-events-none select-none z-0 rotate-180"
        src={assetVisiMis}
        alt="Batik Kanan"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl w-full relative z-10 flex flex-col items-center gap-7"
      >
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-slate-900"
        >
          Visi &amp; Misi
        </motion.h1>

        {/* Visi Card */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 p-8 md:p-10 flex flex-col items-center justify-center gap-4 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide">
            Visi
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl">
            Menjadikan UKM Ikatan Keluarga Minangkabau sebagai tempat paguyuban, pengembangan budaya, dan sebagai sarana penampung kreativitas, inspirasi, dan aspirasi mahasiswa Minangkabau.
          </p>
        </motion.div>

        {/* Misi Card */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 p-8 md:p-10 flex flex-col items-center justify-center gap-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide text-center">
            Misi
          </h2>
          <ul className="list-disc pl-6 sm:pl-8 space-y-3 text-slate-700 text-base leading-relaxed text-left w-full max-w-2xl">
            <li>Mengaktifkan dan memajukan kebudayaan yang ada di dalam UKM Ikatan Keluarga Minangkabau.</li>
            <li>Menjalin hubungan yang harmonis dengan semua anggota atau keluarga yang ada di dalam UKM Ikatan Keluarga Minangkabau.</li>
            <li>Melaksanakan program-program yang telah ada dan meningkatkan program yang telah tersusun sesuai rencana.</li>
            <li>Meningkatkan kemajuan UKM Ikatan Keluarga Minangkabau menjadi yang lebih baik.</li>
            <li>Mengadakan kegiatan-kegiatan di bidang kebudayaan, pendidikan, dan keagamaan.</li>
          </ul>
        </motion.div>

      </motion.div>
    </section>
  )
}
