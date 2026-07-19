import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

if (!process.env.JWT_SECRET) {
  console.error('CRITICAL ERROR: Missing essential environment variable (JWT_SECRET).')
  process.exit(1)
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token autentikasi tidak ditemukan.' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Akses ditolak: Token tidak valid atau kedaluwarsa.' })
    }
    req.user = user
    next()
  })
}
