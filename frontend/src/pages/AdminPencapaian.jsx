import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faTrophy, faBars } from '@fortawesome/free-solid-svg-icons'
import LoadingLogo from '../components/LoadingLogo'
import { dummyPrestasi } from '../data/dummyPrestasi'
import {
  fetchPrestasi,
  createPrestasi,
  updatePrestasi,
  deletePrestasi,
  uploadImage
} from '../services/api'

// =========================================================================
// ADMIN PENCAPAIAN (ACHIEVEMENTS) PAGE
// =========================================================================

export default function AdminPencapaian() {
  const navigate = useNavigate()
  const { isSidebarOpen, setIsSidebarOpen } = useOutletContext()
  const [token] = useState(() => localStorage.getItem('adminToken') || '')
  const [prestasiList, setPrestasiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal & Form States
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [prestasiForm, setPrestasiForm] = useState({ title: '', date: '', description: '', image: '' })

  // Upload States
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    if (!storedToken) {
      navigate('/admin/login')
      return
    }

    const loadPrestasi = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPrestasi()
        if (data && data.length > 0) {
          setPrestasiList(data)
        } else {
          setPrestasiList(dummyPrestasi)
        }
      } catch (err) {
        console.warn('Backend prestasi API offline or error, falling back to dummy data:', err.message)
        setPrestasiList(dummyPrestasi)
      } finally {
        setLoading(false)
      }
    }

    loadPrestasi()
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
      setPrestasiForm(prev => ({ ...prev, image: imageUrl }))
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
    setPrestasiForm({ title: '', date: '', description: '', image: '' })
    setUploadError(null)
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setEditMode(true)
    setCurrentId(item.id)
    
    // Map item dates or years to input date format yyyy-mm-dd
    let formattedDate = ''
    if (item.date) {
      // If it looks like a full date or year
      if (item.date.includes('-')) {
        formattedDate = item.date
      } else {
        // e.g. "7 Juli 2026" or just a year, fallback or try parsing
        formattedDate = ''
      }
    } else if (item.year) {
      formattedDate = `${item.year}-01-01`
    }

    setPrestasiForm({
      title: item.achievementName || item.title || '',
      date: formattedDate,
      description: item.eventName || item.description || '',
      image: item.image || ''
    })
    setUploadError(null)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return

    try {
      // Attempt backend delete if it's not a purely local dummy item (e.g. string uuid or numeric)
      await deletePrestasi(token, id)
      setPrestasiList(prestasiList.filter(item => item.id !== id))
      showNotification('Prestasi berhasil dihapus.')
    } catch {
      // Fallback for purely local items
      setPrestasiList(prestasiList.filter(item => item.id !== id))
      showNotification('Prestasi berhasil dihapus dari tampilan lokal.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Determine the year to send to the backend
    let yearValue = new Date().getFullYear()
    if (prestasiForm.date) {
      yearValue = new Date(prestasiForm.date).getFullYear()
    }

    const payload = {
      title: prestasiForm.title,
      year: yearValue,
      description: prestasiForm.description,
      image: prestasiForm.image
    }

    try {
      if (editMode) {
        // Update
        try {
          await updatePrestasi(token, currentId, payload)
          setPrestasiList(prestasiList.map(item => item.id === currentId ? {
            ...item,
            achievementName: prestasiForm.title,
            title: prestasiForm.title,
            date: prestasiForm.date || item.date,
            year: yearValue,
            eventName: prestasiForm.description,
            description: prestasiForm.description,
            image: prestasiForm.image || item.image
          } : item))
        } catch {
          // Local fallback
          setPrestasiList(prestasiList.map(item => item.id === currentId ? {
            ...item,
            achievementName: prestasiForm.title,
            title: prestasiForm.title,
            date: prestasiForm.date || item.date,
            year: yearValue,
            eventName: prestasiForm.description,
            description: prestasiForm.description,
            image: prestasiForm.image || item.image
          } : item))
        }
        showNotification('Prestasi berhasil diperbarui.')
      } else {
        // Create
        try {
          const created = await createPrestasi(token, payload)
          // Add mapped fields for local frontend rendering
          const newLocalItem = {
            ...created,
            achievementName: created.title,
            eventName: created.description,
            date: prestasiForm.date || `${created.year}-01-01`,
            image: prestasiForm.image
          }
          setPrestasiList([newLocalItem, ...prestasiList])
        } catch {
          // Local fallback
          const newLocalItem = {
            id: Date.now(),
            achievementName: prestasiForm.title,
            title: prestasiForm.title,
            date: prestasiForm.date || `${yearValue}-01-01`,
            year: yearValue,
            eventName: prestasiForm.description,
            description: prestasiForm.description,
            image: prestasiForm.image || 'https://via.placeholder.com/150x120?text=No+Cover'
          }
          setPrestasiList([newLocalItem, ...prestasiList])
        }
        showNotification('Prestasi baru berhasil ditambahkan.')
      }
      setShowModal(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredPrestasi = prestasiList.filter(item => {
    const titleText = item.achievementName || item.title || ''
    const descText = item.eventName || item.description || ''
    return (
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descText.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

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
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-black truncate">
            Pencapaian
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
            placeholder="Cari nama prestasi..."
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
            Tambah Prestasi
          </button>
        </div>

        {/* Semantic Table Card */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <LoadingLogo message="Memuat pencapaian..." />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-bold text-black tracking-wide font-['Poppins']">
                  <th className="py-3 px-4 w-32">Cover</th>
                  <th className="py-3 px-4 w-1/4">Judul</th>
                  <th className="py-3 px-4 w-40">Tanggal</th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-['Poppins'] text-slate-800">
                {filteredPrestasi.length > 0 ? (
                  filteredPrestasi.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Cover Column */}
                      <td className="py-3 px-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/150x120?text=No+Cover'}
                          alt={item.achievementName || item.title}
                          className="w-36 h-28 object-cover rounded-md border border-slate-100"
                        />
                      </td>

                      {/* Judul Column */}
                      <td className="py-3 px-4 font-medium text-black">
                        <div className="line-clamp-2" title={item.achievementName || item.title}>
                          {item.achievementName || item.title}
                        </div>
                      </td>

                      {/* Tanggal Column */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {item.date || item.year}
                      </td>

                      {/* Deskripsi Column */}
                      <td className="py-3 px-4 text-slate-600 leading-relaxed">
                        <div className="line-clamp-2" title={item.eventName || item.description}>
                          {item.eventName || item.description}
                        </div>
                      </td>

                      {/* Aksi Column */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Ubah Prestasi"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                            title="Hapus Prestasi"
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
                      Tidak ada prestasi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* ── MODAL DIALOG FORM (TAMBAH / UBAH PENCAPAIAN) ── */}
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
              {editMode ? 'Ubah Pencapaian' : 'Tambah Pencapaian Baru'}
            </h3>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-['Poppins']">
              
              {/* Judul Pencapaian */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Judul Pencapaian
                </label>
                <input
                  type="text"
                  required
                  value={prestasiForm.title}
                  onChange={(e) => setPrestasiForm({ ...prestasiForm, title: e.target.value })}
                  placeholder="Masukkan Judul Pencapaian"
                  className="w-full h-10 px-3 bg-gray-200/50 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/10 text-black font-['Poppins']"
                />
              </div>

              {/* Tanggal Pencapaian */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Tanggal Pencapaian
                </label>
                <input
                  type="date"
                  required
                  value={prestasiForm.date}
                  onChange={(e) => setPrestasiForm({ ...prestasiForm, date: e.target.value })}
                  className="w-full h-10 px-3 bg-gray-200/50 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/10 text-black font-['Poppins']"
                />
              </div>

              {/* Deskripsi Pencapaian */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-base font-semibold font-['Poppins']">
                  Deskripsi Pencapaian
                </label>
                <textarea
                  required
                  rows="4"
                  value={prestasiForm.description}
                  onChange={(e) => setPrestasiForm({ ...prestasiForm, description: e.target.value })}
                  placeholder="Masukkan Deskripsi Pencapaian"
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
                  ) : prestasiForm.image ? (
                    /* Preview current uploaded image */
                    <div className="w-full flex flex-col items-center gap-2">
                      <img
                        src={prestasiForm.image}
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
