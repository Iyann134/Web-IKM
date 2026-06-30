import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { fetchBeritaById } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'

function DetailBeritaSkeleton() {
  return (
    <div className="mx-auto max-w-4xl bg-white rounded-[2rem] border border-[#8b0000]/10 p-6 md:p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)] animate-pulse space-y-6">
      <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
      <div className="h-10 w-3/4 bg-slate-200 rounded-md"></div>
      <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
      <div className="h-64 md:h-[400px] w-full bg-slate-200 rounded-[1.75rem]"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 rounded-md"></div>
        <div className="h-4 w-full bg-slate-200 rounded-md"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
      </div>
    </div>
  )
}

export default function DetailBerita() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBeritaById(id)
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414]">
        <LoadingLogo message="Memuat detail berita..." />
      </section>
    )
  }

  if (error || !article) {
    return (
      <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414]">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-md">
          <p className="text-lg font-semibold">Gagal Memuat Berita</p>
          <p className="mt-2 text-sm text-red-600">{error || 'Berita tidak ditemukan.'}</p>
          <button
            onClick={() => navigate('/informasi/berita')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8b0000] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b11919]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Kembali ke Berita
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#fff9f4] py-16 px-6 text-[#1f1414]">
      <article className="mx-auto max-w-4xl bg-white rounded-[2rem] border border-[#8b0000]/10 p-6 md:p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.18)]">
        <button
          onClick={() => navigate('/informasi/berita')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#8b0000] font-medium transition text-sm mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Kembali ke Berita
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-[#8b0000] leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-2 mt-4 text-xs uppercase tracking-wider text-slate-500">
          <FontAwesomeIcon icon={faCalendar} />
          <time>{article.date}</time>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-inner h-64 md:h-[450px]">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-8 text-base md:text-lg leading-8 text-slate-700 space-y-6">
          <p className="whitespace-pre-line">{article.content}</p>
          <p className="text-slate-500 text-sm italic">
            *Ini adalah konten lengkap berita kegiatan Ikatan Keluarga Minangkabau ITERA. Konten dapat diperbarui secara dinamis oleh pengurus.
          </p>
        </div>
      </article>
    </section>
  )
}
