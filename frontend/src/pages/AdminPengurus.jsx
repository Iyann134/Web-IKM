import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faTrash, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import LoadingLogo from '../components/LoadingLogo'
import { uploadImage } from '../services/api'

// =========================================================================
// ADMIN PENGURUS (ORGANIZATIONAL CHART UPLOAD) PAGE
// =========================================================================

export default function AdminPengurus() {
  const navigate = useNavigate()
  const { isSidebarOpen, setIsSidebarOpen } = useOutletContext()
  const [token, setToken] = useState('')
  const [strukturImg, setStrukturImg] = useState(null) // null = not uploaded
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  // ── Retrieve Org Chart URL ──────────────────────────────────────────────
  const fetchStrukturOrg = async () => {
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/pengurus/struktur'
      )
      if (!res.ok) throw new Error('not ok')
      const json = await res.json()
      return json?.data?.image_url || null
    } catch {
      // LocalStorage fallback for local development preview
      return localStorage.getItem('strukturOrgUrl') || null
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    if (!storedToken) {
      navigate('/admin/login')
    } else {
      setToken(storedToken)
      loadStruktur()
    }
  }, [navigate])

  const loadStruktur = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = await fetchStrukturOrg()
      setStrukturImg(url)
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

  // ── Handle File Upload / Drop ───────────────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // Upload image via API
      const imageUrl = await uploadImage(token, file)
      
      // Update local state and localStorage fallback
      setStrukturImg(imageUrl)
      localStorage.setItem('strukturOrgUrl', imageUrl)

      // Try sending update to API endpoint if supported
      try {
        await fetch(
          (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/pengurus/struktur',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ image_url: imageUrl })
          }
        )
      } catch (err) {
        console.warn('Backend API update failed, saved in local state fallback:', err.message)
      }

      showNotification('Struktur Organisasi berhasil diunggah.')
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  // ── Handle Delete / Reset Chart ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!strukturImg) return
    if (!window.confirm('Apakah Anda yakin ingin menghapus struktur organisasi ini?')) return

    setLoading(true)
    try {
      // Remove from state & localStorage fallback
      setStrukturImg(null)
      localStorage.removeItem('strukturOrgUrl')

      // Call API delete if supported
      try {
        await fetch(
          (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/pengurus/struktur',
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
      } catch (err) {
        console.warn('Backend API delete failed:', err.message)
      }

      showNotification('Struktur Organisasi berhasil dihapus.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
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
          <FontAwesomeIcon icon={faUsers} />
        </div>
        <h1 className="text-3xl font-bold font-['Poppins'] text-black truncate">
          Pengurus
        </h1>
      </div>

      {/* Notifications */}
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

      {/* Main Content Card Container */}
      <div className="bg-white rounded-xl shadow-sm mt-6 p-6 md:p-8 flex flex-col">
        
        {/* Header Actions of the Card: Delete button aligned top-right */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDelete}
            disabled={!strukturImg || loading || uploading}
            className={`px-6 py-2.5 rounded-md flex items-center gap-2 font-bold font-['Poppins'] transition-all shadow-sm ${
              strukturImg
                ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FontAwesomeIcon icon={faTrash} />
            Hapus
          </button>
        </div>

        {/* Dropzone Upload Area */}
        {loading ? (
          <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
            <LoadingLogo message="Memuat Struktur..." />
          </div>
        ) : (
          <label className="w-full h-[500px] md:h-[600px] border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors select-none relative overflow-hidden bg-white shadow-inner">
            
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />

            {/* Uploading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
                <LoadingLogo message="Mengunggah Struktur Organisasi..." />
              </div>
            )}

            {/* Display current image preview, or dropzone placeholder */}
            {strukturImg ? (
              <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-3 relative group">
                <img
                  src={strukturImg}
                  alt="Struktur Organisasi"
                  className="w-full h-full object-contain"
                />
                {/* Click overlay feedback */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold font-['Poppins'] text-lg">
                  Klik untuk Ganti Foto
                </div>
              </div>
            ) : (
              /* Dropzone Placeholder content matching image_3830a2.png */
              <div className="flex flex-col items-center justify-center text-center font-['Poppins'] text-black/70">
                {/* Document-plus SVG file icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-16 h-16 text-black mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6M12 18v-6M9 15h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-lg font-bold">Taruh Foto</span>
                <span className="text-base text-black/55 font-semibold">(.JPG atau .PNG)</span>
              </div>
            )}

          </label>
        )}

      </div>

    </main>
  )
}
