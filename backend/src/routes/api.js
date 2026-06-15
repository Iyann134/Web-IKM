import express from 'express'
import { getPengurus, getBerita, getPrestasi } from '../controllers/apiController.js'

const router = express.Router()

router.get('/pengurus', getPengurus)
router.get('/berita', getBerita)
router.get('/prestasi', getPrestasi)

export default router
