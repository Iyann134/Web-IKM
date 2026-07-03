import { useEffect, useState } from 'react'
import { fetchPengurus } from '../services/api'
import LoadingLogo from '../components/LoadingLogo'

// Adapt JSON member to standard MemberCard shape
const adaptJsonMember = (m, customRole) => {
  if (!m) return null;
  return {
    name: m.nama,
    role: customRole || m.jabatan || 'Staff',
    nim_nip: m.nim || m.nip || '-',
    prodi: m.prodi
  }
}

function MemberCard({ member, highlight = false, isInteractive = false, onClick }) {
  if (!member) return (
    <div className="border border-dashed border-slate-300 rounded-[1.5rem] p-5 w-full max-w-[260px] mx-auto text-center flex flex-col items-center justify-center min-h-[140px] bg-slate-50/40">
      <p className="text-xs text-slate-400 italic font-medium">Belum Diisi</p>
    </div>
  )

  const isDatuak = member.role?.toLowerCase() === 'datuak (ketua umum)' || member.role?.toLowerCase() === 'datuak'
  const isPembina = member.role?.toLowerCase() === 'dosen pembina'

  return (
    <div
      onClick={onClick}
      className={`relative group bg-white border ${isDatuak
          ? 'border-yellow-400 shadow-[0_15px_40px_-15px_rgba(238,194,19,0.15)] ring-2 ring-yellow-400/20'
          : highlight
            ? 'border-[#8b0000]/30 shadow-[0_12px_35px_rgba(139,0,0,0.06)]'
            : 'border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.02)]'
        } ${isInteractive
          ? 'cursor-pointer hover:border-yellow-500 hover:ring-2 hover:ring-yellow-400/20'
          : 'hover:border-[#8b0000]/40'
        } rounded-[1.5rem] p-5 hover:shadow-[0_20px_40px_rgba(139,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[260px] mx-auto text-center z-10`}
    >
      {/* Interactive indicator badge */}
      {isInteractive && (
        <div className="absolute top-3 right-3 flex items-center justify-center bg-yellow-400/10 text-yellow-600 rounded-full p-1.5 group-hover:bg-yellow-400 group-hover:text-white transition-colors duration-300">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      )}

      {/* Role Badge with Marawa gradient */}
      <div className={`inline-block text-[10px] font-bold uppercase tracking-wider text-white px-4 py-1.5 rounded-full shadow-sm mb-3 ${isDatuak
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
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 ${isDatuak
          ? 'bg-yellow-400'
          : 'bg-[#8b0000]'
        } rounded-t-full transition-all duration-300 group-hover:w-24`}></div>

      {/* Interactive Helper Text */}
      {isInteractive && (
        <p className="mt-2 text-[9px] font-semibold text-yellow-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Klik untuk detail
        </p>
      )}
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
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: '',
    parent: null,
    staff: []
  })

  useEffect(() => {
    fetchPengurus()
      .then((data) => {
        setPengurus(data)
        const periods = Array.from(new Set(data.map(m => m.periode || '2025/2026'))).sort((a, b) => b.localeCompare(a))
        if (!periods.includes('2026/2027')) {
          periods.unshift('2026/2027')
        }
        if (periods.length > 0) {
          setSelectedPeriod(periods[0])
        }
        setLoading(false)
      })
      .catch((err) => {
        setPengurus([])
        setSelectedPeriod('2026/2027')
        setLoading(false)
      })
  }, [])

  const fetchedPeriods = Array.from(new Set(pengurus.map((m) => m.periode || '2025/2026')))
  if (!fetchedPeriods.includes('2026/2027')) {
    fetchedPeriods.push('2026/2027')
  }
  const uniquePeriods = fetchedPeriods.sort((a, b) => b.localeCompare(a))

  const isPeriod2026 = selectedPeriod === '2026/2027'

  // Pre-process database data
  const activeMembers = pengurus.filter((member) => (member.periode || '2025/2026') === selectedPeriod)

  // Map flat DB record to the old JSON shape
  const mapDbRecordToJsonShape = (r) => {
    if (!r) return null;
    return {
      nama: r.name,
      nim: r.nim_nip,
      nip: r.nim_nip,
      prodi: r.prodi,
      jabatan: r.role
    }
  }

  // Parse BPH 2026/2027 structure dynamically from Supabase activeMembers
  const parsedBph2026 = {
    dosen_pembina: null,
    pimpinan_puncak: null,
    penasihat: [],
    pengurus_inti: {
      kesekretariatan: { kepala: null, staff_popup_data: [] },
      keuangan: { kepala: null, staff_popup_data: [] }
    },
    jajaran_departemen: []
  }

  if (isPeriod2026) {
    // 1. Dosen Pembina
    const dbPembina = activeMembers.find(m => m.role.toLowerCase() === 'dosen pembina')
    parsedBph2026.dosen_pembina = mapDbRecordToJsonShape(dbPembina)

    // 2. Pimpinan Puncak (Datuak)
    const dbDatuak = activeMembers.find(m => m.role.toLowerCase() === 'datuak')
    parsedBph2026.pimpinan_puncak = mapDbRecordToJsonShape(dbDatuak)

    // 3. Penasihat
    const dbPenasihat = activeMembers.filter(m =>
      ['bundo kanduang', 'cadiak pandai', 'suluah bendang'].includes(m.role.toLowerCase())
    )
    parsedBph2026.penasihat = dbPenasihat.map(mapDbRecordToJsonShape)

    // 4. Pengurus Inti - Kesekretariatan
    const dbKesekKepala = activeMembers.find(m =>
      m.departemen.toLowerCase() === 'kesekretariatan' && !m.is_staff
    )
    parsedBph2026.pengurus_inti.kesekretariatan.kepala = mapDbRecordToJsonShape(dbKesekKepala)

    const dbKesekStaff = activeMembers.filter(m =>
      m.departemen.toLowerCase() === 'kesekretariatan' && m.is_staff
    )
    parsedBph2026.pengurus_inti.kesekretariatan.staff_popup_data = dbKesekStaff.map(mapDbRecordToJsonShape)

    // 5. Pengurus Inti - Keuangan
    const dbKeuKepala = activeMembers.find(m =>
      m.departemen.toLowerCase() === 'keuangan' && !m.is_staff
    )
    parsedBph2026.pengurus_inti.keuangan.kepala = mapDbRecordToJsonShape(dbKeuKepala)

    const dbKeuStaff = activeMembers.filter(m =>
      m.departemen.toLowerCase() === 'keuangan' && m.is_staff
    )
    parsedBph2026.pengurus_inti.keuangan.staff_popup_data = dbKeuStaff.map(mapDbRecordToJsonShape)

    // 6. Jajaran Departemen
    const deptList2026 = ['SENI BUDAYA', 'PSDK', 'KOMINFO', 'ENTREPRENEUR', 'Internal', 'Eksternal']

    parsedBph2026.jajaran_departemen = deptList2026.map(deptName => {
      // Kepala Departemen
      const dbKadep = activeMembers.find(m =>
        m.departemen.toLowerCase() === deptName.toLowerCase() && m.role.toLowerCase() === 'kepala departemen'
      )
      // Sekretaris Departemen
      const dbSekdep = activeMembers.find(m =>
        m.departemen.toLowerCase() === deptName.toLowerCase() && m.role.toLowerCase() === 'sekretaris departemen'
      )
      // Divisi under this department
      const deptDivisions = Array.from(new Set(
        activeMembers
          .filter(m => m.departemen.toLowerCase() === deptName.toLowerCase() && m.divisi && m.divisi !== '-')
          .map(m => m.divisi)
      ))

      const divisionsData = deptDivisions.map(divName => {
        // Kepala Divisi
        const dbDivLead = activeMembers.find(m =>
          m.departemen.toLowerCase() === deptName.toLowerCase() &&
          m.divisi.toLowerCase() === divName.toLowerCase() &&
          m.role.toLowerCase() === 'kepala divisi'
        )
        // Staff under this division
        const dbDivStaff = activeMembers.filter(m =>
          m.departemen.toLowerCase() === deptName.toLowerCase() &&
          m.divisi.toLowerCase() === divName.toLowerCase() &&
          m.is_staff
        )

        return {
          nama_divisi: divName,
          kepala_divisi: mapDbRecordToJsonShape(dbDivLead),
          staff_popup_data: dbDivStaff.map(mapDbRecordToJsonShape)
        }
      })

      // Map display name nicely
      let displayName = deptName
      if (deptName.toLowerCase() === 'seni budaya') displayName = 'Seni Budaya'
      if (deptName.toLowerCase() === 'kominfo') displayName = 'KOMINFO'
      if (deptName.toLowerCase() === 'entrepreneur') displayName = 'Entrepreneur'
      if (deptName.toLowerCase() === 'psdk') displayName = 'PSDK'
      if (deptName.toLowerCase() === 'internal') displayName = 'Internal'
      if (deptName.toLowerCase() === 'eksternal') displayName = 'Eksternal'

      return {
        nama_departemen: displayName,
        kepala_departemen: mapDbRecordToJsonShape(dbKadep),
        sekretaris_departemen: mapDbRecordToJsonShape(dbSekdep),
        divisi: divisionsData
      }
    }).filter(d => d.kepala_departemen || d.sekretaris_departemen || d.divisi.length > 0)
  }

  // Level 1: Dosen Pembina (Legacy)
  const dosenPembina = activeMembers.find((member) => member.role.toLowerCase() === 'dosen pembina')

  // Level 2: Datuak & Vices (Legacy)
  const datuak = activeMembers.find((member) => member.role.toLowerCase() === 'datuak')
  const bundoKanduang = activeMembers.find((member) => member.role.toLowerCase() === 'bundo kanduang')
  const cadiakPandai = activeMembers.find((member) => member.role.toLowerCase() === 'cadiak pandai')
  const suluahBendang = activeMembers.find((member) => member.role.toLowerCase() === 'suluah bendang')

  // Level 3: Secretariat & Treasury (Legacy)
  const sekum = activeMembers.find((member) => member.role.toLowerCase() === 'sekretaris umum')
  const sek1 = activeMembers.find((member) => member.role.toLowerCase() === 'sekretaris 1')
  const sek2 = activeMembers.find((member) => member.role.toLowerCase() === 'sekretaris 2')

  const bendum = activeMembers.find((member) => member.role.toLowerCase() === 'bendahara umum')
  const bend1 = activeMembers.find((member) => member.role.toLowerCase() === 'bendahara 1')
  const bend2 = activeMembers.find((member) => member.role.toLowerCase() === 'bendahara 2')

  // Level 4: Departments (Legacy)
  const deptList = ['Seni Budaya', 'PSDK', 'Medkom', 'Entrepreneur', 'Internal', 'Eksternal']

  return (
    <section className="bg-[#fff7f2] py-16 px-6 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#8b0000]/90 font-bold">Struktur Organisasi</p>
          <h2 className="mt-4 text-4xl font-bold text-[#8b0000]">Struktur Organisasi IKM ITERA</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            Visualisasi hierarki kepengurusan yang dirancang secara terstruktur dan jelas. Menggambarkan sinergi organisasi secara utuh dari Pembina, Pimpinan Utama, Kesekretariatan, hingga jajaran Departemen Kerja yang menjadi ujung tombak eksekusi.
          </p>
        </div>

        {/* Periode Selector (Premium Segmented Tabs) */}
        {!loading && !error && uniquePeriods.length > 0 && (
          <div className="flex justify-center items-center pt-2">
            <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-md border border-[#8b0000]/10 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(139,0,0,0.12)]">
              {uniquePeriods.map((period) => {
                const isActive = selectedPeriod === period;
                return (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`relative px-6 py-2.5 rounded-[1.7rem] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 ${isActive
                        ? 'bg-[#8b0000] text-white shadow-[0_10px_25px_-5px_rgba(139,0,0,0.3)]'
                        : 'text-slate-600 hover:text-[#8b0000] hover:bg-slate-50'
                      }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-1 bg-yellow-400 rounded-full animate-pulse"></span>
                    )}
                    Periode {period}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {loading ? (
          <PengurusSkeleton />
        ) : error ? (
          <div className="rounded-[2rem] border border-red-300 bg-red-50 p-10 text-center text-red-700 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.10)]">
            Terjadi kesalahan: {error}
          </div>
        ) : isPeriod2026 ? (
          /* ======================================================================= */
          /* INTERACTIVE HIERARCHY LAYOUT FOR 2026/2027 (DYNAMIC DATABASE BACKED)   */
          /* ======================================================================= */
          <div className="space-y-0">

            {/* LEVEL 0: DOSEN PEMBINA */}
            <div className="flex flex-col items-center">
              <MemberCard member={adaptJsonMember(parsedBph2026.dosen_pembina)} />
              <div className="w-0.5 h-12 bg-[#8b0000]/20"></div>
            </div>

            {/* LEVEL 1: DATUAK (KETUA UMUM) - CENTERED */}
            <div className="flex flex-col items-center">
              <MemberCard member={adaptJsonMember(parsedBph2026.pimpinan_puncak)} highlight={true} />
              <div className="w-0.5 h-12 bg-[#8b0000]/20"></div>
            </div>

            {/* LEVEL 2: PENASIHAT - ROW OF 3 CENTERED */}
            <div className="relative max-w-5xl mx-auto pt-6">
              {/* Horizontal branch line */}
              <div className="absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-[#8b0000]/20 hidden md:block"></div>

              <div className="grid md:grid-cols-3 gap-8">
                {parsedBph2026.penasihat.map((p, index) => {
                  const adaptedPenasihat = adaptJsonMember(p);
                  return (
                    <div key={index} className="flex flex-col items-center relative">
                      {/* Vertical connector line above each Penasihat card */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8b0000]/20 hidden md:block"></div>
                      <MemberCard member={adaptedPenasihat} />
                    </div>
                  )
                })}
              </div>

              {/* Vertical line going down from the center of Penasihat to Level 3 */}
              <div className="w-0.5 h-12 bg-[#8b0000]/20 mx-auto hidden md:block"></div>
            </div>

            {/* LEVEL 3: PENGURUS INTI (KESEKRETARIATAN & KEUANGAN) */}
            <div className="relative max-w-4xl mx-auto pt-6">
              {/* Horizontal line for BPH branching */}
              <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-[#8b0000]/20 hidden md:block"></div>

              <div className="grid md:grid-cols-2 gap-12 md:gap-24 pt-4">

                {/* 3A: KESEKRETARIATAN */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[#8b0000]/20 hidden md:block"></div>
                  <MemberCard
                    member={adaptJsonMember(parsedBph2026.pengurus_inti.kesekretariatan.kepala, 'Sekretaris Umum')}
                    highlight={true}
                    isInteractive={true}
                    onClick={() => setModalData({
                      isOpen: true,
                      title: "Jajaran Kesekretariatan",
                      parent: adaptJsonMember(parsedBph2026.pengurus_inti.kesekretariatan.kepala, 'Sekretaris Umum'),
                      staff: parsedBph2026.pengurus_inti.kesekretariatan.staff_popup_data
                    })}
                  />
                </div>

                {/* 3B: KEUANGAN */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[#8b0000]/20 hidden md:block"></div>
                  <MemberCard
                    member={adaptJsonMember(parsedBph2026.pengurus_inti.keuangan.kepala, 'Bendahara Umum')}
                    highlight={true}
                    isInteractive={true}
                    onClick={() => setModalData({
                      isOpen: true,
                      title: "Jajaran Kebendaharaan",
                      parent: adaptJsonMember(parsedBph2026.pengurus_inti.keuangan.kepala, 'Bendahara Umum'),
                      staff: parsedBph2026.pengurus_inti.keuangan.staff_popup_data
                    })}
                  />
                </div>

              </div>

              <div className="w-0.5 h-16 bg-[#8b0000]/20 mx-auto"></div>
            </div>

            {/* LEVEL 4 & 5 & 6: JAJARAN DEPARTEMEN & DIVISI */}
            <div className="space-y-0">
              <div className="text-center relative">
                <div className="inline-block bg-[#8b0000] text-white font-bold text-xs uppercase tracking-[0.25em] px-8 py-3 rounded-2xl shadow-md">
                  Jajaran Departemen
                </div>
                {/* Line going down from the badge to the horizontal connector below */}
                <div className="w-0.5 h-12 bg-[#8b0000]/20 mx-auto hidden md:block"></div>
              </div>

              <div className="relative max-w-7xl mx-auto pt-10">
                {/* Horizontal connector line for the 3 departments */}
                <div className="absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-[#8b0000]/20 hidden lg:block"></div>
                {/* Horizontal connector line for 2 departments on tablet screens */}
                <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-[#8b0000]/20 hidden md:block lg:hidden"></div>

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                  {parsedBph2026.jajaran_departemen.map((dept) => {
                    const deptChildren = [];
                    if (dept.sekretaris_departemen) {
                      deptChildren.push({ type: 'sekretaris', data: dept.sekretaris_departemen });
                    }
                    dept.divisi.forEach(div => {
                      deptChildren.push({ type: 'divisi', data: div });
                    });

                    return (
                      <div key={dept.nama_departemen} className="relative rounded-[2rem] border border-[#8b0000]/10 bg-slate-50/50 p-6 shadow-sm flex flex-col items-center space-y-6 pt-12">
                        {/* Vertical line coming down from the horizontal branch to the department card */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8b0000]/20 hidden md:block"></div>

                        {/* Dept Title Banner */}
                        <div className="w-full text-center py-2 px-4 bg-gradient-to-r from-[#eec213]/10 via-[#8b0000]/10 to-[#1f1414]/10 rounded-2xl border border-[#8b0000]/10">
                          <h3 className="text-sm font-bold text-[#8b0000] uppercase tracking-wider">Departemen {dept.nama_departemen}</h3>
                        </div>

                        {/* Kepala Departemen */}
                        <div className="flex flex-col items-center w-full">
                          <MemberCard
                            member={adaptJsonMember(dept.kepala_departemen, 'Kepala Departemen')}
                            highlight={true}
                          />
                          {deptChildren.length > 0 && (
                            <div className="w-0.5 h-6 bg-[#8b0000]/20"></div>
                          )}
                        </div>

                        {/* Connected Children list */}
                        {deptChildren.length > 0 && (
                          <div className="w-full space-y-6">
                            {deptChildren.map((child, idx) => {
                              if (child.type === 'sekretaris') {
                                return (
                                  <div key="sekretaris" className="flex flex-col items-center w-full relative">
                                    {idx > 0 && (
                                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8b0000]/20"></div>
                                    )}
                                    <MemberCard
                                      member={adaptJsonMember(child.data, 'Sekretaris Departemen')}
                                    />
                                  </div>
                                )
                              } else {
                                const div = child.data;
                                const adaptedDivLead = adaptJsonMember(div.kepala_divisi, `Kepala Divisi ${div.nama_divisi}`);
                                return (
                                  <div key={div.nama_divisi} className="flex flex-col items-center w-full relative">
                                    {idx > 0 && (
                                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8b0000]/20"></div>
                                    )}
                                    <MemberCard
                                      member={adaptedDivLead}
                                      isInteractive={true}
                                      onClick={() => setModalData({
                                        isOpen: true,
                                        title: `Divisi ${div.nama_divisi}`,
                                        parent: adaptedDivLead,
                                        staff: div.staff_popup_data
                                      })}
                                    />
                                  </div>
                                )
                              }
                            })}
                          </div>
                        )}

                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* ======================================================================= */
          /* LEGACY RENDERING FOR OTHER PERIODS (DATABASE BACKED)                   */
          /* ======================================================================= */
          <div className="space-y-16">

            {/* LEVEL 1: DOSEN PEMBINA */}
            <div className="flex flex-col items-center">
              <MemberCard member={dosenPembina} />

              {(dosenPembina || datuak || bundoKanduang || cadiakPandai || suluahBendang) && (
                <div className="w-0.5 h-10 bg-[#8b0000]/20"></div>
              )}
            </div>

            {/* LEVEL 2: DATUAK & WAKIL */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-[#8b0000]/20 -translate-y-1/2 hidden md:block"></div>

              <div className="relative grid gap-8 md:grid-cols-4 items-center">
                <div className="flex flex-col items-center">
                  <MemberCard member={bundoKanduang} />
                </div>
                <div className="flex flex-col items-center">
                  <MemberCard member={cadiakPandai} />
                </div>
                <div className="flex flex-col items-center">
                  <MemberCard member={datuak} highlight={true} />
                </div>
                <div className="flex flex-col items-center">
                  <MemberCard member={suluahBendang} />
                </div>
              </div>

              {(datuak || sekum || bendum) && (
                <div className="w-0.5 h-12 bg-[#8b0000]/20 mx-auto"></div>
              )}
            </div>

            {/* LEVEL 3: BPH kesekretariatan & kebendaharaan */}
            <div className="relative max-w-5xl mx-auto">
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

            {/* LEVEL 4: DEPARTEMEN-DEPARTEMEN */}
            <div className="space-y-16">
              <div className="text-center relative">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-[#8b0000]/20 hidden md:block"></div>
                <div className="inline-block bg-[#8b0000] text-white font-bold text-xs uppercase tracking-[0.25em] px-8 py-3 rounded-2xl shadow-md">
                  Jajaran Departemen
                </div>
                {/* Line going down to the grid */}
                <div className="w-0.5 h-12 bg-[#8b0000]/20 mx-auto hidden md:block"></div>
              </div>

              <div className="relative max-w-7xl mx-auto pt-10">
                {/* Horizontal connector line for the 3 departments */}
                <div className="absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-[#8b0000]/20 hidden lg:block"></div>
                {/* Horizontal connector line for 2 departments on tablet screens */}
                <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-[#8b0000]/20 hidden md:block lg:hidden"></div>

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
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

                    const legacyChildren = [];
                    if (sekdep) legacyChildren.push({ type: 'sekdep', data: sekdep });
                    divisions.forEach(div => legacyChildren.push({ type: 'divisi', data: div }));

                    return (
                      <div key={deptName} className="relative rounded-[2rem] border border-[#8b0000]/10 bg-slate-50/50 p-6 shadow-sm flex flex-col items-center space-y-6 pt-12">
                        {/* Vertical line coming down from the horizontal branch to the department card */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8b0000]/20 hidden md:block"></div>

                        <div className="w-full text-center py-2 px-4 bg-gradient-to-r from-[#eec213]/10 via-[#8b0000]/10 to-[#1f1414]/10 rounded-2xl border border-[#8b0000]/10">
                          <h3 className="text-sm font-bold text-[#8b0000] uppercase tracking-wider">Departemen {deptName}</h3>
                        </div>

                        <div className="flex flex-col items-center w-full">
                          <MemberCard member={kadep} highlight={true} />
                          {legacyChildren.length > 0 && (
                            <div className="w-0.5 h-6 bg-[#8b0000]/20"></div>
                          )}
                        </div>

                        {legacyChildren.length > 0 && (
                          <div className="w-full space-y-6">
                            {legacyChildren.map((child, idx) => (
                              <div key={child.data.id || idx} className="flex flex-col items-center w-full relative">
                                {idx > 0 && (
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8b0000]/20"></div>
                                )}
                                <MemberCard member={child.data} />
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

          </div>
        )}

        {/* ======================================================================= */}
        {/* INTERACTIVE POP-UP DIALOG (MODAL)                                       */}
        {/* ======================================================================= */}
        {modalData.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#1f1414]/60 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setModalData(prev => ({ ...prev, isOpen: false }))}
            ></div>

            <div className="relative bg-white rounded-[2rem] border border-[#8b0000]/10 shadow-[0_30px_80px_rgba(139,0,0,0.25)] max-w-2xl w-full p-8 overflow-hidden z-10 transform scale-100 transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-[#8b0000] to-slate-900"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Struktur Jajaran</span>
                  <h3 className="text-2xl font-black text-[#8b0000] mt-1">{modalData.title}</h3>
                </div>
                <button
                  onClick={() => setModalData(prev => ({ ...prev, isOpen: false }))}
                  className="text-slate-400 hover:text-[#8b0000] bg-slate-100 hover:bg-[#8b0000]/10 p-2 rounded-full transition-colors focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalData.parent && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#eec213]/5 to-[#8b0000]/5 rounded-2xl border border-[#8b0000]/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{modalData.parent.role}</p>
                    <h4 className="text-base font-bold text-[#8b0000]">{modalData.parent.name}</h4>
                  </div>
                  <div className="text-right text-xs text-slate-500 font-semibold">
                    <p>NIM: {modalData.parent.nim_nip}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{modalData.parent.prodi}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Anggota Staff</h5>
                {modalData.staff.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {modalData.staff.map((staffMember, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 hover:bg-[#8b0000]/5 p-4 rounded-xl border border-slate-200/60 hover:border-[#8b0000]/20 transition-all duration-200 flex flex-col justify-between"
                      >
                        <div>
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded bg-slate-600 mb-2">
                            {staffMember.jabatan || 'Staff'}
                          </span>
                          <h6 className="text-sm font-bold text-slate-800 line-clamp-1">{staffMember.nama}</h6>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200/50 flex justify-between text-[11px] text-slate-500 font-semibold">
                          <span>NIM: {staffMember.nim}</span>
                          <span className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-[120px]">{staffMember.prodi}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 italic text-sm">
                    Tidak ada staff di bawah jajaran ini.
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setModalData(prev => ({ ...prev, isOpen: false }))}
                  className="px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-[#8b0000] hover:to-[#b30000] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300"
                >
                  Tutup Detail
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  )
}
