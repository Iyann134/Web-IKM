import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons'

// =========================================================================
// REUSABLE NEWS CARD COMPONENT
// =========================================================================

export default function NewsCard({ news }) {
  if (!news) return null

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-[#8b0000]/20 transition-all duration-300">
      {/* Top Image Section */}
      <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
        <img
          src={news.image}
          alt={news.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8b0000] border border-[#8b0000]/10 shadow-sm">
          Berita
        </div>
      </div>

      {/* Content Details Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          {/* Date Label */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#8b0000]/70" />
            <time>{news.date}</time>
          </div>
          {/* Article Title */}
          <h4 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#8b0000] transition-colors">
            {news.title}
          </h4>
          {/* Article Excerpt */}
          <p className="text-sm leading-relaxed text-slate-500 line-clamp-3">
            {news.content}
          </p>
        </div>

        {/* Read More Link Button */}
        <Link
          to={`/berita/${news.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b0000] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b11919] w-full shadow-sm"
        >
          Selengkapnya
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
        </Link>
      </div>
    </article>
  )
}
