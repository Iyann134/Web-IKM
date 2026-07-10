import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBerita } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCalendarAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Berita() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBerita()
      .then((data) => {
        setNews(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredNews = news.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414] min-h-[80vh]">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header Hero Card */}
        <div className="rounded-[2rem] border border-[#8b0000]/10 bg-gradient-to-r from-[#fff5ec] via-[#fff0d1] to-[#fff5ec] p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b0000]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b0000] font-bold">Informasi Publik</p>
            <h2 className="text-[28px] font-extrabold text-[#8b0000] leading-tight">Berita Terkini IKM ITERA</h2>
            <p className="text-[16px] leading-relaxed text-slate-700">
              Ikuti kabar terbaru, pengumuman resmi, kegiatan kebudayaan, serta laporan aktivitas rutin dari Ikatan Keluarga Minangkabau Institut Teknologi Sumatera.
            </p>
          </div>
        </div>

        {/* Search Control */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-5 rounded-3xl border border-[#8b0000]/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)]">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              placeholder="Cari berita terkini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] pl-11 pr-5 py-3 text-[16px] focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
            />
          </div>
        </div>

        {loading ? (
          <LoadingLogo message="Memuat berita terkini..." />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            Terjadi kesalahan: {error}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredNews.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((item) => (
                  <article key={item.id} className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-[#8b0000]/20 transition-all duration-300">
                     <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                       <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-4 right-4 rounded-xl bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8b0000] border border-[#8b0000]/10 shadow-sm">
                         Berita
                       </div>
                     </div>
                     <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                       <div className="space-y-2">
                         <div className="flex items-center gap-2 text-[16px] font-semibold uppercase tracking-wider text-slate-400">
                           <FontAwesomeIcon icon={faCalendarAlt} className="text-[#8b0000]/70" />
                           <time>{item.date}</time>
                         </div>
                         <h4 className="text-[24px] font-bold text-[#48241f] line-clamp-2 leading-snug group-hover:text-[#8b0000] transition-colors">{item.title}</h4>
                         <p className="text-[16px] leading-relaxed text-slate-500 line-clamp-3">{item.content}</p>
                       </div>
                       <Link
                         to={`/informasi/berita/${item.id}`}
                         className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8b0000] px-5 py-3 text-[18px] font-bold text-white transition hover:bg-[#b11919] w-full shadow-sm"
                       >
                         Baca Selengkapnya
                         <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                       </Link>
                     </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-slate-200/60 p-16 text-center text-slate-500 shadow-sm">
                Tidak ada berita yang cocok dengan kata kunci pencarian Anda.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
