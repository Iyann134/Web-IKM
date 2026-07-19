/* eslint-disable no-undef */
import assert from 'assert'

console.log('--- STARTING FRONTEND INTERCEPTOR LOGIC TEST ---')

// Mock environment
const mockLocalStorage = {
  store: { adminToken: 'some-token' },
  removeItem(key) {
    delete this.store[key]
  },
  getItem(key) {
    return this.store[key]
  }
}

global.localStorage = mockLocalStorage
global.window = {
  location: { href: '' }
}

// Interceptor function logic to test
const handleResponseError = (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }
  return Promise.reject(error)
}

try {
  // Test case 1: 401 Error
  console.log('Testing 401 Unauthorized Eviction...')
  localStorage.store['adminToken'] = 'token-401'
  window.location.href = ''
  
  const error401 = { response: { status: 401 } }
  await handleResponseError(error401).catch(() => {})
  
  assert.strictEqual(localStorage.getItem('adminToken'), undefined, 'Token should be cleared')
  assert.strictEqual(window.location.href, '/admin/login', 'Should redirect to login')
  console.log('✔ 401 Eviction Verified.')
  
  // Test case 2: 403 Error
  console.log('Testing 403 Forbidden Eviction...')
  localStorage.store['adminToken'] = 'token-403'
  window.location.href = ''
  
  const error403 = { response: { status: 403 } }
  await handleResponseError(error403).catch(() => {})
  
  assert.strictEqual(localStorage.getItem('adminToken'), undefined, 'Token should be cleared')
  assert.strictEqual(window.location.href, '/admin/login', 'Should redirect to login')
  console.log('✔ 403 Eviction Verified.')
  
  // Test case 3: 500 Error (should not evict or redirect)
  console.log('Testing 500 Internal Server Error (Should Not Evict)...')
  localStorage.store['adminToken'] = 'token-500'
  window.location.href = ''
  
  const error500 = { response: { status: 500 } }
  await handleResponseError(error500).catch(() => {})
  
  assert.strictEqual(localStorage.getItem('adminToken'), 'token-500', 'Token should not be cleared')
  assert.strictEqual(window.location.href, '', 'Should not redirect')
  console.log('✔ 500 Non-Eviction Verified.')
  
  console.log('🎉 FRONTEND INTERCEPTOR LOGIC TEST PASSED!')
  process.exit(0)
} catch (err) {
  console.error('❌ Frontend Interceptor Logic Test Failed:', err.message)
  process.exit(1)
}
