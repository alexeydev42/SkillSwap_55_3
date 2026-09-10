import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import type { AuthSession } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'

import {
  ProtectedRoute,
  type ProtectedRouteLocationState,
} from './ProtectedRoute'

const createTestStore = (session: AuthSession | null) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session,
        status: 'idle' as const,
        error: null,
      },
    },
  })

const LoginStateProbe = () => {
  const location = useLocation()
  const state = location.state as ProtectedRouteLocationState | null

  return (
    <>
      <h1>Страница входа</h1>
      <span>{state?.destination}</span>
    </>
  )
}

const renderRoutes = (
  initialEntry: string,
  session: AuthSession | null,
) => {
  const testStore = createTestStore(session)

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<LoginStateProbe />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<h1>Личный кабинет</h1>} />
            <Route path="/favorites" element={<h1>Избранное</h1>} />
          </Route>

          <Route
            path="/skill/:userId"
            element={<h1>Публичная страница навыка</h1>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('перенаправляет гостя на login и сохраняет destination', () => {
    renderRoutes('/profile?tab=personal#content', null)

    expect(
      screen.getByRole('heading', { name: 'Страница входа' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('/profile?tab=personal#content'),
    ).toBeInTheDocument()
  })

  it('показывает защищённую страницу авторизованному пользователю', () => {
    renderRoutes('/profile', { userId: 'local-user-id' })

    expect(
      screen.getByRole('heading', { name: 'Личный кабинет' }),
    ).toBeInTheDocument()
  })

  it('оставляет публичную SkillPage доступной для гостя', () => {
    renderRoutes('/skill/mock-user-id', null)

    expect(
      screen.getByRole('heading', { name: 'Публичная страница навыка' }),
    ).toBeInTheDocument()
  })
})
