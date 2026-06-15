const express = require('express')
const router = express.Router()
const { pengurus, berita, prestasi } = require('../data/mockDatabase')

router.get('/pengurus', (req, res) => {
  res.json({ success: true, data: pengurus })
})

router.get('/berita', (req, res) => {
  res.json({ success: true, data: berita })
})

router.get('/prestasi', (req, res) => {
  res.json({ success: true, data: prestasi })
})

module.exports = router
