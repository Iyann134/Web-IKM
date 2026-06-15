import { pengurus } from '../data/mockData'

export default function Pengurus() {
  return (
    <section className="bg-[#fff4f1] py-16 px-6 text-[#1e1515]">
      <div className="mx-auto max-w-6xl space-y-12">
        <div>
          <h2 className="text-3xl font-bold text-[#8b0000]">Struktur Organisasi</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">Menampilkan hierarki pengurus IKM ITERA mulai dari pembina hingga departemen kerja.</p>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-[#8b0000]/15 bg-white p-8 shadow-lg shadow-black/5">
            <h3 className="text-2xl font-semibold text-[#8b0000]">Dosen Pembina</h3>
            <div className="mt-5 rounded-3xl bg-[#fde8e5] p-6">
              <p className="text-lg font-semibold">{pengurus.dosenPembina.name}</p>
              <p className="mt-2 text-sm text-slate-600">{pengurus.dosenPembina.title}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#8b0000]/15 bg-white p-8 shadow-lg shadow-black/5">
            <h3 className="text-2xl font-semibold text-[#8b0000]">BPH</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {pengurus.bph.map((member) => (
                <div key={member.name} className="rounded-3xl border border-slate-200 bg-[#fff2ef] p-5">
                  <p className="font-semibold text-[#8b0000]">{member.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#8b0000]/15 bg-white p-8 shadow-lg shadow-black/5">
            <h3 className="text-2xl font-semibold text-[#8b0000]">Departemen</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {pengurus.departemen.map((dept) => (
                <div key={dept.name} className="rounded-3xl border border-slate-200 bg-[#fff2ef] p-5">
                  <p className="font-semibold text-[#8b0000]">{dept.name}</p>
                  <p className="mt-2 text-sm text-slate-600">Ketua: {dept.lead}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
