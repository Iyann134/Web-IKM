const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export async function fetchPengurus() {
  const response = await fetch(`${API_BASE_URL}/pengurus`)
  if (!response.ok) {
    throw new Error('Unable to fetch pengurus data')
  }
  const result = await response.json()
  return result.data
}

export async function fetchBerita() {
  const response = await fetch(`${API_BASE_URL}/berita`)
  if (!response.ok) {
    throw new Error('Unable to fetch berita data')
  }
  const result = await response.json()
  return result.data
}

export async function fetchPrestasi() {
  const response = await fetch(`${API_BASE_URL}/prestasi`)
  if (!response.ok) {
    throw new Error('Unable to fetch prestasi data')
  }
  const result = await response.json()
  return result.data
}
