// =========================================================================
// STATIC PRESTASI CARD COMPONENT (Supports both dummy & production API keys)
// =========================================================================

export default function PrestasiCard({ prestasi }) {
  if (!prestasi) return null

  const title = prestasi.achievementName || prestasi.title || ''
  const subTitle = prestasi.eventName || prestasi.description || ''

  return (
    <article className="bg-white rounded-xl shadow-md border border-slate-100/50 overflow-hidden">
      {/* Top Image Section (cover, rounded top corners) */}
      <img
        src={prestasi.image}
        alt={title}
        className="w-full h-48 object-cover rounded-t-xl"
      />

      {/* Content Section below the image */}
      <div className="p-5 flex flex-col gap-2">
        {/* Date Label */}
        <span className="text-sm text-gray-500 font-['Poppins']">
          {prestasi.date}
        </span>
        {/* Achievement Name (limited to 2 lines max) */}
        <h4 className="text-lg font-bold text-black font-['Poppins'] line-clamp-2">
          {title}
        </h4>
        {/* Event Name (limited to 2 lines max) */}
        <p className="text-base text-black font-['Poppins'] line-clamp-2">
          {subTitle}
        </p>
      </div>
    </article>
  )
}
