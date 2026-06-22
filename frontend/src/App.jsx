import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tentang from './pages/Tentang'
import Portal from './pages/Portal'
import DetailBerita from './pages/DetailBerita'
import Pengurus from './pages/Pengurus'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<Tentang />} />
          <Route path="portal" element={<Portal />} />
          <Route path="portal/:id" element={<DetailBerita />} />
          <Route path="pengurus" element={<Pengurus />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App