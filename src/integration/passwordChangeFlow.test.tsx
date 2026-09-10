import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount } from '@/shared/types'
import type { AppDispatch } from '@/store'
import authReducer from '@/store/slices/authSlice'
import { logout } from '@/store/thunks/authThunks'
import { login } from '@/store/thunks/login'

import { ChangePasswordModal } from '@/widgets/ChangePasswordModal/ChangePasswordModal'

const account: AuthAccount = {
  userId: 'local-user-id',
  email: 'user@example.com',
  password: 'OldPassword1!',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        account,
        session: { userId: account.userId },
        status: 'succeeded' as const,
        error: null,
      },
    },
  })

const fillPasswordFields = async (user: ReturnType<typeof userEvent.setup>, password: string) => {
  await user.type(screen.getByPlaceholderText('Придумайте надёжный пароль'), password)
  await user.type(screen.getByPlaceholderText('Повторите пароль'), password)
}

describe('Интеграция: смена пароля → logout → старый не подходит → новый работает', () => {
  beforeEach(() => {
    window.localStorage.clear()
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('после смены пароля и выхода старый пароль не подходит, а новый работает', async () => {
    const user = userEvent.setup()
    const testStore = createTestStore()
    const newPassword = 'NewPassword1!'

    render(
      <Provider store={testStore}>
        <ChangePasswordModal onClose={vi.fn()} />
      </Provider>,
    )

    await fillPasswordFields(user, newPassword)
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)?.password).toBe(newPassword)

    // Пользователь выходит из аккаунта.
    logout()(testStore.dispatch as unknown as AppDispatch)

    expect(testStore.getState().auth.session).toBeNull()

    // Старый пароль больше не подходит.
    const oldPasswordResult = login({
      email: account.email,
      password: account.password,
    })(testStore.dispatch as unknown as AppDispatch)

    expect(oldPasswordResult).toBe(false)
    expect(testStore.getState().auth.session).toBeNull()

    // Новый пароль работает.
    const newPasswordResult = login({
      email: account.email,
      password: newPassword,
    })(testStore.dispatch as unknown as AppDispatch)

    expect(newPasswordResult).toBe(true)
    expect(testStore.getState().auth.session).toEqual({ userId: account.userId })
  })
})
