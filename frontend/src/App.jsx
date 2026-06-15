import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tentang from './pages/Tentang'
import Portal from './pages/Portal'
import Pengurus from './pages/Pengurus'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tentang" element={<Tentang />} />
        <Route path="portal" element={<Portal />} />
        <Route path="pengurus" element={<Pengurus />} />
      </Route>
    </Routes>
  )
}

export default App