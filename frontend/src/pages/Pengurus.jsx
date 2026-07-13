import { useState } from 'react'
import { useEffect } from 'react'
import LoadingLogo from '../components/LoadingLogo'

// =========================================================================
// PENGURUS – STRUKTUR ORGANISASI PAGE
// Displays a single organizational chart image uploaded by the admin.
// On small screens, the image is horizontally scrollable to preserve readability.
// =========================================================================

// Fetch the org-chart image URL from the backend (or return null on error).
// When you have a real endpoint, replace this with your actual API call.
async function fetchStrukturOrg() {
  try {
    const res = await fetch(
      (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/pengurus/struktur'
    )
    if (!res.ok) throw new Error('not ok')
    const json = await res.json()
    return json?.data?.image_url || localStorage.getItem('strukturOrgUrl') || null
  } catch {
    return localStorage.getItem('strukturOrgUrl') || null
  }
}

export default function Pengurus() {
  const [strukturImg, setStrukturImg] = useState(undefined) // undefined = loading
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    fetchStrukturOrg().then((url) => {
      setStrukturImg(url) // null means "not uploaded yet"
    })
  }, [])

  const isLoading = strukturImg === undefined

  return (
    <section className="bg-orange-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-black text-center">
          Struktur Organisasi
        </h1>

        {/* White Image Card */}
        <div className="w-full bg-white rounded-xl shadow-md p-4 md:p-8">

          {isLoading ? (
            /* Loading State */
            <div className="flex items-center justify-center py-32">
              <LoadingLogo message="Memuat struktur organisasi..." />
            </div>

          ) : !strukturImg || imgError ? (
            /* Empty / Error State */
            <div className="text-center text-gray-500 py-32 text-xl font-medium font-['Poppins']">
              Struktur Organisasi belum diunggah.
            </div>

          ) : (
            /* Image — horizontally scrollable on small screens to prevent distortion */
            <div className="w-full overflow-x-auto">
              <img
                src={strukturImg}
                alt="Struktur Organisasi IKM ITERA"
                className="min-w-[800px] w-full max-w-full h-auto object-contain mx-auto"
                onError={() => setImgError(true)}
              />
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
