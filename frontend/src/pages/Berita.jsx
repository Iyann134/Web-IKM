import { useEffect, useState } from 'react'
import { fetchBerita } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'
import NewsCard from '../components/NewsCard'
import { dummyBerita } from '../data/dummyBerita'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// =========================================================================
// BERITA TERKINI PAGE
// =========================================================================

export default function Berita() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBerita()
      .then((data) => {
        // If backend returns data, use it. Otherwise, fallback to dummy data.
        if (data && data.length > 0) {
          setNews(data)
        } else {
          setNews(dummyBerita)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Backend offline or error fetching news, falling back to local dummy data:', err.message)
        // Fallback to local dummy data during local development
        setNews(dummyBerita)
        setLoading(false)
      })
  }, [])

  // Filter logic for searching
  const filteredNews = news.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <section className="bg-orange-50 py-16 px-6 text-[#1f1414] min-h-screen flex flex-col justify-start">
      <div className="mx-auto max-w-7xl w-full flex flex-col items-center">
        
        {/* Page Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Berita Terkini
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
            Ikuti perkembangan terbaru, agenda kegiatan kemahasiswaan, dan pelestarian adat budaya IKM ITERA.
          </p>
        </div>

        {/* Search Control Bar (Exactly 15px margin top) */}
        <div className="flex justify-center max-w-xl mx-auto w-full mt-[15px]">
          <div className="relative w-full shadow-sm rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              placeholder="Cari berita terkini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 text-base border-none focus:outline-none focus:ring-2 focus:ring-[#8b0000]/10 transition"
            />
          </div>
        </div>

        {/* News Grid / Empty State Rendering */}
        {loading ? (
          <div className="w-full mt-8 flex justify-center">
            <LoadingLogo message="Memuat berita terkini..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-8 w-full">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-20 text-xl font-medium">
                Belum ada berita terkini.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
