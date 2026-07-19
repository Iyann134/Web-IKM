import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

// Load .env file (only needed for local development; Vercel injects env vars automatically)
dotenv.config()

// Verify essential environment variables at startup
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY || !process.env.JWT_SECRET) {
  console.error('CRITICAL ERROR: Missing essential environment variables (SUPABASE_URL, SUPABASE_KEY, or JWT_SECRET).')
  process.exit(1)
}

// Import routes AFTER dotenv.config() so all modules see the loaded env vars
const { default: apiRouter } = await import('./routes/api.js')

const app = express()
app.set('trust proxy', 1) // trust first proxy for serverless environments (like Vercel)
const PORT = process.env.PORT || 5000

// Enable helmet security headers
app.use(helmet())

// Configure CORS with restricted origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000']

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true)
    } else {
      return callback(new Error('Blocked by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json())

// Configure Rate Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 150, // Limit each IP to 150 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi setelah 15 menit.'
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 login attempts per 15 minutes
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login dari IP ini. Silakan coba lagi setelah 15 menit.'
  }
})

// Apply global rate limiter to all API routes
app.use('/api', globalLimiter)

// Apply auth rate limiter specifically to login route
app.use('/api/auth/login', authLimiter)

app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'IKM ITERA backend is running' })
})

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

export default app
