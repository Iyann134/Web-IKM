import { useEffect, useState } from 'react'
import { fetchPrestasi } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'
import PrestasiCard from '../components/PrestasiCard'
import { dummyPrestasi } from '../data/dummyPrestasi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// =========================================================================
// JEJAK KARYA & PRESTASI PAGE
// =========================================================================

export default function Prestasi() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPrestasi()
      .then((data) => {
        // Fallback to dummy data if database is empty
        if (data && data.length > 0) {
          setAchievements(data)
        } else {
          setAchievements(dummyPrestasi)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Backend API error or offline, loading from local dummy data:', err.message)
        // Fallback to local dummy data during local development
        setAchievements(dummyPrestasi)
        setLoading(false)
      })
  }, [])

  // Filter logic for searching (supports both dummy and API properties)
  const filteredAchievements = achievements.filter((item) => {
    const titleText = item.achievementName || item.title || ''
    const eventText = item.eventName || item.description || ''
    return (
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eventText.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <section className="bg-orange-50 py-16 px-6 text-[#1f1414] min-h-screen flex flex-col justify-start">
      <div className="mx-auto max-w-7xl w-full flex flex-col items-center">

        {/* Page Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Jejak Karya &amp; Prestasi
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
            Dedikasi dan semangat juang keluarga besar IKM ITERA di berbagai bidang, baik akademik maupun non-akademik.
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
              placeholder="Cari prestasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 text-base border-none focus:outline-none focus:ring-2 focus:ring-[#8b0000]/10 transition"
            />
          </div>
        </div>

        {/* Achievements Grid / Empty State Rendering (mt-12 spacing below search bar) */}
        {loading ? (
          <div className="w-full mt-12 flex justify-center">
            <LoadingLogo message="Memuat prestasi..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 w-full">
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map((item) => (
                <PrestasiCard key={item.id} prestasi={item} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-20 text-xl font-medium">
                Belum ada catatan prestasi saat ini.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
