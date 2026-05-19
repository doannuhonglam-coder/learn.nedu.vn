import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analytics } from './index'

/**
 * Mount inside the router tree to fire `page_view` on every route change.
 * Render `null` — chỉ là một subscriber.
 *
 * Với React Router 7 data router (createBrowserRouter), mount component
 * này trong element của route cha — `useLocation()` hoạt động bên trong
 * route tree.
 */
export const RouteTracker: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    analytics.pageView(location.pathname + location.search, document.title)
  }, [location.pathname, location.search])

  return null
}
