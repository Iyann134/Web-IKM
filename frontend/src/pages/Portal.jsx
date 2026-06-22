import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBerita, fetchPrestasi } from '../services/api'

function PortalSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 animate-pulse">
      {/* Column Left: Prestasi Skeleton */}
      <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
        <div className="h-8 w-40 bg-slate-200 rounded-md mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[1.75rem] border border-slate-100 bg-[#fffbf9] p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="h-6 w-3/5 bg-slate-200 rounded-md"></div>
                <div className="h-6 w-14 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column Right: Berita Skeleton */}
      <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
        <div className="h-8 w-48 bg-slate-200 rounded-md mb-8"></div>
        <div className="grid gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-[#fffbf9] shadow-sm">
              <div className="h-40 w-full bg-slate-200"></div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-6 w-1/2 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
                </div>
                <div className="h-9 w-28 bg-slate-200 rounded-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Portal() {
  const [achievements, setAchievements] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('Semua')

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

  // Extract unique years for filtering
  const uniqueYears = Array.from(
    new Set(achievements.map((item) => item.year))
  ).sort((a, b) => b - a)

  // Filter Prestasi
  const filteredAchievements = achievements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = selectedYear === 'Semua' || item.year.toString() === selectedYear
    return matchesSearch && matchesYear
  })

  // Filter Berita
  const filteredNews = news.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-14">
        {/* Header Hero Card */}
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

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-[1.75rem] border border-[#8b0000]/10 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.1)]">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Cari berita atau prestasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] px-5 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Tahun Prestasi:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full md:w-40 rounded-2xl border border-slate-200 bg-[#fffbf9] px-4 py-3 text-sm focus:border-[#8b0000] focus:outline-none transition font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Tahun</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <PortalSkeleton />
        ) : error ? (
          <div className="rounded-[2rem] border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.10)]">
            Terjadi kesalahan: {error}
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left Column: Prestasi */}
            <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
              <h3 className="text-3xl font-semibold text-[#8b0000]">Prestasi</h3>
              <div className="mt-8 space-y-6">
                {filteredAchievements.length > 0 ? (
                  filteredAchievements.map((item) => (
                    <article key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-[#fff7f2] p-6 shadow-sm hover:border-[#8b0000]/20 transition duration-300">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xl font-semibold text-[#48241f]">{item.title}</h4>
                        <span className="rounded-full bg-[#8b0000] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white font-medium">{item.year}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-8">Tidak ada prestasi yang cocok.</p>
                )}
              </div>
            </div>

            {/* Right Column: Berita Terkini */}
            <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
              <h3 className="text-3xl font-semibold text-[#8b0000]">Berita Terkini</h3>
              <div className="mt-8 grid gap-6 md:grid-cols-1">
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => (
                    <article key={item.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#fdf4ee] shadow-sm hover:border-[#8b0000]/20 transition-all duration-300">
                      <div className="h-44 w-full bg-slate-200 overflow-hidden">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-xl font-semibold text-[#48241f]">{item.title}</h4>
                          <time className="text-xs uppercase tracking-[0.18em] text-slate-500 whitespace-nowrap">{item.date}</time>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-700 line-clamp-3">{item.content}</p>
                        <Link
                          to={`/portal/${item.id}`}
                          className="mt-6 inline-flex rounded-full bg-[#8b0000] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b11919]"
                        >
                          Read More
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-8">Tidak ada berita yang cocok.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
