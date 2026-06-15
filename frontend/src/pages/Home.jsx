import { announcementTexts, features } from '../data/mockData'

export default function Home() {
  return (
    <section className="bg-[#f9f3f0] text-[#1b1212]">
      <div className="bg-minang text-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold">Selamat datang di IKM ITERA</h2>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
            Memperkuat ikatan keluarga Minangkabau melalui kebudayaan, kepemimpinan, dan aspirasi mahasiswa.
          </p>
        </div>
      </div>

      <div className="bg-black text-white py-4">
        <div className="mx-auto max-w-7xl overflow-hidden px-6">
          <div className="ticker-wrap">
            <div className="ticker-content inline-flex gap-12">
              {announcementTexts.map((text, index) => (
                <span key={index} className="whitespace-nowrap text-sm md:text-base">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ title, description }) => (
            <article key={title} className="rounded-3xl border border-black/10 bg-white p-8 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="mb-4 h-14 w-14 rounded-full bg-marawa-gradient" />
              <h3 className="text-2xl font-semibold text-[#8b0000]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
