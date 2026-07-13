import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/api'
import logoIkm from '../assets/logo-ikm.png'

// =========================================================================
// ADMIN LOGIN PAGE
// =========================================================================

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
    setError(null)

    // Custom validation — consistent with card UI instead of browser popup
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.')
      return
    }

    setLoading(true)

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
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">

        {/* Logo & Title */}
        <img
          src={logoIkm}
          alt="Logo IKM ITERA"
          className="w-20 h-24 object-contain"
        />
        <h1 className="text-black text-2xl font-bold font-['Poppins'] mt-2 text-center">
          Login Admin
        </h1>

        {/* Error Message */}
        {error && (
          <div className="w-full mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full mt-6 flex flex-col gap-4">

          {/* Username Field */}
          <div className="flex flex-col gap-1">
            <label className="text-black text-base font-normal font-['Poppins']">
              Username
            </label>
            <input
              type="text"
              placeholder="Masukkan username akun"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 px-3 bg-black/10 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/20 text-black font-['Poppins'] text-base placeholder:text-black/50"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-black text-base font-normal font-['Poppins']">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password akun"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 bg-black/10 rounded-md outline-none focus:ring-2 focus:ring-red-600 border border-black/20 text-black font-['Poppins'] text-base placeholder:text-black/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-red-600 hover:bg-red-700 transition-colors rounded-md text-white text-lg font-bold font-['Poppins'] flex justify-center items-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Memvalidasi...' : 'Login'}
          </button>

        </form>
      </div>
    </div>
  )
}
