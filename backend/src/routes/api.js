import express from 'express'
import multer from 'multer'
import {
  getPengurus,
  createPengurus,
  updatePengurus,
  deletePengurus,
  getBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
  getPrestasi,
  createPrestasi,
  updatePrestasi,
  deletePrestasi,
  loginAdmin
} from '../controllers/apiController.js'
import { uploadImage } from '../controllers/uploadController.js'
import { authenticateToken } from '../middleware/auth.js'
import {
  validateIdParam,
  validateLogin,
  validatePengurus,
  validateBerita,
  validatePrestasi
} from '../middleware/validation.js'

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Format file tidak didukung. Harap hanya unggah file gambar (JPG, PNG, WEBP, dll).'), false)
    }
  }
})



// Authentication
router.post('/auth/login', validateLogin, loginAdmin)

// Public routes (Read-only)
router.get('/pengurus', getPengurus)
router.get('/berita', getBerita)
router.get('/berita/:id', validateIdParam, getBeritaById)
router.get('/prestasi', getPrestasi)

// Protected routes (Write access - Requires JWT token)
router.post('/upload', authenticateToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran file terlalu besar. Batas maksimal adalah 5MB.' : err.message
      })
    }
    next()
  })
}, uploadImage)

router.post('/pengurus', authenticateToken, validatePengurus, createPengurus)
router.put('/pengurus/:id', authenticateToken, validateIdParam, validatePengurus, updatePengurus)
router.delete('/pengurus/:id', authenticateToken, validateIdParam, deletePengurus)

router.post('/berita', authenticateToken, validateBerita, createBerita)
router.put('/berita/:id', authenticateToken, validateIdParam, validateBerita, updateBerita)
router.delete('/berita/:id', authenticateToken, validateIdParam, deleteBerita)

router.post('/prestasi', authenticateToken, validatePrestasi, createPrestasi)
router.put('/prestasi/:id', authenticateToken, validateIdParam, validatePrestasi, updatePrestasi)
router.delete('/prestasi/:id', authenticateToken, validateIdParam, deletePrestasi)

export default router

