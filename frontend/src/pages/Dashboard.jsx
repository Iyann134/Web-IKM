import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingLogo from '../components/LoadingLogo'
import {
  faPlus,
  faEdit,
  faTrash,
  faSignOutAlt,
  faUsers,
  faNewspaper,
  faTrophy,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import {
  fetchPengurus,
  fetchBerita,
  fetchPrestasi,
  createPengurus,
  updatePengurus,
  deletePengurus,
  createBerita,
  updateBerita,
  deleteBerita,
  createPrestasi,
  updatePrestasi,
  deletePrestasi,
  uploadImage
} from '../services/api'


export default function Dashboard() {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [adminUser, setAdminUser] = useState('')
  const [activeTab, setActiveTab] = useState('pengurus') // 'pengurus' | 'berita' | 'prestasi'

  // Data States
  const [pengurusList, setPengurusList] = useState([])
  const [beritaList, setBeritaList] = useState([])
  const [prestasiList, setPrestasiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')


  // Modal / Form States
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Upload States
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)


  // Form Fields
  const [pengurusForm, setPengurusForm] = useState({ role: '', name: '', description: '', periode: '', nim_nip: '', prodi: '', departemen: '' })
  const [beritaForm, setBeritaForm] = useState({ title: '', date: '', content: '', image: '' })
  const [prestasiForm, setPrestasiForm] = useState({ title: '', year: '', description: '' })

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    const storedUsername = localStorage.getItem('adminUsername')

    if (!storedToken) {
      navigate('/admin/login')
    } else {
      setToken(storedToken)
      setAdminUser(storedUsername || 'Admin')
      loadData()
    }
  }, [navigate])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pData, bData, prData] = await Promise.all([
        fetchPengurus(),
        fetchBerita(),
        fetchPrestasi()
      ])
      setPengurusList(pData)
      setBeritaList(bData)
      setPrestasiList(prData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUsername')
    navigate('/admin/login')
  }

  const showNotification = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const imageUrl = await uploadImage(token, file)
      setBeritaForm(prev => ({ ...prev, image: imageUrl }))
      showNotification('Gambar berhasil diunggah.')
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  // --- CRUD ACTIONS ---

  const handleOpenAdd = () => {
    setEditMode(false)
    setCurrentId(null)
    setPengurusForm({ role: '', name: '', description: '', periode: '2025/2026', nim_nip: '', prodi: 'Teknik Material', departemen: '-' })
    setBeritaForm({ title: '', date: '', content: '', image: '' })
    setPrestasiForm({ title: '', year: '', description: '' })
    setShowModal(true)
  }

  const handleOpenEdit = (type, item) => {
    setEditMode(true)
    setCurrentId(item.id)
    if (type === 'pengurus') {
      setPengurusForm({ 
        role: item.role, 
        name: item.name, 
        description: item.description, 
        periode: item.periode || '2025/2026',
        nim_nip: item.nim_nip || '-',
        prodi: item.prodi || 'Teknik Material',
        departemen: item.departemen || '-'
      })
    } else if (type === 'berita') {
      setBeritaForm({ title: item.title, date: item.date, content: item.content, image: item.image })
    } else if (type === 'prestasi') {
      setPrestasiForm({ title: item.title, year: item.year, description: item.description })
    }
    setShowModal(true)
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data ${type} ini?`)) return

    try {
      if (type === 'pengurus') {
        await deletePengurus(token, id)
        setPengurusList(pengurusList.filter(item => item.id !== id))
      } else if (type === 'berita') {
        await deleteBerita(token, id)
        setBeritaList(beritaList.filter(item => item.id !== id))
      } else if (type === 'prestasi') {
        await deletePrestasi(token, id)
        setPrestasiList(prestasiList.filter(item => item.id !== id))
      }
      showNotification(`Data ${type} berhasil dihapus.`)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (activeTab === 'pengurus') {
        if (editMode) {
          const updated = await updatePengurus(token, currentId, pengurusForm)
          setPengurusList(pengurusList.map(item => item.id === currentId ? updated : item))
          showNotification('Data pengurus berhasil diperbarui.')
        } else {
          const created = await createPengurus(token, pengurusForm)
          setPengurusList([...pengurusList, created])
          showNotification('Pengurus baru berhasil ditambahkan.')
        }
      } else if (activeTab === 'berita') {
        if (editMode) {
          const updated = await updateBerita(token, currentId, beritaForm)
          setBeritaList(beritaList.map(item => item.id === currentId ? updated : item))
          showNotification('Berita berhasil diperbarui.')
        } else {
          const created = await createBerita(token, beritaForm)
          setBeritaList([created, ...beritaList])
          showNotification('Berita baru berhasil dibuat.')
        }
      } else if (activeTab === 'prestasi') {
        if (editMode) {
          const updated = await updatePrestasi(token, currentId, prestasiForm)
          setPrestasiList(prestasiList.map(item => item.id === currentId ? updated : item))
          showNotification('Prestasi berhasil diperbarui.')
        } else {
          const created = await createPrestasi(token, prestasiForm)
          setPrestasiList([created, ...prestasiList])
          showNotification('Prestasi baru berhasil ditambahkan.')
        }
      }
      setShowModal(false)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section className="bg-[#fff9f4] min-h-screen py-10 px-4 md:px-8 text-[#1f1414]">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-[#8b0000]/10 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.15)] gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#8b0000]">Dashboard Admin</h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat datang kembali, <span className="font-semibold text-[#8b0000]">{adminUser}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#8b0000] hover:bg-[#b11919] px-5 py-3 text-sm font-semibold text-white transition focus:outline-none shadow-sm shadow-red-950/10"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Keluar
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-sm font-medium text-green-700 shadow-sm transition">
            {successMsg}
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700 shadow-sm transition">
            Error: {error}
          </div>
        )}

        {/* Tab Selector & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white p-4 rounded-[2rem] border border-[#8b0000]/10 shadow-sm gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'pengurus', label: 'BPH & Pengurus', icon: faUsers },
              { id: 'berita', label: 'Berita Terkini', icon: faNewspaper },
              { id: 'prestasi', label: 'Daftar Prestasi', icon: faTrophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setError(null)
                }}
                className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl border-2 border-transparent transition focus:outline-none ${
                  activeTab === tab.id
                    ? 'marawa-outline-active'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#8b0000]'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition focus:outline-none shadow-sm shadow-emerald-950/10"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tambah Data
          </button>
        </div>

        {/* Contents Grid */}
        <div className="bg-white rounded-[2rem] border border-[#8b0000]/10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.15)] p-6 md:p-8 min-h-[400px]">
          {loading ? (
            <LoadingLogo message="Memuat data administrasi..." />
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Cari data ${activeTab === 'pengurus' ? 'pengurus' : activeTab === 'berita' ? 'berita' : 'prestasi'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] px-5 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition shadow-sm"
                />
              </div>

              <div className="overflow-x-auto">
                
                {/* --- PENGURUS TABLE --- */}
                {activeTab === 'pengurus' && (
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-4">Nama</th>
                        <th className="py-4 px-4">Jabatan</th>
                        <th className="py-4 px-4">NIM/NIP</th>
                        <th className="py-4 px-4">Prodi</th>
                        <th className="py-4 px-4">Departemen</th>
                        <th className="py-4 px-4">Periode</th>
                        <th className="py-4 px-4">Deskripsi</th>
                        <th className="py-4 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {pengurusList
                        .filter(member => 
                          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.periode || '2025/2026').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.nim_nip || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.prodi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.departemen || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.description.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(member => (
                          <tr key={member.id} className="hover:bg-slate-50 transition">
                            <td className="py-4 px-4 font-semibold text-slate-800">{member.name}</td>
                            <td className="py-4 px-4"><span className="rounded-full bg-[#fff2ef] border border-[#8b0000]/15 px-3 py-1 text-xs text-[#8b0000] font-medium">{member.role}</span></td>
                            <td className="py-4 px-4 text-slate-600">{member.nim_nip || '-'}</td>
                            <td className="py-4 px-4 text-slate-600">{member.prodi || 'Teknik Material'}</td>
                            <td className="py-4 px-4 text-slate-600"><span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">{member.departemen || '-'}</span></td>
                            <td className="py-4 px-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{member.periode || '2025/2026'}</span></td>
                            <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{member.description}</td>
                            <td className="py-4 px-4 text-center space-x-2">
                              <button onClick={() => handleOpenEdit('pengurus', member)} className="p-2 text-slate-500 hover:text-blue-600 transition" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                              <button onClick={() => handleDelete('pengurus', member.id)} className="p-2 text-slate-500 hover:text-red-600 transition" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                          </tr>
                        ))}
                      {pengurusList.filter(member => 
                        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (member.periode || '2025/2026').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (member.nim_nip || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (member.prodi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (member.departemen || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.description.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-slate-500">Tidak ada pengurus yang cocok.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* --- BERITA TABLE --- */}
                {activeTab === 'berita' && (
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-4 w-28">Sampul</th>
                        <th className="py-4 px-4">Judul</th>
                        <th className="py-4 px-4">Tanggal</th>
                        <th className="py-4 px-4">Konten</th>
                        <th className="py-4 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {beritaList
                        .filter(article => 
                          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(article => (
                          <tr key={article.id} className="hover:bg-slate-50 transition">
                            <td className="py-4 px-4">
                              {article.image ? (
                                <img src={article.image} alt={article.title} className="h-10 w-16 object-cover rounded-lg border border-slate-200 shadow-sm" />
                              ) : (
                                <div className="h-10 w-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                              )}
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-800">{article.title}</td>
                            <td className="py-4 px-4 text-slate-500">{article.date}</td>
                            <td className="py-4 px-4 text-slate-600 max-w-sm truncate">{article.content}</td>
                            <td className="py-4 px-4 text-center space-x-2">
                              <button onClick={() => handleOpenEdit('berita', article)} className="p-2 text-slate-500 hover:text-blue-600 transition" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                              <button onClick={() => handleDelete('berita', article.id)} className="p-2 text-slate-500 hover:text-red-600 transition" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                          </tr>
                        ))}
                      {beritaList.filter(article => 
                        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.content.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-500">Tidak ada berita yang cocok.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* --- PRESTASI TABLE --- */}
                {activeTab === 'prestasi' && (
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-4">Judul Prestasi</th>
                        <th className="py-4 px-4">Tahun</th>
                        <th className="py-4 px-4">Deskripsi</th>
                        <th className="py-4 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {prestasiList
                        .filter(achievement => 
                          achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          achievement.year.toString().includes(searchQuery)
                        )
                        .map(achievement => (
                          <tr key={achievement.id} className="hover:bg-slate-50 transition">
                            <td className="py-4 px-4 font-semibold text-slate-800">{achievement.title}</td>
                            <td className="py-4 px-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{achievement.year}</span></td>
                            <td className="py-4 px-4 text-slate-600 max-w-sm truncate">{achievement.description}</td>
                            <td className="py-4 px-4 text-center space-x-2">
                              <button onClick={() => handleOpenEdit('prestasi', achievement)} className="p-2 text-slate-500 hover:text-blue-600 transition" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                              <button onClick={() => handleDelete('prestasi', achievement.id)} className="p-2 text-slate-500 hover:text-red-600 transition" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                          </tr>
                        ))}
                      {prestasiList.filter(achievement => 
                        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        achievement.year.toString().includes(searchQuery)
                      ).length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-slate-500">Tidak ada prestasi yang cocok.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- FORM MODAL (ADD / EDIT) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-[#8b0000]/10 p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h2 className="text-2xl font-bold text-[#8b0000] mb-6">
              {editMode ? 'Edit Data' : 'Tambah Data Baru'} - {activeTab === 'pengurus' ? 'Pengurus' : activeTab === 'berita' ? 'Berita' : 'Prestasi'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* --- PENGURUS FORM FIELDS --- */}
              {activeTab === 'pengurus' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.name}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, name: e.target.value })}
                      placeholder="Masukkan nama pengurus"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Jabatan / Peran</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.role}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, role: e.target.value })}
                      placeholder="Contoh: Datuak (Ketua Umum), Bundo Kanduang, Sekretaris Umum, Kepala Departemen"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">NIM / NIP</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.nim_nip}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, nim_nip: e.target.value })}
                      placeholder="Masukkan NIM (mahasiswa) atau NIP (dosen)"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Program Studi</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.prodi}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, prodi: e.target.value })}
                      placeholder="Masukkan nama Program Studi, contoh: Teknik Material"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Departemen</label>
                    <select
                      value={pengurusForm.departemen}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, departemen: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:outline-none bg-white transition cursor-pointer"
                    >
                      <option value="-">Bukan Departemen (-)</option>
                      <option value="Seni Budaya">Seni Budaya</option>
                      <option value="PSDK">PSDK</option>
                      <option value="Medkom">Medkom</option>
                      <option value="Entrepreneur">Entrepreneur</option>
                      <option value="Internal">Internal</option>
                      <option value="Eksternal">Eksternal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Periode Kepengurusan</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.periode}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, periode: e.target.value })}
                      placeholder="Contoh: 2025/2026, 2026/2027"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Deskripsi Tugas</label>
                    <textarea
                      required
                      rows="3"
                      value={pengurusForm.description}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, description: e.target.value })}
                      placeholder="Tulis penjelasan singkat mengenai tugas/peran pengurus..."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    ></textarea>
                  </div>
                </>
              )}

              {/* --- BERITA FORM FIELDS --- */}
              {activeTab === 'berita' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Judul Berita</label>
                    <input
                      type="text"
                      required
                      value={beritaForm.title}
                      onChange={(e) => setBeritaForm({ ...beritaForm, title: e.target.value })}
                      placeholder="Masukkan judul berita utama"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Tanggal Terbit</label>
                    <input
                      type="date"
                      required
                      value={beritaForm.date}
                      onChange={(e) => setBeritaForm({ ...beritaForm, date: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Gambar Sampul</label>
                    {beritaForm.image && (
                      <div className="mb-3 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-40 w-full max-w-md">
                        <img src={beritaForm.image} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBeritaForm(prev => ({ ...prev, image: '' }))}
                          className="absolute top-2 right-2 rounded-full bg-red-600 hover:bg-red-700 p-2 text-white text-xs transition"
                          title="Hapus Gambar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          value={beritaForm.image}
                          onChange={(e) => setBeritaForm({ ...beritaForm, image: e.target.value })}
                          placeholder="Masukkan URL gambar atau gunakan tombol upload..."
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                        />
                      </div>
                      <div className="relative">
                        <label className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white cursor-pointer transition focus:outline-none shadow-sm ${uploading ? 'bg-slate-400' : 'bg-slate-700 hover:bg-slate-800'}`}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                          {uploading ? 'Mengunggah...' : 'Upload File'}
                        </label>
                      </div>
                    </div>
                    {uploadError && (
                      <p className="text-xs text-red-600 mt-2">Error upload: {uploadError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Konten Lengkap</label>
                    <textarea
                      required
                      rows="6"
                      value={beritaForm.content}
                      onChange={(e) => setBeritaForm({ ...beritaForm, content: e.target.value })}
                      placeholder="Tulis artikel berita secara detail di sini..."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    ></textarea>
                  </div>
                </>
              )}

              {/* --- PRESTASI FORM FIELDS --- */}
              {activeTab === 'prestasi' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Judul Prestasi</label>
                    <input
                      type="text"
                      required
                      value={prestasiForm.title}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, title: e.target.value })}
                      placeholder="Contoh: Juara 1 Lomba Tari Tradisional"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Tahun Diraih</label>
                    <input
                      type="number"
                      required
                      value={prestasiForm.year}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, year: e.target.value })}
                      placeholder="Contoh: 2026"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Deskripsi Prestasi</label>
                    <textarea
                      required
                      rows="3"
                      value={prestasiForm.description}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, description: e.target.value })}
                      placeholder="Tulis penjelasan singkat mengenai prestasi yang dicapai..."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 hover:bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 transition focus:outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition focus:outline-none shadow-sm shadow-emerald-950/10"
                >
                  {editMode ? 'Simpan Perubahan' : 'Simpan Data'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  )
}
