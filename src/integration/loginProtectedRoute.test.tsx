import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { ROUTES, STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import { ProtectedRoute } from '@/app/providers/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'

const account: AuthAccount = {
  userId: 'local-user-id',
  email: 'user@example.com',
  password: 'Password1!',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session: null,
        status: 'idle' as const,
        error: null,
      },
    },
  })

describe('Интеграция: вход и защищённый маршрут', () => {
  beforeEach(() => {
    window.localStorage.clear()
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
  })

  it('перенаправляет гостя с защищённого маршрута на login и возвращает его обратно после входа', async () => {
    const user = userEvent.setup()
    const testStore = createTestStore()

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.PROFILE} element={<h1>Личный кабинет</h1>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    // Реальный ProtectedRoute перенаправил гостя на реальный LoginPage.
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Личный кабинет' })).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), account.email)
    await user.type(screen.getByLabelText('Пароль'), account.password)
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    // Реальный LoginPage прочитал destination, сохранённый ProtectedRoute,
    // и вернул пользователя обратно на исходную защищённую страницу.
    expect(screen.getByRole('heading', { name: 'Личный кабинет' })).toBeInTheDocument()
    expect(testStore.getState().auth.session).toEqual({ userId: account.userId })
  })
})
