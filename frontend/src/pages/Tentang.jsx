export default function Tentang() {
  return (
    <section className="bg-[#fff7f2] py-16 px-6 text-[#1e1414]">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="rounded-[2rem] border border-[#8b0000]/15 bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.25)]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/90">Tentang IKM ITERA</p>
              <h2 className="mt-4 text-4xl font-bold text-[#8b0000]">Sejarah dan Tujuan Organisasi</h2>
              <p className="mt-6 text-base leading-8 text-slate-700">
                IKM ITERA hadir sebagai ruang kebersamaan mahasiswa Minangkabau di lingkungan ITERA. Organisasi ini dibentuk untuk menjaga budaya, memperkuat jaringan, dan menjadi sumber dukungan bagi anggota dalam akademik dan sosial.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#fde8e5] p-8">
              <p className="text-sm uppercase tracking-[0.32em] text-[#8b0000]/80">Visi</p>
              <p className="mt-4 text-lg font-semibold text-[#8b0000]">Melestarikan tradisi Minangkabau dan membentuk generasi muda yang berkualitas di ITERA.</p>
              <p className="mt-6 text-sm leading-7 text-slate-700">
                Menjadi organisasi terdepan dalam menjaga nilai budaya sekaligus memperkuat kemampuan akademik dan sosial anggota.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#8b0000]/15 bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.25)]">
            <h3 className="text-3xl font-semibold text-[#8b0000]">Sejarah &amp; Latar Belakang</h3>
            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-700">
              <p>
                IKM ITERA didirikan oleh mahasiswa Minangkabau yang ingin menghadirkan suasana kekeluargaan dan pelestarian budaya di kampus. Perjalanan ini terus berkembang dengan dukungan bersama dan berbagai kegiatan kreatif.
              </p>
              <p>
                Seiring waktu, IKM ITERA menempatkan kerja sama antar anggota sebagai fondasi utama, dengan tujuan menghasilkan kegiatan yang bermakna dan berdampak positif bagi komunitas kampus.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#8b0000]/15 bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.25)]">
            <h3 className="text-3xl font-semibold text-[#8b0000]">Makna Logo</h3>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#fff2ef] p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-[#8b0000]/80">Atap Bagonjong</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Simbol rumah gadang yang melambangkan akar budaya, kebersamaan, dan identitas Minangkabau.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#fffce6] p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-[#8b0000]/80">Warna Marawa</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Hitam, merah, dan kuning sebagai lambang keberanian, kekuatan, dan kehormatan budaya Minang.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#e8f3ff] p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-[#8b0000]/80">Roda Gigi</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Representasi gerak maju organisasi dan fokus pada pengembangan kualitas anggota secara berkelanjutan.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#edf6f1] p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-[#8b0000]/80">Bentang Lima</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Bentuk yang merefleksikan fondasi kebudayaan, kemajuan, dan persatuan dalam keberagaman mahasiswa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
