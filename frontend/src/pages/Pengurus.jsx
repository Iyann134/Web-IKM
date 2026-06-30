import { useEffect, useState } from 'react'
import { fetchPengurus } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'

function MemberCard({ member, highlight = false }) {
  if (!member) return (
    <div className="border border-dashed border-slate-300 rounded-[1.5rem] p-5 w-full max-w-[260px] mx-auto text-center flex flex-col items-center justify-center min-h-[140px] bg-slate-50/40">
      <p className="text-xs text-slate-400 italic font-medium">Belum Diisi</p>
    </div>
  )

  const isDatuak = member.role.toLowerCase() === 'datuak'
  const isPembina = member.role.toLowerCase() === 'dosen pembina'

  return (
    <div className={`relative group bg-white border ${
      isDatuak 
        ? 'border-yellow-400 shadow-[0_15px_40px_-15px_rgba(238,194,19,0.15)] ring-2 ring-yellow-400/20' 
        : highlight 
          ? 'border-[#8b0000]/30 shadow-[0_12px_35px_rgba(139,0,0,0.06)]' 
          : 'border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.02)]'
    } hover:border-[#8b0000]/40 rounded-[1.5rem] p-5 hover:shadow-[0_20px_40px_rgba(139,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[260px] mx-auto text-center z-10`}>
      
      {/* Role Badge with Marawa gradient */}
      <div className={`inline-block text-[10px] font-bold uppercase tracking-wider text-white px-4 py-1.5 rounded-full shadow-sm mb-3 ${
        isDatuak 
          ? 'bg-gradient-to-r from-yellow-500 via-[#8b0000] to-slate-900'
          : isPembina
            ? 'bg-slate-700'
            : highlight 
              ? 'bg-gradient-to-r from-[#eec213] via-[#8b0000] to-[#1f1414]' 
              : 'bg-gradient-to-r from-slate-600 to-slate-800'
      }`}>
        {member.role}
      </div>
      
      <h4 className="text-base font-bold text-[#8b0000] tracking-tight line-clamp-2 min-h-[3rem] flex items-center justify-center group-hover:text-[#b30000] transition-colors">
        {member.name}
      </h4>
      
      {/* NIM/NIP Section */}
      <div className="mt-2 text-xs font-semibold text-slate-500">
        {member.nim_nip && member.nim_nip !== '-' ? (
          <span>{isPembina ? 'NIP' : 'NIM'}: {member.nim_nip}</span>
        ) : (
          <span className="opacity-40">-</span>
        )}
      </div>

      {/* Prodi Section */}
      <div className="mt-1 text-xs font-medium text-slate-400">
        {member.prodi || 'Teknik Material'}
      </div>

      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 ${
        isDatuak 
          ? 'bg-yellow-400' 
          : 'bg-[#8b0000]'
      } rounded-t-full transition-all duration-300 group-hover:w-24`}></div>
    </div>
  )
}

function PengurusSkeleton() {
  return (
    <div className="rounded-[2rem] border border-[#8b0000]/10 bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.20)] animate-pulse space-y-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-100 bg-[#fffbf9] p-8 text-center space-y-4">
        <div className="h-4 w-32 bg-slate-200 rounded-md mx-auto"></div>
        <div className="h-8 w-64 bg-slate-200 rounded-md mx-auto"></div>
      </div>
    </div>
  )
}

export default function Pengurus() {
  const [pengurus, setPengurus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('')

  useEffect(() => {
    fetchPengurus()
      .then((data) => {
        setPengurus(data)
        const periods = Array.from(new Set(data.map(m => m.periode || '2025/2026'))).sort((a, b) => b.localeCompare(a))
        if (periods.length > 0) {
          setSelectedPeriod(periods[0])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const uniquePeriods = Array.from(
    new Set(pengurus.map((m) => m.periode || '2025/2026'))
  ).sort((a, b) => b.localeCompare(a))

  const activeMembers = pengurus.filter((member) => (member.periode || '2025/2026') === selectedPeriod)

  // Level 1: Dosen Pembina
  const dosenPembina = activeMembers.find((member) => member.role.toLowerCase() === 'dosen pembina')

  // Level 2: Datuak (Ketua Umum) & Vices (Bundo Kanduang, Cadiak Pandai, Suluah Bendang)
  const datuak = activeMembers.find((member) => member.role.toLowerCase() === 'datuak')
  const bundoKanduang = activeMembers.find((member) => member.role.toLowerCase() === 'bundo kanduang')
  const cadiakPandai = activeMembers.find((member) => member.role.toLowerCase() === 'cadiak pandai')
  const suluahBendang = activeMembers.find((member) => member.role.toLowerCase() === 'suluah bendang')

  // Level 3: Secretariat & Treasury
  const sekum = activeMembers.find((member) => member.role.toLowerCase() === 'sekretaris umum')
  const sek1 = activeMembers.find((member) => member.role.toLowerCase() === 'sekretaris 1')
  const sek2 = activeMembers.find((member) => member.role.toLowerCase() === 'sekretaris 2')

  const bendum = activeMembers.find((member) => member.role.toLowerCase() === 'bendahara umum')
  const bend1 = activeMembers.find((member) => member.role.toLowerCase() === 'bendahara 1')
  const bend2 = activeMembers.find((member) => member.role.toLowerCase() === 'bendahara 2')

  // Level 4: Departments
  const deptList = ['Seni Budaya', 'PSDK', 'Medkom', 'Entrepreneur', 'Internal', 'Eksternal']

  return (
    <section className="bg-[#fff7f2] py-16 px-6 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/90 font-bold">Struktur Organisasi</p>
          <h2 className="mt-4 text-4xl font-bold text-[#8b0000]">Organogram IKM ITERA</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            Hirarki kepengurusan berbasis diagram visual terstruktur — dari pembina, pimpinan utama, hingga kesekretariatan dan departemen kerja.
          </p>
        </div>

        {/* Periode Dropdown */}
        {!loading && !error && uniquePeriods.length > 0 && (
          <div className="flex justify-center items-center gap-3 bg-white p-4 rounded-3xl border border-[#8b0000]/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] max-w-sm mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Periode:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] px-4 py-2.5 text-sm focus:border-[#8b0000] focus:outline-none transition font-medium text-slate-700 cursor-pointer"
            >
              {uniquePeriods.map((period) => (
                <option key={period} value={period}>Periode {period}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <PengurusSkeleton />
        ) : error ? (
          <div className="rounded-[2rem] border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.10)]">
            Terjadi kesalahan: {error}
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* ======================================================== */}
            {/* LEVEL 1: DOSEN PEMBINA                                    */}
            {/* ======================================================== */}
            <div className="flex flex-col items-center">
              <MemberCard member={dosenPembina} />
              
              {(dosenPembina || datuak || bundoKanduang || cadiakPandai || suluahBendang) && (
                <div className="w-0.5 h-10 bg-[#8b0000]/20"></div>
              )}
            </div>

            {/* ======================================================== */}
            {/* LEVEL 2: DATUAK & WAKIL (BUNDO KANDUANG, CADIAK PANDAI, SULUAH BENDANG) */}
            {/* ======================================================== */}
            <div className="relative max-w-6xl mx-auto">
              {/* Background horizontal bar */}
              <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-[#8b0000]/20 -translate-y-1/2 hidden md:block"></div>
              
              <div className="relative grid gap-8 md:grid-cols-4 items-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest block md:hidden">Wakil</span>
                  <MemberCard member={bundoKanduang} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest block md:hidden">Wakil</span>
                  <MemberCard member={cadiakPandai} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-yellow-600 mb-2 uppercase tracking-widest block md:hidden">Ketua Umum</span>
                  <MemberCard member={datuak} highlight={true} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest block md:hidden">Wakil</span>
                  <MemberCard member={suluahBendang} />
                </div>
              </div>

              {(datuak || sekum || bendum) && (
                <div className="w-0.5 h-12 bg-[#8b0000]/20 mx-auto"></div>
              )}
            </div>

            {/* ======================================================== */}
            {/* LEVEL 3: BPH kesekretariatan & kebendaharaan             */}
            {/* ======================================================== */}
            <div className="relative max-w-5xl mx-auto">
              {/* Horizontal line for BPH branching */}
              <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-[#8b0000]/20 hidden md:block"></div>
              
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 pt-4">
                
                {/* 3A: SEKRETARIAT */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8b0000]/20 hidden md:block"></div>
                  <MemberCard member={sekum} highlight={true} />
                  
                  {(sek1 || sek2) && (
                    <>
                      <div className="w-0.5 h-8 bg-[#8b0000]/20"></div>
                      <div className="relative w-full flex justify-center gap-6">
                        {/* Horizontal connecter for Sek 1 & 2 */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#8b0000]/20 hidden md:block"></div>
                        <div className="pt-4 flex flex-col items-center w-1/2 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8b0000]/20 hidden md:block"></div>
                          <MemberCard member={sek1} />
                        </div>
                        <div className="pt-4 flex flex-col items-center w-1/2 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8b0000]/20 hidden md:block"></div>
                          <MemberCard member={sek2} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 3B: KEBENDAHARAAN */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8b0000]/20 hidden md:block"></div>
                  <MemberCard member={bendum} highlight={true} />
                  
                  {(bend1 || bend2) && (
                    <>
                      <div className="w-0.5 h-8 bg-[#8b0000]/20"></div>
                      <div className="relative w-full flex justify-center gap-6">
                        {/* Horizontal connecter for Bend 1 & 2 */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#8b0000]/20 hidden md:block"></div>
                        <div className="pt-4 flex flex-col items-center w-1/2 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8b0000]/20 hidden md:block"></div>
                          <MemberCard member={bend1} />
                        </div>
                        <div className="pt-4 flex flex-col items-center w-1/2 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#8b0000]/20 hidden md:block"></div>
                          <MemberCard member={bend2} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {(sekum || bendum) && (
                <div className="w-0.5 h-16 bg-[#8b0000]/20 mx-auto"></div>
              )}
            </div>

            {/* ======================================================== */}
            {/* LEVEL 4: DEPARTEMEN-DEPARTEMEN                           */}
            {/* ======================================================== */}
            <div className="space-y-16">
              <div className="text-center relative">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-[#8b0000]/20 hidden md:block"></div>
                <div className="inline-block bg-[#8b0000] text-white font-bold text-xs uppercase tracking-[0.25em] px-8 py-3 rounded-2xl shadow-md">
                  Jajaran Departemen Kerja
                </div>
              </div>

              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {deptList.map((deptName) => {
                  const kadep = activeMembers.find(
                    (m) => m.departemen === deptName && m.role.toLowerCase().includes('kepala departemen')
                  )
                  const sekdep = activeMembers.find(
                    (m) => m.departemen === deptName && m.role.toLowerCase().includes('sekretaris departemen')
                  )
                  const divisions = activeMembers.filter(
                    (m) => m.departemen === deptName && 
                           !m.role.toLowerCase().includes('kepala departemen') && 
                           !m.role.toLowerCase().includes('sekretaris departemen')
                  )

                  const hasDeptData = kadep || sekdep || divisions.length > 0

                  if (!hasDeptData) return null

                  return (
                    <div key={deptName} className="rounded-[2rem] border border-[#8b0000]/10 bg-slate-50/50 p-6 shadow-sm flex flex-col items-center space-y-6">
                      
                      {/* Dept Title Banner */}
                      <div className="w-full text-center py-2 px-4 bg-gradient-to-r from-[#eec213]/10 via-[#8b0000]/10 to-[#1f1414]/10 rounded-2xl border border-[#8b0000]/10">
                        <h3 className="text-sm font-bold text-[#8b0000] uppercase tracking-wider">Departemen {deptName}</h3>
                      </div>

                      {/* Kadep */}
                      <div className="flex flex-col items-center">
                        <MemberCard member={kadep} highlight={true} />
                        {(sekdep || divisions.length > 0) && (
                          <div className="w-0.5 h-6 bg-[#8b0000]/20"></div>
                        )}
                      </div>

                      {/* Sekdep & Divisi */}
                      {(sekdep || divisions.length > 0) && (
                        <div className="w-full space-y-4">
                          {sekdep && (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Sekretaris</span>
                              <MemberCard member={sekdep} />
                            </div>
                          )}
                          {divisions.map((divMember) => (
                            <div key={divMember.id} className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Divisi</span>
                              <MemberCard member={divMember} />
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        )}
      </div>
    </section>
  )
}

