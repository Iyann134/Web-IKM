import { motion } from 'framer-motion'
import logoIKM from '../assets/logo-ikm.png'
import assetVisiMis from '../assets/asset-visimis.png'

// =========================================================================
// MAKNA FILOSOFIS LOGO COMPONENT
// =========================================================================

export default function MaknaLogo() {
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

  const cardsData = [
    {
      title: 'Rumah Gadang',
      desc: 'Melambangkan bahwasanya kita berasal dari daerah Minangkabau.',
      textColor: 'text-[#FFD700]'
    },
    {
      title: 'Warna Hitam',
      desc: 'Tahan Tapo/Api melambangkan kesabaran dan ketabahan yang mempunyai akal dan budi.',
      textColor: 'text-[#000000]'
    },
    {
      title: 'Warna Merah',
      desc: 'Melambangkan keberanian (Barani Bakato Bana, Takuik Karano Salah) dan raso pareso tinggi.',
      textColor: 'text-[#FF0000]'
    },
    {
      title: 'Warna Kuning',
      desc: 'Melambangkan keagungan serta mempunyai undang-undang dan hukum (Mahukum Adia Bakato Bana).',
      textColor: 'text-[#FFD700]'
    }
  ]

  return (
    <section className="bg-orange-50 relative overflow-hidden px-4 py-12 min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
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
        className="mx-auto max-w-6xl w-full flex flex-col items-center gap-10 relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Makna Logo
          </h1>
          <div className="flex justify-center mt-2">
            <img
              className="w-50 h-50 sm:w-60 sm:h-60 object-contain"
              src={logoIKM}
              alt="Logo IKM ITERA"
            />
          </div>
        </motion.div>

        {/* 4 Cards Grid Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        >
          {cardsData.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 lg:p-8 z-10 relative flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-lg duration-300"
            >
              <h3 className={`text-xl sm:text-2xl font-bold ${card.textColor} tracking-wide`}>
                {card.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Bottom Wide Card */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-white rounded-xl shadow-md p-6 lg:p-8 z-10 relative transition-transform hover:-translate-y-1 hover:shadow-lg duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <h3 className="md:col-span-1 text-2xl font-bold text-slate-800 tracking-wide text-left md:border-r border-slate-100 md:pr-6">
              Bendera Marawa Berdiri Kokoh Menjulang Tinggi
            </h3>
            <p className="md:col-span-2 text-slate-600 text-base sm:text-lg leading-relaxed text-left">
              Melambangkan berwibawa dan kharismatik ditengah-tengah kaum dan masyarakat luas.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
