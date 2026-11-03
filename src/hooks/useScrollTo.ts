import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Scrolls to a section on the home page, navigating there first from other routes. */
export function useScrollTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return useCallback(
    (id: string) => {
      if (pathname !== '/') {
        navigate(id === 'home' ? '/' : `/#${id}`)
        return
      }
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      history.replaceState(null, '', id === 'home' ? '/' : `#${id}`)
      // Move focus for keyboard and screen-reader users without a second scroll jump.
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    },
    [navigate, pathname],
  )
}
