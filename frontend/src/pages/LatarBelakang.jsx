import { motion } from 'framer-motion'
import logoIkm from '../assets/logo-ikm.png'
import assetLb1 from '../assets/asset-lb1.png'
import assetLb2 from '../assets/asset-lb2.png'

// =========================================================================
// LATAR BELAKANG COMPONENT
// =========================================================================

export default function LatarBelakang() {
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
    <section className="bg-[#fff9f5] py-12 px-4 md:px-8 text-[#1f1414] overflow-hidden min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl w-full"
      >
        <motion.div
          variants={itemVariants}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] p-8 md:p-14 text-white shadow-[0_30px_70px_-30px_rgba(211,47,47,0.4)] overflow-hidden flex flex-col justify-center min-h-[500px]"
        >
          {/* Top-Left Decorative Pattern Overlay */}
          <img
            className="absolute top-0 left-0 w-28 md:w-44 h-auto opacity-50 pointer-events-none select-none z-0"
            src={assetLb1}
            alt="Ornamen Batik Kiri"
          />

          {/* Bottom-Right Decorative Pattern Overlay (Rotated 180 degrees) */}
          <img
            className="absolute bottom-0 right-0 w-28 md:w-44 h-auto opacity-50 pointer-events-none select-none z-0"
            src={assetLb2}
            alt="Ornamen Batik Kanan"
          />

          {/* Content Section Title */}
          <div className="relative z-10 text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mt-3">
              Latar Belakang
            </h1>
          </div>

          {/* Content Flex Row Layout (responsive: stacks on small viewports) */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">

            {/* Left Logo Side (No border / circular frame, just the raw logo image directly) */}
            <div className="shrink-0 flex items-center justify-center">
              <img
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[360px] object-contain"
                src={logoIkm}
                alt="Logo IKM"
              />
            </div>

            {/* Right Description Text Side */}
            <div className="flex-grow text-center lg:text-left space-y-4 max-w-2xl">
              <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium text-justify">
                Institut Teknologi Sumatera (ITERA) merupakan kampus yang menampung keberagaman dari berbagai penjuru daerah,
                termasuk mahasiswa yang berasal dari ranah Minangkabau. Menyadari pentingnya menjaga identitas dan nilai-nilai
                luhur di tanah rantau, Ikatan Keluarga Minangkabau (IKM) ITERA resmi dibentuk.
              </p>
              <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium text-justify">
                Kehadiran organisasi ini diinisiasi sebagai wadah bagi mahasiswa berdarah Minang untuk senantiasa menjaga tali
                silaturahmi dan memperkuat asas kekeluargaan. Lebih dari sekadar ruang berkumpul, IKM ITERA memiliki komitmen
                kuat dalam melestarikan seni dan budaya Minangkabau di lingkungan kampus. Melalui perkumpulan ini, kami juga
                mendedikasikan diri sebagai ruang bagi setiap anggota untuk terus bertumbuh dan mengembangkan potensi diri
                melalui berbagai agenda kegiatan kemahasiswaan yang inovatif.
              </p>
            </div>

          </div>

        </motion.div>
      </motion.div>
    </section>
  )
}
