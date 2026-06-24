import { supabase } from '../data/supabase.js'

// Simple helper to verify if the bucket exists and create it if possible
const ensureBucketExists = async (bucketName) => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) {
      console.warn('Error listing buckets, continuing assuming bucket exists:', listError.message)
      return
    }

    const exists = buckets.some(b => b.name === bucketName)
    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true
      })
      if (createError) {
        console.warn(`Could not create bucket "${bucketName}". Make sure it is created manually as public in Supabase Console.`, createError.message)
      } else {
        console.log(`Created bucket "${bucketName}" successfully.`)
      }
    }
  } catch (err) {
    console.warn(`Bucket check failed: ${err.message}. Assuming bucket exists.`)
  }
}

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' })
    }

    const file = req.file
    const bucketName = 'uploads'

    // Try to ensure the bucket is created (non-blocking warning if fails)
    await ensureBucketExists(bucketName)

    // Generate a unique file name
    const fileExt = file.originalname.split('.').pop()
    const fileName = `ikm-itera-${Date.now()}-${Math.floor(Math.random() * 100000)}.${fileExt}`

    // Upload buffer to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      })

    if (error) {
      throw error
    }

    // Get Public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Gagal mendapatkan URL publik untuk gambar.')
    }

    res.json({
      success: true,
      message: 'Gambar berhasil diunggah.',
      imageUrl: publicUrlData.publicUrl
    })
  } catch (error) {
    console.error('Upload Error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengunggah gambar ke cloud.',
      error: error.message
    })
  }
}
