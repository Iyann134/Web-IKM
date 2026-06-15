import { pengurus, berita, prestasi } from '../data/mockDB.js'

export const getPengurus = (req, res) => {
  res.json({ success: true, data: pengurus })
}

export const getBerita = (req, res) => {
  res.json({ success: true, data: berita })
}

export const getPrestasi = (req, res) => {
  res.json({ success: true, data: prestasi })
}
