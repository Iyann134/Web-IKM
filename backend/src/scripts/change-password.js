import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function run() {
  const newPassword = process.argv[2]
  if (!newPassword) {
    console.error("Error: Harap sertakan password baru.")
    console.log("Cara penggunaan: node src/scripts/change-password.js <password_baru>")
    process.exit(1)
  }

  const username = 'admin_ikm'
  const hashedPassword = bcrypt.hashSync(newPassword, 10)

  const { data, error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('username', username)
    .select('username')

  if (error) {
    console.error("Gagal mengganti password:", error.message)
  } else if (data.length === 0) {
    console.error(`Gagal: Pengguna dengan username '${username}' tidak ditemukan.`)
  } else {
    console.log("==========================================")
    console.log("  BERHASIL MENGGANTI PASSWORD ADMIN IKM  ")
    console.log("==========================================")
    console.log(`Username     : ${username}`)
    console.log(`Password Baru: ${newPassword}`)
  }
}

run()
