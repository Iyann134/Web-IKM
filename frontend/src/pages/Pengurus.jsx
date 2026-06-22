import { useEffect, useState } from 'react'
import { fetchPengurus } from '../services/api'

function PengurusSkeleton() {
  return (
    <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.20)] animate-pulse space-y-12">
      {/* Pembina Skeleton */}
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-100 bg-[#fffbf9] p-8 text-center space-y-4">
        <div className="h-4 w-32 bg-slate-200 rounded-md mx-auto"></div>
        <div className="h-8 w-64 bg-slate-200 rounded-md mx-auto"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded-md mx-auto"></div>
      </div>

      <div className="space-y-10">
        {/* BPH Skeleton */}
        <div>
          <div className="h-5 w-48 bg-slate-200 rounded-md mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-[1.75rem] border border-slate-100 bg-[#fffbf9] p-6 space-y-3">
                <div className="h-6 w-1/2 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Departemen Skeleton */}
        <div>
          <div className="h-5 w-32 bg-slate-200 rounded-md mb-6"></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[1.75rem] border border-slate-100 bg-[#fffbf9] p-6 space-y-3">
                <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-full bg-slate-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Pengurus() {
  const [pengurus, setPengurus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPengurus()
      .then((data) => {
        setPengurus(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const dosenPembina = pengurus.find((member) => member.role === 'Dosen Pembina')
  const bphMembers = pengurus.filter((member) => member.role !== 'Dosen Pembina' && member.role !== 'Departemen')
  const departments = pengurus.filter((member) => member.role === 'Departemen')

  return (
    <section className="bg-[#fff7f2] py-16 px-6 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/90">Struktur Organisasi</p>
          <h2 className="mt-4 text-4xl font-bold text-[#8b0000]">Pengurus IKM ITERA</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            Menampilkan hirarki kepengurusan yang rapi dan transparan — dari pembina hingga departemen kerja.
          </p>
        </div>

        {loading ? (
          <PengurusSkeleton />
        ) : error ? (
          <div className="rounded-[2rem] border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.10)]">
            Terjadi kesalahan: {error}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.20)]">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#8b0000]/15 bg-[#fff2ef] p-8 text-center shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/90">Dosen Pembina</p>
              <h3 className="mt-4 text-3xl font-semibold text-[#8b0000]">{dosenPembina?.name || 'Belum tersedia'}</h3>
              <p className="mt-2 text-sm text-slate-700">{dosenPembina?.description || 'Deskripsi belum tersedia.'}</p>
            </div>

            <div className="mt-12 space-y-10">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/80">Badan Pengurus Harian</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {bphMembers.map((member) => (
                    <div key={member.id} className="rounded-[1.75rem] border border-slate-200 bg-[#fff4ef] p-6 shadow-sm">
                      <p className="text-lg font-semibold text-[#8b0000]">{member.name}</p>
                      <p className="mt-2 text-sm text-slate-700">{member.role}</p>
                      <p className="mt-3 text-sm text-slate-600">{member.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {departments.length > 0 && (
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/80">Departemen</p>
                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {departments.map((dept) => (
                      <div key={dept.id} className="rounded-[1.75rem] border border-slate-200 bg-[#fff4ef] p-6 shadow-sm">
                        <p className="text-base font-semibold text-[#8b0000]">{dept.name}</p>
                        <p className="mt-2 text-sm text-slate-700">{dept.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
