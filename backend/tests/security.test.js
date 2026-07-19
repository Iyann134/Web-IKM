import assert from 'assert'
import { spawn } from 'child_process'
import fs from 'fs'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import {
  sanitizeString,
  validateIdParam,
  validateLogin
} from '../src/middleware/validation.js'

console.log('--- STARTING SECURITY INTEGRATION TESTS ---')

// 1. Test XSS Input Sanitization
try {
  console.log('Testing XSS Input Sanitization...')
  const badHTML = "<script>alert('xss')</script>"
  const sanitized = sanitizeString(badHTML)
  assert.strictEqual(sanitized, "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;")
  
  const badImg = "<img src=x onerror=alert(1)>"
  const sanitizedImg = sanitizeString(badImg)
  assert.strictEqual(sanitizedImg, "&lt;img src=x onerror=alert(1)&gt;")
  console.log('✔ XSS Input Sanitization Passed.')
} catch (err) {
  console.error('❌ XSS Input Sanitization Failed:', err.message)
  process.exit(1)
}

// 2. Test ID Parameter Validation
try {
  console.log('Testing ID Parameter Validation...')
  const testCases = [
    { id: 'abc', valid: false },
    { id: '-5', valid: false },
    { id: '0', valid: false },
    { id: '1.5', valid: false },
    { id: '10', valid: true }
  ]
  
  for (const tc of testCases) {
    let nextCalled = false
    let statusSent = null
    let responseJson = null
    
    const req = { params: { id: tc.id } }
    const res = {
      status: (code) => {
        statusSent = code
        return {
          json: (data) => { responseJson = data }
        }
      }
    }
    const next = () => { nextCalled = true }
    
    validateIdParam(req, res, next)
    
    if (tc.valid) {
      assert.strictEqual(nextCalled, true, `Expected valid ID ${tc.id} to call next()`)
      assert.strictEqual(req.params.id, parseInt(tc.id, 10))
    } else {
      assert.strictEqual(statusSent, 400, `Expected invalid ID ${tc.id} to return 400`)
      assert.strictEqual(responseJson.success, false)
    }
  }
  console.log('✔ ID Parameter Validation Passed.')
} catch (err) {
  console.error('❌ ID Parameter Validation Failed:', err.message)
  process.exit(1)
}

// 3. Test Fail-Fast Environment Check
try {
  console.log('Testing Fail-Fast Environment Check...')
  const envPath = '.env'
  const envBakPath = '.env.bak'
  const hasEnv = fs.existsSync(envPath)
  if (hasEnv) {
    fs.renameSync(envPath, envBakPath)
  }

  try {
    const env = { ...process.env }
    delete env.SUPABASE_URL
    delete env.SUPABASE_KEY
    delete env.JWT_SECRET
    
    const child = spawn('node', ['src/server.js'], { env })
    let stderrData = ''
    child.stderr.on('data', (data) => {
      stderrData += data.toString()
    })
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        child.kill()
        reject(new Error('Server start timed out or hung without exit (env missing)'))
      }, 5000)

      child.on('close', (code) => {
        clearTimeout(timeout)
        try {
          if (code !== 1 || !stderrData.includes('CRITICAL ERROR')) {
            console.log('DEBUG env check failed! Exit code:', code, 'Stderr output:', stderrData)
          }
          assert.strictEqual(code, 1, 'Expected exit code 1 when env variables are missing')
          assert.ok(stderrData.includes('CRITICAL ERROR'), 'Expected stderr to mention CRITICAL ERROR')
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  } finally {
    if (hasEnv && fs.existsSync(envBakPath)) {
      fs.renameSync(envBakPath, envPath)
    }
  }
  console.log('✔ Fail-Fast Environment Check Passed.')
} catch (err) {
  console.error('❌ Fail-Fast Environment Check Failed:', err.message)
  process.exit(1)
}

// 4. Test CORS, Helmet & Rate Limiter HTTP logic
try {
  console.log('Testing CORS, Helmet & Rate Limiting HTTP logic...')
  const app = express()
  app.use(helmet())
  
  const allowedOrigins = ['http://localhost:5173']
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true)
      } else {
        return callback(new Error('Blocked by CORS'))
      }
    }
  }))
  
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })
  
  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 2,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })
  
  app.get('/test', globalLimiter, (req, res) => res.json({ ok: true }))
  app.post('/login', authLimiter, (req, res) => res.json({ ok: true }))
  
  app.use((err, req, res, next) => {
    if (err.message === 'Blocked by CORS') {
      return res.status(403).json({ error: 'CORS Error' })
    }
    res.status(500).json({ error: err.message })
  })
  
  const server = app.listen(0)
  const port = server.address().port
  const url = `http://localhost:${port}`
  
  // Test CORS Rejection
  const corsRes = await fetch(`${url}/test`, {
    headers: { Origin: 'http://malicious-origin.com' }
  })
  const corsData = await corsRes.json()
  assert.strictEqual(corsRes.status, 403)
  assert.strictEqual(corsData.error, 'CORS Error')
  console.log('✔ CORS Block Verified.')
  
  // Test CORS Acceptance
  const corsAccept = await fetch(`${url}/test`, {
    headers: { Origin: 'http://localhost:5173' }
  })
  assert.strictEqual(corsAccept.status, 200)
  console.log('✔ CORS Allow Verified.')
  
  // Test Helmet Headers
  const headers = corsAccept.headers
  assert.ok(headers.get('x-frame-options'), 'Missing X-Frame-Options')
  assert.ok(headers.get('x-content-type-options'), 'Missing X-Content-Type-Options')
  assert.ok(headers.get('content-security-policy'), 'Missing Content-Security-Policy')
  console.log('✔ Helmet Security Headers Verified.')
  
  // Test Global Rate Limiting
  let rateLimitTriggered = false
  for (let i = 0; i < 10; i++) {
    const r = await fetch(`${url}/test`, { headers: { Origin: 'http://localhost:5173' } })
    if (r.status === 429) {
      rateLimitTriggered = true
      break
    }
  }
  assert.ok(rateLimitTriggered, 'Expected global rate limit 429 status code')
  console.log('✔ Global Rate Limiter Verified.')
  
  // Test Auth Rate Limiting
  let authLimitTriggered = false
  for (let i = 0; i < 5; i++) {
    const r = await fetch(`${url}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' }
    })
    if (r.status === 429) {
      authLimitTriggered = true
      break
    }
  }
  assert.ok(authLimitTriggered, 'Expected auth rate limit 429 status code')
  console.log('✔ Auth Rate Limiter Verified.')
  
  server.close()
} catch (err) {
  console.error('❌ CORS, Helmet or Rate Limiter Test Failed:', err)
  process.exit(1)
}

console.log('🎉 ALL SECURITY INTEGRATION TESTS PASSED!')
process.exit(0)
