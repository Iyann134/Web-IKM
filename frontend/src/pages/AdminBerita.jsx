import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faNewspaper, faBars } from '@fortawesome/free-solid-svg-icons'
import LoadingLogo from '../components/LoadingLogo'
import {
  fetchBerita,
  createBerita,
  updateBerita,
  deleteBerita,
  uploadImage
} from '../services/api'
import { dummyBerita } from '../data/dummyBerita'

export default function AdminBerita() {
  const navigate = useNavigate()
  const { isSidebarOpen, setIsSidebarOpen } = useOutletContext()
  const [token] = useState(() => localStorage.getItem('adminToken') || '')
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
      return
    }

    const loadBerita = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchBerita()
        const list = Array.isArray(data) && data.length > 0 ? data : dummyBerita
        setBeritaList(list)
      } catch (err) {
        console.warn('Backend berita API offline or error, falling back to dummy data:', err.message)
        setBeritaList(dummyBerita)
      } finally {
        setLoading(false)
      }
    }

    loadBerita()
  }, [navigate])

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

      {/* ── MODAL DIALOG FORM (TAMBAH / UBAH BERITA) ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 animate-[fadeIn_0.2s_ease-out] flex flex-col gap-6">
            
            {/* Modal Title */}
            <h3 className="text-2xl font-bold font-['Poppins'] text-black text-left">
              {editMode ? 'Ubah Berita' : 'Tambah Berita Baru'}
            </h3>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-['Poppins']">
              
              {/* Judul Berita */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Judul Berita
                </label>
                <input
                  type="text"
                  required
                  value={beritaForm.title}
                  onChange={(e) => setBeritaForm({ ...beritaForm, title: e.target.value })}
                  placeholder="Masukkan Judul Berita"
                  className="w-full h-10 px-3 bg-gray-200/50 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/10 text-black font-['Poppins']"
                />
              </div>

              {/* Tanggal Berita */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Tanggal Berita
                </label>
                <input
                  type="date"
                  required
                  value={beritaForm.date}
                  onChange={(e) => setBeritaForm({ ...beritaForm, date: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-200/50 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/10 text-black font-['Poppins']"
                />
              </div>

              {/* Isi Berita */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Isi Berita
                </label>
                <textarea
                  required
                  rows="6"
                  value={beritaForm.content}
                  onChange={(e) => setBeritaForm({ ...beritaForm, content: e.target.value })}
                  placeholder="Masukkan Isi Berita"
                  className="w-full p-3 bg-gray-200/50 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/10 text-black font-['Poppins'] text-base resize-none"
                ></textarea>
              </div>

              {/* Cover File Upload Dropzone */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Cover
                </label>

                {/* Dropzone wrapper */}
                <label className="relative border-2 border-dashed border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors select-none">
                  
                  {/* Hidden inputs */}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />

                  {/* Inside Content */}
                  {uploading ? (
                    <div className="text-center font-['Poppins'] py-2 text-slate-500">
                      Mengunggah foto...
                    </div>
                  ) : beritaForm.image ? (
                    /* Preview current uploaded image */
                    <div className="w-full flex flex-col items-center gap-2">
                      <img
                        src={beritaForm.image}
                        alt="Cover Preview"
                        className="max-h-36 object-contain rounded-md border border-slate-200"
                      />
                      <span className="text-xs text-green-600 font-semibold">
                        Ganti Foto (Klik box)
                      </span>
                    </div>
                  ) : (
                    /* Default Dropzone Placeholders */
                    <div className="flex flex-col items-center text-center font-['Poppins'] text-black/70">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-10 h-10 text-black mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2v6h6M12 18v-6M9 15h6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-base font-semibold">Taruh Foto</span>
                      <span className="text-sm text-black/50 font-normal">(.JPG atau .PNG)</span>
                    </div>
                  )}
                </label>

                {uploadError && (
                  <p className="text-xs text-red-600 mt-1">Error upload: {uploadError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 border-t border-slate-100 pt-5">
                
                {/* Batal Button */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-md transition-colors cursor-pointer font-['Poppins'] shadow-sm"
                >
                  Batal
                </button>

                {/* Tambah / Simpan Button */}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-md transition-colors cursor-pointer font-['Poppins'] shadow-sm"
                >
                  {editMode ? 'Simpan' : 'Tambah'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </>
  )
}
