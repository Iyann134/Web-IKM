import { Link, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faInfoCircle, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-minang text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">IKM ITERA</h1>
            <p className="text-sm uppercase tracking-widest">Ikatan Keluarga Minangkabau</p>
          </div>

          <nav className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
              <FontAwesomeIcon icon={faHome} /> Beranda
            </Link>
            <Link to="/tentang" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
              <FontAwesomeIcon icon={faInfoCircle} /> Tentang
            </Link>
            <Link to="/portal" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
              <FontAwesomeIcon icon={faChartLine} /> Portal
            </Link>
            <Link to="/pengurus" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
              <FontAwesomeIcon icon={faUsers} /> Pengurus
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} IKM ITERA. Semua hak cipta dilindungi.</p>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-red-500" />
            <span>Minangkabau culture inspired</span>
          </div>
        </div>
      </footer>
    </div>
  )
}