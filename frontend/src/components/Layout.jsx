import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageTransition from './PageTransition'
import logoIkm from '../assets/logo-ikm.png'
import {
  faHome,
  faInfoCircle,
  faChevronDown,
  faUsers,
  faBars,
  faXmark,
  faLock,
  faSignInAlt,
  faNewspaper,
  faTrophy
} from '@fortawesome/free-solid-svg-icons'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('adminToken'))
    setMobileDropdownOpen(false)
  }, [location])


  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1414]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={logoIkm} alt="IKM ITERA Logo" className="h-12 w-12 object-contain rounded-full shadow-sm" />
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
              {/* Beranda */}
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium border-2 border-transparent transition ${
                    isActive
                      ? 'marawa-outline-active'
                      : 'text-slate-700 hover:text-[#8b0000] hover:bg-slate-100'
                  }`
                }
              >
                <FontAwesomeIcon icon={faHome} />
                Beranda
              </NavLink>

              {/* Tentang */}
              <NavLink
                to="/tentang"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium border-2 border-transparent transition ${
                    isActive
                      ? 'marawa-outline-active'
                      : 'text-slate-700 hover:text-[#8b0000] hover:bg-slate-100'
                  }`
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Tentang
              </NavLink>

              {/* Dropdown Informasi - Desktop */}
              <div className="relative group hidden md:block">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium border-2 border-transparent transition cursor-pointer ${
                    location.pathname.startsWith('/informasi')
                      ? 'marawa-outline-active'
                      : 'text-slate-700 hover:text-[#8b0000] hover:bg-slate-100'
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs transition-transform group-hover:rotate-180 duration-300" />
                  Informasi
                </button>
                <div className="absolute left-0 top-full mt-1 w-52 origin-top-left rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                  <NavLink
                    to="/informasi/berita"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#8b0000]/10 text-[#8b0000]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="w-4" />
                    Berita Terkini
                  </NavLink>
                  <NavLink
                    to="/informasi/prestasi"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#8b0000]/10 text-[#8b0000]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faTrophy} className="w-4" />
                    Prestasi Mahasiswa
                  </NavLink>
                </div>
              </div>

              {/* Dropdown Informasi - Mobile */}
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileDropdownOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-medium border-2 border-transparent transition ${
                    location.pathname.startsWith('/informasi')
                      ? 'marawa-outline-active'
                      : 'text-slate-700 hover:text-[#8b0000] hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FontAwesomeIcon icon={location.pathname.startsWith('/informasi') ? faNewspaper : faChevronDown} />
                    Informasi
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdownOpen && (
                  <div className="mt-1 pl-4 space-y-1">
                    <NavLink
                      to="/informasi/berita"
                      onClick={() => {
                        setMenuOpen(false)
                        setMobileDropdownOpen(false)
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#8b0000]/10 text-[#8b0000]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faNewspaper} className="w-4" />
                      Berita Terkini
                    </NavLink>
                    <NavLink
                      to="/informasi/prestasi"
                      onClick={() => {
                        setMenuOpen(false)
                        setMobileDropdownOpen(false)
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#8b0000]/10 text-[#8b0000]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faTrophy} className="w-4" />
                      Prestasi Mahasiswa
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Pengurus */}
              <NavLink
                to="/pengurus"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium border-2 border-transparent transition ${
                    isActive
                      ? 'marawa-outline-active'
                      : 'text-slate-700 hover:text-[#8b0000] hover:bg-slate-100'
                  }`
                }
              >
                <FontAwesomeIcon icon={faUsers} />
                Pengurus
              </NavLink>
              {isLoggedIn ? (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold border-2 transition ${
                      isActive
                        ? 'marawa-outline-active'
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
                    `inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold border-2 transition ${
                      isActive
                        ? 'marawa-outline-active'
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
