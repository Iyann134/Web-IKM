import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { loginAdmin } from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    const token = localStorage.getItem('adminToken')
    if (token) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await loginAdmin(username, password)
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUsername', data.admin.username)
        navigate('/admin/dashboard')
      } else {
        setError('Login gagal. Silakan coba lagi.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#fff9f4] min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-[#8b0000]/10 p-8 md:p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] relative overflow-hidden">
        
        {/* Ticker / Banner Motif top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-marawa-gradient"></div>

        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-marawa-gradient text-lg font-bold text-white mb-4">
            I
          </span>
          <h1 className="text-2xl font-bold text-[#8b0000]">Login Administrator</h1>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Web Portal IKM ITERA</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] pl-10 pr-5 py-3.5 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-2xl border border-slate-200 bg-[#fffbf9] pl-10 pr-5 py-3.5 text-sm focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#8b0000] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b11919] shadow-md shadow-red-900/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memvalidasi...' : 'Masuk ke Dasbor'}
          </button>
        </form>
      </div>
    </section>
  )
}
