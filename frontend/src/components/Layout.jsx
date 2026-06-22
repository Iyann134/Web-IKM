import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageTransition from './PageTransition'
import {
  faHome,
  faInfoCircle,
  faChartLine,
  faUsers,
  faBars,
  faXmark,
  faLock,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons'

const navItems = [
  { to: '/', label: 'Beranda', icon: faHome },
  { to: '/tentang', label: 'Tentang', icon: faInfoCircle },
  { to: '/portal', label: 'Portal', icon: faChartLine },
  { to: '/pengurus', label: 'Pengurus', icon: faUsers }
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('adminToken'))
  }, [location])


  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1414]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-marawa-gradient text-lg font-bold text-white">
              I
            </span>
            <div>
              <p className="text-lg font-semibold text-[#8b0000]">IKM ITERA</p>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Ikatan Keluarga Minangkabau</p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 md:hidden"
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>

          <nav
            className={`${
              menuOpen ? 'block' : 'hidden'
            } absolute inset-x-4 top-full mt-2 rounded-3xl border border-slate-200 bg-white/95 px-4 py-5 shadow-xl shadow-slate-200/30 backdrop-blur-md md:static md:block md:mt-0 md:px-0 md:py-0 md:border-0 md:bg-transparent md:shadow-none`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-marawa-gradient text-white shadow-lg shadow-red-200/30'
                        : 'text-slate-700 hover:text-[#8b0000] hover:bg-slate-100'
                    }`
                  }
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {item.label}
                </NavLink>
              ))}
              {isLoggedIn ? (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold border transition ${
                      isActive
                        ? 'bg-marawa-gradient text-white border-transparent'
                        : 'border-[#8b0000]/20 text-[#8b0000] hover:bg-[#8b0000] hover:text-white hover:border-transparent'
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faLock} />
                  Dashboard Admin
                </NavLink>
              ) : (
                <NavLink
                  to="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold border transition ${
                      isActive
                        ? 'bg-marawa-gradient text-white border-transparent'
                        : 'border-[#8b0000]/20 text-[#8b0000] hover:bg-[#8b0000] hover:text-white hover:border-transparent'
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Login Admin
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-[#fff8f5] py-8">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <footer className="border-t border-slate-200 bg-[#1f1414] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">IKM ITERA</p>
            <p className="mt-2 text-xs text-slate-300">Menjaga tradisi, membangun masa depan.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} IKM ITERA. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <NavLink to="/admin/login" className="hover:text-white transition font-medium">
              Portal Admin
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  )
}
