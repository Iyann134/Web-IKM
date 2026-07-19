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
  faUser,
  faBars
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
  const [token] = useState(() => localStorage.getItem('adminToken') || '')
  const [adminUser] = useState(() => localStorage.getItem('adminUsername') || '')
  const [activeTab, setActiveTab] = useState('pengurus') // 'pengurus' | 'berita' | 'prestasi'
  
  // Collapse / Drawer States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
    if (!storedToken) {
      navigate('/admin/login')
      return
    }

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

    loadData()
  }, [navigate])

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

  // Common render helper for Sidebar Inner Contents
  const renderSidebarContents = (collapsedMode) => {
    return (
      <>
        <div className="space-y-8">
          {/* Profile Section */}
          <div className={`flex items-center gap-3 pb-6 border-b border-slate-100 ${collapsedMode ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-tr from-[#8b0000] to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-[#8b0000]/10 shrink-0">
              <FontAwesomeIcon icon={faUser} className="text-sm" />
            </div>
            {!collapsedMode && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                <p className="text-sm font-black text-[#8b0000] truncate">{adminUser}</p>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-2">
            {[
              { id: 'pengurus', label: 'BPH & Pengurus', icon: faUsers },
              { id: 'berita', label: 'Berita Terkini', icon: faNewspaper },
              { id: 'prestasi', label: 'Daftar Prestasi', icon: faTrophy }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSearchQuery('')
                    setError(null)
                    setIsMobileOpen(false) // Close drawer on mobile click
                  }}
                  title={collapsedMode ? tab.label : undefined}
                  className={`relative w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 ${
                    collapsedMode ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-[#8b0000] text-white shadow-[0_8px_20px_-5px_rgba(139,0,0,0.25)]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#8b0000]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-x-1/2 w-1 h-6 bg-yellow-400 rounded-r-full"></span>
                  )}
                  <FontAwesomeIcon icon={tab.icon} className="w-4 h-4 shrink-0" />
                  {!collapsedMode && <span>{tab.label}</span>}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Logout & Footer */}
        <div className="pt-6 border-t border-slate-100 mt-8 md:mt-12">
          <button
            onClick={handleLogout}
            title={collapsedMode ? "Keluar" : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider rounded-2xl text-white bg-slate-700 hover:bg-[#8b0000] transition-all duration-300 shadow-sm ${
              collapsedMode ? 'justify-center' : 'justify-center'
            }`}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="shrink-0" />
            {!collapsedMode && <span>Keluar</span>}
          </button>
        </div>
      </>
    )
  }

  return (
    <section className="bg-[#fff9f4] min-h-screen py-10 px-4 md:px-8 text-[#1f1414]">
      
      {/* MOBILE DRAWER BACKDROP */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#1f1414]/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* MOBILE FLOATING DRAWER (SIDEBAR) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#8b0000]/10 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="text-slate-400 hover:text-[#8b0000] p-1 bg-slate-100 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {renderSidebarContents(false)}
      </aside>

      <div className="mx-auto max-w-7xl flex gap-8 relative items-start">
        
        {/* DESKTOP COLLAPSIBLE SIDEBAR */}
        <aside 
          className={`hidden md:flex flex-col justify-between bg-white border border-[#8b0000]/10 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] shrink-0 transition-all duration-300 sticky top-24 ${
            isSidebarCollapsed ? 'w-24' : 'w-64'
          }`}
          style={{ minHeight: '500px' }}
        >
          {renderSidebarContents(isSidebarCollapsed)}
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 space-y-6 w-full min-w-0">
          
          {/* Header Action Banner with Toggle Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[2rem] border border-[#8b0000]/10 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Sidebar toggle button */}
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileOpen(prev => !prev);
                  } else {
                    setIsSidebarCollapsed(prev => !prev);
                  }
                }}
                className="p-3 bg-slate-100 hover:bg-[#8b0000]/10 text-slate-600 hover:text-[#8b0000] rounded-xl transition duration-300 focus:outline-none shrink-0"
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              
              <div className="truncate">
                <h1 className="text-xl sm:text-2xl font-black text-[#8b0000] truncate">Dashboard Admin</h1>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                  Mengelola data <span className="font-semibold text-[#8b0000] uppercase">{activeTab === 'pengurus' ? 'BPH & Pengurus' : activeTab === 'berita' ? 'Berita Terkini' : 'Daftar Prestasi'}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition focus:outline-none shadow-sm shadow-emerald-950/10 w-full sm:w-auto shrink-0"
            >
              <FontAwesomeIcon icon={faPlus} />
              Tambah Data
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

          {/* Table Container */}
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
