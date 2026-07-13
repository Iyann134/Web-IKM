import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

// =========================================================================
// ADMIN LAYOUT COMPONENT
// Manages the collapsible sidebar state and wraps admin outlet pages.
// Includes global authentication check.
// =========================================================================

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
    }
  }, [token, navigate])

  if (!token) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-orange-50 overflow-x-hidden">
      
      {/* Collapsible Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area — dynamically adjusts left margin based on sidebar state */}
      <div
        className={`flex-1 min-h-screen w-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-72' : 'ml-0'
        }`}
      >
        <Outlet context={{ isSidebarOpen, setIsSidebarOpen }} />
      </div>

    </div>
  )
}
