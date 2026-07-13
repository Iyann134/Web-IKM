import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faNewspaper, faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import LoadingLogo from '../components/LoadingLogo'
import {
  fetchBerita,
  createBerita,
  updateBerita,
  deleteBerita,
  uploadImage
} from '../services/api'

export default function AdminBerita() {
  const navigate = useNavigate()
  const { isSidebarOpen, setIsSidebarOpen } = useOutletContext()
  const [token, setToken] = useState('')
  const [beritaList, setBeritaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal & Form States
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [beritaForm, setBeritaForm] = useState({ title: '', date: '', content: '', image: '' })
  
  // Upload States
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    if (!storedToken) {
      navigate('/admin/login')
    } else {
      setToken(storedToken)
      loadBerita()
    }
  }, [navigate])

  const loadBerita = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBerita()
      setBeritaList(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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

  const handleOpenAdd = () => {
    setEditMode(false)
    setCurrentId(null)
    setBeritaForm({ title: '', date: '', content: '', image: '' })
    setUploadError(null)
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setEditMode(true)
    setCurrentId(item.id)
    setBeritaForm({ title: item.title, date: item.date, content: item.content, image: item.image })
    setUploadError(null)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return

    try {
      await deleteBerita(token, id)
      setBeritaList(beritaList.filter(item => item.id !== id))
      showNotification('Berita berhasil dihapus.')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        const updated = await updateBerita(token, currentId, beritaForm)
        setBeritaList(beritaList.map(item => item.id === currentId ? updated : item))
        showNotification('Berita berhasil diperbarui.')
      } else {
        const created = await createBerita(token, beritaForm)
        setBeritaList([created, ...beritaList])
        showNotification('Berita baru berhasil dibuat.')
      }
      setShowModal(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredBerita = beritaList.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      <main className="w-full min-h-screen p-8 flex flex-col gap-6 transition-all duration-300">

      {/* Header Title Section */}
      <div className="flex items-center gap-4">
        
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-lg shadow-sm border border-slate-200 transition focus:outline-none cursor-pointer"
          title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white text-xl shrink-0">
          <FontAwesomeIcon icon={faNewspaper} />
        </div>
        <h1 className="text-3xl font-bold font-['Poppins'] text-black truncate">
          Berita Terkini
        </h1>
      </div>
      {/* Feedback Messages */}
        {successMsg && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3.5 text-sm font-medium text-green-700 shadow-sm transition">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-700 shadow-sm transition">
            {error}
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
          
          {/* Search Box */}
          <input
            type="text"
            placeholder="Cari judul berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 bg-black/5 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition border border-black/15 font-['Poppins'] placeholder:text-black/40"
          />

          {/* Add Action Button */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-md bg-green-500 hover:bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer font-['Poppins'] shadow-sm border border-black/10"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tambah Berita
          </button>
        </div>

        {/* Semantic Table Card */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <LoadingLogo message="Memuat berita..." />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-bold text-black tracking-wide font-['Poppins']">
                  <th className="py-3 px-4 w-32">Cover</th>
                  <th className="py-3 px-4 w-1/4">Judul</th>
                  <th className="py-3 px-4 w-40">Tanggal</th>
                  <th className="py-3 px-4">Isi Berita</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-['Poppins'] text-slate-800">
                {filteredBerita.length > 0 ? (
                  filteredBerita.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Cover Column */}
                      <td className="py-3 px-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/150x120?text=No+Cover'}
                          alt={item.title}
                          className="w-36 h-28 object-cover rounded-md border border-slate-100"
                        />
                      </td>

                      {/* Judul Column */}
                      <td className="py-3 px-4 font-medium text-black">
                        <div className="line-clamp-2" title={item.title}>
                          {item.title}
                        </div>
                      </td>

                      {/* Tanggal Column */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Isi Berita Column */}
                      <td className="py-3 px-4 text-slate-600 leading-relaxed">
                        <div className="line-clamp-2" title={item.content}>
                          {item.content}
                        </div>
                      </td>

                      {/* Aksi Column */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Ubah Berita"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                            title="Hapus Berita"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-slate-400 py-16 text-lg italic">
                      Tidak ada berita yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* ── MODAL DIALOG FORM ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1f1414]/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-xl border border-slate-200/80 shadow-2xl max-w-xl w-full p-8 overflow-hidden z-10 transform scale-100 transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold font-['Poppins'] text-black">
                {editMode ? 'Ubah Berita' : 'Tambah Berita Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5 font-['Poppins']">
              
              {/* Judul Berita */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-500 uppercase">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={beritaForm.title}
                  onChange={(e) => setBeritaForm({ ...beritaForm, title: e.target.value })}
                  placeholder="Masukkan judul berita utama"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition"
                />
              </div>

              {/* Tanggal Terbit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-500 uppercase">Tanggal Terbit</label>
                <input
                  type="date"
                  required
                  value={beritaForm.date}
                  onChange={(e) => setBeritaForm({ ...beritaForm, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition"
                />
              </div>

              {/* Gambar Sampul */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-500 uppercase">Gambar Sampul</label>
                
                {/* Image Preview inside Modal */}
                {beritaForm.image && (
                  <div className="mb-2 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-32 w-full max-w-sm">
                    <img src={beritaForm.image} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setBeritaForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 rounded-full bg-red-600 hover:bg-red-700 p-1.5 text-white text-xs transition cursor-pointer"
                      title="Hapus Gambar"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}

                {/* Upload Action Group */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={beritaForm.image}
                    onChange={(e) => setBeritaForm({ ...beritaForm, image: e.target.value })}
                    placeholder="Masukkan URL gambar atau gunakan tombol upload..."
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition"
                  />
                  <label className={`inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white cursor-pointer transition select-none ${uploading ? 'bg-slate-400' : 'bg-slate-700 hover:bg-slate-800'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    {uploading ? 'Proses...' : 'Upload'}
                  </label>
                </div>
                {uploadError && (
                  <p className="text-xs text-red-600 mt-1">Error upload: {uploadError}</p>
                )}
              </div>

              {/* Konten Lengkap */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-500 uppercase">Konten Lengkap</label>
                <textarea
                  required
                  rows="5"
                  value={beritaForm.content}
                  onChange={(e) => setBeritaForm({ ...beritaForm, content: e.target.value })}
                  placeholder="Tulis artikel berita secara detail di sini..."
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 hover:bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-500 hover:bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer shadow-sm"
                >
                  {editMode ? 'Simpan Perubahan' : 'Simpan Berita'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </>
  )
}
