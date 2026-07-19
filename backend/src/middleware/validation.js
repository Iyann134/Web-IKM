export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

export const validateIdParam = (req, res, next) => {
  const { id } = req.params
  const parsedId = parseInt(id, 10)
  if (!id || isNaN(parsedId) || parsedId <= 0 || String(parsedId) !== String(id)) {
    return res.status(400).json({ success: false, message: 'ID tidak valid. ID harus berupa angka bulat positif.' })
  }
  req.params.id = parsedId
  next()
}

export const validateLogin = (req, res, next) => {
  const { username, password } = req.body
  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ success: false, message: 'Username wajib diisi.' })
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ success: false, message: 'Password wajib diisi.' })
  }
  req.body.username = username.trim()
  req.body.password = password.trim()
  next()
}

export const validatePengurus = (req, res, next) => {
  const { role, name, description, periode, nim_nip, prodi, departemen } = req.body

  if (!role || typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ success: false, message: 'Jabatan (role) wajib diisi.' })
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Nama wajib diisi.' })
  }

  req.body.role = sanitizeString(role)
  req.body.name = sanitizeString(name)
  req.body.description = description ? sanitizeString(description) : ''
  req.body.periode = periode ? sanitizeString(periode) : '2025/2026'
  req.body.nim_nip = nim_nip ? sanitizeString(nim_nip) : '-'
  req.body.prodi = prodi ? sanitizeString(prodi) : 'Teknik Material'
  req.body.departemen = departemen ? sanitizeString(departemen) : '-'

  next()
}

export const validateBerita = (req, res, next) => {
  const { title, date, content, image } = req.body

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Judul berita wajib diisi.' })
  }
  if (!date || typeof date !== 'string' || !date.trim()) {
    return res.status(400).json({ success: false, message: 'Tanggal berita wajib diisi.' })
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Konten berita wajib diisi.' })
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return res.status(400).json({ success: false, message: 'Format tanggal harus YYYY-MM-DD.' })
  }

  if (image && typeof image === 'string' && image.trim()) {
    const imageTrimmed = image.trim()
    if (!imageTrimmed.startsWith('http://') && !imageTrimmed.startsWith('https://')) {
      return res.status(400).json({ success: false, message: 'URL gambar tidak valid.' })
    }
    req.body.image = imageTrimmed
  } else {
    req.body.image = ''
  }

  req.body.title = sanitizeString(title)
  req.body.date = date.trim()
  req.body.content = sanitizeString(content)

  next()
}

export const validatePrestasi = (req, res, next) => {
  const { title, year, description } = req.body

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Judul prestasi wajib diisi.' })
  }
  if (year === undefined || year === null || isNaN(parseInt(year, 10))) {
    return res.status(400).json({ success: false, message: 'Tahun wajib diisi dengan angka.' })
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ success: false, message: 'Deskripsi prestasi wajib diisi.' })
  }

  const parsedYear = parseInt(year, 10)
  if (parsedYear < 1900 || parsedYear > 2100) {
    return res.status(400).json({ success: false, message: 'Tahun harus berada di rentang 1900 - 2100.' })
  }

  req.body.title = sanitizeString(title)
  req.body.year = parsedYear
  req.body.description = sanitizeString(description)

  next()
}
