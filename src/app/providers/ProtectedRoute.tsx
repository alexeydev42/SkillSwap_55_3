import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { useAppSelector } from '@/store/hooks'

export interface ProtectedRouteLocationState {
  destination: string
}

export const ProtectedRoute = () => {
  const location = useLocation()
  const session = useAppSelector((state) => state.auth.session)

  if (!session) {
    const destination = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ destination } satisfies ProtectedRouteLocationState}
      />
    )
  }

  return <Outlet />
}
