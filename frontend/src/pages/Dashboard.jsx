import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  deletePrestasi
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

  // Modal / Form States
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Form Fields
  const [pengurusForm, setPengurusForm] = useState({ role: '', name: '', description: '' })
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

  // --- CRUD ACTIONS ---

  const handleOpenAdd = () => {
    setEditMode(false)
    setCurrentId(null)
    setPengurusForm({ role: '', name: '', description: '' })
    setBeritaForm({ title: '', date: '', content: '', image: '' })
    setPrestasiForm({ title: '', year: '', description: '' })
    setShowModal(true)
  }

  const handleOpenEdit = (type, item) => {
    setEditMode(true)
    setCurrentId(item.id)
    if (type === 'pengurus') {
      setPengurusForm({ role: item.role, name: item.name, description: item.description })
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
                className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl transition focus:outline-none ${
                  activeTab === tab.id
                    ? 'bg-marawa-gradient text-white shadow-md'
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
            <div className="flex items-center justify-center h-[300px] text-[#8b0000] font-semibold animate-pulse">
              Memuat data administrasi...
            </div>
          ) : (
            <div className="overflow-x-auto">
              
              {/* --- PENGURUS TABLE --- */}
              {activeTab === 'pengurus' && (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                      <th className="py-4 px-4">Nama</th>
                      <th className="py-4 px-4">Jabatan</th>
                      <th className="py-4 px-4">Deskripsi</th>
                      <th className="py-4 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pengurusList.map(member => (
                      <tr key={member.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4 font-semibold text-slate-800">{member.name}</td>
                        <td className="py-4 px-4"><span className="rounded-full bg-[#fff2ef] border border-[#8b0000]/15 px-3 py-1 text-xs text-[#8b0000] font-medium">{member.role}</span></td>
                        <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{member.description}</td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button onClick={() => handleOpenEdit('pengurus', member)} className="p-2 text-slate-500 hover:text-blue-600 transition" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                          <button onClick={() => handleDelete('pengurus', member.id)} className="p-2 text-slate-500 hover:text-red-600 transition" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* --- BERITA TABLE --- */}
              {activeTab === 'berita' && (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                      <th className="py-4 px-4">Judul</th>
                      <th className="py-4 px-4">Tanggal</th>
                      <th className="py-4 px-4">Konten</th>
                      <th className="py-4 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {beritaList.map(article => (
                      <tr key={article.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4 font-semibold text-slate-800">{article.title}</td>
                        <td className="py-4 px-4 text-slate-500">{article.date}</td>
                        <td className="py-4 px-4 text-slate-600 max-w-sm truncate">{article.content}</td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button onClick={() => handleOpenEdit('berita', article)} className="p-2 text-slate-500 hover:text-blue-600 transition" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                          <button onClick={() => handleDelete('berita', article.id)} className="p-2 text-slate-500 hover:text-red-600 transition" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                      </tr>
                    ))}
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
                    {prestasiList.map(achievement => (
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
                  </tbody>
                </table>
              )}

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
                      placeholder="Contoh: Ketua Umum, Sekretaris, Departemen"
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
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">URL Gambar Sampul</label>
                    <input
                      type="url"
                      required
                      value={beritaForm.image}
                      onChange={(e) => setBeritaForm({ ...beritaForm, image: e.target.value })}
                      placeholder="Contoh: https://images.unsplash.com/photo-..."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
                    />
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
