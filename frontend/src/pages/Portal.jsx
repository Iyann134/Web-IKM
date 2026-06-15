import { useEffect, useState } from 'react'
import { fetchBerita, fetchPrestasi } from '../services/api'

export default function Portal() {
  const [achievements, setAchievements] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchPrestasi(), fetchBerita()])
      .then(([prestasiData, beritaData]) => {
        setAchievements(prestasiData)
        setNews(beritaData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-14">
        <div className="rounded-[2rem] border border-[#8b0000]/10 bg-gradient-to-r from-[#fff5ec] via-[#fff0d1] to-[#fff5ec] p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/90">Prestasi UKM</p>
              <h2 className="mt-4 text-4xl font-bold text-[#8b0000]">Jejak Prestasi dan Berita Terbaru IKM ITERA</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
                Lihat bagaimana anggota kami meraih prestasi di bidang budaya, akademik, dan sosial. Temukan juga berita kegiatan terbaru yang terus bergerak maju.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#8b0000]/10 bg-white p-6 shadow-lg shadow-[#8b0000]/5">
              <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/80">Sorotan Hari Ini</p>
              <p className="mt-4 text-lg font-semibold text-[#8b0000]">Festival budaya dan bakti sosial semakin mendekat — jangan lewatkan partisipasimu.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-10 text-center text-[#8b0000] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.25)]">
            Memuat data portal...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.10)]">
            Terjadi kesalahan: {error}
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
              <h3 className="text-3xl font-semibold text-[#8b0000]">Prestasi</h3>
              <div className="mt-8 space-y-6">
                {achievements.map((item) => (
                  <article key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-[#fff7f2] p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-xl font-semibold text-[#48241f]">{item.title}</h4>
                      <span className="rounded-full bg-[#8b0000] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">{item.year}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
              <h3 className="text-3xl font-semibold text-[#8b0000]">Berita Terkini</h3>
              <div className="mt-8 grid gap-6 md:grid-cols-1">
                {news.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#fdf4ee] shadow-sm">
                    <div className="h-40 w-full bg-slate-200">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xl font-semibold text-[#48241f]">{item.title}</h4>
                        <time className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.date}</time>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-700">{item.content}</p>
                      <button className="mt-6 inline-flex rounded-full bg-[#8b0000] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b11919]">
                        Read More
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
