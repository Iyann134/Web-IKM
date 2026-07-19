import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// =========================================================================
// SCROLL TO TOP COMPONENT
// Resets window scroll position to top (0,0) on page transitions.
// =========================================================================
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
