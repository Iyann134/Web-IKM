import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tentang from './pages/Tentang'
import LatarBelakang from './pages/LatarBelakang'
import Berita from './pages/Berita'
import Prestasi from './pages/Prestasi'
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
          <Route path="tentang/latar-belakang" element={<LatarBelakang />} />
          <Route path="informasi">
            <Route path="berita" element={<Berita />} />
            <Route path="berita/:id" element={<DetailBerita />} />
            <Route path="prestasi" element={<Prestasi />} />
          </Route>
          <Route path="pengurus" element={<Pengurus />} />
          <Route path="portal" element={<Navigate to="/informasi/berita" replace />} />
          <Route path="portal/:id" element={<Navigate to="/informasi/berita/:id" replace />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App