import { supabase } from '../data/supabase.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// --- AUTHENTICATION ---

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' })
    }

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (error) throw error

    if (!user) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' })
    }

    // Compare password hash
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' })
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'ikm_itera_secret_token_key_2026',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      admin: {
        username: user.username
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada login.', error: error.message })
  }
}

// --- PENGURUS CRUD ---

export const getPengurus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengurus')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengurus', error: error.message })
  }
}

export const createPengurus = async (req, res) => {
  try {
    const { role, name, description } = req.body
    const { data, error } = await supabase
      .from('pengurus')
      .insert([{ role, name, description }])
      .select()

    if (error) throw error
    res.status(201).json({ success: true, message: 'Pengurus berhasil ditambahkan', data: data[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan pengurus', error: error.message })
  }
}

export const updatePengurus = async (req, res) => {
  try {
    const { id } = req.params
    const { role, name, description } = req.body
    const { data, error } = await supabase
      .from('pengurus')
      .update({ role, name, description })
      .eq('id', parseInt(id))
      .select()

    if (error) throw error
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'Data pengurus tidak ditemukan' })
    }
    res.json({ success: true, message: 'Pengurus berhasil diperbarui', data: data[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengurus', error: error.message })
  }
}

export const deletePengurus = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('pengurus')
      .delete()
      .eq('id', parseInt(id))
      .select()

    if (error) throw error
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'Data pengurus tidak ditemukan' })
    }
    res.json({ success: true, message: 'Pengurus berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pengurus', error: error.message })
  }
}

// --- BERITA CRUD ---

export const getBerita = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data berita', error: error.message })
  }
}

export const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('id', parseInt(id))
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' })
    }
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail berita', error: error.message })
  }
}

export const createBerita = async (req, res) => {
  try {
    const { title, date, content, image } = req.body
    const { data, error } = await supabase
      .from('berita')
      .insert([{ title, date, content, image }])
      .select()

    if (error) throw error
    res.status(201).json({ success: true, message: 'Berita berhasil dibuat', data: data[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat berita', error: error.message })
  }
}

export const updateBerita = async (req, res) => {
  try {
    const { id } = req.params
    const { title, date, content, image } = req.body
    const { data, error } = await supabase
      .from('berita')
      .update({ title, date, content, image })
      .eq('id', parseInt(id))
      .select()

    if (error) throw error
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' })
    }
    res.json({ success: true, message: 'Berita berhasil diperbarui', data: data[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui berita', error: error.message })
  }
}

export const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('berita')
      .delete()
      .eq('id', parseInt(id))
      .select()

    if (error) throw error
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' })
    }
    res.json({ success: true, message: 'Berita berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus berita', error: error.message })
  }
}

// --- PRESTASI CRUD ---

export const getPrestasi = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prestasi')
      .select('*')
      .order('year', { ascending: false })

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data prestasi', error: error.message })
  }
}

export const createPrestasi = async (req, res) => {
  try {
    const { title, year, description } = req.body
    const { data, error } = await supabase
      .from('prestasi')
      .insert([{ title, year: parseInt(year), description }])
      .select()

    if (error) throw error
    res.status(201).json({ success: true, message: 'Prestasi berhasil ditambahkan', data: data[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan prestasi', error: error.message })
  }
}

export const updatePrestasi = async (req, res) => {
  try {
    const { id } = req.params
    const { title, year, description } = req.body
    const { data, error } = await supabase
      .from('prestasi')
      .update({ title, year: parseInt(year), description })
      .eq('id', parseInt(id))
      .select()

    if (error) throw error
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'Data prestasi tidak ditemukan' })
    }
    res.json({ success: true, message: 'Prestasi berhasil diperbarui', data: data[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui prestasi', error: error.message })
  }
}

export const deletePrestasi = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('prestasi')
      .delete()
      .eq('id', parseInt(id))
      .select()

    if (error) throw error
    if (!data.length) {
      return res.status(404).json({ success: false, message: 'Data prestasi tidak ditemukan' })
    }
    res.json({ success: true, message: 'Prestasi berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus prestasi', error: error.message })
  }
}
