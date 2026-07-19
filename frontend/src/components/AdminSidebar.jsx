import { NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper, faTrophy, faUsers, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import logoIkm from '../assets/logo-ikm.png'

// =========================================================================
// COLLAPSIBLE ADMIN SIDEBAR COMPONENT
// =========================================================================

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUsername')
      // Use navigate then force reload to fully clear React state
      navigate('/', { replace: true })
      // Force a page reload to clear all in-memory React state
      setTimeout(() => window.location.reload(), 50)
    }
  }

  return (
    <>
      {/* Mobile Overlay Background (when sidebar is open on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#1f1414]/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-black text-white flex flex-col justify-between py-5 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Upper Section */}
        <div className="w-full px-3 flex flex-col justify-start items-start gap-6 relative">
          
          {/* Mobile Close Button (X) — top right, visible only on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-2 right-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>

          {/* Sidebar Header Title */}
          <div className="self-stretch flex flex-col justify-start items-center gap-4">
            <div className="w-64 inline-flex justify-center items-center gap-3">
              <img className="w-20 h-24 object-contain" src={logoIkm} alt="Logo IKM" />
              <div className="justify-start text-white text-lg font-bold font-['Poppins']">
                Dashboard Admin
              </div>
            </div>
            {/* White Bottom Border */}
            <div className="self-stretch h-[1px] bg-white/80"></div>
          </div>

          {/* Navigation List */}
          <nav className="w-full flex flex-col gap-2 px-2 mt-2">
            
            {/* Menu: Berita Terkini */}
            <NavLink
              to="/admin/berita"
              onClick={() => {
                // Auto close sidebar on route change in mobile view
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={({ isActive }) =>
                `self-stretch inline-flex justify-start items-center gap-3 px-4 py-3 rounded-md transition-all font-['Poppins'] text-lg font-medium ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-current" />
              <span>Berita Terkini</span>
            </NavLink>

            {/* Menu: Prestasi */}
            <NavLink
              to="/admin/prestasi"
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={({ isActive }) =>
                `self-stretch inline-flex justify-start items-center gap-3 px-4 py-3 rounded-md transition-all font-['Poppins'] text-lg font-medium ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-current" />
              <span>Prestasi</span>
            </NavLink>

            {/* Menu: Pengurus */}
            <NavLink
              to="/admin/pengurus"
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={({ isActive }) =>
                `self-stretch inline-flex justify-start items-center gap-3 px-4 py-3 rounded-md transition-all font-['Poppins'] text-lg font-medium ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-current" />
              <span>Pengurus</span>
            </NavLink>

          </nav>
        </div>

        {/* Footer Section: Red Log out button */}
        <div className="px-4 w-full">
          <button
            onClick={handleLogout}
            className="w-full h-11 px-8 bg-red-600 hover:bg-red-700 transition-colors rounded-md inline-flex justify-center items-center gap-3 text-white text-lg font-semibold font-['Poppins'] cursor-pointer"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>

      </aside>
    </>
  )
}
