import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faGraduationCap, faHandsHelping } from '@fortawesome/free-solid-svg-icons'
import { announcementTexts, features } from '../data/mockData'

const MinangPatternBg = () => (
  <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="minang-motif" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* Tiled Pucuak Rebung (Bamboo Shoot) Minang Motif */}
          <path d="M 30,0 L 60,60 L 0,60 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 30,20 L 50,60 L 10,60 Z" fill="currentColor" />
          <circle cx="30" cy="10" r="3" fill="currentColor" />
          <path d="M 0,30 H 60" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#minang-motif)" />
    </svg>
  </div>
)

export default function Home() {
  return (
    <section className="bg-[#fff8f5] text-[#1b1414]">
      <div className="bg-minang text-white relative overflow-hidden">
        <MinangPatternBg />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10 relative z-10">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.35em] text-white/90 shadow-sm shadow-black/10">
            IKM ITERA • Budaya Minangkabau • Kebersamaan Kampus
          </p>
          <h1 className="mt-8 text-4xl font-extrabold leading-tight md:text-6xl">
            Menyatukan Tradisi dan Aspirasi Generasi Minang di ITERA
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            Selamat datang di rumah bagi mahasiswa Minangkabau yang ingin berkarya, berbagi, dan berkembang bersama.
          </p>
        </div>
      </div>

      <div className="bg-[#12040a] text-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-5 md:px-10">
          <div className="ticker-wrap rounded-full border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-sm">
            <div className="ticker-content inline-flex gap-12">
              {announcementTexts.map((text, index) => (
                <span key={index} className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] text-white/90 md:text-base">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const icon = index === 0 ? faUsers : index === 1 ? faGraduationCap : faHandsHelping
            return (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_28px_60px_-30px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#8b0000]/25 hover:shadow-[0_32px_80px_-40px_rgba(0,0,0,0.30)]"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-marawa-gradient text-white shadow-lg shadow-red-200/40 transition-transform duration-300 group-hover:scale-105">
                  <FontAwesomeIcon icon={icon} className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <h2 className="text-2xl font-semibold text-[#8b0000]">{feature.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
