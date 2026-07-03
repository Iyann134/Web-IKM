import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing in environment configuration.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read the JSON file from the frontend directory
const jsonPath = path.resolve('../frontend/src/data/bph_ikm_2026_2027.json')
const rawData = fs.readFileSync(jsonPath, 'utf8')
const data = JSON.parse(rawData)

const rows = []

// 1. Dosen Pembina
if (data.dosen_pembina) {
  rows.push({
    name: data.dosen_pembina.nama,
    role: 'Dosen Pembina',
    nim_nip: data.dosen_pembina.nip,
    prodi: data.dosen_pembina.prodi,
    periode: '2026/2027',
    departemen: '-',
    divisi: '-',
    is_staff: false
  })
}

// 2. Pimpinan Puncak (Datuak)
if (data.pimpinan_puncak) {
  rows.push({
    name: data.pimpinan_puncak.nama,
    role: 'Datuak',
    nim_nip: data.pimpinan_puncak.nim,
    prodi: data.pimpinan_puncak.prodi,
    periode: '2026/2027',
    departemen: '-',
    divisi: '-',
    is_staff: false
  })
}

// 3. Penasihat
if (data.penasihat && Array.isArray(data.penasihat)) {
  data.penasihat.forEach(p => {
    rows.push({
      name: p.nama,
      role: p.jabatan,
      nim_nip: p.nim,
      prodi: p.prodi,
      periode: '2026/2027',
      departemen: '-',
      divisi: '-',
      is_staff: false
    })
  })
}

// 4. Pengurus Inti - Kesekretariatan
if (data.pengurus_inti && data.pengurus_inti.kesekretariatan) {
  const kesek = data.pengurus_inti.kesekretariatan
  if (kesek.kepala) {
    rows.push({
      name: kesek.kepala.nama,
      role: 'Kepala Departemen Kesekretariatan',
      nim_nip: kesek.kepala.nim,
      prodi: kesek.kepala.prodi,
      periode: '2026/2027',
      departemen: 'Kesekretariatan',
      divisi: '-',
      is_staff: false
    })
  }
  if (kesek.staff_popup_data && Array.isArray(kesek.staff_popup_data)) {
    kesek.staff_popup_data.forEach(s => {
      rows.push({
        name: s.nama,
        role: s.jabatan || 'Staff',
        nim_nip: s.nim,
        prodi: s.prodi,
        periode: '2026/2027',
        departemen: 'Kesekretariatan',
        divisi: '-',
        is_staff: true
      })
    })
  }
}

// 5. Pengurus Inti - Keuangan
if (data.pengurus_inti && data.pengurus_inti.keuangan) {
  const keu = data.pengurus_inti.keuangan
  if (keu.kepala) {
    rows.push({
      name: keu.kepala.nama,
      role: 'Kepala Departemen Keuangan',
      nim_nip: keu.kepala.nim,
      prodi: keu.kepala.prodi,
      periode: '2026/2027',
      departemen: 'Keuangan',
      divisi: '-',
      is_staff: false
    })
  }
  if (keu.staff_popup_data && Array.isArray(keu.staff_popup_data)) {
    keu.staff_popup_data.forEach(s => {
      rows.push({
        name: s.nama,
        role: s.jabatan || 'Staff',
        nim_nip: s.nim,
        prodi: s.prodi,
        periode: '2026/2027',
        departemen: 'Keuangan',
        divisi: '-',
        is_staff: true
      })
    })
  }
}

// 6. Jajaran Departemen
if (data.jajaran_departemen && Array.isArray(data.jajaran_departemen)) {
  data.jajaran_departemen.forEach(dept => {
    // Kepala Departemen
    if (dept.kepala_departemen) {
      rows.push({
        name: dept.kepala_departemen.nama,
        role: 'Kepala Departemen',
        nim_nip: dept.kepala_departemen.nim,
        prodi: dept.kepala_departemen.prodi,
        periode: '2026/2027',
        departemen: dept.nama_departemen,
        divisi: '-',
        is_staff: false
      })
    }
    // Sekretaris Departemen
    if (dept.sekretaris_departemen) {
      rows.push({
        name: dept.sekretaris_departemen.nama,
        role: 'Sekretaris Departemen',
        nim_nip: dept.sekretaris_departemen.nim,
        prodi: dept.sekretaris_departemen.prodi,
        periode: '2026/2027',
        departemen: dept.nama_departemen,
        divisi: '-',
        is_staff: false
      })
    }
    // Divisi
    if (dept.divisi && Array.isArray(dept.divisi)) {
      dept.divisi.forEach(div => {
        // Kepala Divisi
        if (div.kepala_divisi) {
          rows.push({
            name: div.kepala_divisi.nama,
            role: 'Kepala Divisi',
            nim_nip: div.kepala_divisi.nim,
            prodi: div.kepala_divisi.prodi,
            periode: '2026/2027',
            departemen: dept.nama_departemen,
            divisi: div.nama_divisi,
            is_staff: false
          })
        }
        // Staff Divisi
        if (div.staff_popup_data && Array.isArray(div.staff_popup_data)) {
          div.staff_popup_data.forEach(s => {
            rows.push({
              name: s.nama,
              role: s.jabatan || 'Staff',
              nim_nip: s.nim,
              prodi: s.prodi,
              periode: '2026/2027',
              departemen: dept.nama_departemen,
              divisi: div.nama_divisi,
              is_staff: true
            })
          })
        }
      })
    }
  })
}

// Perform insert
const run = async () => {
  console.log(`Inserting ${rows.length} members into Supabase...`)
  const { data: insertedData, error } = await supabase
    .from('pengurus')
    .insert(rows)
    .select()

  if (error) {
    console.error('Error inserting data:', error)
  } else {
    console.log(`Successfully inserted ${insertedData.length} records!`)
  }
}

run()
