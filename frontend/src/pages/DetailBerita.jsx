import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { fetchBeritaById } from '../services/api'
import { dummyBerita } from '../data/dummyBerita'
import LoadingLogo from '../components/LoadingLogo'

// =========================================================================
// DETAIL BERITA PAGE
// =========================================================================

export default function DetailBerita() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBeritaById(id)
      .then((data) => {
        if (data) {
          setArticle(data)
        } else {
          // Search in dummy data
          const dummyMatch = dummyBerita.find((item) => String(item.id) === String(id))
          if (dummyMatch) {
            setArticle(dummyMatch)
          } else {
            setError('Berita tidak ditemukan.')
          }
        }
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Backend detail API offline or error, falling back to dummy data:', err.message)
        const dummyMatch = dummyBerita.find((item) => String(item.id) === String(id))
        if (dummyMatch) {
          setArticle(dummyMatch)
        } else {
          setError('Berita tidak ditemukan.')
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <section className="bg-orange-50 py-12 px-4 min-h-screen flex items-center justify-center">
        <LoadingLogo message="Memuat detail berita..." />
      </section>
    )
  }

  // Fallback Handling for Detail Page (Not found error)
  if (error || !article) {
    return (
      <section className="bg-orange-50 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-md p-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Berita tidak ditemukan
          </h2>
          <p className="text-slate-500">
            Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <button
            onClick={() => navigate('/informasi/berita')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8b0000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b11919]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Kembali ke Berita
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-orange-50 min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-md p-8 relative z-10 space-y-6">
        
        {/* Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#8b0000] font-medium transition text-sm cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Kembali
        </button>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>

        {/* Article Date */}
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <FontAwesomeIcon icon={faCalendar} />
          <time>{article.date}</time>
        </div>

        {/* Featured Image */}
        <div className="w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>

        {/* Article Content Paragraphs */}
        <div className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify space-y-4 pt-4">
          {article.content && article.content.split('\n').map((paragraph, idx) => {
            const cleanText = paragraph.trim()
            if (!cleanText) return null
            return <p key={idx}>{cleanText}</p>
          })}
        </div>

      </div>
    </section>
  )
}
