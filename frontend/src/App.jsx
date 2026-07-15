import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

import LatarBelakang from './pages/LatarBelakang'
import VisiMisi from './pages/VisiMisi'
import MaknaLogo from './pages/MaknaLogo'
import Berita from './pages/Berita'
import Prestasi from './pages/Prestasi'
import DetailBerita from './pages/DetailBerita'
import Pengurus from './pages/Pengurus'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminBerita from './pages/AdminBerita'
import AdminPencapaian from './pages/AdminPencapaian'
import AdminPengurus from './pages/AdminPengurus'
import AdminLayout from './components/AdminLayout'
import Developer from './pages/Developer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<Navigate to="/tentang/latar-belakang" replace />} />
          <Route path="tentang/latar-belakang" element={<LatarBelakang />} />
          <Route path="tentang/visi-misi" element={<VisiMisi />} />
          <Route path="tentang/makna-logo" element={<MaknaLogo />} />
          <Route path="informasi">
            <Route path="berita" element={<Berita />} />
            <Route path="berita/:id" element={<DetailBerita />} />
            <Route path="prestasi" element={<Prestasi />} />
          </Route>
          <Route path="berita/:id" element={<DetailBerita />} />
          <Route path="pengurus" element={<Pengurus />} />
          <Route path="developer" element={<Developer />} />
          <Route path="portal" element={<Navigate to="/informasi/berita" replace />} />
          <Route path="portal/:id" element={<Navigate to="/informasi/berita/:id" replace />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        
        {/* Admin layout wrappers */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Navigate to="/admin/berita" replace />} />
          <Route path="berita" element={<AdminBerita />} />
          <Route path="prestasi" element={<AdminPencapaian />} />
          <Route path="pengurus" element={<AdminPengurus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App