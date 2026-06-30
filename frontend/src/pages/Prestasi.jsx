import { useEffect, useState } from 'react'
import { fetchPrestasi } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTrophy, faCalendarAlt, faAward } from '@fortawesome/free-solid-svg-icons'

export default function Prestasi() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('Semua')

  useEffect(() => {
    fetchPrestasi()
      .then((data) => {
        setAchievements(data)
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

  // Filter achievements
  const filteredAchievements = achievements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = selectedYear === 'Semua' || item.year.toString() === selectedYear
    return matchesSearch && matchesYear
  })

  return (
    <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414] min-h-[80vh]">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header Hero Card */}
        <div className="rounded-[2rem] border border-[#8b0000]/10 bg-gradient-to-r from-[#fff5ec] via-[#fff0d1] to-[#fff5ec] p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b0000]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b0000] font-bold">Prestasi Mahasiswa</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#8b0000] leading-tight">Jejak Prestasi IKM ITERA</h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-700">
              Dokumentasi dan apresiasi atas pencapaian gemilang mahasiswa Minangkabau di lingkungan Institut Teknologi Sumatera, baik dalam bidang akademik, olahraga, seni budaya, maupun sosial.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-3xl border border-[#8b0000]/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)]">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              placeholder="Cari prestasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] pl-11 pr-5 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
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
          <LoadingLogo message="Memuat prestasi..." />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            Terjadi kesalahan: {error}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredAchievements.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAchievements.map((item) => (
                  <article key={item.id} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-[#8b0000]/25 transition duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#8b0000]/5 rounded-bl-[4rem] flex items-start justify-end p-4">
                      <FontAwesomeIcon icon={faTrophy} className="text-[#8b0000]/30 text-lg group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#8b0000] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          <FontAwesomeIcon icon={faAward} />
                          {item.year}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-[#48241f] leading-snug group-hover:text-[#8b0000] transition-colors pt-2">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-slate-200/60 p-16 text-center text-slate-500 shadow-sm">
                Tidak ada prestasi yang ditemukan untuk kriteria pencarian Anda.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
