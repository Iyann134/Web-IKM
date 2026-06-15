import { achievements, news } from '../data/mockData'

export default function Portal() {
  return (
    <section className="bg-[#f8f0ed] py-16 px-6 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-12">
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">Kegiatan &amp; Prestasi</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">Lihat pencapaian terbaru dan berita terkini dari IKM ITERA yang menunjukkan semangat kegiatan budaya dan organisasi.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#8b0000]/15 bg-white p-8 shadow-lg shadow-black/5">
            <h3 className="text-2xl font-semibold text-[#8b0000]">Prestasi</h3>
            <div className="mt-6 space-y-6">
              {achievements.map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-xl font-semibold">{item.title}</h4>
                    <span className="rounded-full bg-[#8b0000] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">{item.year}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#8b0000]/15 bg-white p-8 shadow-lg shadow-black/5">
            <h3 className="text-2xl font-semibold text-[#8b0000]">Berita Terkini</h3>
            <div className="mt-6 space-y-6">
              {news.map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <time className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.date}</time>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
