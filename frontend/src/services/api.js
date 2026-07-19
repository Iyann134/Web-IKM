import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL
})

// Response interceptor to handle authentication/authorization errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Helper to attach authorization header
const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// --- PUBLIC READ CLIENTS ---

export async function fetchPengurus() {
  try {
    const response = await api.get('/pengurus')
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data pengurus.', { cause: error })
  }
}

export async function fetchBerita() {
  try {
    const response = await api.get('/berita')
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data berita.', { cause: error })
  }
}

export async function fetchPrestasi() {
  try {
    const response = await api.get('/prestasi')
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data prestasi.', { cause: error })
  }
}

export async function fetchBeritaById(id) {
  try {
    const response = await api.get(`/berita/${id}`)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail berita.', { cause: error })
  }
}

// --- ADMIN AUTH ---

export async function loginAdmin(username, password) {
  try {
    const response = await api.post('/auth/login', { username, password })
    return response.data // Contains token, admin info
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login gagal. Periksa kembali username dan password Anda.', { cause: error })
  }
}

// --- ADMIN UPLOAD ---

export async function uploadImage(token, file) {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.imageUrl
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengunggah gambar.', { cause: error })
  }
}


// --- ADMIN CRUD CLIENTS ---

// Pengurus CRUD
export async function createPengurus(token, data) {
  try {
    const response = await api.post('/pengurus', data, authConfig(token))
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menambahkan pengurus.', { cause: error })
  }
}

export async function updatePengurus(token, id, data) {
  try {
    const response = await api.put(`/pengurus/${id}`, data, authConfig(token))
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal memperbarui pengurus.', { cause: error })
  }
}

export async function deletePengurus(token, id) {
  try {
    const response = await api.delete(`/pengurus/${id}`, authConfig(token))
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus pengurus.', { cause: error })
  }
}

// Berita CRUD
export async function createBerita(token, data) {
  try {
    const response = await api.post('/berita', data, authConfig(token))
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal membuat berita.', { cause: error })
  }
}

export async function updateBerita(token, id, data) {
  try {
    const response = await api.put(`/berita/${id}`, data, authConfig(token))
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal memperbarui berita.', { cause: error })
  }
}

export async function deleteBerita(token, id) {
  try {
    const response = await api.delete(`/berita/${id}`, authConfig(token))
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus berita.', { cause: error })
  }
}

// Prestasi CRUD
export async function createPrestasi(token, data) {
  try {
    const response = await api.post('/prestasi', data, authConfig(token))
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menambahkan prestasi.', { cause: error })
  }
}

export async function updatePrestasi(token, id, data) {
  try {
    const response = await api.put(`/prestasi/${id}`, data, authConfig(token))
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal memperbarui prestasi.', { cause: error })
  }
}

export async function deletePrestasi(token, id) {
  try {
    const response = await api.delete(`/prestasi/${id}`, authConfig(token))
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus prestasi.', { cause: error })
  }
}
