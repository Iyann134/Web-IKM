import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageTransition from './PageTransition'
import logoIkm from '../assets/logo-ikm.png'
import {
  faChevronDown,
  faBars,
  faXmark,
  faUsers
} from '@fortawesome/free-solid-svg-icons'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [mobileTentangOpen, setMobileTentangOpen] = useState(false)
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('adminToken'))
    setMobileDropdownOpen(false)
    setMobileTentangOpen(false)
    setMenuOpen(false)
  }, [location])

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1414] flex flex-col font-['Poppins']">
      
      {/* ========================================================================= */}
      {/* HEADER / NAVIGATION                                                       */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12 h-24">
          
          {/* Logo & Branding */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <img src={logoIkm} alt="IKM ITERA Logo" className="h-16 w-16 object-contain" />
            <div className="text-black text-[28px] font-extrabold font-['Poppins'] tracking-tight select-none">
              IKM - ITERA
            </div>
          </NavLink>

          {/* Navigation Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            
            {/* Beranda */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `py-1.5 text-[18px] font-semibold tracking-wide font-['Poppins'] transition-colors ${
                  isActive ? 'text-[#8b0000] border-b-2 border-[#8b0000]' : 'text-black/85 hover:text-[#8b0000]'
                }`
              }
            >
              Beranda
            </NavLink>

            {/* Dropdown Tentang */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1.5 py-1.5 text-[18px] font-semibold tracking-wide font-['Poppins'] transition-colors cursor-pointer ${
                  location.pathname.startsWith('/tentang') ? 'text-[#8b0000] border-b-2 border-[#8b0000]' : 'text-black/85 hover:text-[#8b0000]'
                }`}
              >
                <span>Tentang</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-black/50 transition-transform group-hover:rotate-180 duration-300" />
              </button>
              
              {/* Dropdown Menu Overlay */}
              <div className="absolute left-0 top-full mt-1 w-52 origin-top-left rounded-xl border border-slate-200/80 bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                <NavLink
                  to="/tentang/latar-belakang"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-[16px] font-semibold transition ${
                      isActive && location.pathname === '/tentang/latar-belakang'
                        ? 'bg-[#8b0000]/10 text-[#8b0000]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                    }`
                  }
                >
                  Latar Belakang
                </NavLink>
                <NavLink
                  to="/tentang/visi-misi"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-[16px] font-semibold transition ${
                      isActive && location.pathname === '/tentang/visi-misi'
                        ? 'bg-[#8b0000]/10 text-[#8b0000]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                    }`
                  }
                >
                  Visi &amp; Misi
                </NavLink>
                <NavLink
                  to="/tentang/makna-logo"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-[16px] font-semibold transition ${
                      isActive && location.pathname === '/tentang/makna-logo'
                        ? 'bg-[#8b0000]/10 text-[#8b0000]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                    }`
                  }
                >
                  Makna Logo
                </NavLink>
              </div>
            </div>

            {/* Dropdown Berita */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1.5 py-1.5 text-[18px] font-semibold tracking-wide font-['Poppins'] transition-colors cursor-pointer ${
                  location.pathname.startsWith('/informasi') ? 'text-[#8b0000] border-b-2 border-[#8b0000]' : 'text-black/85 hover:text-[#8b0000]'
                }`}
              >
                <span>Berita</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-black/50 transition-transform group-hover:rotate-180 duration-300" />
              </button>
              
              {/* Dropdown Menu Overlay */}
              <div className="absolute left-0 top-full mt-1 w-52 origin-top-left rounded-xl border border-slate-200/80 bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                <NavLink
                  to="/informasi/berita"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-[16px] font-semibold transition ${
                      isActive
                        ? 'bg-[#8b0000]/10 text-[#8b0000]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                    }`
                  }
                >
                  Berita Terkini
                </NavLink>
                <NavLink
                  to="/informasi/prestasi"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-[16px] font-semibold transition ${
                      isActive
                        ? 'bg-[#8b0000]/10 text-[#8b0000]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#8b0000]'
                    }`
                  }
                >
                  Prestasi Mahasiswa
                </NavLink>
              </div>
            </div>

            {/* Pengurus */}
            <NavLink
              to="/pengurus"
              className={({ isActive }) =>
                `py-1.5 text-[18px] font-semibold tracking-wide font-['Poppins'] transition-colors ${
                  isActive ? 'text-[#8b0000] border-b-2 border-[#8b0000]' : 'text-black/85 hover:text-[#8b0000]'
                }`
              }
            >
              Pengurus
            </NavLink>

            {/* Portal Admin / Login Action */}
            {isLoggedIn ? (
              <NavLink
                to="/admin/dashboard"
                className="px-6 py-2.5 bg-red-600 hover:bg-[#d82222] text-white text-[18px] font-semibold rounded-xl border border-black/10 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Login
              </NavLink>
            ) : (
              <NavLink
                to="/admin/login"
                className="px-6 py-2.5 bg-red-600 hover:bg-[#d82222] text-white text-[18px] font-semibold rounded-xl border border-black/10 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Login
              </NavLink>
            )}

          </nav>

          {/* Hamburger menu trigger (Mobile only) */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300"
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>

        </div>

        {/* Navigation Menu Overlay (Mobile only) */}
        {menuOpen && (
          <div className="absolute inset-x-4 top-full mt-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-5 shadow-xl backdrop-blur-md z-50 md:hidden">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/"
                className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-semibold text-slate-800 hover:text-[#8b0000]"
              >
                Beranda
              </NavLink>
              {/* Tentang Mobile Dropdown */}
              <div className="border-t border-slate-100/50 pt-1">
                <button
                  type="button"
                  onClick={() => setMobileTentangOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-semibold text-slate-800 hover:text-[#8b0000] cursor-pointer"
                >
                  <span>Tentang</span>
                  <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-300 ${mobileTentangOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileTentangOpen && (
                  <div className="pl-4 space-y-1">
                    <NavLink
                      to="/tentang/latar-belakang"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-[#8b0000]"
                    >
                      Latar Belakang
                    </NavLink>
                    <NavLink
                      to="/tentang/visi-misi"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-[#8b0000]"
                    >
                      Visi &amp; Misi
                    </NavLink>
                    <NavLink
                      to="/tentang/makna-logo"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-[#8b0000]"
                    >
                      Makna Logo
                    </NavLink>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-semibold text-slate-800 hover:text-[#8b0000]"
              >
                <span>Berita</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileDropdownOpen && (
                <div className="pl-4 space-y-1">
                  <NavLink
                    to="/informasi/berita"
                    className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-[#8b0000]"
                  >
                    Berita Terkini
                  </NavLink>
                  <NavLink
                    to="/informasi/prestasi"
                    className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-[#8b0000]"
                  >
                    Prestasi Mahasiswa
                  </NavLink>
                </div>
              )}

              <NavLink
                to="/pengurus"
                className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-semibold text-slate-800 hover:text-[#8b0000]"
              >
                Pengurus
              </NavLink>

              <div className="border-t border-slate-100 my-2 pt-2">
                {isLoggedIn ? (
                  <NavLink
                    to="/admin/dashboard"
                    className="flex justify-center items-center gap-2 w-full px-4 py-3 bg-red-600 text-white text-base font-semibold rounded-xl shadow-sm"
                  >
                    <FontAwesomeIcon icon={faLock} />
                    Dashboard Admin
                  </NavLink>
                ) : (
                  <NavLink
                    to="/admin/login"
                    className="flex justify-center items-center gap-2 w-full px-4 py-3 bg-red-600 text-white text-base font-semibold rounded-xl shadow-sm"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} />
                    Login Portal
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}

      </header>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT ELEMENT                                                     */}
      {/* ========================================================================= */}
      <main className="flex-1">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER SECTION                                                            */}
      {/* ========================================================================= */}
      <footer className="bg-stone-950 text-white font-['Poppins'] pt-16 pb-8 border-t border-white/5 relative z-10">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 flex flex-col gap-12">
          
          {/* Main Footer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-start">
            
            {/* Column 1: Logo & Summary */}
            <div className="flex flex-col space-y-4 col-span-1">
              <img className="w-28 h-28 object-contain" src={logoIkm} alt="Logo IKM" />
              <div className="space-y-2">
                <div className="text-white text-[28px] font-bold">IKM - ITERA</div>
                <div className="text-white/60 text-[16px] font-normal leading-relaxed">
                  Ikatan Keluarga Minangkabau ITERA adalah wadah pemersatu, sarana pengembangan minat bakat, serta pelestarian adat Ranah Minang di Institut Teknologi Sumatera.
                </div>
              </div>
            </div>

            {/* Column 2: Navigation Links (Divided inside a single Column) */}
            <div className="flex flex-col space-y-4 col-span-1">
              <div className="text-white text-[20px] font-bold">Navigasi</div>
              <div className="flex gap-10">
                <div className="flex flex-col space-y-2 text-white text-[15px]">
                  <NavLink to="/" className="text-white/60 hover:text-white transition font-normal">Beranda</NavLink>
                  <NavLink to="/tentang" className="text-white hover:text-white transition font-semibold">Tentang Kami</NavLink>
                  <NavLink to="/tentang/latar-belakang" className="text-white/60 hover:text-white transition font-normal pl-2">Latar Belakang</NavLink>
                  <NavLink to="/tentang/visi-misi" className="text-white/60 hover:text-white transition font-normal pl-2">Visi &amp; Misi</NavLink>
                  <NavLink to="/tentang/makna-logo" className="text-white/60 hover:text-white transition font-normal pl-2">Makna Logo</NavLink>
                </div>
                <div className="flex flex-col space-y-2 text-white text-[15px]">
                  <NavLink to="/informasi/berita" className="text-white hover:text-white transition font-semibold">Berita</NavLink>
                  <NavLink to="/informasi/berita" className="text-white/60 hover:text-white transition font-normal pl-2">Berita Terkini</NavLink>
                  <NavLink to="/informasi/prestasi" className="text-white/60 hover:text-white transition font-normal pl-2">Pencapaian</NavLink>
                  <NavLink to="/pengurus" className="text-white/60 hover:text-white transition font-normal mt-2">Pengurus</NavLink>
                  <Link to="/developer" className="cursor-pointer hover:text-red-500 transition-colors text-white font-bold">Developer</Link>
                </div>
              </div>
            </div>

            {/* Column 3: Sosial Media */}
            <div className="flex flex-col space-y-4 col-span-1">
              <div className="text-white text-[20px] font-semibold">Sosial Media</div>
              <div className="flex items-center gap-3">
                {/* Instagram SVG */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
                  <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="12" fill="#1e1818"/>
                    <path d="M25 14c3.58 0 4.01.01 5.43.08 1.31.06 2.02.28 2.5.46 0 .39.73 1.13 1.12 1.52.18.47.4 1.19.46 2.5.07 1.41.08 1.84.08 5.43s-.01 4.01-.08 5.43c-.06 1.31-.28 2.02-.46 2.5a4.01 4.01 0 0 1-2.64 2.64c-.47.18-1.19.4-2.5.46-1.41.07-1.84.08-5.43.08s-4.01-.01-5.43-.08c-1.31-.06-2.02-.28-2.5-.46a4.01 4.01 0 0 1-2.64-2.64c-.18-.47-.4-1.19-.46-2.5C14.01 29 14 28.58 14 25s.01-4.01.08-5.43c.06-1.31.28-2.02.46-2.5a4.01 4.01 0 0 1 2.64-2.64c.47-.18 1.19-.4 2.5-.46 1.41-.07 1.84-.08 5.43-.08zm0-2c-3.64 0-4.1.02-5.53.08-1.43.07-2.4.29-3.26.63a6.01 6.01 0 0 0-4.32 4.32c-.34.85-.56 1.83-.63 3.26C11.02 20.9 11 21.36 11 25s.02 4.1.08 5.53c.07 1.43.29 2.4.63 3.26a6.01 6.01 0 0 0 4.32 4.32c.85.34 1.83.56 3.26.63 1.43.06 1.89.08 5.53.08s4.1-.02 5.53-.08c1.43-.07 2.4-.29 3.26-.63a6.01 6.01 0 0 0 4.32-4.32c.34-.85.56-1.83.63-3.26.06-1.43.08-1.89.08-5.53s-.02-4.1-.08-5.53c-.07-1.43-.29-2.4-.63-3.26a6.01 6.01 0 0 0-4.32-4.32c-.85-.34-1.83-.56-3.26-.63-1.43-.06-1.89-.08-5.53-.08z" fill="white"/>
                    <path d="M25 18a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm7.5-12.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0z" fill="white"/>
                  </svg>
                </a>
                {/* YouTube SVG */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
                  <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="12" fill="#1e1818"/>
                    <path d="M37.6 17.1c-.4-1.5-1.6-2.7-3.1-3.1C31.8 13.3 25 13.3 25 13.3s-6.8 0-9.5.7c-1.5.4-2.7 1.6-3.1 3.1C11.7 19.8 11.7 25 11.7 25s0 5.2.7 7.9c.4 1.5 1.6 2.7 3.1 3.1 2.7.7 9.5.7 9.5.7s6.8 0 9.5-.7c1.5-.4 2.7-1.6 3.1-3.1.7-2.7.7-7.9.7-7.9s0-5.2-.7-7.9zM21.7 29.2V20.8l7.3 4.2-7.3 4.2z" fill="white"/>
                  </svg>
                </a>
                {/* TikTok SVG */}
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
                  <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="12" fill="#1e1818"/>
                    <path d="M32.5 21a5.6 5.6 0 0 1-3.5-1.2v7.7c0 4.1-3.4 7.5-7.5 7.5a7.5 7.5 0 0 1-7.5-7.5c0-4.1 3.4-7.5 7.5-7.5 1 0 1.9.2 2.7.6v2.9a4.6 4.6 0 0 0-2.7-.9 4.6 4.6 0 0 0-4.6 4.6 4.6 4.6 0 0 0 4.6 4.6c2.5 0 4.6-2.1 4.6-4.6v-14h2.9c.2 1.7 1.6 3 3.3 3.2V21z" fill="white"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 4: Contact Details */}
            <div className="flex flex-col space-y-4 col-span-1">
              <div className="space-y-1">
                <div className="text-white text-[20px] font-semibold">Lokasi</div>
                <div className="text-white/60 text-[15px] leading-relaxed">
                  Jl. Terusan Ryacudu, Way Hui, Kec. Jati Agung, Kabupaten Lampung Selatan, Lampung 35365
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-white text-[20px] font-semibold">Email</div>
                <div className="text-white/60 text-[15px] leading-relaxed">
                  ikatanminangitera@gmail.com
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row Divider & Copyrights */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/50">
            <div>
              © 2026 Ikatan Keluarga Minangkabau ITERA. All rights reserved.
            </div>
            <div>
              <span>Designed &amp; Developed by </span>
              <Link to="/developer" className="text-white font-bold cursor-pointer hover:text-red-500 hover:underline transition-all duration-300">Gian Ivander</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
