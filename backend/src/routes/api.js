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

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })


// Authentication
router.post('/auth/login', loginAdmin)

// Public routes (Read-only)
router.get('/pengurus', getPengurus)
router.get('/berita', getBerita)
router.get('/berita/:id', getBeritaById)
router.get('/prestasi', getPrestasi)

// Protected routes (Write access - Requires JWT token)
router.post('/upload', authenticateToken, upload.single('image'), uploadImage)

router.post('/pengurus', authenticateToken, createPengurus)
router.put('/pengurus/:id', authenticateToken, updatePengurus)
router.delete('/pengurus/:id', authenticateToken, deletePengurus)

router.post('/berita', authenticateToken, createBerita)
router.put('/berita/:id', authenticateToken, updateBerita)
router.delete('/berita/:id', authenticateToken, deleteBerita)

router.post('/prestasi', authenticateToken, createPrestasi)
router.put('/prestasi/:id', authenticateToken, updatePrestasi)
router.delete('/prestasi/:id', authenticateToken, deletePrestasi)

export default router

